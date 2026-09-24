-- LISTA DI CASA — MIGRATION V5 : CATÉGORIES REPLIABLES + PERSONNALISÉES
-- À exécuter UNE FOIS dans Supabase > SQL Editor avant de publier la V5.
-- Cette migration conserve les courses, l'historique et les catégories V4 existantes.

-- 1) Table partagée des catégories de courses.
create table if not exists public.shopping_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  category_key text not null default ('custom_' || replace(gen_random_uuid()::text, '-', '')),
  name_fr text not null check (char_length(name_fr) between 1 and 40),
  name_en text not null check (char_length(name_en) between 1 and 40),
  emoji text not null default '📦' check (char_length(emoji) between 1 and 16),
  sort_order integer not null default 100,
  is_default boolean not null default false,
  is_fallback boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, category_key)
);

create index if not exists idx_shopping_categories_household
  on public.shopping_categories(household_id, sort_order);

-- 2) Ajoute les 9 catégories de base à toutes les maisons déjà existantes.
insert into public.shopping_categories
  (household_id, category_key, name_fr, name_en, emoji, sort_order, is_default, is_fallback)
select
  h.id,
  v.category_key,
  v.name_fr,
  v.name_en,
  v.emoji,
  v.sort_order,
  true,
  v.is_fallback
from public.households h
cross join (values
  ('fruit_veg', 'Fruits & légumes', 'Fruit & Veg', '🥬', 10, false),
  ('bakery', 'Boulangerie', 'Bakery', '🥖', 20, false),
  ('fresh', 'Produits frais', 'Chilled & Dairy', '🥛', 30, false),
  ('meat_fish', 'Viande & poisson', 'Meat & Fish', '🥩', 40, false),
  ('pantry', 'Épicerie', 'Pantry', '🥫', 50, false),
  ('drinks', 'Boissons', 'Drinks', '🥤', 60, false),
  ('frozen', 'Surgelés', 'Frozen', '❄️', 70, false),
  ('home', 'Maison', 'Household', '🧽', 80, false),
  ('other', 'Autres', 'Other', '📦', 90, true)
) as v(category_key, name_fr, name_en, emoji, sort_order, is_fallback)
on conflict (household_id, category_key) do nothing;

-- 3) Sécurité : seules les personnes de la même maison voient/modifient les catégories.
alter table public.shopping_categories enable row level security;

drop policy if exists "shopping_categories_select_member" on public.shopping_categories;
create policy "shopping_categories_select_member"
on public.shopping_categories for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "shopping_categories_insert_member" on public.shopping_categories;
create policy "shopping_categories_insert_member"
on public.shopping_categories for insert to authenticated
with check (
  public.is_household_member(household_id)
  and (created_by is null or created_by = auth.uid())
);

drop policy if exists "shopping_categories_update_member" on public.shopping_categories;
create policy "shopping_categories_update_member"
on public.shopping_categories for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "shopping_categories_delete_member" on public.shopping_categories;
create policy "shopping_categories_delete_member"
on public.shopping_categories for delete to authenticated
using (public.is_household_member(household_id));

grant select, insert, update, delete on public.shopping_categories to authenticated;

-- 4) Une modification de catégorie réveille aussi l'autre téléphone.
drop trigger if exists shopping_categories_emit_sync on public.shopping_categories;
create trigger shopping_categories_emit_sync
after insert or update or delete on public.shopping_categories
for each row execute procedure public.emit_household_sync_event();

-- 5) Suppression sécurisée : les articles/historiques de la catégorie sont déplacés
-- vers "Autres" avant la suppression. "Autres" elle-même est protégée.
create or replace function public.delete_shopping_category(category_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cat public.shopping_categories%rowtype;
  fallback_key text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into cat
  from public.shopping_categories
  where id = category_id;

  if not found then
    raise exception 'Category not found';
  end if;

  if not public.is_household_member(cat.household_id) then
    raise exception 'Not allowed';
  end if;

  if cat.is_fallback then
    raise exception 'Fallback category cannot be deleted';
  end if;

  select c.category_key into fallback_key
  from public.shopping_categories c
  where c.household_id = cat.household_id
    and c.is_fallback = true
  order by c.sort_order
  limit 1;

  fallback_key := coalesce(fallback_key, 'other');

  update public.shopping_items
  set category = fallback_key,
      updated_at = now()
  where household_id = cat.household_id
    and category = cat.category_key;

  update public.shopping_history
  set last_category = fallback_key
  where household_id = cat.household_id
    and last_category = cat.category_key;

  delete from public.shopping_categories
  where id = cat.id;
end;
$$;

revoke all on function public.delete_shopping_category(uuid) from public;
grant execute on function public.delete_shopping_category(uuid) to authenticated;

-- 6) Les nouvelles maisons reçoivent automatiquement les catégories de base.
create or replace function public.create_household(household_name text default 'Notre maison')
returns table (id uuid, name text, join_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  new_code text;
  clean_name text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.household_members where user_id = auth.uid()) then
    raise exception 'User already belongs to a household';
  end if;

  clean_name := coalesce(nullif(trim(household_name), ''), 'Notre maison');

  loop
    new_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (select 1 from public.households h where h.join_code = new_code);
  end loop;

  insert into public.households (name, join_code, created_by)
  values (clean_name, new_code, auth.uid())
  returning households.id into new_id;

  insert into public.household_members (household_id, user_id)
  values (new_id, auth.uid());

  insert into public.shopping_categories
    (household_id, category_key, name_fr, name_en, emoji, sort_order, is_default, is_fallback)
  values
    (new_id, 'fruit_veg', 'Fruits & légumes', 'Fruit & Veg', '🥬', 10, true, false),
    (new_id, 'bakery', 'Boulangerie', 'Bakery', '🥖', 20, true, false),
    (new_id, 'fresh', 'Produits frais', 'Chilled & Dairy', '🥛', 30, true, false),
    (new_id, 'meat_fish', 'Viande & poisson', 'Meat & Fish', '🥩', 40, true, false),
    (new_id, 'pantry', 'Épicerie', 'Pantry', '🥫', 50, true, false),
    (new_id, 'drinks', 'Boissons', 'Drinks', '🥤', 60, true, false),
    (new_id, 'frozen', 'Surgelés', 'Frozen', '❄️', 70, true, false),
    (new_id, 'home', 'Maison', 'Household', '🧽', 80, true, false),
    (new_id, 'other', 'Autres', 'Other', '📦', 90, true, true)
  on conflict (household_id, category_key) do nothing;

  return query
  select h.id, h.name, h.join_code
  from public.households h
  where h.id = new_id;
end;
$$;

grant execute on function public.create_household(text) to authenticated;

-- LISTA DI CASA — MIGRATION V3
-- À exécuter UNE FOIS dans Supabase > SQL Editor avant de publier le nouveau code.
-- Cette migration conserve toutes les données existantes.

create extension if not exists unaccent;

-- 1) Nouvelles options sur les articles de courses.
alter table public.shopping_items
  add column if not exists is_urgent boolean not null default false;

alter table public.shopping_items
  add column if not exists saved_for_later boolean not null default false;

-- 2) Mémoire des articles déjà utilisés, commune à toute la maison.
create table if not exists public.shopping_history (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  normalized_name text not null,
  display_name text not null check (char_length(display_name) between 1 and 100),
  last_quantity text check (last_quantity is null or char_length(last_quantity) <= 20),
  last_urgent boolean not null default false,
  use_count integer not null default 1 check (use_count >= 1),
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (household_id, normalized_name)
);

create index if not exists idx_shopping_history_household
  on public.shopping_history(household_id, last_used_at desc);

-- 3) Sécurité RLS : seuls les membres de la maison peuvent lire/écrire l'historique.
alter table public.shopping_history enable row level security;

drop policy if exists "shopping_history_select_member" on public.shopping_history;
create policy "shopping_history_select_member"
on public.shopping_history for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "shopping_history_insert_member" on public.shopping_history;
create policy "shopping_history_insert_member"
on public.shopping_history for insert to authenticated
with check (public.is_household_member(household_id));

drop policy if exists "shopping_history_update_member" on public.shopping_history;
create policy "shopping_history_update_member"
on public.shopping_history for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "shopping_history_delete_member" on public.shopping_history;
create policy "shopping_history_delete_member"
on public.shopping_history for delete to authenticated
using (public.is_household_member(household_id));

grant select, insert, update, delete on public.shopping_history to authenticated;

-- 4) Synchronisation en temps réel lorsque l'historique change.
drop trigger if exists shopping_history_emit_sync on public.shopping_history;
create trigger shopping_history_emit_sync
after insert or update or delete on public.shopping_history
for each row execute procedure public.emit_household_sync_event();

-- 5) Pré-remplit la mémoire avec les articles déjà présents dans vos listes.
insert into public.shopping_history (
  household_id,
  normalized_name,
  display_name,
  last_quantity,
  last_urgent,
  use_count,
  last_used_at
)
select distinct on (si.household_id, lower(unaccent(trim(regexp_replace(si.name, '\s+', ' ', 'g')))))
  si.household_id,
  lower(unaccent(trim(regexp_replace(si.name, '\s+', ' ', 'g')))) as normalized_name,
  si.name,
  si.quantity,
  coalesce(si.is_urgent, false),
  1,
  coalesce(si.updated_at, si.created_at)
from public.shopping_items si
where trim(si.name) <> ''
order by
  si.household_id,
  lower(unaccent(trim(regexp_replace(si.name, '\s+', ' ', 'g')))),
  coalesce(si.updated_at, si.created_at) desc
on conflict (household_id, normalized_name) do update set
  display_name = excluded.display_name,
  last_quantity = excluded.last_quantity,
  last_urgent = excluded.last_urgent,
  last_used_at = greatest(public.shopping_history.last_used_at, excluded.last_used_at);

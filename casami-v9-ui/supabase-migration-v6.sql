-- LISTA DI CASA — MIGRATION V6 : ACHATS MAISON
-- À exécuter UNE FOIS dans Supabase > SQL Editor avant de publier la V6.
-- Cette migration conserve toutes les données existantes.

-- 1) Liste séparée des achats ponctuels pour la maison.
create table if not exists public.home_purchases (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  assignee uuid references auth.users(id) on delete set null,
  is_urgent boolean not null default false,
  estimated_price numeric(10,2) check (estimated_price is null or estimated_price >= 0),
  note text check (note is null or char_length(note) <= 500),
  url text check (url is null or char_length(url) <= 1000),
  status text not null default 'todo' check (status in ('todo', 'later', 'bought')),
  created_by uuid not null references auth.users(id) on delete cascade,
  bought_by uuid references auth.users(id) on delete set null,
  bought_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_home_purchases_household
  on public.home_purchases(household_id, status, created_at desc);

-- 2) Sécurité : seuls les membres de la maison peuvent voir et modifier ces achats.
alter table public.home_purchases enable row level security;

drop policy if exists "home_purchases_select_member" on public.home_purchases;
create policy "home_purchases_select_member"
on public.home_purchases for select to authenticated
using (public.is_household_member(household_id));

drop policy if exists "home_purchases_insert_member" on public.home_purchases;
create policy "home_purchases_insert_member"
on public.home_purchases for insert to authenticated
with check (
  public.is_household_member(household_id)
  and created_by = auth.uid()
  and (assignee is null or public.shares_household(assignee))
  and (bought_by is null or public.shares_household(bought_by))
);

drop policy if exists "home_purchases_update_member" on public.home_purchases;
create policy "home_purchases_update_member"
on public.home_purchases for update to authenticated
using (public.is_household_member(household_id))
with check (
  public.is_household_member(household_id)
  and (assignee is null or public.shares_household(assignee))
  and (bought_by is null or public.shares_household(bought_by))
);

drop policy if exists "home_purchases_delete_member" on public.home_purchases;
create policy "home_purchases_delete_member"
on public.home_purchases for delete to authenticated
using (public.is_household_member(household_id));

grant select, insert, update, delete on public.home_purchases to authenticated;

-- 3) Chaque modification réveille l'autre téléphone via le journal de synchro existant.
drop trigger if exists home_purchases_emit_sync on public.home_purchases;
create trigger home_purchases_emit_sync
after insert or update or delete on public.home_purchases
for each row execute procedure public.emit_household_sync_event();

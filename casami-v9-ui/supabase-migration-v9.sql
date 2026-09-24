-- CASAMI — MIGRATION V9
-- Profil personnalisable + phrase d'accueil commune
-- À exécuter UNE SEULE FOIS dans Supabase > SQL Editor avant de publier la V9.
-- Conserve toutes les données existantes.

-- 1) Personnalisation individuelle du profil.
alter table public.profiles
  add column if not exists profile_icon text not null default 'initial'
  check (char_length(profile_icon) between 1 and 24);

alter table public.profiles
  add column if not exists profile_color text not null default '#8A5CFF'
  check (profile_color ~ '^#[0-9A-Fa-f]{6}$');

-- 2) Phrase commune de la maison : les deux membres voient la même valeur.
alter table public.households
  add column if not exists shared_quote text not null default 'Les petites choses font les grands foyers.'
  check (char_length(shared_quote) between 1 and 100);

-- 3) Tous les membres de la maison peuvent modifier la phrase commune.
drop policy if exists "households_update_member" on public.households;
create policy "households_update_member"
on public.households for update to authenticated
using (public.is_household_member(id))
with check (public.is_household_member(id));

grant update (shared_quote) on public.households to authenticated;

-- 4) Réveil temps réel de l'autre appareil quand la phrase change.
create or replace function public.emit_household_self_sync_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.sync_events (household_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists households_emit_sync on public.households;
create trigger households_emit_sync
after update on public.households
for each row execute procedure public.emit_household_self_sync_event();

-- 5) Réveil temps réel des maisons partagées quand un membre change son profil.
create or replace function public.emit_profile_sync_events()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.sync_events (household_id)
  select hm.household_id
  from public.household_members hm
  where hm.user_id = new.id;
  return new;
end;
$$;

drop trigger if exists profiles_emit_sync on public.profiles;
create trigger profiles_emit_sync
after update of profile_icon, profile_color, display_name on public.profiles
for each row execute procedure public.emit_profile_sync_events();

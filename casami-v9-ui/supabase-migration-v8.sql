-- CASAMI — MIGRATION V8
-- Achats maison privés + photos privées
-- À exécuter UNE SEULE FOIS dans Supabase > SQL Editor.
-- Conserve toutes les données existantes.

-- 1) Nouvelles propriétés sur les achats maison.
alter table public.home_purchases
  add column if not exists is_private boolean not null default false;

alter table public.home_purchases
  add column if not exists photo_path text
  check (photo_path is null or char_length(photo_path) <= 1000);

-- 2) Confidentialité réelle au niveau PostgreSQL.
-- Un achat partagé reste visible aux membres de la maison.
-- Un achat privé n'est lisible/modifiable/supprimable que par son créateur.
drop policy if exists "home_purchases_select_member" on public.home_purchases;
create policy "home_purchases_select_member"
on public.home_purchases for select to authenticated
using (
  public.is_household_member(household_id)
  and (not is_private or created_by = auth.uid())
);

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
using (
  public.is_household_member(household_id)
  and (not is_private or created_by = auth.uid())
)
with check (
  public.is_household_member(household_id)
  and (not is_private or created_by = auth.uid())
  and (assignee is null or public.shares_household(assignee))
  and (bought_by is null or public.shares_household(bought_by))
);

drop policy if exists "home_purchases_delete_member" on public.home_purchases;
create policy "home_purchases_delete_member"
on public.home_purchases for delete to authenticated
using (
  public.is_household_member(household_id)
  and (not is_private or created_by = auth.uid())
);

-- 3) Bucket privé pour les photos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'home-purchases',
  'home-purchases',
  false,
  15728640,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Le chemin de fichier est:
-- household_id / purchase_id / fichier.jpg

create or replace function public.can_manage_home_purchase_photo(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  parsed_household uuid;
  parsed_purchase uuid;
begin
  begin
    parsed_household := split_part(object_name, '/', 1)::uuid;
    parsed_purchase := split_part(object_name, '/', 2)::uuid;
  exception when others then
    return false;
  end;

  return exists (
    select 1
    from public.home_purchases hp
    where hp.id = parsed_purchase
      and hp.household_id = parsed_household
      and public.is_household_member(hp.household_id)
      and (not hp.is_private or hp.created_by = auth.uid())
  );
end;
$$;

create or replace function public.can_view_home_purchase_photo(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.home_purchases hp
    where hp.photo_path = object_name
      and public.is_household_member(hp.household_id)
      and (not hp.is_private or hp.created_by = auth.uid())
  );
$$;

revoke all on function public.can_manage_home_purchase_photo(text) from public;
revoke all on function public.can_view_home_purchase_photo(text) from public;
grant execute on function public.can_manage_home_purchase_photo(text) to authenticated;
grant execute on function public.can_view_home_purchase_photo(text) to authenticated;

drop policy if exists "home_purchase_photos_select" on storage.objects;
create policy "home_purchase_photos_select"
on storage.objects for select to authenticated
using (
  bucket_id = 'home-purchases'
  and public.can_view_home_purchase_photo(name)
);

drop policy if exists "home_purchase_photos_insert" on storage.objects;
create policy "home_purchase_photos_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'home-purchases'
  and public.can_manage_home_purchase_photo(name)
);

drop policy if exists "home_purchase_photos_update" on storage.objects;
create policy "home_purchase_photos_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'home-purchases'
  and public.can_manage_home_purchase_photo(name)
)
with check (
  bucket_id = 'home-purchases'
  and public.can_manage_home_purchase_photo(name)
);

drop policy if exists "home_purchase_photos_delete" on storage.objects;
create policy "home_purchase_photos_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'home-purchases'
  and public.can_manage_home_purchase_photo(name)
);

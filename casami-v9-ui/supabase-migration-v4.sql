-- LISTA DI CASA — MIGRATION V4 : CATÉGORIES DE COURSES
-- À exécuter UNE FOIS dans Supabase > SQL Editor avant de publier la V4.
-- Cette migration conserve toutes vos données existantes.

-- 1) Catégorie de chaque article présent dans la liste.
alter table public.shopping_items
  add column if not exists category text not null default 'other';

-- 2) Mémorise aussi la dernière catégorie utilisée pour chaque article historique.
alter table public.shopping_history
  add column if not exists last_category text not null default 'other';

-- 3) Normalise les éventuelles valeurs vides.
update public.shopping_items
set category = 'other'
where category is null or trim(category) = '';

update public.shopping_history
set last_category = 'other'
where last_category is null or trim(last_category) = '';

-- Les triggers de synchronisation V3 surveillent déjà toute modification de
-- shopping_items et shopping_history : aucune configuration Realtime supplémentaire
-- n'est nécessaire pour les catégories.

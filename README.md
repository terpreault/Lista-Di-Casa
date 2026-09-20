# Lista di Casa — V3

Application PWA partagée iPhone + Android avec Supabase.

## Nouveautés V3

- Interface complète **FR / UK**, avec petit sélecteur `FR / UK` en haut à droite.
- Le choix de langue reste mémorisé sur chaque téléphone.
- Zoom/pinch désactivé dans l'app.
- Courses : option **Urgent** à l'ajout et à la modification.
- Courses : menu `⋮` sur chaque article avec **Modifier**, **Enregistrer pour plus tard** et **Supprimer**.
- Nouvel onglet **Plus tard / Later** dans Courses.
- Mémoire des anciens articles : quand on touche ou commence à taper dans “Ajouter un article”, les articles déjà utilisés sont proposés automatiquement avec leur dernière quantité et leur dernier statut urgent.
- Cette mémoire reste disponible même après avoir effacé les articles achetés.
- Quand un article est coché comme acheté, le ✓ reste visible **2 secondes** avant que l'article passe dans l'onglet Achetés / Bought.
- Pendant ces 2 secondes, retoucher la coche annule l'action.
- Synchronisation Supabase temps réel conservée entre Silvère et Deborah.

## IMPORTANT — mise à jour de la base Supabase existante

Avant de publier le nouveau code sur GitHub Pages :

1. Ouvrir **Supabase > SQL Editor**.
2. Créer une nouvelle query.
3. Copier tout le contenu du fichier `supabase-migration-v3.sql`.
4. Cliquer sur **Run**.
5. Vérifier que Supabase affiche `Success`.

Cette migration est conçue pour conserver les données déjà présentes. Elle ajoute :

- `is_urgent` aux articles de courses ;
- `saved_for_later` aux articles de courses ;
- la table `shopping_history` qui mémorise les articles déjà utilisés ;
- les règles de sécurité RLS nécessaires ;
- la synchronisation de cette mémoire entre les deux téléphones.

Le fichier `supabase-schema.sql` reste le schéma complet pour une installation neuve. Sur le projet Supabase actuel, utiliser seulement `supabase-migration-v3.sql`.

## Mettre la V3 sur GitHub Pages

Le `config.js` de ce package est déjà connecté au projet Supabase Lista di Casa.

Dans le repository GitHub `Lista-Di-Casa`, remplacer les fichiers existants avec ceux de ce dossier. Les fichiers importants modifiés sont :

- `index.html`
- `style.css`
- `app.js`
- `service-worker.js`
- `supabase-schema.sql`

Ajouter aussi :

- `supabase-migration-v3.sql`

Une fois le commit terminé, GitHub Pages redéploie automatiquement la branche `main`.

## Utilisation de la mémoire des courses

Touchez le champ **Ajouter un article**. Les derniers articles déjà utilisés apparaissent. En tapant quelques lettres, la liste se filtre. Toucher une suggestion remet son nom, sa dernière quantité et son dernier réglage Urgent dans le formulaire.

L'historique est partagé au niveau de **Notre maison**, donc les articles ajoutés par Silvère peuvent également être proposés à Deborah, et inversement.

## Installation téléphone

### iPhone
Safari > Partager > **Sur l'écran d'accueil**.

### Android
Chrome > menu ⋮ > **Installer l'application** ou **Ajouter à l'écran d'accueil**.

## Fichiers

- Frontend : HTML / CSS / JavaScript vanilla.
- Backend : Supabase Auth + Postgres + Realtime.
- PWA : manifest + Service Worker.

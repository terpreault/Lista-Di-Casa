# CASAMI V9 — UI & personnalisation

Cette version part directement de **CASAMI V8.5 Splash Transparent** et conserve son identité visuelle actuelle.

## Nouveautés intégrées
- Photos des achats : toucher une photo l’ouvre en grand ; fermeture par ×, toucher le fond ou glisser vers le bas.
- Profil personnel : chaque membre peut choisir sa propre couleur et sa propre icône.
- Phrase d’accueil commune : Silvère ou Deborah peut la modifier depuis Profil ; la même phrase est synchronisée pour les deux.
- Catégories : nouveau sélecteur avancé en bottom sheet affichant toutes les catégories.
- Ordre des catégories : maintien sur `⋮` puis glisser-déposer dans le sélecteur ou directement dans la liste Courses.
- Quantité Courses : sélecteur numérique au lieu d’un champ texte libre (les anciennes quantités restent compatibles).
- Bottom sheets : fermeture tactile par glissement vers le bas.

## Reporté volontairement
- Email hebdomadaire récapitulatif.
- Notification envoyée à l’autre personne lors d’un nouvel ajout.

## IMPORTANT — Supabase
Avant de publier la V9, ouvrir **Supabase > SQL Editor > New query**, copier tout le contenu de :

`supabase-migration-v9.sql`

puis exécuter **Run** une seule fois.

Cette migration ajoute uniquement :
- `profiles.profile_icon`
- `profiles.profile_color`
- `households.shared_quote`
- la synchronisation temps réel nécessaire à ces nouveaux réglages.

Elle ne supprime pas les données existantes.

## Publication
Après la migration Supabase, remplacer les fichiers du site par ceux de ce dossier puis redéployer. Le cache PWA a été changé en `casami-v9-ui` afin que les téléphones récupèrent la nouvelle interface.

Ne pas modifier `config.js`.

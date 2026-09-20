# Lista di Casa — V1

Application PWA mobile partagée pour iPhone + Android.

## Design V2 — style du mockup

Cette version reprend directement dans le vrai code le style du mockup validé : en-tête centré, synchronisation visible, accueil avec deux cartes Courses/Maison, panneau jaune des urgences, derniers ajouts, filtres en pastilles et listes compactes. Aucun de ces éléments n'est une image : ce sont les composants HTML/CSS/JS de l'application.

## Inclus dans cette V1

- Connexion par email / mot de passe.
- Un espace privé partagé "Notre maison".
- Code à 8 caractères pour inviter la deuxième personne.
- Liste Courses : ajout, quantité, acheté / non acheté, suppression.
- Liste Maison : tâche, urgent / non urgent, responsable, à faire / fait, modification, suppression.
- Accueil avec compteurs.
- Synchronisation temps réel entre les deux téléphones avec Supabase Realtime.
- Installation PWA sur iPhone et Android.
- Palette lavande / vert / jaune.
- Row Level Security : les données d'une maison ne sont accessibles qu'à ses membres.

## 1. Créer le projet Supabase

1. Va sur https://supabase.com/
2. Crée un projet.
3. Ouvre **SQL Editor**.
4. Copie tout le contenu de `supabase-schema.sql`.
5. Exécute le script.

## 2. Récupérer les deux informations de connexion

Dans Supabase, ouvre **Connect** ou les paramètres API du projet.

Tu as besoin de :
- Project URL
- Publishable key

Ne mets JAMAIS la `service_role` key dans cette app.

Ouvre `config.js` et remplace :

PASTE_YOUR_SUPABASE_URL_HERE
PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE

par les deux valeurs de ton projet.

## 3. Email de confirmation

Par défaut, Supabase peut demander de confirmer l'adresse email.

Pour un test très simple à deux, tu peux soit :
- garder la confirmation email et cliquer le lien reçu après inscription ;
- ou modifier les réglages Auth de ton projet si tu préfères un flux différent.

## 4. Tester avant de publier

Tu peux ouvrir le dossier avec un petit serveur local. Évite de simplement double-cliquer sur `index.html`, car les Service Workers et certains comportements PWA nécessitent HTTP/HTTPS.

## 5. GitHub + Netlify

Mets tout le contenu de ce dossier dans un nouveau dépôt GitHub, par exemple `lista-di-casa`.

Puis connecte ce dépôt à Netlify. Aucun build n'est nécessaire :
- Build command : vide
- Publish directory : `.`

## 6. Première utilisation

1. Silvère crée son compte.
2. Il crée "Notre maison".
3. Dans l'accueil, toucher le bouton `i`.
4. Copier le code à 8 caractères.
5. Deborah crée son compte sur son téléphone.
6. Elle choisit **Rejoindre** et saisit le code.
7. Les deux téléphones voient ensuite les mêmes listes en temps réel.

## 7. Installation sur téléphone

### iPhone
Safari > bouton Partager > **Sur l'écran d'accueil**.

### Android
Chrome > menu > **Installer l'application** ou **Ajouter à l'écran d'accueil**.

## Notes techniques

Frontend : HTML / CSS / JavaScript vanilla.
Backend : Supabase Auth + Postgres + Realtime. Les changements de listes déclenchent un petit événement de synchro par maison, afin que même les suppressions soient immédiatement répercutées sur l’autre téléphone.
PWA : manifest + Service Worker.

Le Service Worker met en cache l'interface. Les modifications de données nécessitent actuellement une connexion internet ; une file d'attente de modifications hors-ligne pourra être ajoutée dans une V2.

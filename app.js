(() => {
  "use strict";

  const cfg = window.APP_CONFIG || {};
  const configReady =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_KEY &&
    !cfg.SUPABASE_URL.includes("PASTE_") &&
    !cfg.SUPABASE_KEY.includes("PASTE_");

  const $ = (id) => document.getElementById(id);
  const qsa = (s) => [...document.querySelectorAll(s)];
  const esc = (value = "") => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));

  const translations = {
    fr: {
      "auth.tagline": "La maison, à deux.",
      "auth.subtitle": "Courses et petites choses de la maison, toujours synchronisées.",
      "auth.loginTab": "Connexion",
      "auth.signupTab": "Créer un compte",
      "auth.loginButton": "Se connecter",
      "auth.createAccount": "Créer mon compte",
      "auth.forgotPassword": "Mot de passe oublié ?",
      "auth.forgotTitle": "Réinitialiser le mot de passe",
      "auth.forgotHelp": "Entre ton email. Nous t’enverrons un lien sécurisé pour choisir un nouveau mot de passe.",
      "auth.sendResetLink": "Envoyer le lien",
      "auth.backToLogin": "Retour à la connexion",
      "auth.resetTitle": "Choisir un nouveau mot de passe",
      "auth.resetHelp": "Choisis un nouveau mot de passe pour ton compte CASAMI.",
      "auth.newPassword": "Nouveau mot de passe",
      "auth.confirmPassword": "Confirmer le mot de passe",
      "auth.passwordHint": "8 caractères minimum.",
      "auth.saveNewPassword": "Enregistrer le nouveau mot de passe",

      "profile.security": "Sécurité",
      "profile.securityHelp": "Mot de passe du compte",
      "profile.changePassword": "Changer le mot de passe",
      "profile.changePasswordHelp": "Choisis un nouveau mot de passe pour ton compte CASAMI.",
      "profile.savePassword": "Enregistrer le mot de passe",
      "profile.appearance": "Mon profil",
      "profile.appearanceHelp": "Couleur et icône",
      "profile.chooseColor": "Choisir une couleur",
      "profile.chooseIcon": "Choisir une icône",
      "profile.sharedQuote": "Phrase d’accueil commune",
      "profile.sharedQuoteHelp": "Visible et modifiable par vous deux",
      "profile.sharedQuotePlaceholder": "Votre phrase pour la maison…",
      "profile.styleSaved": "Profil personnalisé.",
      "profile.quoteSaved": "Phrase d’accueil mise à jour.",
      "common.email": "Email",
      "common.password": "Mot de passe",
      "common.firstName": "Prénom",
      "common.logout": "Se déconnecter",
      "common.create": "Créer",
      "common.join": "Rejoindre",
      "common.or": "ou",
      "common.viewAll": "Voir tout",
      "common.all": "Toutes",
      "common.add": "Ajouter",
      "common.urgent": "Urgent",
      "common.save": "Enregistrer",
      "common.saveChanges": "Enregistrer les modifications",
      "common.edit": "Modifier",
      "common.delete": "Supprimer",
      "common.anyone": "N’importe qui",
      "onboarding.welcome": "Bienvenue",
      "onboarding.title": "Votre maison",
      "onboarding.createShared": "Créez votre espace partagé",
      "onboarding.description": "La première personne crée la maison. La seconde la rejoint avec le code généré.",
      "onboarding.spaceName": "Nom de l’espace",
      "onboarding.createHome": "Créer notre maison",
      "onboarding.sharedCode": "Code partagé",
      "onboarding.joinHome": "Rejoindre la maison",
      "onboarding.defaultHome": "Notre maison",
      "sync.synced": "Synchronisé",
      "sync.offline": "Hors connexion",
      "nav.home": "Accueil",
      "nav.shopping": "Courses",
      "nav.house": "Maison",
      "nav.purchases": "Achats",
      "nav.profile": "Profil",
      "home.underControl": "Tout est sous contrôle",
      "home.welcomeLine": "Une maison plus douce, ensemble.",
      "home.quote": "« Les petites choses font les grands foyers. »",
      "home.itemsToBuy": "articles à acheter",
      "home.tasksToDo": "tâches à faire",
      "home.urgentTasks": "priorités urgentes",
      "home.recent": "Derniers ajouts",
      "home.noUrgent": "Rien d’urgent pour le moment.",
      "home.noRecent": "Aucun ajout pour le moment.",
      "home.today": "Aujourd’hui",
      "shopping.addPlaceholder": "Ajouter un article…",
      "shopping.qtyShort": "Qté",
      "shopping.toBuy": "À acheter",
      "shopping.later": "Plus tard",
      "shopping.bought": "Achetés",
      "shopping.clearBought": "Effacer les articles achetés",
      "shopping.empty": "La liste de courses est vide.",
      "shopping.emptyView": "Aucun article dans cette vue.",
      "shopping.options": "Options",
      "shopping.saveLater": "Enregistrer pour plus tard",
      "shopping.backToList": "Remettre dans la liste",
      "shopping.editItem": "Modifier l’article",
      "shopping.item": "Article",
      "shopping.quantity": "Quantité",
      "shopping.urgentHelp": "Mettre cet article en priorité",
      "shopping.savedLater": "Pour plus tard",
      "shopping.historyHint": "Déjà utilisé",
      "shopping.noneHistory": "Aucun article mémorisé pour le moment.",
      "shopping.category": "Catégorie",
      "shopping.categories": "Catégories",
      "shopping.filterCategory": "Filtrer par catégorie",
      "shopping.allCategories": "Toutes les catégories",
      "shopping.addCategory": "Ajouter une catégorie",
      "category.options": "Options de catégorie",
      "category.edit": "Modifier la catégorie",
      "category.nameFr": "Nom français",
      "category.nameUk": "Nom anglais (UK)",
      "category.icon": "Icône",
      "category.moveUp": "Monter",
      "category.moveDown": "Descendre",
      "category.delete": "Supprimer la catégorie",
      "category.deleteConfirm": "Supprimer cette catégorie ? Les articles associés seront déplacés vers Autres.",
      "category.fallbackProtected": "La catégorie Autres ne peut pas être supprimée.",
      "category.created": "Catégorie ajoutée.",
      "category.updated": "Catégorie modifiée.",
      "category.deleted": "Catégorie supprimée.",
      "category.expand": "Déplier la catégorie",
      "category.collapse": "Réduire la catégorie",
      "category.dragHelp": "Maintenez ⋮ puis glissez pour changer l’ordre.",
      "category.fruit_veg": "Fruits & légumes",
      "category.bakery": "Boulangerie",
      "category.fresh": "Produits frais",
      "category.meat_fish": "Viande & poisson",
      "category.pantry": "Épicerie",
      "category.drinks": "Boissons",
      "category.frozen": "Surgelés",
      "category.home": "Maison",
      "category.other": "Autres",
      "house.addTask": "Ajouter une tâche…",
      "house.toDo": "À faire",
      "house.done": "Faites",
      "house.taskLabel": "À faire",
      "house.taskPlaceholder": "Ex. Changer l’ampoule",
      "house.assignee": "Pour qui ?",
      "house.urgentHelp": "Mettre cette tâche en priorité",
      "house.deleteTask": "Supprimer cette tâche",
      "house.newTask": "Nouvelle tâche",
      "house.editTask": "Modifier la tâche",
      "house.empty": "Aucune tâche dans cette vue.",
      "house.tasksTab": "À faire",
      "house.purchasesTab": "À acheter",
      "purchase.add": "Ajouter un achat…",
      "purchase.new": "Nouvel achat",
      "purchase.edit": "Modifier l’achat",
      "purchase.item": "Article",
      "purchase.placeholder": "Ex. Lampe de bureau",
      "purchase.price": "Prix estimé",
      "purchase.status": "Statut",
      "purchase.toBuy": "À acheter",
      "purchase.later": "Plus tard",
      "purchase.bought": "Achetés",
      "purchase.note": "Note",
      "purchase.notePlaceholder": "Couleur, dimensions, référence…",
      "purchase.link": "Lien",
      "purchase.photo": "Photo",
      "purchase.addPhoto": "Ajouter une photo",
      "purchase.changePhoto": "Changer la photo",
      "purchase.removePhoto": "Retirer la photo",
      "purchase.photoHelp": "Facultatif · JPG, PNG, WEBP",
      "purchase.photoError": "La photo n’a pas pu être enregistrée.",
      "purchase.photoTooLarge": "La photo est trop volumineuse.",
      "purchase.private": "Privé",
      "purchase.privateHelp": "Visible uniquement par moi",
      "purchase.privateBadge": "Privé",
      "purchase.urgentHelp": "Mettre cet achat en priorité",
      "purchase.options": "Options",
      "purchase.saveLater": "Enregistrer pour plus tard",
      "purchase.backToBuy": "Remettre à acheter",
      "purchase.markBought": "Marquer acheté",
      "purchase.markToBuy": "Remettre à acheter",
      "purchase.empty": "Aucun achat dans cette vue.",
      "purchase.savedLater": "Achat enregistré pour plus tard.",
      "purchase.backToList": "Achat remis à acheter.",
      "purchase.updated": "Achat modifié.",
      "purchase.addError": "Impossible d’ajouter cet achat.",
      "purchase.saveError": "Impossible d’enregistrer cet achat.",
      "purchase.linkOpen": "Ouvrir le lien",
      "purchase.photoCloseHint": "Glissez vers le bas pour fermer",
      "home.housePurchases": "Achats maison",
      "home.housePurchasesToBuy": "à acheter",
      "home.urgentShort": "urgent",
      "recent.purchase": "Achats maison",
      "share.title": "Votre maison",
      "share.codeHelp": "Code à partager avec Deborah",
      "share.copyCode": "Copier le code",
      "share.members": "Maison et membres",
      "share.membersLabel": "Membres",
      "profile.account": "Mon compte",
      "profile.home": "Maison partagée",
      "profile.members": "Membres",
      "profile.share": "Partager / gérer la maison",
      "profile.language": "Langue",
      "profile.languageHelp": "Français / English",
      "toast.config": "Connecte d’abord l’app à Supabase dans config.js",
      "toast.loadHomeError": "Impossible de charger la maison.",
      "toast.syncError": "Erreur de synchronisation.",
      "toast.addShoppingError": "Impossible d’ajouter cet article.",
      "toast.updateError": "Modification impossible.",
      "toast.deleteError": "Suppression impossible.",
      "toast.noBought": "Aucun article acheté à effacer.",
      "toast.saveTaskError": "Impossible d’enregistrer cette tâche.",
      "toast.createError": "Création impossible.",
      "toast.invalidCode": "Code introuvable ou invalide.",
      "toast.joined": "Vous êtes maintenant connectés à la même maison.",
      "toast.loginError": "Email ou mot de passe incorrect.",
      "toast.resetEmailSent": "Si ce compte existe, un email de réinitialisation vient d’être envoyé.",
      "toast.resetEmailError": "Impossible d’envoyer l’email de réinitialisation pour le moment.",
      "toast.passwordMismatch": "Les deux mots de passe ne correspondent pas.",
      "toast.passwordTooShort": "Le mot de passe doit contenir au moins 8 caractères.",
      "toast.passwordUpdated": "Mot de passe modifié. Tu es connecté à CASAMI.",
      "toast.passwordUpdateError": "Impossible de modifier le mot de passe.",

      "toast.passwordChanged": "Mot de passe modifié avec succès.",
      "toast.resetRateLimit": "Trop de demandes de réinitialisation. Réessaie un peu plus tard.",
      "toast.accountError": "Création du compte impossible.",
      "toast.verifyEmail": "Compte créé. Vérifie ton email pour confirmer l’inscription.",
      "toast.copied": "Code copié.",
      "toast.savedLater": "Article enregistré pour plus tard.",
      "toast.backToList": "Article remis dans la liste.",
      "toast.itemUpdated": "Article modifié.",
      "time.now": "à l’instant",
      "time.yesterday": "hier",
      "recent.shopping": "Courses",
      "recent.house": "Maison"
    },
    uk: {
      "auth.tagline": "Home, together.",
      "auth.subtitle": "Shopping and household tasks, always in sync.",
      "auth.loginTab": "Sign in",
      "auth.signupTab": "Create account",
      "auth.loginButton": "Sign in",
      "auth.createAccount": "Create my account",
      "auth.forgotPassword": "Forgot password?",
      "auth.forgotTitle": "Reset your password",
      "auth.forgotHelp": "Enter your email. We’ll send you a secure link to choose a new password.",
      "auth.sendResetLink": "Send reset link",
      "auth.backToLogin": "Back to sign in",
      "auth.resetTitle": "Choose a new password",
      "auth.resetHelp": "Choose a new password for your CASAMI account.",
      "auth.newPassword": "New password",
      "auth.confirmPassword": "Confirm password",
      "auth.passwordHint": "At least 8 characters.",
      "auth.saveNewPassword": "Save new password",

      "profile.security": "Security",
      "profile.securityHelp": "Account password",
      "profile.changePassword": "Change password",
      "profile.changePasswordHelp": "Choose a new password for your CASAMI account.",
      "profile.savePassword": "Save password",
      "profile.appearance": "My profile",
      "profile.appearanceHelp": "Colour and icon",
      "profile.chooseColor": "Choose a colour",
      "profile.chooseIcon": "Choose an icon",
      "profile.sharedQuote": "Shared welcome phrase",
      "profile.sharedQuoteHelp": "Visible and editable by both of you",
      "profile.sharedQuotePlaceholder": "Your phrase for the home…",
      "profile.styleSaved": "Profile customised.",
      "profile.quoteSaved": "Welcome phrase updated.",
      "common.email": "Email",
      "common.password": "Password",
      "common.firstName": "First name",
      "common.logout": "Sign out",
      "common.create": "Create",
      "common.join": "Join",
      "common.or": "or",
      "common.viewAll": "View all",
      "common.all": "All",
      "common.add": "Add",
      "common.urgent": "Urgent",
      "common.save": "Save",
      "common.saveChanges": "Save changes",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.anyone": "Anyone",
      "onboarding.welcome": "Welcome",
      "onboarding.title": "Your home",
      "onboarding.createShared": "Create your shared space",
      "onboarding.description": "The first person creates the home. The second joins it with the generated code.",
      "onboarding.spaceName": "Space name",
      "onboarding.createHome": "Create our home",
      "onboarding.sharedCode": "Shared code",
      "onboarding.joinHome": "Join the home",
      "onboarding.defaultHome": "Our home",
      "sync.synced": "Synced",
      "sync.offline": "Offline",
      "nav.home": "Home",
      "nav.shopping": "Shopping",
      "nav.house": "House",
      "nav.purchases": "Purchases",
      "nav.profile": "Profile",
      "home.underControl": "Everything is under control",
      "home.welcomeLine": "A calmer home, together.",
      "home.quote": "“Little things make a home.”",
      "home.itemsToBuy": "items to buy",
      "home.tasksToDo": "tasks to do",
      "home.urgentTasks": "urgent priorities",
      "home.recent": "Recent additions",
      "home.noUrgent": "Nothing urgent at the moment.",
      "home.noRecent": "Nothing added yet.",
      "home.today": "Today",
      "shopping.addPlaceholder": "Add an item…",
      "shopping.qtyShort": "Qty",
      "shopping.toBuy": "To buy",
      "shopping.later": "Later",
      "shopping.bought": "Bought",
      "shopping.clearBought": "Clear bought items",
      "shopping.empty": "The shopping list is empty.",
      "shopping.emptyView": "No items in this view.",
      "shopping.options": "Options",
      "shopping.saveLater": "Save for later",
      "shopping.backToList": "Put back on list",
      "shopping.editItem": "Edit item",
      "shopping.item": "Item",
      "shopping.quantity": "Quantity",
      "shopping.urgentHelp": "Mark this item as a priority",
      "shopping.savedLater": "For later",
      "shopping.historyHint": "Used before",
      "shopping.noneHistory": "No remembered items yet.",
      "shopping.category": "Category",
      "shopping.categories": "Categories",
      "shopping.filterCategory": "Filter by category",
      "shopping.allCategories": "All categories",
      "shopping.addCategory": "Add a category",
      "category.options": "Category options",
      "category.edit": "Edit category",
      "category.nameFr": "French name",
      "category.nameUk": "UK English name",
      "category.icon": "Icon",
      "category.moveUp": "Move up",
      "category.moveDown": "Move down",
      "category.delete": "Delete category",
      "category.deleteConfirm": "Delete this category? Its items will be moved to Other.",
      "category.fallbackProtected": "The Other category cannot be deleted.",
      "category.created": "Category added.",
      "category.updated": "Category updated.",
      "category.deleted": "Category deleted.",
      "category.expand": "Expand category",
      "category.collapse": "Collapse category",
      "category.dragHelp": "Hold ⋮ then drag to change the order.",
      "category.fruit_veg": "Fruit & Veg",
      "category.bakery": "Bakery",
      "category.fresh": "Chilled & Dairy",
      "category.meat_fish": "Meat & Fish",
      "category.pantry": "Pantry",
      "category.drinks": "Drinks",
      "category.frozen": "Frozen",
      "category.home": "Household",
      "category.other": "Other",
      "house.addTask": "Add a task…",
      "house.toDo": "To do",
      "house.done": "Done",
      "house.taskLabel": "Task",
      "house.taskPlaceholder": "e.g. Change the light bulb",
      "house.assignee": "For whom?",
      "house.urgentHelp": "Mark this task as a priority",
      "house.deleteTask": "Delete this task",
      "house.newTask": "New task",
      "house.editTask": "Edit task",
      "house.empty": "No tasks in this view.",
      "house.tasksTab": "To do",
      "house.purchasesTab": "To buy",
      "purchase.add": "Add a purchase…",
      "purchase.new": "New purchase",
      "purchase.edit": "Edit purchase",
      "purchase.item": "Item",
      "purchase.placeholder": "e.g. Desk lamp",
      "purchase.price": "Estimated price",
      "purchase.status": "Status",
      "purchase.toBuy": "To buy",
      "purchase.later": "Later",
      "purchase.bought": "Bought",
      "purchase.note": "Note",
      "purchase.notePlaceholder": "Colour, dimensions, reference…",
      "purchase.link": "Link",
      "purchase.photo": "Photo",
      "purchase.addPhoto": "Add a photo",
      "purchase.changePhoto": "Change photo",
      "purchase.removePhoto": "Remove photo",
      "purchase.photoHelp": "Optional · JPG, PNG, WEBP",
      "purchase.photoError": "The photo could not be saved.",
      "purchase.photoTooLarge": "The photo is too large.",
      "purchase.private": "Private",
      "purchase.privateHelp": "Visible only to me",
      "purchase.privateBadge": "Private",
      "purchase.urgentHelp": "Mark this purchase as a priority",
      "purchase.options": "Options",
      "purchase.saveLater": "Save for later",
      "purchase.backToBuy": "Put back to buy",
      "purchase.markBought": "Mark as bought",
      "purchase.markToBuy": "Put back to buy",
      "purchase.empty": "No purchases in this view.",
      "purchase.savedLater": "Purchase saved for later.",
      "purchase.backToList": "Purchase put back to buy.",
      "purchase.updated": "Purchase updated.",
      "purchase.addError": "Unable to add this purchase.",
      "purchase.saveError": "Unable to save this purchase.",
      "purchase.linkOpen": "Open link",
      "purchase.photoCloseHint": "Swipe down to close",
      "home.housePurchases": "Home purchases",
      "home.housePurchasesToBuy": "to buy",
      "home.urgentShort": "urgent",
      "recent.purchase": "Home purchases",
      "share.title": "Your home",
      "share.codeHelp": "Code to share with Deborah",
      "share.copyCode": "Copy code",
      "share.members": "Home and members",
      "share.membersLabel": "Members",
      "profile.account": "My account",
      "profile.home": "Shared home",
      "profile.members": "Members",
      "profile.share": "Share / manage home",
      "profile.language": "Language",
      "profile.languageHelp": "Français / English",
      "toast.config": "Connect the app to Supabase in config.js first",
      "toast.loadHomeError": "Unable to load your home.",
      "toast.syncError": "Sync error.",
      "toast.addShoppingError": "Unable to add this item.",
      "toast.updateError": "Unable to update.",
      "toast.deleteError": "Unable to delete.",
      "toast.noBought": "There are no bought items to clear.",
      "toast.saveTaskError": "Unable to save this task.",
      "toast.createError": "Unable to create.",
      "toast.invalidCode": "Code not found or invalid.",
      "toast.joined": "You are now connected to the same home.",
      "toast.loginError": "Incorrect email or password.",
      "toast.resetEmailSent": "If this account exists, a password reset email has just been sent.",
      "toast.resetEmailError": "We couldn’t send the password reset email right now.",
      "toast.passwordMismatch": "The two passwords do not match.",
      "toast.passwordTooShort": "The password must be at least 8 characters long.",
      "toast.passwordUpdated": "Password changed. You’re signed in to CASAMI.",
      "toast.passwordUpdateError": "We couldn’t change the password.",

      "toast.passwordChanged": "Password changed successfully.",
      "toast.resetRateLimit": "Too many reset requests. Please try again a little later.",
      "toast.accountError": "Unable to create the account.",
      "toast.verifyEmail": "Account created. Check your email to confirm your registration.",
      "toast.copied": "Code copied.",
      "toast.savedLater": "Item saved for later.",
      "toast.backToList": "Item put back on the list.",
      "toast.itemUpdated": "Item updated.",
      "time.now": "just now",
      "time.yesterday": "yesterday",
      "recent.shopping": "Shopping",
      "recent.house": "House"
    }
  };

  const DEFAULT_CATEGORY_DEFS = [
    { key: "fruit_veg", emoji: "🥬", name_fr: "Fruits & légumes", name_en: "Fruit & Veg", sort_order: 10, is_default: true, is_fallback: false },
    { key: "bakery", emoji: "🥖", name_fr: "Boulangerie", name_en: "Bakery", sort_order: 20, is_default: true, is_fallback: false },
    { key: "fresh", emoji: "🥛", name_fr: "Produits frais", name_en: "Chilled & Dairy", sort_order: 30, is_default: true, is_fallback: false },
    { key: "meat_fish", emoji: "🥩", name_fr: "Viande & poisson", name_en: "Meat & Fish", sort_order: 40, is_default: true, is_fallback: false },
    { key: "pantry", emoji: "🥫", name_fr: "Épicerie", name_en: "Pantry", sort_order: 50, is_default: true, is_fallback: false },
    { key: "drinks", emoji: "🥤", name_fr: "Boissons", name_en: "Drinks", sort_order: 60, is_default: true, is_fallback: false },
    { key: "frozen", emoji: "❄️", name_fr: "Surgelés", name_en: "Frozen", sort_order: 70, is_default: true, is_fallback: false },
    { key: "home", emoji: "🧽", name_fr: "Maison", name_en: "Household", sort_order: 80, is_default: true, is_fallback: false },
    { key: "other", emoji: "📦", name_fr: "Autres", name_en: "Other", sort_order: 90, is_default: true, is_fallback: true }
  ];

  let currentLang = localStorage.getItem("lista_lang") === "uk" ? "uk" : "fr";

  function initCasamiSplash() {
    const splash = document.getElementById("casamiSplash");
    if (!splash) return;

    const tagline = document.getElementById("casamiSplashTagline");
    if (tagline) {
      tagline.textContent = currentLang === "uk" ? "Home, together." : "La maison, à deux.";
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const visibleFor = reduceMotion ? 950 : 1950;

    window.setTimeout(() => {
      splash.classList.add("is-hiding");
      window.setTimeout(() => splash.remove(), 420);
    }, visibleFor);
  }

  initCasamiSplash();

  let currentPage = "home";
  let supabase = null;
  let passwordRecoveryMode = false;
  let user = null;
  let household = null;
  let members = [];
  let shopping = [];
  let shoppingHistory = [];
  let shoppingCategories = [];
  let tasks = [];
  let homePurchases = [];
  let houseMode = "tasks";
  let taskFilter = "todo";
  let homePurchaseFilter = "all";
  let shoppingFilter = "all";
  let shoppingCategoryFilter = "all";
  let realtimeChannel = null;
  let toastTimer = null;

  document.title = "CASAMI";
  let newShoppingUrgent = false;
  let newShoppingCategory = "other";
  let shoppingActionItemId = null;
  let categoryActionKey = null;
  let categoryEditorReturnTarget = null;
  let categoryPickerTarget = null;
  let categoryDragJustEnded = false;
  let profileStyleDraft = { color: "#8A5CFF", icon: "initial" };
  let homePurchaseActionId = null;
  let homePurchasePhotoUrls = new Map();
  let homePurchasePhotoFile = null;
  let homePurchaseRemovePhoto = false;
  let homePurchaseEditingPhotoPath = null;
  let homePurchasePreviewObjectUrl = null;
  const pendingPurchases = new Set();
  const pendingPurchaseTimers = new Map();
  const pendingHomePurchases = new Set();
  const pendingHomePurchaseTimers = new Map();

  const views = {
    auth: $("authView"),
    onboarding: $("onboardingView"),
    app: $("appView")
  };

  function t(key) {
    return translations[currentLang]?.[key] ?? translations.fr[key] ?? key;
  }

  const PROFILE_COLORS = ["#8A5CFF", "#49C095", "#FFC83D", "#A984FF", "#233548"];

  function profileColor(value) {
    const wanted = String(value || "").toUpperCase();
    return PROFILE_COLORS.find(color => color.toUpperCase() === wanted) || PROFILE_COLORS[0];
  }

  function profileIcon(member) {
    const icon = member?.profile_icon || "initial";
    return icon === "initial" ? String(member?.display_name || "C").slice(0, 1).toUpperCase() : icon;
  }

  function currentMember() {
    return members.find(member => member.id === user?.id) || null;
  }

  function ensureQuantityValue(select, value) {
    if (!select) return;
    const wanted = String(value || "");
    if (wanted && ![...select.options].some(option => option.value === wanted)) {
      const option = document.createElement("option");
      option.value = wanted;
      option.textContent = wanted;
      option.dataset.legacyQuantity = "true";
      select.appendChild(option);
    }
    select.value = wanted;
  }

  function allShoppingCategories() {
    const source = shoppingCategories.length
      ? shoppingCategories.map(row => ({
          ...row,
          key: row.category_key || row.key,
          sort_order: Number(row.sort_order ?? 999),
          is_fallback: !!row.is_fallback
        }))
      : DEFAULT_CATEGORY_DEFS.map(category => ({ ...category }));
    return source.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999) || String(a.name_fr || a.key).localeCompare(String(b.name_fr || b.key)));
  }

  function categoryMeta(key) {
    const categories = allShoppingCategories();
    return categories.find(category => category.key === key)
      || categories.find(category => category.is_fallback)
      || DEFAULT_CATEGORY_DEFS[DEFAULT_CATEGORY_DEFS.length - 1];
  }

  function categoryLabel(key) {
    const meta = categoryMeta(key);
    const stored = currentLang === "uk" ? meta.name_en : meta.name_fr;
    return stored || t(`category.${meta.key}`) || meta.key;
  }

  function categoryDisplay(key) {
    const meta = categoryMeta(key);
    return `${meta.emoji || "📦"} ${categoryLabel(meta.key)}`;
  }

  function categoryRank(key) {
    const index = allShoppingCategories().findIndex(category => category.key === key);
    return index === -1 ? 999 : index;
  }

  function fallbackCategoryKey() {
    return allShoppingCategories().find(category => category.is_fallback)?.key || "other";
  }

  function collapsedCategoriesStorageKey() {
    return `lista_collapsed_categories_${household?.id || "local"}`;
  }

  function getCollapsedCategories() {
    try {
      const parsed = JSON.parse(localStorage.getItem(collapsedCategoriesStorageKey()) || "[]");
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }

  function toggleCategoryCollapsed(key) {
    const collapsed = getCollapsedCategories();
    if (collapsed.has(key)) collapsed.delete(key);
    else collapsed.add(key);
    localStorage.setItem(collapsedCategoriesStorageKey(), JSON.stringify([...collapsed]));
    renderShopping();
  }

  function fillCategorySelect(select, { includeAll = false, selected = null, allowAdd = true } = {}) {
    if (!select) return;
    const wanted = selected ?? select.value;
    const options = [];
    if (includeAll) options.push(`<option value="all">${esc(t("shopping.allCategories"))}</option>`);
    options.push(...allShoppingCategories().map(category =>
      `<option value="${esc(category.key)}">${esc(category.emoji || "📦")} ${esc(categoryLabel(category.key))}</option>`
    ));
    if (allowAdd && !includeAll) {
      options.push(`<option value="__add_category__">＋ ${esc(t("shopping.addCategory"))}</option>`);
    }
    select.innerHTML = options.join("");
    if ([...select.options].some(option => option.value === wanted)) select.value = wanted;
    else select.value = includeAll ? "all" : fallbackCategoryKey();
  }

  function renderCategoryControls() {
    fillCategorySelect($("shoppingCategory"), { selected: newShoppingCategory, allowAdd: true });
    fillCategorySelect($("shoppingCategoryFilter"), { includeAll: true, selected: shoppingCategoryFilter, allowAdd: false });
    const editSelect = $("shoppingEditCategory");
    if (editSelect) {
      const wanted = editSelect.dataset.lastValue || editSelect.value || fallbackCategoryKey();
      fillCategorySelect(editSelect, { selected: wanted, allowAdd: true });
      editSelect.dataset.lastValue = editSelect.value;
    }
    if ($("shoppingCategoryTriggerLabel")) $("shoppingCategoryTriggerLabel").textContent = categoryDisplay(newShoppingCategory || fallbackCategoryKey());
    if ($("shoppingCategoryFilterTriggerLabel")) $("shoppingCategoryFilterTriggerLabel").textContent = shoppingCategoryFilter === "all" ? t("shopping.allCategories") : categoryDisplay(shoppingCategoryFilter);
    if ($("shoppingEditCategoryTriggerLabel") && editSelect) $("shoppingEditCategoryTriggerLabel").textContent = categoryDisplay(editSelect.value || fallbackCategoryKey());
    if (!$("categoryPickerSheet")?.classList.contains("hidden")) renderCategoryPicker();
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang === "uk" ? "en-GB" : "fr";

    qsa("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    qsa("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    qsa("[data-i18n-aria]").forEach(el => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    qsa("[data-i18n-title]").forEach(el => {
      el.title = t(el.dataset.i18nTitle);
    });
    qsa("[data-lang]").forEach(button => {
      button.classList.toggle("active", button.dataset.lang === currentLang);
    });

    const householdInput = $("householdName");
    if (householdInput) {
      const knownDefaults = [translations.fr["onboarding.defaultHome"], translations.uk["onboarding.defaultHome"]];
      if (!householdInput.value || knownDefaults.includes(householdInput.value)) {
        householdInput.value = t("onboarding.defaultHome");
      }
    }

    renderCategoryControls();
    setSyncState();
    showPage(currentPage, false);
    if (household) renderAll();
    else renderShoppingSuggestions(false);
    updateHomePurchaseActionLabels();
  }

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem("lista_lang", lang);
    applyLanguage();
  }

  function showToast(message) {
    const el = $("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
  }

  function setView(name) {
    Object.entries(views).forEach(([key, el]) => el.classList.toggle("hidden", key !== name));
  }

  function setSyncState() {
    const offline = !navigator.onLine;
    const header = document.querySelector(".app-header");
    if (header) header.classList.toggle("offline", offline);
    if ($("syncText")) $("syncText").textContent = offline ? t("sync.offline") : t("sync.synced");
  }

  function setLoading(button, isLoading, label) {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || (currentLang === "uk" ? "Loading…" : "Chargement…");
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      applyLanguage();
    }
  }

  function preventZoom() {
    document.addEventListener("gesturestart", event => event.preventDefault(), { passive: false });
    document.addEventListener("gesturechange", event => event.preventDefault(), { passive: false });
    document.addEventListener("gestureend", event => event.preventDefault(), { passive: false });
    document.addEventListener("touchmove", event => {
      if (event.touches && event.touches.length > 1) event.preventDefault();
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener("touchend", event => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    }, { passive: false });
  }

  function passwordResetRedirectUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  function recoveryMarkerInUrl() {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    return hash.get("type") === "recovery" || query.get("type") === "recovery";
  }

  function setAuthPanel(mode = "login") {
    const forms = {
      login: $("loginForm"),
      signup: $("signupForm"),
      forgot: $("forgotPasswordForm"),
      reset: $("resetPasswordForm")
    };
    Object.entries(forms).forEach(([key, form]) => form?.classList.toggle("hidden", key !== mode));

    const tabs = $("authTabs");
    if (tabs) tabs.classList.toggle("hidden", mode === "forgot" || mode === "reset");

    if (mode === "login" || mode === "signup") {
      qsa("[data-auth-tab]").forEach(button => {
        button.classList.toggle("active", button.dataset.authTab === mode);
      });
    }

    if (mode === "reset") {
      setView("auth");
      requestAnimationFrame(() => $("newPassword")?.focus());
    }
  }

  function enterPasswordRecovery() {
    passwordRecoveryMode = true;
    setView("auth");
    setAuthPanel("reset");
  }

  async function requestPasswordReset(event) {
    event.preventDefault();
    const button = event.submitter;
    const email = $("forgotPasswordEmail").value.trim();
    if (!email) return;

    setLoading(button, true, currentLang === "uk" ? "Sending…" : "Envoi…");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: passwordResetRedirectUrl()
    });
    setLoading(button, false);

    if (error) {
      console.error("Password reset email error", error);
      const message = String(error.message || "");
      if (error.status === 429 || /rate|too many|limit/i.test(message)) {
        showToast(t("toast.resetRateLimit"));
      } else {
        showToast(message || t("toast.resetEmailError"));
      }
      return;
    }

    showToast(t("toast.resetEmailSent"));
    setAuthPanel("login");
  }

  async function saveRecoveredPassword(event) {
    event.preventDefault();
    const button = event.submitter;
    const password = $("newPassword").value;
    const confirmation = $("confirmPassword").value;

    if (password.length < 8) return showToast(t("toast.passwordTooShort"));
    if (password !== confirmation) return showToast(t("toast.passwordMismatch"));

    setLoading(button, true, currentLang === "uk" ? "Saving…" : "Enregistrement…");
    const { data, error } = await supabase.auth.updateUser({ password });
    setLoading(button, false);

    if (error) {
      console.error("Password update error", error);
      showToast(error.message || t("toast.passwordUpdateError"));
      return;
    }

    user = data.user || user;
    passwordRecoveryMode = false;
    $("resetPasswordForm")?.reset();
    window.history.replaceState({}, document.title, passwordResetRedirectUrl());
    showToast(t("toast.passwordUpdated"));
    await routeForUser();
  }

  async function init() {
    preventZoom();
    applyLanguage();
    setSyncState();
    window.addEventListener("online", () => { setSyncState(); loadAll(); });
    window.addEventListener("offline", setSyncState);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }

    bindUI();

    if (!configReady) {
      setView("auth");
      showToast(t("toast.config"));
      qsa("#loginForm button, #signupForm button").forEach(b => b.disabled = true);
      return;
    }

    const recoveryFromUrl = recoveryMarkerInUrl();

    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      const previousUserId = user?.id || null;
      const nextUser = session?.user || null;
      user = nextUser;

      if (event === "PASSWORD_RECOVERY") {
        enterPasswordRecovery();
        return;
      }

      if (passwordRecoveryMode) {
        setView("auth");
        setAuthPanel("reset");
        return;
      }

      if (nextUser?.id === previousUserId) return;
      window.setTimeout(() => routeForUser(), 0);
    });

    const { data } = await supabase.auth.getSession();
    user = data.session?.user || null;

    if (recoveryFromUrl && user) {
      enterPasswordRecovery();
      return;
    }

    await routeForUser();
  }

  async function routeForUser() {
    cleanupRealtime();

    if (passwordRecoveryMode) {
      setView("auth");
      setAuthPanel("reset");
      return;
    }

    if (!user) {
      household = null;
      members = [];
      shopping = [];
      shoppingHistory = [];
      shoppingCategories = [];
      tasks = [];
      homePurchases = [];
      homePurchasePhotoUrls = new Map();
      setView("auth");
      return;
    }

    const { data, error } = await supabase
      .from("household_members")
      .select("household_id, households(id,name,join_code,shared_quote)")
      .eq("user_id", user.id)
      .limit(1);

    if (error) {
      console.error(error);
      showToast(t("toast.loadHomeError"));
      setView("onboarding");
      return;
    }

    const membership = data?.[0];
    if (!membership?.households) {
      setView("onboarding");
      return;
    }

    household = membership.households;
    setView("app");
    await loadAll();
    subscribeRealtime();
    showPage("home");
  }

  async function loadAll() {
    if (!supabase || !household) return;

    const [householdRes, membersRes, shoppingRes, tasksRes, historyRes, categoriesRes, homePurchasesRes] = await Promise.all([
      supabase
        .from("households")
        .select("id,name,join_code,shared_quote")
        .eq("id", household.id)
        .single(),
      supabase
        .from("household_members")
        .select("user_id, profiles(id,display_name,profile_icon,profile_color)")
        .eq("household_id", household.id),
      supabase
        .from("shopping_items")
        .select("*")
        .eq("household_id", household.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("house_tasks")
        .select("*")
        .eq("household_id", household.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("shopping_history")
        .select("*")
        .eq("household_id", household.id)
        .order("last_used_at", { ascending: false })
        .limit(100),
      supabase
        .from("shopping_categories")
        .select("*")
        .eq("household_id", household.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("home_purchases")
        .select("*")
        .eq("household_id", household.id)
        .order("created_at", { ascending: false })
    ]);

    if (householdRes.error || membersRes.error || shoppingRes.error || tasksRes.error || historyRes.error || categoriesRes.error || homePurchasesRes.error) {
      console.error(householdRes.error || membersRes.error || shoppingRes.error || tasksRes.error || historyRes.error || categoriesRes.error || homePurchasesRes.error);
      showToast(t("toast.syncError"));
      return;
    }

    household = householdRes.data || household;
    members = (membersRes.data || []).map(row => ({
      id: row.user_id,
      display_name: row.profiles?.display_name || (currentLang === "uk" ? "Member" : "Membre"),
      profile_icon: row.profiles?.profile_icon || "initial",
      profile_color: profileColor(row.profiles?.profile_color)
    }));
    shopping = shoppingRes.data || [];
    tasks = tasksRes.data || [];
    shoppingHistory = historyRes.data || [];
    shoppingCategories = categoriesRes.data || [];
    homePurchases = homePurchasesRes.data || [];
    await refreshHomePurchasePhotoUrls();
    renderAll();
  }

  function subscribeRealtime() {
    cleanupRealtime();
    realtimeChannel = supabase
      .channel(`household-${household.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "sync_events",
        filter: `household_id=eq.${household.id}`
      }, () => loadAll())
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "household_members",
        filter: `household_id=eq.${household.id}`
      }, () => loadAll())
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setSyncState();
      });
  }

  function cleanupRealtime() {
    if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }

  function memberName(id) {
    return members.find(m => m.id === id)?.display_name || t("common.anyone");
  }

  function currentName() {
    return memberName(user?.id) || user?.user_metadata?.display_name || (currentLang === "uk" ? "you" : "vous");
  }

  function normaliseItemName(value = "") {
    return value
      .trim()
      .toLocaleLowerCase(currentLang === "uk" ? "en-GB" : "fr-FR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }


  function urgentLabel(count) {
    if (currentLang === "uk") return `${count} urgent`;
    return `${count} urgent${count > 1 ? "s" : ""}`;
  }

  function updateHomeUrgentBadge(id, count) {
    const element = $(id);
    if (!element) return;
    element.textContent = urgentLabel(count);
    element.classList.toggle("hidden", !count);
  }

  async function refreshHomePurchasePhotoUrls() {
    homePurchasePhotoUrls = new Map();
    if (!supabase) return;
    const items = homePurchases.filter(item => item.photo_path);
    await Promise.all(items.map(async item => {
      const { data, error } = await supabase.storage
        .from("home-purchases")
        .createSignedUrl(item.photo_path, 60 * 60 * 12);
      if (!error && data?.signedUrl) homePurchasePhotoUrls.set(item.id, data.signedUrl);
    }));
  }

  function clearHomePurchasePreviewObjectUrl() {
    if (homePurchasePreviewObjectUrl) {
      URL.revokeObjectURL(homePurchasePreviewObjectUrl);
      homePurchasePreviewObjectUrl = null;
    }
  }

  function renderHomePurchasePhotoEditor(url = "") {
    const preview = $("homePurchasePhotoPreview");
    const removeButton = $("homePurchaseRemovePhoto");
    const label = $("homePurchasePhotoLabel");
    if (!preview || !removeButton || !label) return;

    if (url) {
      preview.innerHTML = `<img src="${esc(url)}" alt="" />`;
      removeButton.classList.remove("hidden");
      label.textContent = t("purchase.changePhoto");
    } else {
      preview.innerHTML = `<span class="purchase-photo-placeholder"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m5 17 4.5-4 3.2 2.8 2.2-2 4.1 3.2"/></svg></span>`;
      removeButton.classList.add("hidden");
      label.textContent = t("purchase.addPhoto");
    }
  }

  async function prepareHomePurchasePhoto(file) {
    if (!file || !String(file.type || "").startsWith("image/")) throw new Error("invalid-photo");
    if (file.size > 15 * 1024 * 1024) throw new Error("photo-too-large");

    const sourceUrl = URL.createObjectURL(file);
    try {
      let image;
      try {
        image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = sourceUrl;
        });
      } catch {
        return file;
      }

      const maxDimension = 1600;
      const ratio = Math.min(1, maxDimension / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
      if (ratio === 1 && file.size <= 2.5 * 1024 * 1024 && /image\/(jpeg|png|webp)/i.test(file.type)) return file;

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(value => value ? resolve(value) : reject(new Error("photo-convert")), "image/jpeg", .84);
      });
      return new File([blob], `casami-${Date.now()}.jpg`, { type: "image/jpeg" });
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  async function uploadHomePurchasePhoto(item, file) {
    const prepared = await prepareHomePurchasePhoto(file);
    const oldPath = item.photo_path || null;
    const uuid = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = prepared.type === "image/png" ? "png" : prepared.type === "image/webp" ? "webp" : "jpg";
    const path = `${item.household_id}/${item.id}/${uuid}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("home-purchases")
      .upload(path, prepared, { contentType: prepared.type, upsert: false });
    if (uploadError) throw uploadError;

    const { error: updateError } = await supabase
      .from("home_purchases")
      .update({ photo_path: path, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (updateError) {
      await supabase.storage.from("home-purchases").remove([path]);
      throw updateError;
    }

    if (oldPath && oldPath !== path) {
      await supabase.storage.from("home-purchases").remove([oldPath]);
    }
    return path;
  }

  async function removeHomePurchasePhoto(item) {
    if (!item?.photo_path) return;
    const oldPath = item.photo_path;
    const { error: removeError } = await supabase.storage.from("home-purchases").remove([oldPath]);
    if (removeError) throw removeError;
    const { error: updateError } = await supabase
      .from("home_purchases")
      .update({ photo_path: null, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (updateError) throw updateError;
  }

  function renderAll() {
    $("greeting").textContent = currentLang === "uk"
      ? `Hello ${currentName()}!`
      : `Bonjour ${currentName()} !`;
    $("householdCode").textContent = household?.join_code || "—";

    const activeShopping = shopping.filter(x => !x.is_done && !x.saved_for_later).length;
    const laterShopping = shopping.filter(x => !x.is_done && x.saved_for_later).length;
    const boughtShopping = shopping.filter(x => x.is_done).length;
    const urgentShopping = shopping.filter(x => !x.is_done && !x.saved_for_later && x.is_urgent).length;
    const todoTasks = tasks.filter(x => !x.is_done);
    const activeHomePurchases = homePurchases.filter(x => x.status === "todo");
    const laterHomePurchases = homePurchases.filter(x => x.status === "later");
    const boughtHomePurchases = homePurchases.filter(x => x.status === "bought");
    const urgentTasks = todoTasks.filter(x => x.is_urgent).length;
    const urgentPurchases = activeHomePurchases.filter(x => x.is_urgent).length;
    const urgent = urgentTasks + urgentPurchases;

    $("shoppingRemaining").textContent = activeShopping;
    $("urgentRemaining").textContent = urgent;
    $("tasksRemaining").textContent = todoTasks.length;
    $("homePurchaseRemaining").textContent = activeHomePurchases.length;
    updateHomeUrgentBadge("shoppingUrgentHome", urgentShopping);
    updateHomeUrgentBadge("taskUrgentHome", urgentTasks);
    updateHomeUrgentBadge("homePurchaseUrgent", urgentPurchases);

    if ($("homePurchaseAllCount")) $("homePurchaseAllCount").textContent = `(${homePurchases.length})`;
    $("homePurchaseTodoCount").textContent = `(${activeHomePurchases.length})`;
    $("homePurchaseLaterCount").textContent = `(${laterHomePurchases.length})`;
    $("homePurchaseBoughtCount").textContent = `(${boughtHomePurchases.length})`;
    $("shoppingCounter").textContent = currentLang === "uk" ? `${activeShopping} to buy` : `${activeShopping} à acheter`;
    $("shoppingTodoCount").textContent = `(${activeShopping})`;
    $("shoppingLaterCount").textContent = `(${laterShopping})`;
    $("shoppingDoneCount").textContent = `(${boughtShopping})`;

    const me = currentMember();
    if ($("profileName")) $("profileName").textContent = currentName();
    if ($("profileEmail")) $("profileEmail").textContent = user?.email || "";
    if ($("profileAvatar")) {
      $("profileAvatar").textContent = profileIcon(me || { display_name: currentName() });
      $("profileAvatar").style.setProperty("--profile-color", profileColor(me?.profile_color));
    }
    if ($("sharedHomeQuote")) $("sharedHomeQuote").textContent = household?.shared_quote || t("home.quote");
    if ($("sharedQuoteInput") && document.activeElement !== $("sharedQuoteInput")) $("sharedQuoteInput").value = household?.shared_quote || t("home.quote").replace(/^«\s*|\s*»$/g, "");
    if ($("profileHouseholdName")) $("profileHouseholdName").textContent = household?.name || t("onboarding.defaultHome");
    if ($("profileMemberCount")) $("profileMemberCount").textContent = members.length;

    renderCategoryControls();
    renderShopping();
    renderTasks();
    renderHomePurchases();
    renderPriority();
    renderRecent();
    renderMembers();
    renderAssignees();
    renderProfileStyle();
    renderShoppingSuggestions(false);
    updateShoppingActionLabels();
    updateHomePurchaseActionLabels();
  }

  function shoppingStatusRank(item) {
    if (item.is_done) return 2;
    if (item.saved_for_later) return 1;
    return 0;
  }

  function renderShopping() {
    const host = $("shoppingList");
    let shown = [...shopping];

    if (shoppingFilter === "todo") shown = shown.filter(item => !item.is_done && !item.saved_for_later);
    if (shoppingFilter === "later") shown = shown.filter(item => !item.is_done && item.saved_for_later);
    if (shoppingFilter === "done") shown = shown.filter(item => item.is_done);
    if (shoppingCategoryFilter !== "all") shown = shown.filter(item => (item.category || "other") === shoppingCategoryFilter);

    if (!shown.length) {
      host.innerHTML = `<div class="empty-state">${shopping.length ? t("shopping.emptyView") : t("shopping.empty")}</div>`;
      return;
    }

    const ordered = shown.sort((a, b) =>
      categoryRank(a.category || "other") - categoryRank(b.category || "other") ||
      shoppingStatusRank(a) - shoppingStatusRank(b) ||
      Number(b.is_urgent) - Number(a.is_urgent) ||
      new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    );

    const groups = new Map();
    ordered.forEach(item => {
      const key = categoryMeta(item.category || "other").key;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    const renderItem = item => {
      const pending = pendingPurchases.has(item.id);
      const checked = item.is_done || pending;
      const statusClasses = [
        item.is_done ? "done" : "",
        item.saved_for_later && !item.is_done ? "saved-later" : "",
        pending ? "purchase-pending" : ""
      ].filter(Boolean).join(" ");

      return `
        <div class="list-item ${statusClasses}">
          <button class="check-button ${checked ? "checked" : ""}" data-shopping-toggle="${item.id}" data-i18n-aria="shopping.bought" aria-label="${esc(t("shopping.bought"))}">${checked ? "✓" : ""}</button>
          <div class="item-content">
            <div class="item-title">${esc(item.name)}</div>
            <div class="item-meta">
              ${item.is_urgent && !item.is_done ? `<span class="badge urgent">${esc(t("common.urgent"))}</span>` : ""}
              ${item.saved_for_later && !item.is_done ? `<span class="badge later">${esc(t("shopping.savedLater"))}</span>` : ""}
            </div>
          </div>
          ${item.quantity ? `<span class="badge quantity">${esc(item.quantity)}</span>` : ""}
          <button class="item-menu" data-shopping-menu="${item.id}" aria-label="${esc(t("shopping.options"))}">⋮</button>
        </div>
      `;
    };

    const collapsed = getCollapsedCategories();
    host.innerHTML = [...groups.entries()].map(([key, items]) => {
      const meta = categoryMeta(key);
      const isCollapsed = collapsed.has(key);
      return `
        <section class="shopping-category-group ${isCollapsed ? "collapsed" : ""}" data-category-group="${esc(key)}">
          <div class="shopping-category-header">
            <button type="button" class="shopping-category-toggle" data-category-toggle="${esc(key)}" aria-expanded="${isCollapsed ? "false" : "true"}" aria-label="${esc(isCollapsed ? t("category.expand") : t("category.collapse"))}">
              <span class="category-title-wrap"><span class="category-emoji">${esc(meta.emoji || "📦")}</span><strong>${esc(categoryLabel(key))}</strong></span>
              <span class="category-count">${items.length}</span>
              <span class="category-chevron" aria-hidden="true">⌄</span>
            </button>
            <button type="button" class="category-menu-button category-drag-handle" data-category-menu="${esc(key)}" data-category-drag="${esc(key)}" aria-label="${esc(t("category.options"))}">⋮</button>
          </div>
          <div class="shopping-category-items ${isCollapsed ? "hidden" : ""}">${items.map(renderItem).join("")}</div>
        </section>
      `;
    }).join("");
  }

  function renderTasks() {
    const host = $("taskList");
    let shown = [...tasks];

    if (taskFilter === "todo") shown = shown.filter(tk => !tk.is_done);
    if (taskFilter === "done") shown = shown.filter(tk => tk.is_done);
    if (taskFilter === "mine") shown = shown.filter(tk => !tk.is_done && tk.assignee === user.id);

    shown.sort((a, b) =>
      Number(a.is_done) - Number(b.is_done) ||
      Number(b.is_urgent) - Number(a.is_urgent) ||
      new Date(b.created_at) - new Date(a.created_at)
    );

    if (!shown.length) {
      host.innerHTML = `<div class="empty-state">${t("house.empty")}</div>`;
      return;
    }

    host.innerHTML = shown.map(task => `
      <div class="list-item ${task.is_done ? "done" : ""}">
        <button class="check-button ${task.is_done ? "checked" : ""}" data-task-toggle="${task.id}" aria-label="${esc(t("house.done"))}">${task.is_done ? "✓" : ""}</button>
        <div class="item-content">
          <div class="item-title">${esc(task.title)}</div>
          <div class="item-meta">
            ${task.is_urgent && !task.is_done ? `<span class="badge urgent">${esc(t("common.urgent"))}</span>` : ""}
            <span class="badge person">${esc(task.assignee ? memberName(task.assignee) : t("common.anyone"))}</span>
          </div>
        </div>
        <button class="item-menu" data-task-edit="${task.id}" aria-label="${esc(t("common.edit"))}">•••</button>
      </div>
    `).join("");
  }

  function renderPriority() {
    const priorities = [
      ...tasks.filter(task => !task.is_done && task.is_urgent).map(task => ({
        kind: "task", id: task.id, title: task.title, assignee: task.assignee, created_at: task.created_at
      })),
      ...homePurchases.filter(item => item.status === "todo" && item.is_urgent).map(item => ({
        kind: "purchase", id: item.id, title: item.title, assignee: item.assignee, created_at: item.created_at
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
    const host = $("priorityList");
    if (!priorities.length) {
      host.className = "priority-list empty-state compact-empty";
      host.innerHTML = t("home.noUrgent");
      return;
    }
    host.className = "priority-list";
    host.innerHTML = priorities.map(item => `
      <div class="priority-row">
        <span class="priority-alert">!</span>
        <div class="priority-main">
          <strong>${esc(item.title)}</strong>
          <small>${esc(item.kind === "purchase" ? t("recent.purchase") : t("home.today"))} · ${esc(item.assignee ? memberName(item.assignee) : t("common.anyone"))}</small>
        </div>
        <button class="priority-check" ${item.kind === "purchase" ? `data-home-purchase-toggle="${item.id}"` : `data-task-toggle="${item.id}"`} aria-label="${esc(item.kind === "purchase" ? t("purchase.bought") : t("house.done"))}"></button>
      </div>
    `).join("");
  }

  function relativeTime(iso) {
    const date = new Date(iso);
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return t("time.now");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return currentLang === "uk" ? `${minutes} min ago` : `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return currentLang === "uk" ? `${hours} hr ago` : `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return t("time.yesterday");
    return currentLang === "uk" ? `${days} days ago` : `il y a ${days} j`;
  }

  function renderRecent() {
    const host = $("recentList");
    const recent = [
      ...shopping.map(item => ({ kind: "shopping", title: item.name, created_at: item.created_at })),
      ...tasks.map(item => ({ kind: "house", title: item.title, created_at: item.created_at })),
      ...homePurchases.map(item => ({ kind: "purchase", title: item.title, created_at: item.created_at }))
    ]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);

    if (!recent.length) {
      host.className = "recent-list empty-state compact-empty";
      host.innerHTML = t("home.noRecent");
      return;
    }

    host.className = "recent-list";
    host.innerHTML = recent.map(item => {
      const label = item.kind === "shopping" ? t("recent.shopping") : item.kind === "purchase" ? t("recent.purchase") : t("recent.house");
      const icon = item.kind === "shopping"
        ? `<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>`
        : item.kind === "purchase"
          ? `<svg viewBox="0 0 24 24"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>`
          : `<svg viewBox="0 0 24 24"><path d="M3 11.2 12 3l9 8.2"/><path d="M5.5 9.5V21h13V9.5"/></svg>`;
      return `
        <div class="recent-row">
          <span class="recent-icon ${item.kind === "house" ? "house" : item.kind === "purchase" ? "purchase" : ""}">${icon}</span>
          <div class="recent-copy">
            <strong>${esc(item.title)}</strong>
            <small>${esc(label)} · ${esc(relativeTime(item.created_at))}</small>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderMembers() {
    $("membersList").innerHTML = members.map(member => `
      <div class="member-row"><div class="avatar member-profile-avatar" style="--profile-color:${esc(profileColor(member.profile_color))}">${esc(profileIcon(member))}</div><strong>${esc(member.display_name)}</strong></div>
    `).join("");
  }

  function renderProfileStyle() {
    const me = currentMember() || { display_name: currentName(), profile_color: profileStyleDraft.color, profile_icon: profileStyleDraft.icon };
    profileStyleDraft = { color: profileColor(me.profile_color), icon: me.profile_icon || "initial" };
    const iconText = profileStyleDraft.icon === "initial" ? String(currentName() || "C").slice(0, 1).toUpperCase() : profileStyleDraft.icon;
    if ($("profileStylePreview")) {
      $("profileStylePreview").textContent = iconText;
      $("profileStylePreview").style.setProperty("--profile-color", profileStyleDraft.color);
    }
    const initialChoice = document.querySelector(".profile-initial-choice");
    if (initialChoice) initialChoice.textContent = String(currentName() || "C").slice(0, 1).toUpperCase();
    qsa("[data-profile-color]").forEach(button => button.classList.toggle("active", button.dataset.profileColor.toUpperCase() === profileStyleDraft.color.toUpperCase()));
    qsa("[data-profile-icon]").forEach(button => button.classList.toggle("active", button.dataset.profileIcon === profileStyleDraft.icon));
  }

  function renderAssignees() {
    ["taskAssignee", "homePurchaseAssignee"].forEach(id => {
      const select = $(id);
      if (!select) return;
      const previous = select.value;
      select.innerHTML = `<option value="">${esc(t("common.anyone"))}</option>` + members.map(member =>
        `<option value="${member.id}">${esc(member.display_name)}</option>`
      ).join("");
      if ([...select.options].some(option => option.value === previous)) select.value = previous;
    });
  }

  function showPage(page, rerender = true) {
    currentPage = page || "home";
    const labels = {
      home: "CASAMI",
      shopping: t("nav.shopping"),
      house: t("nav.house"),
      purchases: t("nav.purchases"),
      profile: t("nav.profile")
    };
    qsa(".page").forEach(p => p.classList.remove("active"));
    const pageEl = $(`${currentPage}Page`);
    if (pageEl) pageEl.classList.add("active");
    qsa(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.page === currentPage));
    if ($("pageTitle")) $("pageTitle").textContent = labels[currentPage] || "CASAMI";
    if (rerender && currentPage === "shopping") renderShoppingSuggestions(false);
  }

  function openTaskSheet(task = null) {
    $("taskForm").reset();
    $("taskId").value = task?.id || "";
    $("taskTitle").value = task?.title || "";
    $("taskAssignee").value = task?.assignee || "";
    $("taskUrgent").checked = !!task?.is_urgent;
    $("taskSheetTitle").textContent = task ? t("house.editTask") : t("house.newTask");
    $("deleteTaskBtn").classList.toggle("hidden", !task);
    $("taskSheet").classList.remove("hidden");
    setTimeout(() => $("taskTitle").focus(), 100);
  }

  function categoryPickerTitleForTarget() {
    if (categoryPickerTarget === "filter") return t("shopping.filterCategory");
    return t("shopping.category");
  }

  function renderCategoryPicker() {
    const host = $("categoryPickerList");
    if (!host) return;
    $("categoryPickerTitle").textContent = categoryPickerTitleForTarget();
    const selected = categoryPickerTarget === "filter"
      ? shoppingCategoryFilter
      : categoryPickerTarget === "edit"
        ? ($("shoppingEditCategory")?.value || fallbackCategoryKey())
        : newShoppingCategory;
    const rows = [];
    if (categoryPickerTarget === "filter") {
      rows.push(`<div class="category-picker-row category-picker-all ${selected === "all" ? "selected" : ""}"><button class="category-picker-choice" type="button" data-category-choice="all"><span class="category-picker-icon">✦</span><strong>${esc(t("shopping.allCategories"))}</strong><span class="category-picker-check">${selected === "all" ? "✓" : ""}</span></button></div>`);
    }
    rows.push(...allShoppingCategories().map(category => `
      <div class="category-picker-row ${selected === category.key ? "selected" : ""}" data-category-key="${esc(category.key)}">
        <button class="category-picker-choice" type="button" data-category-choice="${esc(category.key)}"><span class="category-picker-icon">${esc(category.emoji || "📦")}</span><strong>${esc(categoryLabel(category.key))}</strong><span class="category-picker-check">${selected === category.key ? "✓" : ""}</span></button>
        <button class="category-picker-drag" type="button" data-category-picker-drag="${esc(category.key)}" aria-label="${esc(t("category.dragHelp"))}">⋮</button>
      </div>
    `));
    host.innerHTML = rows.join("");
  }

  function openCategoryPicker(target) {
    categoryPickerTarget = target;
    renderCategoryPicker();
    $("categoryPickerSheet").classList.remove("hidden");
  }

  function closeCategoryPicker() {
    $("categoryPickerSheet").classList.add("hidden");
    categoryPickerTarget = null;
  }

  function selectCategoryFromPicker(key) {
    if (categoryPickerTarget === "filter") {
      shoppingCategoryFilter = key || "all";
      $("shoppingCategoryFilter").value = shoppingCategoryFilter;
      renderShopping();
    } else if (categoryPickerTarget === "edit") {
      const chosen = categoryMeta(key).key;
      $("shoppingEditCategory").value = chosen;
      $("shoppingEditCategory").dataset.lastValue = chosen;
    } else {
      newShoppingCategory = categoryMeta(key).key;
      $("shoppingCategory").value = newShoppingCategory;
    }
    closeCategoryPicker();
    renderCategoryControls();
  }

  async function saveCategoryOrder(visibleKeys) {
    const keys = visibleKeys.filter(Boolean);
    if (!keys.length) return;
    const full = allShoppingCategories().map(category => category.key);
    const visibleSet = new Set(keys);
    let index = 0;
    const merged = full.map(key => visibleSet.has(key) ? keys[index++] : key);
    const byKey = new Map(allShoppingCategories().map(category => [category.key, category]));
    const updates = merged.map((key, orderIndex) => {
      const category = byKey.get(key);
      if (!category?.id) return Promise.resolve({ error: null });
      return supabase.from("shopping_categories").update({ sort_order: (orderIndex + 1) * 10, updated_at: new Date().toISOString() }).eq("id", category.id);
    });
    const results = await Promise.all(updates);
    if (results.some(result => result.error)) {
      showToast(t("toast.updateError"));
      return;
    }
    await loadAll();
    if (!$("categoryPickerSheet").classList.contains("hidden")) renderCategoryPicker();
  }

  function bindCategoryDrag(container, handleSelector, rowSelector, keyFromRow) {
    if (!container) return;
    container.addEventListener("pointerdown", event => {
      const handle = event.target.closest(handleSelector);
      if (!handle || (event.pointerType === "mouse" && event.button !== 0)) return;
      const row = handle.closest(rowSelector);
      if (!row) return;
      const startX = event.clientX;
      const startY = event.clientY;
      let active = false;
      let cancelled = false;
      const delay = event.pointerType === "mouse" ? 180 : 320;
      const timer = setTimeout(() => {
        if (cancelled) return;
        active = true;
        row.classList.add("category-dragging");
        container.classList.add("category-drag-active");
        try { handle.setPointerCapture(event.pointerId); } catch {}
        if (navigator.vibrate) navigator.vibrate(18);
      }, delay);

      const move = moveEvent => {
        if (!active) {
          if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 10) {
            cancelled = true;
            clearTimeout(timer);
          }
          return;
        }
        moveEvent.preventDefault();
        const hit = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
        const targetRow = hit?.closest(rowSelector);
        if (!targetRow || targetRow === row || !container.contains(targetRow)) return;
        const rect = targetRow.getBoundingClientRect();
        if (moveEvent.clientY < rect.top + rect.height / 2) container.insertBefore(row, targetRow);
        else container.insertBefore(row, targetRow.nextSibling);
      };

      const end = async () => {
        clearTimeout(timer);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (!active) return;
        row.classList.remove("category-dragging");
        container.classList.remove("category-drag-active");
        categoryDragJustEnded = true;
        setTimeout(() => { categoryDragJustEnded = false; }, 350);
        const keys = [...container.querySelectorAll(rowSelector)].map(keyFromRow).filter(Boolean);
        await saveCategoryOrder(keys);
      };

      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end, { once: true });
      window.addEventListener("pointercancel", end, { once: true });
    });
  }

  function openCategoryActions(key) {
    const category = categoryMeta(key);
    categoryActionKey = category.key;
    $("categoryActionName").textContent = categoryDisplay(category.key);

    const ordered = allShoppingCategories();
    const index = ordered.findIndex(row => row.key === category.key);
    $("categoryMoveUpAction").disabled = index <= 0;
    $("categoryMoveDownAction").disabled = index < 0 || index >= ordered.length - 1;
    $("categoryDeleteAction").disabled = !!category.is_fallback;
    $("categoryDeleteAction").classList.toggle("disabled-action", !!category.is_fallback);
    $("categoryActionsSheet").classList.remove("hidden");
  }

  function openCategoryEditor(category = null, returnTarget = null) {
    categoryEditorReturnTarget = returnTarget;
    $("categoryEditForm").reset();
    $("categoryEditId").value = category?.id || "";
    $("categoryEditTitle").textContent = category ? t("category.edit") : t("shopping.addCategory");
    $("categoryNameFr").value = category?.name_fr || "";
    $("categoryNameUk").value = category?.name_en || "";
    $("categoryEmoji").value = category?.emoji || "📦";
    $("categoryActionsSheet").classList.add("hidden");
    $("categoryEditSheet").classList.remove("hidden");
    setTimeout(() => $("categoryNameFr").focus(), 100);
  }

  async function saveCategory(event) {
    event.preventDefault();
    const id = $("categoryEditId").value;
    const nameFr = $("categoryNameFr").value.trim();
    const nameUk = $("categoryNameUk").value.trim();
    const emoji = $("categoryEmoji").value.trim() || "📦";
    if (!nameFr || !nameUk) return;

    let result;
    if (id) {
      result = await supabase
        .from("shopping_categories")
        .update({ name_fr: nameFr, name_en: nameUk, emoji, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
    } else {
      const maxOrder = allShoppingCategories().reduce((max, row) => Math.max(max, Number(row.sort_order || 0)), 0);
      result = await supabase
        .from("shopping_categories")
        .insert({
          household_id: household.id,
          name_fr: nameFr,
          name_en: nameUk,
          emoji,
          sort_order: maxOrder + 10,
          created_by: user.id
        })
        .select()
        .single();
    }

    if (result.error) return showToast(t("toast.updateError"));
    const createdKey = result.data?.category_key;
    const target = categoryEditorReturnTarget;
    categoryEditorReturnTarget = null;
    closeSheets();
    await loadAll();

    if (!id && createdKey && target === "new") {
      newShoppingCategory = createdKey;
      renderCategoryControls();
    } else if (!id && createdKey && target === "edit") {
      fillCategorySelect($("shoppingEditCategory"), { selected: createdKey, allowAdd: true });
      $("shoppingEditCategory").value = createdKey;
      $("shoppingEditCategory").dataset.lastValue = createdKey;
      $("shoppingEditSheet").classList.remove("hidden");
    } else if (!id && createdKey && target === "filter") {
      shoppingCategoryFilter = createdKey;
      renderCategoryControls();
      renderShopping();
    }

    showToast(t(id ? "category.updated" : "category.created"));
  }

  async function moveCategory(direction) {
    const ordered = allShoppingCategories();
    const index = ordered.findIndex(row => row.key === categoryActionKey);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    const current = ordered[index];
    const target = ordered[targetIndex];

    const currentOrder = Number(current.sort_order || index * 10 + 10);
    const targetOrder = Number(target.sort_order || targetIndex * 10 + 10);
    const first = await supabase.from("shopping_categories").update({ sort_order: targetOrder, updated_at: new Date().toISOString() }).eq("id", current.id);
    if (first.error) return showToast(t("toast.updateError"));
    const second = await supabase.from("shopping_categories").update({ sort_order: currentOrder, updated_at: new Date().toISOString() }).eq("id", target.id);
    if (second.error) return showToast(t("toast.updateError"));
    closeSheets();
    await loadAll();
  }

  async function deleteCategory() {
    const category = categoryMeta(categoryActionKey);
    if (!category?.id) return;
    if (category.is_fallback) return showToast(t("category.fallbackProtected"));
    if (!window.confirm(t("category.deleteConfirm"))) return;

    const { error } = await supabase.rpc("delete_shopping_category", { category_id: category.id });
    if (error) return showToast(t("toast.deleteError"));

    if (newShoppingCategory === category.key) newShoppingCategory = fallbackCategoryKey();
    if (shoppingCategoryFilter === category.key) shoppingCategoryFilter = "all";
    categoryActionKey = null;
    closeSheets();
    await loadAll();
    showToast(t("category.deleted"));
  }

  function openShoppingActions(item) {
    if (!item) return;
    shoppingActionItemId = item.id;
    $("shoppingActionName").textContent = item.name;
    updateShoppingActionLabels();
    $("shoppingActionsSheet").classList.remove("hidden");
  }

  function updateShoppingActionLabels() {
    const item = shopping.find(row => row.id === shoppingActionItemId);
    if (!$("shoppingLaterActionText")) return;
    $("shoppingLaterActionText").textContent = item?.saved_for_later && !item?.is_done
      ? t("shopping.backToList")
      : t("shopping.saveLater");
  }

  function openShoppingEditSheet(item) {
    if (!item) return;
    $("shoppingEditForm").reset();
    $("shoppingEditId").value = item.id;
    $("shoppingEditName").value = item.name || "";
    ensureQuantityValue($("shoppingEditQty"), item.quantity || "");
    fillCategorySelect($("shoppingEditCategory"), { selected: item.category || fallbackCategoryKey(), allowAdd: true });
    $("shoppingEditCategory").dataset.lastValue = item.category || fallbackCategoryKey();
    $("shoppingEditUrgent").checked = !!item.is_urgent;
    $("shoppingActionsSheet").classList.add("hidden");
    $("shoppingEditSheet").classList.remove("hidden");
    setTimeout(() => $("shoppingEditName").focus(), 100);
  }

  function closeSheets() {
    $("taskSheet").classList.add("hidden");
    $("shoppingActionsSheet").classList.add("hidden");
    $("shoppingEditSheet").classList.add("hidden");
    $("categoryActionsSheet").classList.add("hidden");
    $("categoryEditSheet").classList.add("hidden");
    $("categoryPickerSheet").classList.add("hidden");
    $("homePurchaseSheet").classList.add("hidden");
    $("homePurchaseActionsSheet").classList.add("hidden");
    $("shareSheet").classList.add("hidden");
  }

  function setNewShoppingUrgent(value) {
    newShoppingUrgent = !!value;
    const button = $("shoppingUrgentBtn");
    button.classList.toggle("active", newShoppingUrgent);
    button.setAttribute("aria-pressed", newShoppingUrgent ? "true" : "false");
  }

  function renderShoppingSuggestions(forceOpen = true) {
    const host = $("shoppingSuggestions");
    const input = $("shoppingName");
    if (!host || !input) return;

    if (!forceOpen && document.activeElement !== input) {
      host.classList.add("hidden");
      return;
    }

    const query = normaliseItemName(input.value);
    const matches = shoppingHistory
      .filter(item => !query || normaliseItemName(item.display_name).includes(query))
      .sort((a, b) => {
        const aName = normaliseItemName(a.display_name);
        const bName = normaliseItemName(b.display_name);
        const aStarts = query && aName.startsWith(query) ? 1 : 0;
        const bStarts = query && bName.startsWith(query) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        return new Date(b.last_used_at) - new Date(a.last_used_at);
      })
      .slice(0, 6);

    if (!matches.length) {
      if (!query && shoppingHistory.length === 0) {
        host.innerHTML = `<div class="suggestion-empty">${esc(t("shopping.noneHistory"))}</div>`;
        host.classList.remove("hidden");
      } else {
        host.classList.add("hidden");
      }
      return;
    }

    host.innerHTML = matches.map(item => `
      <button type="button" class="shopping-suggestion" data-history-id="${item.id}">
        <span class="suggestion-copy">
          <strong>${esc(item.display_name)}</strong>
          <small>${esc(t("shopping.historyHint"))}${item.last_quantity ? ` · ${esc(item.last_quantity)}` : ""}</small>
        </span>
        <span class="suggestion-badges">
          <span class="badge category">${categoryMeta(item.last_category || fallbackCategoryKey()).emoji} ${esc(categoryLabel(item.last_category || fallbackCategoryKey()))}</span>
          ${item.last_urgent ? `<span class="badge urgent">${esc(t("common.urgent"))}</span>` : ""}
        </span>
      </button>
    `).join("");
    host.classList.remove("hidden");
  }

  function chooseShoppingHistory(id) {
    const historyItem = shoppingHistory.find(item => item.id === id);
    if (!historyItem) return;
    $("shoppingName").value = historyItem.display_name || "";
    ensureQuantityValue($("shoppingQty"), historyItem.last_quantity || "");
    newShoppingCategory = categoryMeta(historyItem.last_category || fallbackCategoryKey()).key;
    renderCategoryControls();
    setNewShoppingUrgent(!!historyItem.last_urgent);
    $("shoppingSuggestions").classList.add("hidden");
    $("shoppingQty").focus();
  }

  async function rememberShoppingItem(name, quantity, urgent, category) {
    if (!household || !name.trim()) return;
    const normalized = normaliseItemName(name);
    const existing = shoppingHistory.find(item => item.normalized_name === normalized);
    const payload = {
      household_id: household.id,
      normalized_name: normalized,
      display_name: name.trim(),
      last_quantity: quantity?.trim() || null,
      last_urgent: !!urgent,
      last_category: categoryMeta(category || fallbackCategoryKey()).key,
      use_count: (existing?.use_count || 0) + 1,
      last_used_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("shopping_history")
      .upsert(payload, { onConflict: "household_id,normalized_name" });
    if (error) console.error("shopping history", error);
  }

  async function addShopping() {
    const name = $("shoppingName").value.trim();
    const quantity = $("shoppingQty").value.trim();
    const selectedCategory = $("shoppingCategory").value;
    const category = categoryMeta(selectedCategory === "__add_category__" ? newShoppingCategory : selectedCategory || newShoppingCategory).key;
    if (!name) return;

    const { error } = await supabase.from("shopping_items").insert({
      household_id: household.id,
      name,
      quantity: quantity || null,
      category,
      is_urgent: newShoppingUrgent,
      saved_for_later: false,
      created_by: user.id
    });

    if (error) return showToast(t("toast.addShoppingError"));

    await rememberShoppingItem(name, quantity, newShoppingUrgent, category);
    $("shoppingName").value = "";
    $("shoppingQty").value = "";
    newShoppingCategory = fallbackCategoryKey();
    renderCategoryControls();
    setNewShoppingUrgent(false);
    $("shoppingSuggestions").classList.add("hidden");
    await loadAll();
  }

  async function completeShoppingAfterDelay(id) {
    pendingPurchaseTimers.delete(id);
    if (!pendingPurchases.has(id)) return;
    pendingPurchases.delete(id);

    const item = shopping.find(row => row.id === id);
    if (!item) return renderShopping();

    const { error } = await supabase.from("shopping_items")
      .update({
        is_done: true,
        saved_for_later: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      showToast(t("toast.updateError"));
      renderShopping();
      return;
    }

    await loadAll();
  }

  async function toggleShopping(id) {
    const item = shopping.find(row => row.id === id);
    if (!item) return;

    if (pendingPurchases.has(id)) {
      clearTimeout(pendingPurchaseTimers.get(id));
      pendingPurchaseTimers.delete(id);
      pendingPurchases.delete(id);
      renderShopping();
      return;
    }

    if (item.is_done) {
      const { error } = await supabase.from("shopping_items")
        .update({ is_done: false, saved_for_later: false, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) return showToast(t("toast.updateError"));
      await loadAll();
      return;
    }

    pendingPurchases.add(id);
    renderShopping();
    const timer = setTimeout(() => completeShoppingAfterDelay(id), 2000);
    pendingPurchaseTimers.set(id, timer);
  }

  async function deleteShopping(id) {
    if (pendingPurchases.has(id)) {
      clearTimeout(pendingPurchaseTimers.get(id));
      pendingPurchases.delete(id);
      pendingPurchaseTimers.delete(id);
    }
    const { error } = await supabase.from("shopping_items").delete().eq("id", id);
    if (error) return showToast(t("toast.deleteError"));
    shoppingActionItemId = null;
    closeSheets();
    await loadAll();
  }

  async function toggleSaveForLater(id) {
    const item = shopping.find(row => row.id === id);
    if (!item) return;

    if (pendingPurchases.has(id)) {
      clearTimeout(pendingPurchaseTimers.get(id));
      pendingPurchases.delete(id);
      pendingPurchaseTimers.delete(id);
    }

    const nextLater = !(item.saved_for_later && !item.is_done);
    const { error } = await supabase.from("shopping_items")
      .update({
        saved_for_later: nextLater,
        is_done: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) return showToast(t("toast.updateError"));
    closeSheets();
    showToast(nextLater ? t("toast.savedLater") : t("toast.backToList"));
    await loadAll();
  }

  async function saveShoppingEdit(event) {
    event.preventDefault();
    const id = $("shoppingEditId").value;
    const name = $("shoppingEditName").value.trim();
    const quantity = $("shoppingEditQty").value.trim();
    const categoryValue = $("shoppingEditCategory").value;
    const category = categoryMeta(categoryValue === "__add_category__" ? $("shoppingEditCategory").dataset.lastValue : categoryValue || fallbackCategoryKey()).key;
    const isUrgent = $("shoppingEditUrgent").checked;
    if (!id || !name) return;

    const { error } = await supabase.from("shopping_items")
      .update({
        name,
        quantity: quantity || null,
        category,
        is_urgent: isUrgent,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) return showToast(t("toast.updateError"));
    await rememberShoppingItem(name, quantity, isUrgent, category);
    closeSheets();
    showToast(t("toast.itemUpdated"));
    await loadAll();
  }

  async function clearBought() {
    if (!shopping.some(item => item.is_done)) return showToast(t("toast.noBought"));
    const { error } = await supabase.from("shopping_items")
      .delete()
      .eq("household_id", household.id)
      .eq("is_done", true);
    if (error) return showToast(t("toast.deleteError"));
    await loadAll();
  }

  function setHouseMode(mode) {
    if (mode === "purchases") showPage("purchases");
    else if (mode === "tasks") showPage("house");
  }

  function formatPrice(value) {
    if (value === null || value === undefined || value === "") return "";
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    return new Intl.NumberFormat(currentLang === "uk" ? "en-GB" : "fr-FR", {
      style: "currency", currency: "EUR", maximumFractionDigits: 2
    }).format(number);
  }

  function safeExternalUrl(value) {
    const url = String(value || "").trim();
    return /^https?:\/\//i.test(url) ? url : "";
  }

  function renderHomePurchases() {
    const host = $("homePurchaseList");
    if (!host) return;
    let shown = [...homePurchases];
    if (homePurchaseFilter !== "all") shown = shown.filter(item => item.status === homePurchaseFilter);
    shown.sort((a, b) =>
      Number(b.is_urgent) - Number(a.is_urgent) ||
      new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    );

    if (!shown.length) {
      host.innerHTML = `<div class="empty-state">${esc(t("purchase.empty"))}</div>`;
      return;
    }

    host.innerHTML = shown.map(item => {
      const pending = pendingHomePurchases.has(item.id);
      const bought = item.status === "bought";
      const checked = bought || pending;
      const link = safeExternalUrl(item.url);
      const statusClass = bought ? "done" : item.status === "later" ? "saved-later" : "";
      const photoUrl = homePurchasePhotoUrls.get(item.id) || "";
      const statusText = bought ? t("purchase.bought") : item.status === "later" ? t("purchase.later") : t("purchase.toBuy");
      const statusTone = bought ? "status-bought" : item.status === "later" ? "status-later-badge" : "status-tobuy";

      return `
        <article class="purchase-product-card ${statusClass} ${pending ? "purchase-pending" : ""}">
          <button class="purchase-product-check check-button ${checked ? "checked" : ""}" data-home-purchase-toggle="${item.id}" aria-label="${esc(t("purchase.bought"))}">${checked ? "✓" : ""}</button>
          ${photoUrl
            ? `<button type="button" class="purchase-product-photo has-photo photo-zoom-button" data-photo-view="${esc(item.id)}" aria-label="${esc(t("purchase.photo"))}"><img src="${esc(photoUrl)}" alt="" loading="lazy" /></button>`
            : `<div class="purchase-product-photo"><svg viewBox="0 0 24 24"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg></div>`}
          <div class="purchase-product-content">
            <div class="purchase-product-title-row">
              <strong>${esc(item.title)}</strong>
              ${item.is_private ? `<span class="badge private-badge">⌾ ${esc(t("purchase.privateBadge"))}</span>` : ""}
            </div>
            ${item.note ? `<small class="purchase-product-note">${esc(item.note)}</small>` : ""}
            <div class="purchase-product-price">${item.estimated_price !== null && item.estimated_price !== undefined ? esc(formatPrice(item.estimated_price)) : ""}</div>
            <div class="purchase-product-meta">
              ${item.is_urgent && !bought ? `<span class="badge urgent">${esc(t("common.urgent"))}</span>` : ""}
              <span class="badge person">${esc(item.assignee ? memberName(item.assignee) : t("common.anyone"))}</span>
              <span class="badge purchase-status-badge ${statusTone}">${esc(statusText)}</span>
            </div>
          </div>
          <div class="purchase-product-actions">
            ${link ? `<a class="purchase-link-button" href="${esc(link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t("purchase.linkOpen"))}">↗</a>` : ""}
            <button class="item-menu" data-home-purchase-menu="${item.id}" aria-label="${esc(t("purchase.options"))}">⋮</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function openHomePurchaseSheet(item = null) {
    $("homePurchaseForm").reset();
    clearHomePurchasePreviewObjectUrl();
    homePurchasePhotoFile = null;
    homePurchaseRemovePhoto = false;
    homePurchaseEditingPhotoPath = item?.photo_path || null;
    $("homePurchasePhotoInput").value = "";
    $("homePurchaseId").value = item?.id || "";
    $("homePurchaseTitle").value = item?.title || "";
    $("homePurchaseAssignee").value = item?.assignee || "";
    $("homePurchasePrice").value = item?.estimated_price ?? "";
    $("homePurchaseStatus").value = item?.status || "todo";
    $("homePurchaseNote").value = item?.note || "";
    $("homePurchaseUrl").value = item?.url || "";
    $("homePurchaseUrgentToggle").checked = !!item?.is_urgent;
    $("homePurchasePrivateToggle").checked = !!item?.is_private;
    if (item?.is_private) {
      $("homePurchaseAssignee").value = user.id;
      $("homePurchaseAssignee").disabled = true;
    } else {
      $("homePurchaseAssignee").disabled = false;
    }
    renderHomePurchasePhotoEditor(item ? (homePurchasePhotoUrls.get(item.id) || "") : "");
    $("homePurchaseSheetTitle").textContent = item ? t("purchase.edit") : t("purchase.new");
    $("homePurchaseSheet").classList.remove("hidden");
    setTimeout(() => $("homePurchaseTitle").focus(), 100);
  }

  function openHomePurchaseActions(item) {
    if (!item) return;
    homePurchaseActionId = item.id;
    $("homePurchaseActionName").textContent = item.title;
    updateHomePurchaseActionLabels();
    $("homePurchaseActionsSheet").classList.remove("hidden");
  }

  function updateHomePurchaseActionLabels() {
    const item = homePurchases.find(row => row.id === homePurchaseActionId);
    if (!item) return;
    $("homePurchaseLaterActionText").textContent = item.status === "later" ? t("purchase.backToBuy") : t("purchase.saveLater");
    $("homePurchaseBoughtActionText").textContent = item.status === "bought" ? t("purchase.markToBuy") : t("purchase.markBought");
  }

  async function saveHomePurchase(event) {
    event.preventDefault();
    const submitButton = event.submitter;
    const id = $("homePurchaseId").value;
    const title = $("homePurchaseTitle").value.trim();
    if (!title) return;

    const priceValue = $("homePurchasePrice").value.trim();
    const status = $("homePurchaseStatus").value || "todo";
    const isPrivate = $("homePurchasePrivateToggle").checked;
    const payload = {
      household_id: household.id,
      title,
      assignee: isPrivate ? user.id : ($("homePurchaseAssignee").value || null),
      is_urgent: $("homePurchaseUrgentToggle").checked,
      is_private: isPrivate,
      estimated_price: priceValue === "" ? null : Number(priceValue),
      note: $("homePurchaseNote").value.trim() || null,
      url: $("homePurchaseUrl").value.trim() || null,
      status,
      bought_by: status === "bought" ? user.id : null,
      bought_at: status === "bought" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    if (payload.estimated_price !== null && (!Number.isFinite(payload.estimated_price) || payload.estimated_price < 0)) return;

    setLoading(submitButton, true, currentLang === "uk" ? "Saving…" : "Enregistrement…");
    try {
      let result;
      if (id) {
        result = await supabase.from("home_purchases").update(payload).eq("id", id).select().single();
      } else {
        payload.created_by = user.id;
        result = await supabase.from("home_purchases").insert(payload).select().single();
      }
      if (result.error || !result.data) {
        showToast(t("purchase.saveError"));
        return;
      }

      const savedItem = result.data;
      try {
        if (homePurchasePhotoFile) {
          await uploadHomePurchasePhoto(savedItem, homePurchasePhotoFile);
        } else if (homePurchaseRemovePhoto && savedItem.photo_path) {
          await removeHomePurchasePhoto(savedItem);
        }
      } catch (photoError) {
        console.error(photoError);
        showToast(photoError?.message === "photo-too-large" ? t("purchase.photoTooLarge") : t("purchase.photoError"));
      }

      closeSheets();
      clearHomePurchasePreviewObjectUrl();
      homePurchasePhotoFile = null;
      homePurchaseRemovePhoto = false;
      homePurchaseEditingPhotoPath = null;
      if (id) showToast(t("purchase.updated"));
      await loadAll();
    } finally {
      setLoading(submitButton, false);
    }
  }

  async function completeHomePurchaseAfterDelay(id) {
    pendingHomePurchaseTimers.delete(id);
    if (!pendingHomePurchases.has(id)) return;
    pendingHomePurchases.delete(id);
    const { error } = await supabase.from("home_purchases").update({
      status: "bought",
      bought_by: user.id,
      bought_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) {
      showToast(t("toast.updateError"));
      renderHomePurchases();
      return;
    }
    await loadAll();
  }

  async function toggleHomePurchase(id) {
    const item = homePurchases.find(row => row.id === id);
    if (!item) return;

    if (pendingHomePurchases.has(id)) {
      clearTimeout(pendingHomePurchaseTimers.get(id));
      pendingHomePurchaseTimers.delete(id);
      pendingHomePurchases.delete(id);
      renderHomePurchases();
      renderPriority();
      return;
    }

    if (item.status === "bought") {
      const { error } = await supabase.from("home_purchases").update({
        status: "todo", bought_by: null, bought_at: null, updated_at: new Date().toISOString()
      }).eq("id", id);
      if (error) return showToast(t("toast.updateError"));
      await loadAll();
      return;
    }

    pendingHomePurchases.add(id);
    renderHomePurchases();
    const timer = setTimeout(() => completeHomePurchaseAfterDelay(id), 2000);
    pendingHomePurchaseTimers.set(id, timer);
  }

  async function setHomePurchaseStatus(id, status) {
    const item = homePurchases.find(row => row.id === id);
    if (!item) return;
    if (pendingHomePurchases.has(id)) {
      clearTimeout(pendingHomePurchaseTimers.get(id));
      pendingHomePurchaseTimers.delete(id);
      pendingHomePurchases.delete(id);
    }
    const nextStatus = status;
    const { error } = await supabase.from("home_purchases").update({
      status: nextStatus,
      bought_by: nextStatus === "bought" ? user.id : null,
      bought_at: nextStatus === "bought" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) return showToast(t("toast.updateError"));
    closeSheets();
    await loadAll();
  }

  async function toggleHomePurchaseLater(id) {
    const item = homePurchases.find(row => row.id === id);
    if (!item) return;
    const next = item.status === "later" ? "todo" : "later";
    await setHomePurchaseStatus(id, next);
    showToast(next === "later" ? t("purchase.savedLater") : t("purchase.backToList"));
  }

  async function toggleHomePurchaseBoughtAction(id) {
    const item = homePurchases.find(row => row.id === id);
    if (!item) return;
    await setHomePurchaseStatus(id, item.status === "bought" ? "todo" : "bought");
  }

  async function deleteHomePurchase(id) {
    if (!id) return;
    if (pendingHomePurchases.has(id)) {
      clearTimeout(pendingHomePurchaseTimers.get(id));
      pendingHomePurchaseTimers.delete(id);
      pendingHomePurchases.delete(id);
    }
    const item = homePurchases.find(row => row.id === id);
    if (item?.photo_path) {
      const { error: photoDeleteError } = await supabase.storage.from("home-purchases").remove([item.photo_path]);
      if (photoDeleteError) console.warn(photoDeleteError);
    }
    const { error } = await supabase.from("home_purchases").delete().eq("id", id);
    if (error) return showToast(t("toast.deleteError"));
    homePurchaseActionId = null;
    closeSheets();
    await loadAll();
  }

  async function saveProfileStyle(partial) {
    const me = currentMember();
    profileStyleDraft = {
      color: profileColor(partial.color || profileStyleDraft.color || me?.profile_color),
      icon: partial.icon || profileStyleDraft.icon || me?.profile_icon || "initial"
    };
    if (me) {
      me.profile_color = profileStyleDraft.color;
      me.profile_icon = profileStyleDraft.icon;
    }
    renderProfileStyle();
    const payload = {};
    if (partial.color) payload.profile_color = profileStyleDraft.color;
    if (partial.icon) payload.profile_icon = profileStyleDraft.icon;
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    if (error) {
      showToast(t("toast.updateError"));
      await loadAll();
      return;
    }
    await loadAll();
    showToast(t("profile.styleSaved"));
  }

  async function saveSharedQuote() {
    const value = $("sharedQuoteInput").value.trim();
    if (!value) return;
    const button = $("saveSharedQuoteBtn");
    setLoading(button, true, currentLang === "uk" ? "Saving…" : "Enregistrement…");
    const { error } = await supabase.from("households").update({ shared_quote: value }).eq("id", household.id);
    setLoading(button, false);
    if (error) return showToast(t("toast.updateError"));
    household.shared_quote = value;
    renderAll();
    showToast(t("profile.quoteSaved"));
  }

  function openPhotoViewer(itemId) {
    const url = homePurchasePhotoUrls.get(itemId);
    if (!url) return;
    $("photoViewerImage").src = url;
    $("photoViewer").classList.remove("hidden");
    $("photoViewer").setAttribute("aria-hidden", "false");
  }

  function closePhotoViewer() {
    $("photoViewer").classList.add("hidden");
    $("photoViewer").setAttribute("aria-hidden", "true");
    $("photoViewerImage").src = "";
    $("photoViewer").style.transform = "";
    $("photoViewerImage").style.transform = "";
  }

  function bindPhotoViewerSwipe() {
    const viewer = $("photoViewer");
    let startY = 0;
    let deltaY = 0;
    viewer.addEventListener("pointerdown", event => {
      if (event.target.closest("#closePhotoViewer")) return;
      startY = event.clientY;
      deltaY = 0;
      const move = moveEvent => {
        deltaY = Math.max(0, moveEvent.clientY - startY);
        if (!deltaY) return;
        moveEvent.preventDefault();
        $("photoViewerImage").style.transform = `translateY(${deltaY}px) scale(${Math.max(.88, 1 - deltaY / 1200)})`;
        viewer.style.background = `rgba(20,25,31,${Math.max(.15, .92 - deltaY / 500)})`;
      };
      const end = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (deltaY > 95) closePhotoViewer();
        else {
          $("photoViewerImage").style.transform = "";
          viewer.style.background = "";
        }
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end, { once: true });
      window.addEventListener("pointercancel", end, { once: true });
    });
  }

  function dismissSheetBackdrop(backdrop) {
    if (!backdrop || backdrop.classList.contains("hidden")) return;
    const sheet = backdrop.querySelector(".sheet");
    if (!sheet) { backdrop.classList.add("hidden"); return; }
    sheet.classList.add("sheet-dismissing");
    setTimeout(() => {
      backdrop.classList.add("hidden");
      sheet.classList.remove("sheet-dismissing", "sheet-dragging");
      sheet.style.transform = "";
      sheet.style.transition = "";
      sheet.style.opacity = "";
    }, 170);
  }

  function bindSwipeSheets() {
    qsa(".sheet-backdrop").forEach(backdrop => {
      const sheet = backdrop.querySelector(".sheet");
      if (!sheet || sheet.dataset.swipeBound === "true") return;
      sheet.dataset.swipeBound = "true";
      sheet.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse") return;
        if (sheet.scrollTop > 2) return;
        const startY = event.clientY;
        const startX = event.clientX;
        let deltaY = 0;
        let dragging = false;
        const move = moveEvent => {
          const dy = moveEvent.clientY - startY;
          const dx = moveEvent.clientX - startX;
          if (!dragging && (dy < 8 || Math.abs(dx) > Math.abs(dy))) return;
          dragging = true;
          deltaY = Math.max(0, dy);
          moveEvent.preventDefault();
          sheet.classList.add("sheet-dragging");
          sheet.style.transform = `translateY(${deltaY}px)`;
          sheet.style.opacity = String(Math.max(.68, 1 - deltaY / 500));
        };
        const end = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", end);
          window.removeEventListener("pointercancel", end);
          if (!dragging) return;
          if (deltaY > 105) dismissSheetBackdrop(backdrop);
          else {
            sheet.style.transition = "transform .18s ease, opacity .18s ease";
            sheet.style.transform = "translateY(0)";
            sheet.style.opacity = "1";
            setTimeout(() => { sheet.classList.remove("sheet-dragging"); sheet.style.transition = ""; sheet.style.transform = ""; sheet.style.opacity = ""; }, 190);
          }
        };
        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", end, { once: true });
        window.addEventListener("pointercancel", end, { once: true });
      });
    });
  }

  async function saveTask(event) {
    event.preventDefault();
    const id = $("taskId").value;
    const payload = {
      household_id: household.id,
      title: $("taskTitle").value.trim(),
      assignee: $("taskAssignee").value || null,
      is_urgent: $("taskUrgent").checked,
      updated_at: new Date().toISOString()
    };
    if (!payload.title) return;

    let result;
    if (id) {
      result = await supabase.from("house_tasks").update(payload).eq("id", id);
    } else {
      payload.created_by = user.id;
      result = await supabase.from("house_tasks").insert(payload);
    }

    if (result.error) return showToast(t("toast.saveTaskError"));
    closeSheets();
    await loadAll();
  }

  async function toggleTask(id) {
    const task = tasks.find(row => row.id === id);
    if (!task) return;
    const next = !task.is_done;
    const { error } = await supabase.from("house_tasks").update({
      is_done: next,
      completed_by: next ? user.id : null,
      completed_at: next ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) return showToast(t("toast.updateError"));
    await loadAll();
  }

  async function deleteTask() {
    const id = $("taskId").value;
    if (!id) return;
    const { error } = await supabase.from("house_tasks").delete().eq("id", id);
    if (error) return showToast(t("toast.deleteError"));
    closeSheets();
    await loadAll();
  }

  async function createHousehold() {
    const button = $("createHouseholdBtn");
    setLoading(button, true);
    const name = $("householdName").value.trim() || t("onboarding.defaultHome");
    const { data, error } = await supabase.rpc("create_household", { household_name: name });
    setLoading(button, false);
    if (error) return showToast(error.message || t("toast.createError"));
    await routeForUser();
    if (data?.[0]?.join_code) {
      showToast(currentLang === "uk" ? `Home created: ${data[0].join_code}` : `Maison créée : ${data[0].join_code}`);
    }
  }

  async function joinHousehold() {
    const button = $("joinHouseholdBtn");
    const code = $("joinCode").value.trim().toUpperCase();
    if (!code) return;
    setLoading(button, true);
    const { error } = await supabase.rpc("join_household", { household_code: code });
    setLoading(button, false);
    if (error) return showToast(t("toast.invalidCode"));
    await routeForUser();
    showToast(t("toast.joined"));
  }

  async function login(event) {
    event.preventDefault();
    const button = event.submitter;
    setLoading(button, true);
    const { error } = await supabase.auth.signInWithPassword({
      email: $("loginEmail").value.trim(),
      password: $("loginPassword").value
    });
    setLoading(button, false);
    if (error) showToast(t("toast.loginError"));
  }

  async function signup(event) {
    event.preventDefault();
    const button = event.submitter;
    setLoading(button, true);
    const displayName = $("signupName").value.trim();
    const { data, error } = await supabase.auth.signUp({
      email: $("signupEmail").value.trim(),
      password: $("signupPassword").value,
      options: { data: { display_name: displayName } }
    });
    setLoading(button, false);
    if (error) return showToast(error.message || t("toast.accountError"));
    if (!data.session) {
      showToast(t("toast.verifyEmail"));
    } else {
      user = data.user;
      await routeForUser();
    }
  }


  async function changePasswordFromProfile(event) {
    event.preventDefault();
    const button = event.submitter;
    const password = $("profileNewPassword").value;
    const confirmation = $("profileConfirmPassword").value;

    if (password.length < 8) return showToast(t("toast.passwordTooShort"));
    if (password !== confirmation) return showToast(t("toast.passwordMismatch"));

    setLoading(button, true, currentLang === "uk" ? "Saving…" : "Enregistrement…");
    const { data, error } = await supabase.auth.updateUser({ password });
    setLoading(button, false);

    if (error) {
      console.error("Profile password update error", error);
      showToast(error.message || t("toast.passwordUpdateError"));
      return;
    }

    user = data.user || user;
    $("changePasswordForm").reset();
    $("changePasswordSheet").classList.add("hidden");
    showToast(t("toast.passwordChanged"));
  }

  async function logout() {
    closeSheets();
    cleanupRealtime();
    await supabase.auth.signOut();
  }

  function bindUI() {
    qsa("[data-lang]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));

    qsa("[data-auth-tab]").forEach(button => button.addEventListener("click", () => {
      setAuthPanel(button.dataset.authTab);
    }));

    $("forgotPasswordLink").addEventListener("click", () => {
      const email = $("loginEmail").value.trim();
      if (email) $("forgotPasswordEmail").value = email;
      setAuthPanel("forgot");
    });
    $("backToLoginBtn").addEventListener("click", () => setAuthPanel("login"));
    $("loginForm").addEventListener("submit", login);
    $("signupForm").addEventListener("submit", signup);
    $("forgotPasswordForm").addEventListener("submit", requestPasswordReset);
    $("resetPasswordForm").addEventListener("submit", saveRecoveredPassword);
    $("createHouseholdBtn").addEventListener("click", createHousehold);
    $("joinHouseholdBtn").addEventListener("click", joinHousehold);
    $("logoutOnboarding").addEventListener("click", logout);
    $("logoutBtn").addEventListener("click", logout);

    qsa(".nav-button").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
    qsa("[data-go]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.go)));
    qsa("[data-page-jump]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.pageJump)));
    qsa("[data-house-mode-jump]").forEach(button => button.addEventListener("click", () => {
      setHouseMode(button.dataset.houseModeJump);
      showPage("house");
    }));
    qsa("[data-house-mode]").forEach(button => button.addEventListener("click", () => setHouseMode(button.dataset.houseMode)));

    qsa("#shoppingFilters [data-shopping-filter]").forEach(button => button.addEventListener("click", () => {
      shoppingFilter = button.dataset.shoppingFilter;
      qsa("#shoppingFilters [data-shopping-filter]").forEach(x => x.classList.toggle("active", x === button));
      renderShopping();
    }));

    $("shoppingUrgentBtn").addEventListener("click", () => setNewShoppingUrgent(!newShoppingUrgent));
    $("shoppingCategoryTrigger").addEventListener("click", () => openCategoryPicker("new"));
    $("shoppingCategoryFilterTrigger").addEventListener("click", () => openCategoryPicker("filter"));
    $("shoppingEditCategoryTrigger").addEventListener("click", () => openCategoryPicker("edit"));
    $("shoppingCategory").addEventListener("change", event => {
      newShoppingCategory = categoryMeta(event.target.value).key;
      renderCategoryControls();
    });
    $("shoppingCategoryFilter").addEventListener("change", event => {
      shoppingCategoryFilter = event.target.value || "all";
      renderCategoryControls();
      renderShopping();
    });
    $("addShoppingBtn").addEventListener("click", addShopping);
    $("shoppingName").addEventListener("keydown", event => { if (event.key === "Enter") addShopping(); });
    $("shoppingQty").addEventListener("keydown", event => { if (event.key === "Enter") addShopping(); });
    $("shoppingName").addEventListener("focus", () => renderShoppingSuggestions(true));
    $("shoppingName").addEventListener("input", () => renderShoppingSuggestions(true));
    $("clearBoughtBtn").addEventListener("click", clearBought);

    $("shoppingSuggestions").addEventListener("mousedown", event => event.preventDefault());
    $("shoppingSuggestions").addEventListener("click", event => {
      const suggestion = event.target.closest("[data-history-id]");
      if (suggestion) chooseShoppingHistory(suggestion.dataset.historyId);
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(".shopping-add-area")) $("shoppingSuggestions").classList.add("hidden");
    });

    $("shoppingList").addEventListener("click", event => {
      const toggle = event.target.closest("[data-shopping-toggle]");
      const menu = event.target.closest("[data-shopping-menu]");
      const categoryToggle = event.target.closest("[data-category-toggle]");
      const categoryMenu = event.target.closest("[data-category-menu]");
      if (toggle) toggleShopping(toggle.dataset.shoppingToggle);
      if (menu) openShoppingActions(shopping.find(item => item.id === menu.dataset.shoppingMenu));
      if (categoryToggle) toggleCategoryCollapsed(categoryToggle.dataset.categoryToggle);
      if (categoryMenu && !categoryDragJustEnded) openCategoryActions(categoryMenu.dataset.categoryMenu);
    });

    $("closeShoppingActions").addEventListener("click", closeSheets);
    $("shoppingActionsSheet").addEventListener("click", event => { if (event.target === $("shoppingActionsSheet")) closeSheets(); });
    $("shoppingEditAction").addEventListener("click", () => openShoppingEditSheet(shopping.find(item => item.id === shoppingActionItemId)));
    $("shoppingLaterAction").addEventListener("click", () => toggleSaveForLater(shoppingActionItemId));
    $("shoppingDeleteAction").addEventListener("click", () => deleteShopping(shoppingActionItemId));

    $("shoppingEditForm").addEventListener("submit", saveShoppingEdit);
    $("shoppingEditCategory").addEventListener("change", event => {
      event.target.dataset.lastValue = event.target.value;
      renderCategoryControls();
    });
    $("closeShoppingEdit").addEventListener("click", closeSheets);
    $("shoppingEditSheet").addEventListener("click", event => { if (event.target === $("shoppingEditSheet")) closeSheets(); });

    $("closeCategoryPicker").addEventListener("click", closeCategoryPicker);
    $("categoryPickerSheet").addEventListener("click", event => { if (event.target === $("categoryPickerSheet")) closeCategoryPicker(); });
    $("categoryPickerList").addEventListener("click", event => {
      if (categoryDragJustEnded) return;
      const choice = event.target.closest("[data-category-choice]");
      if (choice) selectCategoryFromPicker(choice.dataset.categoryChoice);
    });
    $("categoryPickerAdd").addEventListener("click", () => {
      const target = categoryPickerTarget || "new";
      $("categoryPickerSheet").classList.add("hidden");
      openCategoryEditor(null, target);
    });
    bindCategoryDrag($("categoryPickerList"), "[data-category-picker-drag]", ".category-picker-row[data-category-key]", row => row.dataset.categoryKey);
    bindCategoryDrag($("shoppingList"), "[data-category-drag]", ".shopping-category-group[data-category-group]", row => row.dataset.categoryGroup);

    $("closeCategoryActions").addEventListener("click", closeSheets);
    $("categoryActionsSheet").addEventListener("click", event => { if (event.target === $("categoryActionsSheet")) closeSheets(); });
    $("categoryEditAction").addEventListener("click", () => openCategoryEditor(categoryMeta(categoryActionKey)));
    $("categoryMoveUpAction").addEventListener("click", () => moveCategory(-1));
    $("categoryMoveDownAction").addEventListener("click", () => moveCategory(1));
    $("categoryDeleteAction").addEventListener("click", deleteCategory);
    $("categoryEditForm").addEventListener("submit", saveCategory);
    $("closeCategoryEdit").addEventListener("click", closeSheets);
    $("categoryEditSheet").addEventListener("click", event => { if (event.target === $("categoryEditSheet")) closeSheets(); });

    $("priorityList").addEventListener("click", event => {
      const toggle = event.target.closest("[data-task-toggle]");
      const purchaseToggle = event.target.closest("[data-home-purchase-toggle]");
      if (toggle) toggleTask(toggle.dataset.taskToggle);
      if (purchaseToggle) toggleHomePurchase(purchaseToggle.dataset.homePurchaseToggle);
    });

    $("openTaskComposer").addEventListener("click", () => openTaskSheet());
    $("taskForm").addEventListener("submit", saveTask);
    $("closeTaskSheet").addEventListener("click", closeSheets);
    $("deleteTaskBtn").addEventListener("click", deleteTask);
    $("taskSheet").addEventListener("click", event => { if (event.target === $("taskSheet")) closeSheets(); });

    $("taskList").addEventListener("click", event => {
      const toggle = event.target.closest("[data-task-toggle]");
      const edit = event.target.closest("[data-task-edit]");
      if (toggle) toggleTask(toggle.dataset.taskToggle);
      if (edit) openTaskSheet(tasks.find(task => task.id === edit.dataset.taskEdit));
    });

    qsa("#taskFilters [data-filter]").forEach(button => button.addEventListener("click", () => {
      taskFilter = button.dataset.filter;
      qsa("#taskFilters [data-filter]").forEach(x => x.classList.toggle("active", x === button));
      renderTasks();
    }));

    qsa("#homePurchaseFilters [data-purchase-filter]").forEach(button => button.addEventListener("click", () => {
      homePurchaseFilter = button.dataset.purchaseFilter;
      qsa("#homePurchaseFilters [data-purchase-filter]").forEach(x => x.classList.toggle("active", x === button));
      renderHomePurchases();
    }));

    $("openHomePurchaseComposer").addEventListener("click", () => openHomePurchaseSheet());
    $("homePurchasePrivateToggle").addEventListener("change", event => {
      const isPrivate = event.target.checked;
      if (isPrivate) $("homePurchaseAssignee").value = user.id;
      $("homePurchaseAssignee").disabled = isPrivate;
    });
    $("homePurchasePhotoPicker").addEventListener("click", () => $("homePurchasePhotoInput").click());
    $("homePurchasePhotoInput").addEventListener("change", event => {
      const file = event.target.files?.[0] || null;
      if (!file) return;
      if (!String(file.type || "").startsWith("image/") || file.size > 15 * 1024 * 1024) {
        showToast(t("purchase.photoTooLarge"));
        event.target.value = "";
        return;
      }
      clearHomePurchasePreviewObjectUrl();
      homePurchasePhotoFile = file;
      homePurchaseRemovePhoto = false;
      homePurchasePreviewObjectUrl = URL.createObjectURL(file);
      renderHomePurchasePhotoEditor(homePurchasePreviewObjectUrl);
    });
    $("homePurchaseRemovePhoto").addEventListener("click", () => {
      clearHomePurchasePreviewObjectUrl();
      homePurchasePhotoFile = null;
      homePurchaseRemovePhoto = !!homePurchaseEditingPhotoPath;
      $("homePurchasePhotoInput").value = "";
      renderHomePurchasePhotoEditor("");
    });
    $("homePurchaseForm").addEventListener("submit", saveHomePurchase);
    $("closeHomePurchaseSheet").addEventListener("click", closeSheets);
    $("homePurchaseSheet").addEventListener("click", event => { if (event.target === $("homePurchaseSheet")) closeSheets(); });
    $("homePurchaseList").addEventListener("click", event => {
      const toggle = event.target.closest("[data-home-purchase-toggle]");
      const menu = event.target.closest("[data-home-purchase-menu]");
      const photo = event.target.closest("[data-photo-view]");
      if (toggle) toggleHomePurchase(toggle.dataset.homePurchaseToggle);
      if (photo) openPhotoViewer(photo.dataset.photoView);
      if (menu) openHomePurchaseActions(homePurchases.find(item => item.id === menu.dataset.homePurchaseMenu));
    });
    $("closeHomePurchaseActions").addEventListener("click", closeSheets);
    $("homePurchaseActionsSheet").addEventListener("click", event => { if (event.target === $("homePurchaseActionsSheet")) closeSheets(); });
    $("homePurchaseEditAction").addEventListener("click", () => {
      const item = homePurchases.find(row => row.id === homePurchaseActionId);
      $("homePurchaseActionsSheet").classList.add("hidden");
      openHomePurchaseSheet(item);
    });
    $("homePurchaseLaterAction").addEventListener("click", () => toggleHomePurchaseLater(homePurchaseActionId));
    $("homePurchaseBoughtAction").addEventListener("click", () => toggleHomePurchaseBoughtAction(homePurchaseActionId));
    $("homePurchaseDeleteAction").addEventListener("click", () => deleteHomePurchase(homePurchaseActionId));

    $("openHouseholdInfo").addEventListener("click", () => $("shareSheet").classList.remove("hidden"));
    $("profileShareBtn").addEventListener("click", () => $("shareSheet").classList.remove("hidden"));
    $("profileChangePasswordBtn").addEventListener("click", () => {
      $("changePasswordForm").reset();
      $("changePasswordSheet").classList.remove("hidden");
      requestAnimationFrame(() => $("profileNewPassword")?.focus());
    });
    $("closeChangePasswordSheet").addEventListener("click", () => $("changePasswordSheet").classList.add("hidden"));
    $("changePasswordSheet").addEventListener("click", event => {
      if (event.target === $("changePasswordSheet")) $("changePasswordSheet").classList.add("hidden");
    });
    $("changePasswordForm").addEventListener("submit", changePasswordFromProfile);
    $("profileColorChoices").addEventListener("click", event => {
      const choice = event.target.closest("[data-profile-color]");
      if (choice) saveProfileStyle({ color: choice.dataset.profileColor });
    });
    $("profileIconChoices").addEventListener("click", event => {
      const choice = event.target.closest("[data-profile-icon]");
      if (choice) saveProfileStyle({ icon: choice.dataset.profileIcon });
    });
    $("saveSharedQuoteBtn").addEventListener("click", saveSharedQuote);
    $("sharedQuoteInput").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); saveSharedQuote(); } });
    $("closePhotoViewer").addEventListener("click", closePhotoViewer);
    $("photoViewer").addEventListener("click", event => { if (event.target === $("photoViewer")) closePhotoViewer(); });
    bindPhotoViewerSwipe();
    bindSwipeSheets();
    $("profileLogoutBtn").addEventListener("click", logout);
    $("closeShareSheet").addEventListener("click", closeSheets);
    $("shareSheet").addEventListener("click", event => { if (event.target === $("shareSheet")) closeSheets(); });
    $("copyCodeBtn").addEventListener("click", async () => {
      const code = household?.join_code || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast(t("toast.copied"));
      } catch {
        showToast(`Code: ${code}`);
      }
    });
  }

  init();
})();

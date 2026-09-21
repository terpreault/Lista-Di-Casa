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
      "auth.tagline": "À deux, simplement.",
      "auth.subtitle": "Courses et petites choses de la maison, toujours synchronisées.",
      "auth.loginTab": "Connexion",
      "auth.signupTab": "Créer un compte",
      "auth.loginButton": "Se connecter",
      "auth.createAccount": "Créer mon compte",
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
      "home.underControl": "Tout est sous contrôle",
      "home.itemsToBuy": "articles à acheter",
      "home.tasksToDo": "tâches à faire",
      "home.urgentTasks": "tâches urgentes",
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
      "share.title": "Votre maison",
      "share.codeHelp": "Code à partager avec Deborah",
      "share.copyCode": "Copier le code",
      "share.members": "Maison et membres",
      "share.membersLabel": "Membres",
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
      "auth.tagline": "Together, made simple.",
      "auth.subtitle": "Shopping and household tasks, always in sync.",
      "auth.loginTab": "Sign in",
      "auth.signupTab": "Create account",
      "auth.loginButton": "Sign in",
      "auth.createAccount": "Create my account",
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
      "home.underControl": "Everything is under control",
      "home.itemsToBuy": "items to buy",
      "home.tasksToDo": "tasks to do",
      "home.urgentTasks": "urgent tasks",
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
      "share.title": "Your home",
      "share.codeHelp": "Code to share with Deborah",
      "share.copyCode": "Copy code",
      "share.members": "Home and members",
      "share.membersLabel": "Members",
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
  let currentPage = "home";
  let supabase = null;
  let user = null;
  let household = null;
  let members = [];
  let shopping = [];
  let shoppingHistory = [];
  let shoppingCategories = [];
  let tasks = [];
  let taskFilter = "todo";
  let shoppingFilter = "all";
  let shoppingCategoryFilter = "all";
  let realtimeChannel = null;
  let toastTimer = null;
  let newShoppingUrgent = false;
  let newShoppingCategory = "other";
  let shoppingActionItemId = null;
  let categoryActionKey = null;
  let categoryEditorReturnTarget = null;
  const pendingPurchases = new Set();
  const pendingPurchaseTimers = new Map();

  const views = {
    auth: $("authView"),
    onboarding: $("onboardingView"),
    app: $("appView")
  };

  function t(key) {
    return translations[currentLang]?.[key] ?? translations.fr[key] ?? key;
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

    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    const { data } = await supabase.auth.getSession();
    user = data.session?.user || null;

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user || null;
      if (nextUser?.id === user?.id) return;
      user = nextUser;
      await routeForUser();
    });

    await routeForUser();
  }

  async function routeForUser() {
    cleanupRealtime();

    if (!user) {
      household = null;
      members = [];
      shopping = [];
      shoppingHistory = [];
      shoppingCategories = [];
      tasks = [];
      setView("auth");
      return;
    }

    const { data, error } = await supabase
      .from("household_members")
      .select("household_id, households(id,name,join_code)")
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

    const [membersRes, shoppingRes, tasksRes, historyRes, categoriesRes] = await Promise.all([
      supabase
        .from("household_members")
        .select("user_id, profiles(id,display_name)")
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
        .order("sort_order", { ascending: true })
    ]);

    if (membersRes.error || shoppingRes.error || tasksRes.error || historyRes.error || categoriesRes.error) {
      console.error(membersRes.error || shoppingRes.error || tasksRes.error || historyRes.error || categoriesRes.error);
      showToast(t("toast.syncError"));
      return;
    }

    members = (membersRes.data || []).map(row => ({
      id: row.user_id,
      display_name: row.profiles?.display_name || (currentLang === "uk" ? "Member" : "Membre")
    }));
    shopping = shoppingRes.data || [];
    tasks = tasksRes.data || [];
    shoppingHistory = historyRes.data || [];
    shoppingCategories = categoriesRes.data || [];
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

  function renderAll() {
    $("greeting").textContent = currentLang === "uk"
      ? `Hello ${currentName()}!`
      : `Bonjour ${currentName()} !`;
    $("householdCode").textContent = household?.join_code || "—";

    const activeShopping = shopping.filter(x => !x.is_done && !x.saved_for_later).length;
    const laterShopping = shopping.filter(x => !x.is_done && x.saved_for_later).length;
    const boughtShopping = shopping.filter(x => x.is_done).length;
    const todoTasks = tasks.filter(x => !x.is_done);
    const urgent = todoTasks.filter(x => x.is_urgent).length;

    $("shoppingRemaining").textContent = activeShopping;
    $("urgentRemaining").textContent = urgent;
    $("tasksRemaining").textContent = todoTasks.length;
    $("shoppingCounter").textContent = currentLang === "uk" ? `${activeShopping} to buy` : `${activeShopping} à acheter`;
    $("shoppingTodoCount").textContent = `(${activeShopping})`;
    $("shoppingLaterCount").textContent = `(${laterShopping})`;
    $("shoppingDoneCount").textContent = `(${boughtShopping})`;

    renderCategoryControls();
    renderShopping();
    renderTasks();
    renderPriority();
    renderRecent();
    renderMembers();
    renderAssignees();
    renderShoppingSuggestions(false);
    updateShoppingActionLabels();
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
        <section class="shopping-category-group ${isCollapsed ? "collapsed" : ""}">
          <div class="shopping-category-header">
            <button type="button" class="shopping-category-toggle" data-category-toggle="${esc(key)}" aria-expanded="${isCollapsed ? "false" : "true"}" aria-label="${esc(isCollapsed ? t("category.expand") : t("category.collapse"))}">
              <span class="category-title-wrap"><span class="category-emoji">${esc(meta.emoji || "📦")}</span><strong>${esc(categoryLabel(key))}</strong></span>
              <span class="category-count">${items.length}</span>
              <span class="category-chevron" aria-hidden="true">⌄</span>
            </button>
            <button type="button" class="category-menu-button" data-category-menu="${esc(key)}" aria-label="${esc(t("category.options"))}">⋮</button>
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
    const urgent = tasks.filter(task => !task.is_done && task.is_urgent).slice(0, 3);
    const host = $("priorityList");
    if (!urgent.length) {
      host.className = "priority-list empty-state compact-empty";
      host.innerHTML = t("home.noUrgent");
      return;
    }
    host.className = "priority-list";
    host.innerHTML = urgent.map(task => `
      <div class="priority-row">
        <span class="priority-alert">!</span>
        <div class="priority-main">
          <strong>${esc(task.title)}</strong>
          <small>${esc(t("home.today"))} · ${esc(task.assignee ? memberName(task.assignee) : t("common.anyone"))}</small>
        </div>
        <button class="priority-check" data-task-toggle="${task.id}" aria-label="${esc(t("house.done"))}"></button>
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
      ...tasks.map(item => ({ kind: "house", title: item.title, created_at: item.created_at }))
    ]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);

    if (!recent.length) {
      host.className = "recent-list empty-state compact-empty";
      host.innerHTML = t("home.noRecent");
      return;
    }

    host.className = "recent-list";
    host.innerHTML = recent.map(item => `
      <div class="recent-row">
        <span class="recent-icon ${item.kind === "house" ? "house" : ""}">
          ${item.kind === "shopping"
            ? `<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>`
            : `<svg viewBox="0 0 24 24"><path d="M3 11.2 12 3l9 8.2"/><path d="M5.5 9.5V21h13V9.5"/></svg>`}
        </span>
        <div class="recent-copy">
          <strong>${esc(item.title)}</strong>
          <small>${esc(item.kind === "shopping" ? t("recent.shopping") : t("recent.house"))} · ${esc(relativeTime(item.created_at))}</small>
        </div>
      </div>
    `).join("");
  }

  function renderMembers() {
    $("membersList").innerHTML = members.map(member => `
      <div class="member-row"><div class="avatar">${esc((member.display_name || "M")[0].toUpperCase())}</div><strong>${esc(member.display_name)}</strong></div>
    `).join("");
  }

  function renderAssignees() {
    const select = $("taskAssignee");
    const previous = select.value;
    select.innerHTML = `<option value="">${esc(t("common.anyone"))}</option>` + members.map(member =>
      `<option value="${member.id}">${esc(member.display_name)}</option>`
    ).join("");
    if ([...select.options].some(option => option.value === previous)) select.value = previous;
  }

  function showPage(page, rerender = true) {
    currentPage = page || "home";
    const labels = {
      home: "Lista di Casa",
      shopping: t("nav.shopping"),
      house: t("nav.house")
    };
    qsa(".page").forEach(p => p.classList.remove("active"));
    const pageEl = $(`${currentPage}Page`);
    if (pageEl) pageEl.classList.add("active");
    qsa(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.page === currentPage));
    if ($("pageTitle")) $("pageTitle").textContent = labels[currentPage] || "Lista di Casa";
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
    $("shoppingEditQty").value = item.quantity || "";
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
    $("shoppingQty").value = historyItem.last_quantity || "";
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

  async function logout() {
    closeSheets();
    cleanupRealtime();
    await supabase.auth.signOut();
  }

  function bindUI() {
    qsa("[data-lang]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));

    qsa("[data-auth-tab]").forEach(button => button.addEventListener("click", () => {
      qsa("[data-auth-tab]").forEach(b => b.classList.toggle("active", b === button));
      $("loginForm").classList.toggle("hidden", button.dataset.authTab !== "login");
      $("signupForm").classList.toggle("hidden", button.dataset.authTab !== "signup");
    }));

    $("loginForm").addEventListener("submit", login);
    $("signupForm").addEventListener("submit", signup);
    $("createHouseholdBtn").addEventListener("click", createHousehold);
    $("joinHouseholdBtn").addEventListener("click", joinHousehold);
    $("logoutOnboarding").addEventListener("click", logout);
    $("logoutBtn").addEventListener("click", logout);

    qsa(".nav-button").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
    qsa("[data-go]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.go)));
    qsa("[data-page-jump]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.pageJump)));

    qsa("#shoppingFilters [data-shopping-filter]").forEach(button => button.addEventListener("click", () => {
      shoppingFilter = button.dataset.shoppingFilter;
      qsa("#shoppingFilters [data-shopping-filter]").forEach(x => x.classList.toggle("active", x === button));
      renderShopping();
    }));

    $("shoppingUrgentBtn").addEventListener("click", () => setNewShoppingUrgent(!newShoppingUrgent));
    $("shoppingCategory").addEventListener("change", event => {
      if (event.target.value === "__add_category__") {
        fillCategorySelect(event.target, { selected: newShoppingCategory, allowAdd: true });
        openCategoryEditor(null, "new");
        return;
      }
      newShoppingCategory = categoryMeta(event.target.value).key;
    });
    $("shoppingCategoryFilter").addEventListener("change", event => {
      shoppingCategoryFilter = event.target.value || "all";
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
      if (categoryMenu) openCategoryActions(categoryMenu.dataset.categoryMenu);
    });

    $("closeShoppingActions").addEventListener("click", closeSheets);
    $("shoppingActionsSheet").addEventListener("click", event => { if (event.target === $("shoppingActionsSheet")) closeSheets(); });
    $("shoppingEditAction").addEventListener("click", () => openShoppingEditSheet(shopping.find(item => item.id === shoppingActionItemId)));
    $("shoppingLaterAction").addEventListener("click", () => toggleSaveForLater(shoppingActionItemId));
    $("shoppingDeleteAction").addEventListener("click", () => deleteShopping(shoppingActionItemId));

    $("shoppingEditForm").addEventListener("submit", saveShoppingEdit);
    $("shoppingEditCategory").addEventListener("change", event => {
      if (event.target.value === "__add_category__") {
        const previous = event.target.dataset.lastValue || fallbackCategoryKey();
        fillCategorySelect(event.target, { selected: previous, allowAdd: true });
        openCategoryEditor(null, "edit");
        return;
      }
      event.target.dataset.lastValue = event.target.value;
    });
    $("closeShoppingEdit").addEventListener("click", closeSheets);
    $("shoppingEditSheet").addEventListener("click", event => { if (event.target === $("shoppingEditSheet")) closeSheets(); });

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
      if (toggle) toggleTask(toggle.dataset.taskToggle);
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

    $("openHouseholdInfo").addEventListener("click", () => $("shareSheet").classList.remove("hidden"));
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

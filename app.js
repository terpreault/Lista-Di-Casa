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

  let supabase = null;
  let user = null;
  let household = null;
  let members = [];
  let shopping = [];
  let tasks = [];
  let taskFilter = "todo";
  let shoppingFilter = "all";
  let realtimeChannel = null;
  let toastTimer = null;

  const views = {
    auth: $("authView"),
    onboarding: $("onboardingView"),
    app: $("appView")
  };

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
    if ($("syncText")) $("syncText").textContent = offline ? "Hors connexion" : "Synchronisé";
  }

  function setLoading(button, isLoading, label) {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || "Chargement…";
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  async function init() {
    setSyncState();
    window.addEventListener("online", () => { setSyncState(); loadAll(); });
    window.addEventListener("offline", setSyncState);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }

    bindUI();

    if (!configReady) {
      setView("auth");
      showToast("Connecte d’abord l’app à Supabase dans config.js");
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
      showToast("Impossible de charger la maison.");
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
    const [membersRes, shoppingRes, tasksRes] = await Promise.all([
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
        .order("created_at", { ascending: false })
    ]);

    if (membersRes.error || shoppingRes.error || tasksRes.error) {
      console.error(membersRes.error || shoppingRes.error || tasksRes.error);
      showToast("Erreur de synchronisation.");
      return;
    }

    members = (membersRes.data || []).map(row => ({
      id: row.user_id,
      display_name: row.profiles?.display_name || "Membre"
    }));
    shopping = shoppingRes.data || [];
    tasks = tasksRes.data || [];
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
    return members.find(m => m.id === id)?.display_name || "N’importe qui";
  }

  function currentName() {
    return memberName(user?.id) || user?.user_metadata?.display_name || "vous";
  }

  function renderAll() {
    $("greeting").textContent = `Bonjour ${currentName()} !`;
    $("householdCode").textContent = household?.join_code || "—";

    const remainingShopping = shopping.filter(x => !x.is_done).length;
    const boughtShopping = shopping.filter(x => x.is_done).length;
    const todoTasks = tasks.filter(x => !x.is_done);
    const urgent = todoTasks.filter(x => x.is_urgent).length;

    $("shoppingRemaining").textContent = remainingShopping;
    $("urgentRemaining").textContent = urgent;
    $("tasksRemaining").textContent = todoTasks.length;
    $("shoppingCounter").textContent = `${remainingShopping} à acheter`;
    $("shoppingTodoCount").textContent = `(${remainingShopping})`;
    $("shoppingDoneCount").textContent = `(${boughtShopping})`;

    renderShopping();
    renderTasks();
    renderPriority();
    renderRecent();
    renderMembers();
    renderAssignees();
  }

  function renderShopping() {
    const host = $("shoppingList");
    let shown = [...shopping];
    if (shoppingFilter === "todo") shown = shown.filter(item => !item.is_done);
    if (shoppingFilter === "done") shown = shown.filter(item => item.is_done);

    if (!shown.length) {
      host.innerHTML = `<div class="empty-state">${shopping.length ? "Aucun article dans cette vue." : "La liste de courses est vide.<br>Ajoute le premier article juste au-dessus."}</div>`;
      return;
    }

    const ordered = shown.sort((a, b) => Number(a.is_done) - Number(b.is_done) || new Date(b.created_at) - new Date(a.created_at));
    host.innerHTML = ordered.map(item => `
      <div class="list-item ${item.is_done ? "done" : ""}">
        <button class="check-button ${item.is_done ? "checked" : ""}" data-shopping-toggle="${item.id}" aria-label="Changer le statut">${item.is_done ? "✓" : ""}</button>
        <div class="item-content">
          <div class="item-title">${esc(item.name)}</div>
        </div>
        ${item.quantity ? `<span class="badge quantity">${esc(item.quantity)}</span>` : ""}
        <button class="item-menu" data-shopping-delete="${item.id}" aria-label="Supprimer">⋮</button>
      </div>
    `).join("");
  }

  function renderTasks() {
    const host = $("taskList");
    let shown = [...tasks];

    if (taskFilter === "todo") shown = shown.filter(t => !t.is_done);
    if (taskFilter === "done") shown = shown.filter(t => t.is_done);
    if (taskFilter === "mine") shown = shown.filter(t => !t.is_done && t.assignee === user.id);

    shown.sort((a, b) =>
      Number(a.is_done) - Number(b.is_done) ||
      Number(b.is_urgent) - Number(a.is_urgent) ||
      new Date(b.created_at) - new Date(a.created_at)
    );

    if (!shown.length) {
      host.innerHTML = `<div class="empty-state">Aucune tâche dans cette vue.</div>`;
      return;
    }

    host.innerHTML = shown.map(task => `
      <div class="list-item ${task.is_done ? "done" : ""}">
        <button class="check-button ${task.is_done ? "checked" : ""}" data-task-toggle="${task.id}" aria-label="Changer le statut">${task.is_done ? "✓" : ""}</button>
        <div class="item-content">
          <div class="item-title">${esc(task.title)}</div>
          <div class="item-meta">
            ${task.is_urgent && !task.is_done ? `<span class="badge urgent">Urgent</span>` : ""}
            <span class="badge person">${esc(task.assignee ? memberName(task.assignee) : "N’importe qui")}</span>
          </div>
        </div>
        <button class="item-menu" data-task-edit="${task.id}" aria-label="Modifier">•••</button>
      </div>
    `).join("");
  }

  function renderPriority() {
    const urgent = tasks.filter(t => !t.is_done && t.is_urgent).slice(0, 3);
    const host = $("priorityList");
    if (!urgent.length) {
      host.className = "priority-list empty-state compact-empty";
      host.innerHTML = "Rien d’urgent pour le moment.";
      return;
    }
    host.className = "priority-list";
    host.innerHTML = urgent.map(t => `
      <div class="priority-row">
        <span class="priority-alert">!</span>
        <div class="priority-main">
          <strong>${esc(t.title)}</strong>
          <small>Aujourd’hui · ${esc(t.assignee ? memberName(t.assignee) : "N’importe qui")}</small>
        </div>
        <button class="priority-check" data-task-toggle="${t.id}" aria-label="Marquer comme fait"></button>
      </div>
    `).join("");
  }

  function relativeTime(iso) {
    const date = new Date(iso);
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "à l’instant";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "hier" : `il y a ${days} j`;
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
      host.innerHTML = "Aucun ajout pour le moment.";
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
          <small>${item.kind === "shopping" ? "Courses" : "Maison"} · ${relativeTime(item.created_at)}</small>
        </div>
      </div>
    `).join("");
  }

  function renderMembers() {
    $("membersList").innerHTML = members.map(m => `
      <div class="member-row"><div class="avatar">${esc((m.display_name || "M")[0].toUpperCase())}</div><strong>${esc(m.display_name)}</strong></div>
    `).join("");
  }

  function renderAssignees() {
    const sel = $("taskAssignee");
    const previous = sel.value;
    sel.innerHTML = `<option value="">N’importe qui</option>` + members.map(m =>
      `<option value="${m.id}">${esc(m.display_name)}</option>`
    ).join("");
    if ([...sel.options].some(o => o.value === previous)) sel.value = previous;
  }

  function showPage(page) {
    const labels = { home: "Lista di Casa", shopping: "Courses", house: "Maison" };
    qsa(".page").forEach(p => p.classList.remove("active"));
    $(`${page}Page`).classList.add("active");
    qsa(".nav-button").forEach(b => b.classList.toggle("active", b.dataset.page === page));
    $("pageTitle").textContent = labels[page];
  }

  function openTaskSheet(task = null) {
    $("taskForm").reset();
    $("taskId").value = task?.id || "";
    $("taskTitle").value = task?.title || "";
    $("taskAssignee").value = task?.assignee || "";
    $("taskUrgent").checked = !!task?.is_urgent;
    $("taskSheetTitle").textContent = task ? "Modifier la tâche" : "Nouvelle tâche";
    $("deleteTaskBtn").classList.toggle("hidden", !task);
    $("taskSheet").classList.remove("hidden");
    setTimeout(() => $("taskTitle").focus(), 100);
  }

  function closeSheets() {
    $("taskSheet").classList.add("hidden");
    $("shareSheet").classList.add("hidden");
  }

  async function addShopping() {
    const name = $("shoppingName").value.trim();
    const quantity = $("shoppingQty").value.trim();
    if (!name) return;

    const { error } = await supabase.from("shopping_items").insert({
      household_id: household.id,
      name,
      quantity: quantity || null,
      created_by: user.id
    });

    if (error) return showToast("Impossible d’ajouter cet article.");
    $("shoppingName").value = "";
    $("shoppingQty").value = "";
    await loadAll();
  }

  async function toggleShopping(id) {
    const item = shopping.find(x => x.id === id);
    if (!item) return;
    const { error } = await supabase.from("shopping_items")
      .update({ is_done: !item.is_done, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) showToast("Modification impossible.");
  }

  async function deleteShopping(id) {
    const { error } = await supabase.from("shopping_items").delete().eq("id", id);
    if (error) showToast("Suppression impossible.");
  }

  async function clearBought() {
    if (!shopping.some(x => x.is_done)) return showToast("Aucun article acheté à effacer.");
    const { error } = await supabase.from("shopping_items")
      .delete()
      .eq("household_id", household.id)
      .eq("is_done", true);
    if (error) showToast("Suppression impossible.");
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

    if (result.error) return showToast("Impossible d’enregistrer cette tâche.");
    closeSheets();
    await loadAll();
  }

  async function toggleTask(id) {
    const task = tasks.find(x => x.id === id);
    if (!task) return;
    const next = !task.is_done;
    const { error } = await supabase.from("house_tasks").update({
      is_done: next,
      completed_by: next ? user.id : null,
      completed_at: next ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) showToast("Modification impossible.");
  }

  async function deleteTask() {
    const id = $("taskId").value;
    if (!id) return;
    const { error } = await supabase.from("house_tasks").delete().eq("id", id);
    if (error) return showToast("Suppression impossible.");
    closeSheets();
  }

  async function createHousehold() {
    const button = $("createHouseholdBtn");
    setLoading(button, true);
    const name = $("householdName").value.trim() || "Notre maison";
    const { data, error } = await supabase.rpc("create_household", { household_name: name });
    setLoading(button, false);
    if (error) return showToast(error.message || "Création impossible.");
    await routeForUser();
    if (data?.[0]?.join_code) showToast(`Maison créée : ${data[0].join_code}`);
  }

  async function joinHousehold() {
    const button = $("joinHouseholdBtn");
    const code = $("joinCode").value.trim().toUpperCase();
    if (!code) return;
    setLoading(button, true);
    const { error } = await supabase.rpc("join_household", { household_code: code });
    setLoading(button, false);
    if (error) return showToast("Code introuvable ou invalide.");
    await routeForUser();
    showToast("Vous êtes maintenant connectés à la même maison.");
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
    if (error) showToast("Email ou mot de passe incorrect.");
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
    if (error) return showToast(error.message || "Création du compte impossible.");
    if (!data.session) {
      showToast("Compte créé. Vérifie ton email pour confirmer l’inscription.");
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

    qsa(".nav-button").forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
    qsa("[data-go]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.go)));
    qsa("[data-page-jump]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.pageJump)));

    qsa("#shoppingFilters [data-shopping-filter]").forEach(b => b.addEventListener("click", () => {
      shoppingFilter = b.dataset.shoppingFilter;
      qsa("#shoppingFilters [data-shopping-filter]").forEach(x => x.classList.toggle("active", x === b));
      renderShopping();
    }));

    $("addShoppingBtn").addEventListener("click", addShopping);
    $("shoppingName").addEventListener("keydown", e => { if (e.key === "Enter") addShopping(); });
    $("shoppingQty").addEventListener("keydown", e => { if (e.key === "Enter") addShopping(); });
    $("clearBoughtBtn").addEventListener("click", clearBought);

    $("shoppingList").addEventListener("click", e => {
      const toggle = e.target.closest("[data-shopping-toggle]");
      const del = e.target.closest("[data-shopping-delete]");
      if (toggle) toggleShopping(toggle.dataset.shoppingToggle);
      if (del) deleteShopping(del.dataset.shoppingDelete);
    });

    $("priorityList").addEventListener("click", e => {
      const toggle = e.target.closest("[data-task-toggle]");
      if (toggle) toggleTask(toggle.dataset.taskToggle);
    });

    $("openTaskComposer").addEventListener("click", () => openTaskSheet());
    $("taskForm").addEventListener("submit", saveTask);
    $("closeTaskSheet").addEventListener("click", closeSheets);
    $("deleteTaskBtn").addEventListener("click", deleteTask);
    $("taskSheet").addEventListener("click", e => { if (e.target === $("taskSheet")) closeSheets(); });

    $("taskList").addEventListener("click", e => {
      const toggle = e.target.closest("[data-task-toggle]");
      const edit = e.target.closest("[data-task-edit]");
      if (toggle) toggleTask(toggle.dataset.taskToggle);
      if (edit) openTaskSheet(tasks.find(t => t.id === edit.dataset.taskEdit));
    });

    qsa("#taskFilters [data-filter]").forEach(b => b.addEventListener("click", () => {
      taskFilter = b.dataset.filter;
      qsa("#taskFilters [data-filter]").forEach(x => x.classList.toggle("active", x === b));
      renderTasks();
    }));

    $("openHouseholdInfo").addEventListener("click", () => $("shareSheet").classList.remove("hidden"));
    $("closeShareSheet").addEventListener("click", closeSheets);
    $("shareSheet").addEventListener("click", e => { if (e.target === $("shareSheet")) closeSheets(); });
    $("copyCodeBtn").addEventListener("click", async () => {
      const code = household?.join_code || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast("Code copié.");
      } catch {
        showToast(`Code : ${code}`);
      }
    });
  }

  init();
})();

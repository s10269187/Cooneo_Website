/* ==========================================================
   COONEO 酷牛 — SHOP (shared by every page)
   ----------------------------------------------------------
   Loaded after products.js, firebase-config.js and script.js.
   It looks after everything the shop needs on every page:

   1. Small helpers (prices, product look-ups, option text)
   2. Cart + favourites data (browser storage for guests,
      Firebase for logged-in users)
   3. Login state (Firebase Authentication)
   4. Cart / favourites / account icons in the nav bar
   5. Slide-out cart drawer
   6. Pop-up messages ("toasts")

   Page-specific code (shop grid, product page, checkout…)
   lives in shop-pages.js and uses the "Shop" object at the
   bottom of this file.

   Text comes from the translations object in script.js —
   t("key") returns it in the current language.
   ========================================================== */
(function () {
  /* ==========================================================
     1. HELPERS
     ========================================================== */

  // Pick the right language from a { en: "...", zh: "..." } object
  function pick(obj) {
    if (!obj) return "";
    return obj[currentLang] || obj.en || "";
  }

  // Make text safe to put inside HTML (stops "<" etc. breaking the page)
  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  // Price HTML: "¥ 1,280" with a small "≈ S$ 230.40" beside it.
  // A price of 0 means "not set yet" (see products.js) and shows "Price TBC".
  function priceHtml(amount) {
    if (!amount) return `<span class="price price-tbc">${escapeHtml(t("price.tbc"))}</span>`;
    const cny = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    const sgd = (amount * CNY_TO_SGD).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `<span class="price">¥ ${cny}</span> <span class="price-sgd">≈ S$ ${sgd}</span>`;
  }

  // The deposit notice shown next to prices (product page, cart, checkout)
  function depositNoticeHtml() {
    return `<p class="deposit-notice"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/></svg><span>${escapeHtml(t("deposit.notice"))}</span></p>`;
  }

  // The list of chosen choice ids for one option group (always an array)
  function chosenIds(options, groupId) {
    const value = options[groupId];
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  // Price of one item with the chosen options: base price + every chosen add-on
  function unitPrice(product, options) {
    let total = product.basePrice || 0;
    product.optionGroups.forEach((group) => {
      chosenIds(options, group.id).forEach((choiceId) => {
        const choice = group.choices.find((c) => c.id === choiceId);
        if (choice) total += choice.price || 0;
      });
    });
    return total;
  }

  // "Starting price" for the shop grid: base price + the cheapest choice of each required group
  function startingPrice(product) {
    let total = product.basePrice || 0;
    product.optionGroups.forEach((group) => {
      if (group.required && group.choices.length) {
        total += Math.min(...group.choices.map((c) => c.price || 0));
      }
    });
    return total;
  }

  function hasRequiredOptions(product) {
    return product.optionGroups.some((group) => group.required);
  }

  // Readable option lines, e.g. [{ group: "Add functions", choice: "Tilling, Weeding" }]
  function describeOptions(product, options, lang) {
    const choose = (obj) => (lang ? obj[lang] || obj.en : pick(obj));
    const lines = [];
    product.optionGroups.forEach((group) => {
      const labels = chosenIds(options, group.id)
        .map((id) => group.choices.find((c) => c.id === id))
        .filter(Boolean)
        .map((choice) => choose(choice.label));
      if (labels.length) lines.push({ group: choose(group.label), choice: labels.join(lang === "zh" || (!lang && currentLang === "zh") ? "、" : ", ") });
    });
    return lines;
  }

  // One option as text: "Add functions: Tilling" (Chinese uses a full-width colon "：")
  function optionText(option) {
    return `${option.group}${currentLang === "zh" ? "：" : ": "}${option.choice}`;
  }

  // A unique key for "this product with these options".
  // The same product with different options gets a different key, so it is a separate cart line.
  function lineKey(productId, options) {
    const parts = Object.keys(options)
      .sort()
      .map((groupId) => `${groupId}-${chosenIds(options, groupId).slice().sort().join(".")}`)
      .filter((part) => !part.endsWith("-"));
    return [productId, ...parts].join("__");
  }

  /* ==========================================================
     2. CART + FAVOURITES DATA
     ----------------------------------------------------------
     state.cart = [{ key, productId, options, qty }, ...]
     state.favs = ["roboox", "stier", ...]   (product ids)

     Guests:    kept in this browser (localStorage).
     Logged in: kept in Firebase (users/{uid}/cart and
                users/{uid}/favourites), so it follows the user
                to any device.
     ========================================================== */
  const CART_KEY = "cooneo-cart";
  const FAVS_KEY = "cooneo-favourites";

  const state = {
    user: null,       // the logged-in Firebase user, or null for guests
    authReady: false, // becomes true once we know whether someone is logged in
    cart: [],
    favs: [],
  };

  // localStorage can be blocked (e.g. some private windows), so always use try/catch
  function readLocal(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (e) {
      return [];
    }
  }

  function writeLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — the cart just won't be remembered */
    }
  }

  // Drop anything that refers to a product no longer in products.js
  function cleanCart(lines) {
    return lines.filter((line) => line && getProduct(line.productId) && line.qty > 0);
  }
  function cleanFavs(ids) {
    return [...new Set(ids)].filter((id) => getProduct(id));
  }

  // Tell the page that the cart / favourites changed so it can redraw
  function notifyChange() {
    document.dispatchEvent(new CustomEvent("cooneo:storechange"));
  }

  // --- Saving one change (to Firebase when logged in, otherwise to the browser) ---
  function userDoc() {
    return db.collection("users").doc(state.user.uid);
  }

  function saveCartLine(line, removed) {
    if (state.user && db) {
      const ref = userDoc().collection("cart").doc(line.key);
      const request = removed
        ? ref.delete()
        : ref.set({ productId: line.productId, options: line.options, qty: line.qty, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      request.catch((err) => console.warn("Could not save cart:", err));
    } else {
      writeLocal(CART_KEY, state.cart);
    }
  }

  function saveFav(productId, added) {
    if (state.user && db) {
      const ref = userDoc().collection("favourites").doc(productId);
      const request = added ? ref.set({ productId, addedAt: firebase.firestore.FieldValue.serverTimestamp() }) : ref.delete();
      request.catch((err) => console.warn("Could not save favourite:", err));
    } else {
      writeLocal(FAVS_KEY, state.favs);
    }
  }

  // --- Cart actions ---
  function addToCart(productId, options, qty) {
    const key = lineKey(productId, options);
    let line = state.cart.find((l) => l.key === key);
    if (line) {
      line.qty += qty;
    } else {
      line = { key, productId, options, qty };
      state.cart.push(line);
    }
    saveCartLine(line);
    notifyChange();
    return line;
  }

  function setQty(key, qty) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    if (qty < 1) return removeLine(key);
    line.qty = Math.min(qty, 99);
    saveCartLine(line);
    notifyChange();
  }

  function removeLine(key) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    state.cart = state.cart.filter((l) => l.key !== key);
    saveCartLine(line, true);
    notifyChange();
  }

  function clearCart() {
    const old = state.cart;
    state.cart = [];
    if (state.user && db) {
      const batch = db.batch();
      old.forEach((line) => batch.delete(userDoc().collection("cart").doc(line.key)));
      batch.commit().catch((err) => console.warn("Could not clear cart:", err));
    } else {
      writeLocal(CART_KEY, []);
    }
    notifyChange();
  }

  function cartCount() {
    return state.cart.reduce((sum, line) => sum + line.qty, 0);
  }

  function cartSubtotal() {
    return state.cart.reduce((sum, line) => sum + unitPrice(getProduct(line.productId), line.options) * line.qty, 0);
  }

  // --- Favourite actions ---
  function isFavourite(productId) {
    return state.favs.includes(productId);
  }

  // Returns true if it is now a favourite, false if it was removed
  function toggleFavourite(productId) {
    const added = !isFavourite(productId);
    state.favs = added ? [...state.favs, productId] : state.favs.filter((id) => id !== productId);
    saveFav(productId, added);
    notifyChange();
    return added;
  }

  /* ==========================================================
     3. LOGIN STATE (Firebase Authentication)
     ========================================================== */
  // Firebase only runs once real settings are in firebase-config.js
  const firebaseReady =
    typeof firebase !== "undefined" &&
    typeof firebaseConfig !== "undefined" &&
    !String(firebaseConfig.apiKey).startsWith("YOUR_");

  let auth = null;
  let db = null;

  if (firebaseReady) {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth(); // remembers the user across visits by default
    db = firebase.firestore();
  }

  // Name to show in the nav: their name, or the part of the email before "@"
  function displayName(user) {
    if (!user) return "";
    return user.displayName || (user.email || "").split("@")[0];
  }

  // After logging in: load the saved cart + favourites, and merge in anything the
  // guest added before logging in (same item → quantities are added together).
  async function loadAccountData(user) {
    const guestCart = cleanCart(readLocal(CART_KEY));
    const guestFavs = cleanFavs(readLocal(FAVS_KEY));
    const ref = db.collection("users").doc(user.uid);

    const [cartSnap, favSnap] = await Promise.all([ref.collection("cart").get(), ref.collection("favourites").get()]);
    const cart = [];
    cartSnap.forEach((doc) => cart.push({ key: doc.id, ...doc.data() }));
    const favs = [];
    favSnap.forEach((doc) => favs.push(doc.id));

    const batch = db.batch();
    guestCart.forEach((guestLine) => {
      const existing = cart.find((l) => l.key === guestLine.key);
      const line = existing || { ...guestLine, qty: 0 };
      line.qty = Math.min(line.qty + guestLine.qty, 99);
      if (!existing) cart.push(line);
      batch.set(ref.collection("cart").doc(line.key), { productId: line.productId, options: line.options, qty: line.qty });
    });
    guestFavs.forEach((id) => {
      if (!favs.includes(id)) {
        favs.push(id);
        batch.set(ref.collection("favourites").doc(id), { productId: id });
      }
    });
    // Keep the profile (name + email) up to date
    batch.set(ref, { name: displayName(user), email: user.email || "", updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    await batch.commit();

    // The guest items now live in the account, so clear the browser copy
    writeLocal(CART_KEY, []);
    writeLocal(FAVS_KEY, []);

    state.cart = cleanCart(cart);
    state.favs = cleanFavs(favs);
  }

  function finishAuthChange() {
    state.authReady = true;
    renderNav();
    renderDrawer();
    notifyChange();
    document.dispatchEvent(new CustomEvent("cooneo:authchange"));
  }

  // Start with whatever is saved in this browser (replaced by the account data once logged in)
  state.cart = cleanCart(readLocal(CART_KEY));
  state.favs = cleanFavs(readLocal(FAVS_KEY));

  if (firebaseReady) {
    auth.onAuthStateChanged(async (user) => {
      state.user = user;
      if (user) {
        try {
          await loadAccountData(user);
        } catch (err) {
          console.warn("Could not load account data:", err);
        }
      } else {
        // Logged out (or a guest): use whatever is saved in this browser
        state.cart = cleanCart(readLocal(CART_KEY));
        state.favs = cleanFavs(readLocal(FAVS_KEY));
      }
      finishAuthChange();
    });
  } else {
    state.authReady = true; // no Firebase → everyone is a guest
  }

  // Run fn once we know whether someone is logged in
  function whenAuthReady(fn) {
    if (state.authReady) return fn();
    document.addEventListener("cooneo:authchange", () => fn(), { once: true });
  }

  // --- Login actions (used by login.html and the nav menu) ---
  async function register(name, email, password) {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await db.collection("users").doc(cred.user.uid).set({ name, email, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    renderNav(); // show the new name straight away
    return cred.user;
  }

  function logIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logInWithGoogle() {
    return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  async function logOut() {
    if (auth) await auth.signOut();
    window.location.href = "index.html";
  }

  // Turn a Firebase error into a translation key
  function authErrorKey(err) {
    const code = (err && err.code) || "";
    if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-login-credentials"].includes(code)) return "auth.err.invalid";
    if (code === "auth/email-already-in-use") return "auth.err.emailInUse";
    if (code === "auth/weak-password") return "auth.err.weakPassword";
    if (code === "auth/invalid-email" || code === "auth/missing-email") return "auth.err.invalidEmail";
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "auth.err.popup";
    if (code === "auth/too-many-requests") return "auth.err.tooMany";
    if (code === "auth/network-request-failed") return "auth.err.network";
    if (code === "auth/unauthorized-domain" || code === "auth/operation-not-supported-in-this-environment") return "auth.err.domain";
    return "auth.err.generic";
  }

  /* ==========================================================
     4. NAV BAR ICONS (favourites, cart, account)
     Added next to the language dropdown on every page.
     ========================================================== */
  const ICONS = {
    heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.6 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.3 0 5.2 3.1 4.1 6.2C19.5 15.4 12 20 12 20z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.6 4.4-5.5 8-5.5s6.5 1.9 8 5.5"/></svg>',
  };

  const navActions = document.querySelector(".nav-actions");
  const langSwitch = navActions && navActions.querySelector(".lang-switch");
  let navEls = null;

  function buildNav() {
    if (!navActions || !langSwitch) return;
    const wrap = document.createElement("div");
    wrap.className = "shop-nav";
    wrap.innerHTML = `
      <a class="nav-icon" href="favourites.html" data-nav-favs>${ICONS.heart}<span class="nav-badge" hidden></span></a>
      <button class="nav-icon" type="button" data-open-cart aria-haspopup="dialog">${ICONS.bag}<span class="nav-badge" hidden></span></button>
      <div class="account-nav" data-account-nav></div>`;
    navActions.insertBefore(wrap, langSwitch);

    // On phones the account link moves into the hamburger menu
    const navLinksEl = document.getElementById("nav-links");
    const mobileLink = document.createElement("a");
    mobileLink.className = "nav-mobile-account";
    if (navLinksEl) navLinksEl.appendChild(mobileLink);

    navEls = {
      favs: wrap.querySelector("[data-nav-favs]"),
      cart: wrap.querySelector("[data-open-cart]"),
      account: wrap.querySelector("[data-account-nav]"),
      mobileLink,
    };
  }

  function setBadge(el, count) {
    const badge = el.querySelector(".nav-badge");
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.hidden = count === 0;
  }

  function renderNav() {
    if (!navEls) return;
    setBadge(navEls.favs, state.favs.length);
    setBadge(navEls.cart, cartCount());
    navEls.favs.setAttribute("aria-label", `${t("nav.favourites")} (${state.favs.length})`);
    navEls.cart.setAttribute("aria-label", `${t("nav.cart")} (${cartCount()})`);

    if (state.user) {
      // Logged in: name + a small menu
      navEls.account.innerHTML = `
        <button class="nav-account" type="button" aria-expanded="false" aria-haspopup="true" aria-label="${escapeHtml(t("nav.accountMenu"))}">
          ${ICONS.user}<span class="nav-account-name">${escapeHtml(displayName(state.user))}</span>
        </button>
        <div class="account-menu" hidden>
          <a href="account.html">${escapeHtml(t("nav.account"))}</a>
          <a href="favourites.html">${escapeHtml(t("nav.favourites"))}</a>
          <button type="button" data-logout>${escapeHtml(t("nav.logout"))}</button>
        </div>`;
      navEls.mobileLink.href = "account.html";
      navEls.mobileLink.textContent = t("nav.account");
    } else {
      // Guest: a "Login" link
      navEls.account.innerHTML = `<a class="nav-account" href="login.html">${ICONS.user}<span class="nav-account-name">${escapeHtml(t("nav.login"))}</span></a>`;
      navEls.mobileLink.href = "login.html";
      navEls.mobileLink.textContent = t("nav.login");
    }
  }

  // Open / close the account menu, and log out
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".nav-account[aria-expanded]");
    const menu = navEls && navEls.account.querySelector(".account-menu");
    if (toggle && menu) {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      return;
    }
    if (event.target.closest("[data-logout]")) {
      logOut();
      return;
    }
    // Click anywhere else closes the menu
    if (menu && !menu.hidden && !event.target.closest(".account-menu")) {
      menu.hidden = true;
      navEls.account.querySelector(".nav-account").setAttribute("aria-expanded", "false");
    }
  });

  /* ==========================================================
     5. CART DRAWER (slides in from the right)
     ========================================================== */
  let drawer = null;
  let lastFocus = null;

  // One cart line — used by the drawer and the cart page.
  // The +, − and Remove buttons are handled by the click listener further down.
  function cartLineHtml(line) {
    const product = getProduct(line.productId);
    const price = unitPrice(product, line.options);
    const name = escapeHtml(pick(product.name));
    const url = `product.html?id=${encodeURIComponent(product.id)}`;
    const opts = describeOptions(product, line.options)
      .map((o) => `<li>${escapeHtml(optionText(o))}</li>`)
      .join("");
    return `
      <li class="cart-line">
        <a class="cart-line-img" href="${url}"><img src="${product.images[0]}" alt="${name}" loading="lazy" /></a>
        <div class="cart-line-info">
          <a class="cart-line-name" href="${url}">${name}</a>
          ${opts ? `<ul class="cart-line-opts">${opts}</ul>` : ""}
          <p class="cart-line-unit">${priceHtml(price)}${price ? ` <span class="muted">${escapeHtml(t("cart.each"))}</span>` : ""}</p>
          <div class="qty qty-sm">
            <button type="button" data-cart-action="dec" data-key="${escapeHtml(line.key)}" aria-label="${escapeHtml(t("product.decrease"))}">−</button>
            <span aria-live="polite">${line.qty}</span>
            <button type="button" data-cart-action="inc" data-key="${escapeHtml(line.key)}" aria-label="${escapeHtml(t("product.increase"))}">+</button>
          </div>
        </div>
        <div class="cart-line-end">
          <strong>${priceHtml(price * line.qty)}</strong>
          <button type="button" class="link-btn" data-cart-action="remove" data-key="${escapeHtml(line.key)}">${escapeHtml(t("cart.remove"))}</button>
        </div>
      </li>`;
  }

  function buildDrawer() {
    drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "cart-drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = `
      <div class="drawer-backdrop" data-close-drawer></div>
      <aside class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer-head">
          <h2 id="drawer-title"></h2>
          <button type="button" class="modal-close" data-close-drawer>×</button>
        </div>
        <div class="drawer-body"></div>
        <div class="drawer-foot"></div>
      </aside>`;
    document.body.appendChild(drawer);
  }

  function renderDrawer() {
    if (!drawer) return;
    drawer.querySelector("#drawer-title").textContent = `${t("cart.title")} (${cartCount()})`;
    drawer.querySelector(".modal-close").setAttribute("aria-label", t("cart.close"));
    const body = drawer.querySelector(".drawer-body");
    const foot = drawer.querySelector(".drawer-foot");

    if (!state.cart.length) {
      body.innerHTML = `<p class="empty-note">${escapeHtml(t("cart.empty"))}</p>`;
      foot.innerHTML = `<a class="btn btn-primary btn-block" href="shop.html">${escapeHtml(t("cart.continue"))}</a>`;
      return;
    }
    body.innerHTML = `<ul class="cart-lines">${state.cart.map(cartLineHtml).join("")}</ul>`;
    foot.innerHTML = `
      <div class="summary-row"><span>${escapeHtml(t("cart.subtotal"))}</span><strong>${priceHtml(cartSubtotal())}</strong></div>
      ${depositNoticeHtml()}
      <a class="btn btn-primary btn-block" href="checkout.html">${escapeHtml(t("cart.checkout"))}</a>
      <a class="btn btn-outline btn-block" href="cart.html">${escapeHtml(t("cart.viewCart"))}</a>`;
  }

  function onDrawerKey(event) {
    if (event.key === "Escape") closeDrawer();
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    renderDrawer();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    drawer.querySelector(".modal-close").focus();
    document.addEventListener("keydown", onDrawerKey);
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onDrawerKey);
    if (lastFocus) lastFocus.focus();
  }

  // One click listener for: opening/closing the drawer, cart +/−/remove buttons and heart buttons
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-cart]")) return openDrawer();
    if (event.target.closest("[data-close-drawer]")) return closeDrawer();

    const cartBtn = event.target.closest("[data-cart-action]");
    if (cartBtn) {
      const line = state.cart.find((l) => l.key === cartBtn.dataset.key);
      if (!line) return;
      if (cartBtn.dataset.cartAction === "inc") setQty(line.key, line.qty + 1);
      if (cartBtn.dataset.cartAction === "dec") setQty(line.key, line.qty - 1);
      if (cartBtn.dataset.cartAction === "remove") removeLine(line.key);
      return;
    }

    // Heart (favourite) buttons anywhere on the page: <button data-fav="productId">
    const favBtn = event.target.closest("[data-fav]");
    if (favBtn) {
      event.preventDefault();
      const added = toggleFavourite(favBtn.dataset.fav);
      showToast(t(added ? "fav.added" : "fav.removed"));
    }
  });

  // Keep every heart button showing the right state
  function updateHearts() {
    document.querySelectorAll("[data-fav]").forEach((btn) => {
      const on = isFavourite(btn.dataset.fav);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", t(on ? "fav.remove" : "fav.add"));
      const label = btn.querySelector("[data-fav-label]");
      if (label) label.textContent = t(on ? "fav.saved" : "fav.add");
    });
  }

  function heartButtonHtml(productId, withLabel) {
    return `<button type="button" class="fav-btn${withLabel ? " fav-btn-label" : ""}" data-fav="${escapeHtml(productId)}" aria-pressed="false">${ICONS.heart}${withLabel ? '<span data-fav-label></span>' : ""}</button>`;
  }

  /* ==========================================================
     6. POP-UP MESSAGES ("toasts")
     ========================================================== */
  let toastEl = null;
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ==========================================================
     START-UP + REDRAW WHEN THINGS CHANGE
     ========================================================== */
  buildNav();
  buildDrawer();
  renderNav();
  renderDrawer();

  document.addEventListener("cooneo:storechange", () => {
    renderNav();
    renderDrawer();
    updateHearts();
  });
  document.addEventListener("cooneo:languagechange", () => {
    renderNav();
    renderDrawer();
    updateHearts();
  });

  // Everything shop-pages.js needs
  window.Shop = {
    state,
    firebaseReady,
    get db() {
      return db;
    },
    pick,
    escapeHtml,
    getProduct,
    priceHtml,
    depositNoticeHtml,
    chosenIds,
    unitPrice,
    startingPrice,
    hasRequiredOptions,
    describeOptions,
    optionText,
    addToCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartLineHtml,
    isFavourite,
    toggleFavourite,
    heartButtonHtml,
    updateHearts,
    openDrawer,
    showToast,
    whenAuthReady,
    displayName,
    register,
    logIn,
    logInWithGoogle,
    resetPassword,
    logOut,
    authErrorKey,
  };
})();

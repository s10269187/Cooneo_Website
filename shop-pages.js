/* ==========================================================
   COONEO 酷牛 — SHOP PAGES
   ----------------------------------------------------------
   Each shop page has <body data-page="..."> and this file
   runs the matching part:

   1. shop        → product grid with filter + sort (shop.html)
   2. product     → product detail page (product.html?id=...)
   3. cart        → full cart page (cart.html)
   4. favourites  → saved products (favourites.html)
   5. checkout    → order request form (checkout.html)
   6. login       → login / register (login.html)
   7. account     → name, email, order history (account.html)

   It uses window.Shop from shop.js and t() from script.js.
   ========================================================== */
(function () {
  const S = window.Shop;
  const page = document.body.dataset.page;
  const esc = S.escapeHtml;

  // TODO: customer-service WhatsApp number (digits only, with country code, e.g. 6591234567)
  const CS_WHATSAPP = "XXXXXXXXXX";

  // Shop filter categories → the translation key for their name
  const CATEGORY_KEYS = {
    robots: "products.cat.robots",
    arms: "products.cat.arms",
    effectors: "effectors.group.tools",
  };

  // Redraw when the language, the cart/favourites or the login state changes
  function onChange(fn) {
    document.addEventListener("cooneo:languagechange", fn);
    document.addEventListener("cooneo:storechange", fn);
    document.addEventListener("cooneo:authchange", fn);
  }

  // Only allow going back to one of our own pages after login (e.g. "checkout.html")
  function safeNext(value, fallback) {
    return /^[a-z-]+\.html$/.test(value || "") ? value : fallback;
  }

  // "From ¥ 1,280 ≈ S$ 230.40" (or "Price TBC" when no price is set yet)
  function startingPriceHtml(product) {
    const price = S.startingPrice(product);
    return price ? esc(t("shop.fromPrice")).replace("{price}", S.priceHtml(price)) : S.priceHtml(0);
  }

  // One product card (shop grid and favourites page)
  function productCardHtml(product, options = {}) {
    const url = `product.html?id=${encodeURIComponent(product.id)}`;
    const name = esc(S.pick(product.name));
    return `
      <article class="shop-card">
        <a class="shop-card-img" href="${url}" tabindex="-1" aria-hidden="true"><img src="${product.images[0]}" alt="" loading="lazy" /></a>
        ${options.heart === false ? "" : S.heartButtonHtml(product.id)}
        <div class="shop-card-body">
          <p class="shop-card-cat">${esc(t(CATEGORY_KEYS[product.category]))}</p>
          <h3><a href="${url}">${name}</a></h3>
          <p class="shop-card-tagline">${esc(S.pick(product.tagline))}</p>
          <p class="shop-card-price">${startingPriceHtml(product)}</p>
          ${options.actions || ""}
        </div>
      </article>`;
  }

  /* ==========================================================
     1. SHOP GRID (shop.html)
     ========================================================== */
  function initShop() {
    const grid = document.getElementById("shop-grid");
    const countEl = document.getElementById("shop-count");
    const sortSelect = document.getElementById("shop-sort");
    const chips = document.querySelectorAll("[data-category]");
    const params = new URLSearchParams(window.location.search);
    let category = CATEGORY_KEYS[params.get("category")] ? params.get("category") : "all";

    function render() {
      let list = PRODUCTS.filter((p) => category === "all" || p.category === category);

      // Sort by starting price. Products with no price yet ("Price TBC") always go last.
      const priceOf = (p, empty) => S.startingPrice(p) || empty;
      if (sortSelect.value === "price-asc") list = list.slice().sort((a, b) => priceOf(a, Infinity) - priceOf(b, Infinity));
      if (sortSelect.value === "price-desc") list = list.slice().sort((a, b) => priceOf(b, -1) - priceOf(a, -1));

      grid.innerHTML = list.map((p) => productCardHtml(p)).join("");
      countEl.textContent = t("shop.count").replace("{n}", list.length);
      chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.category === category)));
      S.updateHearts();
    }

    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        category = chip.dataset.category;
        render();
        // Keep the choice in the address bar so it can be shared / bookmarked
        // (some browsers block this when the page is opened as a local file — that's fine)
        try {
          const url = new URL(window.location.href);
          if (category === "all") url.searchParams.delete("category");
          else url.searchParams.set("category", category);
          history.replaceState(null, "", url);
        } catch (e) {
          /* ignore */
        }
      })
    );
    sortSelect.addEventListener("change", render);
    onChange(render);
    render();
  }

  /* ==========================================================
     2. PRODUCT DETAIL (product.html?id=roboox)
     ========================================================== */
  function initProduct() {
    const root = document.getElementById("product-detail");
    const product = S.getProduct(new URLSearchParams(window.location.search).get("id"));

    if (!product) {
      const renderMissing = () => {
        root.innerHTML = `<div class="empty-state"><p>${esc(t("product.notFound"))}</p><a class="btn btn-primary" href="shop.html">${esc(t("product.back"))}</a></div>`;
      };
      document.addEventListener("cooneo:languagechange", renderMissing);
      return renderMissing();
    }

    // The photo slideshow is drawn once (so changing language doesn't jump back to photo 1).
    // The information column is redrawn on language change, keeping the customer's choices.
    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="shop.html" data-crumb-shop></a><span aria-hidden="true">/</span><span data-crumb-name></span></nav>
      <div class="pd">
        <div class="pd-media">
          <div class="carousel" data-carousel>
            <div class="carousel-track">
              ${product.images.map((src) => `<img src="${src}" alt="" data-pd-alt width="1200" height="750" />`).join("")}
            </div>
          </div>
        </div>
        <div class="pd-info"></div>
      </div>`;
    const info = root.querySelector(".pd-info");

    // Read what is currently chosen in the form → { groupId: "choiceId" or ["id", "id"] }
    function readOptions() {
      const options = {};
      product.optionGroups.forEach((group) => {
        const checked = Array.from(info.querySelectorAll(`input[name="opt-${group.id}"]:checked`)).map((i) => i.value);
        if (!checked.length) return;
        options[group.id] = group.type === "multi" ? checked : checked[0];
      });
      return options;
    }

    function readQty() {
      const input = info.querySelector("#pd-qty");
      const qty = parseInt(input ? input.value : "1", 10);
      return Math.min(Math.max(qty || 1, 1), 99);
    }

    // Update the price and total whenever an option or the quantity changes
    function updateTotal() {
      const price = S.unitPrice(product, readOptions());
      info.querySelector("#pd-price").innerHTML = S.priceHtml(price);
      info.querySelector("#pd-total").innerHTML = S.priceHtml(price * readQty());
    }

    function optionGroupHtml(group) {
      const inputType = group.type === "multi" ? "checkbox" : "radio";
      const tag = [t(group.required ? "product.required" : "product.optional"), group.type === "multi" ? t("product.chooseAny") : t("product.chooseOne")].join(" · ");
      const choices = group.choices
        .map(
          (choice) => `
          <label class="opt-choice">
            <input type="${inputType}" name="opt-${esc(group.id)}" value="${esc(choice.id)}" />
            <span>${esc(S.pick(choice.label))}${choice.price ? ` <em>+¥ ${choice.price.toLocaleString("en-US")}</em>` : ""}</span>
          </label>`
        )
        .join("");
      return `
        <fieldset class="opt-group" data-group="${esc(group.id)}">
          <legend>${esc(S.pick(group.label))} <span class="opt-tag">${esc(tag)}</span></legend>
          <div class="opt-choices">${choices}</div>
          <p class="error" aria-live="polite"></p>
        </fieldset>`;
    }

    function render() {
      const keepOptions = info.childElementCount ? readOptions() : {};
      const keepQty = info.childElementCount ? readQty() : 1;
      const name = S.pick(product.name);
      document.title = `${name} | COONEO`;
      root.querySelector("[data-crumb-shop]").textContent = t("nav.shop");
      root.querySelector("[data-crumb-name]").textContent = name;
      root.querySelectorAll("[data-pd-alt]").forEach((img, i) => (img.alt = `${name} (${i + 1})`));

      info.innerHTML = `
        <p class="product-kicker">${esc(t(CATEGORY_KEYS[product.category]))}</p>
        <h1>${esc(name)}</h1>
        <p class="pd-tagline">${esc(S.pick(product.tagline))}</p>
        <p class="pd-price" id="pd-price"></p>
        ${S.depositNoticeHtml()}
        <p class="pd-desc">${esc(S.pick(product.description))}</p>
        <form id="pd-form" novalidate>
          ${product.optionGroups.map(optionGroupHtml).join("")}
          <div class="pd-qty-row">
            <label for="pd-qty">${esc(t("product.quantity"))}</label>
            <div class="qty">
              <button type="button" data-qty="-1" aria-label="${esc(t("product.decrease"))}">−</button>
              <input id="pd-qty" type="number" min="1" max="99" value="${keepQty}" inputmode="numeric" />
              <button type="button" data-qty="1" aria-label="${esc(t("product.increase"))}">+</button>
            </div>
          </div>
          <div class="pd-total"><span>${esc(t("product.total"))}</span><strong id="pd-total"></strong></div>
          <div class="pd-actions">
            <button type="submit" class="btn btn-primary">${esc(t("product.addToCart"))}</button>
            ${S.heartButtonHtml(product.id, true)}
          </div>
        </form>
        <div class="pd-links">
          ${product.specSheet ? `<a href="Assets/Docs/spec-sheets/${product.specSheet}-${currentLang}.pdf" download="COONEO-${product.specSheet}-${currentLang}.pdf">${esc(t("btn.specSheet"))}</a>` : ""}
          <a href="contact.html">${esc(t("btn.enquire"))}</a>
        </div>`;

      // Put back the customer's earlier choices
      Object.entries(keepOptions).forEach(([groupId, value]) => {
        [].concat(value).forEach((choiceId) => {
          const input = info.querySelector(`input[name="opt-${CSS.escape(groupId)}"][value="${CSS.escape(choiceId)}"]`);
          if (input) input.checked = true;
        });
      });
      updateTotal();
      S.updateHearts();
    }

    // Typing / clicking in the form
    info.addEventListener("change", (event) => {
      const group = event.target.closest(".opt-group");
      if (group) group.querySelector(".error").textContent = "";
      updateTotal();
    });
    info.addEventListener("input", updateTotal);
    info.addEventListener("click", (event) => {
      const step = event.target.closest("[data-qty]");
      if (!step) return;
      const input = info.querySelector("#pd-qty");
      input.value = Math.min(Math.max(readQty() + Number(step.dataset.qty), 1), 99);
      updateTotal();
    });

    // Add to Cart: required options must be chosen first
    info.addEventListener("submit", (event) => {
      event.preventDefault();
      const options = readOptions();
      let firstMissing = null;
      product.optionGroups.forEach((group) => {
        const fieldset = info.querySelector(`.opt-group[data-group="${CSS.escape(group.id)}"]`);
        const missing = group.required && !options[group.id];
        fieldset.querySelector(".error").textContent = missing ? t("product.chooseError") : "";
        fieldset.classList.toggle("invalid", missing);
        if (missing && !firstMissing) firstMissing = fieldset;
      });
      if (firstMissing) {
        firstMissing.scrollIntoView({ behavior: "smooth", block: "center" });
        firstMissing.querySelector("input").focus({ preventScroll: true });
        return;
      }
      info.querySelector("#pd-qty").value = readQty();
      S.addToCart(product.id, options, readQty());
      S.openDrawer();
    });

    document.addEventListener("cooneo:languagechange", render);
    render();
    initCarousels(); // from script.js — turns the photos into a slideshow
  }

  /* ==========================================================
     3. CART PAGE (cart.html)
     ========================================================== */
  function initCart() {
    const root = document.getElementById("cart-page");

    function render() {
      if (!S.state.cart.length) {
        root.innerHTML = `<div class="empty-state"><p>${esc(t("cart.empty"))}</p><a class="btn btn-primary" href="shop.html">${esc(t("cart.continue"))}</a></div>`;
        return;
      }
      root.innerHTML = `
        <div class="cart-layout">
          <ul class="cart-lines cart-lines-lg">${S.state.cart.map(S.cartLineHtml).join("")}</ul>
          <aside class="summary-card">
            <h2 class="h3">${esc(t("cart.summary"))}</h2>
            <div class="summary-row"><span>${esc(t("cart.items").replace("{n}", S.cartCount()))}</span></div>
            <div class="summary-row summary-total"><span>${esc(t("cart.subtotal"))}</span><strong>${S.priceHtml(S.cartSubtotal())}</strong></div>
            ${S.depositNoticeHtml()}
            <a class="btn btn-primary btn-block" href="checkout.html">${esc(t("cart.checkout"))}</a>
            <a class="btn btn-outline btn-block" href="shop.html">${esc(t("cart.continue"))}</a>
          </aside>
        </div>`;
    }

    onChange(render);
    render();
  }

  /* ==========================================================
     4. FAVOURITES PAGE (favourites.html)
     ========================================================== */
  function initFavourites() {
    const root = document.getElementById("favourites-page");

    function render() {
      const products = S.state.favs.map(S.getProduct).filter(Boolean);
      if (!products.length) {
        root.innerHTML = `<div class="empty-state"><p>${esc(t("favs.empty"))}</p><a class="btn btn-primary" href="shop.html">${esc(t("cart.continue"))}</a></div>`;
        return;
      }
      root.innerHTML = `<div class="shop-grid">${products
        .map((p) =>
          productCardHtml(p, {
            heart: false,
            actions: `
              <div class="shop-card-actions">
                <button type="button" class="btn btn-primary btn-sm" data-move="${esc(p.id)}">${esc(t("favs.moveToCart"))}</button>
                <button type="button" class="btn btn-outline btn-sm" data-fav-remove="${esc(p.id)}">${esc(t("favs.remove"))}</button>
              </div>`,
          })
        )
        .join("")}</div>`;
    }

    root.addEventListener("click", (event) => {
      const move = event.target.closest("[data-move]");
      const remove = event.target.closest("[data-fav-remove]");
      if (move) {
        const product = S.getProduct(move.dataset.move);
        // Products with required options (e.g. 2-finger / 3-finger) need choosing on the product page first
        if (S.hasRequiredOptions(product)) {
          window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
          return;
        }
        S.addToCart(product.id, {}, 1);
        S.toggleFavourite(product.id);
        S.openDrawer();
      }
      if (remove) {
        S.toggleFavourite(remove.dataset.favRemove);
        S.showToast(t("fav.removed"));
      }
    });

    onChange(render);
    render();
  }

  /* ==========================================================
     5. CHECKOUT (checkout.html) — login required, no payment
     ========================================================== */
  function initCheckout() {
    const gate = document.getElementById("checkout-gate");
    const main = document.getElementById("checkout-main");
    const form = document.getElementById("checkout-form");
    const summary = document.getElementById("checkout-summary");
    const done = document.getElementById("checkout-done");
    const submitBtn = form.querySelector("button[type=submit]");
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let submitted = false;

    function showGate(key, linkHtml = "") {
      gate.hidden = false;
      main.hidden = true;
      gate.innerHTML = `<div class="empty-state"><p data-msg-key="${key}">${esc(t(key))}</p>${linkHtml}</div>`;
    }

    function renderSummary() {
      if (submitted) return;
      summary.innerHTML = `
        <h2 class="h3">${esc(t("cart.summary"))}</h2>
        <ul class="summary-lines">
          ${S.state.cart
            .map((line) => {
              const p = S.getProduct(line.productId);
              const opts = S.describeOptions(p, line.options).map((o) => esc(S.optionText(o))).join("<br />");
              return `<li><div><strong>${esc(S.pick(p.name))}</strong> × ${line.qty}${opts ? `<small>${opts}</small>` : ""}</div><span>${S.priceHtml(S.unitPrice(p, line.options) * line.qty)}</span></li>`;
            })
            .join("")}
        </ul>
        <div class="summary-row summary-total"><span>${esc(t("cart.subtotal"))}</span><strong>${S.priceHtml(S.cartSubtotal())}</strong></div>
        ${S.depositNoticeHtml()}
        <a class="link-btn" href="cart.html">${esc(t("checkout.editCart"))}</a>`;
    }

    function update() {
      if (submitted) return;
      if (!S.firebaseReady) return showGate("auth.notConfigured");
      if (!S.state.user) {
        window.location.href = "login.html?next=checkout.html";
        return;
      }
      if (!S.state.cart.length) {
        return showGate("checkout.emptyCart", `<a class="btn btn-primary" href="shop.html">${esc(t("cart.continue"))}</a>`);
      }
      gate.hidden = true;
      main.hidden = false;
      // Fill in what we already know about the user (only into empty boxes)
      if (!form.elements.name.value) form.elements.name.value = S.state.user.displayName || "";
      if (!form.elements.email.value) form.elements.email.value = S.state.user.email || "";
      renderSummary();
    }

    // --- Form checks (same style as the contact form) ---
    function setError(input, key) {
      const field = input.closest(".field");
      const errorEl = field.querySelector(".error");
      field.classList.toggle("invalid", Boolean(key));
      if (key) {
        input.setAttribute("aria-invalid", "true");
        errorEl.dataset.msgKey = key; // so it is re-translated when the language changes
        errorEl.textContent = t(key);
      } else {
        input.removeAttribute("aria-invalid");
        delete errorEl.dataset.msgKey;
        errorEl.textContent = "";
      }
    }

    function check(input) {
      const value = input.value.trim();
      if (input.required && !value) return "form.errRequired";
      if (input.type === "email" && value && !EMAIL_PATTERN.test(value)) return "form.errEmail";
      return null;
    }

    form.querySelectorAll("input, textarea").forEach((input) =>
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) setError(input, check(input));
      })
    );

    // Order number like "CN20261105-7KX2QF"
    function makeOrderNumber() {
      const d = new Date();
      const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
      return `CN${date}-${code}`;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll("input, textarea").forEach((input) => {
        const error = check(input);
        setError(input, error);
        if (error && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) return firstInvalid.focus();

      const user = S.state.user;
      const orderNumber = makeOrderNumber();
      // Save names and options in both languages, so the order reads correctly later
      const items = S.state.cart.map((line) => {
        const p = S.getProduct(line.productId);
        return {
          productId: p.id,
          name: { en: p.name.en, zh: p.name.zh },
          options: { en: S.describeOptions(p, line.options, "en"), zh: S.describeOptions(p, line.options, "zh") },
          optionIds: line.options,
          qty: line.qty,
          unitPrice: S.unitPrice(p, line.options),
        };
      });
      const value = (name) => form.elements[name].value.trim();
      const order = {
        orderNumber,
        uid: user.uid,
        accountEmail: user.email || "",
        customer: {
          name: value("name"),
          phone: value("phone"),
          email: value("email"),
          country: value("country"),
          address: value("address"),
          notes: value("notes"),
        },
        items,
        subtotal: S.cartSubtotal(),
        currency: "CNY",
        status: "pending_price_confirmation", // customer service changes this in the Firebase console
        language: currentLang,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = t("checkout.submitting");
      try {
        await S.db.collection("orders").doc(orderNumber).set(order);
        submitted = true;
        S.clearCart();
        showDone(orderNumber);
      } catch (err) {
        console.warn("Order failed:", err);
        S.showToast(t("checkout.error"));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t("checkout.submit");
      }
    });

    // Confirmation with the order number + buttons to contact customer service
    function showDone(orderNumber) {
      main.hidden = true;
      gate.hidden = true;
      done.hidden = false;
      document.getElementById("done-order-id").textContent = orderNumber;
      const waLink = document.getElementById("done-whatsapp");
      const setWaLink = () => {
        waLink.href = `https://wa.me/${CS_WHATSAPP}?text=${encodeURIComponent(t("checkout.waMessage").replace("{id}", orderNumber))}`;
      };
      setWaLink();
      document.addEventListener("cooneo:languagechange", setWaLink);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    S.whenAuthReady(() => {
      update();
      onChange(update);
    });
  }

  /* ==========================================================
     6. LOGIN / REGISTER (login.html)
     ========================================================== */
  function initLogin() {
    const next = safeNext(new URLSearchParams(window.location.search).get("next"), "account.html");
    const forms = document.getElementById("auth-forms");
    const loggedIn = document.getElementById("auth-logged-in");
    const message = document.getElementById("auth-message");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabs = document.querySelectorAll("[data-auth-tab]");

    // Show a message under the forms. type = "error" or "success"
    function say(key, type = "error") {
      message.hidden = !key;
      message.className = `auth-message auth-message-${type}`;
      message.dataset.msgKey = key || "";
      message.textContent = key ? t(key) : "";
    }

    function showTab(name) {
      tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.authTab === name)));
      loginForm.hidden = name !== "login";
      registerForm.hidden = name !== "register";
      say(null);
    }
    tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.authTab)));
    if (new URLSearchParams(window.location.search).get("mode") === "register") showTab("register");

    // Login not set up yet → switch the forms off and explain why
    if (!S.firebaseReady) {
      forms.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
      say("auth.notConfigured");
      return;
    }

    // Disable buttons while waiting for Firebase, then go to the next page or show the error
    async function run(button, action) {
      say(null);
      button.disabled = true;
      try {
        await action();
        window.location.href = next;
      } catch (err) {
        say(S.authErrorKey(err));
      } finally {
        button.disabled = false;
      }
    }

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = loginForm.elements.email.value.trim();
      const password = loginForm.elements.password.value;
      if (!email || !password) return say("auth.err.missing");
      run(loginForm.querySelector("button[type=submit]"), () => S.logIn(email, password));
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = registerForm.elements.name.value.trim();
      const email = registerForm.elements.email.value.trim();
      const password = registerForm.elements.password.value;
      if (!name || !email || !password) return say("auth.err.missing");
      if (password.length < 6) return say("auth.err.weakPassword");
      run(registerForm.querySelector("button[type=submit]"), () => S.register(name, email, password));
    });

    document.getElementById("google-login").addEventListener("click", (event) => {
      run(event.currentTarget, () => S.logInWithGoogle());
    });

    // Forgot password: uses the email typed in the login form
    document.getElementById("forgot-password").addEventListener("click", async () => {
      const email = loginForm.elements.email.value.trim();
      if (!email) {
        loginForm.elements.email.focus();
        return say("auth.resetNeedEmail");
      }
      try {
        await S.resetPassword(email);
        say("auth.resetSent", "success");
      } catch (err) {
        say(S.authErrorKey(err));
      }
    });

    // Already logged in? Go straight on (if sent here from checkout), otherwise show a short panel
    function update() {
      const user = S.state.user;
      if (user && new URLSearchParams(window.location.search).get("next")) {
        window.location.href = next;
        return;
      }
      forms.hidden = Boolean(user);
      loggedIn.hidden = !user;
      if (user) {
        document.getElementById("auth-user").textContent = t("auth.loggedInAs").replace("{name}", S.displayName(user));
      }
    }
    S.whenAuthReady(() => {
      update();
      document.addEventListener("cooneo:languagechange", update);
    });
  }

  /* ==========================================================
     7. MY ACCOUNT (account.html)
     ========================================================== */
  function initAccount() {
    const gate = document.getElementById("account-gate");
    const main = document.getElementById("account-main");
    const list = document.getElementById("orders-list");
    let orders = null; // null = still loading, "error" = failed, [] = none

    function statusText(status) {
      const key = `order.status.${status}`;
      const text = t(key);
      return text || status;
    }

    function renderOrders() {
      if (orders === null) {
        list.innerHTML = `<p class="muted">${esc(t("account.loading"))}</p>`;
        return;
      }
      if (orders === "error") {
        list.innerHTML = `<p class="muted">${esc(t("account.ordersError"))}</p>`;
        return;
      }
      if (!orders.length) {
        list.innerHTML = `<div class="empty-state empty-state-left"><p>${esc(t("account.noOrders"))}</p><a class="btn btn-primary btn-sm" href="shop.html">${esc(t("cart.continue"))}</a></div>`;
        return;
      }
      const lang = currentLang;
      list.innerHTML = orders
        .map((order) => {
          const date = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleDateString(lang === "zh" ? "zh-CN" : "en-SG") : "";
          const items = (order.items || [])
            .map((item) => {
              const opts = ((item.options && item.options[lang]) || []).map((o) => esc(S.optionText(o))).join(lang === "zh" ? "；" : "; ");
              return `<li>${esc((item.name && (item.name[lang] || item.name.en)) || item.productId)} × ${item.qty}${opts ? ` <small>(${opts})</small>` : ""}</li>`;
            })
            .join("");
          return `
            <article class="order-card">
              <div class="order-head">
                <div><span class="muted">${esc(t("order.number"))}</span> <strong>${esc(order.orderNumber)}</strong></div>
                <span class="status-badge status-${esc(order.status)}">${esc(statusText(order.status))}</span>
              </div>
              <p class="muted">${esc(t("order.date"))}: ${esc(date)}</p>
              <ul class="order-items">${items}</ul>
              <div class="summary-row"><span>${esc(t("cart.subtotal"))}</span><strong>${S.priceHtml(order.subtotal || 0)}</strong></div>
            </article>`;
        })
        .join("");
    }

    async function loadOrders(user) {
      try {
        // Only this user's orders (the security rules also enforce this). Sorted newest first.
        const snap = await S.db.collection("orders").where("uid", "==", user.uid).get();
        orders = [];
        snap.forEach((doc) => orders.push(doc.data()));
        orders.sort((a, b) => ((b.createdAt && b.createdAt.toMillis()) || 0) - ((a.createdAt && a.createdAt.toMillis()) || 0));
      } catch (err) {
        console.warn("Could not load orders:", err);
        orders = "error";
      }
      renderOrders();
    }

    S.whenAuthReady(() => {
      if (!S.firebaseReady) {
        gate.innerHTML = `<div class="empty-state"><p data-msg-key="auth.notConfigured">${esc(t("auth.notConfigured"))}</p></div>`;
        return;
      }
      const user = S.state.user;
      if (!user) {
        window.location.href = "login.html?next=account.html";
        return;
      }
      gate.hidden = true;
      main.hidden = false;
      const fillUser = () => {
        document.getElementById("account-name").textContent = S.displayName(S.state.user);
        document.getElementById("account-email").textContent = S.state.user.email || "";
      };
      fillUser();
      renderOrders();
      loadOrders(user);
      document.addEventListener("cooneo:languagechange", renderOrders);
      document.addEventListener("cooneo:authchange", () => {
        if (!S.state.user) window.location.href = "login.html?next=account.html";
        else fillUser();
      });
    });
  }

  /* ==========================================================
     Run the part for this page
     ========================================================== */
  const PAGES = {
    shop: initShop,
    product: initProduct,
    cart: initCart,
    favourites: initFavourites,
    checkout: initCheckout,
    login: initLogin,
    account: initAccount,
  };
  if (PAGES[page]) PAGES[page]();
})();

// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NS = "nevux-widget";

  console.log("[Nevux] v27 Loaded - Multi-Page NevuxBot & Store Engine");

  /* ═══════════════════════════════════════════
     NUBESDK ADAPTER (Tiendanube NubeSDK Contract V2)
  ═══════════════════════════════════════════ */
  window.NubeSDK = window.NubeSDK || null;

  function initNubeSDKIntegration(sdk) {
    if (!sdk) return;
    try {
      if (typeof sdk.subscribe === "function") {
        sdk.subscribe("cart:updated", function (cartData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
        });
        sdk.subscribe("product:rendered", function (productData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
          if (typeof initNevuxBotEngine === "function") initNevuxBotEngine();
        });
        sdk.subscribe("page:rendered", function (pageData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
          if (typeof initNevuxBotEngine === "function") initNevuxBotEngine();
        });
      }
    } catch (err) {
      console.error("[Nevux] NubeSDK error:", err);
    }
  }

  if (window.NubeSDK) {
    initNubeSDKIntegration(window.NubeSDK);
  } else {
    document.addEventListener("nubeSDKReady", function (e) {
      var sdk = (e && e.detail) ? e.detail : window.NubeSDK;
      initNubeSDKIntegration(sdk);
    });
  }

  /* ═══════════════════════════════════════════
     MÓDULO NEVUXBOT AI (Historial por Producto + Contexto Inteligente)
  ═══════════════════════════════════════════ */
  function detectNevuxStoreId() {
    if (window.NEVUX_STORE_ID) return String(window.NEVUX_STORE_ID);
    if (window.LS && window.LS.store && window.LS.store.id) return String(window.LS.store.id);
    if (window.LS && window.LS.storeId) return String(window.LS.storeId);
    if (window.Store && (window.Store.id || window.Store.store_id)) return String(window.Store.id || window.Store.store_id);
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id) return String(window.__NUVEMSHOP_STORE__.id);

    const links = document.querySelectorAll('link[href*="/stores/"], script[src*="/stores/"], img[src*="/stores/"]');
    for (let i = 0; i < links.length; i++) {
      const url = links[i].href || links[i].src || "";
      const m = url.match(/\/stores\/(\d{3})\/(\d{3})\/(\d{3})\//);
      if (m) return String(parseInt(m[1] + m[2] + m[3], 10));
    }

    const html = document.documentElement ? document.documentElement.innerHTML : "";
    const cdnM = html.match(/\/stores\/(\d{3})\/(\d{3})\/(\d{3})\//);
    if (cdnM) return String(parseInt(cdnM[1] + cdnM[2] + cdnM[3], 10));

    const jsonM = html.match(/"store_id":\s*(\d+)/) || html.match(/"storeId":\s*(\d+)/) || html.match(/store_id\s*=\s*(\d+)/);
    if (jsonM && jsonM[1]) return String(jsonM[1]);

    return "7401217"; // Fallback para tu tienda
  }

  function detectCurrentProductContext() {
    var pId = null;
    var pName = null;
    var pPrice = null;

    if (window.NEVUX_PRODUCT_ID) pId = String(window.NEVUX_PRODUCT_ID);
    else if (window.Product && window.Product.id) pId = String(window.Product.id);
    else if (window.LS && window.LS.product && window.LS.product.id) pId = String(window.LS.product.id);
    else {
      var metaP = document.querySelector('meta[property="og:product:id"]');
      if (metaP && metaP.content) pId = String(metaP.content);
      else {
        var urlM = location.pathname.match(/\/productos\/[^\/]+-(\d+)/);
        if (urlM) pId = String(urlM[1]);
      }
    }

    if (window.Product && window.Product.name) pName = window.Product.name;
    else if (window.LS && window.LS.product && window.LS.product.name) pName = window.LS.product.name;
    else {
      var h1 = document.querySelector("h1.product-title, h1.js-product-name, h1");
      if (h1 && location.pathname.includes("/productos/")) pName = h1.innerText.trim();
    }

    if (window.Product && window.Product.price) pPrice = window.Product.price;
    else if (window.LS && window.LS.product && window.LS.product.price) pPrice = window.LS.product.price;

    return { productId: pId, productName: pName, productPrice: pPrice };
  }

  function initNevuxBotEngine() {
    var storeId = detectNevuxStoreId();
    if (!storeId) return;

    fetch(API_BASE + "/api/nevuxbot/config?storeId=" + storeId + "&t=" + Date.now())
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var cfg = (data && data.config) ? data.config : { is_active: true, bot_name: "Rodri", primary_color: "#10B981" };
        if (cfg.is_active !== false) {
          renderNevuxBotUI(cfg, storeId);
        }
      })
      .catch(function () {
        renderNevuxBotUI({ is_active: true, bot_name: "Rodri", primary_color: "#10B981" }, storeId);
      });
  }

  function renderNevuxBotUI(config, storeId) {
    if (document.getElementById("nevux-bot-bubble")) return;

    var botName = config.bot_name || "Rodri";
    var primaryColor = config.primary_color || "#10B981";
    var hasWA = Boolean(
      document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"], .whatsapp-button, [class*="whatsapp"]')
    );
    var bottom = hasWA ? "96px" : "24px";
    var winBottom = hasWA ? "168px" : "96px";

    var style = document.createElement("style");
    style.innerHTML =
      '#nevux-bot-bubble { position: fixed !important; bottom: ' + bottom + ' !important; right: 20px !important; width: 60px !important; height: 60px !important; background: #000000 !important; border: 2px solid ' + primaryColor + ' !important; border-radius: 50% !important; box-shadow: 0 6px 24px rgba(16,185,129,0.35) !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 2147483647 !important; transition: transform 0.25s ease !important; } ' +
      '#nevux-bot-bubble:active { transform: scale(0.92) !important; } ' +
      '#nevux-bot-bubble .pulse { position: absolute; width: 100%; height: 100%; border: 2px solid ' + primaryColor + '; border-radius: 50%; animation: nbPulseAnim 2s infinite; pointer-events: none; } ' +
      '@keyframes nbPulseAnim { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.45); opacity: 0; } } ' +
      '#nevux-bot-window { position: fixed !important; bottom: ' + winBottom + ' !important; right: 20px !important; width: 360px !important; height: 510px !important; max-height: calc(100vh - 120px) !important; max-width: calc(100vw - 32px) !important; background: rgba(10,10,10,0.96) !important; backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important; border: 1px solid rgba(16,185,129,0.3) !important; border-radius: 18px !important; box-shadow: 0 16px 45px rgba(0,0,0,0.75) !important; display: none; flex-direction: column !important; z-index: 2147483647 !important; overflow: hidden !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; } ' +
      '#nevux-bot-window.open { display: flex !important; } ' +
      '.nb-header { padding: 14px 16px !important; background: #000000 !important; border-bottom: 1px solid rgba(16,185,129,0.2) !important; display: flex !important; align-items: center !important; justify-content: space-between !important; } ' +
      '.nb-avatar { width: 38px !important; height: 38px !important; background: linear-gradient(135deg, ' + primaryColor + ', #059669) !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #ffffff !important; font-weight: bold !important; font-size: 15px !important; } ' +
      '.nb-info { margin-left: 12px !important; flex: 1 !important; } ' +
      '.nb-name { color: #ffffff !important; font-size: 14px !important; font-weight: 600 !important; display: block !important; } ' +
      '.nb-online { color: ' + primaryColor + ' !important; font-size: 11px !important; display: flex !important; align-items: center !important; gap: 4px !important; } ' +
      '.nb-close { background: none !important; border: none !important; color: #ffffff !important; opacity: 0.6 !important; cursor: pointer !important; padding: 6px !important; font-size: 18px !important; } ' +
      '.nb-messages { flex: 1 !important; padding: 16px !important; overflow-y: auto !important; display: flex !important; flex-direction: column !important; gap: 10px !important; } ' +
      '.nb-msg { max-width: 82% !important; padding: 10px 14px !important; border-radius: 14px !important; font-size: 13.5px !important; line-height: 1.4 !important; word-break: break-word !important; color: #ffffff !important; } ' +
      '.nb-msg.user { align-self: flex-end !important; background: #000000 !important; border: 1px solid ' + primaryColor + ' !important; border-bottom-right-radius: 2px !important; } ' +
      '.nb-msg.bot { align-self: flex-start !important; background: rgba(255,255,255,0.09) !important; border: 1px solid rgba(255,255,255,0.05) !important; border-bottom-left-radius: 2px !important; } ' +
      '.nb-typing { display: none; align-self: flex-start !important; background: rgba(255,255,255,0.09) !important; padding: 10px 14px !important; border-radius: 14px !important; gap: 5px !important; } ' +
      '.nb-dot { width: 6px; height: 6px; background: #ffffff; border-radius: 50%; animation: nbBounceAnim 1.4s infinite ease-in-out both; } ' +
      '@keyframes nbBounceAnim { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } } ' +
      '.nb-input-wrap { padding: 12px !important; background: #000000 !important; border-top: 1px solid rgba(255,255,255,0.1) !important; display: flex !important; gap: 8px !important; align-items: center !important; } ' +
      '.nb-input { flex: 1 !important; background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 20px !important; padding: 10px 16px !important; color: #ffffff !important; font-size: 13.5px !important; outline: none !important; } ' +
      '.nb-send { background: ' + primaryColor + ' !important; border: none !important; width: 38px !important; height: 38px !important; border-radius: 50% !important; color: #ffffff !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; } ' +
      '@media (max-width: 480px) { #nevux-bot-window { bottom: 0 !important; right: 0 !important; width: 100% !important; height: 100% !important; max-height: 100% !important; max-width: 100% !important; border-radius: 0 !important; border: none !important; } }';
    document.head.appendChild(style);

    var bubble = document.createElement("div");
    bubble.id = "nevux-bot-bubble";
    bubble.innerHTML =
      '<div class="pulse"></div>' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' + primaryColor + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
      '</svg>';

    var win = document.createElement("div");
    win.id = "nevux-bot-window";
    win.innerHTML =
      '<div class="nb-header">' +
        '<div class="nb-avatar">' + botName.charAt(0).toUpperCase() + '</div>' +
        '<div class="nb-info"><span class="nb-name">' + botName + '</span><span class="nb-online">● En línea</span></div>' +
        '<button type="button" class="nb-close">✕</button>' +
      '</div>' +
      '<div class="nb-messages"></div>' +
      '<div class="nb-typing"><div class="nb-dot"></div><div class="nb-dot"></div><div class="nb-dot"></div></div>' +
      '<div class="nb-input-wrap">' +
        '<input type="text" class="nb-input" placeholder="Escribí tu mensaje..." autocomplete="off">' +
        '<button type="button" class="nb-send">➤</button>' +
      '</div>';

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    var msgs = win.querySelector(".nb-messages");
    var input = win.querySelector(".nb-input");
    var send = win.querySelector(".nb-send");
    var typing = win.querySelector(".nb-typing");
    var closeBtn = win.querySelector(".nb-close");

    function getStorageKey() {
      var ctx = detectCurrentProductContext();
      if (ctx.productId) {
        return 'nevux_bot_history_' + storeId + '_p' + ctx.productId;
      }
      return 'nevux_bot_history_' + storeId + '_general';
    }

    var storageKey = getStorageKey();
    var history = [];

    function appendMsg(sender, text, save) {
      if (save === undefined) save = true;
      var d = document.createElement("div");
      d.className = 'nb-msg ' + sender;
      d.innerText = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      if (save) {
        history.push({ sender: sender, text: text });
        try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch (e) {}
      }
    }

    function loadHistoryForCurrentPage() {
      msgs.innerHTML = "";
      storageKey = getStorageKey();
      history = [];
      try {
        var saved = localStorage.getItem(storageKey);
        if (saved) history = JSON.parse(saved);
      } catch (e) {}

      var ctx = detectCurrentProductContext();
      if (history.length === 0) {
        if (ctx.productName) {
          appendMsg("bot", '¡Hola! Soy ' + botName + '. ¿Tenés alguna duda sobre "' + ctx.productName + '"? 😊', false);
        } else {
          appendMsg("bot", '¡Hola! Soy ' + botName + ', tu asesora personal. ¿En qué te puedo ayudar hoy? 😊', false);
        }
      } else {
        history.forEach(function (m) { appendMsg(m.sender, m.text, false); });
      }
    }

    loadHistoryForCurrentPage();

    bubble.onclick = function () {
      loadHistoryForCurrentPage();
      win.classList.add("open");
      bubble.style.display = "none";
      setTimeout(function () { input.focus(); }, 150);
    };

    closeBtn.onclick = function () {
      win.classList.remove("open");
      bubble.style.display = "flex";
    };

    function sendMessage() {
      var val = input.value.trim();
      if (!val) return;

      appendMsg("user", val, true);
      input.value = "";
      typing.style.display = "flex";
      msgs.scrollTop = msgs.scrollHeight;

      var ctx = detectCurrentProductContext();

      fetch(API_BASE + "/api/nevuxbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: storeId,
          message: val,
          conversationHistory: history,
          productId: ctx.productId,
          productName: ctx.productName,
          productPrice: ctx.productPrice
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          typing.style.display = "none";
          appendMsg("bot", d.reply || "¡Hola! ¿En qué te puedo ayudar?", true);
        })
        .catch(function () {
          typing.style.display = "none";
          appendMsg("bot", "Disculpas, tuve una demora de conexión. ¿Me repetís la consulta?", false);
        });
    }

    send.onclick = sendMessage;
    input.onkeypress = function (e) {
      if (e.key === "Enter") sendMessage();
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNevuxBotEngine);
  } else {
    initNevuxBotEngine();
  }
  setTimeout(initNevuxBotEngine, 1000);

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function splitEmoji(str) {
    if (!str) return { emoji: "", text: "" };
    const s = str.trim();
    let emojiEnd = 0;
    for (let i = 0; i < s.length && i < 4; i++) {
      const code = s.charCodeAt(i);
      if (code >= 0xD800 && code <= 0xDBFF) {
        emojiEnd = i + 2;
      } else if (code > 0x2000 && code !== 0x20) {
        emojiEnd = i + 1;
      } else if (emojiEnd > 0) {
        break;
      } else {
        break;
      }
    }
    if (emojiEnd > 0) {
      return { emoji: s.substring(0, emojiEnd), text: s.substring(emojiEnd).trim() };
    }
    return { emoji: "", text: s };
  }

  function detectStoreId() {
    if (window.NEVUX_STORE_ID) return window.NEVUX_STORE_ID;
    if (window.Store && (window.Store.id || window.Store.store_id))
      return window.Store.id || window.Store.store_id;
    if (window.LS && window.LS.store && window.LS.store.id) return window.LS.store.id;
    if (window.LS && window.LS.storeId) return window.LS.storeId;
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id)
      return window.__NUVEMSHOP_STORE__.id;
    const meta = qs('meta[name="store-id"]');
    if (meta) return meta.content;
    const html = document.documentElement.innerHTML;
    let m = html.match(/"store_id":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    m = html.match(/"storeId":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    const assetLink = qs('link[href*="/stores/"]');
    if (assetLink) {
      const cdnMatch = assetLink.href.match(/\/stores\/(\d+)/);
      if (cdnMatch) return parseInt(cdnMatch[1], 10);
    }
    return null;
  }

  function detectProductId() {
    if (window.NEVUX_PRODUCT_ID) return window.NEVUX_PRODUCT_ID;
    if (window.Product) return window.Product.id;
    if (window.LS && window.LS.product && window.LS.product.id) return window.LS.product.id;
    const meta = qs('meta[property="og:product:id"]');
    if (meta) return meta.content;
    const m = document.location.pathname.match(/\/productos\/[^/]+-(\d+)/);
    if (m) return parseInt(m[1], 10);
    const html = document.documentElement.innerHTML;
    const pm = html.match(/"product_id":\s*(\d+)/);
    if (pm) return parseInt(pm[1], 10);
    return null;
  }

  function detectProductPrice() {
    if (window.Product && window.Product.price) return parseFloat(window.Product.price);
    if (window.LS && window.LS.product && window.LS.product.price) {
      return parseFloat(window.LS.product.price);
    }
    const priceEl = qs('[data-store="product-price"]') ||
                    qs('.js-price-display') ||
                    qs('.price-display') ||
                    qs('span[itemprop="price"]');
    if (priceEl) {
      const txt = priceEl.textContent || priceEl.getAttribute("content") || "";
      const num = parseFloat(txt.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", "."));
      if (!isNaN(num)) return num;
    }
    return null;
  }

  function detectPageType() {
    const path = document.location.pathname.toLowerCase().replace(/\/$/, "");
    if (path === "" || path === "/home" || path === "/inicio") return "home";
    if (path.indexOf("/productos/") >= 0 || path.indexOf("/products/") >= 0) return "product";
    if (path.indexOf("/carrito") >= 0 || path.indexOf("/cart") >= 0) return "cart";
    return "other";
  }

  function formatMoney(n) {
    if (n === null || n === undefined || isNaN(n)) return "$****";
    try {
      return "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    } catch (e) {
      return "$" + n.toFixed(2);
    }
  }

  function formatMoneyInt(n) {
    if (n === null || n === undefined || isNaN(n)) return "$0";
    try {
      return "$" + Math.round(n).toLocaleString("es-AR");
    } catch (e) {
      return "$" + Math.round(n);
    }
  }

  /* ═══════════════════════════════════════════
     DETECTAR SUBTOTAL DEL CARRITO
  ═══════════════════════════════════════════ */
  function detectCartSubtotal() {
    if (window.LS && window.LS.cart) {
      if (typeof window.LS.cart.subtotal === "number") return window.LS.cart.subtotal;
      if (typeof window.LS.cart.total === "number") return window.LS.cart.total;
      if (window.LS.cart.subtotal_cents) return window.LS.cart.subtotal_cents / 100;
    }
    if (window.Cart && typeof window.Cart.subtotal === "number") return window.Cart.subtotal;

    var sel = [
      '[data-store="cart-subtotal"]',
      '[data-store="subtotal"]',
      '.js-cart-subtotal',
      '.cart-subtotal',
      '[data-cart-subtotal]',
    ];
    for (var i = 0; i < sel.length; i++) {
      var el = qs(sel[i]);
      if (el) {
        var txt = el.textContent || el.getAttribute("data-cart-subtotal") || "";
        var num = parseFloat(txt.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", "."));
        if (!isNaN(num) && num >= 0) return num;
      }
    }
    return 0;
  }

  function fetchCartSubtotal(callback) {
    try {
      fetch("/carrito.json", { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (data) {
            var sub = data.subtotal || data.total || 0;
            if (typeof sub === "number") { callback(sub); return; }
          }
          callback(detectCartSubtotal());
        })
        .catch(function () { callback(detectCartSubtotal()); });
    } catch (e) {
      callback(detectCartSubtotal());
    }
  }

  /* ═══════════════════════════════════════════
     ESTILOS GLOBALES + KEYFRAMES
  ═══════════════════════════════════════════ */
  function injectGlobalStyles() {
    if (qs("#" + NS + "-styles")) return;
    const style = document.createElement("style");
    style.id = NS + "-styles";
    style.textContent = `
      .${NS}-root, .${NS}-root * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${NS}-root { margin: 12px 0; line-height: 1.3; }
      .${NS}-topbar {
        position: fixed !important;
        top: 0; left: 0; right: 0;
        z-index: 999999;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .${NS}-widget-host { position: relative; overflow: hidden; }
      .${NS}-bar {
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 6px; padding: 10px 16px; overflow: hidden; width: 100%;
      }
      .${NS}-bar-row {
        display: flex; align-items: center; justify-content: center;
        gap: 10px; max-width: 100%;
      }
      .${NS}-bar-title {
        font-size: 13px; font-weight: 700;
        text-align: center; line-height: 1.3;
        max-width: 100%; padding: 0 4px;
      }
      .${NS}-bar-emoji {
        display: inline-block;
        animation: ${NS}-heartbeat 1.6s ease infinite;
        margin-right: 6px;
      }
      .${NS}-bar-clock {
        display: inline-flex; align-items: center;
        gap: 4px; flex-shrink: 0;
      }
      .${NS}-bar-digit {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 34px; height: 32px;
        background: #ffffff; color: #0f172a;
        border-radius: 6px; padding: 2px 6px;
        font-size: 14px; font-weight: 800;
        font-variant-numeric: tabular-nums;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.08);
        position: relative; overflow: hidden;
      }
      .${NS}-bar-digit::before {
        content: "";
        position: absolute; top: 0; left: 0; right: 0;
        height: 50%;
        background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
        border-radius: 6px 6px 0 0;
        pointer-events: none;
      }
      .${NS}-bar-sep { font-size: 15px; font-weight: 900; opacity: 0.85; }
      .${NS}-bar-btn {
        padding: 7px 16px; background: #ffffff;
        border: none; border-radius: 7px;
        font-size: 11px; font-weight: 800;
        letter-spacing: 0.06em; cursor: pointer;
        white-space: nowrap; flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      .${NS}-digit {
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 800; font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
        position: relative; overflow: hidden;
      }
      .${NS}-digit.bounce {
        animation: ${NS}-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .${NS}-label {
        font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.08em; opacity: 0.75;
      }
      .${NS}-unit {
        display: inline-flex; flex-direction: column;
        align-items: center; gap: 3px;
      }
      .${NS}-sep {
        display: inline-flex; flex-direction: column;
        gap: 4px; padding-bottom: 14px;
      }
      .${NS}-sep span {
        width: 4px; height: 4px; border-radius: 50%;
        opacity: 0.85;
        animation: ${NS}-blink 1s ease infinite;
      }
      .${NS}-retro-digit { display: inline-flex; gap: 2px; }
      .${NS}-retro-cell {
        width: 26px; height: 38px;
        background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%);
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace; font-weight: 900;
        position: relative; overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .${NS}-retro-cell::after {
        content: ''; position: absolute; top: 50%; left: 0; right: 0;
        height: 1px; background: rgba(0,0,0,0.5);
      }
      .${NS}-retro-cell.flip { animation: ${NS}-retroflip 0.3s ease; }
      .${NS}-banner-wrap {
        width: 100%; overflow: hidden; position: relative;
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
        mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
      }
      .${NS}-banner-track { display: inline-flex; white-space: nowrap; will-change: transform; }
      .${NS}-banner-item { display: inline-block; }
      .${NS}-progress-wrap { position: relative; width: 100%; padding-right: 24px; }
      .${NS}-progress-track { position: relative; width: 100%; height: 8px; border-radius: 999px; overflow: visible; }
      .${NS}-progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
      .${NS}-progress-hit {
        position: absolute; top: 50%; transform: translate(-50%, -50%);
        width: 22px; height: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        transition: background 0.3s ease;
      }
      .${NS}-progress-floating {
        position: fixed !important; bottom: 20px; right: 20px;
        z-index: 999998; max-width: 340px; width: calc(100% - 40px);
        margin: 0 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-radius: 12px;
      }

      /* ═══ BUNDLE PROMOCIONES ═══ */
      .${NS}-bundle {
        display: flex; flex-direction: column; gap: 10px;
        width: 100%;
      }
      .${NS}-bundle-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
      .${NS}-bundle-card {
        display: flex; align-items: center;
        gap: 12px; padding: 14px 16px;
        border: 2px solid #e5e7eb; background: #ffffff;
        cursor: pointer; transition: all 0.15s ease;
        position: relative;
      }
      .${NS}-bundle-card:hover { border-color: #9ca3af; }
      .${NS}-bundle-card.selected { border-color: #000000; }
      .${NS}-bundle-radio {
        width: 20px; height: 20px; border-radius: 50%;
        border: 2px solid #9ca3af; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: #ffffff; transition: border-color 0.15s ease;
      }
      .${NS}-bundle-card.selected .${NS}-bundle-radio { border-color: #000000; }
      .${NS}-bundle-radio-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: #000000; opacity: 0;
        transition: opacity 0.15s ease;
      }
      .${NS}-bundle-card.selected .${NS}-bundle-radio-dot { opacity: 1; }
      .${NS}-bundle-info {
        flex: 1; display: flex; flex-direction: column;
        min-width: 0;
      }
      .${NS}-bundle-label { font-weight: 600; line-height: 1.2; }
      .${NS}-bundle-subtitle { font-weight: 500; line-height: 1.2; margin-top: 3px; }
      .${NS}-bundle-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
      .${NS}-bundle-badge {
        display: inline-block; padding: 2px 8px;
        font-size: 10px; font-weight: 700;
        border-radius: 4px; color: #ffffff;
        letter-spacing: 0.04em; text-transform: uppercase;
      }
      .${NS}-bundle-prices {
        display: flex; flex-direction: column; align-items: flex-end;
        gap: 2px; flex-shrink: 0;
      }
      .${NS}-bundle-price-old {
        text-decoration: line-through; opacity: 0.55;
        font-size: 12px; font-weight: 500;
      }
      .${NS}-bundle-price-new { font-weight: 700; line-height: 1.1; }
      .${NS}-bundle-comps {
        display: flex; flex-direction: column; gap: 6px;
        margin-top: 8px; padding-top: 8px;
        border-top: 1px solid #e5e7eb;
      }
      .${NS}-bundle-comp {
        display: flex; align-items: center; gap: 8px;
        font-size: 12px; cursor: pointer;
      }
      .${NS}-bundle-comp input { cursor: pointer; margin: 0; }
      .${NS}-bundle-gift {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 8px; padding: 8px 10px;
      }
      .${NS}-bundle-gift-label {
        font-weight: 600; font-size: 12px;
      }
      .${NS}-bundle-btn {
        width: 100%; padding: 16px;
        border: none; cursor: pointer;
        font-weight: 700; text-align: center;
        transition: transform 0.15s ease;
        margin-top: 4px;
      }
      .${NS}-bundle-btn:hover { opacity: 0.94; }
      .${NS}-bundle-btn.zoom:hover { transform: scale(1.02); }
      .${NS}-bundle-btn.pulse { animation: ${NS}-bundle-pulse 1.6s ease infinite; }
      .${NS}-bundle-info-note {
        display: flex; align-items: flex-start; gap: 6px;
        font-size: 12px; color: #6b7280;
        padding: 8px 0; margin-top: 4px;
        border-top: 1px solid #e5e7eb;
      }

      /* ═══ CAJA DE OPINIONES (v2 - horizontal tipo testimonio) ═══ */
      .${NS}-opiniones-list {
        display: flex; flex-direction: column;
        gap: 10px; width: 100%;
      }
      .${NS}-opiniones-card {
        width: 100%; box-sizing: border-box;
      }
      .${NS}-opiniones-top {
        display: flex; align-items: center;
        gap: 12px;
      }
      .${NS}-opiniones-avatar {
        border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; user-select: none;
        overflow: hidden;
      }
      .${NS}-opiniones-avatar img {
        width: 100%; height: 100%; object-fit: cover; display: block;
      }
      .${NS}-opiniones-name-stars {
        display: flex; align-items: center;
        gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0;
      }
      .${NS}-opiniones-name {
        font-weight: 700; line-height: 1.2;
      }
      .${NS}-opiniones-stars {
        display: inline-flex; gap: 1px; align-items: center;
      }
      .${NS}-opiniones-star {
        line-height: 1;
      }
      .${NS}-opiniones-text {
        line-height: 1.5; white-space: pre-wrap; word-break: break-word;
        margin-top: 10px;
      }

      /* ═══ INFORMACIÓN DE DESPACHO ═══ */
      .${NS}-despacho-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-despacho-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .${NS}-despacho-icon {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
      }
      .${NS}-despacho-text-wrap {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        flex: 1;
      }
      .${NS}-despacho-text {
        line-height: 1.25;
      }
      .${NS}-despacho-day-badge {
        display: inline-block;
        align-self: flex-start;
        padding: 3px 10px;
        border-radius: 6px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      .${NS}-despacho-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 8px;
        flex-shrink: 0;
        min-width: 78px;
        line-height: 1.15;
      }
      .${NS}-despacho-right-label {
        opacity: 0.9;
        font-weight: 500;
      }
      .${NS}-despacho-right-value {
        font-weight: 800;
      }

      /* ═══ INFORMACIÓN DE ENVÍO ═══ */
      .${NS}-envio-wrap {
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-envio-box {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-envio-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        flex: 1;
        min-width: 0;
        text-align: center;
      }
      .${NS}-envio-col-icon {
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .${NS}-envio-col-label {
        font-weight: 700;
        line-height: 1.2;
      }
      .${NS}-envio-col-value {
        opacity: 0.85;
        line-height: 1.2;
      }
      .${NS}-envio-badge-antes {
        display: inline-block;
        margin-top: 4px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        letter-spacing: 0.03em;
        line-height: 1.2;
        white-space: nowrap;
      }
      .${NS}-envio-sep {
        width: 22px;
        height: 2px;
        opacity: 0.6;
        border-radius: 2px;
        flex-shrink: 0;
        align-self: center;
      }
      .${NS}-envio-nota {
        margin-top: 8px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        font-style: italic;
      }

      /* ═══ MENSAJE DE ALERTA ═══ */
      .${NS}-alerta-box {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-alerta-icono {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 1;
      }
      .${NS}-alerta-icono img {
        width: 28px;
        height: 28px;
        object-fit: contain;
        display: block;
      }
      .${NS}-alerta-texto {
        flex: 1;
        min-width: 0;
        word-break: break-word;
        line-height: 1.4;
      }

      /* ═══ MENSAJE DE GARANTÍA ═══ */
      .${NS}-garantia-box {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-garantia-img-wrap {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
      }
      .${NS}-garantia-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-garantia-content {
        flex: 1;
        min-width: 0;
      }
      .${NS}-garantia-titulo {
        font-weight: 700;
        line-height: 1.3;
        word-break: break-word;
      }
      .${NS}-garantia-texto {
        line-height: 1.5;
        word-break: break-word;
        margin-top: 6px;
      }
      .${NS}-garantia-texto ul {
        margin: 6px 0;
        padding-left: 20px;
      }
      .${NS}-garantia-texto li {
        margin: 2px 0;
      }

      /* ═══ RESEÑAS DE CLIENTES ═══ */
      .${NS}-resenas-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 0;
      }
      .${NS}-resenas-titulo {
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 4px 0;
      }
      .${NS}-resenas-subtitulo {
        display: inline-block;
        line-height: 1.3;
        margin-bottom: 14px;
      }
      .${NS}-resenas-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 18px;
        flex-wrap: wrap;
      }
      .${NS}-resenas-header-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .${NS}-resenas-promedio {
        font-size: 34px;
        font-weight: 700;
        line-height: 1;
      }
      .${NS}-resenas-header-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .${NS}-resenas-header-stars {
        display: inline-flex;
        gap: 2px;
        line-height: 1;
      }
      .${NS}-resenas-total {
        font-size: 13px;
        color: #999;
      }
      .${NS}-resenas-btn {
        border: none;
        cursor: pointer;
        padding: 12px 22px;
        font-size: 14px;
        font-weight: 600;
        transition: opacity 0.15s ease;
        white-space: nowrap;
      }
      .${NS}-resenas-btn:hover {
        opacity: 0.88;
      }
      .${NS}-resenas-grid {
        display: grid;
        gap: 14px;
      }
      .${NS}-resenas-grid.cuadricula {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
      .${NS}-resenas-grid.lista {
        grid-template-columns: 1fr;
      }
      .${NS}-resenas-card {
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .${NS}-resenas-card-foto {
        width: 100%;
        aspect-ratio: 4/3;
        border-radius: 8px;
        overflow: hidden;
        background: #eee;
      }
      .${NS}-resenas-card-foto img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-resenas-card-header {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .${NS}-resenas-card-nombre {
        line-height: 1.2;
      }
      .${NS}-resenas-verified {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #1d9bf0;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .${NS}-resenas-card-stars {
        display: inline-flex;
        gap: 1px;
        line-height: 1;
      }
      .${NS}-resenas-card-texto {
        margin: 0;
        line-height: 1.5;
        word-break: break-word;
      }
      .${NS}-resenas-card-fecha {
        margin-top: 4px;
        line-height: 1.2;
      }
      .${NS}-resenas-card-talle {
        display: inline-block;
        margin-top: 4px;
        padding: 2px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        color: #555;
        font-size: 11px;
        font-weight: 600;
      }
      .${NS}-resenas-paginacion {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-top: 20px;
      }
      .${NS}-resenas-pag-btn {
        min-width: 34px;
        height: 34px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background: #fff;
        color: #374151;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .${NS}-resenas-pag-btn:hover {
        background: #f9fafb;
      }
      .${NS}-resenas-pag-btn.active {
        background: #1a1a1a;
        color: #fff;
        border-color: #1a1a1a;
      }
      .${NS}-resenas-empty {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
        font-size: 14px;
      }
      .${NS}-resenas-titulo-mini {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 6px 0 10px 0;
        font-size: 14px;
      }
      .${NS}-resenas-titulo-mini-stars {
        display: inline-flex;
        gap: 1px;
      }
      .${NS}-resenas-titulo-mini-texto {
        color: #6b7280;
        font-weight: 500;
      }

      /* ═══ MODAL PÚBLICO DE RESEÑAS ═══ */
      .${NS}-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }
      .${NS}-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .${NS}-modal {
        background: #ffffff;
        border-radius: 16px;
        max-width: 480px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        transform: translateY(20px);
        transition: transform 0.2s ease;
      }
      .${NS}-modal-overlay.open .${NS}-modal {
        transform: translateY(0);
      }
      .${NS}-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }
      .${NS}-modal-title {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }
      .${NS}-modal-close {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 24px;
        color: #6b7280;
        line-height: 1;
        padding: 4px;
        margin: -4px;
      }
      .${NS}-modal-close:hover {
        color: #111827;
      }
      .${NS}-modal-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .${NS}-modal-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .${NS}-modal-label {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
      }
      .${NS}-modal-input,
      .${NS}-modal-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        color: #111827;
        background: #fff;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;
      }
      .${NS}-modal-input:focus,
      .${NS}-modal-textarea:focus {
        border-color: #2563eb;
      }
      .${NS}-modal-textarea {
        resize: vertical;
        min-height: 90px;
        line-height: 1.4;
      }
      .${NS}-modal-stars {
        display: inline-flex;
        gap: 4px;
      }
      .${NS}-modal-star {
        cursor: pointer;
        font-size: 30px;
        color: #e5e7eb;
        line-height: 1;
        transition: color 0.1s ease, transform 0.1s ease;
        user-select: none;
      }
      .${NS}-modal-star:hover {
        transform: scale(1.1);
      }
      .${NS}-modal-star.filled {
        color: #f5b300;
      }
      .${NS}-modal-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .${NS}-modal-radio-option {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #374151;
        cursor: pointer;
        background: #fff;
        transition: all 0.15s ease;
        user-select: none;
      }
      .${NS}-modal-radio-option.selected {
        background: #2563eb;
        color: #fff;
        border-color: #2563eb;
      }
      .${NS}-modal-photo-upload {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .${NS}-modal-photo-preview {
        max-width: 100%;
        max-height: 180px;
        border-radius: 8px;
        display: block;
      }
      .${NS}-modal-photo-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border: 1.5px dashed #d1d5db;
        border-radius: 8px;
        background: #f9fafb;
        color: #374151;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        align-self: flex-start;
      }
      .${NS}-modal-photo-remove {
        color: #dc2626;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 4px 0;
        text-align: left;
      }
      .${NS}-modal-submit {
        width: 100%;
        padding: 14px;
        background: #1a1a1a;
        color: #fff;
        border: none;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 4px;
        transition: opacity 0.15s ease;
      }
      .${NS}-modal-submit:hover {
        opacity: 0.9;
      }
      .${NS}-modal-submit:disabled {
        opacity: 0.6;
        cursor: wait;
      }
      .${NS}-modal-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
      }
      .${NS}-modal-success {
        text-align: center;
        padding: 20px 10px;
      }
      .${NS}-modal-success-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #d1fae5;
        color: #059669;
        font-size: 32px;
        margin-bottom: 14px;
      }
      .${NS}-modal-success-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }
      .${NS}-modal-success-text {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
        margin-bottom: 14px;
      }
      .${NS}-modal-cupon-box {
        background: #eff6ff;
        border: 1px dashed #93c5fd;
        border-radius: 10px;
        padding: 14px;
        margin-top: 12px;
      }
      .${NS}-modal-cupon-label {
        font-size: 12px;
        color: #1e40af;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .${NS}-modal-cupon-code {
        display: inline-block;
        background: #1e40af;
        color: #fff;
        padding: 6px 14px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      /* ═══ SLIDER DE VIDEO (Widget 15) ═══ */
      .${NS}-sv-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 0;
      }
      .${NS}-sv-titulo {
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 4px 0;
      }
      .${NS}-sv-subtitulo {
        line-height: 1.4;
        opacity: 0.85;
        margin-bottom: 14px;
      }
      .${NS}-sv-carousel {
        position: relative;
        width: 100%;
      }
      .${NS}-sv-track {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding-bottom: 6px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .${NS}-sv-track::-webkit-scrollbar {
        display: none;
      }
      .${NS}-sv-video-card {
        flex: 0 0 auto;
        width: 180px;
        display: flex;
        flex-direction: column;
      }
      .${NS}-sv-video-thumb {
        position: relative;
        width: 100%;
        aspect-ratio: 9 / 16;
        overflow: hidden;
        background: #111827;
        cursor: pointer;
      }
      .${NS}-sv-video-thumb video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-sv-video-thumb.inline {
        cursor: default;
      }
      .${NS}-sv-play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.18);
        pointer-events: none;
        transition: background 0.2s ease;
      }
      .${NS}-sv-video-thumb:hover .${NS}-sv-play-overlay {
        background: rgba(0, 0, 0, 0.32);
      }
      .${NS}-sv-play-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.94);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }
      .${NS}-sv-arrow {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #ffffff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 2;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .${NS}-sv-arrow:hover {
        transform: translateY(-50%) scale(1.08);
      }
      .${NS}-sv-arrow.left {
        left: -8px;
      }
      .${NS}-sv-arrow.right {
        right: -8px;
      }
      .${NS}-sv-arrow:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .${NS}-sv-circles-row {
        display: flex;
        gap: 14px;
        overflow-x: auto;
        padding: 8px 4px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .${NS}-sv-circles-row::-webkit-scrollbar {
        display: none;
      }
      .${NS}-sv-circle {
        flex: 0 0 auto;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .${NS}-sv-circle-ring {
        padding: 3px;
        border-radius: 50%;
      }
      .${NS}-sv-circle-inner {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        overflow: hidden;
        background: #111827;
        border: 3px solid #ffffff;
        position: relative;
      }
      .${NS}-sv-circle-inner video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-sv-circle-play {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.15);
      }
      .${NS}-sv-producto-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #ffffff;
        border: 1px solid #eeeeee;
        margin-top: 10px;
        border-radius: 10px;
      }
      .${NS}-sv-producto-img {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
        background: #f3f4f6;
      }
      .${NS}-sv-producto-info {
        flex: 1;
        min-width: 0;
      }
      .${NS}-sv-producto-nombre {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }
      .${NS}-sv-producto-precio {
        font-size: 13px;
        color: #6b7280;
        margin-top: 2px;
        line-height: 1.2;
      }
      .${NS}-sv-producto-btn {
        border: none;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        flex-shrink: 0;
        transition: opacity 0.15s ease;
      }
      .${NS}-sv-producto-btn:hover {
        opacity: 0.88;
      }
      .${NS}-sv-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.92);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .${NS}-sv-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .${NS}-sv-modal {
        position: relative;
        max-width: 420px;
        width: 100%;
        max-height: calc(100vh - 40px);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .${NS}-sv-modal-video-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 9 / 16;
        max-height: calc(100vh - 140px);
        background: #000000;
        border-radius: 14px;
        overflow: hidden;
      }
      .${NS}-sv-modal-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000000;
      }
      .${NS}-sv-modal-close {
        position: absolute;
        top: -46px;
        right: 0;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease;
      }
      .${NS}-sv-modal-close:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      .${NS}-sv-modal-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        transition: background 0.15s ease;
      }
      .${NS}-sv-modal-nav:hover {
        background: rgba(255, 255, 255, 0.28);
      }
      .${NS}-sv-modal-nav:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .${NS}-sv-modal-nav.prev {
        left: -54px;
      }
      .${NS}-sv-modal-nav.next {
        right: -54px;
      }
      .${NS}-sv-modal-cta {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        background: #ffffff;
        border-radius: 12px;
        margin-top: 14px;
        width: 100%;
        box-sizing: border-box;
      }
      @media (max-width: 540px) {
        .${NS}-sv-modal-nav.prev {
          left: 6px;
        }
        .${NS}-sv-modal-nav.next {
          right: 6px;
        }
        .${NS}-sv-modal-close {
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.5);
        }
      }

      @keyframes ${NS}-bundle-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes ${NS}-banner-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes ${NS}-bounce {
        0%   { transform: scale(1) translateY(0); }
        40%  { transform: scale(1.15) translateY(-2px); }
        70%  { transform: scale(0.95) translateY(1px); }
        100% { transform: scale(1) translateY(0); }
      }
      @keyframes ${NS}-retroflip {
        0% { transform: scaleY(1); opacity: 1; }
        40%,60% { transform: scaleY(0); opacity: 0.5; }
        100% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes ${NS}-blink {
        0%,100% { opacity: 0.85; }
        50%     { opacity: 0.15; }
      }
      @keyframes ${NS}-heartbeat {
        0%,100% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(1); }
      }
      @keyframes ${NS}-bounceDigit {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      @keyframes ${NS}-aureolaPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
        50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
      }
      @keyframes ${NS}-zoomEffect {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes ${NS}-bounceBadge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      @media (min-width: 720px) {
        .${NS}-bar { flex-direction: row; gap: 20px; }
        .${NS}-bar-title { font-size: 14px; }
      }
    `;
    document.head.appendChild(style);
        }
  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  const storeId = detectStoreId();
  const productId = detectProductId();
  const pageType = detectPageType();

  console.log("[Nevux] storeId:", storeId, "productId:", productId, "pageType:", pageType);

  if (!storeId) {
    console.warn("[Nevux] No se pudo detectar store_id");
    return;
  }

  injectGlobalStyles();

  const url = API_BASE + "/api/widget-render?store_id=" + storeId +
    (productId ? "&product_id=" + productId : "");

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.widgets || data.widgets.length === 0) {
        console.log("[Nevux] No hay widgets activos");
        return;
      }
      console.log("[Nevux] Widgets recibidos:", data.widgets.length);
      data.widgets.forEach(function (w) {
        try {
          if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
          if (w.widget_slug === "badge-cuotas") renderBadgeCuotas(w);
          if (w.widget_slug === "badge-envio") renderBadgeEnvio(w);
          if (w.widget_slug === "badge-transferencia") renderBadgeTransferencia(w);
          if (w.widget_slug === "banner-deslizante") renderBannerDeslizante(w);
          if (w.widget_slug === "barra-progreso") renderBarraProgreso(w);
          if (w.widget_slug === "bundle-promociones") renderBundlePromociones(w);
          if (w.widget_slug === "bundle-cantidad") renderBundleCantidad(w);
          if (w.widget_slug === "caja-opiniones") renderCajaOpiniones(w);
          if (w.widget_slug === "info-despacho") renderInformacionDespacho(w);
          if (w.widget_slug === "info-envio") renderInformacionEnvio(w);
          if (w.widget_slug === "mensaje-alerta") renderMensajeAlerta(w);
          if (w.widget_slug === "mensaje-garantia") renderMensajeGarantia(w);
          if (w.widget_slug === "resenas-clientes") renderResenasClientes(w);
          if (w.widget_slug === "slider-video") renderSliderVideo(w);
        } catch (err) {
          console.error("[Nevux] Error renderizando widget:", w.widget_slug, err);
        }
      });
    })
    .catch(function (err) {
      console.error("[Nevux] Error cargando widgets:", err);
    });
  
      /* ═══════════════════════════════════════════
     RENDER COUNTDOWN
  ═══════════════════════════════════════════ */
  function renderCountdown(widget) {
    injectCountdownStyles();
    const cfg = normalizeConfig(widget.config || {});
    const state = { endTime: getInitialEndTime(cfg, widget.id) };

    const placements = [];
    if (cfg.showAsTopBar && pageType === "home") placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) return;

    placements.forEach(function (p) { mountAt(widget, cfg, p, state); });
  }

  function injectCountdownStyles() {
    if (document.getElementById("nvx-cd-styles")) return;
    const st = document.createElement("style");
    st.id = "nvx-cd-styles";
    st.textContent =
      "@keyframes nvx-criticalPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(220,38,38,0.55)}50%{transform:scale(1.06);box-shadow:0 0 0 8px rgba(220,38,38,0)}}" +
      "@keyframes nvx-flipDown{0%{transform:rotateX(0);opacity:1}50%{transform:rotateX(-90deg);opacity:0.4}100%{transform:rotateX(0);opacity:1}}" +
      "@keyframes nvx-bounceDigit{0%{transform:scale(0.85)}50%{transform:scale(1.1)}100%{transform:scale(1)}}" +
      "." + NS + "-digit.bounce{animation:nvx-bounceDigit 0.4s ease}" +
      "." + NS + "-retro-cell.flip{animation:nvx-flipDown 0.5s ease}" +
      "." + NS + "-critical{animation:nvx-criticalPulse 1s ease-in-out infinite}" +
      "." + NS + "-topbar{position:relative;width:100%;left:0;right:0;z-index:9999}" +
      "." + NS + "-topbar ." + NS + "-widget-host{border-radius:0 !important;width:100%;max-width:100%;box-sizing:border-box}";
    document.head.appendChild(st);
  }

  function getInitialEndTime(cfg, widgetId) {
    if (cfg.mode === "duration") {
      const key = NS + "-cd-session-" + widgetId;
      try {
        const saved = sessionStorage.getItem(key);
        if (saved) {
          const t = parseInt(saved, 10);
          if (t > Date.now()) return t;
        }
        const newEnd = Date.now() + cfg.durationMinutes * 60 * 1000;
        sessionStorage.setItem(key, String(newEnd));
        return newEnd;
      } catch (e) {
        return Date.now() + cfg.durationMinutes * 60 * 1000;
      }
    }
    if (cfg.endDate) {
      const t = new Date(cfg.endDate).getTime();
      if (t > Date.now()) return t;
      if (cfg.autoRestart) return Date.now() + (cfg.durationMinutes || 15) * 60 * 1000;
      return t;
    }
    return Date.now() + (cfg.durationMinutes || 15) * 60 * 1000;
  }

  function mountAt(widget, cfg, placement, state) {
    const uniqueId = NS + "-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";
    container.dataset.placement = placement;

    if (placement === "topbar") {
      container.classList.add(NS + "-topbar");
      document.body.insertBefore(container, document.body.firstChild);
      requestAnimationFrame(function () {
        const h = container.offsetHeight;
        if (h > 0) {
          const prev = parseInt(document.body.style.paddingTop || "0", 10);
          document.body.style.paddingTop = (prev + h) + "px";
        }
      });
    } else if (placement === "product") {
      const target = findProductTarget(cfg.productPosition);
      if (!target) return;
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "cart") {
      const target = findCartTarget();
      if (!target) return;
      target.parentNode.insertBefore(container, target);
    }

    update(container, cfg, state, widget.id);

    setInterval(function () {
      const now = Date.now();
      if (state.endTime <= now && cfg.autoRestart) {
        state.endTime = now + (cfg.durationMinutes || 15) * 60 * 1000;
        if (cfg.mode === "duration") {
          try { sessionStorage.setItem(NS + "-cd-session-" + widget.id, String(state.endTime)); } catch (e) {}
        }
      }
      update(container, cfg, state, widget.id);
    }, 1000);
  }

  function findProductTarget(position) {
    if (position === "before-title") {
      const sel = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
      for (let i = 0; i < sel.length; i++) {
        const el = qs(sel[i]);
        if (el) return { node: el };
      }
    }
    const btnSel = [
      'button[data-store="product-buy-button"]',
      'button[name="add-to-cart"]',
      'button[name="add"]',
      '.js-add-to-cart',
      '.js-addtocart-btn',
      '.js-btn-comprar',
      'button.btn-add-to-cart',
      'button.add-to-cart',
      'button[data-testid="add-to-cart"]',
      'button[data-testid*="buy"]',
      'button[type="submit"][data-store*="buy"]',
      'form[data-store*="add-to-cart"]',
      'form.js-product-form',
      'form[action*="carrito"]',
      'form[action*="cart"]',
      'form[action*="add"]',
      '[data-component="AddToCartButton"]',
      '[data-hook="add-to-cart"]',
    ];
    for (let i = 0; i < btnSel.length; i++) {
      const el = qs(btnSel[i]);
      if (el) return { node: el.closest("form") || el };
    }
    const btns = qsa("button");
    for (let i = 0; i < btns.length; i++) {
      const t = (btns[i].textContent || "").toLowerCase();
      if (t.indexOf("agregar al carrito") >= 0 || t.indexOf("añadir al carrito") >= 0 || t.indexOf("comprar ahora") >= 0) {
        return { node: btns[i].closest("form") || btns[i] };
      }
    }
    return null;
  }

  function findProductPriceTarget() {
    const sel = [
      '[data-store="product-price"]',
      '.js-price-display',
      '.price-display',
      'span[itemprop="price"]',
      '.product-price',
      '.js-product-price',
    ];
    for (let i = 0; i < sel.length; i++) {
      const el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function findProductDescriptionTarget() {
    const sel = [
      '[data-store="product-description"]',
      '.js-product-description',
      '.product-description',
      '#product-description',
      '.description',
    ];
    for (let i = 0; i < sel.length; i++) {
      const el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') ||
      qs('.cart-content') || qs('.cart-items') || qs('main') || qs('.container');
  }

  function findCartCheckoutButton() {
    var sel = [
      'button[data-store="cart-checkout-button"]',
      'a[data-store="cart-checkout-button"]',
      '.js-cart-checkout',
      '.js-checkout',
      'a[href*="/checkout"]',
      'button[name="checkout"]',
    ];
    for (var i = 0; i < sel.length; i++) {
      var el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function normalizeConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    function pick() {
      for (var i = 0; i < arguments.length - 1; i++) {
        if (arguments[i] !== undefined && arguments[i] !== null && arguments[i] !== "") return arguments[i];
      }
      return arguments[arguments.length - 1];
    }
    const mode = pick(raw.mode, "fixed");
    return {
      title: pick(raw.title, "🔥 Oferta"),
      subtitle: pick(raw.subtitle, ""),
      mode: mode === "duration" ? "duration" : "fixed",
      endDate: pick(raw.endDate, raw.end_datetime, ""),
      durationMinutes: n(pick(raw.durationMinutes, raw.hours, 15), 15),
      autoRestart: pick(raw.autoRestart, raw.auto_restart, false) === true,
      showDays: pick(raw.showDays, raw.show_days, false) === true,
      showHours: pick(raw.showHours, raw.show_hours, true) !== false,
      showMinutes: pick(raw.showMinutes, raw.show_minutes, true) !== false,
      showSeconds: pick(raw.showSeconds, raw.show_seconds, true) !== false,
      showOnProduct: pick(raw.showOnProduct, true) !== false,
      productPosition: pick(raw.productPosition, "before-button"),
      showAsTopBar: pick(raw.showAsTopBar, false) === true,
      showOnCart: pick(raw.showOnCart, false) === true,
      style: pick(raw.style, raw.clock_style, "clasico") === "retro" ? "retro" : "clasico",
      alignment: pick(raw.alignment, raw.content_alignment, "center") === "left" ? "left" : "center",
      showLabels: pick(raw.showLabels, raw.show_clock_labels, true) !== false,
      bgType: pick(raw.bgType, raw.background_type, "solid") === "gradient" ? "gradient" : "solid",
      colorWidgetBg: pick(raw.colorWidgetBg, raw.background_color, "#000000"),
      colorWidgetBg2: pick(raw.colorWidgetBg2, "#FF0000"),
      gradientDirection: pick(raw.gradientDirection, "to bottom right"),
      colorSubtitleBg: pick(raw.colorSubtitleBg, raw.subtitle_bg_color, "#FF0000"),
      colorClockBg: pick(raw.colorClockBg, raw.clock_bg_color, "#FF0000"),
      colorTitle: pick(raw.colorTitle, raw.title_font_color, "#ffffff"),
      colorSubtitle: pick(raw.colorSubtitle, raw.subtitle_font_color, "#ffffff"),
      colorNumbers: pick(raw.colorNumbers, raw.number_font_color, "#ffffff"),
      fontSizeTitle: pick(raw.fontSizeTitle, raw.title_font_size, "16px"),
      fontSizeSubtitle: pick(raw.fontSizeSubtitle, raw.subtitle_font_size, "11px"),
      fontSizeClock: pick(raw.fontSizeClock, raw.clock_font_size, "16px"),
      borderRadiusClock: n(pick(raw.borderRadiusClock, raw.clock_border_radius, 5), 5),
      borderRadiusWidget: n(pick(raw.borderRadiusWidget, raw.widget_border_radius, 12), 12),
      paddingWidget: n(pick(raw.paddingWidget, raw.widget_padding, 15), 15),
      paddingClock: n(pick(raw.paddingClock, raw.clock_padding, 7), 7),
      urgencyEnabled: pick(raw.urgencyEnabled, false) === true,
      colorClockBgMedium: pick(raw.colorClockBgMedium, "#f97316"),
      colorClockBgCritical: pick(raw.colorClockBgCritical, "#dc2626"),
    };
  }

  function calcTime(state) {
    const ms = state.endTime - Date.now();
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isFinished: true };
    }
    const t = Math.floor(ms / 1000);
    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isFinished: false,
    };
  }

  function getUrgencyState(cfg, time, widgetId) {
    if (!cfg.urgencyEnabled) return "normal";
    let totalDuration;
    if (cfg.mode === "duration") {
      totalDuration = cfg.durationMinutes * 60;
    } else if (cfg.endDate) {
      const endT = new Date(cfg.endDate).getTime();
      const key = NS + "-cd-start-" + widgetId;
      let startT;
      try {
        const saved = sessionStorage.getItem(key);
        if (saved) {
          startT = parseInt(saved, 10);
        } else {
          startT = Date.now();
          sessionStorage.setItem(key, String(startT));
        }
      } catch (e) {
        startT = Date.now();
      }
      totalDuration = Math.max(1, Math.floor((endT - startT) / 1000));
    } else {
      totalDuration = (cfg.durationMinutes || 15) * 60;
    }
    const remainingRatio = time.totalSeconds / totalDuration;
    if (remainingRatio <= 0.33) return "critical";
    if (remainingRatio <= 0.66) return "medium";
    return "normal";
  }

  function getClockBg(cfg, urgencyState) {
    if (urgencyState === "critical") return cfg.colorClockBgCritical;
    if (urgencyState === "medium") return cfg.colorClockBgMedium;
    return cfg.colorClockBg;
  }

  function update(container, cfg, state, widgetId) {
    const time = calcTime(state);
    const urgency = getUrgencyState(cfg, time, widgetId);
    const isBar = container.dataset.placement === "topbar";

    if (time.isFinished && !cfg.autoRestart) {
      const finishedRadius = isBar ? 0 : cfg.borderRadiusWidget;
      container.innerHTML =
        '<div style="background:' + getBg(cfg) + ';border-radius:' + finishedRadius + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';color:' + cfg.colorTitle + ';font-weight:700;">' +
        '⏰ ¡La oferta terminó!</div>';
      return;
    }

    const units = buildUnits(cfg, time);

    if (units.length === 0) {
      container.innerHTML = "";
      return;
    }

    const keys = units.map(function (u) { return u.k; }).join(",");
    let host = qs("." + NS + "-widget-host", container);

    const needsRebuild =
      !host ||
      host.dataset.style !== cfg.style ||
      host.dataset.keys !== keys ||
      host.dataset.bar !== String(isBar) ||
      host.dataset.urgency !== urgency;

    if (needsRebuild) {
      container.innerHTML = buildFullHtml(cfg, units, time, urgency, isBar);
    } else {
      units.forEach(function (u) { updateUnit(host, u, cfg); });
    }
  }

  function buildUnits(cfg, time) {
    const arr = [];
    const showDaysActive = cfg.showDays && time.days > 0;
    if (showDaysActive) arr.push({ v: time.days, l: "DÍAS", k: "d" });
    if (cfg.showHours) {
      const hoursValue = showDaysActive ? time.hours : time.hours + time.days * 24;
      arr.push({ v: hoursValue, l: "HRS", k: "h" });
    }
    if (cfg.showMinutes) arr.push({ v: time.minutes, l: "MIN", k: "m" });
    if (cfg.showSeconds) arr.push({ v: time.seconds, l: "SEG", k: "s" });
    return arr;
  }

  function buildFullHtml(cfg, units, time, urgency, isBar) {
    const bg = getBg(cfg);
    const titleHtml = cfg.title
      ? '<div style="font-size:' + cfg.fontSizeTitle + ';font-weight:700;color:' + cfg.colorTitle + ';margin-bottom:14px;line-height:1.2;text-align:' + cfg.alignment + ';">' + escapeHtml(cfg.title) + '</div>'
      : "";

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      clockInner += renderUnit(units[i], cfg, urgency);
      if (i < units.length - 1) clockInner += renderSep(cfg);
    }

    const subtitleHtml = cfg.subtitle
      ? '<div style="margin-bottom:14px;text-align:' + cfg.alignment + ';">' +
          '<span style="display:inline-block;background:' + cfg.colorSubtitleBg + ';color:' + cfg.colorSubtitle + ';font-size:' + cfg.fontSizeSubtitle + ';font-weight:700;padding:4px 10px;border-radius:6px;">' +
            escapeHtml(cfg.subtitle) +
          '</span>' +
        '</div>'
      : "";

    const radius = isBar ? 0 : cfg.borderRadiusWidget;
    const padding = isBar ? Math.max(10, Math.min(cfg.paddingWidget, 20)) : cfg.paddingWidget;
    const innerWrap = isBar
      ? '<div style="max-width:1200px;margin:0 auto;">'
      : '';
    const innerWrapClose = isBar ? '</div>' : '';

    return '' +
      '<div class="' + NS + '-widget-host" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="' + String(isBar) + '" data-urgency="' + urgency + '" style="background:' + bg + ';border-radius:' + radius + 'px;padding:' + padding + 'px;text-align:' + cfg.alignment + ';">' +
        innerWrap +
          titleHtml +
          subtitleHtml +
          '<div style="display:flex;align-items:center;justify-content:' + (cfg.alignment === "center" ? "center" : "flex-start") + ';gap:8px;flex-wrap:wrap;">' + clockInner + '</div>' +
        innerWrapClose +
      '</div>';
  }

  function renderUnit(u, cfg, urgency) {
    const val = String(u.v).padStart(2, "0");
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const labelSize = Math.max(9, Math.round(size * 0.55));
    const clockBg = getClockBg(cfg, urgency);
    const criticalClass = urgency === "critical" ? " " + NS + "-critical" : "";
    const labelHtml = cfg.showLabels
      ? '<span class="' + NS + '-label" style="font-size:' + labelSize + 'px;color:' + cfg.colorTitle + ';opacity:0.8;">' + u.l + '</span>'
      : "";

    if (cfg.style === "retro") {
      const chars = val.split("");
      let cells = "";
      for (let i = 0; i < chars.length; i++) {
        cells += '<span class="' + NS + '-retro-cell" style="display:inline-block;min-width:' + (size * 1.2) + 'px;padding:' + cfg.paddingClock + 'px;background:' + clockBg + ';font-size:' + cfg.fontSizeClock + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;margin:0 1px;text-align:center;font-weight:700;">' + chars[i] + '</span>';
      }
      return '<div class="' + NS + '-unit' + criticalClass + '" data-key="' + u.k + '" style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><div class="' + NS + '-retro-digit" data-value="' + val + '" style="display:inline-flex;">' + cells + '</div>' + labelHtml + '</div>';
    }

    return '<div class="' + NS + '-unit' + criticalClass + '" data-key="' + u.k + '" style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;">' +
      '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:' + (size * 2.5) + 'px;min-height:' + (size * 2.5) + 'px;display:inline-flex;align-items:center;justify-content:center;background:' + clockBg + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px ' + (cfg.paddingClock + 2) + 'px;font-size:' + cfg.fontSizeClock + ';line-height:1;font-weight:700;">' + val + '</div>' + labelHtml +
    '</div>';
  }

  function renderSep(cfg) {
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const dotSize = Math.max(3, Math.round(size * 0.18));
    const padBottom = cfg.showLabels ? Math.round(size * 0.85) : 0;
    const dot = '<span style="display:inline-block;border-radius:50%;width:' + dotSize + 'px;height:' + dotSize + 'px;background:' + cfg.colorTitle + ';"></span>';
    return '<div class="' + NS + '-sep" style="display:inline-flex;flex-direction:column;justify-content:center;padding-bottom:' + padBottom + 'px;gap:' + dotSize + 'px;">' + dot + dot + '</div>';
  }

  function updateUnit(host, u, cfg) {
    const unitEl = qs("." + NS + "-unit[data-key=\"" + u.k + "\"]", host);
    if (!unitEl) return;
    const val = String(u.v).padStart(2, "0");

    if (cfg.style === "retro") {
      const wrap = qs("." + NS + "-retro-digit", unitEl);
      if (!wrap || wrap.dataset.value === val) return;
      wrap.dataset.value = val;
      const cells = qsa("." + NS + "-retro-cell", wrap);
      const chars = val.split("");
      for (let i = 0; i < chars.length; i++) {
        if (cells[i] && cells[i].textContent !== chars[i]) {
          cells[i].textContent = chars[i];
          cells[i].classList.remove("flip");
          void cells[i].offsetWidth;
          cells[i].classList.add("flip");
        }
      }
      return;
    }

    const digit = qs("." + NS + "-digit", unitEl);
    if (!digit || digit.dataset.value === val) return;
    digit.dataset.value = val;
    digit.textContent = val;
    digit.classList.remove("bounce");
    void digit.offsetWidth;
    digit.classList.add("bounce");
  }

  function getBg(cfg) {
    if (cfg.bgType === "gradient") {
      const dir = cfg.gradientDirection || "to bottom right";
      return "linear-gradient(" + dir + ", " + cfg.colorWidgetBg + " 0%, " + cfg.colorWidgetBg2 + " 100%)";
    }
    return cfg.colorWidgetBg;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
      }

  /* ═══════════════════════════════════════════
     RENDER BADGE CUOTAS
  ═══════════════════════════════════════════ */
  function renderBadgeCuotas(widget) {
    const cfg = normalizeBadgeCuotasConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeCuotas(widget, cfg, "product");
    } 
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeCuotas(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeCuotasConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      cuotasSeleccionadas: Array.isArray(raw.cuotasSeleccionadas) ? raw.cuotasSeleccionadas : [3, 6, 12],
      mensaje: raw.mensaje || "{cuotas} cuotas sin interés de {monto}",
      mostrarIconoTarjeta: raw.mostrarIconoTarjeta === true,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#000000",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeCuotas(widget, cfg, placement) {
    var uniqueId = NS + "-badge-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge cuotas en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeCuotasHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeCuotasHtml(cfg);
    console.log("[Nevux] Badge cuotas montado en", placement);
  }

  function buildBadgeCuotasHtml(cfg) {
    var cuotasOrdenadas = (cfg.cuotasSeleccionadas || []).slice().sort(function (a, b) { return b - a; });
    var cuotaShow = cuotasOrdenadas.length > 0 ? cuotasOrdenadas[0] : 3;

    var precio = detectProductPrice();
    var montoTxt = "$****";
    if (precio && precio > 0) {
      montoTxt = formatMoney(precio / cuotaShow);
    }

    var mensaje = (cfg.mensaje || "{cuotas} cuotas sin interés de {monto}")
      .replace("{cuotas}", String(cuotaShow))
      .replace("{monto}", montoTxt);

    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIconoTarjeta
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>' + escapeHtml(mensaje) + '</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BADGE ENVÍO
  ═══════════════════════════════════════════ */
  function renderBadgeEnvio(widget) {
    const cfg = normalizeBadgeEnvioConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeEnvio(widget, cfg, "product");
    }
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeEnvio(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeEnvioConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      modoEnvio: raw.modoEnvio === "a-partir-de" ? "a-partir-de" : "siempre",
      mostrarIcono: raw.mostrarIcono !== false,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#000000",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeEnvio(widget, cfg, placement) {
    var uniqueId = NS + "-envio-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge envío en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeEnvioHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeEnvioHtml(cfg);
    console.log("[Nevux] Badge envío montado en", placement);
  }

  function buildBadgeEnvioHtml(cfg) {
    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIcono
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>Envío gratis</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BADGE TRANSFERENCIA
  ═══════════════════════════════════════════ */
  function renderBadgeTransferencia(widget) {
    const cfg = normalizeBadgeTransferenciaConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeTransferencia(widget, cfg, "product");
    }
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeTransferencia(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeTransferenciaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      porcentajeDescuento: raw.porcentajeDescuento || "",
      tipoMensaje: raw.tipoMensaje === "precio" ? "precio" : "descuento",
      mensajeDescuento: raw.mensajeDescuento || "{descuento}% de descuento pagando con transferencia",
      mensajePrecio: raw.mensajePrecio || "{precio} pagando con transferencia",
      mostrarIcono: raw.mostrarIcono === true,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#191919",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeTransferencia(widget, cfg, placement) {
    var uniqueId = NS + "-transfer-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge transferencia en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeTransferenciaHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeTransferenciaHtml(cfg);
    console.log("[Nevux] Badge transferencia montado en", placement);
  }

  function buildBadgeTransferenciaHtml(cfg) {
    var texto = "";
    var descuento = cfg.porcentajeDescuento && cfg.porcentajeDescuento.trim() !== ""
      ? cfg.porcentajeDescuento.trim()
      : "X";

    if (cfg.tipoMensaje === "precio") {
      var precio = detectProductPrice();
      var precioTxt = "$X.XXX";
      var descNum = parseFloat(descuento);
      if (precio && precio > 0 && !isNaN(descNum) && descNum > 0) {
        var precioFinal = precio * (1 - descNum / 100);
        precioTxt = formatMoney(precioFinal);
      }
      texto = (cfg.mensajePrecio || "{precio} pagando con transferencia")
        .replace("{precio}", precioTxt);
    } else {
      texto = (cfg.mensajeDescuento || "{descuento}% de descuento pagando con transferencia")
        .replace("{descuento}", descuento);
    } 

    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIcono
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>' + escapeHtml(texto) + '</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BANNER DESLIZANTE
  ═══════════════════════════════════════════ */
  function renderBannerDeslizante(widget) {
    const cfg = normalizeBannerDeslizanteConfig(widget.config || {});

    if (cfg.modoBarra) {
      mountBannerDeslizante(widget, cfg, "topbar");
    }
    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBannerDeslizante(widget, cfg, "product");
    }
  }

  function normalizeBannerDeslizanteConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      mensajes: Array.isArray(raw.mensajes) && raw.mensajes.length > 0
        ? raw.mensajes.filter(function (m) { return m && String(m).trim().length > 0; })
        : ["🎉 ¡Envío gratis en compras nuevas a $25000!"],
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      ubicacionProducto: raw.ubicacionProducto === "despues-precio" ? "despues-precio" : "despues-boton",
      modoBarra: raw.modoBarra === true,
      tipoFondo: raw.tipoFondo === "degradado" ? "degradado" : "solido",
      colorFondo: raw.colorFondo || "#333333",
      colorFondoInicio: raw.colorFondoInicio || "#333333",
      colorFondoFin: raw.colorFondoFin || "#555555",
      colorTexto: raw.colorTexto || "#ffffff",
      tamanoFuente: n(raw.tamanoFuente, 16),
      bordeRadio: n(raw.bordeRadio, 8),
      separacionMensajes: n(raw.separacionMensajes, 300),
      velocidad: n(raw.velocidad, 20),
    };
  }

  function mountBannerDeslizante(widget, cfg, placement) {
    var uniqueId = NS + "-banner-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "topbar") {
      container.style.margin = "0";
      if (document.body.firstChild) {
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        document.body.appendChild(container);
      }
    } else if (placement === "product") {
      var target = null;
      if (cfg.ubicacionProducto === "despues-precio") {
        target = findProductPriceTarget();
        if (target && target.parentNode) {
          target.parentNode.insertBefore(container, target.nextSibling);
        } else {
          console.warn("[Nevux] No se encontró target de precio para banner deslizante");
          return;
        }
      } else {
        var t = findProductTarget("before-button");
        if (!t) {
          console.warn("[Nevux] No se encontró target de botón para banner deslizante");
          return;
        }
        if (t.node.parentNode) {
          t.node.parentNode.insertBefore(container, t.node.nextSibling);
        } else {
          return;
        }
      }
    }

    container.innerHTML = buildBannerDeslizanteHtml(cfg, placement);
    console.log("[Nevux] Banner deslizante montado en", placement);
  }

  function buildBannerDeslizanteHtml(cfg, placement) {
    var isBar = placement === "topbar";
    var fondo = cfg.tipoFondo === "degradado"
      ? "linear-gradient(90deg, " + cfg.colorFondoInicio + " 0%, " + cfg.colorFondoFin + " 100%)"
      : cfg.colorFondo;

    var borderRadius = isBar ? "0" : cfg.bordeRadio + "px";
    var separacion = cfg.separacionMensajes;
    var velocidad = cfg.velocidad;

    var mensajesRender = cfg.mensajes.concat(cfg.mensajes);

    var itemsHtml = "";
    for (var i = 0; i < mensajesRender.length; i++) {
      itemsHtml += '<span class="' + NS + '-banner-item" style="padding-right:' + separacion + 'px;font-size:' + cfg.tamanoFuente + 'px;color:' + cfg.colorTexto + ';">' +
        escapeHtml(mensajesRender[i]) +
      '</span>';
    }

    return '' +
      '<div class="' + NS + '-banner-wrap" style="background:' + fondo + ';color:' + cfg.colorTexto + ';border-radius:' + borderRadius + ';padding:14px 0;font-size:' + cfg.tamanoFuente + 'px;font-weight:500;line-height:1.2;">' +
        '<div class="' + NS + '-banner-track" style="animation:' + NS + '-banner-scroll ' + velocidad + 's linear infinite;">' +
          itemsHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BARRA DE PROGRESO
  ═══════════════════════════════════════════ */
  function renderBarraProgreso(widget) {
    var cfg = normalizeBarraProgresoConfig(widget.config || {});

    if (!cfg.objetivos || cfg.objetivos.length === 0) return;

    var mountedContainers = [];

    if (pageType === "product" && cfg.posicionFicha !== "no-mostrar") {
      var containerProd = mountBarraProgreso(widget, cfg, "product");
      if (containerProd) mountedContainers.push(containerProd);
    }
    if (cfg.elementoFlotante) {
      var containerFloat = mountBarraProgreso(widget, cfg, "floating");
      if (containerFloat) mountedContainers.push(containerFloat);
    }
    if (cfg.enCarrito && pageType === "cart") {
      var containerCart = mountBarraProgreso(widget, cfg, "cart");
      if (containerCart) mountedContainers.push(containerCart);
    }

    if (mountedContainers.length === 0) return;

    function refreshAll() {
      fetchCartSubtotal(function (subtotal) {
        mountedContainers.forEach(function (c) {
          c.innerHTML = buildBarraProgresoHtml(cfg, subtotal, c._placement);
        });
      });
    }

    refreshAll();
    setInterval(refreshAll, 3000);

    var events = ["cart.update", "cart:update", "cart_updated", "cartUpdated"];
    events.forEach(function (ev) {
      try {
        document.addEventListener(ev, refreshAll);
        window.addEventListener(ev, refreshAll);
      } catch (e) {}
    });
  }

  function normalizeBarraProgresoConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    }
    var objetivos = Array.isArray(raw.objetivos) ? raw.objetivos : [];
    objetivos = objetivos
      .filter(function (o) { return o && o.nombre && o.monto > 0; })
      .map(function (o) {
        return {
          nombre: String(o.nombre),
          monto: parseFloat(o.monto) || 0,
          icono: o.icono || "none",
        };
      });
    if (objetivos.length === 0) {
      objetivos = [{ nombre: "Envío gratis", monto: 50000, icono: "none" }];
    }
    return {
      objetivos: objetivos,
      textoFaltante: raw.textoFaltante || "Te faltan {x} para {objetivo}",
      textoCumplido: raw.textoCumplido || "¡{objetivo} desbloqueado! 🎉",
      posicionFicha: raw.posicionFicha === "encima-form" ? "encima-form" :
                     raw.posicionFicha === "no-mostrar" ? "no-mostrar" : "debajo-boton",
      elementoFlotante: raw.elementoFlotante === true,
      enCarrito: raw.enCarrito === true,
      formatoObjetivos: raw.formatoObjetivos === "lista" ? "lista" : "automatico",
      bordesRedondeados: n(raw.bordesRedondeados, 8),
      rellenoInterno: n(raw.rellenoInterno, 14),
      colorBarraVacia: raw.colorBarraVacia || "#e0e0e0",
      colorBarraLlena: raw.colorBarraLlena || "#22c55e",
      colorFondo: raw.colorFondo || "#fafafa",
      colorTexto: raw.colorTexto || "#333333",
      colorMonto: raw.colorMonto || "#0d6efd",
      colorObjetivos: raw.colorObjetivos || "#333333",
      tamanoFuenteObjetivos: n(raw.tamanoFuenteObjetivos, 11),
      tamanoFuenteTexto: n(raw.tamanoFuenteTexto, 13),
    };
  }

  function mountBarraProgreso(widget, cfg, placement) {
    var uniqueId = NS + "-progreso-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return null;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";
    container._placement = placement;

    if (placement === "product") {
      var t = findProductTarget("before-button");
      if (!t) {
        console.warn("[Nevux] No se encontró target para barra progreso en producto");
        return null;
      }
      if (cfg.posicionFicha === "encima-form") {
        t.node.parentNode.insertBefore(container, t.node);
      } else {
        t.node.parentNode.insertBefore(container, t.node.nextSibling);
      }
    } else if (placement === "floating") {
      container.classList.add(NS + "-progress-floating");
      document.body.appendChild(container);
    } else if (placement === "cart") {
      var checkoutBtn = findCartCheckoutButton();
      if (checkoutBtn && checkoutBtn.parentNode) {
        checkoutBtn.parentNode.insertBefore(container, checkoutBtn);
      } else {
        var cartTarget = findCartTarget();
        if (!cartTarget) return null;
        cartTarget.parentNode.insertBefore(container, cartTarget);
      }
    }

    console.log("[Nevux] Barra progreso montada en", placement);
    return container;
  }

  function buildBarraProgresoHtml(cfg, subtotal, placement) {
    var objetivosOrd = cfg.objetivos.slice().sort(function (a, b) { return a.monto - b.monto; });
    var montoMax = objetivosOrd[objetivosOrd.length - 1].monto;

    var proximoObj = null;
    for (var i = 0; i < objetivosOrd.length; i++) {
      if (subtotal < objetivosOrd[i].monto) { proximoObj = objetivosOrd[i]; break; }
    }
    var ultimoCumplido = null;
    for (var j = objetivosOrd.length - 1; j >= 0; j--) {
      if (subtotal >= objetivosOrd[j].monto) { ultimoCumplido = objetivosOrd[j]; break; }
    }

    var faltante = proximoObj ? Math.max(0, proximoObj.monto - subtotal) : 0;
    var porcentaje = Math.min(100, Math.max(0, (subtotal / montoMax) * 100));

    var textoHtml = "";
    if (proximoObj) {
      var t = escapeHtml(cfg.textoFaltante || "Te faltan {x} para {objetivo}");
      t = t
        .replace("{x}", '<strong style="color:' + cfg.colorMonto + ';font-weight:700;">' + formatMoneyInt(faltante) + '</strong>')
        .replace("{objetivo}", '<strong style="color:' + cfg.colorObjetivos + ';font-weight:700;">' + escapeHtml(proximoObj.nombre) + '</strong>');
      textoHtml = t;
    } else if (ultimoCumplido) {
      var tc = escapeHtml(cfg.textoCumplido || "¡{objetivo} desbloqueado! 🎉");
      tc = tc.replace("{objetivo}", '<strong style="color:' + cfg.colorObjetivos + ';font-weight:700;">' + escapeHtml(ultimoCumplido.nombre) + '</strong>');
      textoHtml = tc;
    }

    var hitsHtml = "";
    for (var k = 0; k < objetivosOrd.length; k++) {
      var o = objetivosOrd[k];
      var isLast = k === objetivosOrd.length - 1;
      var posPct = isLast ? 100 : (o.monto / montoMax) * 100;
      var cumplido = subtotal >= o.monto;
      var iconInner = getIconoSvgProgreso(o.icono, 12, "#ffffff");
      hitsHtml += '<div class="' + NS + '-progress-hit" style="left:' + posPct + '%;background:' + (cumplido ? cfg.colorBarraLlena : "#c9c9c9") + ';" title="' + escapeHtml(o.nombre) + '">' + iconInner + '</div>';
    }

    var listaHtml = "";
    if (cfg.formatoObjetivos === "lista") {
      var items = "";
      for (var m = 0; m < objetivosOrd.length; m++) {
        var oo = objetivosOrd[m];
        var cc = subtotal >= oo.monto;
        items += '<div style="display:flex;align-items:center;gap:6px;font-size:' + cfg.tamanoFuenteObjetivos + 'px;color:' + cfg.colorObjetivos + ';opacity:' + (cc ? "1" : "0.6") + ';margin-top:4px;">' +
          '<span style="width:12px;height:12px;border-radius:50%;background:' + (cc ? cfg.colorBarraLlena : "#c9c9c9") + ';display:inline-block;"></span>' +
          '<span style="font-weight:' + (cc ? "700" : "500") + ';">' + escapeHtml(oo.nombre) + ' — ' + formatMoneyInt(oo.monto) + '</span>' +
        '</div>';
      }
      listaHtml = '<div style="margin-top:10px;">' + items + '</div>';
    }

    var bgStyle = cfg.colorFondo === "transparent" ? "transparent" : cfg.colorFondo;

    return '' +
      '<div style="width:100%;background:' + bgStyle + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + cfg.rellenoInterno + 'px ' + (cfg.rellenoInterno + 4) + 'px;box-sizing:border-box;">' +
        '<div style="color:' + cfg.colorTexto + ';font-size:' + cfg.tamanoFuenteTexto + 'px;line-height:1.4;margin-bottom:10px;">' + textoHtml + '</div>' +
        '<div class="' + NS + '-progress-wrap">' +
          '<div class="' + NS + '-progress-track" style="background:' + cfg.colorBarraVacia + ';">' +
            '<div class="' + NS + '-progress-fill" style="width:' + porcentaje + '%;background:' + cfg.colorBarraLlena + ';"></div>' +
            hitsHtml +
          '</div>' +
          listaHtml +
        '</div>' +
      '</div>';
  }

  function getIconoSvgProgreso(icono, size, color) {
    var attrs = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    switch (icono) {
      case "truck":
        return '<svg ' + attrs + '><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';
      case "gift":
        return '<svg ' + attrs + '><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>';
      case "tag":
        return '<svg ' + attrs + '><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';
      case "star":
        return '<svg ' + attrs + '><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      case "percent":
        return '<svg ' + attrs + '><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';
      case "check":
        return '<svg ' + attrs + '><polyline points="20 6 9 17 4 12"/></svg>';
      case "shield":
        return '<svg ' + attrs + '><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      case "bolt":
        return '<svg ' + attrs + '><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
      case "heart":
        return '<svg ' + attrs + '><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      case "coffee":
        return '<svg ' + attrs + '><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>';
      case "hexagon":
        return '<svg ' + attrs + '><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>';
      case "card":
        return '<svg ' + attrs + '><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>';
      case "smile":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">😊</span>';
      case "none":
      default:
        return "";
    }
          }
  /* ═══════════════════════════════════════════
     RENDER BUNDLE PROMOCIONES
  ═══════════════════════════════════════════ */
  function renderBundlePromociones(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeBundlePromocionesConfig(widget.config || {});
    if (!cfg.promociones || cfg.promociones.length === 0) return;
    mountBundlePromociones(widget, cfg);
  }

  function normalizeBundlePromocionesConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }

    var promos = Array.isArray(raw.promociones) ? raw.promociones : [];
    promos = promos.map(function (p) {
      return {
        tipo: String(p.tipo || "2x1"),
        formatoEtiqueta: p.formatoEtiqueta || "Lleva # paga #",
        subtitulo: p.subtitulo || "",
        badges: {
          envioGratis: !!(p.badges && p.badges.envioGratis),
          masVendido: !!(p.badges && p.badges.masVendido),
          personalizado: !!(p.badges && p.badges.personalizado),
          personalizadoTexto: (p.badges && p.badges.personalizadoTexto) || "",
        },
        ocultarComp1: p.ocultarComp1 === true,
        ocultarComp2: p.ocultarComp2 === true,
        agregarRegalo: p.agregarRegalo === true,
        marcarPorDefecto: p.marcarPorDefecto === true,
        ocultarUnidad: p.ocultarUnidad === true,
      };
    });

    var complementarios = Array.isArray(raw.complementarios) ? raw.complementarios : [];

    return {
      titulo: raw.titulo || "",
      textoBoton: raw.textoBoton || "Agregar al carrito",
      promociones: promos,
      complementarios: complementarios.slice(0, 2),
      complementariosDefault: raw.complementariosDefault === true,
      reemplazarBoton: raw.reemplazarBoton === true,
      colorBoton: raw.colorBoton || "#000000",
      botonDegradado: raw.botonDegradado === true,
      colorPrecio: raw.colorPrecio || "#000000",
      colorSubtitulo: raw.colorSubtitulo || "#059669",
      fondoSubtitulo: raw.fondoSubtitulo || "transparent",
      colorTextoRegalo: raw.colorTextoRegalo || "#000000",
      colorPrecioRegalo: raw.colorPrecioRegalo || "#16a34a",
      fondoRegalo: raw.fondoRegalo || "#f5fff7",
      colorBadgeEnvio: raw.colorBadgeEnvio || "#10B981",
      colorBadgePersonalizado: raw.colorBadgePersonalizado || "#F59E0B",
      colorBadgeMasVendido: raw.colorBadgeMasVendido || "#EF4444",
      colorUnidadSeleccionada: raw.colorUnidadSeleccionada || "#000000",
      bordeBoton: n(raw.bordeBoton, 25),
      bordeUnidad: n(raw.bordeUnidad, 8),
      tamanoEtiqueta: raw.tamanoEtiqueta || "16px",
      tamanoPrecio: raw.tamanoPrecio || "18px",
      tamanoSubtitulo: raw.tamanoSubtitulo || "14px",
      efectoBoton: raw.efectoBoton === "zoom" ? "zoom" : "sin-efecto",
      botonPulsante: raw.botonPulsante === true,
    };
  }

  function parsePromoRatio(tipo) {
    var m = String(tipo).toLowerCase().match(/(\d+)x(\d+)/);
    if (!m) return { lleva: 1, paga: 1 };
    return { lleva: parseInt(m[1], 10), paga: parseInt(m[2], 10) };
  }

  function formatEtiquetaPromo(formato, ratio) {
    var partes = String(formato).split("#");
    var out = "";
    var vals = [ratio.lleva, ratio.paga];
    var v = 0;
    for (var i = 0; i < partes.length; i++) {
      out += partes[i];
      if (i < partes.length - 1) {
        out += (v < vals.length ? vals[v] : "");
        v++;
      }
    }
    return out;
  }

  function mountBundlePromociones(widget, cfg) {
    var uniqueId = NS + "-bundle-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para bundle en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    target.node.parentNode.insertBefore(container, target.node);

    if (cfg.reemplazarBoton && target.node) {
      target.node.style.display = "none";
    }

    var idxDefault = 0;
    for (var i = 0; i < cfg.promociones.length; i++) {
      if (cfg.promociones[i].marcarPorDefecto) { idxDefault = i; break; }
    }

    var state = {
      selectedIdx: idxDefault,
      comps: cfg.complementarios.map(function () { return cfg.complementariosDefault; }),
    };

    function render() {
      container.innerHTML = buildBundlePromocionesHtml(cfg, state);
      wireEvents();
    }

    function wireEvents() {
      qsa("." + NS + "-bundle-card", container).forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (e.target && (e.target.tagName === "INPUT" || e.target.closest("." + NS + "-bundle-comp"))) return;
          var idx = parseInt(card.dataset.idx, 10);
          if (!isNaN(idx)) {
            state.selectedIdx = idx;
            render();
          }
        });
      });

      qsa("." + NS + "-bundle-comp input", container).forEach(function (chk) {
        chk.addEventListener("change", function () {
          var idx = parseInt(chk.dataset.compIdx, 10);
          if (!isNaN(idx)) {
            state.comps[idx] = chk.checked;
          }
        });
      });

      var btn = qs("." + NS + "-bundle-btn", container);
      if (btn) {
        btn.addEventListener("click", function () {
          var origForm = null;
          var origBtn = null;
          if (target.node) {
            if (target.node.tagName === "FORM") {
              origForm = target.node;
            } else {
              origForm = target.node.closest ? target.node.closest("form") : null;
              origBtn = target.node;
            }
          }
          if (origForm) {
            try {
              if (typeof origForm.requestSubmit === "function") {
                origForm.requestSubmit();
              } else {
                origForm.submit();
              }
            } catch (e) {
              var submitBtn = qs('button[type="submit"], input[type="submit"]', origForm);
              if (submitBtn) submitBtn.click();
            }
          } else if (origBtn) {
            origBtn.click();
          }
        });
      }
    }

    render();
    console.log("[Nevux] Bundle promociones montado");
  }

  function buildBundlePromocionesHtml(cfg, state) {
    var precio = detectProductPrice() || 0;

    var titleHtml = cfg.titulo
      ? '<div class="' + NS + '-bundle-title" style="color:#000;font-size:16px;">' + escapeHtml(cfg.titulo) + '</div>'
      : "";

    var cardsHtml = "";
    for (var i = 0; i < cfg.promociones.length; i++) {
      var p = cfg.promociones[i];
      if (p.ocultarUnidad) continue;

      var ratio = parsePromoRatio(p.tipo);
      var etiqueta = formatEtiquetaPromo(p.formatoEtiqueta, ratio);

      var precioTotalNormal = precio * ratio.lleva;
      var precioTotalPromo = precio * ratio.paga;

      var isSelected = i === state.selectedIdx;
      var borderColor = isSelected ? cfg.colorUnidadSeleccionada : "#e5e7eb";

      var badgesHtml = "";
      if (p.badges.envioGratis) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeEnvio + ';">Envío gratis</span>';
      }
      if (p.badges.masVendido) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeMasVendido + ';">Más vendido</span>';
      }
      if (p.badges.personalizado) {
        var txtPers = p.badges.personalizadoTexto || "Destacado";
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgePersonalizado + ';">' + escapeHtml(txtPers) + '</span>';
      }
      if (badgesHtml) {
        badgesHtml = '<div class="' + NS + '-bundle-badges">' + badgesHtml + '</div>';
      }

      var subtitleHtml = "";
      if (p.subtitulo) {
        var bgSub = (cfg.fondoSubtitulo && cfg.fondoSubtitulo !== "transparent")
          ? 'background:' + cfg.fondoSubtitulo + ';padding:2px 6px;border-radius:4px;display:inline-block;'
          : "";
        subtitleHtml = '<div class="' + NS + '-bundle-subtitle" style="color:' + cfg.colorSubtitulo + ';font-size:' + cfg.tamanoSubtitulo + ';' + bgSub + '">' + escapeHtml(p.subtitulo) + '</div>';
      }

      var compsHtml = "";
      var compsToShow = [];
      for (var c = 0; c < cfg.complementarios.length; c++) {
        var oculto = (c === 0 && p.ocultarComp1) || (c === 1 && p.ocultarComp2);
        if (!oculto && cfg.complementarios[c]) compsToShow.push({ idx: c, prod: cfg.complementarios[c] });
      }
      if (compsToShow.length > 0) {
        var compsInner = "";
        for (var cc = 0; cc < compsToShow.length; cc++) {
          var comp = compsToShow[cc];
          var chk = state.comps[comp.idx] ? "checked" : "";
          var nombreComp = comp.prod.name || comp.prod.nombre || ("Producto " + (comp.idx + 1));
          compsInner += '<label class="' + NS + '-bundle-comp"><input type="checkbox" data-comp-idx="' + comp.idx + '" ' + chk + '/>' + escapeHtml(nombreComp) + '</label>';
        }
        compsHtml = '<div class="' + NS + '-bundle-comps">' + compsInner + '</div>';
      }

      var giftHtml = "";
      if (p.agregarRegalo) {
        giftHtml = '<div class="' + NS + '-bundle-gift" style="background:' + cfg.fondoRegalo + ';color:' + cfg.colorTextoRegalo + ';border-radius:6px;">' +
          '<span class="' + NS + '-bundle-gift-label">🎁 Producto de regalo</span>' +
          '<span style="color:' + cfg.colorPrecioRegalo + ';font-weight:700;">Gratis</span>' +
        '</div>';
      }

      cardsHtml +=
        '<div class="' + NS + '-bundle-card' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="border-color:' + borderColor + ';border-radius:' + cfg.bordeUnidad + 'px;">' +
          '<div style="display:flex;align-items:center;gap:12px;width:100%;">' +
            '<div class="' + NS + '-bundle-radio"><div class="' + NS + '-bundle-radio-dot"></div></div>' +
            '<div class="' + NS + '-bundle-info">' +
              '<div class="' + NS + '-bundle-label" style="font-size:' + cfg.tamanoEtiqueta + ';">' + escapeHtml(etiqueta) + '</div>' +
              subtitleHtml +
              badgesHtml +
            '</div>' +
            '<div class="' + NS + '-bundle-prices">' +
              (ratio.lleva !== ratio.paga ? '<span class="' + NS + '-bundle-price-old">' + formatMoney(precioTotalNormal) + '</span>' : "") +
              '<span class="' + NS + '-bundle-price-new" style="color:' + cfg.colorPrecio + ';font-size:' + cfg.tamanoPrecio + ';">' + formatMoney(precioTotalPromo) + '</span>' +
            '</div>' +
          '</div>' +
          (compsHtml || giftHtml ? '<div style="width:100%;">' + compsHtml + giftHtml + '</div>' : "") +
        '</div>';
    }

    var btnBg = cfg.botonDegradado
      ? 'background:linear-gradient(135deg, ' + cfg.colorBoton + ' 0%, ' + cfg.colorBoton + 'cc 100%);'
      : 'background:' + cfg.colorBoton + ';';
    var btnClass = NS + "-bundle-btn";
    if (cfg.efectoBoton === "zoom") btnClass += " zoom";
    if (cfg.botonPulsante) btnClass += " pulse";

    var btnHtml = '<button type="button" class="' + btnClass + '" style="' + btnBg + 'color:#fff;font-size:' + cfg.tamanoEtiqueta + ';border-radius:' + cfg.bordeBoton + 'px;">' + escapeHtml(cfg.textoBoton || "Agregar al carrito") + '</button>';

    var infoHtml = !cfg.reemplazarBoton
      ? '<div class="' + NS + '-bundle-info-note"><span style="opacity:0.7;">ⓘ</span><span>El formulario original de Tiendanube permanecerá visible y funcional.</span></div>'
      : "";

    return '<div class="' + NS + '-bundle">' +
      titleHtml +
      cardsHtml +
      btnHtml +
      infoHtml +
    '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BUNDLE DE CANTIDAD
  ═══════════════════════════════════════════ */
  function renderBundleCantidad(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeBundleCantidadConfig(widget.config || {});
    if (!cfg.unidades || cfg.unidades.length === 0) return;
    mountBundleCantidad(widget, cfg);
  }

  function normalizeBundleCantidadConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }

    var unidadesRaw = Array.isArray(raw.unidades) ? raw.unidades : [];
    var unidadesNorm = [];
    for (var i = 0; i < 5; i++) {
      var u = unidadesRaw[i] || {};
      unidadesNorm.push({
        subtitulo: u.subtitulo || "",
        descuento: parseFloat(u.descuento) || 0,
        badgeEnvioGratis: u.badgeEnvioGratis === true,
        badgeMasVendido: u.badgeMasVendido === true,
        badgePersonalizado: u.badgePersonalizado === true,
        ocultar: u.ocultar === true,
        porDefecto: u.porDefecto === true,
        ocultarComp1: u.ocultarComp1 === true,
        ocultarComp2: u.ocultarComp2 === true,
        agregarRegalo: u.agregarRegalo === true,
      });
    }

    return {
      titulo: raw.titulo || "",
      cantidadUnidades: n(raw.cantidadUnidades, 2),
      etiqueta: raw.etiqueta || "Lleva #",
      mostrarPrecio: raw.mostrarPrecio === "individual" ? "individual" : "total",
      textoBoton: raw.textoBoton || "",
      unidades: unidadesNorm,
      producto1: raw.producto1 || null,
      producto2: raw.producto2 || null,
      compDefault: raw.compDefault === true,
      reemplazarBoton: raw.reemplazarBoton === true,
      colorBoton: raw.colorBoton || "#000000",
      botonDegradado: raw.botonDegradado === true,
      colorBoton2: raw.colorBoton2 || "#3B82F6",
      colorPrecio: raw.colorPrecio || "#000000",
      colorSubtitulos: raw.colorSubtitulos || "#059669",
      fondoSubtitulo: raw.fondoSubtitulo || "",
      colorTextoRegalo: raw.colorTextoRegalo || "#000000",
      colorPrecioRegalo: raw.colorPrecioRegalo || "#16a34a",
      fondoRegalo: raw.fondoRegalo || "#f5fff7",
      colorBadgeEnvio: raw.colorBadgeEnvio || "#10B981",
      colorBadgePersonalizado: raw.colorBadgePersonalizado || "#F59E0B",
      colorBadgeMasVendido: raw.colorBadgeMasVendido || "#EF4444",
      colorUnidadSeleccionada: raw.colorUnidadSeleccionada || "#170c0e",
      bordeBoton: n(raw.bordeBoton, 25),
      bordeUnidad: n(raw.bordeUnidad, 8),
      fuenteEtiqueta: n(raw.fuenteEtiqueta, 16),
      fuentePrecio: n(raw.fuentePrecio, 18),
      fuenteSubtitulo: n(raw.fuenteSubtitulo, 14),
      efectoBoton: raw.efectoBoton === "zoom" ? "zoom" : "sin-efecto",
      pulsante: raw.pulsante === true,
    };
  }

  function formatEtiquetaCantidad(etiqueta, cantidad) {
    return String(etiqueta).replace(/#/g, String(cantidad));
  }

  function mountBundleCantidad(widget, cfg) {
    var uniqueId = NS + "-bundlecant-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para bundle cantidad en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    target.node.parentNode.insertBefore(container, target.node);

    if (cfg.reemplazarBoton && target.node) {
      target.node.style.display = "none";
    }

    var cantidadReal = Math.max(2, Math.min(5, cfg.cantidadUnidades || 2));
    var idxDefault = -1;
    for (var i = 0; i < cantidadReal; i++) {
      if (cfg.unidades[i] && cfg.unidades[i].porDefecto && !cfg.unidades[i].ocultar) {
        idxDefault = i; break;
      }
    }
    if (idxDefault === -1) {
      for (var j = 0; j < cantidadReal; j++) {
        if (cfg.unidades[j] && !cfg.unidades[j].ocultar) { idxDefault = j; break; }
      }
    }

    var state = {
      selectedIdx: idxDefault,
      comp1: cfg.compDefault,
      comp2: cfg.compDefault,
    };

    function render() {
      container.innerHTML = buildBundleCantidadHtml(cfg, state, cantidadReal);
      wireEvents();
    }

    function wireEvents() {
      qsa("." + NS + "-bundle-card", container).forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (e.target && (e.target.tagName === "INPUT" || e.target.closest("." + NS + "-bundle-comp"))) return;
          var idx = parseInt(card.dataset.idx, 10);
          if (!isNaN(idx)) {
            state.selectedIdx = idx;
            render();
          }
        });
      });

      qsa("." + NS + "-bundle-comp input", container).forEach(function (chk) {
        chk.addEventListener("change", function () {
          var idx = parseInt(chk.dataset.compIdx, 10);
          if (idx === 0) state.comp1 = chk.checked;
          if (idx === 1) state.comp2 = chk.checked;
        });
      });

      var btn = qs("." + NS + "-bundle-btn", container);
      if (btn) {
        btn.addEventListener("click", function () {
          var origForm = null;
          var origBtn = null;
          if (target.node) {
            if (target.node.tagName === "FORM") {
              origForm = target.node;
            } else {
              origForm = target.node.closest ? target.node.closest("form") : null;
              origBtn = target.node;
            }
          }
          if (origForm) {
            try {
              if (typeof origForm.requestSubmit === "function") {
                origForm.requestSubmit();
              } else {
                origForm.submit();
              }
            } catch (e) {
              var submitBtn = qs('button[type="submit"], input[type="submit"]', origForm);
              if (submitBtn) submitBtn.click();
            }
          } else if (origBtn) {
            origBtn.click();
          }
        });
      }
    }

    render();
    console.log("[Nevux] Bundle cantidad montado");
  }

  function buildBundleCantidadHtml(cfg, state, cantidadReal) {
    var precio = detectProductPrice() || 0;

    var titleHtml = cfg.titulo
      ? '<div class="' + NS + '-bundle-title" style="color:#000;font-size:16px;text-align:center;">' + escapeHtml(cfg.titulo) + '</div>'
      : "";

    var cardsHtml = "";
    for (var i = 0; i < cantidadReal; i++) {
      var u = cfg.unidades[i];
      if (!u || u.ocultar) continue;

      var cantidad = i + 1;
      var etiqueta = formatEtiquetaCantidad(cfg.etiqueta, cantidad);
      var descuento = parseFloat(u.descuento) || 0;

      var precioUnitario = precio * (1 - descuento / 100);
      var precioTotalOriginal = precio * cantidad;
      var precioTotalConDesc = precioUnitario * cantidad;

      var mostrarTachado = descuento > 0;
      var precioMostrar = cfg.mostrarPrecio === "individual" ? precioUnitario : precioTotalConDesc;
      var precioTachadoMostrar = cfg.mostrarPrecio === "individual" ? precio : precioTotalOriginal;

      var isSelected = i === state.selectedIdx;
      var borderColor = isSelected ? cfg.colorUnidadSeleccionada : "#e5e7eb";

      var badgesHtml = "";
      if (u.badgeEnvioGratis) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeEnvio + ';">Envío gratis</span>';
      }
      if (u.badgeMasVendido) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeMasVendido + ';">Más vendido</span>';
      }
      if (u.badgePersonalizado) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgePersonalizado + ';">Personalizado</span>';
      }
      if (badgesHtml) {
        badgesHtml = '<div class="' + NS + '-bundle-badges">' + badgesHtml + '</div>';
      }

      var subtitleHtml = "";
      if (u.subtitulo) {
        var bgSub = (cfg.fondoSubtitulo && cfg.fondoSubtitulo !== "transparent" && cfg.fondoSubtitulo !== "")
          ? 'background:' + cfg.fondoSubtitulo + ';padding:2px 6px;border-radius:4px;display:inline-block;'
          : "";
        subtitleHtml = '<div class="' + NS + '-bundle-subtitle" style="color:' + cfg.colorSubtitulos + ';font-size:' + cfg.fuenteSubtitulo + 'px;' + bgSub + '">' + escapeHtml(u.subtitulo) + '</div>';
      }

      var compsHtml = "";
      var compsToShow = [];
      if (cfg.producto1 && !u.ocultarComp1) {
        compsToShow.push({ idx: 0, prod: cfg.producto1, checked: state.comp1 });
      }
      if (cfg.producto2 && !u.ocultarComp2) {
        compsToShow.push({ idx: 1, prod: cfg.producto2, checked: state.comp2 });
      }
      if (compsToShow.length > 0) {
        var compsInner = "";
        for (var cc = 0; cc < compsToShow.length; cc++) {
          var comp = compsToShow[cc];
          var chk = comp.checked ? "checked" : "";
          var nombreComp = comp.prod.name || comp.prod.nombre || ("Producto " + (comp.idx + 1));
          compsInner += '<label class="' + NS + '-bundle-comp"><input type="checkbox" data-comp-idx="' + comp.idx + '" ' + chk + '/>' + escapeHtml(nombreComp) + '</label>';
        }
        compsHtml = '<div class="' + NS + '-bundle-comps">' + compsInner + '</div>';
      }

      var giftHtml = "";
      if (u.agregarRegalo) {
        giftHtml = '<div class="' + NS + '-bundle-gift" style="background:' + cfg.fondoRegalo + ';color:' + cfg.colorTextoRegalo + ';border-radius:6px;">' +
          '<span class="' + NS + '-bundle-gift-label">🎁 Producto de regalo</span>' +
          '<span style="color:' + cfg.colorPrecioRegalo + ';font-weight:700;">GRATIS</span>' +
        '</div>';
      }

      cardsHtml +=
        '<div class="' + NS + '-bundle-card' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="border-color:' + borderColor + ';border-radius:' + cfg.bordeUnidad + 'px;">' +
          '<div style="display:flex;align-items:center;gap:12px;width:100%;">' +
            '<div class="' + NS + '-bundle-radio" style="border-color:' + (isSelected ? cfg.colorUnidadSeleccionada : "#9ca3af") + ';">' +
              '<div class="' + NS + '-bundle-radio-dot" style="background:' + cfg.colorUnidadSeleccionada + ';"></div>' +
            '</div>' +
            '<div class="' + NS + '-bundle-info">' +
              '<div class="' + NS + '-bundle-label" style="font-size:' + cfg.fuenteEtiqueta + 'px;">' + escapeHtml(etiqueta) + '</div>' +
              subtitleHtml +
              badgesHtml +
            '</div>' +
            '<div class="' + NS + '-bundle-prices">' +
              (mostrarTachado ? '<span class="' + NS + '-bundle-price-old">' + formatMoney(precioTachadoMostrar) + '</span>' : "") +
              '<span class="' + NS + '-bundle-price-new" style="color:' + cfg.colorPrecio + ';font-size:' + cfg.fuentePrecio + 'px;">' + formatMoney(precioMostrar) + '</span>' +
            '</div>' +
          '</div>' +
          (compsHtml || giftHtml ? '<div style="width:100%;">' + compsHtml + giftHtml + '</div>' : "") +
        '</div>';
    }

    var btnBg = cfg.botonDegradado
      ? 'background:linear-gradient(90deg, ' + cfg.colorBoton + ' 0%, ' + cfg.colorBoton2 + ' 100%);'
      : 'background:' + cfg.colorBoton + ';';
    var btnClass = NS + "-bundle-btn";
    if (cfg.efectoBoton === "zoom") btnClass += " zoom";
    if (cfg.pulsante) btnClass += " pulse";

    var textoBoton = cfg.textoBoton && cfg.textoBoton.trim() !== "" ? cfg.textoBoton : "Agregar al carrito";
    var btnHtml = '<button type="button" class="' + btnClass + '" style="' + btnBg + 'color:#fff;font-size:16px;border-radius:' + cfg.bordeBoton + 'px;">' + escapeHtml(textoBoton) + '</button>';

    var infoHtml = !cfg.reemplazarBoton
      ? '<div class="' + NS + '-bundle-info-note"><span style="opacity:0.7;">ⓘ</span><span>El formulario original de Tiendanube permanecerá visible y funcional.</span></div>'
      : "";

    return '<div class="' + NS + '-bundle">' +
      titleHtml +
      cardsHtml +
      btnHtml +
      infoHtml +
    '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER CAJA DE OPINIONES
  ═══════════════════════════════════════════ */
  function renderCajaOpiniones(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeCajaOpinionesConfig(widget.config || {});
    var opiniones = (cfg.opiniones || []).filter(function (o) {
      return o && ((o.nombre && o.nombre.trim().length > 0) || (o.texto && o.texto.trim().length > 0));
    });
    if (opiniones.length === 0) return;
    cfg.opiniones = opiniones;
    mountCajaOpiniones(widget, cfg);
  }

  function normalizeCajaOpinionesConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    var op = Array.isArray(raw.opiniones) ? raw.opiniones : [];
    op = op.map(function (o) {
      return {
        nombre: o.nombre || "",
        estrellas: Math.max(1, Math.min(5, parseInt(o.estrellas, 10) || 5)),
        texto: o.texto || "",
        foto: o.foto || "",
        compraVerificada: o.compraVerificada === true,
      };
    });
    return {
      opiniones: op,
      colorFondo: raw.colorFondo || "#f7f7f7",
      colorTexto: raw.colorTexto || "#333333",
      colorEstrellas: raw.colorEstrellas || "#f5b301",
      mostrarBorde: raw.mostrarBorde === true,
      colorBorde: raw.colorBorde || "#cccccc",
      fuenteNombre: n(raw.fuenteNombre, 16),
      fuenteOpinion: n(raw.fuenteOpinion, 15),
      bordeRedondeado: n(raw.bordeRedondeado, 10),
      padding: n(raw.padding, 20),
      tamanoAvatar: n(raw.tamanoAvatar, 44),
    };
  }

  function getOpinionInitial(nombre) {
    var n = (nombre || "").trim();
    if (!n) return "?";
    return n.charAt(0).toUpperCase();
  }

  function getOpinionAvatarBg(nombre) {
    var palette = [
      "#DBEAFE", "#FCE7F3", "#DCFCE7", "#FEF3C7",
      "#EDE9FE", "#FFE4E6", "#CFFAFE", "#FEE2E2"
    ];
    var n = (nombre || "").trim();
    if (!n) return "#E5E7EB";
    var sum = 0;
    for (var i = 0; i < n.length; i++) sum += n.charCodeAt(i);
    return palette[sum % palette.length];
  }

  function getOpinionAvatarColor(nombre) {
    var palette = [
      "#1E40AF", "#9D174D", "#166534", "#92400E",
      "#5B21B6", "#9F1239", "#155E75", "#991B1B"
    ];
    var n = (nombre || "").trim();
    if (!n) return "#374151";
    var sum = 0;
    for (var i = 0; i < n.length; i++) sum += n.charCodeAt(i);
    return palette[sum % palette.length];
  }

  function mountCajaOpiniones(widget, cfg) {
    var uniqueId = NS + "-opiniones-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para caja de opiniones en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    container.innerHTML = buildCajaOpinionesHtml(cfg);
    console.log("[Nevux] Caja de opiniones montada");
  }

  function buildCajaOpinionesHtml(cfg) {
    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorBorde : "none";
    var avatarSize = cfg.tamanoAvatar || 44;
    var avatarFontSize = Math.round(avatarSize * 0.42);
    var starSize = Math.max(14, Math.round(cfg.fuenteNombre * 0.95));

    var cardsHtml = "";
    for (var i = 0; i < cfg.opiniones.length; i++) {
      var o = cfg.opiniones[i];
      var nombre = (o.nombre || "").trim() || "Cliente";
      var texto = (o.texto || "").trim();

      var avatarHtml = "";
      if (o.foto) {
        avatarHtml = '<div class="' + NS + '-opiniones-avatar" style="width:' + avatarSize + 'px;height:' + avatarSize + 'px;">' +
          '<img src="' + o.foto + '" alt="' + escapeHtml(nombre) + '"/>' +
        '</div>';
      } else {
        var bg = getOpinionAvatarBg(nombre);
        var color = getOpinionAvatarColor(nombre);
        var initial = getOpinionInitial(nombre);
        avatarHtml = '<div class="' + NS + '-opiniones-avatar" style="width:' + avatarSize + 'px;height:' + avatarSize + 'px;background:' + bg + ';color:' + color + ';font-size:' + avatarFontSize + 'px;">' +
          escapeHtml(initial) +
        '</div>';
      }

      var starsHtml = "";
      for (var s = 1; s <= 5; s++) {
        var starColor = s <= o.estrellas ? cfg.colorEstrellas : "#E5E7EB";
        starsHtml += '<span class="' + NS + '-opiniones-star" style="color:' + starColor + ';font-size:' + starSize + 'px;">★</span>';
      }

      var verifiedHtml = o.compraVerificada
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6" style="flex-shrink:0;"><path d="M12 2l2.09 2.26L17 4l.74 2.91L20 8l-1.26 2.5L20 13l-2.26 1.09L17 17l-2.91-.74L12 18l-2.5-1.26L7 17l-.74-2.91L4 13l1.26-2.5L4 8l2.26-1.09L7 4l2.91.74L12 2z"/><path d="M9 12l2 2 4-4" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : "";

      var textoHtml = texto
        ? '<div class="' + NS + '-opiniones-text" style="font-size:' + cfg.fuenteOpinion + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(texto) + '</div>'
        : "";

      cardsHtml +=
        '<div class="' + NS + '-opiniones-card" style="background:' + cfg.colorFondo + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordeRedondeado + 'px;padding:' + cfg.padding + 'px;border:' + borde + ';">' +
          '<div class="' + NS + '-opiniones-top">' +
            avatarHtml +
            '<div class="' + NS + '-opiniones-name-stars">' +
              '<span class="' + NS + '-opiniones-name" style="font-size:' + cfg.fuenteNombre + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(nombre) + '</span>' +
              '<span class="' + NS + '-opiniones-stars">' + starsHtml + '</span>' +
              verifiedHtml +
            '</div>' +
          '</div>' +
          textoHtml +
        '</div>';
    }

    return '<div class="' + NS + '-opiniones-list">' + cardsHtml + '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER INFORMACIÓN DE DESPACHO
  ═══════════════════════════════════════════ */
  function renderInformacionDespacho(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeInformacionDespachoConfig(widget.config || {});
    mountInformacionDespacho(widget, cfg);
  }

  function normalizeInformacionDespachoConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    var dias = raw.diasDespacho || {};
    return {
      horaCorte: raw.horaCorte || "18:00",
      diasDespacho: {
        lun: dias.lun !== false,
        mar: dias.mar !== false,
        mie: dias.mie !== false,
        jue: dias.jue !== false,
        vie: dias.vie !== false,
        sab: dias.sab !== false,
        dom: dias.dom === true,
      },
      ocultarSiPasoCorte: raw.ocultarSiPasoCorte === true,
      agregarBadge: raw.agregarBadge === true,
      posicion: raw.posicion === "antes-descripcion" ? "antes-descripcion" : "encima-form",
      icono: raw.icono || "circulo",
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "sin-efecto" ? "sin-efecto" : "zoom"),
      aplicarEfectoA: raw.aplicarEfectoA === "mensaje-completo" ? "mensaje-completo" : "solo-icono",
      tamanoFuente: n(raw.tamanoFuente, 15),
      estiloTexto: raw.estiloTexto === "normal" ? "normal" : "negrita",
      colorFondo: raw.colorFondo || "#10b981",
      fondoDegradado: raw.fondoDegradado === true,
      colorTexto: raw.colorTexto || "#ffffff",
      colorBadge: raw.colorBadge && String(raw.colorBadge).trim() !== "" ? raw.colorBadge : "rgba(0,0,0,0.18)",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
      bordesRedondeados: n(raw.bordesRedondeados, 12),
      paddingInterno: n(raw.paddingInterno, 10),
      activarBorde: raw.activarBorde === true,
    };
  }

  function mountInformacionDespacho(widget, cfg) {
    var uniqueId = NS + "-despacho-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para info despacho en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (cfg.posicion === "antes-descripcion") {
      if (target.node.parentNode) {
        target.node.parentNode.insertBefore(container, target.node.nextSibling);
      } else {
        return;
      }
    } else {
      target.node.parentNode.insertBefore(container, target.node);
    }

    function refresh() {
      var info = calculateDespachoInfo(cfg);
      if (info === null) {
        container.style.display = "none";
        return;
      }
      container.style.display = "";
      container.innerHTML = buildInformacionDespachoHtml(cfg, info);
    }

    refresh();
    setInterval(refresh, 60 * 1000);

    console.log("[Nevux] Info despacho montado");
  }

  function calculateDespachoInfo(cfg) {
    var diasArr = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var nombresLargos = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

    var now = new Date();
    var currentDay = now.getDay();

    var horaCorteParts = String(cfg.horaCorte || "18:00").split(":");
    var horaCorteH = parseInt(horaCorteParts[0], 10) || 18;
    var horaCorteM = parseInt(horaCorteParts[1], 10) || 0;

    var corte = new Date(now.getFullYear(), now.getMonth(), now.getDate(), horaCorteH, horaCorteM, 0);
    var msLeft = corte.getTime() - now.getTime();

    var currentDayKey = diasArr[currentDay];
    var isHoyDespacho = cfg.diasDespacho[currentDayKey] === true;

    if (isHoyDespacho && msLeft > 0) {
      var totalMin = Math.floor(msLeft / 60000);
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      var timeLeft;
      if (h > 0) {
        timeLeft = h + "h " + m + "m";
      } else {
        timeLeft = m + "m";
      }
      return {
        dayLabel: "HOY",
        timeLeft: timeLeft,
        showRight: true,
      };
    }

    if (cfg.ocultarSiPasoCorte === true) {
      return null;
    }

    var found = null;
    for (var i = 1; i <= 7; i++) {
      var idx = (currentDay + i) % 7;
      var key = diasArr[idx];
      if (cfg.diasDespacho[key] === true) {
        found = { idx: idx, offset: i };
        break;
      }
    }

    if (!found) {
      return null;
    }

    var label;
    if (found.offset === 1) {
      label = "MAÑANA";
    } else {
      label = nombresLargos[found.idx];
    }

    return {
      dayLabel: label,
      timeLeft: null,
      showRight: false,
    };
  }

  function getDespachoIconSvg(tipo, size, colorTexto) {
    switch (tipo) {
      case "circulo":
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="#10B981"><circle cx="12" cy="12" r="10"/></svg>';
      case "corazon":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">❤️</span>';
      case "alerta":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">⚠️</span>';
      case "emoji":
        return '<span style="font-size:' + (size + 4) + 'px;line-height:1;">✏️</span>';
      case "nada":
      default:
        return "";
    }
  }

  function buildInformacionDespachoHtml(cfg, info) {
    var fontWeight = cfg.estiloTexto === "negrita" ? 700 : 400;
    var fontSize = cfg.tamanoFuente || 15;

    var background = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var border = cfg.activarBorde ? "1px solid " + cfg.colorTexto + "33" : "none";

    var badgeBg = cfg.colorBadge;

    var efectoAnim =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var aplicarASoloIcono = cfg.aplicarEfectoA === "solo-icono";
    var animacionCard = !aplicarASoloIcono ? efectoAnim : "none";
    var animacionIcono = aplicarASoloIcono ? efectoAnim : "none";

    var iconoSize = fontSize + 2;
    var iconoSvg = getDespachoIconSvg(cfg.icono, iconoSize, cfg.colorTexto);
    var iconoHtml = iconoSvg
      ? '<div class="' + NS + '-despacho-icon" style="animation:' + animacionIcono + ';">' + iconoSvg + '</div>'
      : "";

    var textoPrincipal = "Comprando ahora tu pedido se despacha";
    var dayBadgeFontSize = Math.max(11, fontSize - 3);

    var dayBadgeHtml = '<span class="' + NS + '-despacho-day-badge" style="background:' + badgeBg + ';color:' + cfg.colorTextoBadge + ';font-size:' + dayBadgeFontSize + 'px;">' +
      escapeHtml(info.dayLabel) +
    '</span>';

    var rightHtml = "";
    if (info.showRight && info.timeLeft) {
      var rightLabelSize = Math.max(10, fontSize - 5);
      var rightValueSize = Math.max(14, fontSize);
      rightHtml = '<div class="' + NS + '-despacho-right" style="background:' + badgeBg + ';color:' + cfg.colorTextoBadge + ';">' +
        '<span class="' + NS + '-despacho-right-label" style="font-size:' + rightLabelSize + 'px;">Te quedan</span>' +
        '<span class="' + NS + '-despacho-right-value" style="font-size:' + rightValueSize + 'px;">' + escapeHtml(info.timeLeft) + '</span>' +
      '</div>';
    }

    return '' +
      '<div class="' + NS + '-despacho-box" style="background:' + background + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + (cfg.paddingInterno + 4) + 'px ' + (cfg.paddingInterno + 8) + 'px;border:' + border + ';animation:' + animacionCard + ';">' +
        '<div class="' + NS + '-despacho-left">' +
          iconoHtml +
          '<div class="' + NS + '-despacho-text-wrap">' +
            '<span class="' + NS + '-despacho-text" style="font-size:' + fontSize + 'px;font-weight:' + fontWeight + ';color:' + cfg.colorTexto + ';">' + escapeHtml(textoPrincipal) + '</span>' +
            dayBadgeHtml +
          '</div>' +
        '</div>' +
        rightHtml +
      '</div>';
  }
/* ═══════════════════════════════════════════
     RENDER INFORMACIÓN DE ENVÍO
  ═══════════════════════════════════════════ */
  function renderInformacionEnvio(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeInformacionEnvioConfig(widget.config || {});
    mountInformacionEnvio(widget, cfg);
  }

  function normalizeInformacionEnvioConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      diasHastaEnvio: Math.max(0, n(raw.diasHastaEnvio, 1)),
      diasParaEntrega: Math.max(0, n(raw.diasParaEntrega, 2)),
      horaCorte: raw.horaCorte || "18:00",
      mostrarHoraLimite: raw.mostrarHoraLimite === true,
      mostrarRangoEntrega: raw.mostrarRangoEntrega === true,
      mostrarFechasAprox: raw.mostrarFechasAprox === true,
      noDespacharSabados: raw.noDespacharSabados === true,
      tipoIconos: raw.tipoIconos === "svg" ? "svg" : "emojis",
      colorFondo: raw.colorFondo || "#d9f5e4",
      colorTexto: raw.colorTexto || "#1f6b4e",
      colorBadgeFondo: raw.colorBadgeFondo || "#dc3545",
      colorBadgeTexto: raw.colorBadgeTexto || "#ffffff",
      activarBorde: raw.activarBorde === true,
      tamanoLabel: n(raw.tamanoLabel, 14),
      tamanoDia: n(raw.tamanoDia, 13),
      bordesRedondeados: n(raw.bordesRedondeados, 10),
      paddingInterno: n(raw.paddingInterno, 15),
    };
  }

  function mountInformacionEnvio(widget, cfg) {
    var uniqueId = NS + "-envio-info-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para info envío en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    function refresh() {
      var info = calculateEnvioInfo(cfg);
      container.innerHTML = buildInformacionEnvioHtml(cfg, info);
    }

    refresh();
    setInterval(refresh, 60 * 1000);

    console.log("[Nevux] Info envío montado");
  }

  function calculateEnvioInfo(cfg) {
    var now = new Date();

    var horaCorteParts = String(cfg.horaCorte || "18:00").split(":");
    var horaCorteH = parseInt(horaCorteParts[0], 10) || 18;
    var horaCorteM = parseInt(horaCorteParts[1], 10) || 0;

    var corte = new Date(now.getFullYear(), now.getMonth(), now.getDate(), horaCorteH, horaCorteM, 0);
    var pasoCorte = now.getTime() >= corte.getTime();

    var badgeAntes = null;
    if (cfg.mostrarHoraLimite && !pasoCorte) {
      var hh = String(horaCorteH).padStart(2, "0");
      var mm = String(horaCorteM).padStart(2, "0");
      badgeAntes = "ANTES DE LAS " + hh + ":" + mm;
    }

    var envioDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    envioDate.setDate(envioDate.getDate() + cfg.diasHastaEnvio + (pasoCorte ? 1 : 0));

    if (cfg.noDespacharSabados) {
      var dow = envioDate.getDay();
      if (dow === 6) {
        envioDate.setDate(envioDate.getDate() + 2);
      } else if (dow === 0) {
        envioDate.setDate(envioDate.getDate() + 1);
      }
    }

    var entregaDate = new Date(envioDate.getFullYear(), envioDate.getMonth(), envioDate.getDate());
    entregaDate.setDate(entregaDate.getDate() + cfg.diasParaEntrega);

    var envioLabel = formatFechaRelativaOCorta(envioDate, now);
    var entregaLabel;
    if (cfg.mostrarRangoEntrega) {
      var entregaDate2 = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
      entregaDate2.setDate(entregaDate2.getDate() + 1);
      entregaLabel = formatRangoFechas(entregaDate, entregaDate2);
    } else {
      entregaLabel = formatFechaCorta(entregaDate);
    }

    return {
      compraLabel: "Hoy",
      envioLabel: envioLabel,
      entregaLabel: entregaLabel,
      badgeAntes: badgeAntes,
    };
  }

  function formatFechaRelativaOCorta(date, now) {
    var hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var diffDays = Math.round((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    return formatFechaCorta(date);
  }

  function formatFechaCorta(date) {
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var d = date.getDate();
    var m = meses[date.getMonth()];
    return d + " " + m;
  }

  function formatRangoFechas(d1, d2) {
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var day1 = d1.getDate();
    var day2 = d2.getDate();
    var m1 = meses[d1.getMonth()];
    var m2 = meses[d2.getMonth()];
    if (m1 === m2) {
      return day1 + " y " + day2 + " " + m1;
    }
    return day1 + " " + m1 + " y " + day2 + " " + m2;
  }

  function getEnvioIconoHtml(tipo, kind, colorTexto) {
    if (tipo === "emojis") {
      if (kind === "compra") return '<span style="font-size:24px;line-height:1;">📦</span>';
      if (kind === "envio") return '<span style="font-size:24px;line-height:1;">🚚</span>';
      if (kind === "entrega") return '<span style="font-size:24px;line-height:1;">📍</span>';
    }
    var attrs = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + colorTexto + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === "compra") {
      return '<svg ' + attrs + '><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
    }
    if (kind === "envio") {
      return '<svg ' + attrs + '><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
    }
    if (kind === "entrega") {
      return '<svg ' + attrs + '><polyline points="20 6 9 17 4 12"/></svg>';
    }
    return "";
  }

  function buildInformacionEnvioHtml(cfg, info) {
    var borde = cfg.activarBorde ? "1px solid " + cfg.colorTexto + "33" : "none";

    var iconoCompra = getEnvioIconoHtml(cfg.tipoIconos, "compra", cfg.colorTexto);
    var iconoEnvio = getEnvioIconoHtml(cfg.tipoIconos, "envio", cfg.colorTexto);
    var iconoEntrega = getEnvioIconoHtml(cfg.tipoIconos, "entrega", cfg.colorTexto);

    var badgeHtml = "";
    if (info.badgeAntes) {
      var badgeSize = Math.max(9, cfg.tamanoDia - 3);
      badgeHtml = '<span class="' + NS + '-envio-badge-antes" style="background:' + cfg.colorBadgeFondo + ';color:' + cfg.colorBadgeTexto + ';font-size:' + badgeSize + 'px;">' + escapeHtml(info.badgeAntes) + '</span>';
    }

    var sepHtml = '<div class="' + NS + '-envio-sep" style="background:' + cfg.colorTexto + ';"></div>';

    var notaHtml = "";
    if (cfg.mostrarFechasAprox) {
      notaHtml = '<div class="' + NS + '-envio-nota">* Fechas aproximadas</div>';
    }

    return '' +
      '<div class="' + NS + '-envio-wrap">' +
        '<div class="' + NS + '-envio-box" style="background:' + cfg.colorFondo + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + cfg.paddingInterno + 'px;border:' + borde + ';">' +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoCompra + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Compra</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.compraLabel) + '</div>' +
            badgeHtml +
          '</div>' +
          sepHtml +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoEnvio + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Envío</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.envioLabel) + '</div>' +
          '</div>' +
          sepHtml +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoEntrega + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Entrega</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.entregaLabel) + '</div>' +
          '</div>' +
        '</div>' +
        notaHtml +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER MENSAJE DE ALERTA
  ═══════════════════════════════════════════ */
  function renderMensajeAlerta(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeMensajeAlertaConfig(widget.config || {});
    if (!cfg.mensaje || cfg.mensaje.trim() === "") return;
    mountMensajeAlerta(widget, cfg);
  }

  function normalizeMensajeAlertaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      mensaje: raw.mensaje || "",
      icono: raw.icono || "circulo",
      emojiCustom: raw.emojiCustom || "⭐",
      imagenUrl: raw.imagenUrl || "",
      posicion: raw.posicion === "despues-precio" ? "despues-precio" : "antes-titulo",
      color: raw.color || "verde",
      colorPersonalizadoFondo: raw.colorPersonalizadoFondo || "#6366f1",
      colorPersonalizadoTexto: raw.colorPersonalizadoTexto || "#ffffff",
      tamanoTexto: n(raw.tamanoTexto, 14),
      estiloTexto: raw.estiloTexto === "resaltado" ? "resaltado" : "normal",
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "ninguno"),
      aplicarEfectoA: raw.aplicarEfectoA === "completo" ? "completo" : "icono",
      bordesRedondeados: n(raw.bordesRedondeados, 8),
      paddingInterno: n(raw.paddingInterno, 12),
      mostrarBorde: raw.mostrarBorde === true,
    };
  }

  function getMensajeAlertaColores(cfg) {
    switch (cfg.color) {
      case "verde":
        return { fondo: "#22c55e", texto: "#ffffff", borde: "#15803d" };
      case "rojo":
        return { fondo: "#ef4444", texto: "#ffffff", borde: "#b91c1c" };
      case "amarillo":
        return { fondo: "#f59e0b", texto: "#ffffff", borde: "#b45309" };
      case "personalizado":
      default:
        return {
          fondo: cfg.colorPersonalizadoFondo || "#6366f1",
          texto: cfg.colorPersonalizadoTexto || "#ffffff",
          borde: cfg.colorPersonalizadoFondo || "#6366f1",
        };
    }
  }

  function getMensajeAlertaIconoHtml(cfg, colores) {
    var iconoSize = Math.round((cfg.tamanoTexto || 14) * 1.4);
    switch (cfg.icono) {
      case "circulo": {
        var dotColor = cfg.color === "amarillo" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)";
        var dotSize = Math.max(10, Math.round(iconoSize * 0.55));
        return '<span class="' + NS + '-alerta-icono" style="width:' + iconoSize + 'px;height:' + iconoSize + 'px;">' +
          '<span style="display:inline-block;width:' + dotSize + 'px;height:' + dotSize + 'px;border-radius:50%;background:' + dotColor + ';"></span>' +
        '</span>';
      }
      case "corazon":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">❤️</span>';
      case "alerta":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">⚠️</span>';
      case "emoji":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">' + escapeHtml(cfg.emojiCustom || "⭐") + '</span>';
      case "imagen":
        if (cfg.imagenUrl && cfg.imagenUrl.trim() !== "") {
          return '<span class="' + NS + '-alerta-icono"><img src="' + escapeHtml(cfg.imagenUrl) + '" alt="" style="width:' + iconoSize + 'px;height:' + iconoSize + 'px;object-fit:contain;display:block;" /></span>';
        }
        return "";
      case "nada":
      default:
        return "";
    }
  }

  function mountMensajeAlerta(widget, cfg) {
    var uniqueId = NS + "-alerta-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (cfg.posicion === "despues-precio") {
      var priceTarget = findProductPriceTarget();
      if (priceTarget && priceTarget.parentNode) {
        priceTarget.parentNode.insertBefore(container, priceTarget.nextSibling);
      } else {
        var fallbackTarget = findProductTarget("before-button");
        if (!fallbackTarget) return;
        fallbackTarget.node.parentNode.insertBefore(container, fallbackTarget.node);
      }
    } else {
      var titleSelectors = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
      var titleEl = null;
      for (var i = 0; i < titleSelectors.length; i++) {
        titleEl = qs(titleSelectors[i]);
        if (titleEl) break;
      }
      if (titleEl && titleEl.parentNode) {
        titleEl.parentNode.insertBefore(container, titleEl);
      } else {
        var fallbackTarget2 = findProductTarget("before-button");
        if (!fallbackTarget2) return;
        fallbackTarget2.node.parentNode.insertBefore(container, fallbackTarget2.node);
      }
    }

    container.innerHTML = buildMensajeAlertaHtml(cfg);
    console.log("[Nevux] Mensaje alerta montado");
  }

  function buildMensajeAlertaHtml(cfg) {
    var colores = getMensajeAlertaColores(cfg);
    var iconoHtml = getMensajeAlertaIconoHtml(cfg, colores);

    var fontWeight = cfg.estiloTexto === "resaltado" ? 700 : 500;
    var borde = cfg.mostrarBorde ? "2px solid " + colores.borde : "none";

    var efectoAnim =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var aplicarACompleto = cfg.aplicarEfectoA === "completo";
    var animacionBox = aplicarACompleto ? efectoAnim : "none";
    var animacionIcono = !aplicarACompleto ? efectoAnim : "none";

    var iconoFinal = iconoHtml;
    if (iconoHtml && animacionIcono !== "none") {
      iconoFinal = '<span style="display:inline-flex;animation:' + animacionIcono + ';">' + iconoHtml + '</span>';
    }

    return '' +
      '<div class="' + NS + '-alerta-box" style="' +
        'background:' + colores.fondo + ';' +
        'color:' + colores.texto + ';' +
        'border-radius:' + cfg.bordesRedondeados + 'px;' +
        'padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 6) + 'px;' +
        'border:' + borde + ';' +
        'animation:' + animacionBox + ';' +
        'width:100%;box-sizing:border-box;' +
      '">' +
        (iconoFinal ? iconoFinal : "") +
        '<span class="' + NS + '-alerta-texto" style="' +
          'font-size:' + cfg.tamanoTexto + 'px;' +
          'font-weight:' + fontWeight + ';' +
          'color:' + colores.texto + ';' +
        '">' + escapeHtml(cfg.mensaje) + '</span>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER MENSAJE DE GARANTÍA
  ═══════════════════════════════════════════ */
  function renderMensajeGarantia(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeMensajeGarantiaConfig(widget.config || {});
    var tieneAlgo =
      (cfg.titulo && cfg.titulo.trim() !== "") ||
      (cfg.texto && cfg.texto.trim() !== "") ||
      (cfg.imagenBase64 && cfg.imagenBase64.trim() !== "");
    if (!tieneAlgo) return;
    mountMensajeGarantia(widget, cfg);
  }

  function normalizeMensajeGarantiaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      titulo: raw.titulo || "",
      texto: raw.texto || "",
      imagenBase64: raw.imagenBase64 || "",
      colorFondo: raw.colorFondo || "#fff9f3",
      colorTitulo: raw.colorTitulo || "#000000",
      colorTexto: raw.colorTexto || "#333333",
      colorBorde: raw.colorBorde || "#e7decf",
      tamanoTitulo: raw.tamanoTitulo || "16px",
      tamanoTexto: raw.tamanoTexto || "16px",
      bordesRedondeados: n(raw.bordesRedondeados, 5),
      paddingInterno: n(raw.paddingInterno, 20),
    };
  }

  function parseTextoMarkdownGarantia(texto) {
    if (!texto) return "";

    var out = escapeHtml(texto);

    var lineas = out.split("\n");
    var bloques = [];
    var bufferLista = [];

    function flushLista() {
      if (bufferLista.length > 0) {
        var items = "";
        for (var k = 0; k < bufferLista.length; k++) {
          items += "<li>" + bufferLista[k] + "</li>";
        }
        bloques.push("<ul>" + items + "</ul>");
        bufferLista = [];
      }
    }

    for (var i = 0; i < lineas.length; i++) {
      var linea = lineas[i];
      var trimmed = linea.trim();
      if (trimmed.indexOf("- ") === 0) {
        bufferLista.push(trimmed.substring(2));
      } else {
        flushLista();
        bloques.push(linea);
      }
    }
    flushLista();

    out = bloques.join("\n");

    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/__(.+?)__/g, "<u>$1</u>");
    out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");

    out = out.replace(/\n/g, "<br/>");

    out = out.replace(/<br\/>\s*<ul/g, "<ul");
    out = out.replace(/<\/ul>\s*<br\/>/g, "</ul>");

    return out;
  }

  function mountMensajeGarantia(widget, cfg) {
    var uniqueId = NS + "-garantia-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para mensaje garantía en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    container.innerHTML = buildMensajeGarantiaHtml(cfg);
    console.log("[Nevux] Mensaje garantía montado");
  }

  function buildMensajeGarantiaHtml(cfg) {
    var tieneImagen = cfg.imagenBase64 && cfg.imagenBase64.trim() !== "";
    var tieneTitulo = cfg.titulo && cfg.titulo.trim() !== "";
    var tieneTexto = cfg.texto && cfg.texto.trim() !== "";

    var imgHtml = "";
    if (tieneImagen) {
      imgHtml = '<div class="' + NS + '-garantia-img-wrap">' +
        '<img src="' + cfg.imagenBase64 + '" alt="" />' +
      '</div>';
    }

    var tituloHtml = "";
    if (tieneTitulo) {
      tituloHtml = '<div class="' + NS + '-garantia-titulo" style="' +
        'font-size:' + cfg.tamanoTitulo + ';' +
        'color:' + cfg.colorTitulo + ';' +
        (tieneTexto ? '' : 'margin-bottom:0;') +
      '">' + escapeHtml(cfg.titulo) + '</div>';
    }

    var textoHtml = "";
    if (tieneTexto) {
      var textoParseado = parseTextoMarkdownGarantia(cfg.texto);
      textoHtml = '<div class="' + NS + '-garantia-texto" style="' +
        'font-size:' + cfg.tamanoTexto + ';' +
        'color:' + cfg.colorTexto + ';' +
      '">' + textoParseado + '</div>';
    }

    return '' +
      '<div class="' + NS + '-garantia-box" style="' +
        'background:' + cfg.colorFondo + ';' +
        'border:1px solid ' + cfg.colorBorde + ';' +
        'border-radius:' + cfg.bordesRedondeados + 'px;' +
        'padding:' + cfg.paddingInterno + 'px;' +
      '">' +
        imgHtml +
        '<div class="' + NS + '-garantia-content">' +
          tituloHtml +
          textoHtml +
        '</div>' +
      '</div>';
      }
    /* ═══════════════════════════════════════════
     RENDER RESEÑAS DE CLIENTES (Widget 14)
  ═══════════════════════════════════════════ */
  function renderResenasClientes(widget) {
    var cfg = normalizeResenasClientesConfig(widget.config || {});
    var reviews = Array.isArray(widget.reviews) ? widget.reviews : [];
    var stats = widget.stats || { total: 0, promedio: 0, distribucion: {} };

    if (cfg.ocultarSiNoHayResenas && reviews.length === 0 && cfg.ocultarBotonEscribir) {
      return;
    }

    if (pageType === "product" && cfg.mostrarPuntuacionBajoTitulo && stats.total > 0) {
      mountResenasMini(widget, cfg, stats);
    }

    if (pageType === "product") {
      var mounted = mountResenasClientes(widget, cfg, reviews, stats);

      if (mounted) {
        var params = new URLSearchParams(window.location.search);
        if (params.has("calificar")) {
          setTimeout(function () {
            openResenasModal(widget, cfg);
          }, 500);
        }
      }
    }
  }

  function normalizeResenasClientesConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      titulo: raw.titulo || "",
      textoBoton: raw.textoBoton || "Escribir reseña",
      subtitulo: raw.subtitulo || "",
      mensajeAgradecimiento: raw.mensajeAgradecimiento ||
        "¡Gracias! Tu reseña fue enviada y será publicada luego de ser revisada.",
      ofrecerCupon: raw.ofrecerCupon === true,
      codigoCupon: raw.codigoCupon || "",
      aprobarAutomaticamente: raw.aprobarAutomaticamente !== false,
      notificarPendientes: raw.notificarPendientes === true,
      mostrarTodasLasResenas: raw.mostrarTodasLasResenas === true,
      activarPreguntaTalle: raw.activarPreguntaTalle === true,
      ocultarBotonEscribir: raw.ocultarBotonEscribir === true,
      ocultarSiNoHayResenas: raw.ocultarSiNoHayResenas === true,
      mostrarFecha: raw.mostrarFecha === true,
      mostrarPuntuacionBajoTitulo: raw.mostrarPuntuacionBajoTitulo !== false,
      disenoWidget: raw.disenoWidget === "lista" ? "lista" : "cuadricula",
      reviewsPorPagina: n(raw.reviewsPorPagina, 8),
      bordeBotones: n(raw.bordeBotones, 25),
      mostrarOpinionPrimero: raw.mostrarOpinionPrimero === true,
      colorBotones: raw.colorBotones || "#1a1a1a",
      colorFondo: raw.colorFondo || "transparent",
      colorTitulo: raw.colorTitulo || "#1a1a1a",
      colorSubtitulo: raw.colorSubtitulo || "#1a1a1a",
      fondoSubtitulo: raw.fondoSubtitulo || "transparent",
      colorFondoResena: raw.colorFondoResena || "#fafafa",
      colorNombre: raw.colorNombre || "#1a1a1a",
      colorEstrellas: raw.colorEstrellas || "#f5b300",
      colorTextoResena: raw.colorTextoResena || "#555555",
      colorFecha: raw.colorFecha || "#999999",
      tamanoTitulo: n(raw.tamanoTitulo, 22),
      tamanoSubtitulo: n(raw.tamanoSubtitulo, 16),
      tamanoEstrellas: n(raw.tamanoEstrellas, 16),
      tamanoNombre: n(raw.tamanoNombre, 16),
      estiloNombre: raw.estiloNombre === "normal" ? "normal" : "resaltado",
    };
  }

  function renderResenasStars(cantidad, color, size) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      var c = i <= cantidad ? color : "#e5e7eb";
      out += '<span style="color:' + c + ';font-size:' + size + 'px;line-height:1;">★</span>';
    }
    return out;
  }

  function formatFechaResena(fechaStr) {
    if (!fechaStr) return "";
    try {
      var d = new Date(fechaStr);
      var now = new Date();
      var diffMs = now.getTime() - d.getTime();
      var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Hoy";
      if (diffDays === 1) return "Ayer";
      if (diffDays < 7) return "Hace " + diffDays + " días";
      if (diffDays < 30) {
        var semanas = Math.floor(diffDays / 7);
        return "Hace " + semanas + (semanas === 1 ? " semana" : " semanas");
      }
      if (diffDays < 365) {
        var meses = Math.floor(diffDays / 30);
        return "Hace " + meses + (meses === 1 ? " mes" : " meses");
      }
      var anios = Math.floor(diffDays / 365);
      return "Hace " + anios + (anios === 1 ? " año" : " años");
    } catch (e) {
      return "";
    }
  }

  function mountResenasMini(widget, cfg, stats) {
    var uniqueId = NS + "-resenas-mini-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var titleSelectors = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
    var titleEl = null;
    for (var i = 0; i < titleSelectors.length; i++) {
      titleEl = qs(titleSelectors[i]);
      if (titleEl) break;
    }
    if (!titleEl || !titleEl.parentNode) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";
    container.style.margin = "0";

    var starsSize = 16;
    var promedioTxt = String(stats.promedio).replace(".", ",");
    var totalTxt = stats.total + (stats.total === 1 ? " reseña" : " reseñas");

    container.innerHTML =
      '<div class="' + NS + '-resenas-titulo-mini">' +
        '<span class="' + NS + '-resenas-titulo-mini-stars">' +
          renderResenasStars(Math.round(stats.promedio), cfg.colorEstrellas, starsSize) +
        '</span>' +
        '<span class="' + NS + '-resenas-titulo-mini-texto">' +
          escapeHtml(promedioTxt) + ' · ' + escapeHtml(totalTxt) +
        '</span>' +
      '</div>';

    titleEl.parentNode.insertBefore(container, titleEl.nextSibling);
    console.log("[Nevux] Reseñas mini (estrellas debajo del título) montado");
  }

  function mountResenasClientes(widget, cfg, reviews, stats) {
    var uniqueId = NS + "-resenas-" + widget.id;
    if (qs("#" + uniqueId)) return false;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para reseñas en producto");
      return false;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return false;
    }

    var state = {
      pagina: 1,
      reviews: reviews,
      stats: stats,
    };

    function render() {
      container.innerHTML = buildResenasClientesHtml(cfg, state);
      wireEvents();
    }

    function wireEvents() {
      var btn = qs("." + NS + "-resenas-btn", container);
      if (btn) {
        btn.addEventListener("click", function () {
          openResenasModal(widget, cfg);
        });
      }

      qsa("." + NS + "-resenas-pag-btn", container).forEach(function (b) {
        b.addEventListener("click", function () {
          var p = parseInt(b.dataset.pag, 10);
          if (!isNaN(p)) {
            state.pagina = p;
            render();
            container.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }

    render();
    console.log("[Nevux] Reseñas de clientes montado. Total:", reviews.length);
    return true;
  }

  function buildResenasClientesHtml(cfg, state) {
    var reviews = state.reviews || [];
    var stats = state.stats || { total: 0, promedio: 0 };
    var total = stats.total || 0;

    var tituloHtml = cfg.titulo
      ? '<h3 class="' + NS + '-resenas-titulo" style="font-size:' + cfg.tamanoTitulo + 'px;color:' + cfg.colorTitulo + ';">' + escapeHtml(cfg.titulo) + '</h3>'
      : "";

    var subtituloHtml = "";
    if (cfg.subtitulo) {
      var bgSub = cfg.fondoSubtitulo !== "transparent"
        ? 'background:' + cfg.fondoSubtitulo + ';padding:4px 10px;border-radius:6px;'
        : "";
      subtituloHtml = '<span class="' + NS + '-resenas-subtitulo" style="font-size:' + cfg.tamanoSubtitulo + 'px;color:' + cfg.colorSubtitulo + ';' + bgSub + '">' + escapeHtml(cfg.subtitulo) + '</span>';
    }

    var headerHtml = "";
    if (total > 0 || !cfg.ocultarBotonEscribir) {
      var promedioTxt = String(stats.promedio || 0).replace(".", ",");
      var totalTxt = total + (total === 1 ? " reseña" : " reseñas");

      var promedioBlock = total > 0
        ? '<div class="' + NS + '-resenas-header-left">' +
            '<div class="' + NS + '-resenas-promedio" style="color:' + cfg.colorTitulo + ';">' + promedioTxt + '</div>' +
            '<div class="' + NS + '-resenas-header-info">' +
              '<span class="' + NS + '-resenas-header-stars">' + renderResenasStars(Math.round(stats.promedio || 0), cfg.colorEstrellas, cfg.tamanoEstrellas + 4) + '</span>' +
              '<span class="' + NS + '-resenas-total">' + escapeHtml(totalTxt) + '</span>' +
            '</div>' +
          '</div>'
        : '<div class="' + NS + '-resenas-header-left"><span class="' + NS + '-resenas-total">Sé el primero en dejar una reseña</span></div>';

      var btnHtml = !cfg.ocultarBotonEscribir
        ? '<button type="button" class="' + NS + '-resenas-btn" style="background:' + cfg.colorBotones + ';color:#fff;border-radius:' + cfg.bordeBotones + 'px;">' + escapeHtml(cfg.textoBoton) + '</button>'
        : "";

      headerHtml =
        '<div class="' + NS + '-resenas-header">' +
          promedioBlock +
          btnHtml +
        '</div>';
    }

    var gridHtml = "";
    var paginacionHtml = "";
    if (reviews.length > 0) {
      var porPagina = cfg.reviewsPorPagina || 8;
      var totalPaginas = Math.ceil(reviews.length / porPagina);
      var pagActual = Math.min(state.pagina || 1, totalPaginas);
      var inicio = (pagActual - 1) * porPagina;
      var fin = inicio + porPagina;
      var slice = reviews.slice(inicio, fin);

      var cardsHtml = "";
      for (var i = 0; i < slice.length; i++) {
        var r = slice[i];
        cardsHtml += buildResenasCardHtml(r, cfg);
      }

      gridHtml = '<div class="' + NS + '-resenas-grid ' + cfg.disenoWidget + '">' + cardsHtml + '</div>';

      if (totalPaginas > 1) {
        var pagBtns = "";
        for (var p = 1; p <= totalPaginas; p++) {
          var activeClass = p === pagActual ? " active" : "";
          pagBtns += '<button type="button" class="' + NS + '-resenas-pag-btn' + activeClass + '" data-pag="' + p + '">' + p + '</button>';
        }
        paginacionHtml = '<div class="' + NS + '-resenas-paginacion">' + pagBtns + '</div>';
      }
    } else if (!cfg.ocultarSiNoHayResenas) {
      gridHtml = '<div class="' + NS + '-resenas-empty">Todavía no hay reseñas para este producto.</div>';
    }

    var bgStyle = cfg.colorFondo === "transparent" ? "transparent" : cfg.colorFondo;

    return '' +
      '<div class="' + NS + '-resenas-wrap" style="background:' + bgStyle + ';">' +
        tituloHtml +
        subtituloHtml +
        headerHtml +
        gridHtml +
        paginacionHtml +
      '</div>';
  }

  function buildResenasCardHtml(r, cfg) {
    var nombre = (r.nombre || "Cliente").trim();
    var texto = (r.texto || "").trim();
    var fotoUrl = r.foto_url || "";

    var fotoHtml = fotoUrl
      ? '<div class="' + NS + '-resenas-card-foto"><img src="' + escapeHtml(fotoUrl) + '" alt=""/></div>'
      : "";

    var verifiedHtml = r.verificada
      ? '<span class="' + NS + '-resenas-verified" title="Compra verificada">✓</span>'
      : "";

    var starsHtml = '<span class="' + NS + '-resenas-card-stars">' + renderResenasStars(r.estrellas || 5, cfg.colorEstrellas, cfg.tamanoEstrellas) + '</span>';

    var fontWeightNombre = cfg.estiloNombre === "resaltado" ? 700 : 500;
    var nombreHtml = '<span class="' + NS + '-resenas-card-nombre" style="font-size:' + cfg.tamanoNombre + 'px;font-weight:' + fontWeightNombre + ';color:' + cfg.colorNombre + ';">' + escapeHtml(nombre) + '</span>';

    var textoHtml = texto
      ? '<p class="' + NS + '-resenas-card-texto" style="font-size:14px;color:' + cfg.colorTextoResena + ';">' + escapeHtml(texto) + '</p>'
      : "";

    var fechaHtml = "";
    if (cfg.mostrarFecha && r.fecha_resena) {
      var fechaLabel = formatFechaResena(r.fecha_resena);
      if (fechaLabel) {
        fechaHtml = '<div class="' + NS + '-resenas-card-fecha" style="font-size:12px;color:' + cfg.colorFecha + ';">' + escapeHtml(fechaLabel) + '</div>';
      }
    }

    var talleHtml = "";
    if (cfg.activarPreguntaTalle && r.talle) {
      talleHtml = '<span class="' + NS + '-resenas-card-talle">Talle ' + escapeHtml(r.talle) + '</span>';
    }

    var headerHtml =
      '<div class="' + NS + '-resenas-card-header">' +
        nombreHtml +
        verifiedHtml +
      '</div>';

    var innerHtml;
    if (cfg.mostrarOpinionPrimero) {
      innerHtml =
        fotoHtml +
        starsHtml +
        textoHtml +
        headerHtml +
        (talleHtml ? '<div>' + talleHtml + '</div>' : "") +
        fechaHtml;
    } else {
      innerHtml =
        fotoHtml +
        headerHtml +
        starsHtml +
        textoHtml +
        (talleHtml ? '<div>' + talleHtml + '</div>' : "") +
        fechaHtml;
    }

    return '<div class="' + NS + '-resenas-card" style="background:' + cfg.colorFondoResena + ';">' + innerHtml + '</div>';
  }

  /* ═══════════════════════════════════════════
     MODAL PÚBLICO DE RESEÑAS
  ═══════════════════════════════════════════ */
  function openResenasModal(widget, cfg) {
    var existing = qs("#" + NS + "-modal-overlay");
    if (existing) {
      existing.remove();
    }

    var overlay = document.createElement("div");
    overlay.id = NS + "-modal-overlay";
    overlay.className = NS + "-modal-overlay";

    var state = {
      nombre: "",
      email: "",
      estrellas: 0,
      texto: "",
      foto_url: "",
      talle: "",
      ajuste_talle: "",
      loading: false,
      error: "",
      success: false,
      cupon: null,
      mensajeFinal: "",
    };

    overlay.innerHTML = buildResenasModalHtml(cfg, state);
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("open");
    });

    wireModalEvents(overlay, widget, cfg, state);
  }

  function buildResenasModalHtml(cfg, state) {
    if (state.success) {
      var cuponHtml = "";
      if (state.cupon) {
        cuponHtml =
          '<div class="' + NS + '-modal-cupon-box">' +
            '<div class="' + NS + '-modal-cupon-label">🎁 Tu cupón de descuento:</div>' +
            '<div class="' + NS + '-modal-cupon-code">' + escapeHtml(state.cupon) + '</div>' +
          '</div>';
      }

      return '' +
        '<div class="' + NS + '-modal">' +
          '<div class="' + NS + '-modal-success">' +
            '<div class="' + NS + '-modal-success-icon">✓</div>' +
            '<div class="' + NS + '-modal-success-title">¡Gracias!</div>' +
            '<div class="' + NS + '-modal-success-text">' + escapeHtml(state.mensajeFinal || cfg.mensajeAgradecimiento) + '</div>' +
            cuponHtml +
            '<button type="button" class="' + NS + '-modal-submit" data-action="close" style="background:' + cfg.colorBotones + ';border-radius:' + cfg.bordeBotones + 'px;margin-top:16px;">Cerrar</button>' +
          '</div>' +
        '</div>';
    }

    var starsHtml = "";
    for (var i = 1; i <= 5; i++) {
      var filled = i <= state.estrellas ? " filled" : "";
      starsHtml += '<span class="' + NS + '-modal-star' + filled + '" data-star="' + i + '">★</span>';
    }

    var talleFieldHtml = "";
    if (cfg.activarPreguntaTalle) {
      var opcionesAjuste = [
        { value: "chico", label: "Chico" },
        { value: "algo_chico", label: "Algo chico" },
        { value: "como_esperaba", label: "Como esperaba" },
        { value: "algo_grande", label: "Algo grande" },
        { value: "grande", label: "Grande" },
      ];
      var optsHtml = "";
      for (var j = 0; j < opcionesAjuste.length; j++) {
        var o = opcionesAjuste[j];
        var sel = state.ajuste_talle === o.value ? " selected" : "";
        optsHtml += '<div class="' + NS + '-modal-radio-option' + sel + '" data-ajuste="' + o.value + '">' + o.label + '</div>';
      }
      talleFieldHtml =
        '<div class="' + NS + '-modal-field">' +
          '<label class="' + NS + '-modal-label">Talle (opcional)</label>' +
          '<input type="text" class="' + NS + '-modal-input" data-field="talle" value="' + escapeHtml(state.talle) + '" placeholder="Ej: M, 42, XL"/>' +
        '</div>' +
        '<div class="' + NS + '-modal-field">' +
          '<label class="' + NS + '-modal-label">¿Te quedó como esperabas?</label>' +
          '<div class="' + NS + '-modal-radio-group">' + optsHtml + '</div>' +
        '</div>';
    }

    var fotoFieldHtml = "";
    if (state.foto_url) {
      fotoFieldHtml =
        '<div class="' + NS + '-modal-photo-upload">' +
          '<img src="' + state.foto_url + '" class="' + NS + '-modal-photo-preview" alt=""/>' +
          '<button type="button" class="' + NS + '-modal-photo-remove" data-action="remove-photo">Quitar foto</button>' +
        '</div>';
    } else {
      fotoFieldHtml =
        '<label class="' + NS + '-modal-photo-btn">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
          'Agregar foto (opcional)' +
          '<input type="file" accept="image/*" data-action="upload-photo" style="display:none;"/>' +
        '</label>';
    }

    var errorHtml = state.error
      ? '<div class="' + NS + '-modal-error">' + escapeHtml(state.error) + '</div>'
      : "";

    var submitDisabled = state.loading ? " disabled" : "";
    var submitText = state.loading ? "Enviando..." : "Enviar reseña";

    return '' +
      '<div class="' + NS + '-modal" data-modal-content>' +
        '<div class="' + NS + '-modal-header">' +
          '<h3 class="' + NS + '-modal-title">Escribir reseña</h3>' +
          '<button type="button" class="' + NS + '-modal-close" data-action="close">×</button>' +
        '</div>' +
        '<form class="' + NS + '-modal-form" data-action="submit">' +
          errorHtml +
          '<div class="' + NS + '-modal-field">' +
            '<label class="' + NS + '-modal-label">Tu nombre *</label>' +
            '<input type="text" class="' + NS + '-modal-input" data-field="nombre" value="' + escapeHtml(state.nombre) + '" placeholder="Ej: María P." required maxlength="80"/>' +
          '</div>' +
          '<div class="' + NS + '-modal-field">' +
            '<label class="' + NS + '-modal-label">Email (opcional)</label>' +
            '<input type="email" class="' + NS + '-modal-input" data-field="email" value="' + escapeHtml(state.email) + '" placeholder="tu@email.com"/>' +
          '</div>' +
          '<div class="' + NS + '-modal-field">' +
            '<label class="' + NS + '-modal-label">Puntuación *</label>' +
            '<div class="' + NS + '-modal-stars">' + starsHtml + '</div>' +
          '</div>' +
          '<div class="' + NS + '-modal-field">' +
            '<label class="' + NS + '-modal-label">Tu opinión *</label>' +
            '<textarea class="' + NS + '-modal-textarea" data-field="texto" placeholder="Contá tu experiencia con el producto..." required maxlength="2000">' + escapeHtml(state.texto) + '</textarea>' +
          '</div>' +
          talleFieldHtml +
          '<div class="' + NS + '-modal-field">' +
            '<label class="' + NS + '-modal-label">Foto (opcional)</label>' +
            fotoFieldHtml +
          '</div>' +
          '<button type="submit" class="' + NS + '-modal-submit" style="background:' + cfg.colorBotones + ';border-radius:' + cfg.bordeBotones + 'px;"' + submitDisabled + '>' + submitText + '</button>' +
        '</form>' +
      '</div>';
  }

  function wireModalEvents(overlay, widget, cfg, state) {
    function render() {
      overlay.innerHTML = buildResenasModalHtml(cfg, state);
      wireModalEvents(overlay, widget, cfg, state);
    }

    function closeModal() {
      overlay.classList.remove("open");
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeModal();
      }
    });

    qsa('[data-action="close"]', overlay).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeModal();
      });
    });

    qsa("." + NS + "-modal-star", overlay).forEach(function (star) {
      star.addEventListener("click", function () {
        state.estrellas = parseInt(star.dataset.star, 10) || 0;
        state.error = "";
        render();
      });
    });

    qsa("[data-ajuste]", overlay).forEach(function (opt) {
      opt.addEventListener("click", function () {
        state.ajuste_talle = opt.dataset.ajuste;
        render();
      });
    });

    qsa("[data-field]", overlay).forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.dataset.field;
        state[field] = input.value;
      });
    });

    var uploadInput = qs('[data-action="upload-photo"]', overlay);
    if (uploadInput) {
      uploadInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          state.error = "La foto es demasiado grande (máx 2MB)";
          render();
          return;
        }
        var reader = new FileReader();
        reader.onload = function (ev) {
          state.foto_url = ev.target.result;
          state.error = "";
          render();
        };
        reader.readAsDataURL(file);
      });
    }

    var removePhoto = qs('[data-action="remove-photo"]', overlay);
    if (removePhoto) {
      removePhoto.addEventListener("click", function (e) {
        e.preventDefault();
        state.foto_url = "";
        render();
      });
    }

    var form = qs('form[data-action="submit"]', overlay);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        submitResena(widget, cfg, state, render);
      });
    }
  }

  function submitResena(widget, cfg, state, render) {
    if (!state.nombre || state.nombre.trim().length < 2) {
      state.error = "El nombre debe tener al menos 2 caracteres";
      render();
      return;
    }
    if (!state.estrellas || state.estrellas < 1 || state.estrellas > 5) {
      state.error = "Seleccioná una puntuación de 1 a 5 estrellas";
      render();
      return;
    }
    if (!state.texto || state.texto.trim().length < 5) {
      state.error = "El texto debe tener al menos 5 caracteres";
      render();
      return;
    }

    state.loading = true;
    state.error = "";
    render();

    var params = new URLSearchParams(window.location.search);
    var vieneDeCalificar = params.has("calificar");

    var body = {
      widget_id: widget.id,
      store_id: storeId,
      product_id: productId,
      nombre: state.nombre.trim(),
      email: state.email ? state.email.trim() : null,
      estrellas: state.estrellas,
      texto: state.texto.trim(),
      foto_url: state.foto_url || null,
      talle: state.talle ? state.talle.trim() : null,
      ajuste_talle: state.ajuste_talle || null,
      desde_calificar: vieneDeCalificar,
    };

    fetch(API_BASE + "/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, status: r.status, data: data };
        });
      })
      .then(function (res) {
        state.loading = false;
        if (!res.ok) {
          state.error = (res.data && res.data.error) || "Error al enviar la reseña";
          render();
          return;
        }
        state.success = true;
        state.mensajeFinal = res.data.mensaje || cfg.mensajeAgradecimiento;
        state.cupon = res.data.cupon || null;
        render();
      })
      .catch(function (err) {
        state.loading = false;
        state.error = "Error de conexión. Intentalo de nuevo.";
        render();
        console.error("[Nevux] Error enviando reseña:", err);
      });
  }

  /* ═══════════════════════════════════════════
     RENDER SLIDER DE VIDEO (Widget 15)
  ═══════════════════════════════════════════ */
  function renderSliderVideo(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeSliderVideoConfig(widget.config || {});
    if (!cfg.videos || cfg.videos.length === 0) return;
    mountSliderVideo(widget, cfg);
  }

  function normalizeSliderVideoConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    var videos = Array.isArray(raw.videos) ? raw.videos : [];
    videos = videos
      .filter(function (v) { return v && v.url && String(v.url).trim() !== ""; })
      .map(function (v) {
        return {
          url: String(v.url),
          nombre: v.nombre || "",
          productoId: v.productoId || null,
          productoData: v.productoData || null,
        };
      });

    return {
      titulo: raw.titulo || "",
      subtitulo: raw.subtitulo || "",
      videos: videos,
      posicion: raw.posicion === "antes" ? "antes" : "despues",
      formato: raw.formato === "circulos" ? "circulos" : "slider",
      colorControles: raw.colorControles || "#000000",
      colorTitulo: raw.colorTitulo || "#333333",
      colorFondo: raw.colorFondo || "#fafafa",
      tamanoTitulo: raw.tamanoTitulo || "20px",
      tamanoSubtitulo: raw.tamanoSubtitulo || "16px",
      alineacion: raw.alineacion === "izquierda" ? "izquierda" : (raw.alineacion === "derecha" ? "derecha" : "centrado"),
      reproduccionAutomatica: raw.reproduccionAutomatica === true,
      desactivarExpandir: raw.desactivarExpandir === true,
      productosBajoVideo: raw.productosBajoVideo === true,
      radioBordeVideos: n(raw.radioBordeVideos, 20),
      mostrarPrecio: raw.mostrarPrecio !== false,
      mostrarBotonCarrito: raw.mostrarBotonCarrito !== false,
      colorBotonFondo: raw.colorBotonFondo || "#000000",
      colorBotonTexto: raw.colorBotonTexto || "#ffffff",
      radioBordeBoton: n(raw.radioBordeBoton, 8),
    };
  }

  function parseSubtituloSliderMarkdown(texto) {
    if (!texto) return "";
    var out = escapeHtml(texto);
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/__(.+?)__/g, "<u>$1</u>");
    out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
    out = out.replace(/\n/g, "<br/>");
    return out;
  }

  function formatMoneySliderProducto(precio) {
    if (precio === null || precio === undefined || isNaN(precio)) return "";
    try {
      return "$" + Number(precio).toLocaleString("es-AR", { maximumFractionDigits: 0 });
    } catch (e) {
      return "$" + Math.round(precio);
    }
  }

  function mountSliderVideo(widget, cfg) {
    var uniqueId = NS + "-sv-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (cfg.posicion === "antes") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para slider-video (antes)");
        return;
      }
      if (target.node.parentNode) {
        target.node.parentNode.insertBefore(container, target.node.nextSibling);
      } else {
        return;
      }
    } else {
      var descTarget = findProductDescriptionTarget();
      if (descTarget && descTarget.parentNode) {
        descTarget.parentNode.insertBefore(container, descTarget.nextSibling);
      } else {
        var fallback = findProductTarget("before-button");
        if (!fallback) {
          console.warn("[Nevux] No se encontró target para slider-video (despues)");
          return;
        }
        if (fallback.node.parentNode) {
          fallback.node.parentNode.insertBefore(container, fallback.node.nextSibling);
        } else {
          return;
        }
      }
    }

    container.innerHTML = buildSliderVideoHtml(cfg);
    wireSliderVideoEvents(container, cfg);
    console.log("[Nevux] Slider de video montado. Videos:", cfg.videos.length);
  }

  function buildSliderVideoHtml(cfg) {
    var alignMap = { izquierda: "left", centrado: "center", derecha: "right" };
    var textAlign = alignMap[cfg.alineacion] || "center";
    var mostrarFondo = cfg.posicion === "despues";
    var bgStyle = mostrarFondo ? cfg.colorFondo : "transparent";
    var pad = mostrarFondo ? "20px 16px" : "16px 0";
    var borderRadius = mostrarFondo ? "12px" : "0";

    var tituloHtml = cfg.titulo
      ? '<div class="' + NS + '-sv-titulo" style="font-size:' + cfg.tamanoTitulo + ';color:' + cfg.colorTitulo + ';text-align:' + textAlign + ';">' + escapeHtml(cfg.titulo) + '</div>'
      : "";

    var subtituloHtml = cfg.subtitulo
      ? '<div class="' + NS + '-sv-subtitulo" style="font-size:' + cfg.tamanoSubtitulo + ';color:' + cfg.colorTitulo + ';text-align:' + textAlign + ';">' + parseSubtituloSliderMarkdown(cfg.subtitulo) + '</div>'
      : "";

    var contenidoHtml = cfg.formato === "circulos"
      ? buildSliderVideoCirculosHtml(cfg)
      : buildSliderVideoSliderHtml(cfg);

    return '' +
      '<div class="' + NS + '-sv-wrap" style="background:' + bgStyle + ';padding:' + pad + ';border-radius:' + borderRadius + ';">' +
        tituloHtml +
        subtituloHtml +
        contenidoHtml +
      '</div>';
  }

  function buildSliderVideoSliderHtml(cfg) {
    var cardsHtml = "";
    for (var i = 0; i < cfg.videos.length; i++) {
      cardsHtml += buildSliderVideoCard(cfg.videos[i], i, cfg);
    }

    var arrowsHtml = "";
    if (cfg.videos.length > 1) {
      arrowsHtml =
        '<button type="button" class="' + NS + '-sv-arrow left" data-sv-arrow="prev" style="color:' + cfg.colorControles + ';">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        '</button>' +
        '<button type="button" class="' + NS + '-sv-arrow right" data-sv-arrow="next" style="color:' + cfg.colorControles + ';">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>';
    }

    return '' +
      '<div class="' + NS + '-sv-carousel">' +
        '<div class="' + NS + '-sv-track" data-sv-track>' +
          cardsHtml +
        '</div>' +
        arrowsHtml +
      '</div>';
  }

  function buildSliderVideoCard(video, index, cfg) {
    var autoplay = cfg.reproduccionAutomatica;
    var inline = cfg.desactivarExpandir;

    var videoAttrs = 'preload="metadata" muted playsinline';
    if (autoplay) videoAttrs += ' autoplay loop';
    if (inline) videoAttrs += ' controls';

    var overlayHtml = !inline
      ? '<div class="' + NS + '-sv-play-overlay"><div class="' + NS + '-sv-play-btn">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="#111827"><path d="M8 5v14l11-7z"/></svg>' +
        '</div></div>'
      : "";

    var thumbClass = NS + "-sv-video-thumb" + (inline ? " inline" : "");
    var thumbOnClick = inline
      ? ""
      : ' data-sv-open="' + index + '"';

    var productoCardHtml = "";
    if (cfg.productosBajoVideo && video.productoData) {
      productoCardHtml = buildSliderVideoProductoCard(video, cfg);
    }

    return '' +
      '<div class="' + NS + '-sv-video-card">' +
        '<div class="' + thumbClass + '" style="border-radius:' + cfg.radioBordeVideos + 'px;"' + thumbOnClick + '>' +
          '<video src="' + escapeHtml(video.url) + '" ' + videoAttrs + '></video>' +
          overlayHtml +
        '</div>' +
        productoCardHtml +
      '</div>';
  }

  function buildSliderVideoCirculosHtml(cfg) {
    var circlesHtml = "";
    for (var i = 0; i < cfg.videos.length; i++) {
      var v = cfg.videos[i];
      var gradientBg = 'linear-gradient(135deg, ' + cfg.colorControles + ' 0%, ' + cfg.colorControles + 'aa 100%)';
      circlesHtml +=
        '<div class="' + NS + '-sv-circle" data-sv-open="' + i + '">' +
          '<div class="' + NS + '-sv-circle-ring" style="background:' + gradientBg + ';">' +
            '<div class="' + NS + '-sv-circle-inner">' +
              '<video src="' + escapeHtml(v.url) + '" preload="metadata" muted playsinline></video>' +
              '<div class="' + NS + '-sv-circle-play">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z"/></svg>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    var justifyContent = cfg.videos.length <= 3 ? "center" : "flex-start";

    return '<div class="' + NS + '-sv-circles-row" style="justify-content:' + justifyContent + ';">' + circlesHtml + '</div>';
  }

  function buildSliderVideoProductoCard(video, cfg) {
    var p = video.productoData;
    if (!p) return "";
    var imgSrc = p.image || "";
    var precioHtml = cfg.mostrarPrecio
      ? '<div class="' + NS + '-sv-producto-precio">' + escapeHtml(formatMoneySliderProducto(p.price)) + '</div>'
      : "";

    var imgHtml = imgSrc
      ? '<img class="' + NS + '-sv-producto-img" src="' + escapeHtml(imgSrc) + '" alt=""/>'
      : '<div class="' + NS + '-sv-producto-img"></div>';

    var btnHtml = cfg.mostrarBotonCarrito
      ? '<button type="button" class="' + NS + '-sv-producto-btn" data-sv-buy="' + p.id + '" style="background:' + cfg.colorBotonFondo + ';color:' + cfg.colorBotonTexto + ';border-radius:' + cfg.radioBordeBoton + 'px;padding:8px 12px;font-size:12px;">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.07 15.93 4.52 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"/></svg>' +
          'Agregar' +
        '</button>'
      : "";

    return '' +
      '<div class="' + NS + '-sv-producto-card">' +
        imgHtml +
        '<div class="' + NS + '-sv-producto-info">' +
          '<div class="' + NS + '-sv-producto-nombre">' + escapeHtml(p.name || "") + '</div>' +
          precioHtml +
        '</div>' +
        btnHtml +
      '</div>';
  }

  function wireSliderVideoEvents(container, cfg) {
    // Flechas del slider
    var track = qs("[data-sv-track]", container);
    qsa("[data-sv-arrow]", container).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!track) return;
        var dir = btn.dataset.svArrow === "next" ? 1 : -1;
        var scrollAmount = Math.round(track.clientWidth * 0.85) * dir;
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });

    // Abrir modal (excepto si desactivarExpandir=true)
    if (!cfg.desactivarExpandir) {
      qsa("[data-sv-open]", container).forEach(function (el) {
        el.addEventListener("click", function () {
          var idx = parseInt(el.dataset.svOpen, 10);
          if (!isNaN(idx)) {
            openSliderVideoModal(cfg, idx);
          }
        });
      });
    }

    // Botón "Agregar" del producto asociado
    qsa("[data-sv-buy]", container).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var pid = parseInt(btn.dataset.svBuy, 10);
        if (isNaN(pid)) return;
        handleSliderVideoBuy(pid);
      });
    });
  }

  function handleSliderVideoBuy(prodId) {
    // Si el producto asociado es el mismo de la página, dispara el form nativo
    if (productId && Number(productId) === Number(prodId)) {
      var target = findProductTarget("before-button");
      if (target && target.node) {
        var origForm = target.node.tagName === "FORM"
          ? target.node
          : (target.node.closest ? target.node.closest("form") : null);
        if (origForm) {
          try {
            if (typeof origForm.requestSubmit === "function") {
              origForm.requestSubmit();
            } else {
              origForm.submit();
            }
            return;
          } catch (e) {
            var submitBtn = qs('button[type="submit"], input[type="submit"]', origForm);
            if (submitBtn) { submitBtn.click(); return; }
          }
        }
        if (target.node.click) { target.node.click(); return; }
      }
    }
    // Si es otro producto, redirigir a su ficha
    window.location.href = "/productos/" + prodId;
  }

  function openSliderVideoModal(cfg, startIndex) {
    var existing = qs("#" + NS + "-sv-modal-overlay");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = NS + "-sv-modal-overlay";
    overlay.className = NS + "-sv-modal-overlay";

    var state = { index: startIndex };

    overlay.innerHTML = buildSliderVideoModalHtml(cfg, state);
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("open");
    });

    wireSliderVideoModal(overlay, cfg, state);
  }

  function buildSliderVideoModalHtml(cfg, state) {
    var video = cfg.videos[state.index];
    if (!video) return "";

    var showNav = cfg.videos.length > 1;
    var prevDisabled = state.index === 0 ? " disabled" : "";
    var nextDisabled = state.index === cfg.videos.length - 1 ? " disabled" : "";

    var navHtml = "";
    if (showNav) {
      navHtml =
        '<button type="button" class="' + NS + '-sv-modal-nav prev" data-sv-modal="prev"' + prevDisabled + '>' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        '</button>' +
        '<button type="button" class="' + NS + '-sv-modal-nav next" data-sv-modal="next"' + nextDisabled + '>' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>';
    }

    var ctaHtml = "";
    if (video.productoData) {
      var p = video.productoData;
      var imgHtml = p.image
        ? '<img class="' + NS + '-sv-producto-img" src="' + escapeHtml(p.image) + '" alt=""/>'
        : '<div class="' + NS + '-sv-producto-img"></div>';
      var precioHtml = cfg.mostrarPrecio
        ? '<div class="' + NS + '-sv-producto-precio">' + escapeHtml(formatMoneySliderProducto(p.price)) + '</div>'
        : "";
      var btnHtml = cfg.mostrarBotonCarrito
        ? '<button type="button" class="' + NS + '-sv-producto-btn" data-sv-modal-buy="' + p.id + '" style="background:' + cfg.colorBotonFondo + ';color:' + cfg.colorBotonTexto + ';border-radius:' + cfg.radioBordeBoton + 'px;padding:10px 14px;font-size:13px;">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.07 15.93 4.52 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"/></svg>' +
            'Agregar' +
          '</button>'
        : "";
      ctaHtml =
        '<div class="' + NS + '-sv-modal-cta">' +
          imgHtml +
          '<div class="' + NS + '-sv-producto-info">' +
            '<div class="' + NS + '-sv-producto-nombre">' + escapeHtml(p.name || "") + '</div>' +
            precioHtml +
          '</div>' +
          btnHtml +
        '</div>';
    }

    return '' +
      '<div class="' + NS + '-sv-modal">' +
        '<button type="button" class="' + NS + '-sv-modal-close" data-sv-modal="close">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<div class="' + NS + '-sv-modal-video-wrap">' +
          '<video class="' + NS + '-sv-modal-video" src="' + escapeHtml(video.url) + '" autoplay controls playsinline></video>' +
          navHtml +
        '</div>' +
        ctaHtml +
      '</div>';
  }

  function wireSliderVideoModal(overlay, cfg, state) {
    function render() {
      overlay.innerHTML = buildSliderVideoModalHtml(cfg, state);
      wireSliderVideoModal(overlay, cfg, state);
    }

    function closeModal() {
      var vid = qs("." + NS + "-sv-modal-video", overlay);
      if (vid) { try { vid.pause(); } catch (e) {} }
      overlay.classList.remove("open");
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 250);
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    qsa("[data-sv-modal]", overlay).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var action = btn.dataset.svModal;
        if (action === "close") {
          closeModal();
        } else if (action === "prev" && state.index > 0) {
          state.index--;
          render();
        } else if (action === "next" && state.index < cfg.videos.length - 1) {
          state.index++;
          render();
        }
      });
    });

    qsa("[data-sv-modal-buy]", overlay).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var pid = parseInt(btn.dataset.svModalBuy, 10);
        if (!isNaN(pid)) {
          handleSliderVideoBuy(pid);
        }
      });
    });
  }

})();

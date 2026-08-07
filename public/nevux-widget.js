// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NS = "nevux-widget";

  console.log("[Nevux] v10 loaded");

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
      .${NS}-widget-host {
        position: relative;
        overflow: hidden;
      }
      .${NS}-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 16px;
        overflow: hidden;
        width: 100%;
      }
      .${NS}-bar-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        max-width: 100%;
      }
      .${NS}-bar-title {
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        line-height: 1.3;
        max-width: 100%;
        padding: 0 4px;
      }
      .${NS}-bar-emoji {
        display: inline-block;
        animation: ${NS}-heartbeat 1.6s ease infinite;
        margin-right: 6px;
      }
      .${NS}-bar-clock {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }
      .${NS}-bar-digit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        height: 32px;
        background: #ffffff;
        color: #0f172a;
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 14px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.08);
        position: relative;
        overflow: hidden;
      }
      .${NS}-bar-digit::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 50%;
        background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
        border-radius: 6px 6px 0 0;
        pointer-events: none;
      }
      .${NS}-bar-sep {
        font-size: 15px;
        font-weight: 900;
        opacity: 0.85;
      }
      .${NS}-bar-btn {
        padding: 7px 16px;
        background: #ffffff;
        border: none;
        border-radius: 7px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.06em;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      .${NS}-digit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
        position: relative;
        overflow: hidden;
      }
      .${NS}-digit.bounce {
        animation: ${NS}-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .${NS}-label {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.75;
      }
      .${NS}-unit {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
      }
      .${NS}-sep {
        display: inline-flex;
        flex-direction: column;
        gap: 4px;
        padding-bottom: 14px;
      }
      .${NS}-sep span {
        width: 4px; height: 4px;
        border-radius: 50%;
        opacity: 0.85;
        animation: ${NS}-blink 1s ease infinite;
      }
      .${NS}-retro-digit { display: inline-flex; gap: 2px; }
      .${NS}-retro-cell {
        width: 26px; height: 38px;
        background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%);
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace;
        font-weight: 900;
        position: relative; overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .${NS}-retro-cell::after {
        content: '';
        position: absolute; top: 50%; left: 0; right: 0;
        height: 1px; background: rgba(0,0,0,0.5);
      }
      .${NS}-retro-cell.flip { animation: ${NS}-retroflip 0.3s ease; }
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
        .${NS}-bar {
          flex-direction: row;
          gap: 20px;
        }
        .${NS}-bar-title {
          font-size: 14px;
        }
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
    const cfg = normalizeConfig(widget.config || {});
    const state = { endTime: getInitialEndTime(cfg) };

    const placements = [];
    if (cfg.showAsTopBar && pageType === "home") placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) return;

    placements.forEach(function (p) { mountAt(widget, cfg, p, state); });
  }

  function getInitialEndTime(cfg) {
    if (cfg.endDate) {
      const t = new Date(cfg.endDate).getTime();
      if (t > Date.now()) return t;
      if (cfg.autoRestart) return Date.now() + 15 * 60 * 1000;
      return t;
    }
    return Date.now() + 15 * 60 * 1000;
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
      document.body.appendChild(container);
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

    update(container, cfg, state);

    setInterval(function () {
      const now = Date.now();
      if (state.endTime <= now && cfg.autoRestart) {
        state.endTime = now + 15 * 60 * 1000;
      }
      update(container, cfg, state);
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

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') ||
      qs('.cart-content') || qs('.cart-items') || qs('main') || qs('.container');
  }

  function normalizeConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      title: raw.title != null ? raw.title : "🔥 Oferta",
      subtitle: raw.subtitle != null ? raw.subtitle : "",
      endDate: raw.endDate || "",
      showDays: raw.showDays === true,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart === true,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition || "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style: raw.style === "retro" ? "retro" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      bgType: raw.bgType === "gradient" ? "gradient" : "solid",
      colorWidgetBg: raw.colorWidgetBg || "#1e1e1e",
      colorSubtitleBg: raw.colorSubtitleBg || "#fdc624",
      colorClockBg: raw.colorClockBg || "#ef4444",
      colorTitle: raw.colorTitle || "#ffffff",
      colorSubtitle: raw.colorSubtitle || "#000000",
      colorNumbers: raw.colorNumbers || "#ffffff",
      fontSizeTitle: raw.fontSizeTitle || "16px",
      fontSizeSubtitle: raw.fontSizeSubtitle || "11px",
      fontSizeClock: raw.fontSizeClock || "16px",
      borderRadiusClock: n(raw.borderRadiusClock, 5),
      borderRadiusWidget: n(raw.borderRadiusWidget, 12),
      paddingWidget: n(raw.paddingWidget, 15),
      paddingClock: n(raw.paddingClock, 7),
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

  function update(container, cfg, state) {
    const time = calcTime(state);

    if (time.isFinished && !cfg.autoRestart) {
      container.innerHTML =
        '<div style="background:' + getBg(cfg) + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';color:' + cfg.colorTitle + ';font-weight:700;">' +
        '⏰ ¡La oferta terminó!</div>';
      return;
    }

    const isBar = container.dataset.placement === "topbar";
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
      host.dataset.bar !== String(isBar);

    if (needsRebuild) {
      container.innerHTML = isBar
        ? buildBarHtml(cfg, units, time)
        : buildFullHtml(cfg, units, time);
    } else {
      if (isBar) {
        updateBarDigits(host, units);
      } else {
        units.forEach(function (u) { updateUnit(host, u, cfg); });
      }
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

  function buildBarHtml(cfg, units, time) {
    const bg = cfg.bgType === "gradient"
      ? "linear-gradient(90deg, " + cfg.colorWidgetBg + " 0%, " + cfg.colorSubtitleBg + " 100%)"
      : cfg.colorWidgetBg;

    const split = splitEmoji(cfg.title);
    const fullText = cfg.subtitle
      ? (split.text ? split.text + " — " + cfg.subtitle : cfg.subtitle)
      : split.text;

    let titleHtml = "";
    if (split.emoji || fullText) {
      titleHtml =
        '<div class="' + NS + '-bar-title" style="color:' + cfg.colorTitle + ';">' +
        (split.emoji ? '<span class="' + NS + '-bar-emoji">' + escapeHtml(split.emoji) + '</span>' : "") +
        escapeHtml(fullText) +
        '</div>';
    }

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const val = String(u.v).padStart(2, "0");
      clockInner += '<div class="' + NS + '-bar-digit" data-key="' + u.k + '">' + val + '</div>';
      if (i < units.length - 1) {
        clockInner += '<span class="' + NS + '-bar-sep" style="color:' + cfg.colorTitle + ';">:</span>';
      }
    }

    return '' +
      '<div class="' + NS + '-widget-host ' + NS + '-bar" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="true" style="background:' + bg + ';">' +
      titleHtml +
      '<div class="' + NS + '-bar-row">' +
        '<div class="' + NS + '-bar-clock">' + clockInner + '</div>' +
        '<button class="' + NS + '-bar-btn" style="color:' + cfg.colorWidgetBg + ';" onclick="window.location.href=\'/\'">SHOP NOW</button>' +
      '</div>' +
      '</div>';
  }

  function updateBarDigits(host, units) {
    units.forEach(function (u) {
      const el = qs("." + NS + "-bar-digit[data-key=\"" + u.k + "\"]", host);
      if (!el) return;
      const val = String(u.v).padStart(2, "0");
      if (el.textContent === val) return;
      el.textContent = val;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = NS + "-bounceDigit 0.4s ease";
    });
  }

  function buildFullHtml(cfg, units, time) {
    const bg = getBg(cfg);
    const titleHtml = cfg.title
      ? '<div style="font-size:' + cfg.fontSizeTitle + ';font-weight:700;color:' + cfg.colorTitle + ';margin-bottom:14px;line-height:1.2;text-align:' + cfg.alignment + ';">' + escapeHtml(cfg.title) + '</div>'
      : "";

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      clockInner += renderUnit(units[i], cfg);
      if (i < units.length - 1) clockInner += renderSep(cfg);
    }

    const subtitleHtml = cfg.subtitle
      ? '<div style="margin-bottom:14px;text-align:' + cfg.alignment + ';">' +
          '<span style="display:inline-block;background:' + cfg.colorSubtitleBg + ';color:' + cfg.colorSubtitle + ';font-size:' + cfg.fontSizeSubtitle + ';font-weight:700;padding:4px 10px;border-radius:6px;">' +
            escapeHtml(cfg.subtitle) +
          '</span>' +
        '</div>'
      : "";

    return '' +
      '<div class="' + NS + '-widget-host" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="false" style="background:' + bg + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';">' +
        titleHtml +
        subtitleHtml +
        '<div style="display:flex;align-items:center;justify-content:' + (cfg.alignment === "center" ? "center" : "flex-start") + ';gap:8px;flex-wrap:wrap;">' + clockInner + '</div>' +
      '</div>';
  }

  function renderUnit(u, cfg) {
    const val = String(u.v).padStart(2, "0");
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const labelSize = Math.max(9, Math.round(size * 0.55));
    const labelHtml = cfg.showLabels
      ? '<span class="' + NS + '-label" style="font-size:' + labelSize + 'px;color:' + cfg.colorTitle + ';opacity:0.8;">' + u.l + '</span>'
      : "";

    if (cfg.style === "retro") {
      const chars = val.split("");
      let cells = "";
      for (let i = 0; i < chars.length; i++) {
        cells += '<span class="' + NS + '-retro-cell" style="font-size:' + cfg.fontSizeClock + ';color:' + cfg.colorNumbers + ';">' + chars[i] + '</span>';
      }
      return '<div class="' + NS + '-unit" data-key="' + u.k + '"><div class="' + NS + '-retro-digit" data-value="' + val + '">' + cells + '</div>' + labelHtml + '</div>';
    }

    return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
      '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:' + (size * 2.5) + 'px;min-height:' + (size * 2.5) + 'px;background:' + cfg.colorClockBg + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px ' + (cfg.paddingClock + 2) + 'px;font-size:' + cfg.fontSizeClock + ';line-height:1;">' + val + '</div>' + labelHtml +
    '</div>';
  }

  function renderSep(cfg) {
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const dotSize = Math.max(3, Math.round(size * 0.18));
    const padBottom = cfg.showLabels ? Math.round(size * 0.85) : 0;
    const dot = '<span style="width:' + dotSize + 'px;height:' + dotSize + 'px;background:' + cfg.colorTitle + ';"></span>';
    return '<div class="' + NS + '-sep" style="padding-bottom:' + padBottom + 'px;gap:' + dotSize + 'px;">' + dot + dot + '</div>';
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
    return cfg.bgType === "gradient"
      ? "linear-gradient(135deg, " + cfg.colorWidgetBg + " 0%, " + cfg.colorSubtitleBg + " 100%)"
      : cfg.colorWidgetBg;
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

})();

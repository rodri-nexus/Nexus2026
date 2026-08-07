// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NS = "nevux-widget";

  console.log("[Nevux] v6 loaded");

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function log(...args) {
    if (window.NEVUX_DEBUG) console.log("[Nevux]", ...args);
  }

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
      return {
        emoji: s.substring(0, emojiEnd),
        text: s.substring(emojiEnd).trim(),
      };
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

  function detectPageType() {
    const path = document.location.pathname.toLowerCase().replace(/\/$/, "");
    if (path === "" || path === "/home" || path === "/inicio") return "home";
    if (path.indexOf("/productos/") >= 0 || path.indexOf("/products/") >= 0) return "product";
    if (path.indexOf("/carrito") >= 0 || path.indexOf("/cart") >= 0) return "cart";
    return "other";
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
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .${NS}-bar-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
      .${NS}-digit.vibrate {
        animation: ${NS}-vibrate 0.15s linear infinite;
      }
      .${NS}-digit.neonPulse {
        animation: ${NS}-neonPulse 1s ease infinite;
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
      .${NS}-aura {
        position: absolute;
        inset: -30px;
        border-radius: inherit;
        pointer-events: none;
        filter: blur(24px);
        opacity: 0;
        transition: opacity 0.6s ease, background 0.6s ease;
        z-index: 0;
      }
      .${NS}-aura.on {
        opacity: 0.5;
        animation: ${NS}-auraPulse 2.5s ease infinite;
      }
      .${NS}-noise {
        position: absolute;
        inset: 0;
        opacity: 0.08;
        pointer-events: none;
        mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
      }
      .${NS}-shimmer {
        position: absolute;
        top: -20px; left: -60px;
        width: 60px; height: 200%;
        transform: rotate(15deg);
        pointer-events: none;
        z-index: 2;
      }
      .${NS}-shimmer.run {
        animation: ${NS}-shimmer 1.4s ease-out forwards;
      }
      .${NS}-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%);
        pointer-events: none;
        opacity: 0.3;
      }
      .${NS}-particle {
        position: absolute;
        bottom: 0;
        width: 4px; height: 4px;
        border-radius: 50%;
        animation: ${NS}-particle 2.4s ease infinite;
        pointer-events: none;
      }
      .${NS}-content {
        position: relative;
        z-index: 3;
      }
      .${NS}-progress-track {
        height: 4px;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 12px;
        max-width: 200px;
      }
      .${NS}-progress-bar {
        height: 100%;
        border-radius: 2px;
        transition: width 1s linear;
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
      @keyframes ${NS}-neonPulse {
        0%,100% { opacity: 1; filter: brightness(1); }
        50%     { opacity: 0.9; filter: brightness(1.4); }
      }
      @keyframes ${NS}-blink {
        0%,100% { opacity: 0.85; }
        50%     { opacity: 0.15; }
      }
      @keyframes ${NS}-auraPulse {
        0%,100% { opacity: 0.4; transform: scale(1); }
        50%     { opacity: 0.65; transform: scale(1.06); }
      }
      @keyframes ${NS}-shimmer {
        0%   { transform: translateX(0) rotate(15deg); opacity: 0; }
        20%  { opacity: 1; }
        100% { transform: translateX(600%) rotate(15deg); opacity: 0; }
      }
      @keyframes ${NS}-particle {
        0%   { transform: translateY(0) scale(1); opacity: 0.6; }
        50%  { transform: translateY(-24px) scale(1.2); opacity: 0.3; }
        100% { transform: translateY(-50px) scale(0.6); opacity: 0; }
      }
      @keyframes ${NS}-vibrate {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-1px); }
        75% { transform: translateX(1px); }
      }
      @keyframes ${NS}-vibrateSlow {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
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
        if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
        if (w.widget_slug === "badge-cuotas") renderBadgeCuotas(w);
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

    console.log("[Nevux] placements:", placements);

    if (placements.length === 0) return;

    placements.forEach(function (p) { mountAt(widget, cfg, p, state); });
  }

  function getInitialEndTime(cfg) {
    if (cfg.mode === "flash") {
      return Date.now() + (cfg.flashMinutes || 15) * 60 * 1000;
    }
    if (cfg.endDate) {
      const t = new Date(cfg.endDate).getTime();
      if (t > Date.now()) return t;
      if (cfg.autoRestart) return Date.now() + (cfg.flashMinutes || 15) * 60 * 1000;
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
      if (!target) {
        console.warn("[Nevux] No target producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "cart") {
      const target = findCartTarget();
      if (!target) return;
      target.parentNode.insertBefore(container, target);
    }

    console.log("[Nevux] montado", placement);

    update(container, cfg, state);

    if (cfg.showShimmer) {
      setInterval(function () { triggerShimmer(container); }, 5000);
      setTimeout(function () { triggerShimmer(container); }, 400);
    }

    setInterval(function () {
      const now = Date.now();
      if (state.endTime <= now) {
        if (cfg.autoRestart) {
          state.endTime = now + (cfg.flashMinutes || 15) * 60 * 1000;
        }
      }
      update(container, cfg, state);
    }, 1000);
  }

  function triggerShimmer(container) {
    const sh = qs("." + NS + "-shimmer", container);
    if (!sh) return;
    sh.classList.remove("run");
    void sh.offsetWidth;
    sh.classList.add("run");
  }

  /* ═══════════════════════════════════════════
     TARGETS
  ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     NORMALIZAR CONFIG COUNTDOWN
  ═══════════════════════════════════════════ */
  function normalizeConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    function nf(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      title: raw.title != null ? raw.title : "🔥 Flash Sale",
      subtitle: raw.subtitle != null ? raw.subtitle : "",
      mode: raw.mode === "fixed" ? "fixed" : "flash",
      flashMinutes: n(raw.flashMinutes, 15),
      endDate: raw.endDate || "",
      showDays: raw.showDays === true,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart !== false,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition || "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style:
        raw.style === "retro" ? "retro" :
        raw.style === "glass" ? "glass" :
        raw.style === "neon" ? "neon" :
        raw.style === "flash" ? "flash" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      scale: nf(raw.scale, 1),
      bgType: raw.bgType === "gradient" ? "gradient" : "solid",
      colorWidgetBg: raw.colorWidgetBg || "#DC2626",
      colorSubtitleBg: raw.colorSubtitleBg || "#991B1B",
      colorClockBg: raw.colorClockBg || "#1a1a2e",
      colorTitle: raw.colorTitle || "#ffffff",
      colorSubtitle: raw.colorSubtitle || "#fecaca",
      colorNumbers: raw.colorNumbers || "#ffffff",
      auraEnabled: raw.auraEnabled !== false,
      colorAuraCalm: raw.colorAuraCalm || "#8b5cf6",
      colorAuraMedium: raw.colorAuraMedium || "#f97316",
      colorAuraUrgent: raw.colorAuraUrgent || "#ef4444",
      effectsIntensity: n(raw.effectsIntensity, 80),
      showShimmer: raw.showShimmer !== false,
      showProgressRing: raw.showProgressRing === true,
      showParticles: raw.showParticles !== false,
      showBounce: raw.showBounce !== false,
      showGlowBreath: raw.showGlowBreath !== false,
      showVibration: raw.showVibration !== false,
      fontSizeTitle: raw.fontSizeTitle || "16px",
      fontSizeSubtitle: raw.fontSizeSubtitle || "12px",
      fontSizeClock: raw.fontSizeClock || "22px",
      borderRadiusClock: n(raw.borderRadiusClock, 8),
      borderRadiusWidget: n(raw.borderRadiusWidget, 12),
      paddingWidget: n(raw.paddingWidget, 20),
      paddingClock: n(raw.paddingClock, 8),
    };
  }

  /* ═══════════════════════════════════════════
     CÁLCULOS COUNTDOWN
  ═══════════════════════════════════════════ */
  function calcTime(state) {
    const ms = state.endTime - Date.now();
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isUrgent: false, isFinished: true };
    }
    const t = Math.floor(ms / 1000);
    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isUrgent: t <= 10,
      isFinished: false,
    };
  }

  function getAuraColor(cfg, total) {
    if (!cfg.auraEnabled) return null;
    if (total <= 600) return cfg.colorAuraUrgent;
    if (total <= 3600) return cfg.colorAuraMedium;
    return cfg.colorAuraCalm;
  }

  /* ═══════════════════════════════════════════
     UPDATE COUNTDOWN
  ═══════════════════════════════════════════ */
  function update(container, cfg, state) {
    const time = calcTime(state);

    if (time.isFinished && !cfg.autoRestart) {
      renderFinished(container, cfg);
      return;
    }

    const isBar = container.dataset.placement === "topbar";
    const units = buildUnits(cfg, time);

    if (units.length === 0) {
      container.innerHTML = "";
      return;
    }

    const auraColor = getAuraColor(cfg, time.totalSeconds);
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
        : buildFullHtml(cfg, units, auraColor, time);
    } else {
      if (isBar) {
        updateBarDigits(host, units);
      } else {
        units.forEach(function (u) { updateUnit(host, u, cfg, time); });
        updateAura(container, auraColor, cfg);
        updateProgress(container, cfg, time);
        updateParticles(container, cfg, time);
        updateVibration(container, cfg, time);
      }
    }
  }

  function buildUnits(cfg, time) {
    const arr = [];
    if (cfg.showDays) arr.push({ v: time.days, l: "DÍAS", k: "d" });
    if (cfg.showHours) arr.push({ v: time.hours, l: "HRS", k: "h" });
    if (cfg.showMinutes) arr.push({ v: time.minutes, l: "MIN", k: "m" });
    if (cfg.showSeconds) arr.push({ v: time.seconds, l: "SEG", k: "s" });
    return arr;
  }

  function renderFinished(container, cfg) {
    container.innerHTML =
      '<div style="background:' + getBg(cfg) + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';color:' + cfg.colorTitle + ';font-weight:700;">' +
      '⏰ ¡La oferta terminó!</div>';
  }

  /* ═══════════════════════════════════════════
     BUILD BAR COUNTDOWN
  ═══════════════════════════════════════════ */
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

    const vibrateStyle = time.isUrgent && cfg.showVibration
      ? "animation:" + NS + "-vibrateSlow 0.3s linear infinite;"
      : "";

    const shimmerHtml = cfg.showShimmer
      ? '<div class="' + NS + '-shimmer" style="background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);"></div>'
      : "";

    return '' +
      '<div class="' + NS + '-widget-host ' + NS + '-bar" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="true" style="background:' + bg + ';' + vibrateStyle + '">' +
      shimmerHtml +
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

  /* ═══════════════════════════════════════════
     BUILD FULL COUNTDOWN
  ═══════════════════════════════════════════ */
  function buildFullHtml(cfg, units, auraColor, time) {
    const intensity = cfg.effectsIntensity / 100;
    const bg = cfg.style === "neon" ? "#0a0a1a" : getBg(cfg);

    const border =
      cfg.style === "neon" ? "1px solid " + cfg.colorNumbers + "30" :
      cfg.style === "glass" ? "1px solid rgba(255,255,255,0.2)" : "none";

    const boxShadow =
      cfg.style === "neon" ? "0 0 " + (30 * intensity) + "px " + cfg.colorNumbers + "20, 0 8px 32px rgba(0,0,0,0.3)" :
      cfg.style === "glass" ? "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)" :
      cfg.style === "flash" ? "0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" :
      "0 8px 32px rgba(0,0,0,0.12)";

    const titleHtml = cfg.title
      ? '<div style="font-size:' + cfg.fontSizeTitle + ';font-weight:800;color:' + cfg.colorTitle + ';margin-bottom:' + (cfg.subtitle ? "4px" : "12px") + ';line-height:1.2;letter-spacing:-0.01em;' + (cfg.style === "neon" ? "text-shadow:0 0 10px " + cfg.colorTitle + "60;" : "") + '">' + escapeHtml(cfg.title) + '</div>'
      : "";

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      clockInner += renderUnit(units[i], cfg);
      if (i < units.length - 1) clockInner += renderSep(cfg);
    }

    const subtitleHtml = cfg.subtitle
      ? '<div style="font-size:' + cfg.fontSizeSubtitle + ';font-weight:500;color:' + cfg.colorSubtitle + ';opacity:0.9;margin-top:6px;">' + escapeHtml(cfg.subtitle) + '</div>'
      : "";

    const progressPct = Math.max(5, Math.min(100, (time.totalSeconds / (cfg.flashMinutes * 60 || 900)) * 100));
    const progressHtml = cfg.showProgressRing && !time.isFinished
      ? '<div class="' + NS + '-progress-track" style="background:' + (cfg.style === "neon" ? cfg.colorNumbers + "20" : "rgba(255,255,255,0.2)") + ';' + (cfg.alignment === "center" ? "margin-left:auto;margin-right:auto;" : "") + '"><div class="' + NS + '-progress-bar" style="background:' + (cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.8)") + ';width:' + progressPct + '%;' + (cfg.style === "neon" ? "box-shadow:0 0 8px " + cfg.colorNumbers + ";" : "") + '"></div></div>'
      : "";

    const auraHtml = auraColor
      ? '<div class="' + NS + '-aura on" style="background:radial-gradient(ellipse, ' + auraColor + '66 0%, transparent 70%); opacity:' + (0.5 * intensity) + ';"></div>'
      : '<div class="' + NS + '-aura"></div>';

    const shimmerHtml = cfg.showShimmer
      ? '<div class="' + NS + '-shimmer" style="background:' + (cfg.style === "neon" ? "linear-gradient(90deg,transparent," + cfg.colorNumbers + "20,transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)") + ';"></div>'
      : "";

    let particlesHtml = "";
    if (cfg.showParticles && time.totalSeconds <= 600) {
      for (let i = 0; i < 5; i++) {
        particlesHtml += '<div class="' + NS + '-particle" style="left:' + (15 + i * 18) + '%;animation-delay:' + (i * 0.6) + 's;background:' + (cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.7)") + ';box-shadow:' + (cfg.style === "neon" ? "0 0 6px " + cfg.colorNumbers : "0 0 4px rgba(255,255,255,0.5)") + ';"></div>';
      }
    }

    const vibrateStyle = time.isUrgent && cfg.showVibration
      ? "animation:" + NS + "-vibrateSlow 0.3s linear infinite;"
      : "";

    return '' +
      '<div class="' + NS + '-widget-host" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="false" style="background:' + bg + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';box-shadow:' + boxShadow + ';border:' + border + ';transform:scale(' + cfg.scale + ');transform-origin:top ' + (cfg.alignment === "center" ? "center" : "left") + ';' + vibrateStyle + '">' +
      auraHtml +
      '<div class="' + NS + '-noise" style="opacity:' + (0.08 * intensity) + ';"></div>' +
      shimmerHtml +
      '<div class="' + NS + '-vignette" style="opacity:' + (0.3 * intensity) + ';"></div>' +
      particlesHtml +
      '<div class="' + NS + '-content">' +
        titleHtml +
        '<div style="display:flex;align-items:center;justify-content:' + (cfg.alignment === "center" ? "center" : "flex-start") + ';gap:6px;flex-wrap:wrap;margin-top:8px;' + (cfg.subtitle ? "margin-bottom:10px;" : "") + '">' + clockInner + '</div>' +
        subtitleHtml +
        progressHtml +
      '</div>' +
      '</div>';
  }

  function renderUnit(u, cfg) {
    const val = String(u.v).padStart(2, "0");
    const labelHtml = cfg.showLabels
      ? '<span class="' + NS + '-label" style="font-size:9px;color:' + cfg.colorNumbers + ';' + (cfg.style === "neon" ? "text-shadow:0 0 6px " + cfg.colorNumbers + "60;" : "") + '">' + u.l + '</span>'
      : "";

    if (cfg.style === "retro") {
      const chars = val.split("");
      let cells = "";
      for (let i = 0; i < chars.length; i++) {
        cells += '<span class="' + NS + '-retro-cell" style="font-size:' + cfg.fontSizeClock + ';color:' + cfg.colorNumbers + ';">' + chars[i] + '</span>';
      }
      return '<div class="' + NS + '-unit" data-key="' + u.k + '"><div class="' + NS + '-retro-digit" data-value="' + val + '">' + cells + '</div>' + labelHtml + '</div>';
    }

    if (cfg.style === "flash") {
      return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
        '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:44px;height:44px;background:' + cfg.colorClockBg + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px ' + (cfg.paddingClock + 4) + 'px;font-size:' + cfg.fontSizeClock + ';box-shadow:0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3);">' +
          '<div style="position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,0.15),transparent);pointer-events:none;border-top-left-radius:' + cfg.borderRadiusClock + 'px;border-top-right-radius:' + cfg.borderRadiusClock + 'px;"></div>' +
          val +
        '</div>' + labelHtml +
      '</div>';
    }

    if (cfg.style === "glass") {
      return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
        '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:56px;height:56px;background:rgba(255,255,255,0.15);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px;font-size:' + cfg.fontSizeClock + ';border:1px solid rgba(255,255,255,0.3);box-shadow:0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4);">' +
          '<div style="position:absolute;top:0;left:0;right:0;height:60%;background:linear-gradient(180deg,rgba(255,255,255,0.25),transparent);pointer-events:none;"></div>' +
          val +
        '</div>' + labelHtml +
      '</div>';
    }

    if (cfg.style === "neon") {
      const glow = 10 * (cfg.effectsIntensity / 100);
      return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
        '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:56px;height:56px;background:#0a0a1a;color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px;font-size:' + cfg.fontSizeClock + ';font-family:\'Courier New\',monospace;font-weight:900;border:1px solid ' + cfg.colorNumbers + '40;box-shadow:0 0 ' + glow + 'px ' + cfg.colorNumbers + '30, inset 0 0 ' + glow + 'px ' + cfg.colorNumbers + '10;text-shadow:0 0 ' + glow + 'px ' + cfg.colorNumbers + '80, 0 0 ' + (glow * 2) + 'px ' + cfg.colorNumbers + '40;">' + val + '</div>' + labelHtml +
      '</div>';
    }

    return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
      '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:52px;height:52px;background:' + cfg.colorClockBg + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px;font-size:' + cfg.fontSizeClock + ';box-shadow:0 4px 12px rgba(0,0,0,0.15);">' + val + '</div>' + labelHtml +
    '</div>';
  }

  function renderSep(cfg) {
    const shadow = cfg.style === "neon" ? "box-shadow:0 0 4px " + cfg.colorNumbers + ";" : "";
    const dot = '<span style="background:' + cfg.colorNumbers + ';' + shadow + '"></span>';
    return '<div class="' + NS + '-sep">' + dot + dot + '</div>';
  }

  function updateUnit(host, u, cfg, time) {
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

    const overlay = digit.querySelector('div[style*="linear-gradient"]');
    if (overlay) {
      digit.innerHTML = overlay.outerHTML + val;
    } else {
      digit.textContent = val;
    }

    digit.classList.remove("bounce");
    if (cfg.showBounce) {
      void digit.offsetWidth;
      digit.classList.add("bounce");
    }

    digit.classList.remove("vibrate", "neonPulse");
    if (time.isUrgent) {
      if (cfg.style === "neon") digit.classList.add("neonPulse");
      if (cfg.showVibration) digit.classList.add("vibrate");
    }
  }

  function updateAura(container, auraColor, cfg) {
    const aura = qs("." + NS + "-aura", container);
    if (!aura) return;
    if (auraColor) {
      const intensity = cfg.effectsIntensity / 100;
      aura.style.background = "radial-gradient(ellipse, " + auraColor + "66 0%, transparent 70%)";
      aura.style.opacity = String(0.5 * intensity);
      aura.classList.add("on");
    } else {
      aura.classList.remove("on");
      aura.style.opacity = "0";
    }
  }

  function updateProgress(container, cfg, time) {
    const bar = qs("." + NS + "-progress-bar", container);
    if (!bar) return;
    const pct = Math.max(5, Math.min(100, (time.totalSeconds / (cfg.flashMinutes * 60 || 900)) * 100));
    bar.style.width = pct + "%";
  }

  function updateParticles(container, cfg, time) {
    const existing = qsa("." + NS + "-particle", container);
    const should = cfg.showParticles && time.totalSeconds <= 600;
    if (should && existing.length === 0) {
      const host = qs("." + NS + "-widget-host", container);
      if (!host) return;
      for (let i = 0; i < 5; i++) {
        const p = document.createElement("div");
        p.className = NS + "-particle";
        p.style.cssText = "left:" + (15 + i * 18) + "%;animation-delay:" + (i * 0.6) + "s;background:" + (cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.7)") + ";box-shadow:" + (cfg.style === "neon" ? "0 0 6px " + cfg.colorNumbers : "0 0 4px rgba(255,255,255,0.5)") + ";";
        host.appendChild(p);
      }
    } else if (!should && existing.length > 0) {
      existing.forEach(function (p) { p.remove(); });
    }
  }

  function updateVibration(container, cfg, time) {
    const host = qs("." + NS + "-widget-host", container);
    if (!host) return;
    if (time.isUrgent && cfg.showVibration) {
      host.style.animation = NS + "-vibrateSlow 0.3s linear infinite";
    } else {
      host.style.animation = "";
    }
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
    var cfg = normalizeBadgeCuotasConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeAt(widget, cfg, "product");
    }
    if (cfg.mostrarEnCarrito && pageType === "cart") {
      mountBadgeAt(widget, cfg, "cart");
    }
  }

  function normalizeBadgeCuotasConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      cuotas: n(raw.cuotas, 3),
      interes: raw.interes === "con_interes" ? "con_interes" : "sin_interes",
      porcentaje_interes: n(raw.porcentaje_interes, 0),
      texto_principal: raw.texto_principal || "{cuotas} cuotas sin interés",
      texto_secundario: raw.texto_secundario || "¡Sin recargo!",
      mostrarIcono: raw.mostrarIcono !== false,
      icono: raw.icono || "💳",
      estilo: raw.estilo || "moderno",
      colorFondo: raw.colorFondo || "#ffffff",
      colorTexto: raw.colorTexto || "#1a1a2e",
      colorAcento: raw.colorAcento || "#6366f1",
      colorBorde: raw.colorBorde || "#e5e7eb",
      borderRadius: n(raw.borderRadius, 10),
      paddingWidget: n(raw.paddingWidget, 14),
      fontSize: raw.fontSize || "15px",
      fontSizeSecundario: raw.fontSizeSecundario || "12px",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnCarrito: raw.mostrarEnCarrito === true,
      posicion: raw.posicion || "before-button",
      animacion: raw.animacion === true,
    };
  }

  function mountBadgeAt(widget, cfg, placement) {
    var uniqueId = NS + "-badge-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget(cfg.posicion === "before-title" ? "before-title" : "before-button");
      if (!target) {
        console.warn("[Nevux] No target para badge en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "cart") {
      var cartTarget = findCartTarget();
      if (!cartTarget) return;
      cartTarget.parentNode.insertBefore(container, cartTarget);
    }

    container.innerHTML = buildBadgeHtml(cfg);
    console.log("[Nevux] Badge cuotas montado en", placement);
  }

  function buildBadgeHtml(cfg) {
    var texto = cfg.texto_principal.replace("{cuotas}", String(cfg.cuotas));
    var sinInteres = cfg.interes === "sin_interes";
    var iconHtml = cfg.mostrarIcono
      ? '<span style="font-size:20px;flex-shrink:0;">' + escapeHtml(cfg.icono) + '</span>'
      : "";

    if (cfg.estilo === "moderno") {
      return '' +
        '<div style="padding:' + cfg.paddingWidget + 'px;background:' + cfg.colorFondo + ';border-radius:' + cfg.borderRadius + 'px;border:2px solid ' + cfg.colorAcento + '44;box-shadow:0 4px 16px ' + cfg.colorAcento + '22;position:relative;overflow:hidden;margin:8px 0;">' +
          '<div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:' + cfg.colorAcento + ';border-radius:' + cfg.borderRadius + 'px 0 0 ' + cfg.borderRadius + 'px;"></div>' +
          '<div style="padding-left:12px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              iconHtml +
              '<div style="font-size:' + cfg.fontSize + ';font-weight:800;color:' + cfg.colorTexto + ';">' + escapeHtml(texto) + '</div>' +
            '</div>' +
            (sinInteres ? '<div style="margin-top:4px;display:inline-block;padding:2px 8px;background:' + cfg.colorAcento + '22;border-radius:4px;font-size:' + cfg.fontSizeSecundario + ';font-weight:700;color:' + cfg.colorAcento + ';">' + escapeHtml(cfg.texto_secundario) + '</div>' : '') +
          '</div>' +
        '</div>';
    }

    if (cfg.estilo === "destacado") {
      return '' +
        '<div style="padding:' + cfg.paddingWidget + 'px;background:' + cfg.colorAcento + ';border-radius:' + cfg.borderRadius + 'px;box-shadow:0 6px 20px ' + cfg.colorAcento + '44;text-align:center;position:relative;overflow:hidden;margin:8px 0;">' +
          '<div style="position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,0.15),transparent);pointer-events:none;"></div>' +
          (cfg.mostrarIcono ? '<div style="font-size:22px;margin-bottom:4px;">' + escapeHtml(cfg.icono) + '</div>' : '') +
          '<div style="font-size:' + cfg.fontSize + ';font-weight:800;color:#ffffff;">' + escapeHtml(texto) + '</div>' +
          (sinInteres ? '<div style="margin-top:4px;font-size:' + cfg.fontSizeSecundario + ';font-weight:700;color:rgba(255,255,255,0.85);">' + escapeHtml(cfg.texto_secundario) + '</div>' : '') +
        '</div>';
    }

    if (cfg.estilo === "minimal") {
      return '' +
        '<div style="display:flex;align-items:center;gap:8px;padding:' + (cfg.paddingWidget - 4) + 'px ' + cfg.paddingWidget + 'px;background:' + cfg.colorFondo + ';border-radius:' + cfg.borderRadius + 'px;border-bottom:2px solid ' + cfg.colorAcento + ';margin:8px 0;">' +
          iconHtml +
          '<span style="font-size:' + cfg.fontSize + ';font-weight:700;color:' + cfg.colorTexto + ';">' + escapeHtml(texto) + '</span>' +
          (sinInteres ? '<span style="font-size:' + cfg.fontSizeSecundario + ';color:' + cfg.colorAcento + ';font-weight:600;">· ' + escapeHtml(cfg.texto_secundario) + '</span>' : '') +
        '</div>';
    }

    return '' +
      '<div style="display:inline-flex;align-items:center;gap:10px;padding:' + cfg.paddingWidget + 'px ' + (cfg.paddingWidget + 8) + 'px;background:' + cfg.colorFondo + ';border-radius:' + cfg.borderRadius + 'px;border:1.5px solid ' + cfg.colorBorde + ';box-shadow:0 2px 8px rgba(0,0,0,0.08);margin:8px 0;">' +
        iconHtml +
        '<div>' +
          '<div style="font-size:' + cfg.fontSize + ';font-weight:800;color:' + cfg.colorTexto + ';line-height:1.2;">' + escapeHtml(texto) + '</div>' +
          (sinInteres ? '<div style="font-size:' + cfg.fontSizeSecundario + ';font-weight:600;color:' + cfg.colorAcento + ';margin-top:2px;">' + escapeHtml(cfg.texto_secundario) + '</div>' : '') +
        '</div>' +
      '</div>';
  }

})();

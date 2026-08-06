// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NS = "nevux-widget";

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function log(...args) {
    if (window.NEVUX_DEBUG) console.log("[Nevux]", ...args);
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
    if (path.includes("/productos/") || path.includes("/products/")) return "product";
    if (path.includes("/carrito") || path.includes("/cart")) return "cart";
    return "other";
  }

  /* ═══════════════════════════════════════════
     ESTILOS GLOBALES + KEYFRAMES
  ═══════════════════════════════════════════ */
  function injectGlobalStyles() {
    if (qs(`#${NS}-styles`)) return;
    const style = document.createElement("style");
    style.id = `${NS}-styles`;
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
      /* ═══ ANNOUNCEMENT BAR (2 líneas responsive) ═══ */
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
        flex-wrap: nowrap;
      }
      .${NS}-bar-title {
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
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
        min-width: 32px;
        height: 30px;
        background: #ffffff;
        color: #0f172a;
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 14px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1);
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
        padding: 6px 14px;
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
      /* ═══ FULL WIDGET (product/cart) ═══ */
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
      /* Keyframes */
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
      /* Desktop: 1 sola línea */
      @media (min-width: 700px) {
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

  log("storeId:", storeId, "productId:", productId, "pageType:", pageType);

  if (!storeId) {
    console.warn("[Nevux] No se pudo detectar store_id");
    return;
  }

  injectGlobalStyles();

  const url = `${API_BASE}/api/widget-render?store_id=${storeId}${
    productId ? `&product_id=${productId}` : ""
  }`;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      if (!data.widgets || data.widgets.length === 0) return;
      data.widgets.forEach((w) => {
        if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
      });
    })
    .catch((err) => console.error("[Nevux] Error cargando widgets:", err));

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

    placements.forEach((p) => mountAt(widget, cfg, p, state));
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
    const uniqueId = `${NS}-${widget.id}-${placement}`;
    if (qs(`#${uniqueId}`)) return;

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = `${NS}-root`;
    container.dataset.placement = placement;

    if (placement === "topbar") {
      container.classList.add(`${NS}-topbar`);
      document.body.appendChild(container);
      requestAnimationFrame(() => {
        const h = container.offsetHeight;
        if (h > 0) {
          const prev = parseInt(document.body.style.paddingTop || "0", 10);
          document.body.style.paddingTop = prev + h + "px";
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

    if (cfg.showShimmer) {
      setInterval(() => triggerShimmer(container), 5000);
      setTimeout(() => triggerShimmer(container), 400);
    }

    setInterval(() => {
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
    const sh = qs(`.${NS}-shimmer`, container);
    if (!sh) return;
    sh.classList.remove("run");
    void sh.offsetWidth;
    sh.classList.add("run");
  }

  /* ═══════════════════════════════════════════
     TARGETS EN EL THEME
  ═══════════════════════════════════════════ */
  function findProductTarget(position) {
    if (position === "before-title") {
      const sel = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
      for (const s of sel) {
        const el = qs(s);
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
    for (const s of btnSel) {
      const el = qs(s);
      if (el) return { node: el.closest("form") || el };
    }
    const btns = qsa("button");
    for (const b of btns) {
      const t = (b.textContent || "").toLowerCase();
      if (t.includes("agregar al carrito") || t.includes("añadir al carrito") || t.includes("comprar ahora")) {
        return { node: b.closest("form") || b };
      }
    }
    return null;
  }

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') ||
      qs('.cart-content') || qs('.cart-items') || qs('main') || qs('.container');
  }

  /* ═══════════════════════════════════════════
     NORMALIZAR CONFIG
  ═══════════════════════════════════════════ */
  function normalizeConfig(raw) {
    const n = (v, fb) => {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    };
    const nf = (v, fb) => {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    };
    return {
      title: raw.title ?? "🔥 Flash Sale",
      subtitle: raw.subtitle ?? "",
      mode: raw.mode === "fixed" ? "fixed" : "flash",
      flashMinutes: n(raw.flashMinutes, 15),
      endDate: raw.endDate ?? "",
      showDays: raw.showDays === true,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart !== false,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition ?? "before-button",
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
      colorWidgetBg: raw.colorWidgetBg ?? "#DC2626",
      colorSubtitleBg: raw.colorSubtitleBg ?? "#991B1B",
      colorClockBg: raw.colorClockBg ?? "#1a1a2e",
      colorTitle: raw.colorTitle ?? "#ffffff",
      colorSubtitle: raw.colorSubtitle ?? "#fecaca",
      colorNumbers: raw.colorNumbers ?? "#ffffff",
      auraEnabled: raw.auraEnabled !== false,
      colorAuraCalm: raw.colorAuraCalm ?? "#8b5cf6",
      colorAuraMedium: raw.colorAuraMedium ?? "#f97316",
      colorAuraUrgent: raw.colorAuraUrgent ?? "#ef4444",
      effectsIntensity: n(raw.effectsIntensity, 80),
      showShimmer: raw.showShimmer !== false,
      showProgressRing: raw.showProgressRing === true,
      showParticles: raw.showParticles !== false,
      showBounce: raw.showBounce !== false,
      showGlowBreath: raw.showGlowBreath !== false,
      showVibration: raw.showVibration !== false,
      fontSizeTitle: raw.fontSizeTitle ?? "16px",
      fontSizeSubtitle: raw.fontSizeSubtitle ?? "12px",
      fontSizeClock: raw.fontSizeClock ?? "22px",
      borderRadiusClock: n(raw.borderRadiusClock, 8),
      borderRadiusWidget: n(raw.borderRadiusWidget, 12),
      paddingWidget: n(raw.paddingWidget, 20),
      paddingClock: n(raw.paddingClock, 8),
    };
  }

  /* ═══════════════════════════════════════════
     CÁLCULOS
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
     UPDATE
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
    const keys = units.map((u) => u.k).join(",");
    let host = qs(`.${NS}-widget-host`, container);

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
        units.forEach((u) => updateUnit(host, u, cfg, time));
        updateAura(container, auraColor, cfg);
        updateProgress(container, cfg, time);
        updateParticles(container, cfg, time);
        updateVibration(container, cfg, time);
      }
    }
  }

  function buildUnits(cfg, time) {
    return [
      ...(cfg.showDays ? [{ v: time.days, l: "DÍAS", k: "d" }] : []),
      ...(cfg.showHours ? [{ v: time.hours, l: "HRS", k: "h" }] : []),
      ...(cfg.showMinutes ? [{ v: time.minutes, l: "MIN", k: "m" }] : []),
      ...(cfg.showSeconds ? [{ v: time.seconds, l: "SEG", k: "s" }] : []),
    ];
  }

  function renderFinished(container, cfg) {
    container.innerHTML = `
      <div style="
        background:${getBg(cfg)};
        border-radius:${cfg.borderRadiusWidget}px;
        padding:${cfg.paddingWidget}px;
        text-align:${cfg.alignment};
        color:${cfg.colorTitle};
        font-weight:700;
      ">⏰ ¡La oferta terminó!</div>
    `;
  }

  /* ═══════════════════════════════════════════
     BUILD BAR (announcement 2 líneas)
  ═══════════════════════════════════════════ */
  function buildBarHtml(cfg, units, time) {
    const bg = cfg.bgType === "gradient"
      ? `linear-gradient(90deg, ${cfg.colorWidgetBg} 0%, ${cfg.colorSubtitleBg} 100%)`
      : cfg.colorWidgetBg;

    // Separar emoji del título
    const trimmed = (cfg.title || "").trim();
    const emojiMatch = trimmed.match(/^(\p{Emoji}+)\s*(.*)$/u);
    const emoji = emojiMatch ? emojiMatch[1] : "";
    const restTitle = emojiMatch ? emojiMatch[2] : trimmed;
    const fullTitle = cfg.subtitle
      ? `${restTitle} — ${cfg.subtitle}`
      : restTitle;

    const titleHtml = trimmed ? `
      <div class="${NS}-bar-title" style="color:${cfg.colorTitle};">
        ${emoji ? `<span class="${NS}-bar-emoji">${emoji}</span>` : ""}
        ${escapeHtml(fullTitle)}
      </div>` : "";

    let clockInner = "";
    units.forEach((u, i) => {
      const val = String(u.v).padStart(2, "0");
      clockInner += `<div class="${NS}-bar-digit" data-key="${u.k}">${val}</div>`;
      if (i < units.length - 1) {
        clockInner += `<span class="${NS}-bar-sep" style="color:${cfg.colorTitle};">:</span>`;
      }
    });

    const vibrateStyle = time.isUrgent && cfg.showVibration
      ? `animation:${NS}-vibrateSlow 0.3s linear infinite;`
      : "";

    const shimmerHtml = cfg.showShimmer
      ? `<div class="${NS}-shimmer" style="background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);"></div>`
      : "";

    return `
      <div class="${NS}-widget-host ${NS}-bar"
        data-style="${cfg.style}"
        data-keys="${units.map(u=>u.k).join(",")}"
        data-bar="true"
        style="background:${bg}; ${vibrateStyle}">
        ${shimmerHtml}
        ${titleHtml}
        <div class="${NS}-bar-row">
          <div class="${NS}-bar-clock">${clockInner}</div>
          <button class="${NS}-bar-btn" style="color:${cfg.colorWidgetBg};" onclick="window.location.href='/'">
            SHOP NOW
          </button>
        </div>
      </div>
    `;
  }

  function updateBarDigits(host, units) {
    units.forEach((u) => {
      const el = qs(`.${NS}-bar-digit[data-key="${u.k}"]`, host);
      if (!el) return;
      const val = String(u.v).padStart(2, "0");
      if (el.textContent === val) return;
      el.textContent = val;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = `${NS}-bounceDigit 0.4s ease`;
    });
  }

  /* ═══════════════════════════════════════════
     BUILD FULL (product / cart)
  ═══════════════════════════════════════════ */
  function buildFullHtml(cfg, units, auraColor, 

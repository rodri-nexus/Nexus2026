// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NEVUX_NS = "nevux-widget";

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
    if (qs(`#${NEVUX_NS}-styles`)) return;
    const style = document.createElement("style");
    style.id = `${NEVUX_NS}-styles`;
    style.textContent = `
      .${NEVUX_NS}-root, .${NEVUX_NS}-root * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${NEVUX_NS}-root {
        margin: 12px 0;
        line-height: 1.3;
      }
      .${NEVUX_NS}-topbar {
        position: fixed !important;
        top: 0; left: 0; right: 0;
        z-index: 999999;
        margin: 0 !important;
        border-radius: 0 !important;
      }
      .${NEVUX_NS}-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .${NEVUX_NS}-digit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
        transition: transform 0.2s ease, box-shadow 0.4s ease, text-shadow 0.4s ease;
      }
      .${NEVUX_NS}-digit.flip { animation: ${NEVUX_NS}-flip 0.3s ease; }
      .${NEVUX_NS}-digit.urgent { animation: ${NEVUX_NS}-pulse 0.8s ease infinite; }
      .${NEVUX_NS}-digit.neonUrgent { animation: ${NEVUX_NS}-neonPulse 1s ease infinite; }
      .${NEVUX_NS}-label {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.75;
      }
      .${NEVUX_NS}-sep {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-bottom: 14px;
      }
      .${NEVUX_NS}-sep span {
        width: 4px; height: 4px;
        border-radius: 50%;
        opacity: 0.7;
        animation: ${NEVUX_NS}-blink 1s ease infinite;
      }
      .${NEVUX_NS}-retro-digit { display: inline-flex; gap: 2px; }
      .${NEVUX_NS}-retro-cell {
        width: 26px; height: 38px;
        background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%);
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace;
        font-weight: 900;
        position: relative; overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .${NEVUX_NS}-retro-cell::after {
        content: '';
        position: absolute; top: 50%; left: 0; right: 0;
        height: 1px; background: rgba(0,0,0,0.5);
      }
      .${NEVUX_NS}-retro-cell.flip { animation: ${NEVUX_NS}-retroflip 0.3s ease; }
      .${NEVUX_NS}-finished {
        text-align: center; padding: 14px; font-weight: 700;
      }
      .${NEVUX_NS}-aura {
        position: absolute;
        inset: -20px;
        border-radius: inherit;
        pointer-events: none;
        filter: blur(20px);
        opacity: 0;
        transition: opacity 0.6s ease, background 0.6s ease;
        z-index: -1;
      }
      .${NEVUX_NS}-aura.on { opacity: 0.55; animation: ${NEVUX_NS}-auraPulse 2.5s ease infinite; }
      .${NEVUX_NS}-shimmer {
        position: absolute;
        top: -20px; left: -60px;
        width: 60px; height: 200%;
        transform: rotate(15deg);
        pointer-events: none;
      }
      .${NEVUX_NS}-shimmer.run {
        animation: ${NEVUX_NS}-shimmerSlide 1.2s ease-out forwards;
      }
      .${NEVUX_NS}-particle {
        position: absolute;
        bottom: 0;
        width: 4px; height: 4px;
        border-radius: 50%;
        animation: ${NEVUX_NS}-particleFloat 2.4s ease infinite;
        pointer-events: none;
      }
      .${NEVUX_NS}-progress-track {
        height: 4px;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 14px;
      }
      .${NEVUX_NS}-progress-bar {
        height: 100%;
        border-radius: 2px;
        transition: width 1s linear;
      }
      @keyframes ${NEVUX_NS}-flip {
        0% { transform: rotateX(0deg); opacity: 1; }
        40% { transform: rotateX(-90deg); opacity: 0.4; }
        60% { transform: rotateX(90deg); opacity: 0.4; }
        100% { transform: rotateX(0deg); opacity: 1; }
      }
      @keyframes ${NEVUX_NS}-retroflip {
        0% { transform: scaleY(1); opacity: 1; }
        40% { transform: scaleY(0); opacity: 0.5; }
        60% { transform: scaleY(0); opacity: 0.5; }
        100% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes ${NEVUX_NS}-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(239,68,68,0.4); }
        50% { transform: scale(1.05); box-shadow: 0 0 22px rgba(239,68,68,0.8); }
      }
      @keyframes ${NEVUX_NS}-neonPulse {
        0%, 100% { opacity: 1; filter: brightness(1); }
        50% { opacity: 0.85; filter: brightness(1.3); }
      }
      @keyframes ${NEVUX_NS}-blink {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.15; }
      }
      @keyframes ${NEVUX_NS}-auraPulse {
        0%, 100% { opacity: 0.35; transform: scale(1); }
        50% { opacity: 0.55; transform: scale(1.06); }
      }
      @keyframes ${NEVUX_NS}-shimmerSlide {
        0% { transform: translateX(0) rotate(15deg); }
        100% { transform: translateX(600%) rotate(15deg); }
      }
      @keyframes ${NEVUX_NS}-particleFloat {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-20px) scale(1.2); opacity: 0.3; }
        100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
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
      if (!data.widgets || data.widgets.length === 0) {
        log("No hay widgets activos");
        return;
      }
      log("Widgets recibidos:", data.widgets.length);
      data.widgets.forEach((w) => {
        if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
      });
    })
    .catch((err) => console.error("[Nevux] Error cargando widgets:", err));

  /* ═══════════════════════════════════════════
     RENDER COUNTDOWN
     LÓGICA DE UBICACIÓN (estricta):
     - TOPBAR   → SOLO en home
     - PRODUCTO → SOLO en ficha de producto
     - CARRITO  → SOLO en carrito
  ═══════════════════════════════════════════ */
  function renderCountdown(widget) {
    const cfg = normalizeConfig(widget.config || {});

    const placements = [];
    if (cfg.showAsTopBar && pageType === "home") placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) return;

    placements.forEach((placement) => mountCountdownAt(widget, cfg, placement));
  }

  function mountCountdownAt(widget, cfg, placement) {
    const uniqueId = `${NEVUX_NS}-${widget.id}-${placement}`;
    if (qs(`#${uniqueId}`)) return;

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = `${NEVUX_NS}-root`;
    // Marcador de placement para render compacto en topbar
    container.dataset.placement = placement;

    if (placement === "topbar") {
      container.classList.add(`${NEVUX_NS}-topbar`);
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

    updateCountdown(container, cfg);
    let shimmerInt = null;
    if (cfg.showShimmer) {
      shimmerInt = setInterval(() => triggerShimmer(container), 5000);
    }
    const interval = setInterval(() => {
      const finished = updateCountdown(container, cfg);
      if (finished && !cfg.autoRestart) {
        clearInterval(interval);
        if (shimmerInt) clearInterval(shimmerInt);
      }
    }, 1000);
  }

  function triggerShimmer(container) {
    const sh = qs(`.${NEVUX_NS}-shimmer`, container);
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
      const titleSelectors = [
        'h1.product-name',
        'h1[itemprop="name"]',
        '.product-name',
        '.js-product-name',
        '.product-title',
        'h1',
      ];
      for (const sel of titleSelectors) {
        const el = qs(sel);
        if (el) return { node: el };
      }
    }

    const btnSelectors = [
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
    for (const sel of btnSelectors) {
      const el = qs(sel);
      if (el) return { node: el.closest("form") || el };
    }

    const allButtons = qsa("button");
    for (const btn of allButtons) {
      const txt = (btn.textContent || "").toLowerCase();
      if (
        txt.includes("agregar al carrito") ||
        txt.includes("añadir al carrito") ||
        txt.includes("comprar ahora") ||
        (txt.includes("añadir") && txt.includes("carrito"))
      ) {
        return { node: btn.closest("form") || btn };
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
    return {
      title: raw.title ?? "⚡ Oferta por tiempo limitado",
      subtitle: raw.subtitle ?? "",
      endDate: raw.endDate ?? "",
      showDays: raw.showDays === true,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart === true,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition ?? "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style:
        raw.style === "retro" ? "retro" :
        raw.style === "glass" ? "glass" :
        raw.style === "neon" ? "neon" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      bgType: raw.bgType === "solid" ? "solid" : "gradient",
      colorWidgetBg: raw.colorWidgetBg ?? "#667eea",
      colorSubtitleBg: raw.colorSubtitleBg ?? "#764ba2",
      colorClockBg: raw.colorClockBg ?? "#ffffff",
      colorTitle: raw.colorTitle ?? "#ffffff",
      colorSubtitle: raw.colorSubtitle ?? "#ffffff",
      colorNumbers: raw.colorNumbers ?? "#1a1a2e",
      auraEnabled: raw.auraEnabled !== false,
      colorAuraCalm: raw.colorAuraCalm ?? "#8b5cf6",
      colorAuraMedium: raw.colorAuraMedium ?? "#f97316",
      colorAuraUrgent: raw.colorAuraUrgent ?? "#ef4444",
      showShimmer: raw.showShimmer !== false,
      showProgressRing: raw.showProgressRing === true,
      showParticles: raw.showParticles !== false,
      fontSizeTitle: raw.fontSizeTitle ?? "20px",
      fontSizeSubtitle: raw.fontSizeSubtitle ?? "13px",
      fontSizeClock: raw.fontSizeClock ?? "22px",
      borderRadiusClock: n(raw.borderRadiusClock, 12),
      borderRadiusWidget: n(raw.borderRadiusWidget, 20),
      paddingWidget: n(raw.paddingWidget, 24),
      paddingClock: n(raw.paddingClock, 10),
    };
  }

  /* ═══════════════════════════════════════════
     UPDATE / RENDER
  ═══════════════════════════════════════════ */
  function updateCountdown(container, cfg) {
    const diff = calcDiff(cfg);
    if (diff.finished) {
      if (cfg.autoRestart) {
        const newEnd = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        cfg.endDate = newEnd;
        return false;
      }
      renderFinished(container, cfg);
      return true;
    }
    renderClock(container, cfg, diff);
    return false;
  }

  function calcDiff(cfg) {
    if (!cfg.endDate) {
      return {
        finished: false, days: 0, hours: 0, minutes: 15, seconds: 42,
        totalSeconds: 942, urgent: false,
      };
    }
    const ms = new Date(cfg.endDate).getTime() - Date.now();
    if (ms <= 0) {
      return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, urgent: false };
    }
    const t = Math.floor(ms / 1000);
    return {
      finished: false,
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      urgent: t <= 10,
    };
  }

  /* ═══════════════════════════════════════════
     AURA
  ═══════════════════════════════════════════ */
  function getAuraColor(cfg, totalSeconds) {
    if (!cfg.auraEnabled) return null;
    if (totalSeconds <= 600) return cfg.colorAuraUrgent;
    if (totalSeconds <= 3600) return cfg.colorAuraMedium;
    return cfg.colorAuraCalm;
  }

  /* ═══════════════════════════════════════════
     RENDER FINISHED
  ═══════════════════════════════════════════ */
  function renderFinished(container, cfg) {
    container.innerHTML = `
      <div style="
        background:${getBg(cfg)};
        border-radius:${cfg.borderRadiusWidget}px;
        padding:${cfg.paddingWidget}px;
        text-align:${cfg.alignment};
      ">
        <div class="${NEVUX_NS}-finished" style="color:${cfg.colorTitle};font-size:${cfg.fontSizeTitle};">
          ⏰ ¡La oferta terminó!
        </div>
      </div>
    `;
  }

  /* ═══════════════════════════════════════════
     RENDER CLOCK
  ═══════════════════════════════════════════ */
  function renderClock(container, cfg, diff) {
    const compact = container.dataset.placement === "topbar";

    const units = [
      ...(cfg.showDays ? [{ v: diff.days, l: "DÍAS", k: "d" }] : []),
      ...(cfg.showHours ? [{ v: diff.hours, l: "HRS", k: "h" }] : []),
      ...(cfg.showMinutes ? [{ v: diff.minutes, l: "MIN", k: "m" }] : []),
      ...(cfg.showSeconds ? [{ v: diff.seconds, l: "SEG", k: "s" }] : []),
    ];

    if (units.length === 0) {
      container.innerHTML = "";
      return;
    }

    const auraColor = getAuraColor(cfg, diff.totalSeconds);
    const currentKeys = units.map((u) => u.k).join(",");
    let host = qs(`.${NEVUX_NS}-widget-host`, container);

    const needsRebuild =
      !host ||
      host.dataset.style !== cfg.style ||
      host.dataset.keys !== currentKeys ||
      host.dataset.compact !== String(compact);

    if (needsRebuild) {
      container.innerHTML = buildWidgetHtml(cfg, units, auraColor, diff, compact);
      // Trigger shimmer inicial una vez montado
      if (cfg.showShimmer) {
        setTimeout(() => triggerShimmer(container), 300);
      }
    } else {
      // Solo actualizar valores + refrescar aura + progreso + partículas
      units.forEach((u) => updateUnit(host, u, cfg));
      updateAura(container, auraColor);
      updateProgress(container, cfg, diff);
      updateParticles(container, cfg, diff);
    }
  }

  function buildWidgetHtml(cfg, units, auraColor, diff, compact) {
    const bg = cfg.style === "neon" ? "#0a0a1a" : getBg(cfg);
    const paddingW = compact ? Math.max(10, cfg.paddingWidget - 10) : cfg.paddingWidget;
    const radiusW = compact ? 0 : cfg.borderRadiusWidget;

    const boxShadow =
      cfg.style === "neon"
        ? `0 0 30px ${cfg.colorNumbers}20, 0 8px 32px rgba(0,0,0,0.3)`
        : cfg.style === "glass"
        ? "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)"
        : "0 8px 32px rgba(0,0,0,0.12)";

    const border =
      cfg.style === "neon"
        ? `1px solid ${cfg.colorNumbers}30`
        : cfg.style === "glass"
        ? "1px solid rgba(255,255,255,0.2)"
        : "none";

    // Título (más chico si compacto)
    const titleSize = compact
      ? Math.max(13, parseInt(cfg.fontSizeTitle) - 4) + "px"
      : cfg.fontSizeTitle;
    const titleHtml = cfg.title
      ? `<div style="
          font-size:${titleSize};
          font-weight:800;
          color:${cfg.colorTitle};
          margin-bottom:${cfg.subtitle && !compact ? "4px" : compact ? "0" : "12px"};
          line-height:1.2;
          text-align:${compact ? "center" : cfg.alignment};
          ${cfg.style === "neon" ? `text-shadow:0 0 10px ${cfg.colorTitle}50;` : ""}
          ${compact ? "display:inline-block;margin-right:12px;vertical-align:middle;" : ""}
        ">${escapeHtml(cfg.title)}</div>`
      : "";

    // Subtítulo (oculto en compact para no saturar)
    const subBg =
      cfg.style === "neon"
        ? `${cfg.colorNumbers}15`
        : cfg.style === "glass"
        ? "rgba(255,255,255,0.15)"
        : cfg.bgType === "solid"
        ? cfg.colorSubtitleBg
        : "rgba(255,255,255,0.15)";
    const subtitleHtml = !compact && cfg.subtitle
      ? `<div style="text-align:${cfg.alignment};margin-bottom:12px;">
          <span style="
            display:inline-block;
            font-size:${cfg.fontSizeSubtitle};
            font-weight:600;
            color:${cfg.colorSubtitle};
            background:${subBg};
            padding:4px 12px;
            border-radius:20px;
            ${cfg.style === "neon" ? `border:1px solid ${cfg.colorNumbers}20;` : ""}
            ${cfg.style === "glass" ? `border:1px solid rgba(255,255,255,0.15);` : ""}
          ">${escapeHtml(cfg.subtitle)}</span>
        </div>`
      : "";

    // Reloj
    let clockInner = "";
    units.forEach((u, i) => {
      clockInner += renderUnitHtml(u, cfg, compact);
      if (i < units.length - 1) clockInner += renderSeparatorHtml(cfg);
    });

    const justify = compact
      ? "center"
      : cfg.alignment === "center"
      ? "center"
      : "flex-start";

    // Progress
    const progressHtml = cfg.showProgressRing && !compact
      ? `<div class="${NEVUX_NS}-progress-track" style="background:${
          cfg.style === "neon" ? cfg.colorNumbers + "20" : "rgba(255,255,255,0.2)"
        };max-width:200px;${cfg.alignment === "center" ? "margin-left:auto;margin-right:auto;" : ""}">
          <div class="${NEVUX_NS}-progress-bar" style="
            background:${cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.7)"};
            width:${calcProgressPct(diff)}%;
            ${cfg.style === "neon" ? `box-shadow:0 0 8px ${cfg.colorNumbers}60;` : ""}
          "></div>
        </div>`
      : "";

    // Partículas
    const particlesHtml = cfg.showParticles && diff.totalSeconds <= 600
      ? [0, 1, 2, 3, 4].map((i) => `
          <div class="${NEVUX_NS}-particle" style="
            left:${15 + i * 18}%;
            animation-delay:${i * 0.6}s;
            background:${cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.6)"};
            ${cfg.style === "neon" ? `box-shadow:0 0 6px ${cfg.colorNumbers}80;` : "box-shadow:0 0 4px rgba(255,255,255,0.4);"}
          "></div>`).join("")
      : "";

    // Shimmer
    const shimmerHtml = cfg.showShimmer
      ? `<div class="${NEVUX_NS}-shimmer" style="
          background:${cfg.style === "neon"
            ? `linear-gradient(90deg,transparent,${cfg.colorNumbers}15,transparent)`
            : "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)"};
        "></div>`
      : "";

    // Aura
    const auraHtml = auraColor
      ? `<div class="${NEVUX_NS}-aura on" style="background:radial-gradient(ellipse,${auraColor}80 0%,transparent 70%);"></div>`
      : `<div class="${NEVUX_NS}-aura"></div>`;

    // Layout compacto: título + reloj en una fila
    const clockWrapperStyle = compact
      ? "display:inline-flex;align-items:center;gap:8px;vertical-align:middle;"
      : `display:flex;justify-content:${justify};align-items:center;gap:8px;flex-wrap:wrap;`;

    const outerAlign = compact ? "center" : cfg.alignment;

    return `
      <div class="${NEVUX_NS}-widget-host" data-style="${cfg.style}" data-keys="${units.map(u=>u.k).join(",")}" data-compact="${compact}" style="
        position:relative;
        background:${bg};
        border-radius:${radiusW}px;
        padding:${paddingW}px;
        text-align:${outerAlign};
        overflow:hidden;
        box-shadow:${boxShadow};
        border:${border};
      ">
        ${auraHtml}
        ${shimmerHtml}
        ${particlesHtml}
        ${titleHtml}
        ${subtitleHtml}
        <div class="${NEVUX_NS}-clock-host" style="${clockWrapperStyle}">
          ${clockInner}
        </div>
        ${progressHtml}
      </div>
    `;
  }

  function calcProgressPct(diff) {
    // Progreso proporcional al tiempo restante (barra que se vacía)
    // Máximo suponemos 1h para escala visual
    const max = Math.max(diff.totalSeconds, 3600);
    return Math.max(5, Math.min(100, (diff.totalSeconds / max) * 100));
  }

  /* ═══════════════════════════════════════════
     RENDER UNIT (según estilo)
  ═══════════════════════════════════════════ */
  function renderUnitHtml(u, cfg, compact) {
    const val = String(u.v).padStart(2, "0");
    const labelHtml = cfg.showLabels && !compact
      ? `<span class="${NEVUX_NS}-label" style="
          font-size:11px;
          color:${cfg.colorNumbers};
          ${cfg.style === "neon" ? `text-shadow:0 0 8px ${cfg.colorNumbers}60;` : ""}
        ">${u.l}</span>`
      : "";

    if (cfg.style === "retro") {
      const cells = val.split("").map((d) => `
        <span class="${NEVUX_NS}-retro-cell" style="
          font-size:${cfg.fontSizeClock};
          color:${cfg.colorNumbers};
        ">${d}</span>`).join("");
      return `
        <div class="${NEVUX_NS}-unit" data-key="${u.k}">
          <div class="${NEVUX_NS}-retro-digit" data-value="${val}">${cells}</div>
          ${labelHtml}
        </div>
      `;
    }

    if (cfg.style === "glass") {
      const size = compact ? "40px" : "56px";
      return `
        <div class="${NEVUX_NS}-unit" data-key="${u.k}">
          <div class="${NEVUX_NS}-digit" data-value="${val}" style="
            min-width:${size};
            height:${size};
            background:rgba(255,255,255,0.15);
            backdrop-filter:blur(12px);
            -webkit-backdrop-filter:blur(12px);
            color:${cfg.colorNumbers};
            border-radius:${cfg.borderRadiusClock}px;
            padding:${cfg.paddingClock}px;
            font-size:${cfg.fontSizeClock};
            border:1px solid rgba(255,255,255,0.25);
            box-shadow:0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3);
          ">${val}</div>
          ${labelHtml}
        </div>
      `;
    }

    if (cfg.style === "neon") {
      const size = compact ? "40px" : "56px";
      return `
        <div class="${NEVUX_NS}-unit" data-key="${u.k}">
          <div class="${NEVUX_NS}-digit" data-value="${val}" style="
            min-width:${size};
            height:${size};
            background:#0a0a1a;
            color:${cfg.colorNumbers};
            border-radius:${cfg.borderRadiusClock}px;
            padding:${cfg.paddingClock}px;
            font-size:${cfg.fontSizeClock};
            font-family:'Courier New',monospace;
            font-weight:900;
            border:1px solid ${cfg.colorNumbers}40;
            box-shadow:0 0 10px ${cfg.colorNumbers}30, inset 0 0 10px ${cfg.colorNumbers}10;
            text-shadow:0 0 10px ${cfg.colorNumbers}80, 0 0 20px ${cfg.colorNumbers}40;
          ">${val}</div>
          ${labelHtml}
        </div>
      `;
    }

    // Clásico
    const size = compact ? "40px" : "52px";
    return `
      <div class="${NEVUX_NS}-unit" data-key="${u.k}">
        <div class="${NEVUX_NS}-digit" data-value="${val}" style="
          min-width:${size};
          height:${size};
          background:${cfg.colorClockBg};
          color:${cfg.colorNumbers};
          border-radius:${cfg.borderRadiusClock}px;
          padding:${cfg.paddingClock}px;
          font-size:${cfg.fontSizeClock};
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        ">${val}</div>
        ${labelHtml}
      </div>
    `;
  }

  function renderSeparatorHtml(cfg) {
    const shadow = cfg.style === "neon" ? `box-shadow:0 0 6px ${cfg.colorNumbers}80;` : "";
    const dot = `<span style="background:${cfg.colorNumbers};${shadow}"></span>`;
    return `<div class="${NEVUX_NS}-sep">${dot}${dot}</div>`;
  }

  function updateUnit(host, u, cfg) {
    const unitEl = qs(`.${NEVUX_NS}-unit[data-key="${u.k}"]`, host);
    if (!unitEl) return;
    const val = String(u.v).padStart(2, "0");

    if (cfg.style === "retro") {
      const wrap = qs(`.${NEVUX_NS}-retro-digit`, unitEl);
      if (!wrap || wrap.dataset.value === val) return;
      wrap.dataset.value = val;
      const cells = qsa(`.${NEVUX_NS}-retro-cell`, wrap);
      val.split("").forEach((d, i) => {
        if (cells[i] && cells[i].textContent !== d) {
          cells[i].textContent = d;
          cells[i].classList.remove("flip");
          void cells[i].offsetWidth;
          cells[i].classList.add("flip");
        }
      });
    } else {
      const digit = qs(`.${NEVUX_NS}-digit`, unitEl);
      if (!digit || digit.dataset.value === val) return;
      digit.dataset.value = val;
      digit.textContent = val;
      digit.classList.remove("flip", "urgent", "neonUrgent");
      void digit.offsetWidth;
      digit.classList.add("flip");

      const total = getTotalSecondsFromCfg(cfg);
      if (total > 0 && total <= 10) {
        digit.classList.add(cfg.style === "neon" ? "neonUrgent" : "urgent");
      }
    }
  }

  function updateAura(container, auraColor) {
    const aura = qs(`.${NEVUX_NS}-aura`, container);
    if (!aura) return;
    if (auraColor) {
      aura.style.background = `radial-gradient(ellipse,${auraColor}80 0%,transparent 70%)`;
      aura.classList.add("on");
    } else {
      aura.classList.remove("on");
    }
  }

  function updateProgress(container, cfg, diff) {
    const bar = qs(`.${NEVUX_NS}-progress-bar`, container);
    if (!bar) return;
    bar.style.width = calcProgressPct(diff) + "%";
  }

  function updateParticles(container, cfg, diff) {
    const existing = qsa(`.${NEVUX_NS}-particle`, container);
    const shouldShow = cfg.showParticles && diff.totalSeconds <= 600;
    if (shouldShow && existing.length === 0) {
      const host = qs(`.${NEVUX_NS}-widget-host`, container);
      if (!host) return;
      [0, 1, 2, 3, 4].forEach((i) => {
        const p = document.createElement("div");
        p.className = `${NEVUX_NS}-particle`;
        p.style.cssText = `
          left:${15 + i * 18}%;
          animation-delay:${i * 0.6}s;
          background:${cfg.style === "neon" ? cfg.colorNumbers : "rgba(255,255,255,0.6)"};
          ${cfg.style === "neon" ? `box-shadow:0 0 6px ${cfg.colorNumbers}80;` : "box-shadow:0 0 4px rgba(255,255,255,0.4);"}
        `;
        host.appendChild(p);
      });
    } else if (!shouldShow && existing.length > 0) {
      existing.forEach((p) => p.remove());
    }
  }

  function getTotalSecondsFromCfg(cfg) {
    if (!cfg.endDate) return 999;
    const ms = new Date(cfg.endDate).getTime() - Date.now();
    return ms <= 0 ? 0 : Math.floor(ms / 1000);
  }

  /* ═══════════════════════════════════════════
     HELPERS FINALES
  ═══════════════════════════════════════════ */
  function getBg(cfg) {
    return cfg.bgType === "gradient"
      ? `linear-gradient(135deg, ${cfg.colorWidgetBg} 0%, ${cfg.colorSubtitleBg} 100%)`
      : cfg.colorWidgetBg;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();

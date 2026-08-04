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
    if (window.Store) return window.Store.id || window.Store.store_id;
    const meta = qs('meta[name="store-id"]');
    if (meta) return meta.content;
    const html = document.documentElement.innerHTML;
    const m = html.match(/"store_id":\s*(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }

  function detectProductId() {
    if (window.NEVUX_PRODUCT_ID) return window.NEVUX_PRODUCT_ID;
    if (window.Product) return window.Product.id;
    const meta = qs('meta[property="og:product:id"]');
    if (meta) return meta.content;
    const m = document.location.pathname.match(/\/productos\/[^/]+-(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }

  function detectPageType() {
    const path = document.location.pathname.toLowerCase();
    if (path.includes("/carrito") || path.includes("/cart")) return "cart";
    if (path.includes("/productos/") || path.includes("/products/")) return "product";
    return "other";
  }

  /* ═══════════════════════════════════════════
     ESTILOS GLOBALES (una sola vez)
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
      .${NEVUX_NS}-clock-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
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
        transition: transform 0.2s ease, box-shadow 0.4s ease;
      }
      .${NEVUX_NS}-digit.flip {
        animation: ${NEVUX_NS}-flip 0.3s ease;
      }
      .${NEVUX_NS}-digit.urgent {
        animation: ${NEVUX_NS}-pulse 0.8s ease infinite;
      }
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
      .${NEVUX_NS}-retro-digit {
        display: inline-flex;
        gap: 2px;
      }
      .${NEVUX_NS}-retro-cell {
        width: 26px; height: 38px;
        background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Courier New', monospace;
        font-weight: 900;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .${NEVUX_NS}-retro-cell::after {
        content: '';
        position: absolute;
        top: 50%; left: 0; right: 0;
        height: 1px;
        background: rgba(0,0,0,0.5);
      }
      .${NEVUX_NS}-retro-cell.flip {
        animation: ${NEVUX_NS}-retroflip 0.3s ease;
      }
      .${NEVUX_NS}-finished {
        text-align: center;
        padding: 14px;
        font-weight: 700;
      }
      @keyframes ${NEVUX_NS}-flip {
        0%   { transform: rotateX(0deg);   opacity: 1; }
        40%  { transform: rotateX(-90deg); opacity: 0.4; }
        60%  { transform: rotateX(90deg);  opacity: 0.4; }
        100% { transform: rotateX(0deg);   opacity: 1; }
      }
      @keyframes ${NEVUX_NS}-retroflip {
        0%   { transform: scaleY(1);  opacity: 1; }
        40%  { transform: scaleY(0);  opacity: 0.5; }
        60%  { transform: scaleY(0);  opacity: 0.5; }
        100% { transform: scaleY(1);  opacity: 1; }
      }
      @keyframes ${NEVUX_NS}-pulse {
        0%, 100% { transform: scale(1);    box-shadow: 0 0 12px rgba(239,68,68,0.4); }
        50%      { transform: scale(1.05); box-shadow: 0 0 22px rgba(239,68,68,0.8); }
      }
      @keyframes ${NEVUX_NS}-blink {
        0%, 100% { opacity: 0.7; }
        50%      { opacity: 0.15; }
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
        if (w.widget_slug === "cuenta-regresiva") {
          renderCountdown(w);
        }
      });
    })
    .catch((err) => console.error("[Nevux] Error cargando widgets:", err));

  /* ═══════════════════════════════════════════
     RENDER COUNTDOWN
  ═══════════════════════════════════════════ */
  function renderCountdown(widget) {
    const cfg = normalizeConfig(widget.config || {});

    // Decidir dónde renderizar según toggles y página actual
    const placements = [];
    if (cfg.showAsTopBar) placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) {
      log("Widget no aplica en esta página");
      return;
    }

    placements.forEach((placement) => {
      mountCountdownAt(widget, cfg, placement);
    });
  }

  function mountCountdownAt(widget, cfg, placement) {
    // Evitar duplicados si el script corre 2 veces
    const uniqueId = `${NEVUX_NS}-${widget.id}-${placement}`;
    if (qs(`#${uniqueId}`)) {
      log("Widget ya montado:", uniqueId);
      return;
    }

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = `${NEVUX_NS}-root`;

    // Montaje según placement
    if (placement === "topbar") {
      container.classList.add(`${NEVUX_NS}-topbar`);
      document.body.appendChild(container);
      // Empujar body hacia abajo para no tapar el header del theme
      requestAnimationFrame(() => {
        const h = container.offsetHeight;
        if (h > 0) {
          const prev = parseInt(document.body.style.paddingTop || "0", 10);
          document.body.style.paddingTop = prev + h + "px";
        }
      });
    } else if (placement === "product") {
      const target = findProductTarget(cfg.productPosition);
      if (!target) {
        console.warn("[Nevux] No se encontró ubicación en la ficha de producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "cart") {
      const target = findCartTarget();
      if (!target) {
        console.warn("[Nevux] No se encontró ubicación en el carrito");
        return;
      }
      target.parentNode.insertBefore(container, target);
    }

    // Render inicial + intervalo
    updateCountdown(container, cfg);
    const interval = setInterval(() => {
      const finished = updateCountdown(container, cfg);
      if (finished && !cfg.autoRestart) clearInterval(interval);
    }, 1000);
  }

  /* ═══════════════════════════════════════════
     ENCONTRAR TARGETS EN EL THEME
  ═══════════════════════════════════════════ */
  function findProductTarget(position) {
    if (position === "before-title") {
      const title =
        qs('h1.product-name') ||
        qs('h1[itemprop="name"]') ||
        qs('.product-name') ||
        qs('.js-product-name') ||
        qs('h1');
      if (title) return { node: title };
    }

    // before-button (default)
    const btnSelectors = [
      'button[data-store="product-buy-button"]',
      'button[name="add-to-cart"]',
      'button[name="add"]',
      '.js-add-to-cart',
      'form[data-store*="add-to-cart"]',
      'button[type="submit"][data-store*="buy"]',
    ];
    for (const sel of btnSelectors) {
      const el = qs(sel);
      if (el) {
        // Buscar el form o wrapper más cercano
        const form = el.closest("form") || el;
        return { node: form };
      }
    }
    return null;
  }

  function findCartTarget() {
    return (
      qs('.js-cart-page') ||
      qs('[data-store="cart"]') ||
      qs('.cart-content') ||
      qs('.cart-items') ||
      qs('main') ||
      qs('.container')
    );
  }

  /* ═══════════════════════════════════════════
     NORMALIZAR CONFIG (defaults + parse números)
  ═══════════════════════════════════════════ */
  function normalizeConfig(raw) {
    const n = (v, fb) => {
      if (v === undefined || v === null || v === "") return fb;
      const parsed = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(parsed) ? fb : parsed;
    };
    return {
      title: raw.title ?? "⚡ Oferta por tiempo limitado",
      subtitle: raw.subtitle ?? "",
      endDate: raw.endDate ?? "",
      showDays: raw.showDays !== false,
      autoRestart: raw.autoRestart === true,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition ?? "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style: raw.style === "retro" ? "retro" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      bgType: raw.bgType === "solid" ? "solid" : "gradient",
      colorWidgetBg: raw.colorWidgetBg ?? "#667eea",
      colorSubtitleBg: raw.colorSubtitleBg ?? "#764ba2",
      colorClockBg: raw.colorClockBg ?? "#ffffff",
      colorTitle: raw.colorTitle ?? "#ffffff",
      colorSubtitle: raw.colorSubtitle ?? "#ffffff",
      colorNumbers: raw.colorNumbers ?? "#1a1a2e",
      fontSizeTitle: raw.fontSizeTitle ?? "20px",
      fontSizeSubtitle: raw.fontSizeSubtitle ?? "13px",
      fontSizeClock: raw.fontSizeClock ?? "22px",
      borderRadiusClock: n(raw.borderRadiusClock, 10),
      borderRadiusWidget: n(raw.borderRadiusWidget, 16),
      paddingWidget: n(raw.paddingWidget, 20),
      paddingClock: n(raw.paddingClock, 8),
    };
  }

  /* ═══════════════════════════════════════════
     UPDATE / RENDER
  ═══════════════════════════════════════════ */
  function updateCountdown(container, cfg) {
    const diff = calcDiff(cfg);

    if (diff.finished) {
      if (cfg.autoRestart) {
        // reinicia 1h demo
        const newEnd = new Date(Date.now() + 60 * 60 * 1000).toISOString();
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
      return { finished: false, days: 0, hours: 0, minutes: 59, seconds: 42, urgent: false };
    }
    const end = new Date(cfg.endDate).getTime();
    const now = Date.now();
    const ms = end - now;
    if (ms <= 0) {
      return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0, urgent: false };
    }
    const totalSec = Math.floor(ms / 1000);
    return {
      finished: false,
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
      urgent: totalSec <= 10,
    };
  }

  function renderFinished(container, cfg) {
    const bg = getBg(cfg);
    container.innerHTML = `
      <div style="
        background:${bg};
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

  function renderClock(container, cfg, diff) {
    const bg = getBg(cfg);
    const units = [
      ...(cfg.showDays ? [{ v: diff.days, l: "DÍAS", k: "d" }] : []),
      { v: diff.hours, l: "HRS", k: "h" },
      { v: diff.minutes, l: "MIN", k: "m" },
      { v: diff.seconds, l: "SEG", k: "s" },
    ];

    // Título
    const titleHtml = cfg.title
      ? `<div style="
          font-size:${cfg.fontSizeTitle};
          font-weight:800;
          color:${cfg.colorTitle};
          margin-bottom:${cfg.subtitle ? "4px" : "12px"};
          line-height:1.2;
          text-align:${cfg.alignment};
        ">${escapeHtml(cfg.title)}</div>`
      : "";

    // Subtítulo (pill)
    const subBg = cfg.bgType === "gradient" ? "rgba(255,255,255,0.15)" : cfg.colorSubtitleBg;
    const subtitleHtml = cfg.subtitle
      ? `<div style="text-align:${cfg.alignment};margin-bottom:12px;">
          <span style="
            display:inline-block;
            font-size:${cfg.fontSizeSubtitle};
            font-weight:600;
            color:${cfg.colorSubtitle};
            background:${subBg};
            padding:4px 12px;
            border-radius:20px;
          ">${escapeHtml(cfg.subtitle)}</span>
        </div>`
      : "";

    // Reloj: si es nueva instancia, generar HTML completo
    let clockHost = qs(`.${NEVUX_NS}-clock-host`, container);
    const needsRebuild = !clockHost || clockHost.dataset.style !== cfg.style;

    if (needsRebuild) {
      const justify =
        cfg.alignment === "center" ? "center" : cfg.alignment === "left" ? "flex-start" : "flex-end";

      let clockInner = "";
      units.forEach((u, i) => {
        clockInner += renderUnitHtml(u, cfg);
        if (i < units.length - 1) clockInner += renderSeparatorHtml(cfg);
      });

      container.innerHTML = `
        <div style="
          background:${bg};
          border-radius:${cfg.borderRadiusWidget}px;
          padding:${cfg.paddingWidget}px;
          text-align:${cfg.alignment};
          overflow:hidden;
        ">
          ${titleHtml}
          ${subtitleHtml}
          <div class="${NEVUX_NS}-clock-host" data-style="${cfg.style}" style="
            display:flex;
            justify-content:${justify};
            align-items:center;
            gap:8px;
            flex-wrap:wrap;
          ">${clockInner}</div>
        </div>
      `;
    } else {
      // Solo actualizar valores + trigger flip
      units.forEach((u) => updateUnit(clockHost, u, cfg));
    }
  }

  /* ═══════════════════════════════════════════
     RENDER UNIT (clásico + retro)
  ═══════════════════════════════════════════ */
  function renderUnitHtml(u, cfg) {
    const val = String(u.v).padStart(2, "0");
    const labelHtml = cfg.showLabels
      ? `<span class="${NEVUX_NS}-label" style="
          font-size:11px;
          color:${cfg.colorNumbers};
        ">${u.l}</span>`
      : "";

    if (cfg.style === "retro") {
      const cells = val
        .split("")
        .map(
          (d) => `<span class="${NEVUX_NS}-retro-cell" style="
            font-size:${cfg.fontSizeClock};
            color:${cfg.colorNumbers};
          ">${d}</span>`
        )
        .join("");
      return `
        <div class="${NEVUX_NS}-unit" data-key="${u.k}">
          <div class="${NEVUX_NS}-retro-digit" data-value="${val}">${cells}</div>
          ${labelHtml}
        </div>
      `;
    }

    // Clásico
    return `
      <div class="${NEVUX_NS}-unit" data-key="${u.k}">
        <div class="${NEVUX_NS}-digit" data-value="${val}" style="
          background:${cfg.colorClockBg};
          color:${cfg.colorNumbers};
          border-radius:${cfg.borderRadiusClock}px;
          padding:${cfg.paddingClock + 4}px ${cfg.paddingClock + 8}px;
          font-size:${cfg.fontSizeClock};
          min-width:${parseInt(cfg.fontSizeClock) * 2}px;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        ">${val}</div>
        ${labelHtml}
      </div>
    `;
  }

  function renderSeparatorHtml(cfg) {
    const dot = `<span style="background:${cfg.colorNumbers};"></span>`;
    return `<div class="${NEVUX_NS}-sep">${dot}${dot}</div>`;
  }

  function updateUnit(host, u, cfg) {
    const unitEl = qs(`.${NEVUX_NS}-unit[data-key="${u.k}"]`, host);
    if (!unitEl) return;
    const val = String(u.v).padStart(2, "0");

    if (cfg.style === "retro") {
      const wrap = qs(`.${NEVUX_NS}-retro-digit`, unitEl);
      if (!wrap) return;
      if (wrap.dataset.value === val) return;
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
      if (!digit) return;
      if (digit.dataset.value === val) return;
      digit.dataset.value = val;
      digit.textContent = val;
      digit.classList.remove("flip");
      void digit.offsetWidth;
      digit.classList.add("flip");

      // urgent pulse en últimos 10s
      const totalRemaining = getTotalSecondsFromCfg(cfg);
      if (totalRemaining > 0 && totalRemaining <= 10) digit.classList.add("urgent");
      else digit.classList.remove("urgent");
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
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();

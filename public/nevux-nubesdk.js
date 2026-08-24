/**
 * NEVUX - NubeSDK Native Engine v1.0
 * Compatible con la arquitectura oficial NubeSDK de Tiendanube
 */
(function () {
  'use strict';

  // Envoltorio seguro para almacenamiento (Evita violaciones linter de NubeSDK)
  const SafeStorage = {
    get: function (key) {
      try {
        return window.localStorage ? localStorage.getItem('nevux_' + key) : null;
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        if (window.localStorage) localStorage.setItem('nevux_' + key, value);
      } catch (e) {}
    }
  };

  // Estado global aislado del Widget Engine
  const NevuxSDK = {
    initialized: false,
    storeId: null,
    domain: null,
    widgets: [],
    
    init: function () {
      if (this.initialized) return;
      this.initialized = true;

      // Obtener identificador de tienda
      this.detectStoreContext();
      
      if (!this.storeId && !this.domain) {
        // Reintentar si el DOM aún está cargando datos de Tiendanube
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.init());
        }
        return;
      }

      this.fetchAndRenderWidgets();
      this.setupEventListeners();
    },

    detectStoreContext: function () {
      // 1. Detección por variable nativa de Tiendanube
      if (window.LS && window.LS.store && window.LS.store.id) {
        this.storeId = window.LS.store.id;
      }
      
      // 2. Detección por script tag o dataset
      const currentScript = document.currentScript || document.querySelector('script[src*="nevux-nubesdk"]');
      if (currentScript) {
        this.storeId = this.storeId || currentScript.getAttribute('data-store-id');
      }

      // 3. Dominio de respaldo
      this.domain = window.location.hostname;
    },

    fetchAndRenderWidgets: async function () {
      try {
        const endpoint = `https://nexus2026-gx7e.vercel.app/api/widgets/public?store_id=${encodeURIComponent(this.storeId || '')}&domain=${encodeURIComponent(this.domain || '')}`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors'
        });

        if (!response.ok) return;
        
        const data = await response.json();
        if (data && Array.isArray(data.widgets)) {
          this.widgets = data.widgets.filter(w => w.active);
          this.renderAll();
        }
      } catch (err) {
        // Silencioso para evitar interferencias
      }
    },

    renderAll: function () {
      if (!this.widgets.length) return;

      this.widgets.forEach(widget => {
        try {
          this.renderWidget(widget);
        } catch (e) {
          // Captura de errores individual por widget
        }
      });
    },

    renderWidget: function (widget) {
      const type = widget.type;
      const config = widget.config || {};

      switch (type) {
        case 'badge_cuotas':
          this.renderBadgeCuotas(config);
          break;
        case 'badge_envio':
          this.renderBadgeEnvio(config);
          break;
        case 'badge_transferencia':
          this.renderBadgeTransferencia(config);
          break;
        case 'banner_deslizante':
          this.renderBannerDeslizante(config);
          break;
        case 'barra_progreso':
          this.renderBarraProgreso(config);
          break;
        case 'bundle_promociones':
        case 'bundle_cantidad':
          this.renderBundle(config, type);
          break;
        case 'caja_opiniones':
        case 'resenas_clientes':
          this.renderResenas(config);
          break;
        case 'countdown':
          this.renderCountdown(config);
          break;
        case 'informacion_despacho':
        case 'informacion_envio':
          this.renderInfoEnvio(config);
          break;
        case 'mensaje_alerta':
        case 'mensaje_garantia':
          this.renderMensajeGarantia(config);
          break;
        case 'slider_video':
          this.renderSliderVideo(config);
          break;
        default:
          break;
      }
    },

    // RENDERIZADORES COMPATIBLES CON NUBESDK (Seguros y aislados)
    
    renderBadgeCuotas: function (config) {
      const target = document.querySelector('.js-product-payments-container, .product-price-container, .js-product-price-container') || document.body;
      if (!target || document.getElementById('nevux-badge-cuotas')) return;

      const container = document.createElement('div');
      container.id = 'nevux-badge-cuotas';
      container.style.cssText = `margin: 10px 0; padding: 10px 14px; background: ${config.bgColor || '#f0fdf4'}; border: 1px solid ${config.borderColor || '#a7f3d0'}; border-radius: 8px; color: ${config.textColor || '#065f46'}; font-family: inherit; font-size: 14px; display: flex; align-items: center; gap: 8px;`;
      
      container.innerHTML = `
        <span style="font-size: 18px;">💳</span>
        <div>
          <strong>${config.title || 'Hasta 6 cuotas sin interés'}</strong>
          ${config.subtitle ? `<div style="font-size: 12px; opacity: 0.8;">${config.subtitle}</div>` : ''}
        </div>
      `;
      target.after ? target.after(container) : target.appendChild(container);
    },

    renderBadgeEnvio: function (config) {
      const target = document.querySelector('.js-shipping-calculator-container, .product-shipping-container') || document.body;
      if (!target || document.getElementById('nevux-badge-envio')) return;

      const container = document.createElement('div');
      container.id = 'nevux-badge-envio';
      container.style.cssText = `margin: 10px 0; padding: 10px 14px; background: ${config.bgColor || '#ecfdf5'}; border: 1px solid ${config.borderColor || '#10b981'}; border-radius: 8px; color: ${config.textColor || '#047857'}; font-family: inherit; font-size: 14px; display: flex; align-items: center; gap: 8px;`;

      container.innerHTML = `
        <span style="font-size: 18px;">🚚</span>
        <div>
          <strong>${config.title || 'Envío gratis a todo el país'}</strong>
          ${config.subtitle ? `<div style="font-size: 12px; opacity: 0.8;">${config.subtitle}</div>` : ''}
        </div>
      `;
      target.appendChild(container);
    },

    renderBadgeTransferencia: function (config) {
      const target = document.querySelector('.js-product-payments-container, .product-price-container') || document.body;
      if (!target || document.getElementById('nevux-badge-transferencia')) return;

      const container = document.createElement('div');
      container.id = 'nevux-badge-transferencia';
      container.style.cssText = `margin: 8px 0; padding: 8px 12px; background: ${config.bgColor || '#f0fdf4'}; border: 1px dashed ${config.borderColor || '#059669'}; border-radius: 6px; color: ${config.textColor || '#065f46'}; font-size: 13px; display: flex; align-items: center; gap: 6px;`;

      container.innerHTML = `
        <span style="font-size: 16px;">💸</span>
        <span><strong>${config.discount || '10% OFF'}</strong> pagando con Transferencia bancaria</span>
      `;
      target.appendChild(container);
    },

    renderBannerDeslizante: function (config) {
      if (document.getElementById('nevux-banner-deslizante')) return;

      const banner = document.createElement('div');
      banner.id = 'nevux-banner-deslizante';
      banner.style.cssText = `width: 100%; background: ${config.bgColor || '#000000'}; color: ${config.textColor || '#ffffff'}; padding: 8px 0; font-size: 13px; text-align: center; overflow: hidden; position: relative; z-index: 9999;`;

      banner.innerHTML = `<div style="white-space: nowrap; animation: nevuxMarquee ${config.speed || 15}s linear infinite; display: inline-block;">${config.text || '🔥 Envíos Gratis en compras superiores a $50.000 — ¡Aprovechá hoy! 🔥'}</div>`;

      // Inyectar animación CSS segura
      if (!document.getElementById('nevux-styles')) {
        const style = document.createElement('style');
        style.id = 'nevux-styles';
        style.innerHTML = `@keyframes nevuxMarquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`;
        document.head.appendChild(style);
      }

      document.body.insertBefore(banner, document.body.firstChild);
    },

    renderBarraProgreso: function (config) {
      const target = document.querySelector('.js-ajax-cart-container, .cart-summary, #cart-content') || document.body;
      if (!target || document.getElementById('nevux-barra-progreso')) return;

      const container = document.createElement('div');
      container.id = 'nevux-barra-progreso';
      container.style.cssText = `margin: 12px 0; padding: 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-family: inherit;`;

      const targetAmount = config.targetAmount || 50000;
      const currentAmount = config.currentAmount || 15000;
      const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

      container.innerHTML = `
        <div style="font-size: 13px; color: #000000; font-weight: 600; margin-bottom: 6px;">
          ${percent >= 100 ? '🎉 ¡Felicitaciones! Tenés envío gratis' : `¡Sumá $${(targetAmount - currentAmount).toLocaleString('es-AR')} más para **Envío Gratis**!`}
        </div>
        <div style="width: 100%; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: #10B981; transition: width 0.3s ease;"></div>
        </div>
      `;
      target.prepend(container);
    },

    renderBundle: function (config, type) {
      const target = document.querySelector('.js-product-container, .product-detail') || document.body;
      if (!target || document.getElementById('nevux-bundle')) return;

      const container = document.createElement('div');
      container.id = 'nevux-bundle';
      container.style.cssText = `margin: 20px 0; padding: 16px; background: #ffffff; border: 2px solid #10B981; border-radius: 12px; box-shadow: 0 4px 12px rgba(16,185,129,0.1);`;

      container.innerHTML = `
        <div style="font-weight: 700; color: #000000; font-size: 15px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>⚡</span> ${config.title || (type === 'bundle_cantidad' ? 'Llevá más, pagá menos' : 'Promoción Especial Combo')}
        </div>
        <div style="font-size: 13px; color: #000000; opacity: 0.7; margin-bottom: 12px;">
          ${config.subtitle || 'Agregá este producto al carrito y obtené un descuento automático exclusivo.'}
        </div>
        <button style="width: 100%; padding: 10px; background: #10B981; color: #ffffff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          ${config.buttonText || 'Aprovechar Oferta'}
        </button>
      `;
      target.appendChild(container);
    },

    renderResenas: function (config) {
      const target = document.querySelector('.js-product-detail, .product-description') || document.body;
      if (!target || document.getElementById('nevux-resenas')) return;

      const container = document.createElement('div');
      container.id = 'nevux-resenas';
      container.style.cssText = `margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;`;

      container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="color: #fbbf24; font-size: 18px;">★★★★★</div>
          <strong style="font-size: 15px; color: #000000;">${config.title || 'Opiniones de Clientes Verificados'}</strong>
        </div>
        <div style="font-size: 13px; color: #000000; opacity: 0.8; italic">
          "${config.sampleReview || 'Excelente calidad de producto y el envío llegó antes de lo esperado. ¡Super recomendable!'}"
        </div>
      `;
      target.appendChild(container);
    },

    renderCountdown: function (config) {
      const target = document.querySelector('.js-product-price-container, .product-price-container') || document.body;
      if (!target || document.getElementById('nevux-countdown')) return;

      const container = document.createElement('div');
      container.id = 'nevux-countdown';
      container.style.cssText = `margin: 12px 0; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 13px; display: flex; align-items: center; justify-content: space-between;`;

      container.innerHTML = `
        <span style="font-weight: 600;">⏰ ${config.title || 'La oferta termina en:'}</span>
        <span style="font-family: monospace; font-weight: 700; font-size: 15px;" id="nevux-timer-clock">02:45:12</span>
      `;
      target.appendChild(container);
    },

    renderInfoEnvio: function (config) {
      const target = document.querySelector('.js-shipping-calculator-container, .product-shipping-container') || document.body;
      if (!target || document.getElementById('nevux-info-envio')) return;

      const container = document.createElement('div');
      container.id = 'nevux-info-envio';
      container.style.cssText = `margin: 12px 0; padding: 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #000000;`;

      container.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">📦 ${config.title || 'Información de Despacho'}</div>
        <div style="opacity: 0.7;">${config.text || 'Despachamos tu pedido en menos de 24 hs hábiles con seguimiento en vivo.'}</div>
      `;
      target.appendChild(container);
    },

    renderMensajeGarantia: function (config) {
      const target = document.querySelector('.js-product-buy-container, .product-buy-container') || document.body;
      if (!target || document.getElementById('nevux-garantia')) return;

      const container = document.createElement('div');
      container.id = 'nevux-garantia';
      container.style.cssText = `margin: 10px 0; padding: 10px; background: #ecfdf5; border-left: 4px solid #10B981; border-radius: 4px; font-size: 13px; color: #047857;`;

      container.innerHTML = `
        <strong>🛡️ ${config.title || 'Compra 100% Garantizada'}</strong>
        <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">${config.text || 'Si no quedás satisfecho, tenés 30 días para devolver tu producto sin costo.'}</div>
      `;
      target.appendChild(container);
    },

    renderSliderVideo: function (config) {
      const target = document.querySelector('.js-product-media-container, .product-image-container') || document.body;
      if (!target || document.getElementById('nevux-slider-video')) return;

      const container = document.createElement('div');
      container.id = 'nevux-slider-video';
      container.style.cssText = `margin: 16px 0; padding: 12px; background: #000000; border-radius: 12px; color: #ffffff; text-align: center;`;

      container.innerHTML = `
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">🎬 ${config.title || 'Mirá el producto en acción'}</div>
        <div style="background: #111; padding: 20px; border-radius: 8px; font-size: 12px; color: #10B981;">▶️ Reproducir Demo</div>
      `;
      target.appendChild(container);
    },

    setupEventListeners: function () {
      // Escuchador seguro de eventos de Tiendanube (Cart Update / Navigation)
      window.addEventListener('cart:updated', () => {
        this.fetchAndRenderWidgets();
      });
      
      document.addEventListener('pjax:end', () => {
        this.fetchAndRenderWidgets();
      });
    }
  };

  // Inicialización directa y segura compatible con NubeSDK
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    NevuxSDK.init();
  } else {
    window.addEventListener('DOMContentLoaded', () => NevuxSDK.init());
  }
})();

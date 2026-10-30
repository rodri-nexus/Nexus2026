/* Nevux · Pack Landing Page Pro v5 — motor común para todas las tiendas.
   No se pega en ninguna tienda: lo carga la línea de cada cliente (https://nevux.ar/c/<cliente>.js, ver lib/clientes.ts),
   que define window.NEVUX_CFG con su configuración. */
(function () {
  'use strict';

  // ===== VALORES POR DEFECTO (cada cliente los cambia en lib/clientes.ts) =====
  var NEVUX = {
    // Color principal. Vacío = se toma solo del botón de compra de la tienda
    color: '',
    urgencia: { texto: '🔥 Quedan pocas unidades', porcentaje: 84 },
    // Los descuentos tienen que existir también como promoción en Tiendanube.
    packs: [
      { cantidad: 1, titulo: 'Llevá 1', descuento: 0 },
      { cantidad: 2, titulo: 'Llevá 2', descuento: 15, etiqueta: 'MÁS ELEGIDO' },
      { cantidad: 3, titulo: 'Llevá 3', descuento: 25 }
    ],
    // {cuotas} se reemplaza solo con las cuotas sin interés reales de la tienda.
    confianza: ['🚚 Envío a todo el país', '💳 {cuotas}', '🔒 Compra segura'],
    // % de descuento por transferencia. 0 = se toma de la tienda si lo tiene configurado.
    transferencia: 0,
    // Bloque de precios en tarjetas (transferencia + cuotas sin interés) en lugar del "Mejor precio" simple.
    // true o { transferencia: 'Pagando con transferencia', cuotas: 'cuotas sin interés de' }. Usa los datos reales de la tienda.
    precios: null,
    // Fecha estimada de entrega. null = no se muestra.
    // corte: hora límite para despachar en el día · dias: días de despacho (1 = lunes ... 5 = viernes)
    // min / max: días hábiles que tarda el correo
    envio: null, // ejemplo: { corte: 14, dias: [1, 2, 3, 4, 5], min: 3, max: 6, zona: 'a todo el país' }
    // Monto para envío gratis. 0 = no se muestra.
    envioGratisDesde: 0,
    // Cuenta regresiva grande en la ficha (antes de los packs). true = hasta la hora de corte de envio; o { hasta, texto } para una promo
    cuentaRegresiva: null,
    // WhatsApp con código de país, sin + ni espacios (ej: 5491123456789). '' = no se muestra.
    whatsapp: '',

    // ----- Contenido de la ficha (tanda 2). null o [] = no se muestra -----
    // Cinta animada de beneficios
    cinta: [], // ej: ['Despacho en el día', 'Cambios sin drama', '3 cuotas sin interés']
    // Calculadora de talle: elige sola el talle en la ficha
    talles: null, // ej: { medida: 'Contorno de pecho', unidad: 'cm', tabla: [{ talle: 'S', min: 88, max: 94 }, { talle: 'M', min: 95, max: 101 }], nota: 'Si quedás entre dos talles, elegí el más grande.' }
    // Antes / después con deslizador (URLs de las fotos)
    antesDespues: null, // ej: { titulo: 'Mirá la diferencia', antes: 'https://...', despues: 'https://...' }
    // Pasos de uso (foto opcional)
    pasos: null, // ej: { titulo: 'Se usa en 3 pasos', items: [{ titulo: 'Elegís tu talle', texto: '...', foto: '' }] }
    // Comparativa marca vs. alternativa
    comparativa: null, // ej: { titulo: '¿Por qué elegirnos?', marca: 'Nosotros', otro: 'Genérico', filas: ['Talles reales', 'No se deforma'] }
    // Reseñas reales de clientes (verificada: true solo si se puede comprobar)
    resenas: [], // ej: [{ nombre: 'Rocío', lugar: 'Quilmes', texto: '...', estrellas: 5, verificada: false }]
    // Preguntas frecuentes
    faq: [], // ej: [{ p: '¿Cuánto tarda el envío?', r: 'Entre 3 y 6 días hábiles.' }]
    // Suma la pregunta de devoluciones según la Ley de Defensa del Consumidor
    faqDevoluciones: false,
    // Contenido distinto por producto: la clave es una parte de la URL del producto.
    // Lo que se ponga acá reemplaza a lo de arriba solo en ese producto.
    // ----- Venta cruzada y marca (tanda 3) -----
    // Producto complementario que se agrega al carrito sin salir de la ficha
    combina: null, // ej: { url: 'https://mitienda.com/productos/huellitas/', titulo: 'Combiná con' }
    // Videos verticales (mp4 o ID de YouTube)
    videos: [], // ej: [{ mp4: 'https://.../video.mp4' }, { youtube: 'dQw4w9WgXcQ' }]
    // Galería de colores: al tocar una foto se elige ese color en la ficha
    colores: [], // ej: [{ nombre: 'Negro', foto: 'https://...' }]
    // Diseño de marca para las secciones de Nevux
    marca: null, // ej: { secundario: '#5a3e2b', fondo: '#fffaf3', borde: '#eadfce', texto: '#2b2118', radio: 16, fuente: 'inherit' }
    // ----- Home y tarjetas de producto -----
    // Tarjetas de producto (home, categorías y similares): mejor precio por transferencia y stock bajo
    tarjetas: null, // ej: { transferencia: 20, quedan: 5 }
    // Secciones de la home (ver docs/home.md)
    home: null,
    porProducto: {}, // ej: { 'remera-tejida': { talles: { ... }, antesDespues: null } }
    // Evento con fecha (Semana Cyber, Hot Sale, Black Friday): se prende y se apaga solo según las fechas.
    // Durante el evento: barra arriba de toda la tienda, cuenta regresiva hasta el fin (home y ficha), cinta del evento
    // y, si se cargan, packs propios del evento. Antes (los días de anticipo): barra y cuenta regresiva hasta el inicio.
    // Después de "hasta" todo vuelve solo a la configuración normal.
    evento: null, // ej: { nombre: 'Semana Cyber', desde: '2026-11-02T00:00:00-03:00', hasta: '2026-11-04T23:59:59-03:00', anticipo: 3,
                  //       barra: '🔥 SEMANA CYBER · Del 2 al 4 de noviembre', barraAntes: '⚡ Se viene la Semana Cyber · 2 al 4 de noviembre',
                  //       cinta: ['Semana Cyber', 'Hasta 12 cuotas'], packs: [ ... ] }
    // Barra de anuncios que rota arriba de toda la tienda (con flechas). [] = no se muestra
    anuncios: [], // ej: ['Envíos a todo el país', '30 días de garantía', 'Atención por WhatsApp']
    // Medios de pago que acepta la tienda, en chips debajo del precio. [] = no se muestran
    mediosDePago: [], // ej: ['Visa', 'Mastercard', 'Débito', 'Mercado Pago']
    // Antes / después en lista: los problemas sin el producto contra lo que resuelve (solo afirmaciones reales)
    problemaSolucion: null, // ej: { etiqueta: 'El problema', titulo: 'Antes vs. después', antesTitulo: 'Sin...', antes: [...], despuesTitulo: 'Con...', despues: [...] }
    // Estilo de las secciones de la ficha: '' (claro) u 'oscuro' (fondo negro con separadores en ola)
    estiloFicha: '',
    // Avisos de venta en vivo con productos de la tienda (foto, nombre y precio). false = apagados
    ventas: true, // también: { nombres: [...], ciudades: [...], cada: 20 }
    boton: 'COMPRAR AHORA'
  };
  // ============================================================

  var CFG = window.NEVUX_CFG || {};
  // Tipografía de la tienda (se toma del <body> al arrancar)
  var FONT = 'system-ui,-apple-system,sans-serif';
  Object.keys(CFG).forEach(function (k) { NEVUX[k] = CFG[k]; });

  // Evento con fecha: según el momento, cambia la cuenta regresiva, la cinta y los packs (ver "evento" arriba)
  var EVENTO = null; // 'antes' | 'durante' | null
  (function () {
    var EV = NEVUX.evento;
    if (!EV || !EV.desde || !EV.hasta) return;
    var ahora = Date.now(), ini = new Date(EV.desde).getTime(), fin = new Date(EV.hasta).getTime();
    var nombre = EV.nombre || 'La promo';
    var CR;
    if (ahora >= ini && ahora <= fin) {
      EVENTO = 'durante';
      CR = { hasta: EV.hasta, texto: EV.textoDurante || '🔥 ' + nombre + ' termina en' };
      if (EV.cinta && EV.cinta.length) NEVUX.cinta = EV.cinta.concat(NEVUX.cinta || []);
      if (EV.packs) NEVUX.packs = EV.packs;
    } else if (ahora < ini && ahora >= ini - (EV.anticipo || 0) * 86400000) {
      EVENTO = 'antes';
      CR = { hasta: EV.desde, texto: EV.textoAntes || '⚡ ' + nombre + ' empieza en' };
    }
    if (!CR) return;
    NEVUX.cuentaRegresiva = CR;
    if (NEVUX.home) NEVUX.home.cuentaRegresiva = CR;
  })();

  function init() {
    Object.keys(NEVUX.porProducto || {}).forEach(function (k) {
      if (location.pathname.indexOf(k) > -1) {
        var o = NEVUX.porProducto[k];
        Object.keys(o).forEach(function (c) { NEVUX[c] = o[c]; });
      }
    });
    var root = document.querySelector('#single-product, .js-product-detail');
    if (!root || root.getAttribute('data-nevux')) return;
    var buyBtn = root.querySelector('.js-addtocart.js-prod-submit-form, .js-addtocart, input[type="submit"][name="add"]');
    if (!buyBtn) return;
    root.setAttribute('data-nevux', '1');

    var C = NEVUX.color;
    var css =
      '.nvx-urg{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:10px 12px;margin:0 0 14px;font:600 13px/1.3 ' + FONT + ';color:#c2410c}' +
      '.nvx-urg-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px}' +
      '.nvx-urg-bg{height:7px;background:#ffedd5;border-radius:99px;overflow:hidden}' +
      '.nvx-urg-fill{height:100%;width:0;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:99px;transition:width 1.6s ease}' +
      '.nvx-packs{margin:0 0 14px;font-family:' + FONT + '}' +
      '.nvx-packs-t{font-weight:700;font-size:14px;margin-bottom:8px;color:#111827}' +
      '.nvx-pack{display:flex;align-items:center;justify-content:space-between;gap:10px;border:2px solid #e5e7eb;border-radius:12px;padding:10px 12px;margin-bottom:8px;cursor:pointer;background:#fff;transition:border-color .2s,background .2s;color:#111827}' +
      '.nvx-pack.nvx-on{border-color:' + C + ';background:' + C + '12}' +
      '.nvx-pack b{display:block;font-size:14px}' +
      '.nvx-pack small{font-size:12px;color:#6b7280}' +
      '.nvx-pack .nvx-pr{text-align:right;font-weight:800;font-size:14px;white-space:nowrap}' +
      '.nvx-pack .nvx-pr s{display:block;font-weight:400;font-size:11px;color:#9ca3af}' +
      '.nvx-tag{display:inline-block;background:' + C + ';color:' + NEVUX.colorTexto + ';font-size:10px;font-weight:800;border-radius:6px;padding:2px 6px;margin-left:6px;vertical-align:middle}' +
      '.nvx-trust{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0;padding:12px 8px;background:#f9fafb;border-radius:12px;text-align:center;font:600 11px/1.3 ' + FONT + ';color:#374151}' +
      '.nvx-trust span{display:block;font-size:18px;margin-bottom:2px}' +
      '.nvx-bar{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#fff;border-top:1px solid #e5e7eb;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;justify-content:space-between;gap:10px;box-shadow:0 -4px 20px rgba(0,0,0,.08);transform:translateY(110%);transition:transform .3s ease;font-family:' + FONT + '}' +
      '.nvx-bar.nvx-show{transform:none}' +
      // El botón flotante de WhatsApp de la plantilla sube para no quedar tapado por la barra
      '.nvx-bar-on .btn-whatsapp,.nvx-bar-on .js-btn-whatsapp,.nvx-bar-on .whatsapp-float{transform:translateY(-74px);transition:transform .3s}' +
      '.nvx-bar-i{display:flex;align-items:center;gap:10px;min-width:0}' +
      '.nvx-bar-i img{width:42px;height:42px;border-radius:8px;object-fit:cover;flex:0 0 auto}' +
      '.nvx-bar-t{font-size:12px;font-weight:600;color:#111827;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
      '.nvx-bar-p{font-size:15px;font-weight:800;color:' + C + '}' +
      '.nvx-bar button{flex:0 0 auto;background:' + C + ';color:' + NEVUX.colorTexto + ';font-weight:800;font-size:13px;padding:12px 16px;border:0;border-radius:10px;cursor:pointer}' +
      '.nvx-best{margin:0 0 14px;font-family:' + FONT + ';color:#111827}' +
      '.nvx-best-tag{display:inline-block;background:' + C + ';color:' + NEVUX.colorTexto + ';font-size:11px;font-weight:800;letter-spacing:.06em;border-radius:5px;padding:3px 7px}' +
      '.nvx-best-p{font-size:30px;font-weight:900;line-height:1.1;margin:4px 0 2px}' +
      '.nvx-best-p em{font-style:normal;font-size:15px;font-weight:800;color:' + C + ';margin-left:6px}' +
      '.nvx-best small{font-size:13px;color:#4b5563}' +
      '.nvx-best small b{color:' + C + '}' +
      '.nvx-ship{border:1px solid #e5e7eb;border-radius:12px;padding:4px 12px;margin:0 0 14px;font:13px/1.35 ' + FONT + ';color:#111827}' +
      '.nvx-ship-r{display:flex;gap:10px;padding:9px 0}' +
      '.nvx-ship-r + .nvx-ship-r{border-top:1px solid #f3f4f6}' +
      '.nvx-ship-r > span{font-size:18px;line-height:1}' +
      '.nvx-ship-r b{color:' + C + '}' +
      '.nvx-ship-r small{display:block;color:#6b7280;font-size:12px}' +
      '.nvx-fs-bg{height:6px;background:#f3f4f6;border-radius:99px;overflow:hidden;margin-top:6px}' +
      '.nvx-fs-bg i{display:block;height:100%;background:' + C + ';border-radius:99px}' +
      '.nvx-wa{display:block;text-align:center;margin:-4px 0 14px;font:13px ' + FONT + ';color:#374151;text-decoration:none}' +
      '.nvx-wa b{text-decoration:underline}' +
      '.nvx-c{font-family:inherit;color:#111827;margin:8px 0 18px}' +
      '.nvx-c *{box-sizing:border-box}' +
      '.nvx-sec{margin:0 0 22px}' +
      '.nvx-h{font-size:19px;font-weight:800;line-height:1.2;margin:0 0 10px;text-align:center}' +
      '.nvx-cinta{overflow:hidden;background:' + C + ';color:' + NEVUX.colorTexto + ';border-radius:10px;margin:0 0 22px;padding:9px 0;white-space:nowrap}' +
      '.nvx-cinta div{display:inline-block;animation:nvx-mq 28s linear infinite;font:800 12px/1 ' + FONT + ';letter-spacing:.08em;text-transform:uppercase}' +
      '.nvx-cinta span{margin:0 14px}' +
      '@keyframes nvx-mq{to{transform:translateX(-50%)}}' +
      '.nvx-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:14px}' +
      '.nvx-tl-row{display:flex;gap:8px}' +
      '.nvx-tl-row input{flex:1;min-width:0;border:1px solid #d1d5db;border-radius:10px;padding:11px 12px;font-size:16px}' +
      '.nvx-tl-row button{background:' + C + ';color:' + NEVUX.colorTexto + ';border:0;border-radius:10px;padding:11px 16px;font:800 14px ' + FONT + ';cursor:pointer;opacity:1;text-transform:none;letter-spacing:0;width:auto;height:auto}' +
      '.nvx-tl-res{margin:10px 0 0;font-size:14px;text-align:center;min-height:20px}' +
      '.nvx-tl-res b{color:' + C + '}' +
      '.nvx-tl-tab{display:grid;grid-template-columns:repeat(auto-fit,minmax(58px,1fr));gap:6px;margin-top:10px}' +
      '.nvx-tl-tab div{border:1px solid #e5e7eb;border-radius:8px;padding:6px 4px;text-align:center;font-size:11px;color:#6b7280}' +
      '.nvx-tl-tab div b{display:block;font-size:14px;color:#111827}' +
      '.nvx-tl-tab div.nvx-on{border-color:' + C + ';background:' + C + '14}' +
      '.nvx-small{font-size:12px;color:#6b7280;text-align:center;margin:8px 0 0}' +
      '.nvx-ad{position:relative;border-radius:14px;overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:pan-y}' +
      '.nvx-ad img{display:block;width:100%;height:auto;max-height:480px;object-fit:cover;pointer-events:none}' +
      '.nvx-ad .nvx-ad-d{position:absolute;inset:0;clip-path:inset(0 0 0 50%)}' +
      '.nvx-ad .nvx-ad-d img{width:100%;height:100%;object-fit:cover}' +
      '.nvx-ad-l{position:absolute;top:10px;z-index:2;background:rgba(0,0,0,.65);color:#fff;font-size:11px;font-weight:800;padding:4px 8px;border-radius:6px}' +
      '.nvx-ad-bar{position:absolute;top:0;bottom:0;left:50%;width:3px;margin-left:-1px;background:#fff;z-index:2;pointer-events:none}' +
      '.nvx-ad-bar:after{content:"↔";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:34px;height:34px;border-radius:50%;background:#fff;color:#111;display:grid;place-items:center;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,.3)}' +
      '.nvx-ad input{position:absolute;inset:0;width:100%;height:100%;opacity:0;margin:0;cursor:ew-resize;z-index:3}' +
      '.nvx-step{display:flex;gap:12px;align-items:flex-start;margin-bottom:10px}' +
      '.nvx-step i{flex:0 0 28px;height:28px;border-radius:50%;background:' + C + ';color:' + NEVUX.colorTexto + ';font-style:normal;font-weight:800;display:grid;place-items:center;font-size:13px}' +
      '.nvx-step b{display:block;font-size:15px}' +
      '.nvx-step p{margin:2px 0 0;font-size:13px;color:#4b5563}' +
      '.nvx-step img{display:block;width:100%;border-radius:10px;margin-top:8px}' +
      '.nvx-cmp{width:100%;border-collapse:collapse;font-size:13px}' +
      '.nvx-cmp th{font-size:12px;padding:8px 4px}' +
      '.nvx-cmp td{border-top:1px solid #f3f4f6;padding:10px 4px;text-align:center}' +
      '.nvx-cmp td:first-child{text-align:left;font-weight:600}' +
      '.nvx-cmp .nvx-m{background:' + C + '14;color:' + C + ';font-weight:900}' +
      '.nvx-cmp .nvx-x{color:#ef4444;font-weight:900}' +
      '.nvx-eb{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:' + C + ';text-align:center;margin:0 0 6px}' +
      '.nvx-ps{display:grid;gap:10px}' +
      '.nvx-ps>div{border-radius:14px;padding:14px 16px}' +
      '.nvx-ps b{display:block;font-size:13px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}' +
      '.nvx-ps p{display:flex;gap:9px;margin:0 0 8px;font-size:14px;line-height:1.4}' +
      '.nvx-ps i{font-style:normal;font-weight:900;flex:none}' +
      '.nvx-ps-a{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}.nvx-ps-a b,.nvx-ps-a i{color:#dc2626}' +
      '.nvx-ps-d{background:' + C + '12;border:1px solid ' + C + '55;color:#111827}.nvx-ps-d b,.nvx-ps-d i{color:' + C + '}' +
      '.nvx-cmpw{position:relative}' +
      '.nvx-cmpw .nvx-cmp{position:relative;z-index:1}' +
      '.nvx-cmp-bar{position:absolute;top:0;height:0;border-radius:12px;background:linear-gradient(180deg,' + C + '30,' + C + '55);box-shadow:inset 0 -4px 0 ' + C + ';pointer-events:none;transition:height .15s linear}' +
      '.nvx-cmp td.nvx-m{transition:transform .35s cubic-bezier(.2,1.6,.4,1),color .3s}' +
      '.nvx-cmpw.nvx-anim td.nvx-m{opacity:.35}' +
      '.nvx-cmpw.nvx-anim tr.nvx-on td.nvx-m{opacity:1;transform:scale(1.25)}' +
      '.nvx-rv{margin-bottom:10px}' +
      '.nvx-rv-h{display:flex;align-items:center;gap:10px;margin-bottom:6px}' +
      '.nvx-rv-h i{flex:0 0 34px;height:34px;border-radius:50%;background:' + C + ';color:' + NEVUX.colorTexto + ';font-style:normal;font-weight:800;display:grid;place-items:center}' +
      '.nvx-rv-h small{display:block;color:#6b7280;font-size:12px}' +
      '.nvx-rv-s{color:#f59e0b;font-size:13px}' +
      '.nvx-rv p{margin:6px 0 0;font-size:14px;line-height:1.45}' +
      '.nvx-rv em{display:block;margin-top:6px;font-style:normal;font-size:12px;color:#059669;font-weight:700}' +
      '.nvx-faq{border:1px solid #e5e7eb;border-radius:12px;margin-bottom:8px;background:#fff}' +
      '.nvx-faq summary{cursor:pointer;list-style:none;padding:13px 40px 13px 14px;font-weight:700;font-size:14px;position:relative}' +
      '.nvx-faq summary::-webkit-details-marker{display:none}' +
      '.nvx-faq summary:after{content:"+";position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:20px;color:' + C + '}' +
      '.nvx-faq[open] summary:after{content:"−"}' +
      '.nvx-faq div{padding:0 14px 14px;font-size:14px;color:#4b5563;line-height:1.5}' +
      '.nvx-cd b{color:#dc2626}' +
      '.nvx-pk-t{display:block;font-size:11px;color:' + C + ';font-weight:700;margin-top:1px}' +
      '.nvx-combo{display:flex;gap:12px;align-items:center;border:1px dashed ' + C + ';border-radius:14px;padding:10px;margin:0 0 18px;background:#fff}' +
      '.nvx-combo img{width:64px;height:64px;border-radius:10px;object-fit:cover;flex:0 0 auto}' +
      '.nvx-combo small{display:block;font-size:11px;font-weight:800;letter-spacing:.06em;color:' + C + ';text-transform:uppercase}' +
      '.nvx-combo b{display:block;font-size:13px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
      '.nvx-combo span{font-size:14px;font-weight:800}' +
      '.nvx-combo button{flex:0 0 auto;margin-left:auto;background:' + C + ';color:' + NEVUX.colorTexto + ';border:0;border-radius:10px;padding:10px 12px;font:800 13px ' + FONT + ';cursor:pointer;opacity:1}' +
      '.nvx-combo button:disabled{opacity:1;background:' + C + ';color:' + NEVUX.colorTexto + ';cursor:default}' +
      '.nvx-combo a{display:block;font-size:12px;color:' + C + ';font-weight:700;margin-top:2px}' +
      '.nvx-vids{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px;scrollbar-width:none}' +
      '.nvx-vids::-webkit-scrollbar{display:none}' +
      '.nvx-vids > div{flex:0 0 62%;max-width:260px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:#111;scroll-snap-align:center}' +
      '.nvx-vids video,.nvx-vids iframe{width:100%;height:100%;object-fit:cover;border:0;display:block}' +
      '.nvx-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}' +
      '.nvx-cols button{border:2px solid #e5e7eb;border-radius:12px;padding:0;overflow:hidden;background:#fff;cursor:pointer;text-align:center;font:700 12px ' + FONT + ';color:#111827;opacity:1}' +
      '.nvx-cols button img{display:block;width:100%;aspect-ratio:1;object-fit:cover}' +
      '.nvx-cols button span{display:block;padding:7px 4px;text-transform:uppercase;letter-spacing:.04em}' +
      '.nvx-cols button.nvx-on{border-color:' + C + '}' +
      '@media (prefers-reduced-motion: reduce){.nvx-cinta div{animation:none}}';
    var M = NEVUX.marca;
    if (M) {
      var rad = M.radio != null ? M.radio + 'px' : null;
      css += (M.fondo || M.borde || rad ? '.nvx-card,.nvx-faq,.nvx-pack,.nvx-ship,.nvx-combo,.nvx-trust{' + (M.fondo ? 'background:' + M.fondo + ';' : '') +
          (M.borde ? 'border-color:' + M.borde + ';' : '') + (rad ? 'border-radius:' + rad + ';' : '') + '}' : '') +
        (M.texto ? '.nvx-c,.nvx-pack,.nvx-ship,.nvx-combo,.nvx-trust,.nvx-packs-t{color:' + M.texto + '}' : '') +
        (M.secundario ? '.nvx-h,.nvx-packs-t{color:' + M.secundario + '}.nvx-cinta{background:' + M.secundario + '}' : '') +
        (M.fuente ? '.nvx-c,.nvx-packs,.nvx-ship,.nvx-combo,.nvx-trust,.nvx-best{font-family:' + M.fuente + '}' : '');
    }
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var priceEl = root.querySelector('#price_display, .js-price-display');
    var titleEl = root.querySelector('.js-product-name, h1');
    var imgEl = root.querySelector('.js-product-slide img, img[src*="/products/"], img[data-srcset*="/products/"]');

    function priceNumber() {
      var t = priceEl ? priceEl.textContent.replace(/[^\d,]/g, '').replace(',', '.') : '';
      return parseFloat(t) || 0;
    }
    function money(n) {
      return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Datos reales de la tienda (Tiendanube los expone en window.LS)
    var variant = window.LS && LS.variants && LS.variants[0];
    var cuotasSin = 0;
    try {
      var inst = JSON.parse(variant.installments_data);
      Object.keys(inst).forEach(function (g) {
        Object.keys(inst[g]).forEach(function (n) {
          if (inst[g][n].without_interests && +n > cuotasSin) cuotasSin = +n;
        });
      });
    } catch (e) {}
    var precio = (variant && variant.price_number) || priceNumber();
    var transf = NEVUX.transferencia;
    if (!transf && variant && variant.price_with_payment_discount_short) {
      var pd = parseFloat(variant.price_with_payment_discount_short.replace(/[^\d,]/g, '').replace(',', '.'));
      if (pd && precio) transf = Math.round((1 - pd / precio) * 100);
    }
    var cuotasTxt = cuotasSin > 1 ? cuotasSin + ' cuotas sin interés' : 'Pagá en cuotas';

    // 1) Barra de urgencia, debajo del bloque de precio
    var priceBox = priceEl ? (priceEl.closest('.js-price-container, .price-container') || priceEl.parentElement) : null;
    if (priceBox) {
      priceBox.insertAdjacentHTML('afterend',
        '<div class="nvx-urg"><div class="nvx-urg-top"><span>' + NEVUX.urgencia.texto + '</span><span>' +
        NEVUX.urgencia.porcentaje + '% vendido</span></div><div class="nvx-urg-bg"><div class="nvx-urg-fill"></div></div></div>');
      setTimeout(function () {
        var f = root.querySelector('.nvx-urg-fill');
        if (f) f.style.width = NEVUX.urgencia.porcentaje + '%';
      }, 400);
    }

    // 1a) Medios de pago en chips
    if (priceBox && NEVUX.mediosDePago && NEVUX.mediosDePago.length) {
      var MPC = { visa: '#1a1f71', mastercard: '#eb001b', 'american express': '#2e77bc', amex: '#2e77bc', naranja: '#fe5000', cabal: '#00557f', 'mercado pago': '#00a2e8', maestro: '#0099df' };
      hCss('nvx-pay-css',
        '.nvx-pay{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px;font-family:' + FONT + '}' +
        '.nvx-pay span{border:1px solid #e5e7eb;background:#fff;border-radius:7px;padding:5px 9px;font-size:11px;font-weight:900;letter-spacing:.02em;color:#374151}');
      priceBox.insertAdjacentHTML('afterend', '<div class="nvx-pay">' + NEVUX.mediosDePago.map(function (m) {
        var c = MPC[String(m).toLowerCase()];
        return '<span' + (c ? ' style="color:' + c + '"' : '') + '>' + hEsc(m) + '</span>';
      }).join('') + '</div>');
    }

    // 1b) Bloque de precios en tarjetas: transferencia (color de la tienda) y cuotas sin interés (oscura)
    if (priceBox && NEVUX.precios && precio && (transf > 0 || cuotasSin > 1)) {
      var PR = NEVUX.precios === true ? {} : NEVUX.precios;
      var Mp = NEVUX.marca || {};
      var oscuro = Mp.oscuro || '#111827';
      hCss('nvx-prc-css',
        '.nvx-prc{display:grid;gap:10px;margin:0 0 16px;font-family:' + FONT + ';text-align:left}' +
        '.nvx-prc-c{border-radius:16px;padding:14px 16px;position:relative;overflow:hidden}' +
        '.nvx-prc-t{background:linear-gradient(135deg,' + C + ',' + C + 'cc);color:' + NEVUX.colorTexto + ';box-shadow:0 10px 24px ' + C + '40}' +
        '.nvx-prc-q{background:' + oscuro + ';color:#fff}' +
        '.nvx-prc-l{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.9;padding-right:78px}' +
        '.nvx-prc-p{font-size:30px;font-weight:900;line-height:1.1;margin-top:3px;letter-spacing:-.01em}' +
        '.nvx-prc-s{font-size:12.5px;opacity:.85;margin-top:3px}' +
        '.nvx-prc-b{position:absolute;right:12px;top:12px;font-size:12px;font-weight:900;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.22)}' +
        '.nvx-prc-q .nvx-prc-p{font-size:26px}');
      var tarj = '';
      if (transf > 0) {
        var conT = precio * (1 - transf / 100);
        tarj += '<div class="nvx-prc-c nvx-prc-t"><span class="nvx-prc-b">' + transf + '% OFF</span>' +
          '<div class="nvx-prc-l">' + hEsc(PR.transferencia || 'Pagando con transferencia') + '</div>' +
          '<div class="nvx-prc-p">' + money(conT) + '</div>' +
          '<div class="nvx-prc-s">Ahorrás ' + money(precio - conT) + '</div></div>';
      }
      if (cuotasSin > 1) {
        tarj += '<div class="nvx-prc-c nvx-prc-q"><div class="nvx-prc-l">' + cuotasSin + ' ' + hEsc(PR.cuotas || 'cuotas sin interés de') + '</div>' +
          '<div class="nvx-prc-p">' + money(precio / cuotasSin) + '</div>' +
          '<div class="nvx-prc-s">Precio final ' + money(precio) + '</div></div>';
      }
      priceBox.insertAdjacentHTML('afterend', '<div class="nvx-prc">' + tarj + '</div>');
    }

    // 1b) Mejor precio por transferencia, pegado al precio (si no se usa el bloque de precios)
    if (priceBox && !NEVUX.precios && transf > 0 && precio) {
      var conDesc = precio * (1 - transf / 100);
      priceBox.insertAdjacentHTML('afterend',
        '<div class="nvx-best"><span class="nvx-best-tag">MEJOR PRECIO</span><div class="nvx-best-p">' + money(conDesc) +
        '<em>' + transf + '% OFF</em></div><small>por transferencia · <b>ahorrás ' + money(precio - conDesc) + '</b>' +
        (cuotasSin > 1 ? ' · ' + cuotasSin + ' cuotas sin interés de ' + money(precio / cuotasSin) : '') + '</small></div>');
    }

    // 1c) Entrega estimada y envío gratis
    var rows = '';
    if (NEVUX.envio) {
      var E = NEVUX.envio;
      var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
      var desp = new Date(now);
      if (E.dias.indexOf(desp.getDay()) < 0 || now.getHours() >= E.corte) {
        do { desp.setDate(desp.getDate() + 1); } while (E.dias.indexOf(desp.getDay()) < 0);
      }
      var habiles = function (d, n) {
        var r = new Date(d);
        while (n > 0) { r.setDate(r.getDate() + 1); if (r.getDay() % 6) n--; }
        return r;
      };
      var DS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
      var DL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      var MS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      var fmt = function (d) { return DS[d.getDay()] + ' ' + d.getDate() + ' de ' + MS[d.getMonth()]; };
      var dif = Math.round((new Date(desp.toDateString()) - new Date(now.toDateString())) / 864e5);
      var cuando = dif === 0 ? 'hoy' : dif === 1 ? 'mañana' : 'el ' + DL[desp.getDay()];
      rows += '<div class="nvx-ship-r"><span>📦</span><div><b>Llega entre el ' + fmt(habiles(desp, E.min)) + ' y el ' +
        fmt(habiles(desp, E.max)) + '</b> ' + (E.zona || '') + (dif === 0 && !NEVUX.cuentaRegresiva
          ? '<small class="nvx-cd">Pedí en las próximas <b></b> y sale hoy</small>'
          : '<small>Despachamos ' + cuando + '</small>') + '</div></div>';
    }
    if (NEVUX.envioGratisDesde > 0 && precio) {
      var falta = NEVUX.envioGratisDesde - precio;
      rows += '<div class="nvx-ship-r"><span>🚚</span><div style="flex:1">' + (falta > 0
        ? 'Envío gratis desde ' + money(NEVUX.envioGratisDesde) + ' · <b>te faltan ' + money(falta) + '</b><div class="nvx-fs-bg"><i style="width:' +
          Math.round(precio / NEVUX.envioGratisDesde * 100) + '%"></i></div>'
        : '<b>Este producto tiene envío gratis</b>') + '</div></div>';
    }
    var urgEl = root.querySelector('.nvx-urg');
    if (rows && (urgEl || priceBox)) (urgEl || priceBox).insertAdjacentHTML('afterend', '<div class="nvx-ship">' + rows + '</div>');
    // Cuenta regresiva hasta la hora de corte del despacho
    var cd = root.querySelector('.nvx-cd');
    if (cd) {
      var tick = function () {
        var n = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
        var fin = new Date(n); fin.setHours(NEVUX.envio.corte, 0, 0, 0);
        var m = Math.ceil((fin - n) / 60000);
        if (m <= 0) { cd.textContent = 'Tu pedido sale en el próximo despacho'; clearInterval(cdTimer); return; }
        cd.querySelector('b').textContent = (m >= 60 ? Math.floor(m / 60) + ' h ' : '') + (m % 60) + ' min';
      };
      var cdTimer = setInterval(tick, 30000);
      tick();
    }

    // 2) Selector de packs: cambia la cantidad del formulario
    var qtyInput = root.querySelector('.js-quantity-input, input[name="quantity"]');
    var form = buyBtn.closest('form');
    if (qtyInput && form && NEVUX.packs.length) {
      var base = priceNumber();
      var html = '<div class="nvx-packs"><div class="nvx-packs-t">Elegí tu pack</div>';
      NEVUX.packs.forEach(function (p, i) {
        var full = base * p.cantidad;
        var final = full * (1 - p.descuento / 100);
        html += '<div class="nvx-pack" data-i="' + i + '"><div><b>' + p.titulo +
          (p.descuento ? ' · ' + p.descuento + '% OFF' : '') +
          (p.etiqueta ? '<span class="nvx-tag">' + p.etiqueta + '</span>' : '') + '</b><small>' +
          (p.descuento ? 'Ahorrás ' + money(full - final) : 'Precio de lista') + '</small>' +
          (transf > 0 && base ? '<span class="nvx-pk-t">' + money(final * (1 - transf / 100)) + ' con transferencia</span>' : '') + '</div>' +
          '<div class="nvx-pr">' + (p.descuento ? '<s>' + money(full) + '</s>' : '') + (base ? money(final) : '') + '</div></div>';
      });
      html += '</div>';
      form.insertAdjacentHTML('afterbegin', html);
      var packs = form.querySelectorAll('.nvx-pack');
      var pick = function (i) {
        packs.forEach(function (el, j) { el.classList.toggle('nvx-on', j === i); });
        qtyInput.value = NEVUX.packs[i].cantidad;
        qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
        qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
      };
      packs.forEach(function (el, i) { el.addEventListener('click', function () { pick(i); }); });
      pick(0);
    }

    // 2b) Cuenta regresiva grande, justo antes de los packs (o debajo de la entrega si no hay packs)
    montarCuenta(NEVUX.cuentaRegresiva, function (html) {
      if (document.querySelector('.nvh-crw')) return null; // la home ya tiene su banner (ficha incrustada en la home)
      var antes = root.querySelector('.nvx-packs');
      var despues = root.querySelector('.nvx-ship') || root.querySelector('.nvx-urg') || priceBox;
      if (antes) antes.insertAdjacentHTML('beforebegin', html);
      else if (despues) despues.insertAdjacentHTML('afterend', html);
      else return null;
      return root.querySelector('.nvx-cr-ficha');
    }, 'nvx-cr-ficha');

    // 3) Insignias de confianza, debajo del botón de compra
    var btnBox = buyBtn.closest('.cart-button-container') || buyBtn;
    // Si el botón está en una columna o grilla angosta de la plantilla, las insignias van debajo del bloque completo
    var ancho = (form || root).getBoundingClientRect().width;
    while (btnBox.parentElement && btnBox.parentElement !== form && btnBox.getBoundingClientRect().width < ancho * 0.9) btnBox = btnBox.parentElement;
    var trust = '<div class="nvx-trust">';
    NEVUX.confianza.forEach(function (t) {
      var s = t.split(' ');
      trust += '<div><span>' + s.shift() + '</span>' + s.join(' ').replace('{cuotas}', cuotasTxt) + '</div>';
    });
    btnBox.insertAdjacentHTML('afterend', trust + '</div>');

    // 3b) Ayuda por WhatsApp
    if (NEVUX.whatsapp) {
      var msg = 'Hola! Tengo una consulta sobre ' + (titleEl ? titleEl.textContent.trim() : 'un producto') + ' ' + location.href;
      root.querySelector('.nvx-trust').insertAdjacentHTML('afterend',
        '<a class="nvx-wa" target="_blank" rel="noopener" href="https://wa.me/' + NEVUX.whatsapp + '?text=' +
        encodeURIComponent(msg) + '">¿Dudas con este producto? <b>Escribinos por WhatsApp</b></a>');
    }

    // 6) Contenido de la ficha: cinta, talles, antes/después, pasos, comparativa, reseñas y preguntas
    var esc = function (t) {
      return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    };
    // Elige una opción de variante (talle, color) en la ficha: botón de la plantilla o select
    var elegir = function (valor) {
      var t = String(valor).toLowerCase();
      var btn = [].slice.call(root.querySelectorAll('.js-insta-variant[data-option], a[data-option]')).filter(function (e) {
        return (e.getAttribute('data-option') || '').toLowerCase() === t;
      })[0];
      if (btn) { btn.click(); return true; }
      var ok = false;
      [].slice.call(root.querySelectorAll('select')).forEach(function (sel) {
        [].slice.call(sel.options).forEach(function (o) {
          if (!ok && (o.value.toLowerCase() === t || o.text.trim().toLowerCase() === t)) {
            sel.value = o.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            ok = true;
          }
        });
      });
      return ok;
    };
    var cont = '';
    if (NEVUX.combina && (NEVUX.combina === 'auto' || NEVUX.combina.url)) {
      cont += '<div class="nvx-combo" hidden></div>';
    }
    if (NEVUX.cinta && NEVUX.cinta.length) {
      var items = NEVUX.cinta.map(function (t) { return '<span>' + esc(t) + '</span><span>·</span>'; }).join('');
      cont += '<div class="nvx-cinta"><div>' + items + items + items + items + '</div></div>';
    }
    var T = NEVUX.talles;
    if (T && T.tabla && T.tabla.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(T.titulo || 'Encontrá tu talle') + '</div><div class="nvx-card">' +
        '<div style="font-weight:700;font-size:14px;margin-bottom:8px">' + esc(T.medida || 'Tu medida') + ' (' + esc(T.unidad || 'cm') + ')</div>' +
        '<div class="nvx-tl-row"><input type="number" inputmode="decimal" placeholder="Ej: ' + T.tabla[Math.floor(T.tabla.length / 2)].min + '" aria-label="' + esc(T.medida || 'Medida') + '"><button type="button">Ver mi talle</button></div>' +
        '<div class="nvx-tl-res"></div><div class="nvx-tl-tab">' +
        T.tabla.map(function (r) { return '<div data-t="' + esc(r.talle) + '"><b>' + esc(r.talle) + '</b>' + (r.min === r.max ? r.min : r.min + '-' + r.max) + '</div>'; }).join('') +
        '</div>' + (T.nota ? '<p class="nvx-small">' + esc(T.nota) + '</p>' : '') + '</div></div>';
    }
    if (NEVUX.colores && NEVUX.colores.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">Elegí tu color</div><div class="nvx-cols">' +
        NEVUX.colores.map(function (c) {
          return '<button type="button" data-c="' + esc(c.nombre) + '">' + (c.foto ? '<img src="' + esc(c.foto) + '" alt="' + esc(c.nombre) + '" loading="lazy">' : '') +
            '<span>' + esc(c.nombre) + '</span></button>';
        }).join('') + '</div><p class="nvx-small nvx-col-msg"></p></div>';
    }
    var AD = NEVUX.antesDespues;
    if (AD && AD.antes && AD.despues) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(AD.titulo || 'Mirá la diferencia') + '</div><div class="nvx-ad">' +
        '<img src="' + esc(AD.antes) + '" alt="Antes" loading="lazy"><div class="nvx-ad-d"><img src="' + esc(AD.despues) + '" alt="Después" loading="lazy"></div>' +
        '<span class="nvx-ad-l" style="left:10px">ANTES</span><span class="nvx-ad-l" style="right:10px;background:' + C + '">DESPUÉS</span>' +
        '<div class="nvx-ad-bar"></div><input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después"></div>' +
        '<p class="nvx-small">← Deslizá para comparar →</p></div>';
    }
    if (NEVUX.videos && NEVUX.videos.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">Miralo en acción</div><div class="nvx-vids">' +
        NEVUX.videos.map(function (v) {
          if (v.youtube) {
            var id = esc(v.youtube);
            return '<div><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id +
              '&controls=0&playsinline=1&rel=0" allow="autoplay; encrypted-media" title="Video"></iframe></div>';
          }
          return '<div><video src="' + esc(v.mp4) + '" muted loop playsinline preload="metadata"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') + '></video></div>';
        }).join('') + '</div></div>';
    }
    var P = NEVUX.pasos;
    if (P && P.items && P.items.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(P.titulo || 'Cómo se usa') + '</div><div class="nvx-card">' +
        P.items.map(function (it, i) {
          return '<div class="nvx-step"><i>' + (i + 1) + '</i><div style="flex:1"><b>' + esc(it.titulo) + '</b>' +
            (it.texto ? '<p>' + esc(it.texto) + '</p>' : '') + (it.foto ? '<img src="' + esc(it.foto) + '" alt="" loading="lazy">' : '') + '</div></div>';
        }).join('') + '</div></div>';
    }
    var PS = NEVUX.problemaSolucion;
    if (PS && PS.antes && PS.despues) {
      cont += '<div class="nvx-sec">' + (PS.etiqueta ? '<div class="nvx-eb">' + esc(PS.etiqueta) + '</div>' : '') +
        '<div class="nvx-h">' + esc(PS.titulo || 'Antes vs. después') + '</div><div class="nvx-ps">' +
        '<div class="nvx-ps-a"><b>✕ ' + esc(PS.antesTitulo || 'Antes') + '</b>' + PS.antes.map(function (t) { return '<p><i>✕</i>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '<div class="nvx-ps-d"><b>✓ ' + esc(PS.despuesTitulo || 'Ahora') + '</b>' + PS.despues.map(function (t) { return '<p><i>✓</i>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '</div></div>';
    }
    var CP = NEVUX.comparativa;
    if (CP && CP.filas && CP.filas.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(CP.titulo || '¿Por qué elegirnos?') + '</div><div class="nvx-card" style="padding:6px 10px">' +
        '<div class="nvx-cmpw"><div class="nvx-cmp-bar"></div><table class="nvx-cmp"><tr><th></th><th class="nvx-m">' + esc(CP.marca || 'Nosotros') + '</th><th>' + esc(CP.otro || 'Otros') + '</th></tr>' +
        CP.filas.map(function (f) { return '<tr><td>' + esc(f) + '</td><td class="nvx-m">✓</td><td class="nvx-x">✕</td></tr>'; }).join('') +
        '</table></div></div></div>';
    }
    if (NEVUX.resenas && NEVUX.resenas.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">Lo que dicen nuestros clientes</div>' +
        NEVUX.resenas.map(function (r) {
          var n = Math.max(1, Math.min(5, r.estrellas || 5));
          return '<div class="nvx-card nvx-rv"><div class="nvx-rv-h"><i>' + esc((r.nombre || '?').charAt(0)) + '</i><div><b>' + esc(r.nombre) + '</b>' +
            (r.lugar ? '<small>' + esc(r.lugar) + '</small>' : '') + '</div></div><div class="nvx-rv-s">' + '★★★★★'.slice(0, n) + '</div>' +
            '<p>“' + esc(r.texto) + '”</p>' + (r.verificada ? '<em>✓ Compra verificada</em>' : '') + '</div>';
        }).join('') + '</div>';
    }
    var faqs = (NEVUX.faq || []).slice();
    if (NEVUX.faqDevoluciones) {
      faqs.push({ p: '¿Puedo devolverlo si me arrepiento?', r: 'Sí. Por ser una compra a distancia tenés 10 días corridos desde que lo recibís para arrepentirte (art. 34 de la Ley 24.240 de Defensa del Consumidor). Escribinos y te indicamos cómo devolverlo.' });
    }
    if (faqs.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">Preguntas frecuentes</div>' +
        faqs.map(function (f) { return '<details class="nvx-faq"><summary>' + esc(f.p) + '</summary><div>' + esc(f.r) + '</div></details>'; }).join('') + '</div>';
    }
    if (cont) {
      var after = root.querySelector('.nvx-wa') || root.querySelector('.nvx-trust');
      if (NEVUX.estiloFicha === 'oscuro') {
        var O = (NEVUX.marca && NEVUX.marca.oscuro) || '#0b0f17';
        var ola = function (abajo) {
          return '<svg class="nvx-ola" viewBox="0 0 1200 40" preserveAspectRatio="none" style="' + (abajo ? 'transform:rotate(180deg);' : '') + '"><path d="M0 40V22C150 2 300 2 450 16s300 24 450 6 225-20 300-12v28z" fill="' + O + '"/></svg>';
        };
        hCss('nvx-osc-css',
          '.nvx-osc{background:' + O + ';color:#f3f4f6;margin:-1px -16px;padding:8px 16px 4px;position:relative}' +
          '.nvx-ola{display:block;width:calc(100% + 32px);height:26px;margin:18px -16px 0}.nvx-ola+.nvx-osc+.nvx-ola,.nvx-osc+.nvx-ola{margin:0 -16px 18px}' +
          '.nvx-osc .nvx-h{color:#fff;text-transform:uppercase;letter-spacing:.02em}' +
          '.nvx-osc .nvx-card,.nvx-osc .nvx-faq,.nvx-osc .nvx-step{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.12);color:#f3f4f6}' +
          '.nvx-osc .nvx-faq div,.nvx-osc .nvx-step p,.nvx-osc .nvx-rv p{color:#cbd5e1}' +
          '.nvx-osc .nvx-cmp td{border-color:rgba(255,255,255,.08)}.nvx-osc .nvx-cmp td:first-child,.nvx-osc .nvx-cmp th{color:#f3f4f6}' +
          '.nvx-osc .nvx-combo{background:rgba(255,255,255,.06);color:#f3f4f6}.nvx-osc .nvx-combo *{color:inherit}.nvx-osc .nvx-combo button,.nvx-osc .nvx-combo .nvx-cb-add{color:' + NEVUX.colorTexto + '}' +
          '.nvx-osc .nvx-ps-a{background:rgba(220,38,38,.1);border-color:rgba(220,38,38,.35);color:#fecaca}' +
          '.nvx-osc .nvx-ps-d{background:' + C + '1f;border-color:' + C + '66;color:#f3f4f6}');
        after.insertAdjacentHTML('afterend', '<div class="nvx-c">' + ola(false) + '<div class="nvx-osc">' + cont + '</div>' + ola(true) + '</div>');
      } else {
        after.insertAdjacentHTML('afterend', '<div class="nvx-c">' + cont + '</div>');
      }
      var box = root.querySelector('.nvx-c');

      // Calculadora: busca el talle y lo elige en la ficha
      var tlBtn = box.querySelector('.nvx-tl-row button');
      if (tlBtn) {
        var tlIn = box.querySelector('.nvx-tl-row input');
        var tlRes = box.querySelector('.nvx-tl-res');
        var calcular = function () {
          var v = parseFloat(String(tlIn.value).replace(',', '.'));
          box.querySelectorAll('.nvx-tl-tab div').forEach(function (d) { d.classList.remove('nvx-on'); });
          if (!v) { tlRes.textContent = 'Ingresá tu medida en ' + (T.unidad || 'cm') + '.'; return; }
          var hits = T.tabla.filter(function (r) { return v >= r.min && v <= r.max; });
          var r = hits[hits.length - 1];
          if (!r) {
            tlRes.innerHTML = 'Esa medida está fuera de la tabla.' + (NEVUX.whatsapp ? ' <b>Escribinos y te asesoramos.</b>' : '');
            return;
          }
          var cell = box.querySelector('.nvx-tl-tab div[data-t="' + esc(r.talle).replace(/"/g, '') + '"]');
          if (cell) cell.classList.add('nvx-on');
          var elegido = elegir(r.talle);
          tlRes.innerHTML = 'Tu talle es <b>' + esc(r.talle) + '</b>' + (elegido ? ' · ya lo elegimos en la ficha ✓' : '');
        };
        tlBtn.addEventListener('click', calcular);
        tlIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); calcular(); } });
      }

      // Galería de colores
      box.querySelectorAll('.nvx-cols button').forEach(function (b) {
        b.addEventListener('click', function () {
          box.querySelectorAll('.nvx-cols button').forEach(function (x) { x.classList.toggle('nvx-on', x === b); });
          var ok = elegir(b.getAttribute('data-c'));
          box.querySelector('.nvx-col-msg').textContent = ok ? 'Color ' + b.getAttribute('data-c') + ' elegido en la ficha ✓' : '';
        });
      });

      // Videos: se reproducen solo cuando están en pantalla
      var vids = box.querySelectorAll('.nvx-vids video');
      if (vids.length && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.play().catch(function () {}); } else { e.target.pause(); } });
        }, { threshold: 0.6 });
        vids.forEach(function (v) { io.observe(v); });
      }

      // Combiná con: lee el producto complementario y lo agrega al carrito sin salir de la ficha
      var combo = box.querySelector('.nvx-combo');
      if (combo) {
        var url;
        if (NEVUX.combina === 'auto') {
          // Automático: el primer producto relacionado de la página que no sea este
          var rel = [].slice.call(document.querySelectorAll('.js-item-product a[href*="/productos/"], .js-product-container a[href*="/productos/"]')).filter(function (a) {
            return !a.closest('#single-product') && a.pathname !== location.pathname;
          })[0];
          url = rel ? location.origin + rel.pathname : null;
        } else {
          try { url = location.origin + new URL(NEVUX.combina.url, location.href).pathname; } catch (e) { url = null; }
        }
        if (url) {
          fetch(url).then(function (r) { return r.text(); }).then(function (h) {
            var d = new DOMParser().parseFromString(h, 'text/html');
            var f = d.querySelector('#product_form, .js-product-form');
            var b = d.querySelector('.js-addtocart');
            if (!f || !b || b.disabled || b.classList.contains('disabled')) return;
            var nombre = (d.querySelector('.js-product-name, h1') || {}).textContent || '';
            var pr = (d.querySelector('#price_display, .js-price-display') || {}).textContent || '';
            var img = (d.querySelector('meta[property="og:image"]') || {}).content || '';
            combo.innerHTML = (img ? '<img src="' + esc(img.replace(/^http:/, 'https:')) + '" alt="">' : '') +
              '<div style="min-width:0"><small>' + esc(NEVUX.combina.titulo || 'Combiná con') + '</small><b>' + esc(nombre.trim()) + '</b><span>' + esc(pr.trim()) + '</span></div>' +
              '<button type="button">Agregar +</button>';
            combo.hidden = false;
            var btn = combo.querySelector('button');
            btn.addEventListener('click', function () {
              btn.disabled = true; btn.textContent = 'Agregando…';
              var body = new URLSearchParams(new FormData(f));
              fetch(location.origin + (f.getAttribute('action') || '/comprar/'), {
                method: 'POST', body: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              }).then(function (r) {
                if (!r.ok) throw new Error();
                btn.textContent = '✓ Agregado';
                combo.querySelector('div').insertAdjacentHTML('beforeend', '<a href="/comprar/">Ver carrito →</a>');
              }).catch(function () { btn.disabled = false; btn.textContent = 'Reintentar'; });
            });
          }).catch(function () {});
        }
      }

      // Antes / después
      var ad = box.querySelector('.nvx-ad');
      if (ad) {
        ad.querySelector('input').addEventListener('input', function () {
          ad.querySelector('.nvx-ad-d').style.clipPath = 'inset(0 0 0 ' + this.value + '%)';
          ad.querySelector('.nvx-ad-bar').style.left = this.value + '%';
        });
      }
    }

    // 4) Botón de compra pegajoso
    document.body.insertAdjacentHTML('beforeend',
      '<div class="nvx-bar" id="nvxBar"><div class="nvx-bar-i">' +
      (imgEl ? '<img src="' + (imgEl.currentSrc || imgEl.src) + '" alt="">' : '') +
      '<div><div class="nvx-bar-t"></div><div class="nvx-bar-p"></div></div></div><button type="button">' + NEVUX.boton + '</button></div>');
    var bar = document.getElementById('nvxBar');
    bar.querySelector('.nvx-bar-t').textContent = titleEl ? titleEl.textContent.trim() : '';
    bar.querySelector('.nvx-bar-p').textContent = priceEl ? priceEl.textContent.trim() : '';
    bar.querySelector('button').addEventListener('click', function () { buyBtn.click(); });
    var onScroll = function () {
      var on = buyBtn.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('nvx-show', on);
      document.body.classList.toggle('nvx-bar-on', on);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

  }

  // ===== HOME Y TARJETAS DE PRODUCTO =====
  function hEsc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function hMoney(n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function hNum(t) { return parseFloat(String(t || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0; }
  function hCss(id, css) {
    if (document.getElementById(id)) return;
    var st = document.createElement('style'); st.id = id; st.textContent = css; document.head.appendChild(st);
  }

  // Tarjetas de producto: mejor precio por transferencia y "QUEDAN N"
  function initTarjetas() {
    var T = NEVUX.tarjetas;
    if (!T) return;
    var C = NEVUX.color;
    hCss('nvx-t-css',
      '.nvx-tw{margin:6px 0 2px;font-family:' + FONT + '}' +
      '.nvx-tc{background:' + C + '14;border-radius:8px;padding:6px 8px;line-height:1.15}' +
      '.nvx-tc span{display:block;font-size:9px;font-weight:800;letter-spacing:.08em;color:' + C + '}' +
      '.nvx-tc b{display:block;font-size:17px;font-weight:900;color:#111827}' +
      '.nvx-tc small{display:block;font-size:10px;color:#6b7280}' +
      '.nvx-tq{display:inline-block;margin-top:5px;background:#dc2626;color:#fff;font-size:9px;font-weight:800;letter-spacing:.06em;border-radius:5px;padding:2px 6px}');
    var cards = document.querySelectorAll('.js-item-product, .js-product-container');
    [].forEach.call(cards, function (card) {
      // La ficha principal no es una tarjeta (las tarjetas de algunas plantillas traen su propio formulario de compra rápida)
      if (card.getAttribute('data-nvx-t') || card.id === 'single-product' || card.querySelector('#product_form')) return;
      card.setAttribute('data-nvx-t', '1');
      var pr = card.querySelector('.js-price-display');
      if (!pr) return;
      var precio = hNum(pr.textContent);
      var html = '';
      if (T.estilo === 'destacado') {
        html += tarjetaDestacada(card, precio, T);
      } else if (T.transferencia > 0 && precio) {
        html += '<div class="nvx-tc"><span>MEJOR PRECIO</span><b>' + hMoney(precio * (1 - T.transferencia / 100)) + '</b><small>pagando por transferencia</small></div>';
      }
      if (T.quedan) {
        try {
          var dvEl = card.hasAttribute('data-variants') ? card : card.querySelector('[data-variants]');
          var vs = dvEl ? JSON.parse(dvEl.getAttribute('data-variants')) : null;
          if (vs && vs.every(function (v) { return v.stock != null; })) {
            var stock = vs.reduce(function (s, v) { return s + (+v.stock || 0); }, 0);
            if (stock > 0 && stock <= T.quedan) html += '<div class="nvx-tq">QUEDAN ' + stock + '</div>';
          }
        } catch (e) {}
      }
      if (html) {
        var box = pr.closest('.item-price-container, .product-item-price-container, .js-item-price-container') || pr.parentElement;
        box.insertAdjacentHTML('afterend', '<div class="nvx-tw">' + html + '</div>');
      }
    });
  }

  // Tarjeta de producto destacada: precio con transferencia (o el ahorro sobre el precio tachado) en una caja
  // con el color de la tienda, y las cuotas en una caja oscura. Todo con los datos reales de cada producto.
  function tarjetaDestacada(card, precio, T) {
    var C = (T.colores && T.colores.precio) || NEVUX.color;
    var D = (T.colores && T.colores.cuotas) || (NEVUX.marca && NEVUX.marca.oscuro) || '#111827';
    hCss('nvx-td-css',
      '.nvx-td{display:grid;gap:6px;margin-top:6px;text-align:center}' +
      '.nvx-td-p{border-radius:999px;padding:7px 10px;background:' + C + ';color:' + (luz(C) > 0.45 ? '#111827' : '#fff') + ';box-shadow:0 6px 16px ' + C + '55;line-height:1.1}' +
      '.nvx-td-p b{display:block;font-size:17px;font-weight:900}' +
      '.nvx-td-p small{display:block;font-size:9.5px;font-weight:700;opacity:.9}' +
      '.nvx-td-q{position:relative;border-radius:12px;padding:8px 8px 7px;background:' + D + ';color:#fff;line-height:1.15}' +
      '.nvx-td-q span{display:block;font-size:9.5px;font-weight:700;opacity:.85}' +
      '.nvx-td-q b{display:block;font-size:14px;font-weight:900}' +
      '.nvx-td-q i{position:absolute;top:-8px;right:8px;font-style:normal;font-size:8.5px;font-weight:900;letter-spacing:.04em;background:#fff;color:' + D + ';border:1px solid ' + D + ';border-radius:999px;padding:1px 6px}');
    var v = null;
    try {
      var dvEl = card.hasAttribute('data-variants') ? card : card.querySelector('[data-variants]');
      v = dvEl ? JSON.parse(dvEl.getAttribute('data-variants'))[0] : null;
    } catch (e) {}
    precio = (v && v.price_number) || precio;
    if (!precio) return '';
    var out = '';
    // Caja de precio: transferencia si la tienda la tiene; si no, el ahorro sobre el precio tachado
    var transf = T.transferencia || 0;
    if (!transf && v && v.price_with_payment_discount_short) {
      var pd = hNum(v.price_with_payment_discount_short);
      if (pd && pd < precio) transf = Math.round((1 - pd / precio) * 100);
    }
    if (transf > 0) {
      out += '<div class="nvx-td-p"><b>' + hMoney(precio * (1 - transf / 100)) + '</b><small>Transferencia o depósito · ' + transf + '% OFF</small></div>';
    } else if (v && v.compare_at_price_number > precio) {
      var off = Math.round((1 - precio / v.compare_at_price_number) * 100);
      out += '<div class="nvx-td-p"><b>' + hMoney(precio) + '</b><small>' + off + '% OFF · Ahorrás ' + hMoney(v.compare_at_price_number - precio) + '</small></div>';
    }
    // Caja de cuotas: sin interés si las hay; si no, la cantidad máxima de cuotas con su valor real
    try {
      var inst = JSON.parse(v.installments_data), sin = 0, max = 0, valMax = 0;
      Object.keys(inst).forEach(function (g) {
        Object.keys(inst[g]).forEach(function (n) {
          var q = inst[g][n];
          if (q.without_interests && +n > sin) sin = +n;
          if (+n > max) { max = +n; valMax = q.installment_value; }
        });
      });
      if (sin > 1) out += '<div class="nvx-td-q"><i>SIN RECARGO</i><span>' + sin + ' cuotas sin interés de</span><b>' + hMoney(precio / sin) + '</b></div>';
      else if (max > 1 && valMax) out += '<div class="nvx-td-q"><span>Hasta ' + max + ' cuotas de</span><b>' + hMoney(valMax) + '</b></div>';
    } catch (e) {}
    return out ? '<div class="nvx-td">' + out + '</div>' : '';
  }

  // Comparativa: al bajar, una barra recorre la columna de la marca y cada ✓ se ilumina al pasar
  function initCmpAnim() {
    [].forEach.call(document.querySelectorAll('.nvx-cmpw:not([data-nvx-a])'), function (w) {
      w.setAttribute('data-nvx-a', '1');
      var bar = w.querySelector('.nvx-cmp-bar'), th = w.querySelector('th.nvx-m'), rows = w.querySelectorAll('tr');
      if (!bar || !th) return;
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      w.classList.add('nvx-anim');
      var pend = false;
      var pintar = function () {
        pend = false;
        bar.style.left = th.offsetLeft + 'px';
        bar.style.width = th.offsetWidth + 'px';
        var r = w.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
        var h = p * w.offsetHeight;
        bar.style.height = h + 'px';
        [].forEach.call(rows, function (tr, i) {
          if (i) tr.classList.toggle('nvx-on', tr.offsetTop + tr.offsetHeight / 2 <= h);
        });
      };
      var pedir = function () { if (!pend) { pend = true; requestAnimationFrame(pintar); } };
      window.addEventListener('scroll', pedir, { passive: true });
      window.addEventListener('resize', pedir);
      pintar();
    });
  }

  // Vitrinas de la home: trae las tarjetas reales de la categoría y las muestra en carrusel con botón "Ver"
  function cargarVitrinas(lista) {
    lista.forEach(function (V, n) {
      var row = document.querySelector('.nvh-vit-row[data-vit="' + n + '"]');
      if (!row || !V.url) return;
      fetch(V.url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, 'text/html');
        var cards = [].slice.call(doc.querySelectorAll('.js-item-product')).slice(0, V.cantidad || 8);
        if (!cards.length) { row.closest('.nvh-sec').remove(); return; }
        cards.forEach(function (c) {
          [].forEach.call(c.querySelectorAll('form, .js-product-form, .js-quickshop-modal-open, .js-addtocart, .item-actions, .js-item-actions'), function (f) { f.remove(); });
          [].forEach.call(c.querySelectorAll('img'), function (im) {
            var ss = im.getAttribute('data-srcset') || im.getAttribute('srcset');
            var src = im.getAttribute('data-src') || (ss ? ss.split(',').pop().trim().split(' ')[0] : '');
            if (src) im.setAttribute('src', src);
            im.removeAttribute('data-srcset'); im.removeAttribute('srcset'); im.classList.remove('lazyload', 'lazyautosizes', 'fade-in');
            im.style.opacity = 1;
          });
          c.className = c.className.replace(/\bcol-[\w-]+|\bswiper-slide\b|\bjs-item-slide\b/g, '');
          var a = c.querySelector('a[href*="/productos/"]');
          if (a) c.insertAdjacentHTML('beforeend', '<a class="nvh-ver" href="' + a.getAttribute('href') + '">Ver →</a>');
          row.appendChild(c);
        });
        initTarjetas();
      }).catch(function () {});
    });
  }

  // Secciones de la home
  function initHome() {
    var H = NEVUX.home;
    if (!H || !window.LS || LS.template !== 'home' || document.querySelector('.nvh')) return;
    var C = NEVUX.color, M = NEVUX.marca || {};
    // Acento legible sobre las secciones oscuras (si la marca es oscura, se usa blanco)
    var CA = luz(C) < 0.1 ? '#ffffff' : C;
    var oscuro = M.oscuro || '#0d0d0f', claro = M.fondo || '#ffffff', texto = M.texto || '#111827', borde = M.borde || '#ececec';
    hCss('nvx-h-css',
      '.nvh{font-family:' + (M.fuente || 'inherit') + ';color:' + texto + ';background:' + claro + '}' +
      '.nvh *{box-sizing:border-box}' +
      '.nvh-sec{padding:46px 16px}' +
      '.nvh-in{max-width:1100px;margin:0 auto}' +
      '.nvh-eb{font:800 11px/1.2 ' + FONT + ';letter-spacing:.18em;text-transform:uppercase;color:' + C + ';text-align:center;margin:0 0 10px}' +
      '.nvh-h{font-size:clamp(25px,6.5vw,40px);font-weight:900;line-height:1.06;text-align:center;margin:0 0 10px;letter-spacing:-.01em;text-transform:uppercase}' +
      '.nvh-p{text-align:center;opacity:.7;font-size:15px;line-height:1.5;margin:0 auto 26px;max-width:560px}' +
      '.nvh-dark{background:' + oscuro + ';color:#fff}' +
      '.nvh-ben{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;max-width:1100px;margin:0 auto;padding:18px 16px}' +
      '.nvh-ben>div{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid ' + borde + ';border-radius:14px;background:' + claro + '}' +
      '.nvh-ben i{font-style:normal;font-size:22px;line-height:1}' +
      '.nvh-ben b{display:block;font-size:14px;font-weight:900;text-transform:uppercase}' +
      '.nvh-ben small{display:block;opacity:.65;font-size:13px;margin-top:3px;line-height:1.4}' +
      '.nvh-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding-bottom:4px}' +
      '.nvh-row::-webkit-scrollbar{display:none}' +
      '.nvh-cat{flex:0 0 64%;max-width:280px;scroll-snap-align:start;position:relative;border-radius:18px;overflow:hidden;aspect-ratio:4/5;background:#e5e5e5;color:#fff!important;text-decoration:none!important}' +
      '.nvh-cat img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.nvh-cat span{position:absolute;left:0;right:0;bottom:0;padding:44px 14px 14px;background:linear-gradient(transparent,rgba(0,0,0,.78));font-weight:900;font-size:19px;text-transform:uppercase;line-height:1.1}' +
      '.nvh-cat em{display:block;font-style:normal;font-size:12px;font-weight:700;opacity:.85;margin-top:4px;text-transform:none}' +
      '.nvh-why{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}' +
      '.nvh-tag{position:relative;background:#f3efe6;color:#111;border-radius:6px 6px 16px 16px;padding:30px 18px 16px;clip-path:polygon(18px 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%,0 18px)}' +
      '.nvh-tag:before{content:"";position:absolute;top:11px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:' + oscuro + '}' +
      '.nvh-tag big{display:block;font-size:32px;font-weight:900;color:' + C + ';line-height:1}' +
      '.nvh-tag b{display:block;font-size:13px;font-weight:900;text-transform:uppercase;margin:6px 0 8px}' +
      '.nvh-tag p{font-size:14px;line-height:1.45;color:#4b5563;margin:0}' +
      '.nvh-tag small{display:block;margin-top:14px;padding-top:10px;border-top:1px dashed #cdc5b4;font:700 10px/1.2 ui-monospace,monospace;letter-spacing:.14em;color:#6b7280;text-transform:uppercase}' +
      '.nvh-nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}' +
      '.nvh-nums div{text-align:center;padding:20px 10px;border-radius:16px;background:rgba(255,255,255,.07)}' +
      '.nvh-nums b{display:block;font-size:32px;font-weight:900;color:' + CA + ';line-height:1.1}' +
      '.nvh-dark .nvh-eb{color:' + CA + '}' +
      '.nvh-nums small{font-size:13px;opacity:.75}' +
      '.nvh-rev{flex:0 0 84%;max-width:360px;scroll-snap-align:start;background:' + claro + ';color:' + texto + ';border:1px solid ' + borde + ';border-radius:18px;padding:18px}' +
      '.nvh-rev .s{color:#f59e0b;font-size:14px;letter-spacing:2px}' +
      '.nvh-rev p{font-size:15px;line-height:1.5;margin:10px 0 12px}' +
      '.nvh-rev b{display:block;font-size:14px}' +
      '.nvh-rev small{opacity:.6;font-size:12px}' +
      '.nvh-faq{max-width:760px;margin:0 auto}' +
      '.nvh-faq details{border-bottom:1px solid ' + borde + '}' +
      '.nvh-dark .nvh-faq details{border-color:rgba(255,255,255,.14)}' +
      '.nvh-faq summary{cursor:pointer;list-style:none;padding:18px 34px 18px 0;font-weight:800;font-size:15px;text-transform:uppercase;position:relative}' +
      '.nvh-faq summary::-webkit-details-marker{display:none}' +
      '.nvh-faq summary:after{content:"+";position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:22px;font-weight:400}' +
      '.nvh-faq details[open] summary:after{content:"−"}' +
      '.nvh-faq details div{padding:0 0 18px;font-size:15px;line-height:1.55;opacity:.8}' +
      '.nvh-locs{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}' +
      '.nvh-loc{background:' + claro + ';border:1px solid ' + borde + ';border-radius:18px;overflow:hidden}' +
      '.nvh-loc img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}' +
      '.nvh-loc>div{padding:16px}' +
      '.nvh-loc small{font:800 10px/1.2 ' + FONT + ';letter-spacing:.14em;text-transform:uppercase;color:' + C + '}' +
      '.nvh-loc b{display:block;font-size:21px;font-weight:900;margin:6px 0;text-transform:uppercase}' +
      '.nvh-loc p{font-size:13px;opacity:.7;margin:0 0 14px}' +
      '.nvh-btn{display:inline-flex;align-items:center;gap:8px;background:#111;color:#fff!important;border-radius:999px;padding:12px 20px;font:800 12px/1 ' + FONT + ';letter-spacing:.1em;text-transform:uppercase;text-decoration:none!important}' +
      '.nvh-dark .nvh-btn{background:#fff;color:#111!important}' +
      '.nvh-cierre{text-align:center;border-radius:32px 32px 0 0}' +
      '.nvh-pts{display:grid;gap:22px;align-items:center}@media(min-width:768px){.nvh-pts{grid-template-columns:1.1fr 1fr}}' +
      '.nvh-pts-f{position:relative;border-radius:22px;overflow:hidden}' +
      '.nvh-pts-f img{width:100%;display:block}' +
      '.nvh-pt{position:absolute;transform:translate(-50%,-50%);width:34px;height:34px;border-radius:50%;border:3px solid #fff;background:' + C + ';color:#fff;font:900 14px/1 ' + FONT + ';cursor:pointer;padding:0;box-shadow:0 0 0 0 ' + C + 'aa;animation:nvh-pl 2s infinite}' +
      '.nvh-pt.on{background:#fff;color:' + C + '}' +
      '@keyframes nvh-pl{0%{box-shadow:0 0 0 0 ' + C + 'aa}70%{box-shadow:0 0 0 16px ' + C + '00}100%{box-shadow:0 0 0 0 ' + C + '00}}' +
      '.nvh-pts-l{display:grid;gap:10px}@media(min-width:600px) and (max-width:767px){.nvh-pts-l{grid-template-columns:1fr 1fr}}' +
      '.nvh-pti{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid ' + borde + ';border-radius:14px;transition:border-color .2s,box-shadow .2s}' +
      '.nvh-pti.on{border-color:' + C + ';box-shadow:0 8px 22px ' + C + '30}' +
      '.nvh-pti i{flex:none;width:26px;height:26px;border-radius:50%;background:' + C + ';color:#fff;font:900 12px/26px ' + FONT + ';text-align:center;font-style:normal}' +
      '.nvh-pti b{display:block;font-size:15px;font-weight:900;text-transform:uppercase}' +
      '.nvh-pti p{margin:3px 0 0;font-size:13.5px;opacity:.75;line-height:1.45}' +
      '.nvh-vit-row{display:grid;grid-auto-flow:column;grid-auto-columns:46%;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 12px;-webkit-overflow-scrolling:touch}' +
      '@media(min-width:768px){.nvh-vit-row{grid-auto-columns:23%}}' +
      '.nvh-vit-row>*{scroll-snap-align:start;min-width:0;width:auto!important;max-width:none!important;flex:none!important;margin:0!important;background:#fff;color:#111827;border-radius:16px;padding:8px;box-sizing:border-box}' +
      '.nvh-vit-row img{width:100%;height:auto}' +
      '.nvh-vit-row .nvh-ver{display:flex;justify-content:center;gap:8px;margin-top:8px;background:#111;color:#fff!important;border-radius:999px;padding:10px;font:800 11px/1 ' + FONT + ';letter-spacing:.12em;text-transform:uppercase;text-decoration:none!important}');

    var sec = function (cls, eb, h, p, body) {
      return '<section class="nvh-sec ' + (cls || '') + '"><div class="nvh-in">' + (eb ? '<div class="nvh-eb">' + hEsc(eb) + '</div>' : '') +
        (h ? '<h2 class="nvh-h">' + hEsc(h) + '</h2>' : '') + (p ? '<p class="nvh-p">' + hEsc(p) + '</p>' : '') + body + '</div></section>';
    };
    var html = '';
    if (H.categorias && H.categorias.length) {
      html += sec('', H.categoriasEtiqueta || 'Categorías', H.categoriasTitulo || 'Elegí lo tuyo', '',
        '<div class="nvh-row">' + H.categorias.map(function (c) {
          return '<a class="nvh-cat" href="' + hEsc(c.url) + '">' + (c.foto ? '<img src="' + hEsc(c.foto) + '" alt="" loading="lazy">' : '') +
            '<span>' + hEsc(c.nombre) + (c.texto ? '<em>' + hEsc(c.texto) + '</em>' : '') + '</span></a>';
        }).join('') + '</div>');
    }
    // Foto con puntos que explican cada detalle del producto
    var PT = H.puntos;
    if (PT && PT.foto && PT.items && PT.items.length) {
      html += sec('', PT.etiqueta || '', PT.titulo || '', PT.texto || '',
        '<div class="nvh-pts"><div class="nvh-pts-f"><img src="' + hEsc(PT.foto) + '" alt="" loading="lazy">' +
        PT.items.map(function (it, i) { return '<button class="nvh-pt" data-i="' + i + '" style="left:' + it.x + '%;top:' + it.y + '%" aria-label="' + hEsc(it.titulo) + '">' + (i + 1) + '</button>'; }).join('') +
        '</div><div class="nvh-pts-l">' + PT.items.map(function (it, i) {
          return '<div class="nvh-pti" data-i="' + i + '"><i>' + (i + 1) + '</i><div><b>' + hEsc(it.titulo) + '</b>' + (it.texto ? '<p>' + hEsc(it.texto) + '</p>' : '') + '</div></div>';
        }).join('') + '</div></div>' + (PT.url ? '<div style="text-align:center;margin-top:22px"><a class="nvh-btn" href="' + hEsc(PT.url) + '">' + hEsc(PT.boton || 'Ver producto') + ' →</a></div>' : ''));
    }
    // Vitrinas: productos reales de una categoría en carrusel (se cargan de la tienda al abrir la home)
    (H.vitrinas || []).forEach(function (V, n) {
      html += sec((V.oscuro ? 'nvh-dark ' : '') + 'nvh-vit', V.etiqueta || '', V.titulo || '', V.texto || '',
        '<div class="nvh-vit-row" data-vit="' + n + '"></div>' +
        '<div style="text-align:center;margin-top:20px"><a class="nvh-btn" href="' + hEsc(V.url) + '">' + hEsc(V.boton || 'Ver todos') + ' →</a></div>');
    });
    var W = H.porQue;
    if (W && W.items && W.items.length) {
      html += sec('nvh-dark', W.etiqueta || '', W.titulo || 'Por qué elegirnos', W.texto || '',
        '<div class="nvh-why">' + W.items.map(function (it) {
          return '<div class="nvh-tag">' + (it.destacado ? '<big>' + hEsc(it.destacado) + '</big>' : '') + '<b>' + hEsc(it.titulo) + '</b>' +
            (it.texto ? '<p>' + hEsc(it.texto) + '</p>' : '') + (it.pie ? '<small>' + hEsc(it.pie) + '</small>' : '') + '</div>';
        }).join('') + '</div>');
    }
    if (H.numeros && H.numeros.length) {
      html += sec('nvh-dark', '', H.numerosTitulo || '', '',
        '<div class="nvh-nums">' + H.numeros.map(function (n) { return '<div><b>' + hEsc(n.valor) + '</b><small>' + hEsc(n.texto) + '</small></div>'; }).join('') + '</div>');
    }
    if (H.resenas && H.resenas.length) {
      html += sec('', H.resenasEtiqueta || 'Reseñas', H.resenasTitulo || 'Lo que dicen nuestros clientes', H.resenasTexto || '',
        '<div class="nvh-row">' + H.resenas.map(function (r) {
          var n = Math.max(1, Math.min(5, r.estrellas || 5));
          return '<div class="nvh-rev"><div class="s">' + '★★★★★'.slice(0, n) + '</div>' + (r.titulo ? '<b>' + hEsc(r.titulo) + '</b>' : '') +
            '<p>“' + hEsc(r.texto) + '”</p><small>' + hEsc(r.nombre) + (r.lugar ? ' · ' + hEsc(r.lugar) : '') + '</small></div>';
        }).join('') + '</div>');
    }
    if (H.faq && H.faq.length) {
      html += sec('nvh-dark', '', H.faqTitulo || 'Lo que siempre nos preguntan', '',
        '<div class="nvh-faq">' + H.faq.map(function (f) { return '<details><summary>' + hEsc(f.p) + '</summary><div>' + hEsc(f.r) + '</div></details>'; }).join('') + '</div>');
    }
    if (H.locales && H.locales.length) {
      html += sec('', H.localesEtiqueta || 'Locales', H.localesTitulo || 'Vení a conocernos', H.localesTexto || '',
        '<div class="nvh-locs">' + H.locales.map(function (l) {
          return '<div class="nvh-loc">' + (l.foto ? '<img src="' + hEsc(l.foto) + '" alt="" loading="lazy">' : '') + '<div>' +
            (l.zona ? '<small>' + hEsc(l.zona) + '</small>' : '') + '<b>' + hEsc(l.direccion) + '</b>' + (l.horario ? '<p>' + hEsc(l.horario) + '</p>' : '') +
            (l.mapa ? '<a class="nvh-btn" target="_blank" rel="noopener" href="' + hEsc(l.mapa) + '">Cómo llegar →</a>' : '') + '</div></div>';
        }).join('') + '</div>');
    }
    var K = H.cierre;
    if (K) {
      html += sec('nvh-dark nvh-cierre', K.etiqueta || '', K.titulo || 'Esto fue una selección', K.texto || '',
        '<a class="nvh-btn" href="' + hEsc(K.url || '/productos/') + '">' + hEsc(K.boton || 'Ver el catálogo completo') + ' →</a>');
    }

    var footer = document.querySelector('footer.js-footer') || document.querySelector('body > footer, footer');
    if (html) {
      var wrap = '<div class="nvh">' + html + '</div>';
      if (footer) {
        var slot = footer.previousElementSibling;
        (slot && slot.classList.contains('js-nubesdk-slot') ? slot : footer).insertAdjacentHTML('beforebegin', wrap);
      } else {
        document.body.insertAdjacentHTML('beforeend', wrap);
      }
    }
    cargarVitrinas(H.vitrinas || []);
    [].forEach.call(document.querySelectorAll('.nvh-pts'), function (box) {
      var marcar = function (i) {
        [].forEach.call(box.querySelectorAll('[data-i]'), function (e) { e.classList.toggle('on', e.getAttribute('data-i') === String(i)); });
      };
      [].forEach.call(box.querySelectorAll('[data-i]'), function (e) { e.addEventListener('click', function () { marcar(e.getAttribute('data-i')); }); });
    });
    if (H.beneficios && H.beneficios.length) {
      var ben = '<div class="nvh"><div class="nvh-ben">' + H.beneficios.map(function (b) {
        return '<div><i>' + hEsc(b.icono || '✓') + '</i><div><b>' + hEsc(b.titulo) + '</b>' + (b.texto ? '<small>' + hEsc(b.texto) + '</small>' : '') + '</div></div>';
      }).join('') + '</div></div>';
      var slider = document.querySelector('[data-store="home-slider"]');
      if (slider) slider.insertAdjacentHTML('afterend', ben);
      else (document.querySelector('.nvh') || footer || document.body).insertAdjacentHTML(footer || document.querySelector('.nvh') ? 'beforebegin' : 'beforeend', ben);
    }

    // Cuenta regresiva debajo del banner principal
    montarCuenta(H.cuentaRegresiva, function (html) {
      var slider2 = document.querySelector('[data-store="home-slider"]');
      if (slider2) slider2.insertAdjacentHTML('afterend', html);
      else (document.querySelector('.nvh') || footer || document.body).insertAdjacentHTML(footer || document.querySelector('.nvh') ? 'beforebegin' : 'beforeend', html);
      return document.querySelector('.nvh-crw');
    }, 'nvh');
  }

  // Cuenta regresiva: hasta la hora de corte del despacho (envio) o hasta el fin de una promo con fecha (hasta).
  // colocar(html) inserta el banner y devuelve el elemento; clase permite variar el estilo (home o ficha).
  function montarCuenta(CR, colocar, clase) {
    var E = NEVUX.envio, C = NEVUX.color;
    if (CR) {
      CR = CR === true ? {} : CR;
      var finPromo = CR.hasta ? new Date(CR.hasta) : null;
      if (finPromo || (E && E.corte != null && E.dias)) {
        hCss('nvx-cr-css',
          '.nvh-crw{background:transparent}' +
          '.nvh-cr{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 10px;margin:14px 16px 0;padding:14px 12px;border-radius:16px;' +
          'background:' + C + ';color:' + NEVUX.colorTexto + ';font-family:' + FONT + ';text-align:center;box-shadow:0 10px 26px ' + C + '40}' +
          '.nvh-cr-t{font-weight:900;font-size:15px;text-transform:uppercase;letter-spacing:.02em}' +
          '.nvh-cr-n{display:inline-flex;gap:5px;align-items:center}' +
          '.nvh-cr-n b{display:inline-block;min-width:44px;padding:7px 4px 5px;border-radius:10px;background:rgba(0,0,0,.2);font-size:22px;font-weight:900;line-height:1;font-variant-numeric:tabular-nums}' +
          '.nvh-cr-n b small{display:block;font-size:9px;font-weight:700;opacity:.85;margin-top:3px;letter-spacing:.06em}' +
          '.nvh-cr-n i{font-style:normal;font-weight:900;font-size:18px;opacity:.7}' +
          '.nvx-cr-ficha .nvh-cr{margin:0 0 14px}');
        var crBox = colocar('<div class="nvh-crw' + (clase ? ' ' + clase : '') + '"><div class="nvh-cr"><span class="nvh-cr-t"></span><span class="nvh-cr-n"></span><span class="nvh-cr-t nvh-cr-f"></span></div></div>');
        if (!crBox) return;
        var dos = function (n) { return (n < 10 ? '0' : '') + n; };
        var caja = function (n, l) { return '<b>' + dos(n) + '<small>' + l + '</small></b>'; };
        var DL = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
        var tick = function () {
          var ms, ini, fin;
          if (finPromo) {
            ms = finPromo - Date.now();
            if (ms <= 0) { crBox.remove(); clearInterval(crTimer); return; }
            ini = CR.texto || '🔥 La promo termina en';
            fin = CR.textoFinal || '';
          } else {
            var ar = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
            var corte = new Date(ar); corte.setHours(E.corte, 0, 0, 0);
            if (E.dias.indexOf(ar.getDay()) > -1 && ar < corte) {
              ms = corte - ar;
              ini = CR.texto || '⚡ Pedí en las próximas';
              fin = CR.textoFinal || 'y despachamos hoy';
            } else {
              var d = new Date(ar), k = 0;
              do { d.setDate(d.getDate() + 1); k++; } while (E.dias.indexOf(d.getDay()) < 0 && k < 8);
              crBox.querySelector('.nvh-cr-t').textContent = '🚚 Pedí ahora y despachamos ' + (k === 1 ? 'mañana' : DL[d.getDay()]);
              crBox.querySelector('.nvh-cr-n').innerHTML = '';
              crBox.querySelector('.nvh-cr-f').textContent = '';
              return;
            }
          }
          var seg = Math.floor(ms / 1000), dd = Math.floor(seg / 86400), hh = Math.floor(seg % 86400 / 3600), mm = Math.floor(seg % 3600 / 60), ss = seg % 60;
          crBox.querySelector('.nvh-cr-t').textContent = ini;
          crBox.querySelector('.nvh-cr-n').innerHTML = (dd ? caja(dd, 'DÍAS') + '<i>:</i>' : '') + caja(hh, 'HS') + '<i>:</i>' + caja(mm, 'MIN') + '<i>:</i>' + caja(ss, 'SEG');
          crBox.querySelector('.nvh-cr-f').textContent = fin;
        };
        var crTimer = setInterval(tick, 1000);
        tick();
      }
    }
  }

  // Colores y tipografía de la tienda: Nevux se viste con la marca del cliente, no con la propia
  function hexDe(c) {
    var m = String(c || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return /^#[0-9a-f]{6}$/i.test(c) ? c : null;
    var v = m[1].split(',').map(function (x) { return parseFloat(x); });
    if (v.length > 3 && v[3] === 0) return null;
    return '#' + v.slice(0, 3).map(function (x) { return ('0' + Math.round(x).toString(16)).slice(-2); }).join('');
  }
  function luz(hex) {
    var v = [1, 3, 5].map(function (i) {
      var c = parseInt(hex.substr(i, 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function detectarMarca() {
    var f = document.body && getComputedStyle(document.body).fontFamily;
    if (f) FONT = f;
    if (!hexDe(NEVUX.color)) {
      NEVUX.color = '';
      ['.js-addtocart', '.btn-primary', '.btn-add-to-cart', 'button[type="submit"]'].some(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return false;
        var cs = getComputedStyle(el);
        var c = [cs.backgroundColor, cs.borderTopColor].map(hexDe).filter(function (x) { return x && luz(x) < 0.85; })[0];
        if (c) NEVUX.color = c;
        return !!c;
      });
      if (!NEVUX.color) NEVUX.color = '#111827';
    }
    NEVUX.colorTexto = luz(NEVUX.color) > 0.45 ? '#111827' : '#ffffff';
    var M = NEVUX.marca = NEVUX.marca || {};
    if (!M.oscuro) {
      var ft = document.querySelector('footer.js-footer');
      var fc = ft && hexDe(getComputedStyle(ft).backgroundColor);
      if (fc && luz(fc) < 0.08) M.oscuro = fc;
    }
  }

  // Avisos de venta en vivo: productos reales de la tienda con su foto y precio
  var NOMBRES = ['Agustina C.', 'Lucas M.', 'Sofía R.', 'Martín G.', 'Valentina P.', 'Joaquín L.', 'Camila F.', 'Tomás B.', 'Florencia D.',
    'Nicolás S.', 'Micaela A.', 'Federico V.', 'Julieta N.', 'Matías H.', 'Romina T.', 'Facundo O.', 'Carolina E.', 'Ezequiel R.',
    'Daniela Q.', 'Gonzalo Z.', 'Milagros I.', 'Santiago K.', 'Lorena J.', 'Pablo U.'];
  var CIUDADES = ['CABA', 'La Plata', 'Mar del Plata', 'Córdoba', 'Rosario', 'Mendoza', 'Quilmes', 'Lanús', 'Morón', 'San Isidro', 'Tigre',
    'Bahía Blanca', 'Tucumán', 'Salta', 'Neuquén', 'Santa Fe', 'Paraná', 'Pilar', 'Merlo', 'San Juan', 'Corrientes', 'Posadas', 'Zárate', 'Campana'];
  function productoDeTarjeta(c) {
    var a = c.querySelector('a[href*="/productos/"]');
    var pr = c.querySelector('.js-price-display');
    var img = c.querySelector('img');
    var nom = c.querySelector('.js-item-name, .item-name, .product-item-name');
    if (!a || !pr || !img) return null;
    var src = img.getAttribute('data-srcset') || img.getAttribute('srcset') || '';
    var mejor = src.split(',').map(function (x) { return x.trim().split(' ')[0]; }).filter(function (u) { return /-(240|320|480)-0\./.test(u); })[0] ||
      src.split(',').map(function (x) { return x.trim().split(' ')[0]; }).pop() || img.getAttribute('data-src') || img.getAttribute('src');
    if (!mejor || /^data:/.test(mejor)) return null;
    return {
      nombre: ((nom && nom.textContent) || img.getAttribute('alt') || '').trim(),
      precio: pr.textContent.trim().replace(/,00$/, ''),
      foto: mejor.indexOf('//') === 0 ? 'https:' + mejor : mejor,
      url: a.pathname
    };
  }
  function initVentas() {
    var V = NEVUX.ventas;
    if (!V || document.getElementById('nvxToast')) return;
    V = V === true ? {} : V;
    var nombres = V.nombres || NOMBRES, ciudades = V.ciudades || CIUDADES;
    var leer = function (raiz) {
      var vistos = {};
      return [].slice.call(raiz.querySelectorAll('.js-item-product, .js-product-container')).map(productoDeTarjeta).filter(function (p) {
        if (!p || !p.nombre || vistos[p.url]) return false;
        vistos[p.url] = 1;
        return true;
      });
    };
    var conProductos = function (cb) {
      try { var c = JSON.parse(sessionStorage.getItem('nvx-prods') || 'null'); if (c && c.length >= 3) return cb(c); } catch (e) {}
      var aca = leer(document);
      if (aca.length >= 6) return cb(aca);
      fetch('/productos/').then(function (r) { return r.text(); }).then(function (h) {
        var lista = leer(new DOMParser().parseFromString(h, 'text/html'));
        if (lista.length < 3) lista = aca;
        try { sessionStorage.setItem('nvx-prods', JSON.stringify(lista.slice(0, 40))); } catch (e) {}
        cb(lista);
      }).catch(function () { cb(aca); });
    };
    conProductos(function (prods) {
      if (!prods.length) return;
      hCss('nvx-v-css',
        '.nvx-toast{position:fixed;left:10px;right:10px;top:10px;margin:0 auto;z-index:99998;max-width:360px;background:#fff;border-radius:16px;' +
        'padding:10px 12px 10px 10px;display:flex;align-items:center;gap:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);opacity:0;transform:translateY(-18px);' +
        'transition:all .45s cubic-bezier(.2,.8,.2,1);pointer-events:none;font-family:' + FONT + ';color:#111827;text-decoration:none!important}' +
        '.nvx-toast.nvx-show{opacity:1;transform:none;pointer-events:auto}' +
        '.nvx-toast img{width:52px;height:52px;border-radius:10px;object-fit:cover;flex:0 0 auto;background:#f3f4f6}' +
        '.nvx-toast .t{flex:1;min-width:0;line-height:1.25}' +
        '.nvx-toast small{display:block;font-size:11px;color:#6b7280}' +
        '.nvx-toast b{display:block;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}' +
        '.nvx-toast em{display:block;font-style:normal;font-size:11px;color:#6b7280;margin-top:2px}' +
        '.nvx-toast em:before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-right:5px;vertical-align:middle}' +
        '.nvx-toast strong{flex:0 0 auto;font-size:14px;font-weight:900}');
      document.body.insertAdjacentHTML('beforeend', '<a class="nvx-toast" id="nvxToast" href="#"><img alt=""><div class="t"><small></small><b></b><em></em></div><strong></strong></a>');
      var t = document.getElementById('nvxToast');
      var azar = function (a) { return a[Math.floor(Math.random() * a.length)]; };
      var ultimo = -1;
      var mostrar = function () {
        var i;
        do { i = Math.floor(Math.random() * prods.length); } while (prods.length > 1 && i === ultimo);
        ultimo = i;
        var p = prods[i];
        t.querySelector('img').src = p.foto;
        t.querySelector('small').textContent = azar(nombres) + ' de ' + azar(ciudades) + ' compró';
        t.querySelector('b').textContent = p.nombre;
        t.querySelector('em').textContent = 'hace ' + (2 + Math.floor(Math.random() * 38)) + ' min';
        t.querySelector('strong').textContent = p.precio;
        t.href = p.url;
        t.classList.add('nvx-show');
        setTimeout(function () { t.classList.remove('nvx-show'); }, 5500);
        setTimeout(mostrar, ((V.cada || 20) + Math.random() * 10) * 1000);
      };
      setTimeout(mostrar, 6000);
    });
  }

  // Barra arriba de toda la tienda: el mensaje del evento (si hay) y los anuncios, rotando con flechas
  function initBarra() {
    var EV = NEVUX.evento || {};
    var msgs = [];
    var ev = EVENTO === 'durante' ? EV.barra : EVENTO === 'antes' ? EV.barraAntes : '';
    if (ev) msgs.push({ t: ev, u: EV.url || '/productos/' });
    (NEVUX.anuncios || []).forEach(function (a) { msgs.push(typeof a === 'string' ? { t: a } : { t: a.texto, u: a.url }); });
    if (!msgs.length || document.querySelector('.nvx-evbar')) return;
    var bg = ev ? NEVUX.color : ((NEVUX.marca && NEVUX.marca.oscuro) || '#111827');
    hCss('nvx-evbar-css',
      '.nvx-evbar{position:relative;z-index:2;background:' + bg + ';color:' + (ev ? NEVUX.colorTexto : '#fff') + ';display:flex;align-items:center;justify-content:center;gap:8px;' +
      'font:900 12.5px/1.3 ' + FONT + ';letter-spacing:.06em;text-transform:uppercase;padding:9px 6px;min-height:40px;text-align:center}' +
      '.nvx-evbar a{color:inherit;text-decoration:none}' +
      '.nvx-evbar .m{flex:1;max-width:760px;transition:opacity .35s}' +
      '.nvx-evbar button{background:none;border:0;color:inherit;font-size:18px;line-height:1;padding:2px 10px;cursor:pointer;opacity:.8}');
    var dos = msgs.length > 1;
    document.body.insertAdjacentHTML('afterbegin', '<div class="nvx-evbar">' + (dos ? '<button aria-label="Anterior">‹</button>' : '') +
      '<div class="m"></div>' + (dos ? '<button aria-label="Siguiente">›</button>' : '') + '</div>');
    var bar = document.querySelector('.nvx-evbar'), box = bar.querySelector('.m'), i = 0, timer;
    var pintar = function () {
      var m = msgs[i];
      box.innerHTML = m.u ? '<a href="' + hEsc(m.u) + '">' + hEsc(m.t) + '</a>' : hEsc(m.t);
    };
    var mover = function (d) {
      box.style.opacity = 0;
      setTimeout(function () { i = (i + d + msgs.length) % msgs.length; pintar(); box.style.opacity = 1; }, 250);
    };
    pintar();
    if (dos) {
      var bs = bar.querySelectorAll('button');
      var reiniciar = function () { clearInterval(timer); timer = setInterval(function () { mover(1); }, 4500); };
      bs[0].onclick = function () { mover(-1); reiniciar(); };
      bs[1].onclick = function () { mover(1); reiniciar(); };
      reiniciar();
    }
  }

  function arrancar() {
    detectarMarca();
    initBarra();
    initVentas();
    initHome();
    initTarjetas();
    init();
    initCmpAnim();
    // Las tarjetas que la plantilla carga después (carruseles, scroll infinito) también se completan
    if (NEVUX.tarjetas && 'MutationObserver' in window) {
      var t;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(initTarjetas, 300); })
        .observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

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
    // ----- Premium -----
    // Tipografías de marca (Google Fonts) y animación de entrada de las secciones al bajar
    premium: null, // ej: { titulos: 'Cinzel', texto: 'Cormorant Garamond', animar: true }
    // Tabla de especificaciones del producto (solo datos reales)
    especificaciones: null, // ej: { titulo: 'Especificaciones', filas: [['Diámetro', '42 mm'], ['Malla', 'Acero']] }
    // Medidor de muñeca: compara el diámetro de la caja (mm) con la muñeca del cliente
    muneca: null, // ej: { caja: 42 }
    // Qué incluye la compra (caja, garantía, etc.)
    incluye: null, // ej: { titulo: 'Qué incluye', items: [{ icono: '🎁', titulo: 'Caja de regalo', texto: '...' }] }
    // Bloque para regalo
    regalo: null, // ej: { titulo: 'Ideal para regalar', texto: '...' }
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

  // ===== FICHA ESTILO WESS (estiloFicha: 'wess', textos en NEVUX.ficha) =====
  // Arriba: etiqueta y título condensado, precio con "MEJOR PRECIO", envío con cuenta regresiva y fechas reales de entrega.
  function fichaWessArriba(root, d) {
    var C = NEVUX.color, CT = NEVUX.colorTexto, FW = NEVUX.ficha || {}, money = d.money;
    if (!document.querySelector('#nvx-anton')) {
      var lk = document.createElement('link'); lk.id = 'nvx-anton'; lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&display=swap';
      document.head.appendChild(lk);
    }
    var VERDE = '#15803d';
    hCss('nvx-wf-css',
      '#single-product .js-product-name,#single-product h1{font-family:Anton,Oswald,sans-serif!important;font-weight:400!important;text-transform:uppercase;font-size:clamp(26px,7.4vw,38px)!important;line-height:1.04!important;letter-spacing:0!important;text-align:left!important}' +
      '#single-product .js-addtocart{background:' + C + '!important;color:' + CT + '!important;border:0!important;border-radius:999px!important;font:800 13px/1 Inter,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;min-height:52px}' +
      '#single-product .js-quantity,#single-product .form-quantity{border-radius:999px!important;overflow:hidden}' +
      '.nvx-wpill{display:table;background:' + C + ';color:' + CT + ';font:800 11px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:7px 10px;border-radius:3px;margin:0 0 10px}' +
      '.nvx-wp{text-align:left;margin:6px 0 12px;font-family:Inter,sans-serif;color:#111}' +
      '.nvx-wp .l{font-size:13.5px;color:#4b5563}.nvx-wp .l b{color:#111}.nvx-wp .l s{color:#9ca3af}' +
      '.nvx-wp .t{display:inline-block;margin-top:8px;background:' + VERDE + ';color:#fff;font:800 10.5px/1 Inter,sans-serif;letter-spacing:.12em;padding:5px 8px;border-radius:3px}' +
      '.nvx-wp .p{display:flex;align-items:baseline;gap:10px;margin-top:4px}.nvx-wp .p b{font:400 clamp(42px,12vw,56px)/1 Anton,Oswald,sans-serif;font-variant-numeric:tabular-nums}' +
      '.nvx-wp .p em{font-style:normal;font:800 17px/1 Inter,sans-serif;color:' + VERDE + '}' +
      '.nvx-wp .s{font-size:13.5px;color:#4b5563;margin-top:4px}.nvx-wp .s b{color:' + VERDE + '}' +
      '.nvx-wp .q{font-size:14px;color:#111;margin-top:10px}' +
      '.nvx-wship{border:1px solid #e5e7eb;border-radius:14px;padding:4px 14px;margin:0 0 14px;font:13.5px/1.4 Inter,sans-serif;color:#111;text-align:left}' +
      '.nvx-wship .r{display:flex;gap:12px;padding:12px 0}.nvx-wship .r+.r{border-top:1px solid #f1f1f1}' +
      '.nvx-wship i{flex:none;width:22px;height:22px;color:#111}.nvx-wship i svg{width:22px;height:22px}' +
      '.nvx-wship b{color:' + C + ';font-weight:800}.nvx-wship small{display:block;color:#6b7280;font-size:12.5px;margin-top:2px}' +
      '.nvx-wcd{background:' + C + '1c;border-radius:10px;padding:10px 12px;margin-top:8px;font-size:13px;color:#111}' +
      '.nvx-wcd strong{display:inline-block;margin-top:6px;margin-right:6px;font-weight:600}.nvx-wcd span{display:inline-block;background:' + C + ';color:' + CT + ';border-radius:4px;padding:3px 6px;font:800 14px/1 Inter,sans-serif;font-variant-numeric:tabular-nums}' +
      '.nvx-wpre{margin:4px 0 12px;text-align:left}' +
      '.nvx-wgift{display:flex;gap:10px;align-items:center;background:#f4f4f2;border-radius:12px;padding:12px 14px;font:500 13.5px/1.4 Inter,sans-serif;color:#111}.nvx-wgift i{flex:none;width:20px;height:20px}.nvx-wgift svg{width:20px;height:20px}' +
      '.nvx-wstar{margin-top:12px;font:400 15px/1 Inter,sans-serif;letter-spacing:.04em;color:#111}.nvx-wstar b{font:800 11.5px/1 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-left:6px}' +
      '.nvx-wtr{display:block!important;background:#fff!important;border:1px solid #e5e7eb;border-radius:14px;padding:2px 14px!important;text-align:left!important;margin:16px 0 12px!important}' +
      '.nvx-wtr>div{display:flex;gap:12px;align-items:center;padding:12px 0}.nvx-wtr>div+div{border-top:1px solid #f1f1f1}' +
      '.nvx-wtr i{flex:none;width:22px;height:22px;color:#111}.nvx-wtr i svg{width:22px;height:22px}' +
      '.nvx-wtr b{display:block;font:700 14px/1.2 Inter,sans-serif;color:#111}.nvx-wtr small{display:block;font:400 12.5px/1.35 Inter,sans-serif;color:#6b7280;margin-top:2px}');
    if (FW.pill && d.titleEl) d.titleEl.insertAdjacentHTML('beforebegin', '<span class="nvx-wpill">' + hEsc(FW.pill) + '</span>');
    var pb = d.priceBox, precio = d.precio;
    if (pb && precio) {
      var v = d.variant, lista = v && v.compare_at_price_number > precio ? v.compare_at_price_number : 0, h = '';
      if (d.transf > 0) {
        var conT = precio * (1 - d.transf / 100);
        h = '<div class="l">Precio final <b>' + money(precio) + '</b></div><span class="t">MEJOR PRECIO</span><div class="p"><b>' + money(conT) + '</b><em>' + d.transf + '% OFF</em></div>' +
          '<div class="s">por transferencia · <b>ahorrás ' + money(precio - conT) + '</b></div>';
      } else if (lista) {
        h = '<div class="l">Antes <s>' + money(lista) + '</s></div><span class="t">MEJOR PRECIO</span><div class="p"><b>' + money(precio) + '</b><em>' + Math.round((1 - precio / lista) * 100) + '% OFF</em></div>' +
          '<div class="s"><b>ahorrás ' + money(lista - precio) + '</b></div>';
      } else {
        h = '<div class="p"><b>' + money(precio) + '</b></div>';
      }
      if (d.cuotasSin > 1) h += '<div class="q">' + d.cuotasSin + ' cuotas sin interés de <b>' + money(precio / d.cuotasSin) + '</b></div>';
      pb.insertAdjacentHTML('afterend', '<div class="nvx-wp">' + h + '</div>');
      pb.style.display = 'none';
    }
    var E = NEVUX.envio, rows = '';
    if (E && E.dias) {
      var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
      var hoy = E.dias.indexOf(now.getDay()) > -1 && now.getHours() < E.corte;
      var desp = new Date(now);
      if (!hoy) { do { desp.setDate(desp.getDate() + 1); } while (E.dias.indexOf(desp.getDay()) < 0); }
      var habiles = function (dd, n) { var r = new Date(dd); while (n > 0) { r.setDate(r.getDate() + 1); if (r.getDay() % 6) n--; } return r; };
      var DS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'], DL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      var MS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      var fmt = function (x) { return DS[x.getDay()] + ' ' + x.getDate() + ' de ' + MS[x.getMonth()]; };
      var dif = Math.round((new Date(desp.toDateString()) - new Date(now.toDateString())) / 864e5);
      var dias = E.dias.slice().sort();
      var rango = dias.length > 1 && dias[dias.length - 1] - dias[0] === dias.length - 1 ? 'de ' + DL[dias[0]] + ' a ' + DL[dias[dias.length - 1]] : dias.map(function (x) { return DL[x]; }).join(', ');
      rows += '<div class="r"><i>' + icono('envio') + '</i><div><b>Despachamos ' + (hoy ? 'hoy' : dif === 1 ? 'mañana' : 'el ' + DL[desp.getDay()]) + '</b> tu pedido' +
        (hoy ? '<div class="nvx-wcd">Comprá antes de las ' + E.corte + ' h y sale hoy<br><strong>Faltan</strong><span class="nvx-wcd-t">--:--:--</span></div>' : '<small>Despachamos ' + rango + '</small>') + '</div></div>';
      rows += '<div class="r"><i>' + icono('caja') + '</i><div><b>Llega entre el ' + fmt(habiles(desp, E.min)) + ' y el ' + fmt(habiles(desp, E.max)) + '</b> ' + hEsc(E.zona || 'a todo el país') +
        '<small>' + hEsc(E.texto || 'Con número de seguimiento desde que sale') + '</small></div></div>';
      if (hoy) {
        var tEl = null;
        var tick = function () {
          tEl = tEl || root.querySelector('.nvx-wcd-t');
          if (!tEl) return;
          var n = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })), f = new Date(n); f.setHours(E.corte, 0, 0, 0);
          var sg = Math.max(0, Math.floor((f - n) / 1000)), dd = function (x) { return (x < 10 ? '0' : '') + x; };
          tEl.textContent = dd(Math.floor(sg / 3600)) + ':' + dd(Math.floor(sg % 3600 / 60)) + ':' + dd(sg % 60);
          if (!sg) tEl.closest('.nvx-wcd').textContent = 'Tu pedido sale en el próximo despacho';
        };
        setTimeout(tick, 0); setInterval(tick, 1000);
      }
    }
    if (NEVUX.envioGratisDesde > 0 && precio) {
      var falta = NEVUX.envioGratisDesde - precio;
      rows += '<div class="r"><i>' + icono('regalo') + '</i><div>' + (falta > 0 ? 'Envío gratis desde ' + money(NEVUX.envioGratisDesde) + ' · <b>te faltan ' + money(falta) + '</b>' : '<b>Este producto tiene envío gratis</b>') + '</div></div>';
    }
    if (rows) {
      var tras = root.querySelector('.nvx-pay') || root.querySelector('.nvx-wp') || pb;
      if (tras) tras.insertAdjacentHTML('afterend', '<div class="nvx-wship">' + rows + '</div>');
    }
  }

  // Abajo: bloque negro de lado a lado con las secciones de la ficha de Wess, pasadas al mundo reloj.
  function fichaWessAbajo(root, d) {
    var C = NEVUX.color, CT = NEVUX.colorTexto, FW = NEVUX.ficha || {}, O = (NEVUX.marca && NEVUX.marca.oscuro) || '#0c0b0a', money = d.money, esc = d.esc;
    hCss('nvx-wd-css',
      'html,body{overflow-x:clip}' +
      '.nvx-wd{position:relative;left:50%;width:100vw;margin:26px 0 0 -50vw;background:' + O + ';color:#fff;font-family:Inter,sans-serif;text-align:left}' +
      '.nvx-wd *{box-sizing:border-box}.nvx-wd-in{max-width:760px;margin:0 auto;padding:44px 16px 54px}' +
      '.nvx-wd section{margin:0 0 52px}.nvx-wd section:last-child{margin-bottom:0}' +
      '.nvx-wd .eb{font:800 11px/1 Inter,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:' + C + ';margin:0 0 10px}' +
      '.nvx-wd h2{margin:0 0 14px;font:400 clamp(30px,8.6vw,46px)/1.02 Anton,Oswald,sans-serif;text-transform:uppercase;color:#fff;letter-spacing:.005em}' +
      '.nvx-wd h2 em{font:inherit;font-size:1em;font-style:normal;color:' + C + ';display:block}' +
      '.nvx-wd p.tx{margin:0 0 16px;font-size:15px;line-height:1.55;color:#d4d4d4}' +
      '.nvx-wd .bt{display:inline-block;background:' + C + ';color:' + CT + '!important;border:0;border-radius:8px;padding:15px 22px;font:400 18px/1 Anton,Oswald,sans-serif;text-transform:uppercase;letter-spacing:.03em;cursor:pointer;text-decoration:none!important}' +
      '.nvx-wd-cards{display:grid;grid-auto-flow:column;grid-auto-columns:78%;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -16px;padding:0 16px}.nvx-wd-cards::-webkit-scrollbar{display:none}' +
      '@media(min-width:768px){.nvx-wd-cards{grid-auto-columns:40%}}' +
      '.nvx-wd-cd{position:relative;scroll-snap-align:start;border-radius:16px;overflow:hidden;aspect-ratio:4/5;background:#1a1816}' +
      '.nvx-wd-cd img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.nvx-wd-cd .lb{position:absolute;left:16px;top:22px;max-width:80%;background:rgba(10,10,10,.82);border-left:4px solid ' + C + ';padding:10px 14px}' +
      '.nvx-wd-cd .lb small{display:block;font:800 10px/1 Inter,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:' + C + '}' +
      '.nvx-wd-cd .lb b{display:block;margin-top:6px;font:400 24px/1 Anton,Oswald,sans-serif;text-transform:uppercase;color:#fff}' +
      '.nvx-wd-cd .lb span{display:block;margin-top:6px;font-size:12.5px;color:#e5e5e5}' +
      '.nvx-wd ul.li{list-style:none;margin:0 0 20px;padding:0}.nvx-wd ul.li li{position:relative;padding:6px 0 6px 22px;font-size:14.5px;line-height:1.45;color:#e5e5e5}' +
      '.nvx-wd ul.li li:before{content:"";position:absolute;left:0;top:12px;width:9px;height:9px;background:' + C + '}' +
      '.nvx-wd-gr{display:grid;grid-template-columns:1fr 1fr;gap:18px 12px}' +
      '.nvx-wd-gr img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px;display:block;background:#1a1816}' +
      '.nvx-wd-gr b{display:block;margin-top:10px;font:400 17px/1.1 Anton,Oswald,sans-serif;text-transform:uppercase}' +
      '.nvx-wd-gr span{display:block;margin-top:4px;font-size:12.5px;line-height:1.4;color:#a3a3a3}' +
      '.nvx-wd-pg{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
      '.nvx-wd-pg>div{position:relative;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:18px 14px}.nvx-wd-pg>div.on{border:2px solid #fff}' +
      '.nvx-wd-pg em{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:' + C + ';color:' + CT + ';font:800 10px/1 Inter,sans-serif;letter-spacing:.1em;padding:4px 8px;border-radius:3px;font-style:normal;white-space:nowrap}' +
      '.nvx-wd-pg b{display:block;font:400 17px/1.1 Anton,Oswald,sans-serif;text-transform:uppercase}.nvx-wd-pg strong{display:block;margin-top:8px;font:400 clamp(24px,7vw,32px)/1 Anton,Oswald,sans-serif}' +
      '.nvx-wd-pg small{display:block;margin-top:6px;font-size:12px;color:#a3a3a3}' +
      '.nvx-wd-cardx{background:#161412;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:22px 18px}' +
      '.nvx-wd-cardx i{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:' + C + ';color:' + CT + ';margin-bottom:16px}.nvx-wd-cardx i svg{width:22px;height:22px}' +
      '.nvx-wd-cardx b{display:block;font:400 22px/1.1 Anton,Oswald,sans-serif;text-transform:uppercase}.nvx-wd-cardx p{margin:8px 0 0;font-size:14px;line-height:1.5;color:#d4d4d4}' +
      '.nvx-wd-tb{background:#161412;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:10px 14px 12px}' +
      '.nvx-wd-tb table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}.nvx-wd-tb th{font:700 10.5px/1 Inter,sans-serif;letter-spacing:.12em;color:#a3a3a3;padding:10px 4px;text-align:center}' +
      '.nvx-wd-tb td{padding:11px 4px;text-align:center;font-size:14px;color:#e5e5e5;border-top:1px solid rgba(255,255,255,.06)}.nvx-wd-tb td:first-child{font-weight:800;color:#fff}' +
      '.nvx-wd-tb small{display:block;margin-top:8px;font-size:11.5px;color:#8a8a8a}' +
      '.nvx-wd-tq{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nvx-wd-tq>div{background:#161412;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px 12px}' +
      '.nvx-wd-tq b{display:block;font:400 17px/1.1 Anton,Oswald,sans-serif;text-transform:uppercase}.nvx-wd-tq span{display:block;margin-top:6px;font-size:12.5px;line-height:1.4;color:#a3a3a3}' +
      '.nvx-wd-fq details{border-bottom:1px solid rgba(255,255,255,.12)}.nvx-wd-fq summary{list-style:none;cursor:pointer;position:relative;padding:16px 34px 16px 0;font:500 15px/1.35 Inter,sans-serif;color:#fff}' +
      '.nvx-wd-fq summary::-webkit-details-marker{display:none}.nvx-wd-fq summary:after{content:"+";position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:24px;font-weight:300}' +
      '.nvx-wd-fq details[open] summary:after{content:"−"}.nvx-wd-fq details div{padding:0 0 16px;font-size:14px;line-height:1.55;color:#bdbdbd}' +
      '.nvx-wd-cta{text-align:center}.nvx-wd-cta .eb{text-align:center}.nvx-wd-cta h2{text-align:center}');
    // Fotos reales del producto (galería de la ficha)
    var fotos = [];
    [].forEach.call(root.querySelectorAll('.js-product-slide img, .js-swiper-product img, img[data-srcset*="/products/"], img[src*="/products/"]'), function (im) {
      var ss = im.getAttribute('data-srcset') || im.getAttribute('srcset') || '';
      var src = ss ? ss.split(',').pop().trim().split(' ')[0] : (im.getAttribute('data-src') || im.getAttribute('src') || '');
      if (!src || /data:image/.test(src)) return;
      src = src.replace(/^\/\//, 'https://');
      var key = src.replace(/-\d+-\d+\.(webp|jpg|jpeg|png)/i, '').replace(/\?.*$/, '');
      if (!fotos.some(function (f) { return f.k === key; })) fotos.push({ k: key, s: src });
    });
    fotos = fotos.map(function (f) { return f.s; });
    if (!fotos.length) { var og = document.querySelector('meta[property="og:image"]'); if (og) fotos.push(og.content); }
    var sec = function (eb, h, body, cls) { return '<section class="nvx-sec' + (cls ? ' ' + cls : '') + '">' + (eb ? '<div class="eb">' + esc(eb) + '</div>' : '') + (h || '') + body + '</section>'; };
    var titulo = function (t, dest) { return t ? '<h2>' + esc(t) + (dest ? ' <em>' + esc(dest) + '</em>' : '') + '</h2>' : ''; };
    var html = '';
    // 1) Mirala de cerca: tarjetas con las fotos y una etiqueta encima (en Wess son videos)
    var DT = FW.detalles || [];
    if (fotos.length && DT.length) {
      html += sec(FW.detallesEtiqueta || '', titulo(FW.detallesTitulo || ''), '<div class="nvx-wd-cards">' + fotos.slice(0, Math.max(DT.length, 1)).map(function (f, i) {
        var x = DT[i % DT.length] || {};
        return '<div class="nvx-wd-cd"><img src="' + esc(f) + '" alt="" loading="lazy"><div class="lb"><small>' + (i < 9 ? '0' : '') + (i + 1) + (x.etiqueta ? ' · ' + esc(x.etiqueta) : '') + '</small><b>' + esc(x.titulo || '') + '</b>' + (x.texto ? '<span>' + esc(x.texto) + '</span>' : '') + '</div></div>';
      }).join('') + '</div>');
    }
    // 2) Historia del producto con viñetas y botón
    var HI = FW.historia;
    if (HI && HI.titulo) {
      html += sec(HI.etiqueta, titulo(HI.titulo, HI.destacado), (HI.texto ? '<p class="tx">' + esc(HI.texto) + '</p>' : '') +
        (HI.puntos && HI.puntos.length ? '<ul class="li">' + HI.puntos.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<button type="button" class="bt nvx-wd-go">' + esc(HI.boton || 'Lo quiero') + '</button>');
    }
    // 3) De cerca: grilla de fotos con títulos
    var CE = FW.cerca;
    if (CE && CE.items && CE.items.length && fotos.length > 1) {
      var fc = fotos.slice(1).concat(fotos.slice(0, 1));
      html += sec(CE.etiqueta, titulo(CE.titulo), '<div class="nvx-wd-gr">' + CE.items.slice(0, fc.length).map(function (it, i) {
        return '<div><img src="' + esc(fc[i]) + '" alt="" loading="lazy"><b>' + esc(it.titulo) + '</b>' + (it.texto ? '<span>' + esc(it.texto) + '</span>' : '') + '</div>';
      }).join('') + '</div>');
    }
    // 4) Cómo pagarlo (en Wess, "Cuantas más, mejor"): solo con descuento por transferencia o cuotas sin interés reales
    if (d.precio && (d.transf > 0 || d.cuotasSin > 1)) {
      var PG = FW.pago || {}, cards = [];
      if (d.transf > 0) cards.push('<div class="on"><em>CONVIENE</em><b>Transferencia</b><strong>' + money(d.precio * (1 - d.transf / 100)) + '</strong><small>Ahorrás ' + money(d.precio * d.transf / 100) + '</small></div>');
      if (d.cuotasSin > 1) cards.push('<div><b>' + d.cuotasSin + ' cuotas sin interés</b><strong>' + money(d.precio / d.cuotasSin) + '</strong><small>Total ' + money(d.precio) + '</small></div>');
      if (cards.length < 2) cards.push('<div><b>Precio final</b><strong>' + money(d.precio) + '</strong><small>Con tarjeta</small></div>');
      html += sec(PG.etiqueta || 'Formas de pago', titulo(PG.titulo || 'Elegí cómo pagarlo'), '<div class="nvx-wd-pg">' + cards.join('') + '</div>');
    }
    // 5) Para regalar
    var RG = FW.regalo;
    if (RG && RG.titulo) {
      html += sec(RG.etiqueta, titulo(RG.titulo), '<div class="nvx-wd-cardx"><i>' + icono('regalo') + '</i><b>' + esc(RG.card || '') + '</b>' + (RG.texto ? '<p>' + esc(RG.texto) + '</p>' : '') + '</div>');
    }
    // 6) Calce: tabla de muñeca y diámetro de caja + nota del reloj
    var CA = FW.calce;
    if (CA) {
      var FIL = [['Hasta 15 cm', '34–38 mm', '36–40 mm'], ['15 a 16,5 cm', '36–40 mm', '38–42 mm'], ['16,5 a 18 cm', '38–42 mm', '40–42 mm'], ['18 a 19,5 cm', '40–44 mm', '42–44 mm'], ['Más de 19,5 cm', '42–46 mm', '44–46 mm']];
      var MU = NEVUX.muneca;
      html += sec(CA.etiqueta, titulo(CA.titulo), '<div class="nvx-wd-tb"><table><tr><th>MUÑECA</th><th>CAJA DISCRETA</th><th>CAJA CON PRESENCIA</th></tr>' +
        FIL.map(function (f) { return '<tr><td>' + f[0] + '</td><td>' + f[1] + '</td><td>' + f[2] + '</td></tr>'; }).join('') + '</table><small>Contorno de muñeca medido justo debajo del hueso.</small></div>' +
        '<div class="nvx-wd-cardx" style="margin-top:14px"><b>' + esc(MU && MU.caja ? 'Este reloj mide ' + MU.caja + ' mm' : (CA.notaTitulo || '¿Entre dos tamaños?')) + '</b><p>' +
        esc(CA.nota || 'Si dudás, la caja más chica queda más clásica y la más grande se nota más. Escribinos y te asesoramos.') + '</p>' +
        (CA.url ? '<p style="margin-top:12px"><a class="bt" href="' + esc(CA.url) + '">' + esc(CA.boton || 'Medí tu muñeca') + ' →</a></p>' : '') + '</div>');
    }
    // 7) Comprá tranquilo
    var TQ = FW.tranquilo;
    if (TQ && TQ.items && TQ.items.length) {
      html += sec(TQ.etiqueta, titulo(TQ.titulo), '<div class="nvx-wd-tq">' + TQ.items.map(function (it) { return '<div><b>' + esc(it.titulo) + '</b>' + (it.texto ? '<span>' + esc(it.texto) + '</span>' : '') + '</div>'; }).join('') + '</div>');
    }
    // 8) Preguntas
    var faqs = (NEVUX.faq || []).slice();
    if (faqs.length) {
      html += sec(FW.faqEtiqueta || 'Preguntas', titulo(FW.faqTitulo || 'Lo que nos preguntan'), '<div class="nvx-wd-fq">' + faqs.map(function (f) { return '<details><summary>' + esc(f.p) + '</summary><div>' + esc(f.r) + '</div></details>'; }).join('') + '</div>');
    }
    // 9) Cierre con botón que vuelve a la compra
    var CT2 = FW.cta;
    if (CT2 && CT2.titulo) html += sec(CT2.etiqueta, titulo(CT2.titulo), '<button type="button" class="bt nvx-wd-go">' + esc(CT2.boton || 'Comprar ahora') + '</button>', 'nvx-wd-cta');
    if (!html) return;
    root.insertAdjacentHTML('afterend', '<div class="nvx-wd"><div class="nvx-wd-in">' + html + '</div></div>');
    [].forEach.call(document.querySelectorAll('.nvx-wd-go'), function (b) {
      b.addEventListener('click', function () {
        var y = d.buyBtn.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      });
    });
  }

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
      '.nvx-c{font-family:inherit;color:#111827;margin:8px 0 18px;min-width:0;max-width:100%}' +
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
      '.nvx-spec{padding:4px 16px}.nvx-spec div{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #f1f1f1;font-size:14px}.nvx-spec div:last-child{border:0}' +
      '.nvx-spec span{opacity:.6}.nvx-spec b{text-align:right}' +
      '.nvx-mu p{font-size:13.5px;opacity:.75;margin:0 0 10px;text-align:center}' +
      '.nvx-mu-in{display:flex;gap:8px;align-items:center}.nvx-mu-in input{flex:1;min-width:0;border:1px solid #d1d5db;border-radius:10px;padding:11px;font-size:16px;color:#111;background:#fff}' +
      '.nvx-mu-in span{font-size:13px;opacity:.6}.nvx-mu-in button{border:0;border-radius:10px;padding:12px 14px;background:' + C + ';color:' + NEVUX.colorTexto + ';font-weight:800;font-size:13px;cursor:pointer}' +
      '.nvx-mu-r{text-align:center;margin-top:12px}.nvx-mu-r svg{width:100%;max-width:300px;height:auto}' +
      '.nvx-mu-r .w{fill:#e8d5c0}.nvx-mu-r .c{fill:#d6d3cd;stroke:#8b867d;stroke-width:3;transition:r .5s}.nvx-mu-r .d{fill:#111;transition:r .5s}' +
      '.nvx-mu-r b{display:block;font-size:16px;margin-top:6px}.nvx-mu-r small{display:block;font-size:13px;opacity:.7;margin-top:2px}.nvx-mu-n{display:block;text-align:center;font-size:12px;opacity:.55;margin-top:10px}' +
      '.nvx-inc{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nvx-inc>div{border:1px solid #e5e7eb;border-radius:14px;padding:14px;text-align:center}' +
      '.nvx-inc i{display:block;font-style:normal;font-size:24px}.nvx-inc b{display:block;font-size:13.5px;margin-top:6px}.nvx-inc small{display:block;font-size:12px;opacity:.65;margin-top:3px;line-height:1.35}' +
      '.nvx-rg{display:flex;gap:14px;align-items:center;border-radius:16px;padding:16px;background:' + C + '14;border:1px solid ' + C + '55}.nvx-rg i{font-style:normal;font-size:30px}' +
      '.nvx-rg b{display:block;font-size:15px}.nvx-rg p{margin:3px 0 0;font-size:13.5px;opacity:.75;line-height:1.4}' +
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

    // 1) Barra de urgencia, debajo del bloque de precio (la ficha estilo Wess no la usa)
    var WS = NEVUX.estiloFicha === 'wess', FW = NEVUX.ficha || {};
    var priceBox = priceEl ? (priceEl.closest('.js-price-container, .price-container') || priceEl.parentElement) : null;
    if (priceBox && !WS) {
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
    if (priceBox && !WS && NEVUX.precios && precio && (transf > 0 || cuotasSin > 1)) {
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
    if (priceBox && !WS && !NEVUX.precios && transf > 0 && precio) {
      var conDesc = precio * (1 - transf / 100);
      priceBox.insertAdjacentHTML('afterend',
        '<div class="nvx-best"><span class="nvx-best-tag">MEJOR PRECIO</span><div class="nvx-best-p">' + money(conDesc) +
        '<em>' + transf + '% OFF</em></div><small>por transferencia · <b>ahorrás ' + money(precio - conDesc) + '</b>' +
        (cuotasSin > 1 ? ' · ' + cuotasSin + ' cuotas sin interés de ' + money(precio / cuotasSin) : '') + '</small></div>');
    }

    // 1c) Entrega estimada y envío gratis
    var rows = '';
    if (NEVUX.envio && !WS) {
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
    if (NEVUX.envioGratisDesde > 0 && precio && !WS) {
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

    // 1d) Ficha estilo Wess: etiqueta y título condensado, bloque de precio, envío con cuenta regresiva y fechas
    if (WS) fichaWessArriba(root, { priceBox: priceBox, priceEl: priceEl, titleEl: titleEl, precio: precio, transf: transf, cuotasSin: cuotasSin, variant: variant, money: money });

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
    if (!WS) montarCuenta(NEVUX.cuentaRegresiva, function (html) {
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
    if (WS && FW.confianza && FW.confianza.length) {
      trust = '<div class="nvx-trust nvx-wtr">' + FW.confianza.map(function (t) {
        return '<div><i>' + icono(t.icono) + '</i><div><b>' + hEsc(t.titulo) + '</b>' + (t.texto ? '<small>' + hEsc(t.texto) + '</small>' : '') + '</div></div>';
      }).join('');
    } else {
      NEVUX.confianza.forEach(function (t) {
        var s = t.split(' ');
        trust += '<div><span>' + s.shift() + '</span>' + s.join(' ').replace('{cuotas}', cuotasTxt) + '</div>';
      });
    }
    btnBox.insertAdjacentHTML('afterend', trust + '</div>');
    // Ficha estilo Wess: "listo para regalar" y estrellas de calidad, arriba del botón de compra
    if (WS && (FW.regaloLinea || FW.calidad)) {
      btnBox.insertAdjacentHTML('beforebegin', '<div class="nvx-wpre">' + (FW.regaloLinea ? '<div class="nvx-wgift"><i>' + icono('regalo') + '</i><span>' + hEsc(FW.regaloLinea) + '</span></div>' : '') +
        (FW.calidad ? '<div class="nvx-wstar">★★★★★ <b>' + hEsc(FW.calidad) + '</b></div>' : '') + '</div>');
    }

    // 3b) Ayuda por WhatsApp
    if (NEVUX.whatsapp) {
      var msg = 'Hola! Tengo una consulta sobre ' + (titleEl ? titleEl.textContent.trim() : 'un producto') + ' ' + location.href;
      root.querySelector('.nvx-trust').insertAdjacentHTML('afterend',
        '<a class="nvx-wa" target="_blank" rel="noopener" href="https://wa.me/' + NEVUX.whatsapp + '?text=' +
        encodeURIComponent(msg) + '">' + hEsc(WS && FW.whatsappTexto ? FW.whatsappTexto : '¿Dudas con este producto?') + ' <b>Escribinos por WhatsApp</b></a>');
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
    if (WS) fichaWessAbajo(root, { precio: precio, transf: transf, cuotasSin: cuotasSin, money: money, buyBtn: buyBtn, esc: esc });
    var cont = '';
    if (WS) { /* las secciones de la ficha estilo Wess ya están armadas */ }
    else if (NEVUX.combina && (NEVUX.combina === 'auto' || NEVUX.combina.url)) {
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
    var ES = NEVUX.especificaciones;
    if (ES && ES.filas && ES.filas.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(ES.titulo || 'Especificaciones') + '</div><div class="nvx-card nvx-spec">' +
        ES.filas.map(function (f) { return '<div><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>'; }).join('') + '</div></div>';
    }
    var MU = NEVUX.muneca;
    if (MU && MU.caja) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(MU.titulo || '¿Cómo te queda en la muñeca?') + '</div><div class="nvx-card nvx-mu">' +
        '<p>Medí el contorno de tu muñeca con un centímetro o un hilo y escribilo acá.</p>' +
        '<div class="nvx-mu-in"><input type="number" inputmode="decimal" min="12" max="24" step="0.5" placeholder="Ej: 17" aria-label="Contorno de muñeca en cm"><span>cm</span><button type="button">Ver cómo queda</button></div>' +
        '<div class="nvx-mu-r" hidden><svg viewBox="0 0 300 140" aria-hidden="true"><rect class="w" x="0" y="30" width="300" height="80" rx="40"/><circle class="c" cx="150" cy="70" r="30"/><circle class="d" cx="150" cy="70" r="22"/></svg><b></b><small></small></div>' +
        '<small class="nvx-mu-n">Caja de ' + esc(MU.caja) + ' mm de diámetro.</small></div></div>';
    }
    var IN = NEVUX.incluye;
    if (IN && IN.items && IN.items.length) {
      cont += '<div class="nvx-sec"><div class="nvx-h">' + esc(IN.titulo || 'Qué incluye') + '</div><div class="nvx-inc">' +
        IN.items.map(function (it) { return '<div><i>' + esc(it.icono || '✓') + '</i><b>' + esc(it.titulo) + '</b>' + (it.texto ? '<small>' + esc(it.texto) + '</small>' : '') + '</div>'; }).join('') + '</div></div>';
    }
    var RG = NEVUX.regalo;
    if (RG && RG.titulo) {
      cont += '<div class="nvx-sec"><div class="nvx-rg"><i>🎁</i><div><b>' + esc(RG.titulo) + '</b>' + (RG.texto ? '<p>' + esc(RG.texto) + '</p>' : '') + '</div></div></div>';
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
      cont += '<div class="nvx-sec nvx-sec-cmp"><div class="nvx-h">' + esc(CP.titulo || '¿Por qué elegirnos?') + '</div><div class="nvx-card" style="padding:6px 10px">' +
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
      cont += '<div class="nvx-sec nvx-sec-faq"><div class="nvx-h">Preguntas frecuentes</div>' +
        faqs.map(function (f) { return '<details class="nvx-faq"><summary>' + esc(f.p) + '</summary><div>' + esc(f.r) + '</div></details>'; }).join('') + '</div>';
    }
    if (cont && !WS) {
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
          '.nvx-osc .nvx-spec div{border-color:rgba(255,255,255,.08)}.nvx-osc .nvx-inc>div{border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04)}' +
          '.nvx-osc .nvx-mu-in input{background:#15130f;border-color:rgba(255,255,255,.18);color:#f3f4f6}' +
          '.nvx-osc .nvx-combo{background:rgba(255,255,255,.06);color:#f3f4f6}.nvx-osc .nvx-combo *{color:inherit}.nvx-osc .nvx-combo button,.nvx-osc .nvx-combo .nvx-cb-add{color:' + NEVUX.colorTexto + '}' +
          '.nvx-osc .nvx-ps-a{background:rgba(220,38,38,.1);border-color:rgba(220,38,38,.35);color:#fecaca}' +
          '.nvx-osc .nvx-ps-d{background:' + C + '1f;border-color:' + C + '66;color:#f3f4f6}');
        after.insertAdjacentHTML('afterend', '<div class="nvx-c">' + ola(false) + '<div class="nvx-osc">' + cont + '</div>' + ola(true) + '</div>');
      } else {
        after.insertAdjacentHTML('afterend', '<div class="nvx-c">' + cont + '</div>');
      }
      var box = root.querySelector('.nvx-c');
      var mu = root.querySelector('.nvx-mu');
      if (mu) {
        var calc = function () {
          var cm = parseFloat(String(mu.querySelector('input').value).replace(',', '.'));
          if (!cm || cm < 12 || cm > 24) return;
          // Diámetro de caja que suele quedar proporcionado para cada contorno de muñeca
          var ideal = cm < 15.5 ? [34, 38] : cm < 17 ? [38, 41] : cm < 18.5 ? [40, 43] : cm < 20 ? [42, 45] : [44, 48];
          var caja = +NEVUX.muneca.caja, r = mu.querySelector('.nvx-mu-r');
          var t = caja < ideal[0] ? 'Te queda discreto y elegante' : caja > ideal[1] ? 'Te queda grande y llamativo' : 'Te queda proporcionado';
          r.hidden = false;
          r.querySelector('b').textContent = t;
          r.querySelector('small').textContent = 'Para una muñeca de ' + cm + ' cm suelen quedar bien cajas de ' + ideal[0] + ' a ' + ideal[1] + ' mm. Esta tiene ' + caja + ' mm.';
          // Dibujo a escala: el ancho de la muñeca (vista de frente) es cerca de un tercio del contorno
          var px = 80 / (cm * 10 / 3.2);
          r.querySelector('.c').setAttribute('r', (caja / 2 * px * 1.0).toFixed(1));
          r.querySelector('.d').setAttribute('r', (caja / 2 * px * 0.74).toFixed(1));
        };
        mu.querySelector('button').addEventListener('click', calc);
        mu.querySelector('input').addEventListener('keydown', function (e) { if (e.key === 'Enter') calc(); });
      }

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
      if (T.estilo === 'wess') {
        html += tarjetaWess(card, precio, T);
      } else if (T.estilo === 'destacado') {
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

  // Tarjeta estilo Wess: precio de lista tachado, caja "MEJOR PRECIO" por transferencia, cuotas y botón "VER →"
  function tarjetaWess(card, precio, T) {
    var C = NEVUX.color;
    hCss('nvx-tw2-css',
      '.nvx-tw2{margin-top:6px;font-family:' + FONT + ';text-align:left}' +
      '.nvx-tw2 .l{font-size:9.5px;font-weight:800;letter-spacing:.14em;color:#9ca3af;text-transform:uppercase}' +
      '.nvx-tw2 s{display:block;font-size:12px;color:#9ca3af}' +
      '.nvx-tw2 .mp{background:' + C + '1f;border-radius:12px;padding:8px 10px;margin:8px 0}' +
      '.nvx-tw2 .mp span{display:block;font-size:9.5px;font-weight:900;letter-spacing:.12em;color:' + C + '}' +
      '.nvx-tw2 .mp b{display:block;font-size:20px;font-weight:900;color:#111;line-height:1.1}' +
      '.nvx-tw2 .mp small{display:block;font-size:10.5px;color:' + C + ';opacity:.85}' +
      '.nvx-tw2 .q{font-size:11px;color:#4b5563}.nvx-tw2 .q b{display:block;font-size:15px;color:#111}' +
      '.nvx-tw2 .ver{display:flex;justify-content:center;gap:8px;margin-top:10px;background:#0c0b0a;color:#fff!important;border-radius:999px;padding:10px;font:800 11px/1 ' + FONT + ';letter-spacing:.14em;text-transform:uppercase;text-decoration:none!important}');
    var v = null;
    try { var dv = card.hasAttribute('data-variants') ? card : card.querySelector('[data-variants]'); v = dv ? JSON.parse(dv.getAttribute('data-variants'))[0] : null; } catch (e) {}
    precio = (v && v.price_number) || precio;
    if (!precio) return '';
    var out = '';
    if (v && v.compare_at_price_number > precio) out += '<span class="l">Precio de lista</span><s>' + hMoney(v.compare_at_price_number) + '</s>';
    var transf = T.transferencia || 0;
    if (!transf && v && v.price_with_payment_discount_short) { var pd = hNum(v.price_with_payment_discount_short); if (pd && pd < precio) transf = Math.round((1 - pd / precio) * 100); }
    if (transf > 0) out += '<div class="mp"><span>MEJOR PRECIO</span><b>' + hMoney(precio * (1 - transf / 100)) + '</b><small>pagando por transferencia</small></div>';
    try {
      var inst = JSON.parse(v.installments_data), sin = 0, max = 0, valMax = 0;
      Object.keys(inst).forEach(function (g) { Object.keys(inst[g]).forEach(function (n) { var q = inst[g][n]; if (q.without_interests && +n > sin) sin = +n; if (+n > max) { max = +n; valMax = q.installment_value; } }); });
      if (sin > 1) out += '<div class="q">' + sin + ' cuotas sin interés<b>' + hMoney(precio / sin) + '</b></div>';
      else if (max > 1 && valMax) out += '<div class="q">Hasta ' + max + ' cuotas de<b>' + hMoney(valMax) + '</b></div>';
    } catch (e) {}
    var a = card.querySelector('a[href*="/productos/"]');
    if (a) out += '<a class="ver" href="' + a.getAttribute('href') + '">Ver →</a>';
    return '<div class="nvx-tw2">' + out + '</div>';
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

  // Íconos de línea (beneficios estilo Wess). Si el ícono no es una de estas claves, se muestra el texto tal cual (emoji).
  var ICONOS = {
    cuotas: '<path d="M3 6h18v12H3z"/><path d="M3 10h18M7 15h4"/>',
    descuento: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="8" cy="8" r="1.5"/>',
    envio: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    garantia: '<path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    original: '<circle cx="12" cy="12" r="5"/><path d="M12 10v2l1.5 1M9 4h6l.5 3M9 20h6l.5-3M8.5 7 9 4M8.5 17 9 20"/>',
    regalo: '<path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12"/><path d="M12 9c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
    factura: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    caja: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'
  };
  function icono(k) {
    return ICONOS[k] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICONOS[k] + '</svg>' : hEsc(k || '✓');
  }

  // Vitrina estilo Wess: barra de exhibición con ganchos de la que cuelgan las tarjetas
  function vitrinaWess(row, cards, V) {
    row.classList.add('nvh-vw-row');
    cards.forEach(function (c) {
      var a = c.querySelector('a[href*="/productos/"]');
      var im = c.querySelector('img'), src = '';
      if (im) { var ss = im.getAttribute('data-srcset') || im.getAttribute('srcset'); src = im.getAttribute('data-src') || (ss ? ss.split(',').pop().trim().split(' ')[0] : im.getAttribute('src') || ''); }
      var nom = ((c.querySelector('.js-item-name, .item-name, [data-store^="product-item-name"]') || a || {}).textContent || '').trim();
      var pr = c.querySelector('.js-price-display');
      row.insertAdjacentHTML('beforeend', '<a class="nvh-vw" href="' + (a ? a.getAttribute('href') : V.url) + '"><span class="g"></span><span class="f">' +
        (src ? '<img src="' + hEsc(src) + '" alt="" loading="lazy">' : '') + '</span>' + (V.pill ? '<em>' + hEsc(V.pill) + '</em>' : '') +
        '<small>' + hEsc(nom) + '</small><b>' + (pr ? hEsc(pr.textContent.trim().replace(/,00$/, '')) : '') + '</b></a>');
    });
    // Avance automático tarjeta por tarjeta, como en Wess. Se pausa mientras la persona lo toca y vuelve al principio al llegar al final.
    if (V.auto === false || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var quieto = 0, visible = false;
    var pausa = function () { quieto = Date.now(); };
    ['touchstart', 'pointerdown', 'wheel'].forEach(function (ev) { row.addEventListener(ev, pausa, { passive: true }); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(row);
    setInterval(function () {
      if (!visible || Date.now() - quieto < 6000) return;
      var t = row.querySelector('.nvh-vw');
      if (!t) return;
      var paso = t.offsetWidth + 16;
      var fin = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      row.scrollTo({ left: fin ? 0 : row.scrollLeft + paso, behavior: 'smooth' });
    }, (V.cada || 3) * 1000);
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
        if (V.estilo === 'wess') { vitrinaWess(row, cards, V); return; }
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

  // Grilla estilo Wess: trae las tarjetas reales de la categoría y las arma con foto, etiqueta sobre la foto, precio de lista tachado,
  // "QUEDAN N" (stock real), "MEJOR PRECIO" por transferencia, cuotas y "VER →" (ver tarjetaWess)
  function cargarGrilla(G, oscuro, n) {
    var C = NEVUX.color, CT = NEVUX.colorTexto;
    if (!document.querySelector('#nvx-anton')) {
      var lk = document.createElement('link'); lk.id = 'nvx-anton'; lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&display=swap';
      document.head.appendChild(lk);
    }
    hCss('nvx-gw-css',
      '.nvh-gw-s{background:#fff!important;color:#111!important;padding-top:40px!important}' +
      '.nvh-gw-h{margin:0 0 22px;text-align:center;font:400 clamp(26px,7vw,40px)/1 Anton,Oswald,sans-serif;text-transform:uppercase;letter-spacing:-.005em;color:#111}' +
      '.nvh-gw{display:grid;grid-template-columns:1fr 1fr;gap:26px 14px}@media(min-width:768px){.nvh-gw{grid-template-columns:repeat(3,1fr);max-width:980px;margin:0 auto;gap:34px 22px}.nvh-gw-cats{max-width:760px;margin-left:auto!important;margin-right:auto!important}}' +
      '.nvh-gw-c{min-width:0;display:flex;flex-direction:column}' +
      '.nvh-gw-c .f{position:relative;display:block;background:#f1efea;aspect-ratio:4/5;overflow:hidden}' +
      '.nvh-gw-c .f img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}' +
      '.nvh-gw-c .f:hover img{transform:scale(1.04)}' +
      '.nvh-gw-c .f em{position:absolute;left:8px;bottom:8px;font-style:normal;background:' + C + ';color:' + CT + ';font:800 10px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:6px 9px;border-radius:3px}' +
      '.nvh-gw-c .n{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:12px 0 0;font:500 13px/1.35 Inter,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#111!important;text-decoration:none!important}' +
      '.nvh-gw-c .nvx-tw2{display:flex;flex-direction:column;flex:1}.nvh-gw-c .nvx-tw2 .ver{margin-top:auto}.nvh-gw-c .nvx-tw2 .q{margin-bottom:10px}' +
      '.nvh-gw-c .nvx-tw2 .l{margin-top:4px}' +
      '.nvh-gw-c .pp{display:block;margin:6px 0 10px;font:400 22px/1 Anton,Oswald,sans-serif;color:#111;font-variant-numeric:tabular-nums}' +
      '.nvh-gw-c .nvx-tw2 .ver{background:' + oscuro + '}' +
      '.nvh-gw-c .qd{align-self:flex-start;margin-top:4px;background:' + C + '26;color:#7a6330;font:800 10px/1 Inter,sans-serif;letter-spacing:.12em;padding:5px 7px;border-radius:3px}' +
      '.nvh-gw-b{text-align:center;margin-top:30px}.nvh-gw-btn{display:inline-flex;gap:12px;background:' + oscuro + ';color:#fff!important;border-radius:999px;padding:17px 28px;font:800 12.5px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none!important}' +
      '.nvh-gw-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:44px}.nvh-gw-cats:first-child{margin-top:0}' +
      '.nvh-gw-cats a{display:flex;flex-direction:column;align-items:center;gap:10px;text-decoration:none!important;color:#111!important;perspective:500px}' +
      '.nvh-gw-cats img{width:100%;max-width:120px;aspect-ratio:5/6;object-fit:contain;animation:nvh-gi 3.6s ease-in-out infinite}' +
      '.nvh-gw-cats a:nth-child(2) img{animation-delay:-.9s}.nvh-gw-cats a:nth-child(3) img{animation-delay:-1.8s}.nvh-gw-cats a:nth-child(4) img{animation-delay:-2.7s}' +
      '@keyframes nvh-gi{0%,100%{transform:rotateY(-24deg) rotate(-3deg)}50%{transform:rotateY(24deg) rotate(3deg)}}' +
      '.nvh-gw-cats span{font:400 clamp(12px,3.4vw,16px)/1 Anton,Oswald,sans-serif;text-transform:uppercase;letter-spacing:.02em;text-align:center}' +
      '@media (prefers-reduced-motion: reduce){.nvh-gw-cats img{animation:none}}');
    var box = document.querySelector('.nvh-gw[data-g="' + (n || 0) + '"]');
    if (!box) return;
    var quitar = function () {
      var s = box.closest('.nvh-gw-s'), h = s && s.querySelector('.nvh-gw-h');
      var bt = box.nextElementSibling && box.nextElementSibling.classList.contains('nvh-gw-b') ? box.nextElementSibling : null;
      box.remove(); if (h) h.remove(); if (bt) bt.remove();
      if (s && !s.querySelector('.nvh-gw-cats')) s.remove();
    };
    fetch(G.url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, 'text/html');
      var cards = [].slice.call(doc.querySelectorAll('.js-item-product')).slice(0, G.cantidad || 6);
      if (!cards.length) { quitar(); return; }
      cards.forEach(function (c) {
        var a = c.querySelector('a[href*="/productos/"]'), href = a ? a.getAttribute('href') : G.url;
        var im = c.querySelector('img'), src = '';
        if (im) { var ss = im.getAttribute('data-srcset') || im.getAttribute('srcset'); src = im.getAttribute('data-src') || (ss ? ss.split(',').pop().trim().split(' ')[0] : im.getAttribute('src') || ''); }
        var nom = ((c.querySelector('.js-item-name, .item-name, [data-store^="product-item-name"]') || a || {}).textContent || '').trim();
        var pr = c.querySelector('.js-price-display');
        var datos = tarjetaWess(c, pr ? hNum(pr.textContent) : 0, NEVUX.tarjetas || {});
        // Sin descuento por transferencia, el precio va solo (la grilla no muestra el de la plantilla)
        if (pr && datos.indexOf('class="mp"') < 0) {
          var pp = '<b class="pp">' + hEsc(pr.textContent.trim().replace(/,00$/, '')) + '</b>';
          datos = datos ? datos.replace('<div class="nvx-tw2">', '<div class="nvx-tw2">' + pp) : '<div class="nvx-tw2">' + pp + '<a class="ver" href="' + hEsc(href) + '">Ver →</a></div>';
          if (datos.indexOf('</s>') > -1) datos = datos.replace(pp, '').replace('</s>', '</s>' + pp);
        }
        // "QUEDAN N" solo con el stock real de la tienda
        var qd = '';
        if (G.quedan) {
          try {
            var dv = c.hasAttribute('data-variants') ? c : c.querySelector('[data-variants]');
            var vs = dv ? JSON.parse(dv.getAttribute('data-variants')) : null;
            if (vs && vs.every(function (v) { return v.stock != null; })) {
              var st = vs.reduce(function (s, v) { return s + (+v.stock || 0); }, 0);
              if (st > 0 && st <= G.quedan) qd = '<span class="qd">QUEDAN ' + st + '</span>';
            }
          } catch (e) {}
        }
        if (qd) datos = datos.indexOf('</s>') > -1 ? datos.replace('</s>', '</s>' + qd) : datos.replace('<div class="nvx-tw2">', '<div class="nvx-tw2">' + qd);
        box.insertAdjacentHTML('beforeend', '<div class="nvh-gw-c"><a class="f" href="' + hEsc(href) + '">' + (src ? '<img src="' + hEsc(src) + '" alt="" loading="lazy">' : '') +
          (G.pill ? '<em>' + hEsc(G.pill) + '</em>' : '') + '</a><a class="n" href="' + hEsc(href) + '">' + hEsc(nom) + '</a>' + datos + '</div>');
      });
    }).catch(quitar);
  }

  // Foto con puntos estilo Wess: título, link, 4 detalles en las esquinas y una línea de cada detalle a su punto sobre la foto.
  // Al aparecer en pantalla se dibujan las líneas y aparecen los puntos, que después laten.
  function puntosWess(PT) {
    var C = NEVUX.color;
    hCss('nvx-pw-css',
      '.nvh-pw-s{background:#fff!important;color:#111!important}' +
      '.nvh-pw-s .nvh-in{max-width:760px}' +
      '.nvh-pw-h{margin:0;font:400 clamp(30px,8.4vw,46px)/1.02 Anton,Oswald,sans-serif;letter-spacing:-.005em;color:#111;text-wrap:balance}' +
      '.nvh-pw-l{display:inline-flex;align-items:center;gap:10px;margin-top:18px;font:500 16px/1 Inter,sans-serif;color:#111!important;text-decoration:none!important}' +
      '.nvh-pw-l i{display:grid;place-items:center;width:20px;height:20px;border:1.5px solid #111;border-radius:50%;font-style:normal;font-size:12px}' +
      '.nvh-pw{position:relative;margin-top:28px}' +
      '.nvh-pw-r{display:grid;grid-template-columns:1fr 1fr;gap:16px;position:relative;z-index:2}' +
      '.nvh-pw-i b{display:block;font:400 clamp(14px,4vw,18px)/1.1 Anton,Oswald,sans-serif;text-transform:uppercase;letter-spacing:.01em}' +
      '.nvh-pw-i p{margin:5px 0 0;font:400 13px/1.45 Inter,sans-serif;color:#6b7280}' +
      '.nvh-pw-i:nth-child(2){text-align:right}' +
      '.nvh-pw-f{position:relative;margin:26px 0}.nvh-pw-f img{width:100%;display:block}' +
      '.nvh-pw svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:1}' +
      '.nvh-pw path{fill:none;stroke:' + C + ';stroke-width:1.6;transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)}' +
      '.nvh-pw-p{position:absolute;z-index:3;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:#fff;border:3px solid ' + C + ';box-shadow:0 2px 8px rgba(0,0,0,.25);transform:scale(0);transition:transform .45s cubic-bezier(.3,1.6,.5,1)}' +
      '.nvh-pw-p:after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px;border-radius:50%;background:#111}' +
      '.nvh-pw.on .nvh-pw-p{transform:scale(1);animation:nvh-pwp 2.2s ease-out infinite}' +
      '@keyframes nvh-pwp{0%{box-shadow:0 0 0 0 ' + C + 'aa,0 2px 8px rgba(0,0,0,.25)}70%,100%{box-shadow:0 0 0 14px ' + C + '00,0 2px 8px rgba(0,0,0,.25)}}' +
      '@media (prefers-reduced-motion: reduce){.nvh-pw path{transition:none}.nvh-pw-p{transform:scale(1);transition:none}.nvh-pw.on .nvh-pw-p{animation:none}}');
    var it = PT.items.slice(0, 4);
    var item = function (x, i) { return x ? '<div class="nvh-pw-i" data-i="' + i + '"><b>' + hEsc(x.titulo) + '</b>' + (x.texto ? '<p>' + hEsc(x.texto) + '</p>' : '') + '</div>' : '<div></div>'; };
    return '<section class="nvh-sec nvh-pw-s"><div class="nvh-in"><h2 class="nvh-pw-h">' + hEsc(PT.titulo || '') + '</h2>' +
      (PT.url ? '<a class="nvh-pw-l" href="' + hEsc(PT.url) + '"><i>→</i>' + hEsc(PT.boton || 'Ver producto') + '</a>' : '') +
      '<div class="nvh-pw"><svg aria-hidden="true"></svg><div class="nvh-pw-r">' + item(it[0], 0) + item(it[1], 1) + '</div>' +
      '<div class="nvh-pw-f"><img src="' + hEsc(PT.foto) + '" alt="">' +
      it.map(function (x, i) { return '<span class="nvh-pw-p" data-i="' + i + '" style="left:' + x.x + '%;top:' + x.y + '%;transition-delay:' + (0.5 + i * 0.25) + 's"></span>'; }).join('') +
      '</div><div class="nvh-pw-r">' + item(it[2], 2) + item(it[3], 3) + '</div></div></div></section>';
  }
  function initPuntosWess() {
    [].forEach.call(document.querySelectorAll('.nvh-pw:not([data-nvx-a])'), function (box) {
      box.setAttribute('data-nvx-a', '1');
      var svg = box.querySelector('svg'), img = box.querySelector('img'), on = false;
      // Cada línea baja (o sube) desde su texto hasta la altura del punto y dobla hacia él
      var dibujar = function () {
        var b = box.getBoundingClientRect(), d = '';
        if (!b.width) return;
        svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
        svg.innerHTML = [].map.call(box.querySelectorAll('.nvh-pw-p'), function (p) {
          var i = +p.getAttribute('data-i'), lab = box.querySelector('.nvh-pw-i[data-i="' + i + '"]');
          if (!lab) return '';
          var r = p.getBoundingClientRect(), l = lab.getBoundingClientRect();
          var px = r.left + r.width / 2 - b.left, py = r.top + r.height / 2 - b.top;
          var ay = i < 2 ? l.bottom - b.top + 8 : l.top - b.top - 8;
          var ax = Math.max(l.left - b.left + 14, Math.min(l.right - b.left - 14, px));
          return '<path d="M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + 'V' + py.toFixed(1) + 'H' + px.toFixed(1) + '" style="transition-delay:' + (i * 0.25) + 's"/>';
        }).join('');
        [].forEach.call(svg.querySelectorAll('path'), function (pa) {
          var len = pa.getTotalLength();
          pa.style.strokeDasharray = len;
          pa.style.strokeDashoffset = on ? 0 : len;
        });
      };
      if (img.complete) dibujar(); else img.addEventListener('load', dibujar);
      window.addEventListener('resize', dibujar);
      var prender = function () { on = true; box.classList.add('on'); [].forEach.call(svg.querySelectorAll('path'), function (pa) { pa.style.strokeDashoffset = 0; }); };
      if ('IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); dibujar(); requestAnimationFrame(prender); } }, { threshold: 0.35 });
        io.observe(box);
      } else { dibujar(); prender(); }
    });
  }

  // Medidor de reloj en pasos (el "Tu talle en 20 segundos" de Wess): para quién, muñeca, estilo y uso.
  // Al final recomienda el diámetro de caja según la muñeca. Las fichas del costado se completan a medida que se responde.
  var MD_PASOS = [
    { k: 'para', q: '¿Para quién buscamos?', t: 'Así ajustamos la escala de tamaños.', b: '¡Hola! ¿Para quién buscamos?', o: ['Hombre', 'Mujer', 'Unisex', 'Para regalar'] },
    { k: 'muneca', q: '¿Cuánto mide tu muñeca?', t: 'Medila con una tira de papel, justo debajo del hueso.', b: 'Ahora, tu muñeca.' },
    { k: 'estilo', q: '¿Qué estilo te gusta?', t: 'Elegí el que más uses o el que te guste ver.', b: '¿Qué estilo va con vos?', o: ['Clásico', 'Deportivo', 'Elegante', 'Smartwatch'] },
    { k: 'uso', q: '¿Para qué lo vas a usar?', t: 'Así sabemos qué tan resistente tiene que ser.', b: '¿Cuándo lo vas a usar?', o: ['Todos los días', 'Trabajo', 'Deporte', 'Ocasiones especiales'] },
    { k: 'fin', q: 'Tu reloj ideal', t: '', b: '¡Listo! Este es tu tamaño.' }
  ];
  function mdCaja(R) {
    if (!R.muneca) return '';
    var m = R.muneca, r = m < 15 ? [34, 38] : m < 16.5 ? [36, 40] : m < 18 ? [40, 42] : m < 19.5 ? [42, 44] : [44, 46];
    if (R.para === 'Mujer') r = [r[0] - 4, r[1] - 4];
    return r[0] + '–' + r[1] + ' mm';
  }
  function medidorReloj(MD) {
    var C = NEVUX.color, CT = NEVUX.colorTexto;
    hCss('nvx-md-css',
      '.nvh-md-s{background:#fff!important;color:#111!important;padding-top:14px!important;padding-bottom:14px!important}' +
      '.nvh-md{background:#f4f3f1;border-radius:26px;padding:18px 14px 16px;max-width:860px;margin:0 auto}' +
      '.nvh-md-top{text-align:center;margin-bottom:16px}' +
      '.nvh-md-top .pill{display:inline-flex;align-items:center;gap:8px;background:' + C + ';color:' + CT + ';border-radius:999px;padding:7px 14px;font:800 11px/1 Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase}' +
      '.nvh-md-top .pill i{width:8px;height:8px;border-radius:50%;background:currentColor;animation:nvp-bl 1.2s steps(2) infinite}' +
      '.nvh-md-top h2{margin:12px 0 0;font:400 clamp(24px,6.6vw,38px)/1.05 Anton,Oswald,sans-serif;color:#111}.nvh-md-top h2 em{font-style:normal;color:' + C + ';text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}' +
      '.nvh-md-g{display:grid;grid-template-columns:40% 1fr;gap:10px;align-items:stretch}' +
      '.nvh-md-av{position:relative;background:#e8e6e2;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:8px;min-width:0}' +
      '.nvh-md-av .bub{position:relative;z-index:1;background:#fff;border-radius:12px;padding:8px 10px;font:600 12px/1.3 Inter,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.08)}' +
      '.nvh-md-av img{width:100%;margin:6px 0;object-fit:contain;flex:1;min-height:0;max-height:180px;transition:transform .5s ease}' +
      '.nvh-md-ch{display:grid;grid-template-columns:1fr 1fr;gap:6px}' +
      '.nvh-md-ch div{background:#fff;border-radius:10px;padding:6px 5px;min-width:0}' +
      '.nvh-md-ch small{display:block;font:800 8.5px/1 Inter,sans-serif;letter-spacing:.12em;color:#9ca3af}' +
      '.nvh-md-ch b{display:block;margin-top:4px;font:800 10.5px/1.15 Inter,sans-serif;color:#111;hyphens:auto;-webkit-hyphens:auto}@media(min-width:768px){.nvh-md-ch b{font-size:14px}}' +
      '.nvh-md-q{background:#fff;border-radius:18px;padding:12px;display:flex;flex-direction:column;min-width:0}' +
      '.nvh-md-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.nvh-md-bar i{height:4px;border-radius:4px;background:#e5e7eb;transition:background .3s}.nvh-md-bar i.on{background:' + C + '}' +
      '.nvh-md-q .ps{margin-top:10px;font:800 9.5px/1 Inter,sans-serif;letter-spacing:.14em;color:' + C + '}' +
      '.nvh-md-q h3{margin:5px 0 3px;font:400 clamp(17px,4.6vw,22px)/1.1 Anton,Oswald,sans-serif;color:#111}' +
      '.nvh-md-q p{margin:0 0 10px;font:400 11.5px/1.4 Inter,sans-serif;color:#6b7280}' +
      '.nvh-md-o{display:grid;grid-template-columns:1fr 1fr;gap:7px}' +
      '.nvh-md-o button{border:1.5px solid #e5e7eb;background:#fff;border-radius:12px;padding:12px 4px;font:700 12.5px/1.15 Inter,sans-serif;color:#111;cursor:pointer;transition:border-color .2s,background .2s}' +
      '.nvh-md-o button.on{border-color:' + C + ';background:' + C + '14}' +
      '.nvh-md-r{text-align:center;padding:6px 0}.nvh-md-r b{display:block;font:400 clamp(34px,10vw,48px)/1 Anton,Oswald,sans-serif;color:#111;font-variant-numeric:tabular-nums}' +
      '.nvh-md-r input{width:100%;margin-top:12px;accent-color:' + C + '}' +
      '.nvh-md-r .rg{display:flex;justify-content:space-between;font:600 10.5px/1 Inter,sans-serif;color:#9ca3af;margin-top:4px}' +
      '.nvh-md-fin{text-align:center;padding:4px 0}.nvh-md-fin big{display:block;font:400 clamp(30px,9vw,44px)/1 Anton,Oswald,sans-serif;color:' + C + '}.nvh-md-fin span{display:block;margin-top:6px;font:500 12.5px/1.45 Inter,sans-serif;color:#4b5563}' +
      '.nvh-md-fin a{display:inline-flex;gap:8px;margin-top:12px;background:' + C + ';color:' + CT + '!important;border-radius:999px;padding:12px 18px;font:800 11.5px/1 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none!important}' +
      '.nvh-md-nav{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px}' +
      '.nvh-md-nav button{border:0;background:none;font:600 12.5px/1 Inter,sans-serif;color:#9ca3af;cursor:pointer;padding:10px}' +
      '.nvh-md-nav .sg{background:' + C + ';color:' + CT + ';border-radius:12px;padding:12px 20px;font-weight:800}.nvh-md-nav .sg:disabled{opacity:.4;cursor:default}' +
      '@media(min-width:768px){.nvh-md{padding:28px}.nvh-md-g{grid-template-columns:38% 1fr;gap:16px}.nvh-md-q{padding:20px}.nvh-md-av img{max-height:260px}}' +
      '@media (prefers-reduced-motion: reduce){.nvh-md-top .pill i{animation:none}}');
    var chip = function (k, l) { return '<div><small>' + l + '</small><b data-k="' + k + '">—</b></div>'; };
    return '<section class="nvh-sec nvh-md-s" id="medidor"><div class="nvh-in"><div class="nvh-md"><div class="nvh-md-top">' +
      '<span class="pill"><i></i>' + hEsc(MD.etiqueta || 'Tu reloj en 20 segundos') + '</span>' +
      '<h2>' + hEsc(MD.titulo || 'Probate el reloj') + ' <em>' + hEsc(MD.destacado || 'sin salir de casa') + '</em></h2></div>' +
      '<div class="nvh-md-g"><div class="nvh-md-av"><div class="bub"></div>' + (MD.foto ? '<img src="' + hEsc(MD.foto) + '" alt="">' : '<span></span>') +
      '<div class="nvh-md-ch">' + chip('para', 'PARA') + chip('muneca', 'MUÑECA') + chip('caja', 'CAJA') + chip('estilo', 'ESTILO') + '</div></div>' +
      '<div class="nvh-md-q"><div class="nvh-md-bar"><i></i><i></i><i></i><i></i><i></i></div><div class="ps"></div><h3></h3><p></p><div class="nvh-md-c"></div>' +
      '<div class="nvh-md-nav"><button type="button" class="at">Atrás</button><button type="button" class="sg">Siguiente</button></div></div></div></div></div></section>';
  }
  function initMedidor(MD) {
    var box = document.querySelector('.nvh-md:not([data-nvx-a])');
    if (!box || !MD) return;
    box.setAttribute('data-nvx-a', '1');
    var R = { muneca: 0 }, paso = 0, $ = function (q) { return box.querySelector(q); };
    var pintar = function () {
      var P = MD_PASOS[paso];
      [].forEach.call(box.querySelectorAll('.nvh-md-bar i'), function (i, n) { i.classList.toggle('on', n <= paso); });
      $('.bub').textContent = P.b;
      $('.ps').textContent = paso < 4 ? 'PASO ' + (paso + 1) + ' DE 4' : 'RESULTADO';
      $('h3').textContent = P.q;
      $('p').textContent = P.t;
      $('p').style.display = P.t ? '' : 'none';
      var c = $('.nvh-md-c');
      if (P.o) {
        c.innerHTML = '<div class="nvh-md-o">' + P.o.map(function (o) { return '<button type="button"' + (R[P.k] === o ? ' class="on"' : '') + '>' + hEsc(o) + '</button>'; }).join('') + '</div>';
        [].forEach.call(c.querySelectorAll('button'), function (b) {
          b.addEventListener('click', function () { R[P.k] = b.textContent; pintar(); });
        });
      } else if (P.k === 'muneca') {
        if (!R.muneca) R.muneca = 17;
        c.innerHTML = '<div class="nvh-md-r"><b>' + R.muneca.toFixed(1).replace('.', ',') + ' cm</b><input type="range" id="nvx-md-muneca" min="13" max="22" step="0.5" value="' + R.muneca + '" aria-label="Contorno de muñeca en centímetros"><div class="rg"><span>13 cm</span><span>22 cm</span></div></div>';
        var inp = c.querySelector('input');
        inp.addEventListener('input', function () { R.muneca = +inp.value; c.querySelector('b').textContent = R.muneca.toFixed(1).replace('.', ',') + ' cm'; fichas(); });
      } else {
        c.innerHTML = '<div class="nvh-md-fin"><big>' + mdCaja(R) + '</big><span>de diámetro de caja' + (R.estilo ? ', estilo ' + R.estilo.toLowerCase() : '') +
          (R.uso ? ', para ' + R.uso.toLowerCase() : '') + '.</span><a href="' + hEsc(MD.url || '/productos/') + '">' + hEsc(MD.boton || 'Ver relojes') + ' →</a></div>';
      }
      var sg = $('.sg'), at = $('.at');
      at.style.visibility = paso ? 'visible' : 'hidden';
      sg.textContent = paso === 4 ? 'Reiniciar' : paso === 3 ? 'Ver resultado' : 'Siguiente';
      sg.disabled = !!(P.o && !R[P.k]);
      fichas();
    };
    var fichas = function () {
      var v = { para: R.para, muneca: R.muneca ? R.muneca.toFixed(1).replace('.', ',') + ' cm' : '', caja: mdCaja(R), estilo: R.estilo };
      Object.keys(v).forEach(function (k) { var b = box.querySelector('[data-k="' + k + '"]'); if (b) b.textContent = v[k] || '—'; });
    };
    $('.sg').addEventListener('click', function () { if (paso === 4) { R = { muneca: 0 }; paso = 0; } else paso++; pintar(); });
    $('.at').addEventListener('click', function () { if (paso) { paso--; pintar(); } });
    pintar();
  }

  // "Colgado por poco tiempo" estilo Wess: barra curva con productos reales colgados, precios a distintas alturas y flechas
  function colgadoHtml(K) {
    var C = NEVUX.color, O = (NEVUX.marca && NEVUX.marca.oscuro) || '#111';
    hCss('nvx-cg-css',
      '.nvh-cg-s{background:#f6f5f3!important;color:#111!important;overflow:hidden}' +
      '.nvh-cg-h{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:8px;text-align:center}' +
      '.nvh-cg-h button{width:40px;height:40px;border-radius:50%;border:1.5px solid #111;background:none;color:#111;font:400 20px/1 Inter,sans-serif;cursor:pointer;display:grid;place-items:center;padding:0}' +
      '.nvh-cg-h small{display:block;font:800 11px/1 Inter,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#6b7280}' +
      '.nvh-cg-h h2{margin:12px 0 0;font:400 clamp(28px,8vw,46px)/.98 Anton,Oswald,sans-serif;text-transform:uppercase;color:#111;filter:blur(6px);opacity:.25;transition:filter 1s ease,opacity 1s ease}' +
      '.nvh-cg-h h2 span{display:block;color:#8b8b8b}.nvh-cg-s.on .nvh-cg-h h2{filter:none;opacity:1}' +
      '.nvh-cg-rail{position:relative;margin:26px -16px 0}' +
      '.nvh-cg-rail svg{display:block;width:100%;height:34px}' +
      '.nvh-cg-row{display:grid;grid-auto-flow:column;grid-auto-columns:33.333%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-top:-16px;padding:0 0 10px}' +
      '.nvh-cg-row::-webkit-scrollbar{display:none}@media(min-width:768px){.nvh-cg-row{grid-auto-columns:20%}}' +
      '.nvh-cg-i{scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;text-decoration:none!important;color:#111!important;min-width:0}' +
      '.nvh-cg-i .w{display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;animation:nvh-cgs 3.4s ease-in-out infinite}' +
      '.nvh-cg-i:nth-child(2n) .w{animation-delay:-1.7s}.nvh-cg-i:nth-child(3n) .w{animation-delay:-.8s}' +
      '@keyframes nvh-cgs{0%,100%{transform:rotate(-2.2deg)}50%{transform:rotate(2.2deg)}}' +
      '.nvh-cg-i svg{width:58px;height:40px;display:block}' +
      '.nvh-cg-i img{width:80%;aspect-ratio:1;object-fit:cover;margin-top:-6px;border:3px solid #fff;border-radius:6px;box-shadow:0 16px 26px rgba(0,0,0,.22)}' +
      '.nvh-cg-i b{margin-top:22px;font:400 clamp(18px,5vw,24px)/1 Anton,Oswald,sans-serif;color:' + C + ';font-variant-numeric:tabular-nums}' +
      '.nvh-cg-i:nth-child(2n) b{margin-top:38px}' +
      '.nvh-cg-b{text-align:center;margin-top:22px}.nvh-cg-b a{display:inline-flex;gap:12px;background:' + O + ';color:#fff!important;border-radius:999px;padding:17px 28px;font:800 12.5px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none!important}' +
      '@media (prefers-reduced-motion: reduce){.nvh-cg-i .w{animation:none}.nvh-cg-h h2{filter:none;opacity:1;transition:none}}');
    return '<section class="nvh-sec nvh-cg-s"><div class="nvh-in"><div class="nvh-cg-h"><button type="button" class="pv" aria-label="Anterior">‹</button><div>' +
      (K.etiqueta ? '<small>' + hEsc(K.etiqueta) + '</small>' : '') + '<h2>' + hEsc(K.titulo || 'Colgado por') + '<span>' + hEsc(K.titulo2 || 'poco tiempo.') + '</span></h2></div>' +
      '<button type="button" class="nx" aria-label="Siguiente">›</button></div><div class="nvh-cg-rail"><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="nvx-cgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset=".5" stop-color="#b9b9b9"/><stop offset="1" stop-color="#7d7d7d"/></linearGradient></defs>' +
      '<path d="M-2 26 Q50 2 102 26" fill="none" stroke="url(#nvx-cgr)" stroke-width="3.2" vector-effect="non-scaling-stroke" stroke-linecap="round" style="stroke-width:7px"/></svg>' +
      '<div class="nvh-cg-row"></div></div><div class="nvh-cg-b"><a href="' + hEsc(K.url) + '">' + hEsc(K.boton || 'Ver todos') + ' →</a></div></div></section>';
  }
  function cargarColgado(K) {
    var row = document.querySelector('.nvh-cg-row'), sec = row && row.closest('.nvh-cg-s');
    if (!row) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { sec.classList.add('on'); io.disconnect(); } }, { threshold: 0.3 });
      io.observe(sec);
    } else sec.classList.add('on');
    var mover = function (d) { var t = row.querySelector('.nvh-cg-i'); if (t) row.scrollBy({ left: d * t.offsetWidth, behavior: 'smooth' }); };
    sec.querySelector('.pv').addEventListener('click', function () { mover(-1); });
    sec.querySelector('.nx').addEventListener('click', function () { mover(1); });
    var gancho = '<svg viewBox="0 0 58 40" aria-hidden="true"><path d="M29 2c4 0 6 3 6 5.5S33 11 29 13v6L4 35h50L29 19" fill="none" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    fetch(K.url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, 'text/html');
      var cards = [].slice.call(doc.querySelectorAll('.js-item-product')).slice(0, K.cantidad || 8);
      if (!cards.length) { sec.remove(); return; }
      cards.forEach(function (c) {
        var a = c.querySelector('a[href*="/productos/"]'), im = c.querySelector('img'), src = '';
        if (im) { var ss = im.getAttribute('data-srcset') || im.getAttribute('srcset'); src = im.getAttribute('data-src') || (ss ? ss.split(',').pop().trim().split(' ')[0] : im.getAttribute('src') || ''); }
        var pr = c.querySelector('.js-price-display');
        row.insertAdjacentHTML('beforeend', '<a class="nvh-cg-i" href="' + hEsc(a ? a.getAttribute('href') : K.url) + '"><span class="w">' + gancho +
          (src ? '<img src="' + hEsc(src) + '" alt="" loading="lazy">' : '') + '</span>' + (pr ? '<b>' + hEsc(pr.textContent.trim().replace(/,00$/, '')) + '</b>' : '') + '</a>');
      });
    }).catch(function () { sec.remove(); });
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
      '.nvh-tagw{display:flex}.nvh-tagw>.nvh-tag{flex:1}' +
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
    if (PT && PT.foto && PT.items && PT.items.length && PT.estilo !== 'wess') {
      html += sec('', PT.etiqueta || '', PT.titulo || '', PT.texto || '',
        '<div class="nvh-pts"><div class="nvh-pts-f"><img src="' + hEsc(PT.foto) + '" alt="" loading="lazy">' +
        PT.items.map(function (it, i) { return '<button class="nvh-pt" data-i="' + i + '" style="left:' + it.x + '%;top:' + it.y + '%" aria-label="' + hEsc(it.titulo) + '">' + (i + 1) + '</button>'; }).join('') +
        '</div><div class="nvh-pts-l">' + PT.items.map(function (it, i) {
          return '<div class="nvh-pti" data-i="' + i + '"><i>' + (i + 1) + '</i><div><b>' + hEsc(it.titulo) + '</b>' + (it.texto ? '<p>' + hEsc(it.texto) + '</p>' : '') + '</div></div>';
        }).join('') + '</div></div>' + (PT.url ? '<div style="text-align:center;margin-top:22px"><a class="nvh-btn" href="' + hEsc(PT.url) + '">' + hEsc(PT.boton || 'Ver producto') + ' →</a></div>' : ''));
    }
    // Vitrinas: productos reales de una categoría en carrusel (se cargan de la tienda al abrir la home)
    (H.vitrinas || []).forEach(function (V, n) {
      if (V.estilo === 'wess') {
        html += '<section class="nvh-sec nvh-dark nvh-vit nvh-vw-s"><div class="nvh-in"><div class="nvh-vw-h">' + (V.logo ? '<img src="' + hEsc(V.logo) + '" alt="">' : '') +
          '<div>' + (V.etiqueta ? '<span class="p">' + hEsc(V.etiqueta) + '</span>' : '') + '<h2>' + hEsc(V.titulo || '') + '</h2></div></div>' +
          '<div class="nvh-vw-rail"></div><div class="nvh-vit-row" data-vit="' + n + '"></div>' +
          '<div style="text-align:center;margin-top:26px"><a class="nvh-vw-btn" href="' + hEsc(V.url) + '">' + hEsc(V.boton || 'Ver todos') + ' →</a></div></div></section>';
        return;
      }
      html += sec((V.oscuro ? 'nvh-dark ' : '') + 'nvh-vit', V.etiqueta || '', V.titulo || '', V.texto || '',
        '<div class="nvh-vit-row" data-vit="' + n + '"></div>' +
        '<div style="text-align:center;margin-top:20px"><a class="nvh-btn" href="' + hEsc(V.url) + '">' + hEsc(V.boton || 'Ver todos') + ' →</a></div>');
    });
    // Grillas estilo Wess ("Promociones limitadas", "Ofertas"): productos reales en 2 columnas y, debajo, categorías con fotos recortadas que giran.
    // H.grilla puede ser una sola o una lista. La foto con puntos estilo Wess va después de la primera grilla, como en Wess.
    var GS = [].concat(H.grilla || []).filter(function (G) { return G && (G.url || (G.categorias && G.categorias.length)); });
    var pw = PT && PT.estilo === 'wess' && PT.foto && PT.items && PT.items.length ? puntosWess(PT) : '';
    var md = H.medidor ? medidorReloj(H.medidor) : '';
    GS.forEach(function (G, n) {
      html += '<section class="nvh-sec nvh-gw-s"><div class="nvh-in">' + (G.titulo ? '<h2 class="nvh-gw-h">' + hEsc(G.titulo) + '</h2>' : '') +
        (G.url ? '<div class="nvh-gw" data-g="' + n + '"></div>' + (G.boton ? '<div class="nvh-gw-b"><a class="nvh-gw-btn" href="' + hEsc(G.url) + '">' + hEsc(G.boton) + ' →</a></div>' : '') : '') +
        (G.categorias && G.categorias.length ? '<div class="nvh-gw-cats">' + G.categorias.map(function (c) {
          return '<a href="' + hEsc(c.url) + '">' + (c.foto ? '<img src="' + hEsc(c.foto) + '" alt="" loading="lazy">' : '') + '<span>' + hEsc(c.nombre) + '</span></a>';
        }).join('') + '</div>' : '') + '</div></section>';
      if (!n) { html += pw; pw = ''; }
      if (n === 1) { html += md; md = ''; }
    });
    html += pw + md;
    var W = H.porQue;
    if (W && W.items && W.items.length) {
      html += sec('nvh-dark nvh-why-s', W.etiqueta || '', W.titulo || 'Por qué elegirnos', W.texto || '',
        '<div class="nvh-why">' + W.items.map(function (it) {
          return '<div class="nvh-tagw"><div class="nvh-tag">' + (it.destacado ? '<big>' + hEsc(it.destacado) + '</big>' : '') + '<b>' + hEsc(it.titulo) + '</b>' +
            (it.texto ? '<p>' + hEsc(it.texto) + '</p>' : '') + (it.pie ? '<small>' + hEsc(it.pie) + '</small>' : '') + '</div></div>';
        }).join('') + '</div>');
    }
    if (H.colgado && H.colgado.url) html += colgadoHtml(H.colgado);
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
      html += sec('nvh-dark nvh-faq-s', '', H.faqTitulo || 'Lo que siempre nos preguntan', '',
        '<div class="nvh-faq">' + H.faq.map(function (f) { return '<details><summary>' + hEsc(f.p) + '</summary><div>' + hEsc(f.r) + '</div></details>'; }).join('') +
        (H.faqLink && H.faqLink.url ? '<a class="nvh-faq-l" href="' + hEsc(H.faqLink.url) + '">' + hEsc(H.faqLink.texto || 'Ver más') + '</a>' : '') + '</div>');
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
    GS.forEach(function (G, n) { cargarGrilla(G, oscuro, n); });
    initPuntosWess();
    initMedidor(H.medidor);
    if (H.colgado && H.colgado.url) cargarColgado(H.colgado);
    // Portada estilo Wess: franja con reloj en vivo (o cuenta regresiva del evento), logo, etiqueta, título gigante y botón
    var PO = H.portada;
    if (PO && !document.querySelector('.nvp')) {
      var EVp = NEVUX.evento;
      if (!document.querySelector('#nvx-anton')) {
        var lk = document.createElement('link'); lk.id = 'nvx-anton'; lk.rel = 'stylesheet';
        lk.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&display=swap';
        document.head.appendChild(lk);
      }
      var CC = CA, CT2 = luz(CC) > 0.45 ? '#111' : '#fff';
      hCss('nvx-portada-css',
        '.nvp{position:relative;overflow:hidden;background:' + oscuro + ';color:#fff;font-family:Inter,system-ui,sans-serif}' +
        '.nvp-fr{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px 12px;border-top:1px solid rgba(255,255,255,.08);border-bottom:2px solid ' + CC + ';' +
        'background:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 18px,transparent 18px 46px),' + oscuro + '}' +
        '.nvp-fr .m{font:400 19px/1 Anton,Oswald,sans-serif;letter-spacing:.02em;text-transform:uppercase}.nvp-fr .m em{font-style:normal;color:' + CC + '}' +
        '.nvp-fr .dot{width:7px;height:7px;border-radius:50%;background:' + CC + ';animation:nvp-bl 1s steps(2) infinite}' +
        '@keyframes nvp-bl{50%{opacity:.25}}' +
        '.nvp-fr .t{font:700 12px/1 Inter,sans-serif;letter-spacing:.2em;text-transform:uppercase}' +
        '.nvp-fr .n{display:flex;gap:5px}.nvp-fr .n b{background:' + CC + ';color:' + CT2 + ';border-radius:4px;padding:5px 7px 4px;font:400 17px/1 Anton,Oswald,sans-serif;font-variant-numeric:tabular-nums;min-width:38px;text-align:center}' +
        '.nvp-fr .n b small{font:700 10px Inter,sans-serif;margin-left:2px;opacity:.85}' +
        '.nvp-in{position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:44px 20px 56px}' +
        '.nvp-logo{width:min(230px,58vw);display:block;margin-bottom:26px}' +
        '.nvp-pill{display:inline-block;background:' + CC + ';color:' + CT2 + ';border-radius:6px;padding:9px 16px;font:800 15px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase}' +
        '.nvp h1{margin:14px 0 0;font:400 clamp(78px,24vw,190px)/.86 Anton,Oswald,sans-serif;text-transform:uppercase;letter-spacing:-.005em}' +
        '.nvp h1 .a{display:block;color:' + CC + '}.nvp h1 .b{display:block;color:#fff;font-size:.82em}' +
        '.nvp p{margin:22px 0 30px;max-width:520px;font-size:clamp(16px,4.6vw,20px);line-height:1.45;color:rgba(255,255,255,.75)}' +
        '.nvp-btn{display:inline-flex;align-items:center;gap:14px;background:#fff;color:#111!important;border-radius:999px;padding:20px 28px;white-space:nowrap;font:800 clamp(12px,3.4vw,16px)/1 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none!important}' +
        '.nvp-btn i{font-style:normal;font-size:20px;animation:nvp-dn 1.4s ease-in-out infinite}@keyframes nvp-dn{50%{transform:translateY(4px)}}' +
        '.nvp-diag{position:absolute;z-index:1;right:-46%;top:64%;width:100%;height:64px;background:' + CC + ';transform:rotate(-58deg);transform-origin:center;opacity:.95;box-shadow:0 0 60px ' + CC + '55}' +
        '.nvp-dial{position:absolute;z-index:0;right:-170px;top:60px;width:560px;height:560px;opacity:.13}' +
        '.nvp-dial .sg{transform-origin:280px 280px;animation:nvp-sg 60s steps(60) infinite}@keyframes nvp-sg{to{transform:rotate(360deg)}}' +
        '@media(min-width:900px){.nvp-dial{right:4%;top:40px;width:640px;height:640px;opacity:.18}.nvp-diag{right:-20%;top:58%;width:70%}}' +
        '@media (prefers-reduced-motion: reduce){.nvp-dial .sg,.nvp-btn i,.nvp-fr .dot{animation:none}}');
      var ticks = '';
      for (var tk = 0; tk < 60; tk++) {
        var ang = tk * 6 * Math.PI / 180, r1 = 262, r2 = tk % 5 ? 250 : 226;
        ticks += '<line x1="' + (280 + r1 * Math.sin(ang)).toFixed(1) + '" y1="' + (280 - r1 * Math.cos(ang)).toFixed(1) + '" x2="' + (280 + r2 * Math.sin(ang)).toFixed(1) + '" y2="' + (280 - r2 * Math.cos(ang)).toFixed(1) + '" stroke="#fff" stroke-width="' + (tk % 5 ? 2 : 6) + '"/>';
      }
      var dial = '<svg class="nvp-dial" viewBox="0 0 560 560" aria-hidden="true"><circle cx="280" cy="280" r="276" fill="none" stroke="#fff" stroke-width="3"/>' + ticks +
        '<line x1="280" y1="280" x2="200" y2="160" stroke="#fff" stroke-width="12" stroke-linecap="round"/><line x1="280" y1="280" x2="420" y2="200" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
        '<g class="sg"><line x1="280" y1="320" x2="280" y2="40" stroke="' + CC + '" stroke-width="3"/></g><circle cx="280" cy="280" r="10" fill="' + CC + '"/></svg>';
      var frTexto = PO.franja || 'Hora oficial';
      var poHtml = '<section class="nvp"><div class="nvp-fr"><span class="m">' + (PO.marca ? hEsc(PO.marca).replace(/^(\S+)/, '<em>$1</em>') : '') + '</span><span class="dot"></span>' +
        '<span class="t"></span><span class="n"></span></div>' + dial + '<div class="nvp-diag"></div><div class="nvp-in">' +
        (PO.logo ? '<img class="nvp-logo" src="' + hEsc(PO.logo) + '" alt="">' : '') +
        (PO.etiqueta ? '<span class="nvp-pill">' + hEsc(PO.etiqueta) + '</span>' : '') +
        '<h1><span class="a">' + hEsc(PO.titulo || '') + '</span>' + (PO.titulo2 ? '<span class="b">' + hEsc(PO.titulo2) + '</span>' : '') + '</h1>' +
        (PO.texto ? '<p>' + hEsc(PO.texto) + '</p>' : '') +
        (PO.boton ? '<a class="nvp-btn" href="' + hEsc(PO.url || '#') + '">' + hEsc(PO.boton) + ' <i>↓</i></a>' : '') + '</div></section>';
      var hdr = document.querySelector('header.js-head-main, .js-head-main, header');
      var slp = document.querySelector('[data-store="home-slider"]');
      if (hdr && hdr.parentNode) hdr.insertAdjacentHTML('afterend', poHtml);
      else if (slp) slp.insertAdjacentHTML('beforebegin', poHtml);
      else document.body.insertAdjacentHTML('afterbegin', poHtml);
      if (slp && PO.reemplazarBanner) slp.style.display = 'none';
      // Franja: cuenta regresiva si hay un evento en curso o por venir; si no, la hora de Argentina en vivo
      var fr = document.querySelector('.nvp-fr'), tN = fr.querySelector('.n'), tT = fr.querySelector('.t');
      var dosD = function (n) { return (n < 10 ? '0' : '') + n; };
      var cajaP = function (n, l) { return '<b>' + dosD(n) + '<small>' + l + '</small></b>'; };
      var tickP = function () {
        var meta = EVENTO === 'durante' ? EVp.hasta : EVENTO === 'antes' ? EVp.desde : null;
        if (meta) {
          var ms = new Date(meta) - Date.now(), sg = Math.max(0, Math.floor(ms / 1000));
          tT.textContent = EVENTO === 'durante' ? 'Termina' : 'Empieza';
          tN.innerHTML = cajaP(Math.floor(sg / 86400), 'D') + cajaP(Math.floor(sg % 86400 / 3600), 'H') + cajaP(Math.floor(sg % 3600 / 60), 'M') + cajaP(sg % 60, 'S');
        } else {
          var ar = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
          tT.textContent = frTexto;
          tN.innerHTML = cajaP(ar.getHours(), 'H') + cajaP(ar.getMinutes(), 'M') + cajaP(ar.getSeconds(), 'S');
        }
      };
      tickP(); setInterval(tickP, 1000);
    }
    var HE = H.hero;
    if (HE && (HE.foto || HE.titulo) && !document.querySelector('.nvh-hero')) {
      hCss('nvx-hero-css',
        '.nvh-hero{position:relative;overflow:hidden;background:' + oscuro + ';color:#fff;text-align:center;padding:56px 18px 0;font-family:' + (M.fuente || 'inherit') + '}' +
        '.nvh-hero .nvh-eb{color:' + CA + '}' +
        '.nvh-hero h1{font-size:clamp(34px,9vw,68px);line-height:1.02;font-weight:500;margin:10px 0 12px;letter-spacing:-.01em}' +
        '.nvh-hero h1 em{font-style:italic;color:' + CA + '}' +
        '.nvh-hero p{opacity:.75;max-width:520px;margin:0 auto 24px;font-size:16px;line-height:1.5}' +
        '.nvh-hero .nvh-btn{background:' + CA + ';color:' + (luz(CA) > 0.45 ? '#111' : '#fff') + '!important}' +
        '.nvh-hero-f{position:relative;max-width:560px;margin:34px auto 0;will-change:transform}' +
        '.nvh-hero-f img{width:100%;display:block;filter:drop-shadow(0 40px 60px rgba(0,0,0,.6))}' +
        '.nvh-hero-g{position:absolute;left:50%;top:55%;width:120%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(circle,' + CA + '40,transparent 60%);pointer-events:none}');
      var heroHtml = '<section class="nvh-hero"><div class="nvh-eb">' + hEsc(HE.etiqueta || '') + '</div><h1>' + hEsc(HE.titulo || '') +
        (HE.destacado ? '<br><em>' + hEsc(HE.destacado) + '</em>' : '') + '</h1>' + (HE.texto ? '<p>' + hEsc(HE.texto) + '</p>' : '') +
        (HE.url ? '<a class="nvh-btn" href="' + hEsc(HE.url) + '">' + hEsc(HE.boton || 'Ver la colección') + ' →</a>' : '') +
        (HE.foto ? '<div class="nvh-hero-f"><div class="nvh-hero-g"></div><img src="' + hEsc(HE.foto) + '" alt=""></div>' : '<div style="height:56px"></div>') + '</section>';
      var sl = document.querySelector('[data-store="home-slider"]');
      if (sl) { sl.insertAdjacentHTML('beforebegin', heroHtml); if (HE.reemplazarBanner) sl.style.display = 'none'; }
      else (document.querySelector('.nvh') || footer || document.body).insertAdjacentHTML('beforebegin', heroHtml);
      var hf = document.querySelector('.nvh-hero-f');
      if (hf && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        var pend = false;
        var mov = function () {
          pend = false;
          var y = Math.min(window.scrollY, 700);
          hf.style.transform = 'translateY(' + (-y * 0.12) + 'px) scale(' + (1 + y / 2200) + ') rotate(' + (y / 90) + 'deg)';
        };
        window.addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(mov); } }, { passive: true });
      }
    }
    [].forEach.call(document.querySelectorAll('.nvh-pts'), function (box) {
      var marcar = function (i) {
        [].forEach.call(box.querySelectorAll('[data-i]'), function (e) { e.classList.toggle('on', e.getAttribute('data-i') === String(i)); });
      };
      [].forEach.call(box.querySelectorAll('[data-i]'), function (e) { e.addEventListener('click', function () { marcar(e.getAttribute('data-i')); }); });
    });
    if (H.beneficios && H.beneficios.length) {
      var ben = '<div class="nvh"><div class="nvh-ben">' + H.beneficios.map(function (b) {
        return '<div><i>' + icono(b.icono) + '</i><div><b>' + hEsc(b.titulo) + '</b>' + (b.texto ? '<small>' + hEsc(b.texto) + '</small>' : '') + '</div></div>';
      }).join('') + '</div></div>';
      var slider = document.querySelector('[data-store="home-slider"]');
      var portadaEl = document.querySelector('.nvp');
      if (portadaEl) {
        portadaEl.insertAdjacentHTML('afterend', ben);
        // Las vitrinas estilo Wess van pegadas a los beneficios, como en la portada de Wess
        var benEl = portadaEl.nextElementSibling;
        [].slice.call(document.querySelectorAll('.nvh-vw-s, .nvh-gw-s, .nvh-pw-s, .nvh-md-s')).reverse().forEach(function (s) {
          benEl.insertAdjacentHTML('afterend', '<div class="nvh"></div>');
          benEl.nextElementSibling.appendChild(s);
        });
      } else if (slider) slider.insertAdjacentHTML('afterend', ben);
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

  // Premium: tipografías de marca y entrada animada de cada sección de Nevux al aparecer en pantalla
  function initPremium() {
    var P = NEVUX.premium;
    if (!P) return;
    var fams = [P.titulos, P.texto].filter(Boolean);
    if (fams.length && !document.querySelector('#nvx-fonts')) {
      var l = document.createElement('link');
      l.id = 'nvx-fonts'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?' + fams.map(function (f) { return 'family=' + f.replace(/ /g, '+') + ':ital,wght@0,400;0,500;0,600;1,400;1,500'; }).join('&') + '&display=swap';
      document.head.appendChild(l);
    }
    hCss('nvx-prem-css',
      (P.titulos ? '.nvx-h,.nvh-h,.nvh-hero h1,.nvh-tag big,.nvh-pti b{font-family:"' + P.titulos + '",serif!important;font-weight:500!important;letter-spacing:.02em}' : '') +
      (P.texto ? '.nvh-p,.nvh-hero p,.nvx-rg p,.nvh-faq details div{font-family:"' + P.texto + '",serif;font-size:1.08em}' : '') +
      '.nvx-rv{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}.nvx-rv.nvx-in{opacity:1;transform:none}' +
      '@media (prefers-reduced-motion: reduce){.nvx-rv{opacity:1;transform:none;transition:none}}');
    if (P.tema === 'wess') {
      var C = NEVUX.color, CT = NEVUX.colorTexto, O = (NEVUX.marca && NEVUX.marca.oscuro) || '#0c0b0a';
      hCss('nvx-wess-css',
        // Títulos condensados en mayúsculas y etiquetas con rombos
        '.nvx-h,.nvh-h,.nvh-hero h1{text-transform:uppercase;letter-spacing:.01em!important;line-height:1.02!important}' +
        '.nvh-hero h1{font-size:clamp(42px,12vw,92px)!important}' +
        '.nvx-eb,.nvh-eb{letter-spacing:.32em!important}.nvx-eb:before,.nvx-eb:after,.nvh-eb:before,.nvh-eb:after{content:"◆";margin:0 10px;font-size:.8em}' +
        // Comparativa con la columna de la marca rellena y tildes en círculos
        '.nvx-sec-cmp .nvx-card{background:#141210!important;border-color:rgba(255,255,255,.08)!important}' +
        '.nvx-sec-cmp th.nvx-m{background:' + C + '!important;color:' + CT + '!important;border-radius:16px 16px 0 0;padding:16px 4px!important;font-size:14px!important;letter-spacing:.14em;text-transform:uppercase}' +
        '.nvx-sec-cmp td.nvx-m{background:' + C + '!important;color:' + CT + '!important;opacity:1!important}' +
        '.nvx-sec-cmp tr:last-child td.nvx-m{border-radius:0 0 16px 16px}' +
        '.nvx-sec-cmp td.nvx-m:before{content:"✓";display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.18);font-weight:900}' +
        '.nvx-sec-cmp td.nvx-m{font-size:0!important}.nvx-sec-cmp td.nvx-m:before{font-size:15px}' +
        '.nvx-sec-cmp td.nvx-x{font-size:0!important}.nvx-sec-cmp td.nvx-x:before{content:"✕";display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.06);color:#6b7280;font-size:13px}' +
        '.nvx-sec-cmp td:first-child{color:#e5e7eb!important}.nvx-sec-cmp th{color:#9ca3af!important}' +
        '.nvx-sec-cmp .nvx-cmp-bar{display:none}' +
        // Preguntas frecuentes sobre el color de la marca, con tarjetas blancas
        '.nvx-sec-faq{background:' + C + ';margin:0 -16px;padding:30px 16px 22px;border-radius:28px 28px 0 0}' +
        '.nvx-sec-faq .nvx-h{color:' + CT + '!important}' +
        '.nvx-sec-faq .nvx-faq{background:#fff!important;border:0!important;color:#111!important;border-radius:14px}' +
        '.nvx-sec-faq .nvx-faq div{color:#4b5563!important}.nvx-sec-faq .nvx-faq summary:after{color:' + C + '!important}' +
        '.nvx-sec-faq .nvx-faq summary:before{content:"◆";color:' + C + ';margin-right:10px;font-size:11px}' +
        // Cinta más grande y en mayúsculas
        '.nvx-cinta{border-radius:0!important;margin-left:-16px!important;margin-right:-16px!important;padding:13px 0!important}.nvx-cinta div{font-size:14px!important;letter-spacing:.18em!important}' +
        // Bloques de la home más contrastados
        '.nvh-dark{background:' + O + '!important}' +
        // Beneficios: lista blanca con íconos de línea en círculo y títulos condensados
        '.nvh-ben{display:block!important;background:#fff!important;padding:12px 18px 6px!important;border-bottom:3px solid ' + C + ';max-width:none!important;margin:0!important}' +
        '.nvh-ben>div{display:flex!important;gap:16px;align-items:flex-start;padding:16px 0!important;border:0!important;border-bottom:1px solid #ececec!important;border-radius:0!important;background:none!important;box-shadow:none!important;max-width:760px;margin:0 auto!important}' +
        '.nvh-ben>div:last-child{border-bottom:0!important}' +
        '.nvh-ben i{flex:none;width:42px;height:42px;border-radius:50%;border:1.5px solid #d4d4d4;display:grid!important;place-items:center;font-size:18px;color:#222;font-style:normal}' +
        '.nvh-ben i svg{width:20px;height:20px}' +
        '.nvh-ben b{display:block;font-family:Oswald,sans-serif!important;font-weight:600!important;font-size:20px!important;text-transform:uppercase;letter-spacing:.01em;color:#111}' +
        '.nvh-ben small{display:block;font-size:14px!important;color:#6b7280!important;line-height:1.45;margin-top:3px}' +
        // Vitrina con barra de exhibición
        '.nvh-vw-s .nvh-in{max-width:1200px}' +
        '.nvh-vw-h{display:flex;align-items:center;gap:16px;margin-bottom:22px}.nvh-vw-h img{width:84px;flex:none}' +
        '.nvh-vw-h .p{display:inline-block;background:' + C + ';color:' + CT + ';font:800 10.5px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:6px 9px;border-radius:4px}' +
        '.nvh-vw-h h2{margin:6px 0 0;font:400 clamp(34px,9.5vw,60px)/1 Anton,Oswald,sans-serif;text-transform:uppercase;color:#fff}' +
        '.nvh-vw-rail{height:10px;margin:0 -16px;border-radius:2px;background:linear-gradient(180deg,#e9e2d4,' + C + ' 45%,#6b5a2e);box-shadow:0 4px 10px rgba(0,0,0,.5)}' +
        '.nvh-vw-row{display:grid;grid-auto-flow:column;grid-auto-columns:66%;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 2px 8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}' +
        '.nvh-vw-row::-webkit-scrollbar{display:none}@media(min-width:768px){.nvh-vw-row{grid-auto-columns:28%}}' +
        '.nvh-vw-row>.nvh-vw{scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;text-align:center;text-decoration:none!important;color:#fff!important;background:none!important;padding:0!important;border-radius:0!important}' +
        '.nvh-vw .g{width:40px;height:22px;border:3px solid ' + C + ';border-bottom:0;border-radius:20px 20px 0 0;margin-top:-1px}' +
        '.nvh-vw .f{display:block;width:100%;background:#f1efea;border-radius:6px;padding:8px;box-shadow:0 18px 40px rgba(0,0,0,.6);transform-origin:50% -20px;animation:nvh-sw 4s ease-in-out infinite}' +
        '.nvh-vw:nth-child(2n) .f{animation-delay:-2s}@keyframes nvh-sw{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}' +
        '.nvh-vw .f img{width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:4px}' +
        '.nvh-vw em{margin-top:16px;font-style:normal;background:' + C + ';color:' + CT + ';font:800 10.5px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:6px 10px;border-radius:4px}' +
        '.nvh-vw small{margin-top:8px;font:700 12px/1.3 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#cfcfcf}' +
        '.nvh-vw b{margin-top:4px;font:400 28px/1 Anton,Oswald,sans-serif;color:#fff}' +
        '.nvh-vw-btn{display:inline-flex;gap:12px;background:' + C + ';color:' + CT + '!important;border-radius:999px;padding:18px 30px;font:800 13px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none!important}' +
        '@media (prefers-reduced-motion: reduce){.nvh-vw .f{animation:none}}' +
        // Por qué: título a la izquierda con raya, etiquetas colgadas de un hilo que se balancean y código de barras al pie
        '.nvh-why-s .nvh-eb,.nvh-faq-s .nvh-eb{text-align:left;color:#d1d5db!important;letter-spacing:.28em!important}' +
        '.nvh-why-s .nvh-eb:before{content:"";display:inline-block;width:34px;height:3px;background:' + C + ';vertical-align:middle;margin:0 14px 0 0}.nvh-why-s .nvh-eb:after{content:none}' +
        '.nvh-why-s .nvh-h,.nvh-faq-s .nvh-h{text-align:left;font-family:Anton,Oswald,sans-serif!important;font-weight:400!important;font-size:clamp(34px,10vw,58px)!important}' +
        '.nvh-why-s .nvh-p{text-align:left;margin-left:0}' +
        '.nvh-why-s .nvh-why{grid-template-columns:1fr 1fr;gap:34px 12px;margin-top:40px}@media(min-width:768px){.nvh-why-s .nvh-why{grid-template-columns:repeat(4,1fr)}}' +
        '.nvh-why-s .nvh-tagw{position:relative;transform-origin:50% -24px;animation:nvh-tsw 4.5s ease-in-out infinite}' +
        '.nvh-why-s .nvh-tagw:nth-child(2n){animation-delay:-2.2s}@keyframes nvh-tsw{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}' +
        '.nvh-why-s .nvh-tagw:before{content:"";position:absolute;z-index:1;left:50%;top:-24px;width:1.5px;height:40px;background:#cfcfcf}' +
        '.nvh-why-s .nvh-tag{padding:34px 14px 14px}' +
        '.nvh-why-s .nvh-tag big{font-family:Anton,Oswald,sans-serif!important;font-weight:400!important;font-size:clamp(28px,8vw,40px);text-transform:uppercase}' +
        '.nvh-why-s .nvh-tag p{font-size:13px}' +
        '.nvh-why-s .nvh-tag small{display:flex;justify-content:space-between;align-items:center;gap:6px;border-top:1px solid #cdc5b4!important;font-size:8.5px!important}' +
        '.nvh-why-s .nvh-tag small:after{content:"";flex:none;width:42px;height:18px;background:repeating-linear-gradient(90deg,#111 0 1.5px,transparent 1.5px 3px,#111 3px 4px,transparent 4px 6px,#111 6px 8.5px,transparent 8.5px 9.5px)}' +
        // Preguntas frecuentes: título a la izquierda, preguntas condensadas y link al final
        '.nvh-faq-s .nvh-faq{max-width:none}.nvh-faq-s .nvh-faq summary{font-family:Oswald,Anton,sans-serif;font-weight:600;letter-spacing:.01em;font-size:16px}' +
        '.nvh-faq-s .nvh-faq summary:after{font-size:28px;font-weight:300}' +
        '.nvh-faq-l{display:inline-block;margin-top:20px;color:#fff!important;font:500 14px/1 Inter,sans-serif;text-underline-offset:4px}' +
        '@media (prefers-reduced-motion: reduce){.nvh-why-s .nvh-tagw{animation:none}}' +
        // Cierre en arco
        '.nvh-cierre{border-radius:46% 46% 0 0/120px 120px 0 0!important;margin:0 10px;padding-top:58px!important}' +
        '.nvh-cierre .nvh-eb:before,.nvh-cierre .nvh-eb:after{content:"";display:inline-block;width:26px;height:1.5px;background:' + C + ';vertical-align:middle;margin:0 12px}' +
        '.nvh-cierre .nvh-h{font-family:Anton,Oswald,sans-serif!important;font-weight:400!important}' +
        '.nvh-cierre .nvh-btn{background:#fff!important;color:#111!important;padding:16px 24px}');
    }
    if (P.animar === false || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('nvx-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(document.querySelectorAll('.nvx-sec, .nvh-sec .nvh-in > *'), function (el) { el.classList.add('nvx-rv'); io.observe(el); });
  }

  function arrancar() {
    detectarMarca();
    initBarra();
    initVentas();
    initHome();
    initTarjetas();
    init();
    initCmpAnim();
    initPremium();
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

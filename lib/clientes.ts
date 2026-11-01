// Clientes de Nevux: cada uno con su interruptor, su forma de cobro, sus dominios y su configuración.
// La línea que pega cada tienda (https://nevux.ar/c/<id>.js) se arma con estos datos en app/c/[archivo]/route.ts.

export type Cobro =
  | { tipo: "manual" }
  | {
      tipo: "mercadopago";
      // ID de la suscripción en Mercado Pago (preferido) o email con el que se suscribió
      suscripcion?: string;
      email?: string;
      // ID del plan de Mercado Pago (preapproval_plan_id): sirve cuando el cliente todavía no se suscribió y no sabemos su email.
      // Toma la suscripción más reciente de ese plan, así que solo vale mientras el plan tenga un único cliente.
      planMp?: string;
      // Días de tolerancia después del vencimiento antes de apagar la tienda
      gracia?: number;
    };

export type Cliente = {
  nombre: string;
  activo: boolean;
  cobro: Cobro;
  dominios: string[];
  // Plan de suscripción (lib/planes.ts). Sin plan = básico
  plan?: "basico" | "premium";
  config: Record<string, unknown>;
};

export const CLIENTES: Record<string, Cliente> = {
  "hogar-digital": {
    nombre: "Hogar Digital (Marcelo)",
    // Interruptor manual: false = apagada siempre, aunque esté al día con el pago
    activo: false, // Apagada el 01/11 hasta que pague el Premium el 10/11 (Marcelo cobra ese día). Al pagar: activo: true y cobro automático con su email.
    // Cobro: 'manual' = solo cuenta el interruptor. 'mercadopago' = se prende y apaga sola según su suscripción
    // (para pasarlo a automático: { tipo: 'mercadopago', email: 'mail-con-el-que-pagó@...', gracia: 3 }). No usar planMp: lo usa Valmont.
    cobro: { tipo: 'manual' },
    // Dominios donde puede funcionar esta línea (sin www)
    dominios: ['hogardigital.com.ar'],
    // Plan Premium tal cual Destino (01/11/2026, pedido de Rodrigo), en azul. Ver docs/hogar-digital-premium.md y docs/referencias/destino.md.
    // Solo datos reales: comunidad con cuadros de sus Reels, números verificables (desde los 80, garantía, cuotas, envíos al país).
    // Sin reseñas ni locales hasta que Marcelo los pase. Si da el ok, se apaga (activo: false) hasta que pague el 10/11.
    plan: 'premium',
    config: {
      "color": "#3498db",
      "marca": {
        "oscuro": "#0b0f17"
      },
      "anuncios": [
        "🚚 Envíos a todo el país",
        "🛡️ 30 días de garantía",
        "💬 Atención personalizada por WhatsApp"
      ],
      "mediosDePago": [
        "Visa",
        "Mastercard",
        "Débito",
        "Mercado Pago"
      ],
      "estiloFicha": "destino",
      "envio": {
        "corte": 18,
        "dias": [
          1,
          2,
          3,
          4,
          5
        ],
        "min": 5,
        "max": 6,
        "zona": ""
      },
      "envioGratisDesde": 0,
      "whatsapp": "5493489520436",
      "evento": {
        "nombre": "La Semana Cyber",
        "desde": "2026-11-02T00:00:00-03:00",
        "hasta": "2026-11-04T23:59:59-03:00",
        "anticipo": 3,
        "barraAntes": "⚡ Se viene la Semana Cyber · Lunes 2 al miércoles 4 de noviembre",
        "barra": "🔥 Semana Cyber en Hogar Digital · Hasta el miércoles 4 de noviembre",
        "cinta": [
          "Semana Cyber",
          "Del 2 al 4 de noviembre",
          "Hasta 12 cuotas"
        ]
      },
      "tarjetas": {
        "quedan": 5,
        "estilo": "destacado"
      },
      "ocultar": [
        "[data-store=\"home-products-featured\"]",
        "[data-store=\"home-banner-news\"]",
        "[data-store=\"home-product-main\"]",
        "[data-store=\"home-banner-categories\"]",
        "[data-store=\"home-products-sale\"]",
        "[data-store=\"home-banner-promotional\"]",
        "[data-store=\"home-products-new\"]",
        "[data-store=\"banner-services\"]"
      ],
      "ventas": {
        "estilo": "destino",
        "marca": "Hogar Digital"
      },
      "carrito": true,
      "home": {
        "destino": {
          "acento": "#3498db",
          "cinta": [
            "Envíos a *todo el país*",
            "*30 días* de garantía",
            "Atención por *WhatsApp*",
            "Devolución *gratis* por falla"
          ],
          "portada": {
            "fotos": [
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/aa21b036-c4fc-4cef-ba61-c371cc90d542-0530aaf0-4cc2707e7abbf2c1f317934564759826-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/0ac01ee3-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-12b78b996cf5c82b0417934072828698-1024-1024.webp",
              "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056700-b80630798d70727f1917901024718719-1024-1024.webp"
            ],
            "etiqueta": "Hogar Digital · Desde los años 80",
            "titulo": "Lo que tu casa necesita.",
            "texto": "Humidificadores, audio, smartwatches y más.",
            "boton": "Ver productos",
            "url": "/productos/",
            "boton2": "Humidificadores",
            "url2": "/humidificadores-19h94/",
            "productosUrl": "/humidificadores-19h94/"
          },
          "beneficios": [
            {
              "icono": "envio",
              "titulo": "Envíos a todo el país",
              "texto": "Llega en 5 a 6 días hábiles"
            },
            {
              "icono": "garantia",
              "titulo": "30 días de garantía",
              "texto": "Por falla, daño o error"
            },
            {
              "icono": "chat",
              "titulo": "Atención por WhatsApp",
              "texto": "Te ayudamos a elegir"
            },
            {
              "icono": "cambios",
              "titulo": "Devolución gratis",
              "texto": "Si hay una falla"
            }
          ],
          "tira": {
            "items": [
              {
                "nombre": "Humidificadores",
                "url": "/humidificadores-19h94/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp"
              },
              {
                "nombre": "Audio",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000064948-1b2cdbc0b81707d0f817924511811491-1024-1024.webp"
              },
              {
                "nombre": "Auriculares",
                "url": "/audio-auriculares/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056695-5a06631053060d23e217901024050439-1024-1024.webp"
              },
              {
                "nombre": "Smartwatches",
                "url": "/smartwatches-1jb09/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056623-7322be0751a7f8955e17901015253577-1024-1024.webp"
              },
              {
                "nombre": "Fitness",
                "url": "/fitness-y-bienestar-1v0hm/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000059933-1564b3879882d329b217909447522683-1024-1024.webp"
              },
              {
                "nombre": "Relax",
                "url": "/humidificadores-19h94/",
                "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/0ac01ee3-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-12b78b996cf5c82b0417934072828698-1024-1024.webp"
              }
            ]
          },
          "destacados": [
            {
              "etiqueta": "Para tu casa",
              "titulo": "Destacados",
              "url": "/humidificadores-19h94/",
              "cantidad": 4
            },
            {
              "etiqueta": "Sonido",
              "titulo": "Audio y *auriculares*",
              "url": "/audio-auriculares/",
              "carrusel": true,
              "cantidad": 6
            },
            {
              "etiqueta": "Esto es para vos",
              "titulo": "Más para *tu casa*",
              "url": "/productos/",
              "carrusel": true,
              "cantidad": 8
            }
          ],
          "faqTitulo": "Antes de comprar",
          "faq": [
            {
              "p": "¿Cuánto tarda en llegar?",
              "r": "Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país."
            },
            {
              "p": "¿Tiene garantía?",
              "r": "Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis."
            },
            {
              "p": "¿Puedo devolverlo si me arrepiento?",
              "r": "Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original."
            },
            {
              "p": "¿Cómo puedo pagar?",
              "r": "Con tarjeta de crédito o débito y con Mercado Pago."
            }
          ],
          "banner": {
            "etiqueta": "[ Hogar Digital ]",
            "titulo": "Tu rincón relax.",
            "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056700-b80630798d70727f1917901024718719-1024-1024.webp",
            "boton": "Ver humidificadores",
            "url": "/humidificadores-19h94/"
          },
          "comunidad": {
            "etiqueta": "Comunidad",
            "cuenta": "@hogardigitaltiendaonline",
            "url": "https://instagram.com/hogardigitaltiendaonline",
            "fotos": [
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/parlante-rgb.jpg",
                "url": "/productos/parlante-rgb-tipo-air-z6-unifox-50foy/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-smartwatch.jpg",
                "url": "/smartwatches-1jb09/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/aro-de-luz.jpg",
                "url": "/productos/tripode-2-1m-con-aro-de-luz-rgb-de-10/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/empaquetando.jpg"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-accesorios.jpg",
                "url": "/tecnologia-y-accesorios-k82dt/"
              },
              {
                "foto": "https://nevux.ar/clientes/hogar-digital/comunidad/marcelo-parlantes.jpg",
                "url": "/audio-auriculares/"
              }
            ]
          },
          "locales": {
            "etiqueta": "Hogar Digital / Campana",
            "titulo": "¿Querés *conocer el local*?",
            "texto": "Vení a ver los productos en persona y te asesoramos. También te atendemos por WhatsApp.",
            "items": [
              {
                "zona": "Campana · Buenos Aires",
                "nombre": "Hogar Digital",
                "direccion": "Belgrano 276, Campana (2804), Buenos Aires",
                "horario": "Lunes a sábado de 8 a 21 h"
              }
            ]
          },
          "numeros": {
            "titulo": "Hogar Digital *en números*",
            "items": [
              {
                "valor": 35,
                "prefijo": "+",
                "texto": "Años de trayectoria"
              },
              {
                "valor": 300,
                "prefijo": "+",
                "texto": "Ventas en 2026"
              },
              {
                "valor": 800,
                "prefijo": "+",
                "texto": "Calificaciones en Mercado Libre"
              },
              {
                "valor": 1,
                "texto": "Local en Campana"
              }
            ]
          }
        },
        "rotador": {
          "etiqueta": "Encontrá lo tuyo",
          "items": [
            {
              "nombre": "Humidificadores",
              "url": "/humidificadores-19h94/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/aa21b036-c4fc-4cef-ba61-c371cc90d542-0530aaf0-4cc2707e7abbf2c1f317934564759826-1024-1024.webp"
            },
            {
              "nombre": "Audio",
              "url": "/audio-auriculares/",
              "video": "https://nevux.ar/clientes/hogar-digital/parlante-rgb.mp4",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056644-af25d4fda55df67c7817901018261560-1024-1024.webp"
            },
            {
              "nombre": "Smartwatches",
              "url": "/smartwatches-1jb09/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056623-7322be0751a7f8955e17901015253577-1024-1024.webp"
            },
            {
              "nombre": "Fitness",
              "url": "/fitness-y-bienestar-1v0hm/",
              "foto": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000059933-1564b3879882d329b217909447522683-1024-1024.webp",
              "foto2": "https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056639-27c93a9b66ee9dee8c17901017599283-1024-1024.webp"
            }
          ]
        }
      },
      "premium": {
        "tema": "destino"
      },
      "cabecera": {
        "logo": "https://nevux.ar/clientes/hogar-digital/logo-negro.png",
        "logoClaro": "https://nevux.ar/clientes/hogar-digital/logo-blanco.png",
        "nombre": "Hogar Digital"
      },
      "fichaDestino": {
        "sello": "Hogar Digital · *30 días* de garantía",
        "confianza": [
          {
            "icono": "cambios",
            "titulo": "Cambios y devoluciones",
            "texto": "10 días para arrepentirte"
          },
          {
            "icono": "chat",
            "titulo": "Atención personalizada",
            "texto": "Te respondemos por WhatsApp"
          },
          {
            "icono": "garantia",
            "titulo": "30 días de garantía",
            "texto": "Por falla, daño o error"
          }
        ],
        "faq": [
          {
            "p": "¿Cuánto tarda en llegar?",
            "r": "Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país."
          },
          {
            "p": "¿Cuánto cuesta el envío?",
            "r": "Depende de tu código postal: lo calculás en el carrito antes de pagar. Muchos productos tienen envío gratis."
          },
          {
            "p": "¿Tiene garantía?",
            "r": "Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis y nos encargamos de todo."
          },
          {
            "p": "¿Puedo devolverlo si me arrepiento?",
            "r": "Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original."
          },
          {
            "p": "¿Cómo puedo pagar?",
            "r": "Con tarjeta de crédito o débito y con Mercado Pago, en hasta 12 cuotas."
          },
          {
            "p": "¿Tengo una duda, a quién le escribo?",
            "r": "Escribinos por WhatsApp y te atendemos personalmente."
          }
        ]
      },
      "packs": []
    }
  },
  valmont: {
    nombre: "Valmont & Co. (cliente de relojes)",
    activo: true,
    // Miguel dio el ok el 31/10: queda apagada hasta que se suscriba al plan Premium y se prende sola cuando cobra.
    // Cuando pague, cambiar planMp por su email (o el ID de la suscripción), sobre todo si otro cliente se suma al Premium.
    cobro: { tipo: 'mercadopago', planMp: '86ce0bba2cc849f3b04e9208748581af', gracia: 3 },
    dominios: ['valmontrelojes.mitiendanube.com'],
    plan: 'premium',
    // Relojería premium multimarca con estilo Wess en negro y dorado. Rodrigo pidió no usar la palabra "original": va "premium".
    // Garantía, envíos y medios de pago: textos genéricos hasta confirmar los datos reales con el cliente.
    config: {
      color: '#c9a961',
      marca: { oscuro: '#0c0b0a' },
      premium: { titulos: 'Oswald', texto: 'Inter', animar: true, tema: 'wess' },
      // Ficha estilo Wess pasada a relojes (ver docs/valmont.md). Envíos: valores provisorios hasta confirmar con el cliente.
      // WhatsApp del cliente (+54 2954 688637), con el 9 que pide WhatsApp para celulares de Argentina
      whatsapp: '5492954688637',
      // Secciones de Morelia que no van (el newsletter gris de la home; el del pie queda como franja dorada)
      ocultar: ['[data-store="home-newsletter"]'],
      // Cabecera negra con la V en 3D girando (como el logo animado de Wess) en lugar del nombre de texto
      cabecera: { inicial: 'V', nombre: 'VALMONT' },
      pie: { logo: 'https://nevux.ar/clientes/valmont/logo-dorado.png', titulo: 'Valmont & Co.', texto: 'Relojería premium', instagram: 'https://www.instagram.com/valmont.relojes/', newsletter: 'Registrate y recibí nuestras novedades.' },
      // Videos por producto (en "Miralo de cerca" de la ficha). La clave es la dirección del producto.
      porProducto: {
        '/productos/valmontco-com/': {
          fichaVideos: [{ mp4: 'https://nevux.ar/clientes/valmont/video-gshock-gst-b400.mp4', poster: 'https://nevux.ar/clientes/valmont/video-gshock-gst-b400.jpg' }]
        },
        '/productos/rolex-submariner-date-acero-inoxidable-1roj1/': {
          fichaVideos: [{ mp4: 'https://nevux.ar/clientes/valmont/video-rolex-submariner.mp4', poster: 'https://nevux.ar/clientes/valmont/video-rolex-submariner.jpg' }]
        },
        '/productos/omega-speedmaster-professional-anniversary-series-silver-snoopy-award-1qvrw/': {
          fichaVideos: [{ mp4: 'https://nevux.ar/clientes/valmont/video-omega-speedmaster.mp4', poster: 'https://nevux.ar/clientes/valmont/video-omega-speedmaster.jpg' }]
        },
        '/productos/valmontco-m/': {
          fichaVideos: [{ mp4: 'https://nevux.ar/clientes/valmont/video-complications-gold.mp4', poster: 'https://nevux.ar/clientes/valmont/video-complications-gold.jpg' }]
        },
        '/productos/valmont-co/': {
          fichaVideos: [{ mp4: 'https://nevux.ar/clientes/valmont/video-rolex-daytona.mp4', poster: 'https://nevux.ar/clientes/valmont/video-rolex-daytona.jpg' }]
        }
      },
      estiloFicha: 'wess',
      envio: { corte: 14, dias: [1, 2, 3, 4, 5], min: 3, max: 6, zona: 'a todo el país' },
      ficha: {
        pill: 'Premium',
        regaloLinea: 'Llega en su caja, con papeles y accesorios. Listo para regalar.',
        calidad: 'Calidad Valmont',
        whatsappTexto: '¿Dudas con el tamaño?',
        confianza: [
          { icono: 'envio', titulo: 'Envío a todo el país', texto: 'Con seguimiento desde que sale' },
          { icono: 'caja', titulo: 'Caja, papeles y accesorios', texto: 'Cada reloj llega completo' },
          { icono: 'garantia', titulo: 'Compra protegida', texto: 'Te acompañamos antes y después de comprar' }
        ],
        detallesEtiqueta: 'Valmont & Co.',
        detallesTitulo: 'Miralo de cerca',
        detalles: [
          { etiqueta: 'Detalle', titulo: 'Tal cual llega', texto: 'Fotos reales del reloj' },
          { etiqueta: 'Terminación', titulo: 'Cada detalle', texto: 'Caja, esfera y malla' },
          { etiqueta: 'Presencia', titulo: 'Se nota', texto: 'De día y de noche' },
          { etiqueta: 'Presentación', titulo: 'Completo', texto: 'Con su caja y sus papeles' }
        ],
        historia: {
          etiqueta: 'Valmont & Co. · Relojería',
          titulo: 'El reloj que',
          destacado: 'va con todo',
          texto: 'Una pieza para usar todos los días y que se note en cada detalle. Te la mandamos lista para estrenar.',
          puntos: ['Llega con su caja, papeles y accesorios', 'Te ayudamos a elegir el tamaño ideal', 'Envío con seguimiento a todo el país', 'Listo para regalar, sin envolver nada'],
          boton: 'Lo quiero'
        },
        cerca: {
          etiqueta: 'De cerca',
          titulo: 'Hecho para usarlo todos los días',
          items: [
            { titulo: 'Esfera', texto: 'Índices y agujas nítidos.' },
            { titulo: 'Caja', texto: 'Terminación pareja en cada borde.' },
            { titulo: 'Malla', texto: 'Ajuste firme y cómodo.' },
            { titulo: 'Presentación', texto: 'Con su caja y sus papeles.' }
          ]
        },
        regalo: { etiqueta: 'Para regalar', titulo: 'Viene listo para regalar', card: 'Caja y papeles', texto: 'Llega en su caja con papeles y accesorios. Si es para vos, lo estrenás; si es para alguien más, no tenés que envolver nada.' },
        calce: { etiqueta: 'Calce', titulo: 'Elegí tu tamaño sin dudar', url: '/#medidor', boton: 'Medí tu muñeca' },
        tranquilo: {
          etiqueta: 'Comprá tranquilo',
          titulo: 'Valmont & Co.',
          items: [
            { titulo: 'Caja y papeles', texto: 'Cada reloj llega completo.' },
            { titulo: 'Envío protegido', texto: 'Con seguimiento a todo el país.' },
            { titulo: 'Atención personal', texto: 'Te asesoramos por WhatsApp.' },
            { titulo: 'Listo para regalar', texto: 'No tenés que envolver nada.' },
            { titulo: 'Te ayudamos a elegir', texto: 'Tamaño, estilo y uso.' },
            { titulo: 'Pago seguro', texto: 'Con los medios de pago de la tienda.' }
          ]
        },
        faqTitulo: 'Lo que nos preguntan',
        cta: { etiqueta: 'Valmont & Co.', titulo: 'Elegí el tuyo', boton: 'Comprar ahora' },
        similaresTitulo: 'Productos similares',
        similaresPill: 'Premium'
      },
      precios: true,
      tarjetas: { estilo: 'wess' },
      packs: [],
      ventas: false,
      anuncios: ['⌚ Relojería premium · Caja y papeles', '🚚 Envíos a todo el país', '🎁 Listos para regalar'],
      cinta: ['Premium', 'Caja y papeles', 'Envíos a todo el país', 'Listos para regalar'],
      incluye: {
        titulo: 'Qué incluye tu reloj',
        items: [
          { icono: '⌚', titulo: 'Reloj premium', texto: 'Nuevo, en su caja.' },
          { icono: '📜', titulo: 'Garantía oficial', texto: 'De la marca.' },
          { icono: '🧾', titulo: 'Factura', texto: 'A tu nombre.' },
          { icono: '🚚', titulo: 'Envío protegido', texto: 'Con seguimiento.' }
        ]
      },
      regalo: { titulo: '¿Es para regalar?', texto: 'Avisanos por WhatsApp y lo preparamos para regalo.' },
      problemaSolucion: {
        etiqueta: 'El problema que todos conocen',
        titulo: 'Antes vs. con Valmont',
        antesTitulo: 'Comprando en cualquier lado',
        antes: ['No sabés qué te llega', 'Sin factura ni garantía', 'Si falla, nadie responde', 'Te llega sin caja ni papeles'],
        despuesTitulo: 'Con Valmont',
        despues: ['Relojes premium seleccionados', 'Factura y garantía oficial', 'Atención personalizada', 'Llega en su caja con papeles']
      },
      comparativa: {
        titulo: 'Valmont vs. comprar en cualquier lado',
        marca: 'Valmont',
        otro: 'Otros',
        filas: ['Relojes premium seleccionados', 'Garantía oficial de la marca', 'Factura a tu nombre', 'Caja y papeles', 'Atención personalizada']
      },
      faq: [
        { p: '¿Cómo llega el reloj?', r: 'En su caja, con papeles y accesorios. Listo para usar o para regalar.' },
        { p: '¿Tienen garantía?', r: 'Sí, la garantía oficial de cada marca. Te ayudamos con cualquier gestión.' },
        { p: '¿Cuánto tarda el envío?', r: 'Enviamos a todo el país. Te pasamos el seguimiento apenas sale.' },
        { p: '¿Viene en su caja?', r: 'Sí, cada reloj llega en su caja con sus papeles.' },
        { p: '¿Cómo elijo el tamaño?', r: 'En cada reloj te dejamos el diámetro de la caja y un medidor para ver cómo te queda en la muñeca.' }
      ],
      home: {
        portada: {
          marca: 'Valmont & Co.',
          franja: 'Hora oficial',
          logo: 'https://nevux.ar/clientes/valmont/logo-dorado.png',
          etiqueta: 'Relojería premium',
          titulo: 'Valmont',
          titulo2: 'Relojería',
          texto: 'Las marcas que conocés, con factura y garantía oficial. Envíos a todo el país.',
          boton: 'Tocá acá y mirá los relojes',
          url: '/productos/',
          reemplazarBanner: true
        },
        beneficios: [
          { icono: 'original', titulo: 'Relojes premium', texto: 'Piezas seleccionadas, con caja y papeles.' },
          { icono: 'garantia', titulo: 'Garantía oficial', texto: 'La garantía de la marca, y te ayudamos con cualquier gestión.' },
          { icono: 'envio', titulo: 'Envío a todo el país', texto: 'Con seguimiento desde que sale hasta tu casa.' }
        ],
        vitrinas: [
          { estilo: 'wess', logo: 'https://nevux.ar/clientes/valmont/logo-dorado.png', etiqueta: 'Selección Valmont', titulo: 'Más vendidos', pill: 'Premium', url: '/productos/', boton: 'Ver todos los relojes' }
        ],
        // Parte 3: grilla de productos ("Promociones limitadas" en Wess) y categorías con relojes que giran.
        // Categorías por marca: buscan en la tienda hasta que haya categorías propias. Los dibujos son relojes genéricos, sin logos.
        grilla: {
          titulo: 'Relojes destacados',
          url: '/productos/',
          cantidad: 6,
          pill: 'Premium',
          quedan: 3,
          boton: 'Ver todos los relojes',
          categorias: [
            { nombre: 'Casio', url: '/search/?q=casio', foto: 'https://nevux.ar/clientes/valmont/cat-digitales.svg' },
            { nombre: 'G-Shock', url: '/search/?q=g-shock', foto: 'https://nevux.ar/clientes/valmont/cat-deportivos.svg' },
            { nombre: 'Mistral', url: '/search/?q=mistral', foto: 'https://nevux.ar/clientes/valmont/cat-analogicos.svg' },
            { nombre: 'Tressa', url: '/search/?q=tressa', foto: 'https://nevux.ar/clientes/valmont/cat-smartwatches.svg' }
          ]
        },
        // Parte 4: foto con puntos estilo Wess ("Buscá el jean que no pase desapercibido"), con el Speedmaster recortado de la foto que pasó Rodrigo.
        puntos: {
          estilo: 'wess',
          titulo: 'Buscá el reloj que no pase desapercibido.',
          url: '/productos/omega-speedmaster-professional-anniversary-series-silver-snoopy-award-1qvrw/',
          boton: 'Ver el Speedmaster',
          foto: 'https://nevux.ar/clientes/valmont/detalle-reloj.webp',
          items: [
            { titulo: 'Esfera con detalle', texto: 'Subesferas y agujas bien terminadas.', x: 60.9, y: 51.6 },
            { titulo: 'Corona y pulsadores', texto: 'Firmes, con giro y clic precisos.', x: 68, y: 19.5 },
            { titulo: 'Bisel taquimétrico', texto: 'Escala grabada, nítida y pareja.', x: 39, y: 68.4 },
            { titulo: 'Malla de acero', texto: 'Eslabones macizos y cierre firme.', x: 80.6, y: 72.1 }
          ]
        },
        // Parte 5: medidor de reloj en pasos ("Tu talle en 20 segundos" de Wess) y "Colgado por poco tiempo"
        medidor: {
          etiqueta: 'Tu reloj en 20 segundos',
          titulo: 'Probate el reloj',
          destacado: 'sin salir de casa',
          foto: 'https://nevux.ar/clientes/valmont/detalle-reloj.webp',
          url: '/productos/',
          boton: 'Ver relojes'
        },
        colgado: { etiqueta: 'Valmont · Selección', titulo: 'Colgado por', titulo2: 'poco tiempo.', url: '/productos/', boton: 'Ver relojes' },
        porQue: {
          etiqueta: 'Valmont & Co.',
          titulo: 'Por qué Valmont',
          items: [
            { destacado: 'Premium', titulo: 'Selección cuidada', texto: 'Cada reloj está elegido pieza por pieza.', pie: 'Selección Valmont' },
            { destacado: 'Factura', titulo: 'A tu nombre', texto: 'Con la garantía oficial de la marca.', pie: 'Compra segura' },
            { destacado: 'Atención', titulo: 'Personalizada', texto: 'Te ayudamos a elegir el reloj y el tamaño.', pie: 'Relojería' },
            { destacado: 'Envío', titulo: 'A todo el país', texto: 'Con seguimiento desde que sale hasta tu casa.', pie: 'Envío protegido' }
          ]
        },
        faqTitulo: 'Lo que siempre nos preguntan',
        faqLink: { texto: 'Medí tu muñeca en 20 segundos', url: '#medidor' },
        faq: [
          { p: '¿Cómo llega el reloj?', r: 'En su caja, con papeles y accesorios.' },
          { p: '¿Tienen garantía?', r: 'Sí, la garantía oficial de cada marca.' },
          { p: '¿Hacen envíos?', r: 'Sí, a todo el país, con seguimiento.' }
        ],
        cierre: { etiqueta: 'Valmont & Co.', titulo: 'Esto fue una selección', texto: 'Todos los relojes, con factura y garantía oficial.', boton: 'Ver el catálogo completo', url: '/productos/' }
      }
    }
  },
};

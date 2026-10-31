// Clientes de Nevux: cada uno con su interruptor, su forma de cobro, sus dominios y su configuración.
// La línea que pega cada tienda (https://nevux.ar/c/<id>.js) se arma con estos datos en app/c/[archivo]/route.ts.

export type Cobro =
  | { tipo: "manual" }
  | {
      tipo: "mercadopago";
      // ID de la suscripción en Mercado Pago (preferido) o email con el que se suscribió
      suscripcion?: string;
      email?: string;
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
    activo: true,
    // Cobro: 'manual' = solo cuenta el interruptor. 'mercadopago' = se prende y apaga sola según su suscripción
    // (para pasarlo a automático: { tipo: 'mercadopago', email: 'mail-con-el-que-pagó@...', gracia: 5 })
    cobro: { tipo: 'manual' },
    // Dominios donde puede funcionar esta línea (sin www)
    dominios: ['hogardigital.com.ar'],
    // Configuración de la tienda: cualquier opción del motor (public/nevux.js)
    config: {
      // Colores de la marca: blanco, negro y azul (el azul del buscador y el pie de su tienda)
      color: '#3498db',
      marca: { oscuro: '#0b0f17' },
      anuncios: ['🚚 Envíos a todo el país', '🛡️ 30 días de garantía', '💬 Atención personalizada por WhatsApp'],
      mediosDePago: ['Visa', 'Mastercard', 'Débito', 'Mercado Pago'],
      estiloFicha: 'oscuro',
      packs: [
        { cantidad: 1, titulo: 'Llevá 1', descuento: 0 },
        { cantidad: 2, titulo: 'Llevá 2', descuento: 15, etiqueta: 'MÁS ELEGIDO' },
        { cantidad: 3, titulo: 'Llevá 3', descuento: 25 }
      ],
      // Datos de Marcelo: despacha lunes a viernes hasta las 18 h, el envío tarda 5 a 6 días hábiles
      envio: { corte: 18, dias: [1, 2, 3, 4, 5], min: 5, max: 6, zona: '' },
      envioGratisDesde: 0, // no tiene monto mínimo
      cuentaRegresiva: true, // cuenta regresiva grande en la ficha, hasta las 18 h
      precios: true, // bloque de precios en tarjetas (transferencia y cuotas sin interés reales de la tienda)
      whatsapp: '5493489520436',

      // Contenido de la ficha (sacado de las políticas y textos de la tienda)
      cinta: ['Envíos a todo el país', 'Garantía de 30 días', 'Compra segura', 'Atención por WhatsApp', 'Desde los años 80'],
      pasos: {
        titulo: 'Comprá en 3 pasos',
        items: [
          { titulo: 'Elegí tu pack', texto: 'Llevando 2 ahorrás 15% y llevando 3, 25%.' },
          { titulo: 'Pagá seguro', texto: 'Con tarjeta o Mercado Pago, en hasta 12 cuotas.' },
          { titulo: 'Recibilo en tu casa', texto: 'Despachamos de lunes a viernes y llega en 5 a 6 días hábiles.' }
        ]
      },
      // Antes / después en lista: todo sale de las políticas reales de la tienda
      problemaSolucion: {
        etiqueta: 'Comprar online',
        titulo: 'Antes vs. con Hogar Digital',
        antesTitulo: 'Comprando en cualquier lado',
        antes: ['No sabés cuándo te lo despachan', 'Si llega fallado, nadie se hace cargo', 'Escribís y nadie te responde', 'La devolución la pagás vos'],
        despuesTitulo: 'Con Hogar Digital',
        despues: ['Despachamos de lunes a viernes: antes de las 18 h sale en el día', '30 días de garantía por falla, daño o error en el envío', 'Atención personalizada por WhatsApp', 'Si hay una falla, la devolución corre por nuestra cuenta']
      },
      comparativa: {
        titulo: '¿Por qué comprar en Hogar Digital?',
        marca: 'Hogar Digital',
        otro: 'Otras tiendas',
        filas: ['Garantía de 30 días', 'Devolución gratis por falla', 'Atención personalizada por WhatsApp', 'Compra segura', 'Envíos a todo el país']
      },
      faq: [
        { p: '¿Cuánto tarda en llegar?', r: 'Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país.' },
        { p: '¿Cuánto cuesta el envío?', r: 'Depende de tu código postal: lo calculás en el carrito antes de pagar. Muchos productos tienen envío gratis.' },
        { p: '¿Tiene garantía?', r: 'Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis y nos encargamos de todo.' },
        { p: '¿Puedo devolverlo si me arrepiento?', r: 'Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original.' },
        { p: '¿Cómo puedo pagar?', r: 'Con tarjeta de crédito o débito y con Mercado Pago, en hasta 12 cuotas.' },
        { p: '¿Tengo una duda, a quién le escribo?', r: 'Escribinos por WhatsApp y te atendemos personalmente.' }
      ],
      combina: 'auto',

      // Semana Cyber (Cyber Monday 2026, sin el logo oficial: no está inscripto en la CACE).
      // Se prende sola 3 días antes y se apaga sola el 4/11 a las 23:59. Descuentos: cuando Marcelo los confirme.
      evento: {
        nombre: 'La Semana Cyber',
        desde: '2026-11-02T00:00:00-03:00',
        hasta: '2026-11-04T23:59:59-03:00',
        anticipo: 3,
        barraAntes: '⚡ Se viene la Semana Cyber · Lunes 2 al miércoles 4 de noviembre',
        barra: '🔥 Semana Cyber en Hogar Digital · Hasta el miércoles 4 de noviembre',
        cinta: ['Semana Cyber', 'Del 2 al 4 de noviembre', 'Hasta 12 cuotas']
      },

      // Tarjetas de producto: "QUEDAN N" cuando quedan 5 o menos (stock real de la tienda)
      // estilo 'destacado': caja con el precio (y el ahorro real sobre el tachado) y caja con las cuotas, como Wess
      tarjetas: { quedan: 5, estilo: 'destacado' },

      // Home
      home: {
        // Cuenta regresiva real hasta las 18 h (hora de corte del despacho)
        cuentaRegresiva: true,
        beneficios: [
          { icono: '🚚', titulo: 'Envíos a todo el país', texto: 'Llega en 5 a 6 días hábiles.' },
          { icono: '🛡️', titulo: '30 días de garantía', texto: 'Por falla, daño o error en el envío.' },
          { icono: '💬', titulo: 'Atención por WhatsApp', texto: 'Te ayudamos a elegir.' }
        ],
        // Foto con puntos: características reales sacadas de la descripción del producto
        puntos: {
          etiqueta: 'De cerca',
          titulo: 'Conocé el Humidificador OVNI',
          texto: 'Tocá cada punto para ver el detalle.',
          foto: 'https://dcdn-us.mitiendanube.com/stores/007/275/409/products/1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp',
          url: '/productos/humidificador-ovni-267/',
          boton: 'Ver el humidificador',
          items: [
            { x: 50, y: 30, titulo: 'Efecto niebla', texto: 'Un detalle llamativo que cambia el ambiente.' },
            { x: 31, y: 44, titulo: 'Aporta humedad', texto: 'Ideal si sentís el ambiente seco.' },
            { x: 66, y: 58, titulo: 'Iluminación LED', texto: 'Luz cálida que acompaña la niebla.' },
            { x: 45, y: 75, titulo: 'Diseño compacto', texto: 'Para dormitorio, escritorio, living u oficina.' }
          ]
        },
        // Vitrinas: productos reales de cada categoría en carrusel
        vitrinas: [
          { etiqueta: 'Para tu casa', titulo: 'Humidificadores', url: '/humidificadores-19h94/', oscuro: true, boton: 'Ver todos los humidificadores' },
          { etiqueta: 'Sonido', titulo: 'Audio y auriculares', url: '/audio-auriculares/', boton: 'Ver todo audio' }
        ],
        porQue: {
          etiqueta: 'Desde los años 80',
          titulo: 'Por qué comprar en Hogar Digital',
          items: [
            { destacado: '30 días', titulo: 'De garantía', texto: 'Por falla de fabricación, producto dañado o error en el envío. La devolución corre por nuestra cuenta.', pie: 'Garantía Hogar Digital' },
            { destacado: '5 a 6 días', titulo: 'Llega a tu casa', texto: 'Despachamos de lunes a viernes a todo el país.', pie: 'Envío nacional' },
            { destacado: 'Años 80', titulo: 'Trayectoria', texto: 'Una empresa que empezó en los 80 y se fue adaptando a lo que necesitan sus clientes.', pie: 'Experiencia' },
            { destacado: 'WhatsApp', titulo: 'Atención personalizada', texto: 'Te ayudamos a elegir y resolvemos tus dudas.', pie: 'Equipo propio' }
          ]
        },
        faqTitulo: 'Lo que siempre nos preguntan',
        faq: [
          { p: '¿Cuánto tarda en llegar?', r: 'Despachamos de lunes a viernes: si comprás antes de las 18 h, sale ese mismo día. Llega en 5 a 6 días hábiles a todo el país.' },
          { p: '¿Tiene garantía?', r: 'Sí, 30 días desde que lo recibís por falla de fabricación, producto dañado o error en el envío. En esos casos la devolución es gratis.' },
          { p: '¿Puedo devolverlo si me arrepiento?', r: 'Sí, dentro de los 10 días corridos desde que lo recibís, sin uso y con su embalaje original.' },
          { p: '¿Cómo puedo pagar?', r: 'Con tarjeta de crédito o débito y con Mercado Pago, en hasta 12 cuotas.' }
        ],
        cierre: { etiqueta: 'Tecnología y hogar', titulo: 'Encontrá lo que buscás', texto: 'Todo nuestro catálogo con envío a todo el país.', boton: 'Ver todos los productos', url: '/productos/' }
      }
    }
  },
  valmont: {
    nombre: "Valmont & Co. (cliente de relojes)",
    activo: true,
    cobro: { tipo: 'manual' },
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

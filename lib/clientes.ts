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
    // Plan Premium con estilo Wess (negro y dorado). Contenido real a medida que lleguen fotos, precios y datos.
    config: {
      color: '#c9a961',
      marca: { oscuro: '#0c0b0a' },
      premium: { titulos: 'Cinzel', texto: 'Cormorant Garamond', animar: true },
      estiloFicha: 'oscuro',
      precios: true,
      tarjetas: { estilo: 'destacado' },
      packs: [],
      ventas: false
    }
  },
};

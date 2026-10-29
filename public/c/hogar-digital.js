/* Nevux · Hogar Digital (hogardigital.com.ar)
   Línea que pega el cliente en Tiendanube > Editar diseño > Pie de página > Sellos personalizados > "Código Javascript o HTML del sello":
   <script src="https://nevux.ar/c/hogar-digital.js" async></script> */
(function () {
  var cliente = {
    // Interruptor: true = Nevux funcionando en la tienda · false = apagado (por ejemplo, si deja de pagar)
    activo: true,
    // Dominios donde puede funcionar esta línea (sin www)
    dominios: ['hogardigital.com.ar'],
    // Configuración de la tienda: cualquier opción del motor (public/nevux.js)
    config: {
      packs: [
        { cantidad: 1, titulo: 'Llevá 1', descuento: 0 },
        { cantidad: 2, titulo: 'Llevá 2', descuento: 15, etiqueta: 'MÁS ELEGIDO' },
        { cantidad: 3, titulo: 'Llevá 3', descuento: 25 }
      ],
      // Datos de Marcelo: despacha lunes a viernes hasta las 18 h, el envío tarda 5 a 6 días hábiles
      envio: { corte: 18, dias: [1, 2, 3, 4, 5], min: 5, max: 6, zona: '' },
      envioGratisDesde: 0, // no tiene monto mínimo
      cuentaRegresiva: true, // cuenta regresiva grande en la ficha, hasta las 18 h
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

      // Tarjetas de producto: "QUEDAN N" cuando quedan 5 o menos (stock real de la tienda)
      tarjetas: { quedan: 5 },

      // Home
      home: {
        // Cuenta regresiva real hasta las 18 h (hora de corte del despacho)
        cuentaRegresiva: true,
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
  };

  if (!cliente.activo) return;
  var host = location.hostname.replace(/^www\./, '');
  var permitido = cliente.dominios.some(function (d) {
    return host === d || host.slice(-(d.length + 1)) === '.' + d;
  });
  if (!permitido) return;
  window.NEVUX_CFG = cliente.config;
  var s = document.createElement('script');
  s.src = 'https://nevux.ar/nevux.js';
  s.async = true;
  document.head.appendChild(s);
})();

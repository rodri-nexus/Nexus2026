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
      whatsapp: '5493489520436'
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

# Home de la tienda

Las secciones de la home y las mejoras de las tarjetas de producto se configuran en el archivo de cada cliente (`public/c/<cliente>.js`), dentro de `config`.
Cualquier sección que no se cargue no aparece.

**Regla:** todo el contenido tiene que ser real y confirmado por el cliente: números, reseñas, locales y promesas de envío.

## Tarjetas de producto (home, categorías y productos similares)

```js
tarjetas: {
  transferencia: 20, // % de descuento por transferencia que tiene la tienda: muestra "MEJOR PRECIO $X pagando por transferencia"
  quedan: 5          // muestra "QUEDAN N" cuando el stock total es N o menos (solo en plantillas que informan el stock, como Brasilia)
},
```

## Secciones de la home

Van antes del pie de la plantilla, en este orden. Los beneficios van debajo del banner principal.

```js
home: {
  // Franja de beneficios
  beneficios: [
    { icono: '💳', titulo: '3 cuotas sin interés', texto: 'Con todas las tarjetas.' },
    { icono: '🏷️', titulo: '20% OFF transferencia', texto: 'Se descuenta al pagar.' },
    { icono: '🚚', titulo: 'Envío a todo el país', texto: 'Despachamos en 24 h.' }
  ],

  // Categorías destacadas (carrusel con foto)
  categoriasEtiqueta: 'Categorías',
  categoriasTitulo: 'Elegí lo tuyo',
  categorias: [
    { nombre: 'Jeans', texto: 'Baggy y rectos', foto: 'https://...', url: '/jeans/' }
  ],

  // Por qué elegirnos (tarjetas tipo etiqueta, fondo oscuro)
  porQue: {
    etiqueta: 'Por qué nosotros',
    titulo: 'Por qué elegirnos',
    texto: '',
    items: [
      { destacado: 'En el día', titulo: 'Despacho rápido', texto: 'Pedís antes de las 14 h y sale hoy.', pie: 'Envío propio' }
    ]
  },

  // Números de la marca (solo datos reales)
  numerosTitulo: '',
  numeros: [{ valor: '+2.000', texto: 'pedidos enviados' }],

  // Reseñas reales (carrusel)
  resenasEtiqueta: 'Reseñas',
  resenasTitulo: 'Lo que dicen nuestros clientes',
  resenasTexto: '',
  resenas: [{ nombre: 'Rocío', lugar: 'Quilmes', titulo: '', texto: '...', estrellas: 5 }],

  // Preguntas frecuentes (fondo oscuro)
  faqTitulo: 'Lo que siempre nos preguntan',
  faq: [{ p: '¿Cuánto tarda el envío?', r: '...' }],

  // Locales físicos
  localesEtiqueta: 'Locales',
  localesTitulo: 'Vení a conocernos',
  localesTexto: '',
  locales: [{ zona: 'Centro', direccion: 'Av. Siempreviva 742', horario: 'Lunes a sábado de 10 a 20', mapa: 'https://maps.google.com/...', foto: '' }],

  // Cierre con botón al catálogo
  cierre: { etiqueta: 'Catálogo', titulo: 'Esto fue una selección', texto: '...', boton: 'Ver el catálogo completo', url: '/productos/' }
},
```

## Colores y tipografía

Por defecto Nevux toma la marca de cada tienda, sin configurar nada:

- **Color principal:** el del botón de compra de la tienda (`.js-addtocart` o `.btn-primary`).
- **Texto sobre el color principal:** blanco u oscuro, según qué tan claro sea el color.
- **Tipografía:** la del `<body>` de la tienda.
- **Fondo de las secciones oscuras de la home:** el del pie de la plantilla, si es oscuro. Si no, casi negro.

Para forzar otros colores: `color` (acento) y `marca` (`oscuro`, `fondo`, `texto`, `borde`, `fuente`).

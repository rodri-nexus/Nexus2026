# Catálogo de diseños para clientes

Pedido de Rodrigo (01/11/2026): **cuando venga un cliente nuevo o editemos una tienda, mostrarle el catálogo para que elija.** Cada diseño sale de una referencia que mandó Rodrigo (`docs/referencias/`) y está hecho con código propio en el motor (`public/nevux.js`), con los colores, los productos y los datos reales de cada cliente. Los efectos de cada uno están en `docs/efectos.md`.

## Cómo se usa con un cliente

1. Mandarle **https://nevux.ar/disenos**: tres celulares en 3D, cada uno bajando solo por una demo. Abajo están los dos planes con su precio y el botón de pago.
2. El cliente elige la ficha (clara u oscura) y, si es Premium, la home.
3. Se configura en `lib/clientes.ts` y se prueba en su tienda con Playwright antes de prenderlo.

Las demos son `public/demo/disenos/*.html` y se generan con `python3 scripts/demo/disenos.py` (marca "Nevux Demo" y fotos ilustrativas de relojes, **sin reseñas**).

**Pedido de Rodrigo (01/11):** a los clientes que pidan el Premium, dejarles la home **tal cual Destino** (`docs/referencias/destino.md`), con sus productos.

## Qué entra en cada plan

| Plan | Precio | Diseños |
|---|---|---|
| **Básico** | $39.900/mes | **Ficha Pro** clara u oscura con todos sus efectos y home con secciones de confianza |
| **Premium** | $69.900/mes | Todo lo del Básico + **Home Premium · Destino** (la que se promete y se muestra en la landing), carrito con barra de envío gratis, cabecera con logo animado, pie a medida y herramientas del rubro. Valmont tiene el estilo Wess completo |

Lo que incluye cada plan, tal como lo ve el cliente, está en `lib/planes.ts`, que usan `nevux.ar/suscribirme` y `nevux.ar/disenos`.

## Diseños

| # | Nombre | Parte | Plan | Estado | Clientes |
|---|---|---|---|---|---|
| 1 | **Ficha Pro · Clara** (fondo blanco y color de marca) | Ficha | Básico | Hecho (`estiloFicha: 'pro'`, `pro.tema: 'claro'`). Referencia: `docs/referencias/praxis-medias.md` | — |
| 2 | **Ficha Pro · Oscura** (negro, títulos gigantes) | Ficha | Básico | Hecho (`estiloFicha: 'pro'`, `pro.tema: 'oscuro'`). Referencia: `docs/referencias/wess-buzo.md` | — |
| 3 | **Home Premium con clips** | Home | Premium | Hecho (`home.portadaVideo`, `home.rotador`, `tarjetas.alternar`). Referencia: `docs/referencias/praxis-home.md` | — |
| 4 | **Wess clásica** (ficha y home a medida) | Ficha y home | Premium | Hecho (`estiloFicha: 'wess'`) | Valmont |
| 6 | **Home Premium · Destino** (referencia oficial del Premium: portada con tarjetitas, íconos que se dibujan, tira de categorías, números que suben, comunidad, locales con mapa) | Home | Premium | Hecho (`home.destino` + `home.rotador`, `tarjetas.cuotas`, `ventas.estilo: 'destino'`). Demo: `nevux.ar/demo/disenos/home-destino.html`. Referencia: `docs/referencias/destino.md` | — |
| 5 | **Ficha oscura con olas** (la anterior) | Ficha | Básico | Hecho (`estiloFicha: 'oscuro'`) | Hogar Digital |

**Pendiente:** Marcelo (Hogar Digital) está decidiendo entre Básico y Premium. Si es Premium, activar la home Destino ya probada en su tienda; si es Básico, proponerle la Ficha Pro. Ver `docs/estado.md`.

## Ficha Pro: configuración

```js
estiloFicha: 'pro',
color: '#9b2c43',            // color de la marca (botones, columna de la comparativa)
transferencia: 20,           // o se toma de la tienda; las cuotas sin interés y el stock siempre se leen de la tienda
packs: [...],                // opcional: con packs aparece "Elegí cómo querés llevarlo"
cuentaRegresiva: { hasta: '2026-11-04T23:59:59-03:00', texto: '🕐 El descuento termina en' }, // solo con promo real
comparativa: { titulo, bajada, marca, otro, filas: [...], otroFilas: [...] },   // otroFilas solo en el tema oscuro (tachados)
faq: [{ p, r }], resenas: [...] /* solo reales */, whatsapp: '549...',
pro: {
  tema: 'claro' | 'oscuro',
  sello: 'Producto verificado · Marca', estrellas: false,      // estrellas solo con reseñas reales
  presentacion: { etiqueta, titulo, resumen, texto, puntos: [4], boton },
  problema: { etiqueta, titulo, bajada, items: [{ titulo, texto }], solucion: 'texto' | { etiqueta, titulo, items: [...] } },
  galeria: { titulo, bajada, items: [{ tab, titulo, texto }] },  // pestañas que cambian la foto (usa las fotos del producto)
  porque: { etiqueta, titulo, bajada, items: [{ titulo, texto, icono }] },
  confianza: [{ icono: 'camion'|'escudo'|'tarjeta'|'chat', titulo, texto }], // opcional: si no, se arma con datos reales
  oferta: { etiqueta, titulo, texto, recibis, boton, garantias: [...] },
  packsTitulo: 'Elegí cómo querés llevarlas', envios: 'Envíos a todo el país'
}
```

**Efectos de la Ficha Pro:** precios en escalera con la cinta "X% OFF aplicado", packs que se marcan (E9), cuenta regresiva en cajitas (E13), secciones que entran con rebote al bajar (E4), comparativa que se llena con tildes con rebote (E2/E3), pestañas que cambian la foto, botón con brillo (E5), onda y "Agregado ✓" (E10) y barra "🛒 Agregar · nombre" que entra desde abajo (E1).

## Home Premium: configuración

```js
home: {
  portadaVideo: { videos: ['...mp4'] /* o fotos: [...] */, cada: 1100, etiqueta, titulo, texto, boton, url,
                  historias: [{ icono: 'camion'|'tarjeta'|'escudo'|'chat'|'estrella', titulo, texto }] },
  rotador: { etiqueta: 'Encontrá lo tuyo', cada: 2200, items: [{ nombre, url, video | foto }] },
  // + todas las secciones de siempre (docs/home.md)
},
tarjetas: { estilo: 'destacado', transferencia: 20, alternar: true }   // alternar: la foto se da vuelta sola
```

Videos y fotos, **solo los del cliente**. Sin videos, la portada funciona con fotos (con zoom lento).

## Home Premium · Destino: configuración (la que se usa para los clientes Premium nuevos)

```js
transferencia: 15, whatsapp: '549...',
tarjetas: { transferencia: 15, cuotas: 6 },              // cuotas sin interés reales de la tienda
ventas: { estilo: 'destino', marca: 'Nombre de la tienda' }, // aviso de compra abajo a la izquierda con punto que late
home: {
  destino: {
    cinta: ['Envío gratis + *2 prendas*', '3 y 6 cuotas *sin interés*'],  // lo que va entre * sale en rojo
    acento: '#e3262f',                                                       // rojo de Destino o el color de la marca
    portada: { videos: [...] /* o fotos */, etiqueta, titulo, texto, boton, url, boton2, url2, productosUrl: '/productos/' },
    beneficios: [{ icono: 'transferencia'|'cuotas'|'envio'|'cambios'|'garantia'|'regalo'|'chat', titulo, texto }],
    tira: { items: [{ nombre, url, foto }] },                // prendas recortadas por categoría
    destacados: [{ etiqueta, titulo, url: '/categoria/', cantidad: 4 }, { ..., carrusel: true }, { ... }], // 1.º después de la tira, 2.º después de las reseñas, 3.º al final
    comunidad: { etiqueta, titulo, cuenta: '@instagram', url, fotos: [{ foto, producto, url }] },   // solo fotos reales de clientes
    numeros: { titulo: 'Nos eligen *todos los días*', items: [{ valor: 27622, prefijo: '+', texto: 'Ventas' }] }, // solo números reales
    resenas: { titulo, puntaje: 4.9, cantidad: '+1.000', url, items: [{ nombre, producto, texto, estrellas }] }, // solo reales
    faq: [{ p, r }], faqTitulo,
    banner: { etiqueta, titulo, foto, boton, url },
    locales: { etiqueta, titulo, texto, items: [{ zona, nombre, direccion, horario }] }   // mapa de Google con la dirección
  },
  rotador: { etiqueta: 'Arma tu outfit', items: [{ nombre, url, video | foto, video2 | foto2 }] } // va en su lugar dentro de Destino; en computadora, dos columnas (a la derecha, video2/foto2)
}
```

Los productos (fotos, precios, % OFF, precio con transferencia y cuotas) se leen solos de la tienda. **Carrito estilo Destino** (`carrito`, sirve para cualquier plan y plantilla): se suma al carrito lateral de la plantilla (`#modal-cart`, igual en Recife y Brasilia):
- "Tu pedido sale hoy/mañana" con los datos de `envio`;
- barra "Te faltan $X para el envío gratis" → "¡Genial! Tenés envío gratis", que se llena con el subtotal real;
- "Ya lo vivieron" con reseñas reales (de `carrito.resenas`, `home.destino.resenas` o `resenas`).

```js
carrito: { envioGratis: 120000, acento: '#e3262f', resenasTitulo: 'Ya lo vivieron' },   // o true (usa envioGratisDesde)
envio: { corte: 14, dias: [1, 2, 3, 4, 5], min: 3, max: 6 }
```

Probado en la tienda de Marcelo (Brasilia) con un carrito simulado: el navegador de prueba no puede agregar productos de verdad (Tiendanube frena los navegadores automáticos). **Probar con una compra real** la primera vez que se prenda en un cliente.

**"Arma tu outfit" en dos columnas** (computadora, como Destino): se activa solo dentro de la home Destino (o con `rotador.columnas: true`). En celular queda una sola columna.

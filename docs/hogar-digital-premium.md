# Hogar Digital · configuración Premium (home estilo Destino) lista para activar

Probada el 01/11/2026 sobre `hogardigital.com.ar` con Playwright (motor cargado solo en el navegador de prueba). Es la que se ve en la landing (caso real, `public/casos/hogar-digital/`). **No está prendida**: se activa solo si Marcelo se suscribe al Premium.

**01/11 (tarde):** se prendió y se revirtió porque no se parecía a Destino. Ver `docs/estado.md` ("Intento del 01/11, revertido") con las diferencias y el plan.

## Versión 3 (01/11, noche): PUBLICADA en hogardigital.com.ar (azul, pedido de Rodrigo)

Configuración vigente en `lib/clientes.ts` → `hogar-digital` (`plan: 'premium'`, cobro manual).
- **Home:** cabecera flotante (`premium.tema: 'destino'` y `cabecera` con su logo en negro y blanco) → portada con fotos de ambiente y las 3 tarjetitas → beneficios → tira → Destacados → **Comunidad** → **Encontrá lo tuyo**, fijo al bajar → **Números** → Audio → preguntas → banner → Más para tu casa → pie negro.
  - **Comunidad:** 6 historias 9:16 sacadas de sus Reels: Parlante RGB, aro de luz RGB, empaquetando pedidos y Marcelo explicando. Están en `public/clientes/hogar-digital/comunidad/` y cada una lleva a su producto o categoría.
  - **Números** (solo reales): +35 años (empezó en la década del 80), **+300 ventas en 2026** (dato de Marcelo, 01/11), 30 días de garantía y 23 provincias + CABA.
  - **En camino (01/11):** Marcelo le pasa a Rodrigo la **dirección del local** (va en "Locales" con mapa, como Destino) y **reseñas de clientes reales con permiso** (nombre, opinión y foto), que van en las reseñas de la home, la ficha y el carrito, y las fotos en Comunidad.
  - Ocultas: secciones de Brasilia y `banner-services`.
- **Ficha** (`estiloFicha: 'destino'`, textos en `fichaDestino`): migas, título en Dela Gothic y foto con la pastilla "Hogar Digital · 30 días de garantía". Precio en escalera: tachado, "% OFF" y el precio en 40 px. Después, la promo de la tienda, botón negro en pastilla, despacho en caja verde, medios de pago, 3 tarjetas (cambios, atención, garantía), "¿Dudas? Escribinos por WhatsApp", descripción, preguntas con íconos, "Productos similares" y barra fija esmerilada con "Agregar". Sin packs, comparativa ni la ficha oscura: Destino no los tiene.
- **Falta, porque no hay material real:** reseñas (Destino las muestra en la home, la ficha y el carrito), locales con mapa, barra de envío gratis del carrito y portada en video.

## Versión 2 (01/11, noche): en prueba, sin publicar en la tienda

Motor nuevo (rama `ccr-aacae2fe-pg8b5d`, todavía **no mergeado**), con medidas de `docs/referencias/destino.md`:
- **Home Destino con el estilo real:** fondo `#eaeaea`, Unbounded y Space Grotesk, tarjetas blancas translúcidas de 18 px, portada de 28/44 px y rojo `#BD0003` por defecto.
- **"Arma tu outfit"** como un solo panel, con dos fotos en computadora.
- **Cabecera** (`premium.tema: 'destino'` + `cabecera: { logo, logoClaro, nombre }`): tarjeta flotante esmerilada, transparente sobre la portada, con lupa en círculo y la cinta adentro.
- **Pie negro.**
- En la home Destino no va la cuenta regresiva del evento: el evento pasa a la cinta.

Para Marcelo, sumar a la configuración del commit `b0aa694`:
- `premium: { tema: 'destino' }`;
- `cabecera: { logo: 'https://nevux.ar/clientes/hogar-digital/logo-negro.png', logoClaro: 'https://nevux.ar/clientes/hogar-digital/logo-blanco.png', nombre: 'Hogar Digital' }`. Es su logo extraído del mockup plateado y armado en horizontal, en `public/clientes/hogar-digital/`;
- en `ocultar`, sumar `'[data-store="banner-services"]'`;
- en la portada, fotos de ambiente: G, llama y volcán (`aa21b036…`, `0ac01ee3…`, `1000056700…`).

Capturas en `.capturas/marcelo/destino-v2-*.jpg`. **Esperando el ok de Rodrigo antes de publicar.** Sigue faltando material real para comunidad, números, reseñas y locales.

**Regla de Rodrigo (01/11):** el Premium va **tal cual Destino** (`docs/referencias/destino.md`): mismas secciones, orden, diseños y efectos que prometemos en el plan. Nada inventado y solo datos reales de la tienda.

## Cómo activarla

1. En `lib/clientes.ts` → `hogar-digital`: `plan: 'premium'` y cobro automático con su email (`cobro: { tipo: 'mercadopago', email: '...', gracia: 3 }`).
2. Dentro de `config.home`, agregar `destino` y `rotador` con lo de abajo (las URLs de fotos son de su tienda; `F.x` = la foto del producto). Se mantienen sus secciones actuales (vitrinas, porQue, faq, cierre) o se ocultan según lo que pida.
3. Opcional: `ocultar: ['[data-store="home-slider"]']` para sacar el banner de la plantilla, y `ventas: { estilo: 'destino', marca: 'Hogar Digital' }`.
4. Sin `comunidad`, `numeros`, `resenas` ni `locales`: no tiene datos reales para esas secciones (tienda online, sin reseñas cargadas).
5. Probar en celular y en computadora y hacer una compra de prueba si se prende el `carrito`.

## Configuración probada (de `/tmp/hd/destino.js`, sesión del 01/11)

```js
const I = 'https://dcdn-us.mitiendanube.com/stores/007/275/409/products/';
const F = { ovni: I + '1000056709-eba39cf6e5e33054c317901025394499-1024-1024.webp', volcan: I + '1000056700-b80630798d70727f1917901024718719-1024-1024.webp', llama: I + '0ac01ee3-19dc-4154-8351-c21fd5eb0e6c-cba3b0eb-12b78b996cf5c82b0417934072828698-1024-1024.webp',
  g: I + 'aa21b036-c4fc-4cef-ba61-c371cc90d542-0530aaf0-4cc2707e7abbf2c1f317934564759826-1024-1024.webp', rgb: I + '1000064948-1b2cdbc0b81707d0f817924511811491-1024-1024.webp', v8: I + '1000056644-af25d4fda55df67c7817901018261560-1024-1024.webp',
  auris: I + '1000056695-5a06631053060d23e217901024050439-1024-1024.webp', reloj: I + '1000056623-7322be0751a7f8955e17901015253577-1024-1024.webp', fit: I + '1000059933-1564b3879882d329b217909447522683-1024-1024.webp', fit2: I + '1000056639-27c93a9b66ee9dee8c17901017599283-1024-1024.webp' };
const P = {
  ventas: false, ocultar: ['[data-store="home-slider"]'],
  home: Object.assign({}, {
    destino: {
      acento: '#3498db',
      cinta: ['Envíos a *todo el país*', '*30 días* de garantía', 'Atención por *WhatsApp*', 'Devolución *gratis* por falla'],
      portada: { fotos: [F.ovni, F.volcan, F.rgb], cada: 60000, etiqueta: 'Hogar Digital · Desde los años 80', titulo: 'Lo que tu casa necesita.', texto: 'Humidificadores, audio, smartwatches y más.', boton: 'Ver productos', url: '/productos/', boton2: 'Humidificadores', url2: '/humidificadores-19h94/', productosUrl: '/humidificadores-19h94/' },
      beneficios: [{ icono: 'envio', titulo: 'Envíos a todo el país', texto: 'Llega en 5 a 6 días hábiles' }, { icono: 'garantia', titulo: '30 días de garantía', texto: 'Por falla, daño o error' }, { icono: 'chat', titulo: 'Atención por WhatsApp', texto: 'Te ayudamos a elegir' }, { icono: 'cambios', titulo: 'Devolución gratis', texto: 'Si hay una falla' }],
      tira: { items: [['Humidificadores', '/humidificadores-19h94/', F.ovni], ['Audio', '/audio-auriculares/', F.rgb], ['Auriculares', '/audio-auriculares/', F.auris], ['Smartwatches', '/smartwatches-1jb09/', F.reloj], ['Fitness', '/fitness-y-bienestar-1v0hm/', F.fit], ['Relax', '/humidificadores-19h94/', F.llama]].map(([nombre, url, foto]) => ({ nombre, url, foto })) },
      destacados: [{ etiqueta: 'Lo más vendido', titulo: 'Destacados', url: '/humidificadores-19h94/', cantidad: 4 }, { etiqueta: 'Sonido', titulo: 'Audio y *auriculares*', url: '/audio-auriculares/', carrusel: true, cantidad: 6 }],
      faq: [{ p: '¿Cuánto tarda en llegar?', r: 'Despachamos de lunes a viernes y llega en 5 a 6 días hábiles.' }, { p: '¿Tiene garantía?', r: 'Sí, 30 días por falla, daño o error en el envío.' }, { p: '¿Cómo puedo pagar?', r: 'Con tarjeta y Mercado Pago.' }],
      banner: { etiqueta: '[ Hogar Digital ]', titulo: 'Tu rincón relax.', foto: F.volcan, boton: 'Ver humidificadores', url: '/humidificadores-19h94/' },
    },
    rotador: { etiqueta: 'Encontrá lo tuyo', items: [['Humidificadores', '/humidificadores-19h94/', F.ovni, F.g], ['Audio', '/audio-auriculares/', F.rgb, F.v8], ['Smartwatches', '/smartwatches-1jb09/', F.reloj, F.reloj], ['Fitness', '/fitness-y-bienestar-1v0hm/', F.fit, F.fit2]].map(([nombre, url, foto, foto2]) => ({ nombre, url, foto, foto2 })) },
  }),
};
```

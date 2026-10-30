# Estado de Nevux

**Actualizado:** 30/10/2026. Leer esto al empezar cada sesión, junto con `docs/clientes.md`, `docs/home.md`, `docs/landing.md` y `docs/referencias/`.

## Qué está funcionando

- **Landing (nevux.ar):** rehecha el 30/10/2026 con lo del curso de marketing. Ver `docs/landing.md`.
  - CTA principal "Quiero mi análisis gratis", que lleva a WhatsApp 3434163999 (Contact en Meta Pixel, generate_lead en GA4);
  - calculadora "Hacé la cuenta", antes/después real, las 22 piezas agrupadas, demo interactiva, comparativa y objeciones;
  - precio sin precio tachado, garantía de 7 días y botones de arrepentimiento y baja.
- **Suscripción:**
  - `nevux.ar/suscribirme?c=<cliente>` (página de pago personalizada, con vista previa propia en WhatsApp);
  - `nevux.ar/gracias`;
  - link de Mercado Pago `mpago.la/1LqFYin` ($39.900/mes).
- **Motor (`public/nevux.js`):**
  - ficha: packs, mejor precio por transferencia, cuotas reales, entrega estimada, cuenta regresiva, envío gratis, urgencia, avisos de venta con productos reales, botón fijo, WhatsApp, cinta, calculadora de talle, antes/después, pasos, comparativa, reseñas, preguntas frecuentes, Combiná con (también automático), videos, colores;
  - home: cuenta regresiva, beneficios, categorías, por qué elegirnos, números, reseñas, preguntas, locales y cierre;
  - tarjetas: mejor precio y "QUEDAN N";
  - toma solo los colores y la tipografía de cada tienda.
- **Instalación:** una línea en Tiendanube → Editar diseño → Pie de página → Sellos personalizados → "Código Javascript o HTML del sello".
- **Cobro automático:**
  - `lib/cobros.ts` consulta Mercado Pago (cuenta BGDHACEBF14717) y prende o apaga cada tienda sola;
  - panel privado en `nevux.ar/panel?clave=<PANEL_CLAVE>`;
  - variables `MP_ACCESS_TOKEN` y `PANEL_CLAVE` cargadas en Vercel.

## Clientes

- **Hogar Digital (Marcelo)** · hogardigital.com.ar · plantilla Brasilia · **prendido, cobro manual**. Dio permiso (30/10) para usar el nombre de la tienda en la landing e Instagram. Instagram: @hogardigitaltiendaonline (se lo menciona en los textos del caso).
  - **Semana Cyber (2 al 4/11):** modo evento prendido (barra, cuenta regresiva y cinta). Se anuncia desde el 30/10 y se apaga solo el 4/11 a las 23:59. Pendiente: que Marcelo confirme sus descuentos para sumarlos.
  - **Diseño (31/10):** azul #3498db y negro, barra de anuncios, medios de pago, ficha oscura, antes vs. después, foto con puntos del Humidificador OVNI y vitrinas de Humidificadores y Audio. Pendiente de Marcelo: pasar el color de los botones de su plantilla de rojo a azul (Editar diseño → Colores).
  - **Promoción por cantidad** creada en su Tiendanube (15% llevando 2, 25% llevando 3), verificada en el carrito.
  - **Pendiente:**
    - que se suscriba con `nevux.ar/suscribirme?c=hogar-digital` y pasarlo a cobro automático con su email;
    - fotos de categorías y reseñas reales para la home.
- **Segundo cliente:** no tocar hasta que avise que su tienda está creada.

## Decisiones pendientes de Rodrigo

- Si la home va incluida en los $39.900 o se cobra aparte (hoy `/suscribirme` la lista como incluida).
- Días de gracia antes de apagar por falta de pago (hoy 5).

## Pendientes técnicos

- `www.nevux.ar` da error de certificado: agregar `www.nevux.ar` en Vercel → Dominios → redirigir a `nevux.ar`.
- Opcional: URL de retorno del plan de Mercado Pago → `https://nevux.ar/gracias`.

## Instagram (@nevux.app)

Plan completo en `docs/instagram.md`. Windsor.ai está conectado a la cuenta: desde acá se publica (carruseles, imágenes, Reels, historias), se responden comentarios y se leen métricas. La bio, la foto y las destacadas las cambia Rodrigo desde la app.

- Semana 1 lista en `public/ig/` (3 carruseles para fijar + portadas de destacadas).
- Pendiente de Rodrigo: bio, nombre y link del perfil; subir las destacadas; grabar los Reels de la semana 2.

## Próxima sesión

Publicar la semana 1 de Instagram y armar las piezas de la semana 2.
Testimonio de Marcelo (30/10) cargado en la landing (`TESTIMONIOS` en `Landing.tsx`) y en la destacada Clientes de Instagram. Dio permiso para nombre y foto.

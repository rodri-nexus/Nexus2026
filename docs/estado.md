# Estado de Nevux

**Actualizado:** 30/10/2026. Leer esto al empezar cada sesión, junto con `docs/clientes.md`, `docs/home.md` y `docs/referencias/`.

## Qué está funcionando

- **Landing (nevux.ar):**
  - CTA principal "Quiero que analices mi tienda", que lleva a WhatsApp 3434163999 (Contact en Meta Pixel, generate_lead en GA4);
  - antes/después real, las 22 piezas en pestañas y demo interactiva "Probalo acá";
  - precio, garantía de 7 días y preguntas frecuentes;
  - botones de arrepentimiento y baja.
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

- **Hogar Digital (Marcelo)** · hogardigital.com.ar · plantilla Brasilia · **prendido, cobro manual**.
  - **Promoción por cantidad** creada en su Tiendanube (15% llevando 2, 25% llevando 3), verificada en el carrito.
  - **Pendiente:**
    - que se suscriba con `nevux.ar/suscribirme?c=hogar-digital` y pasarlo a cobro automático con su email;
    - permiso para usar su nombre en la landing;
    - fotos de categorías y reseñas reales para la home.
- **Segundo cliente:** no tocar hasta que avise que su tienda está creada.

## Decisiones pendientes de Rodrigo

- Si la home va incluida en los $39.900 o se cobra aparte (hoy `/suscribirme` la lista como incluida).
- Días de gracia antes de apagar por falta de pago (hoy 5).

## Pendientes técnicos

- `www.nevux.ar` da error de certificado: agregar `www.nevux.ar` en Vercel → Dominios → redirigir a `nevux.ar`.
- Meta registra PageView dos veces por carga en la landing.
- Opcional: URL de retorno del plan de Mercado Pago → `https://nevux.ar/gracias`.

## Próxima sesión

Mejorar la landing y armar el Instagram y el contenido en base a los materiales del curso de marketing que va a pasar Rodrigo.

# Estado de Nevux

**Actualizado:** 31/10/2026. Leer esto al empezar cada sesión, junto con `docs/valmont.md` (lo que se está haciendo ahora), `docs/clientes.md`, `docs/home.md`, `docs/landing.md`, `docs/instagram.md` y `docs/referencias/`.

## Cómo trabajamos

- **Rodrigo** es el dueño de Nevux. Habla en rioplatense y quiere que yo haga todo lo que se pueda desde acá.
- **Publicar:** Rodrigo autorizó publicar en nevux.ar sin preguntarle. El camino es: rama de trabajo → pull request a `main` → merge (merge commit) → Vercel lo publica. Antes de publicar, el build tiene que pasar y la página tiene que estar revisada en el celular. Después, comprobar que esté en vivo con `curl`.
- **Cambios en una tienda:** se prueban en la tienda real con Playwright (Chromium ya instalado), cargando el motor nuevo solo en el navegador de prueba (`page.route`). Sacar capturas en celular (390 px) y en computadora, y mandárselas.
- **Panel de Tiendanube:** no puedo entrar. Rodrigo hace los clics (pegar la línea, subir banners, colores, importar productos) con mi guía paso a paso y, si hace falta, me manda capturas.
- **Límites que ya se hablaron:**
  - Nada de datos inventados: ni reseñas, ni números de ventas, ni descuentos que no existan.
  - **Nunca réplicas de marcas** (Rolex, Omega, Patek, G-Shock, etc.).
  - De otras tiendas se replica la idea y el diseño, no el código.
- **Permisos:** `.claude/settings.json` (lo creó Rodrigo) permite usar Windsor (publicar en Instagram y leer métricas) sin pedir confirmación.

## Qué está funcionando

- **Landing (nevux.ar):** ver `docs/landing.md`.
  - CTA "Quiero mi análisis gratis" a WhatsApp 3434163999.
  - Calculadora, antes y después, testimonio de Marcelo y precio sin tachado.
  - Vista previa de marca al compartir: `public/compartir.jpg`.
- **Página de links:** `nevux.ar/links`, para la bio de Instagram. Miniaturas en `public/links/`.
- **Suscripción:**
  - Página de pago: `nevux.ar/suscribirme?c=<cliente>`.
  - Página de gracias: `nevux.ar/gracias`.
  - Mercado Pago: `mpago.la/1LqFYin` ($39.900/mes).
- **Motor (`public/nevux.js`)**, con todas las piezas que se configuran por cliente en `lib/clientes.ts`:
  - **Ficha:** packs, precio por transferencia, bloque de precios (`precios`), cuotas reales, entrega estimada, cuenta regresiva, envío gratis, urgencia, avisos de venta, botón fijo, WhatsApp, cinta, talles, antes y después, pasos, comparativa animada, reseñas, preguntas frecuentes, Combiná con, videos, colores, medios de pago (`mediosDePago`), antes vs. después en lista (`problemaSolucion`), ficha oscura con olas (`estiloFicha: 'oscuro'`), especificaciones, medidor de muñeca (`muneca`), qué incluye (`incluye`) y para regalar (`regalo`).
  - **Home:** portada estilo Wess (`home.portada`), portada de lujo (`home.hero`), beneficios (con íconos de línea si `icono` es `cuotas`, `descuento`, `envio`, `garantia`, `original`, `regalo` o `factura`), categorías, foto con puntos (`home.puntos`), vitrinas (`home.vitrinas`; con `estilo: 'wess'` cuelgan de una barra y avanzan solas), grilla estilo Wess con categorías que giran (`home.grilla`), por qué elegirnos, números, reseñas, preguntas frecuentes, locales y cierre.
  - **Toda la tienda:** barra de anuncios que rota (`anuncios`), modo evento con fechas (`evento`: Cyber, Hot Sale, etc.; se prende y se apaga solo), tarjetas de producto (`tarjetas.estilo`: `'destacado'` o `'wess'`) y plan Premium (`premium`: tipografías, entrada animada y `tema: 'wess'`).
- **Cobro automático:** `lib/cobros.ts` (Mercado Pago) y el panel en `nevux.ar/panel?clave=<PANEL_CLAVE>`.

## Clientes

### Hogar Digital (Marcelo) · hogardigital.com.ar · plantilla Brasilia · plan Básico · prendido, cobro manual

- **Diseño:** azul #3498db y negro. Tiene barra de anuncios, tarjetas destacadas, comparativa animada, medios de pago, ficha oscura, antes vs. después, foto con puntos del Humidificador OVNI y vitrinas de Humidificadores y Audio.
- **Semana Cyber (2 al 4/11):** modo evento con barra, cuenta regresiva y cinta. Se apaga solo el 4/11 a las 23:59.
- **Banner de Semana Cyber** subido por Rodrigo. **Hay que sacarlo el jueves 5/11:** no se apaga solo.
- **Permisos y contenido:**
  - Dio permiso para su nombre, su foto y su testimonio, que ya están en la landing y en la destacada Clientes.
  - Instagram: @hogardigitaltiendaonline.
- **Pendiente:**
  - Que confirme los descuentos del Cyber, para sumarlos a la barra y la cinta.
  - Que active descuento por transferencia y cuotas sin interés: el bloque de precios aparece solo cuando los tenga.
  - Que se suscriba en `nevux.ar/suscribirme?c=hogar-digital` para pasarlo a cobro automático.

### Valmont & Co. · valmontrelojes.mitiendanube.com · plantilla Morelia · plan Premium (estilo Wess)

Lo que se está haciendo ahora. **Ver `docs/valmont.md`.**

## Instagram

- **@nevux.app:** Windsor conectado. La semana 1 está programada del 30/10 al 6/11:
  - un post por día a las ~19:30;
  - historias a las 9:47, 13:17 y 20:17.

  Las tareas programadas están atadas **a la sesión anterior**. Ver `docs/instagram.md` y `public/ig/agenda.json`.
- **Informe y semana 2:** el sábado 7/11 hay que hacer el informe de la semana 1 y armar la semana 2 con la misma estructura.
- **@valmont.relojes:** creado y con 3 publicaciones de marca. De ahora en más lo maneja el cliente.

## Decisiones pendientes de Rodrigo

- Si la home va incluida en los $39.900 o se cobra aparte.
- Precio del plan Premium (sugerido: más alto que el Básico, o un pago inicial por el diseño más el mensual).
- Días de gracia antes de apagar por falta de pago (hoy 5).

## Pendientes técnicos

- `www.nevux.ar` da error de certificado: agregarlo en Vercel → Dominios → redirigir a `nevux.ar`.
- Windsor está en plan de prueba: si vence, se cortan las publicaciones programadas.
- La barra de urgencia "84% vendido" es fija. Rodrigo decidió dejarla.

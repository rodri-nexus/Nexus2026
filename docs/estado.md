# Estado de Nevux

**Actualizado:** 01/11/2026.

## Cómo trabajamos

- **Rodrigo** es el dueño de Nevux. Habla en rioplatense y quiere que yo haga todo lo que se pueda desde acá.
- **Publicar:** Rodrigo autorizó publicar en nevux.ar sin preguntarle. El camino es: rama de trabajo → pull request a `main` → merge (merge commit) → Vercel lo publica. Antes de publicar, el build tiene que pasar y la página tiene que estar revisada en el celular. Después, comprobar que esté en vivo con `curl`.
- **Cambios en una tienda:** se prueban en la tienda real con Playwright (Chromium ya instalado), cargando el motor nuevo solo en el navegador de prueba (`page.route`). Sacar capturas en celular (390 px) y en computadora, y mandárselas.
- **Panel de Tiendanube:** no puedo entrar. Rodrigo hace los clics (pegar la línea, subir banners, colores, importar productos) con mi guía paso a paso y, si hace falta, me manda capturas.
- **Reels con narración (pedido de Rodrigo, 31/10, vale para esta y todas las sesiones futuras):** todos los Reels llevan una voz que narra lo que pasa en el video, profesional y no robótica, con acento argentino (Rodrigo pidió rosarino). Se hace con voces neuronales de Microsoft `es-AR-TomasNeural` (masculina) o `es-AR-ElenaNeural` (femenina) usando `edge-tts` (`pip install edge-tts`). En el contenedor hay que confiar en el CA del proxy: en Python, parchear `ssl.create_default_context` para que cargue `/root/.ccr/ca-bundle.crt`. No hay voces con tonada rosarina: son rioplatenses. Rodrigo todavía no eligió entre Tomás y Elena.
- **Límites que ya se hablaron:**
  - Nada de datos inventados: ni reseñas, ni números de ventas, ni descuentos que no existan.
  - **Nunca réplicas de marcas** (Rolex, Omega, Patek, G-Shock, etc.).
  - De otras tiendas se replica la idea y el diseño, no el código.
- **Permisos:** `.claude/settings.json` (lo creó Rodrigo) permite usar Windsor (publicar en Instagram y leer métricas) sin pedir confirmación.

## Para retomar en un chat nuevo (01/11/2026)

**Tareas programadas:** todas corren en la sesión `session_01PDD9EtCY9JFJzsoyimb9Yn` ("Nexus2026" del 30/10 al 01/11). **No archivar esa sesión**: si se archiva, dejan de publicarse. Para pasarlas a otra sesión: `list_triggers`, crear las mismas con `create_trigger` desde la sesión nueva y apagar las viejas con `update_trigger enabled=false`.

| Tarea | Horario (Argentina) | Cuenta |
|---|---|---|
| Historias de @nevux.app | 9:47 · 13:17 · 20:17, todos los días | 17841439255112405 |
| Post de @nevux.app | 19:30, todos los días (agenda hasta el 6/11) | 17841439255112405 |
| Historias de Hogar Digital | 10:12 · 14:42 · 21:12, lunes a viernes | 17841448464906393 |
| Post de Hogar Digital | 19:48, lunes a viernes (agenda del 2 al 6/11) | 17841448464906393 |
| Informe y semana 2 de las dos cuentas | Sábado 7/11, 12:00 | las dos |

**Hecho en la sesión del 30/10 al 01/11:**
- Valmont & Co.: tienda terminada (home y ficha estilo Wess, plantilla Recife, videos de los 5 relojes). Miguel dio el ok; está apagada hasta que se suscriba al Premium y se prende sola al cobrar (`cobro.planMp`). Ver `docs/valmont.md`.
- Planes de Mercado Pago: Básico $39.900/mes `mpago.la/2u5gT97` y Premium $69.900/mes `mpago.la/2mkcebx` (`lib/planes.ts`). Links para clientes: `nevux.ar/suscribirme?c=<id>`.
- Instagram de Hogar Digital: conectado a Windsor, diagnóstico y semana 1 programada. Servicio de contenido: $85.000/mes. Ver `docs/instagram-hogar-digital.md`.
- Regla: todos los Reels con narración en voz argentina (ver "Cómo trabajamos").

**Falta:**
1. Rodrigo elige voz para los Reels: Tomás (masculina, la que se usa ahora) o Elena (femenina).
2. Miguel paga el Premium → pasar su email a `cobro` en `lib/clientes.ts` (valmont).
3. Marcelo se suscribe al Básico mensual (`nevux.ar/suscribirme?c=hogar-digital`) → pasarlo a cobro automático con su email. Rodrigo desactiva el link viejo `mpago.la/1LqFYin` (pago único) cuando lo encuentre.
4. Perfil de Instagram de Hogar Digital: nueva bio y destacadas (desde la app); dejar de seguir cuentas sin relación, de a 50 por día como máximo.
5. Sábado 7/11: informe de la semana 1 y semana 2 de @nevux.app (7 al 13/11) y de Hogar Digital (9 al 13/11).
6. Windsor sigue en plan de prueba: si vence, se cortan las publicaciones de las dos cuentas.
7. Pendientes técnicos y decisiones de abajo.

## Qué está funcionando

- **Landing (nevux.ar):** ver `docs/landing.md`.
  - CTA "Quiero mi análisis gratis" a WhatsApp 3434163999.
  - Calculadora, antes y después, testimonio de Marcelo y precio sin tachado.
  - Vista previa de marca al compartir: `public/compartir.jpg`.
- **Página de links:** `nevux.ar/links`, para la bio de Instagram. Miniaturas en `public/links/`.
- **Suscripción:**
  - Planes: Básico $39.900/mes (`mpago.la/2u5gT97`; el viejo `1LqFYin` era pago único y se da de baja) y **Premium $69.900/mes** (`mpago.la/2mkcebx`, creado el 31/10). Ver `lib/planes.ts` y `docs/clientes.md`.
  - Página de pago: `nevux.ar/suscribirme?c=<cliente>`.
  - Página de gracias: `nevux.ar/gracias`.
  - Mercado Pago: plan Básico `mpago.la/2u5gT97` ($39.900/mes) y plan Premium `mpago.la/2mkcebx` ($69.900/mes).
- **Motor (`public/nevux.js`)**, con todas las piezas que se configuran por cliente en `lib/clientes.ts`:
  - **Ficha:** packs, precio por transferencia, bloque de precios (`precios`), cuotas reales, entrega estimada, cuenta regresiva, envío gratis, urgencia, avisos de venta, botón fijo, WhatsApp, cinta, talles, antes y después, pasos, comparativa animada, reseñas, preguntas frecuentes, Combiná con, videos, colores, medios de pago (`mediosDePago`), antes vs. después en lista (`problemaSolucion`), ficha oscura con olas (`estiloFicha: 'oscuro'`), ficha estilo Wess (`estiloFicha: 'wess'` con textos en `ficha`), especificaciones, medidor de muñeca (`muneca`), qué incluye (`incluye`) y para regalar (`regalo`).
  - **Home:** portada estilo Wess (`home.portada`), portada de lujo (`home.hero`), beneficios (con íconos de línea si `icono` es `cuotas`, `descuento`, `envio`, `garantia`, `original`, `regalo` o `factura`), categorías, foto con puntos (`home.puntos`), vitrinas (`home.vitrinas`; con `estilo: 'wess'` cuelgan de una barra y avanzan solas), grilla estilo Wess con categorías que giran (`home.grilla`, una o varias), foto con puntos y líneas estilo Wess (`home.puntos` con `estilo: 'wess'`), medidor de reloj en pasos (`home.medidor`), "Colgado por poco tiempo" (`home.colgado`), por qué elegirnos, números, reseñas, preguntas frecuentes, locales y cierre.
  - **Toda la tienda:** pie estilo Wess (`pie`, con `premium.tema: 'wess'`), secciones de la plantilla ocultas (`ocultar`), barra de anuncios que rota (`anuncios`), modo evento con fechas (`evento`: Cyber, Hot Sale, etc.; se prende y se apaga solo), tarjetas de producto (`tarjetas.estilo`: `'destacado'` o `'wess'`) y plan Premium (`premium`: tipografías, entrada animada y `tema: 'wess'`).
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

### Valmont & Co. · valmontrelojes.mitiendanube.com · plantilla Recife (desde el 31/10; antes Morelia) · plan Premium (estilo Wess)

**Terminada el 31/10: Rodrigo dijo que no se toca más.** Falta solo el ok del cliente (Miguel), apagarla hasta que pague y pasarla a cobro automático. Ver `docs/valmont.md`.

## Instagram

- **@nevux.app:** Windsor conectado. La semana 1 está programada del 30/10 al 6/11:
  - un post por día a las ~19:30;
  - historias a las 9:47, 13:17 y 20:17.

  Las tareas programadas corren desde el 31/10 en la sesión `session_01PDD9EtCY9JFJzsoyimb9Yn` (las de la sesión "Nexus2026 docs review" quedaron apagadas porque se trababan esperando permiso). Ver `docs/instagram.md` y `public/ig/agenda.json`.
- **Informe y semana 2:** el sábado 7/11 hay que hacer el informe de la semana 1 y armar la semana 2 con la misma estructura.
- **@hogardigitaltiendaonline (Marcelo):** conectado a Windsor el 01/11 (account 17841448464906393). Diagnóstico y plan en `docs/instagram-hogar-digital.md`.
- **@valmont.relojes:** creado y con 3 publicaciones de marca. De ahora en más lo maneja el cliente.

## Decisiones pendientes de Rodrigo

- Si la home va incluida en los $39.900 o se cobra aparte.
- Días de gracia antes de apagar por falta de pago (hoy 5).

## Pendientes técnicos

- `www.nevux.ar` da error de certificado: agregarlo en Vercel → Dominios → redirigir a `nevux.ar`.
- Windsor está en plan de prueba: si vence, se cortan las publicaciones programadas.
- La barra de urgencia "84% vendido" es fija. Rodrigo decidió dejarla.

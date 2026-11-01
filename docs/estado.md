# Estado de Nevux

**Actualizado:** 01/11/2026 (tarde).

## Cómo trabajamos

- **Rodrigo** es el dueño de Nevux. Habla en rioplatense y quiere que yo haga todo lo que se pueda desde acá.
- **Publicar:** Rodrigo autorizó publicar en nevux.ar sin preguntarle. El camino es: rama de trabajo → pull request a `main` → merge (merge commit) → Vercel lo publica. Antes de publicar, el build tiene que pasar y la página tiene que estar revisada en el celular. Después, comprobar que esté en vivo con `curl`.
- **Cambios en una tienda:** se prueban en la tienda real con Playwright (Chromium ya instalado), cargando el motor nuevo solo en el navegador de prueba (`page.route`). Sacar capturas en celular (390 px) y en computadora, y mandárselas.
- **Panel de Tiendanube:** no puedo entrar. Rodrigo hace los clics (pegar la línea, subir banners, colores, importar productos) con mi guía paso a paso y, si hace falta, me manda capturas.
- **Reels con narración (pedido de Rodrigo, vale para todas las sesiones):** todos los Reels llevan la voz de **Tomás** (`es-AR-TomasNeural`, elegida el 01/11; Rodrigo no quiere pagar por clonar su voz) y **música de fondo suave** que baja sola cuando habla. Todo está en `scripts/instagram/audio.py`: voz con `edge-tts` (`pip install edge-tts numpy`; en el contenedor se parchea `ssl.create_default_context` para cargar `/root/.ccr/ca-bundle.crt`) y música generada por el propio script (acordes propios, sin derechos de autor). Reels de @nevux.app: `python3 scripts/instagram/narrar.py <nombre>` (si la voz necesita más tiempo, arma la animación más lenta en la medida justa). Reels de Hogar Digital: `python3 scripts/instagram/hd/reels.py`.
- **Diseños para clientes (pedido de Rodrigo, 01/11):** Rodrigo manda videos de tiendas de a uno. Cada uno se estudia cuadro por cuadro, se le pasa el desglose y, con su ok, se replica igual con código propio en el motor. Se guardan **también los efectos** (`docs/efectos.md`, medidos con exactitud), porque son los que generan el "wow". Cada diseño queda guardado en `docs/disenos.md`: **cuando se edite una tienda, preguntarle al cliente qué diseño quiere** mostrándole ese catálogo.
- **Cliente nuevo:** mostrarle **https://nevux.ar/disenos** (diseños en celulares 3D + planes Básico y Premium) y que elija. Ver `docs/disenos.md`.
- **Límites que ya se hablaron:**
  - Nada de datos inventados: ni reseñas, ni números de ventas, ni descuentos que no existan.
  - **Nunca réplicas de marcas** (Rolex, Omega, Patek, G-Shock, etc.).
  - De otras tiendas se replica la idea y el diseño, no el código.
- **Permisos:** `.claude/settings.json` (lo creó Rodrigo) permite usar Windsor (publicar en Instagram y leer métricas) sin pedir confirmación.

## Para retomar en un chat nuevo (actualizado 01/11/2026, mediodía)

**Leer primero:** este archivo, `docs/disenos.md` (catálogo de diseños y configuración de cada uno), `docs/efectos.md` (efectos medidos), `docs/referencias/destino.md` (referencia oficial del Premium), `docs/valmont.md`, `docs/clientes.md`, `docs/instagram.md` y `docs/instagram-hogar-digital.md`.

**Sesiones:** el trabajo del 01/11 se hizo en `session_01PDD9EpeUFqobvhnuTnY9ML` (rama `ccr-e70b7b83-jp35vx`, todo mergeado a `main` hasta el PR #84). Ahí también está el aviso del 23/11 de Windsor. Las tareas programadas de Instagram siguen en `session_01PDD9EtCY9JFJzsoyimb9Yn` (ver abajo).

### Hecho en la sesión del 01/11 (todo publicado en nevux.ar)

- **Cobro:** 3 días de gracia (`lib/cobros.ts`). `www.nevux.ar` redirige a `nevux.ar` (Vercel).
- **Reels:** voz de Tomás + música de fondo propia en todos (`scripts/instagram/audio.py`, `narrar.py`, `hd/reels.py`).
- **Diseños nuevos en el motor** (`public/nevux.js`), todos con datos reales de la tienda:
  - **Ficha Pro** clara u oscura (`estiloFicha: 'pro'`), incluida en el **Básico**.
  - **Home Premium con clips** (`home.portadaVideo`, `home.rotador`, `tarjetas.alternar`).
  - **Home Premium · Destino** (`home.destino`): **la que se promete en el Premium**, copia de `destinoclothes.mitiendanube.com` (Praxis). Con "Arma tu outfit" en dos columnas en computadora.
  - **Carrito estilo Destino** (`carrito`): despacho, barra de envío gratis y reseñas en el carrito de la plantilla.
- **Catálogo para clientes:** `nevux.ar/disenos` (celulares 3D + notebook + planes). Demos en `public/demo/disenos/` (`python3 scripts/demo/disenos.py`).
- **Landing**, en este orden: portada → "Así puede quedar tu tienda" (celulares 3D) → Plan Premium (notebook con la home Destino) → el problema → la cuenta → caso real de Hogar Digital con la home Destino en 6 partes (`public/casos/hogar-digital/`, "vista previa sobre su tienda real") → cómo lo hace → precio con los 2 planes (compactos y centrados) → preguntas. Se sacaron el celular de la portada, el antes y después deslizable y la demo "Urbana".
- **nevux.ar/links:** tarjetas "Caso real: Hogar Digital", "Así puede quedar tu tienda", "Plan Premium" y precio de los dos planes.
- **Planes** (`lib/planes.ts`): el Premium describe la home Destino. Básico $39.900, Premium $69.900.
- **Para Marcelo:** 3 imágenes de su tienda con el Premium (`.capturas/marcelo/`, no están en el repo) y mensaje con Básico vs. Premium.
- **Decisiones de Rodrigo:** la home va incluida en el Básico; **Valmont se queda con el estilo Wess**; a los clientes Premium nuevos se les deja la home **tal cual Destino**; los **avisos de compra** (`ventas`, nombres de ejemplo) **se quedan prendidos** (ya se le avisó del riesgo; no volver a planteárselo).

### Lo que falta (en orden)

> **HECHO (01/11, tarde): Marcelo (Hogar Digital) pasó al plan Premium.** Home Destino prendida en `hogardigital.com.ar` (`plan: 'premium'` en `lib/clientes.ts`), con aviso de compra y carrito estilo Destino y un video real del Parlante RGB sacado de su Instagram. Detalle y lo que falta para que sea Destino completo (comunidad, números, reseñas, locales, envío gratis, cabecera y pie, videos limpios para la portada, cobro automático y compra real de prueba) en **`docs/hogar-digital-premium.md`**.
>
> Pedido original de Rodrigo (01/11): pasar a Marcelo (Hogar Digital) al plan Premium.
> El Premium se arma **tal cual la tienda Destino** (`destinoclothes.mitiendanube.com`, ver `docs/referencias/destino.md`): mismas secciones, mismo orden, mismos diseños y **mismos efectos** que prometemos en el plan (`lib/planes.ts`, la landing y `nevux.ar/disenos`). **Nada inventado**: no agregar secciones ni efectos que no estén en Destino o en el plan, y solo con datos reales de su tienda. Partir de `docs/hogar-digital-premium.md` (ya probado en su tienda) y completar lo que falte de Destino con material real de Marcelo (videos, fotos, reseñas, números) si lo tiene.

1. **Contestarle a Marcelo** (preguntó si debe algo, cuánto sale por mes y las fechas de pago). Hay un borrador en el chat del 01/11 que espera dos datos de Rodrigo: **si Marcelo ya pagó algo** (plan o Instagram de noviembre) y **cómo cobra el Instagram** ($85.000/mes: aparte por transferencia o junto). Totales: Básico + Instagram **$124.900/mes**; Premium + Instagram **$154.900/mes**. La suscripción de Mercado Pago se debita sola el mismo día de cada mes en que se suscribe. Links: Básico `nevux.ar/suscribirme?c=hogar-digital`, Premium `nevux.ar/suscribirme?plan=premium`.
2. ~~**Si Marcelo elige el Premium:**~~ **Hecho el 01/11** salvo el cobro automático (falta su email: sigue `manual`) y la compra real de prueba. Antes decía: en `lib/clientes.ts` (hogar-digital) poner `plan: 'premium'`, pasar a cobro automático con su email y activar `home.destino` + `home.rotador` con la configuración ya probada en su tienda (**`docs/hogar-digital-premium.md`**: cinta azul `#3498db`, portada con el OVNI, beneficios reales, tira de categorías, destacados de humidificadores y audio, preguntas y banner "Tu rincón relax"; sin comunidad, números ni reseñas porque no tiene reales). Probar con Playwright y una compra real antes de dejarlo.
3. ~~Si se queda en Básico~~ (pasó al Premium). Igual se le puede ofrecer la **Ficha Pro** (incluida; hoy tiene `estiloFicha: 'oscuro'`).
3b. **Pedirle a Marcelo material real** para completar la home Destino: videos verticales limpios de sus productos (sin texto encima), fotos de clientes, números reales, reseñas, si tiene local y si tiene envío gratis desde algún monto. Y su logo en buena calidad para la cabecera animada y el pie.
4. **Miguel (Valmont)** paga el Premium entre el 5 y el 7/11 → cambiar `planMp` por su email en `lib/clientes.ts` y sumar Valmont como **segundo caso real** en la landing (`#solucion`) y en `nevux.ar/links`.
5. **Banner del Cyber de Hogar Digital:** Rodrigo vuelve al banner anterior el jueves 5/11 (lo tiene anotado).
6. **Sábado 7/11:** informe de la semana 1 y semana 2 de las dos cuentas de Instagram (tarea programada).
7. **Windsor:** vence ~29/11; aviso el 23/11. Después, publicación manual paso a paso (primero @nevux.app, después Hogar Digital).
8. **Carrito estilo Destino:** probarlo con una compra real la primera vez que se prenda en un cliente.
9. Perfil de Instagram de Hogar Digital (bio, destacadas, dejar de seguir de a 50 por día).

### Tareas programadas y lo anterior

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
1. ~~Voz de los Reels~~: Tomás + música de fondo (01/11). Ya están hechos así los Reels de esta semana de las dos cuentas.
2. Miguel paga el Premium **entre el 5 y el 7/11** (cuando cobra; ya lo acordó con Rodrigo). Hasta entonces la tienda sigue apagada. Cuando pague → pasar su email a `cobro` en `lib/clientes.ts` (valmont). Además, **sumar Valmont como segundo caso real** en la landing (al lado de Hogar Digital, sección `#solucion`) y una tarjeta en `nevux.ar/links` (pedido de Rodrigo del 01/11).
3. Rodrigo habla con Marcelo el 2/11 para pasarlo del pago viejo a la suscripción nueva. Marcelo se suscribe al Básico mensual (`nevux.ar/suscribirme?c=hogar-digital`) → pasarlo a cobro automático con su email. El link viejo `mpago.la/1LqFYin` ya lo borró Rodrigo (01/11).
4. Perfil de Instagram de Hogar Digital: nueva bio y destacadas (desde la app); dejar de seguir cuentas sin relación, de a 50 por día como máximo.
5. Sábado 7/11: informe de la semana 1 y semana 2 de @nevux.app (7 al 13/11) y de Hogar Digital (9 al 13/11).
6. **Windsor:** plan de prueba de 30 días desde el ~30/10 (vence ~29/11). Rodrigo **no va a pagar**: cuando venza, publica él a mano (ver `docs/instagram.md`, "Si vence Windsor"). Hay un aviso programado para el 23/11 en la sesión `session_01PDD9EpeUFqobvhnuTnY9ML`.
7. Pendientes técnicos y decisiones de abajo.
8. Proponerle a Marcelo la Ficha Pro (su plan Básico ya la incluye; hoy tiene la ficha oscura con olas).

## Qué está funcionando

- **Landing (nevux.ar):** ver `docs/landing.md`.
  - CTA "Quiero mi análisis gratis" a WhatsApp 3434163999.
  - Orden: portada → diseños (celulares 3D) → Plan Premium (notebook) → el problema → la cuenta → caso real de Hogar Digital **con el Premium en partes** (`public/casos/hogar-digital/`, vista previa sobre su tienda real) → cómo lo hace → precio con los dos planes → preguntas.
  - Sin el celular de la portada, sin el antes y después deslizable y sin la demo "Urbana" (pedido de Rodrigo, 01/11).
  - Calculadora, testimonio de Marcelo y precio sin tachado.
  - Vista previa de marca al compartir: `public/compartir.jpg`.
- **Página de links:** `nevux.ar/links`, para la bio de Instagram. Miniaturas en `public/links/`. Tiene las tarjetas "Así puede quedar tu tienda" → `nevux.ar/disenos` y "Plan Premium" → `nevux.ar/#premium`.
- **Suscripción:**
  - Planes: Básico $39.900/mes (`mpago.la/2u5gT97`; el viejo `1LqFYin` era pago único y ya está borrado) y **Premium $69.900/mes** (`mpago.la/2mkcebx`, creado el 31/10). Ver `lib/planes.ts` y `docs/clientes.md`.
  - Página de pago: `nevux.ar/suscribirme?c=<cliente>`.
  - Página de gracias: `nevux.ar/gracias`.
  - Mercado Pago: plan Básico `mpago.la/2u5gT97` ($39.900/mes) y plan Premium `mpago.la/2mkcebx` ($69.900/mes).
- **Home Premium · Destino (01/11):** referencia oficial del Premium (`home.destino`). Pedido de Rodrigo: a los clientes Premium nuevos se les deja la home tal cual Destino, con sus productos. **Valmont se queda con el estilo Wess** (decisión de Rodrigo). Ver `docs/disenos.md`.
- **Diseños nuevos (01/11):** Ficha Pro clara y oscura (`estiloFicha: 'pro'`), Home Premium (`home.portadaVideo`, `home.rotador`, `tarjetas.alternar`) y la página `nevux.ar/disenos`. Ver `docs/disenos.md` y `docs/efectos.md`.
- **Motor (`public/nevux.js`)**, con todas las piezas que se configuran por cliente en `lib/clientes.ts`:
  - **Ficha:** packs, precio por transferencia, bloque de precios (`precios`), cuotas reales, entrega estimada, cuenta regresiva, envío gratis, urgencia, avisos de venta, botón fijo, WhatsApp, cinta, talles, antes y después, pasos, comparativa animada, reseñas, preguntas frecuentes, Combiná con, videos, colores, medios de pago (`mediosDePago`), antes vs. después en lista (`problemaSolucion`), ficha oscura con olas (`estiloFicha: 'oscuro'`), ficha estilo Wess (`estiloFicha: 'wess'` con textos en `ficha`), especificaciones, medidor de muñeca (`muneca`), qué incluye (`incluye`) y para regalar (`regalo`).
  - **Home:** portada estilo Wess (`home.portada`), portada de lujo (`home.hero`), beneficios (con íconos de línea si `icono` es `cuotas`, `descuento`, `envio`, `garantia`, `original`, `regalo` o `factura`), categorías, foto con puntos (`home.puntos`), vitrinas (`home.vitrinas`; con `estilo: 'wess'` cuelgan de una barra y avanzan solas), grilla estilo Wess con categorías que giran (`home.grilla`, una o varias), foto con puntos y líneas estilo Wess (`home.puntos` con `estilo: 'wess'`), medidor de reloj en pasos (`home.medidor`), "Colgado por poco tiempo" (`home.colgado`), por qué elegirnos, números, reseñas, preguntas frecuentes, locales y cierre.
  - **Toda la tienda:** pie estilo Wess (`pie`, con `premium.tema: 'wess'`), secciones de la plantilla ocultas (`ocultar`), barra de anuncios que rota (`anuncios`), modo evento con fechas (`evento`: Cyber, Hot Sale, etc.; se prende y se apaga solo), tarjetas de producto (`tarjetas.estilo`: `'destacado'` o `'wess'`) y plan Premium (`premium`: tipografías, entrada animada y `tema: 'wess'`).
- **Cobro automático:** `lib/cobros.ts` (Mercado Pago) y el panel en `nevux.ar/panel?clave=<PANEL_CLAVE>`.

## Clientes

### Hogar Digital (Marcelo) · hogardigital.com.ar · plantilla Brasilia · plan Premium (desde el 01/11) · prendido, cobro manual

- **Premium (01/11):** home tal cual Destino, ver `docs/hogar-digital-premium.md`. Las secciones de Brasilia de la home están ocultas y el banner de la plantilla (donde está el del Cyber) lo tapa la portada Destino.

- **Diseño:** azul #3498db y negro. Tiene barra de anuncios, tarjetas destacadas, comparativa animada, medios de pago, ficha oscura, antes vs. después, foto con puntos del Humidificador OVNI y vitrinas de Humidificadores y Audio.
- **Semana Cyber (2 al 4/11):** modo evento con barra, cuenta regresiva y cinta. Se apaga solo el 4/11 a las 23:59.
- **Banner de Semana Cyber** subido por Rodrigo. **Hay que sacarlo el jueves 5/11:** no se apaga solo.
- **Permisos y contenido:**
  - Dio permiso para su nombre, su foto y su testimonio, que ya están en la landing y en la destacada Clientes.
  - Instagram: @hogardigitaltiendaonline.
- **Pendiente:**
  - Que confirme los descuentos del Cyber, para sumarlos a la barra y la cinta.
  - Que active descuento por transferencia y cuotas sin interés: el bloque de precios aparece solo cuando los tenga.
  - Que se suscriba al Premium (`nevux.ar/suscribirme?c=hogar-digital`, que ahora muestra el Premium) para pasarlo a cobro automático con su email. No usar `planMp`: lo usa Valmont.

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

## Decisiones de Rodrigo (01/11/2026)

- La home **va incluida** en los $39.900 del plan Básico (ya figura en `lib/planes.ts`).
- **Avisos de compra en vivo** (`ventas`, nombres y ciudades de ejemplo sobre productos reales): Rodrigo decidió **dejarlos prendidos** (01/11) porque generan urgencia y confianza. Ya se le avisó del riesgo legal (publicidad engañosa); no volver a planteárselo. Alternativa con datos reales si cambia de idea: pedidos reales de Tiendanube o stock real.
- **3 días de gracia** antes de apagar por falta de pago (`lib/cobros.ts`, valor por defecto, y `gracia: 3` en cada cliente).
- Banner del Cyber de Hogar Digital: el jueves 5/11 Rodrigo vuelve al banner anterior (ya lo tiene anotado).

## Pendientes técnicos

- ~~`www.nevux.ar`~~: agregado en Vercel el 01/11 con redirección 308 a `nevux.ar` (proyecto `nexus2026-gx7e`, DNS en Vercel).
- Windsor en plan de prueba hasta ~29/11: después, publicación manual (no se paga).
- La barra de urgencia "84% vendido" es fija. Rodrigo decidió dejarla.

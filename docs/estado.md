# Estado de Nevux

**Actualizado:** 01/11/2026 (mediodía).

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

## Para retomar en un chat nuevo (actualizado 02/11/2026) ← LEER ESTO PRIMERO

**Sesión anterior:** `session_01PDD9Es5e9V3nkNbyxc3gnr` (rama `ccr-aacae2fe-pg8b5d`, todo mergeado a `main` hasta el PR #97). Leer también `docs/hogar-digital-premium.md`, `docs/referencias/destino.md`, `docs/instagram.md`, `docs/instagram-hogar-digital.md`, `docs/clientes.md` y `docs/valmont.md`.

### Dónde quedamos (lo más urgente)

1. **Actualización 02/11 (noche): la semana del 2 al 8/11 de @nevux.app ya se le pasó entera a Rodrigo**, que la programó en Business Suite. Cambios a pedido suyo ("lo viejo no lo usemos más"):
   - **Miércoles 4/11:** el antes y después viejo se reemplazó por el carrusel **`07-premium/`**, "Dos tiendas, dos estilos Premium". Son capturas reales de hoy de Hogar Digital (Destino) y Valmont (Wess); de Valmont solo partes **sin productos**, porque su catálogo tiene réplicas, y sin etiquetar a @valmont.relojes. Generador: `generar-casos.js`, con `casos.html`, `premium-casos.js` y las capturas en `scripts/instagram/casos/`.
   - **Jueves 5/11:** el Reel de packs dejó de ser "caso real de Hogar Digital" (era el diseño viejo) y pasó a ser un ejemplo genérico, sin "MÁS ELEGIDO".
   - **Sigue:** armar la **semana 2 (9 al 15/11)** de @nevux.app y de Hogar Digital (9 al 13/11), con el informe de la semana 1 si hay métricas. Pasarla igual: día por día, en máxima calidad.

   Lo que sigue es el detalle original:
   Instagram de @nevux.app, semana del lunes 2 al domingo 8/11: Rodrigo lo está programando a mano en Meta Business Suite, día por día. Ya se le pasó el **lunes 2/11** (historias `1102-1/2/3` + Reel `reels/precio.mp4` + descripción de `reels/precio.txt`). **Sigue el martes 3/11.** Forma de trabajo (pedido de Rodrigo): mandarle con SendUserFile, en orden, primero las 3 historias del día con su horario y el sticker que conviene (encuesta, link, etc.), después el post (las imágenes del carrusel en orden, o el Reel) y la descripción en un bloque para copiar. Esperar su "listo" antes de pasar al día siguiente.

   | Día | Historias (9:47 · 13:17 · 20:17) | Post 19:30 | Descripción |
   |---|---|---|---|
   | Mar 3/11 | `historias/1103-1..3` | Carrusel `04-que-hace-nevux/1..7.jpg` | `04-que-hace-nevux/caption.txt` |
   | Mié 4/11 | `1104-1..3` | Carrusel `07-premium/1..7.jpg` | `07-premium/caption.txt` |
   | Jue 5/11 | `1105-1..3` | Reel `reels/packs.mp4` | `reels/packs.txt` |
   | Vie 6/11 | `1106-1..3` | Carrusel `05-como-trabajamos/1..7.jpg` | `05-como-trabajamos/caption.txt` |
   | Sáb 7/11 | `1107-1..3` | Reel `reels/envio.mp4` | `reels/envio.txt` |
   | Dom 8/11 | `1108-1..3` | Carrusel `06-checklist/1..7.jpg` | `06-checklist/caption.txt` |

   Todo está en `public/ig/`, en máxima calidad (JPG al 97 % 4:4:4; Reels con CRF 14 y la **portada integrada como primer cuadro**, así Rodrigo no carga miniatura). Los Reels se suben como Reel con "Compartir también en el feed".
2. **No se programa ni se publica nada desde Claude** (pedido de Rodrigo, 02/11). Las 8 tareas de publicación (4 de @nevux.app y 4 de Hogar Digital) están **apagadas** (`enabled: false`, no borradas). Queda prendida la tarea del **sábado 7/11, 12:00** (informe de la semana 1 y armado de la semana 2) en la sesión `session_01PDD9EtCY9JFJzsoyimb9Yn`. **Esa sesión se traba esperando permiso para Windsor y tiene el contexto casi lleno:** conviene hacer el informe y la semana 2 desde el chat nuevo y apagar esa tarea. Ahí quedaron pedidos de Windsor pendientes del 01/11: **no aprobarlos**, porque duplicarían posts que ya salieron.
3. **Hogar Digital (Marcelo): tienda APAGADA** (`activo: false`) hasta que pague el **Premium el 10/11**. Link de pago: `nevux.ar/suscribirme?c=hogar-digital` ($69.900/mes, `mpago.la/2mkcebx`). Cuando pague: `activo: true` y `cobro: { tipo: 'mercadopago', email: '<su email>', gracia: 3 }` (no `planMp`: lo usa Valmont). La configuración Premium tal cual Destino ya está en `lib/clientes.ts`, en azul: home, ficha (`estiloFicha: 'destino'`), cabecera y pie (`premium.tema: 'destino'`), comunidad con cuadros de sus Reels, local en Belgrano 276 (Campana, lunes a sábado de 8 a 21 h) y números (+35 años, +300 ventas en 2026, +800 calificaciones en Mercado Libre, 1 local).
4. **Instagram de Hogar Digital, semana 2 al 6/11:** ya se le pasó entera a Rodrigo y la programó. Para el 9 al 13/11, armar la semana 2 y pasársela igual.

### Reglas que se hablaron en esta sesión (no reabrir)

- **Reseñas:** Rodrigo pidió inventar reseñas, cifras y fotos de clientes, y se le dijo que no. Después mandó 2 tandas de "testimonios de WhatsApp" con señales de ser armados (las mismas 8 ciudades en el mismo orden con nombres distintos, una hora "18:99", la misma reseña en horarios distintos). **No se publicaron y no se publican.** La sección de reseñas está lista en el motor: se prende solo con reseñas verificables (captura del panel de Tiendanube, Mercado Libre citado como tal, Google).
- **All Time (alltimerelojes.com):** vende "Superclones AAA" de Rolex, Omega, etc. y no es Tiendanube. Se le dijo a Rodrigo que no se trabaja con réplicas (es su regla).
- Para Hogar Digital: nada de "el más elegido" sin confirmarlo. La historia `1103-2` lo decía y había que confirmarlo con Marcelo.

### Otros pendientes

- **Valmont (Miguel):** paga el Premium entre el 5 y el 7/11 → cambiar `planMp` por su email y sumarla como segundo caso real en la landing y en `nevux.ar/links`.
- **Jueves 5/11:** Rodrigo vuelve a poner el banner anterior de Hogar Digital, en lugar del de Cyber.
- **Windsor:** la prueba vence ~29/11; hay un aviso el 23/11 (en `session_01PDD9EpeUFqobvhnuTnY9ML`). Igual ya no se usa para publicar.
- **Motor (`public/nevux.js`), opciones nuevas del 01/11:**
  - `premium: { tema: 'destino' }` + `cabecera: { logo, logoClaro, nombre }`: cabecera flotante y pie negro;
  - `estiloFicha: 'destino'` + `fichaDestino: { sello, confianza, faq }`;
  - `home.destino.comunidad`: historias 9:16;
  - `home.destino.locales` con un solo local: mapa a la izquierda en computadora;
  - "Encontrá lo tuyo" queda fijo al bajar.

  Ver `docs/disenos.md`.

## Para retomar en un chat nuevo (versión del 01/11/2026, mediodía; histórico)

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

> **03/11 · LANDING, PLAN PREMIUM:** la demo genérica de la notebook se reemplazó por **dos videos: Hogar Digital (real) y una tienda demo**. Valmont se sacó porque Rodrigo quería mostrar sus relojes y son réplicas: no se muestran (decisión firme). Cada video recorre la home, toca un producto y muestra la ficha Premium por dentro; la ficha demo es `public/demo/disenos/ficha-destino.html`, generada por `scripts/demo/disenos.py`. Antes había, en `public/casos/premium/`: Hogar Digital completa, bajando sola, y Valmont con portada, "Por qué Valmont", preguntas y cierre. En el de Valmont **no se ve ningún producto** (tiene réplicas) y la sección "Colgado por poco tiempo" se ocultó durante la grabación. Componente: `app/components/landing/NotebookVideo.tsx`. Para regrabar: Playwright con CDP screencast a 1440×900 y la configuración inyectada; el guion de cada video está en la sesión del 03/11. El botón pasó a ser "Quiero el Premium" (`/suscribirme?plan=premium`).
>
> **03/11 · COBRO AUTOMÁTICO PARA TODOS (pedido de Rodrigo):** Hogar Digital y Valmont tienen `planPropio` (ver `docs/clientes.md`). Cada uno paga en su link (`nevux.ar/suscribirme?c=hogar-digital` y `?c=valmont`), se crea su propio plan en Mercado Pago y **la tienda se prende sola al pagar**: ya no hay que pasar emails ni prender a mano. Los clientes nuevos se dan de alta igual. Hasta que paguen, quedan apagadas.
>
> **02/11 · INSTAGRAM, TODO A MANO:** Rodrigo pidió que no se programe más nada desde acá, ni @nevux.app ni Hogar Digital. Las 8 tareas de publicación quedaron apagadas. Se crea el contenido y se le pasa día por día, en máxima calidad, con la portada integrada en los Reels (ver `docs/instagram.md`).
>
> **01/11 (noche) · INSTAGRAM DE HOGAR DIGITAL A MANO:** Rodrigo programa los posts en Business Suite. Las tareas automáticas de Hogar Digital están apagadas; ver `docs/instagram-hogar-digital.md`. La sesión `session_01PDD9EtCY9JFJzsoyimb9Yn`, donde corren las tareas de @nevux.app, **se traba esperando permiso para Windsor** y tiene el contexto casi lleno: el 01/11 se publicaron desde otra sesión el carrusel "La cuenta que nadie hace" y la historia de las 20:17, y sus pedidos pendientes **no hay que aprobarlos** porque duplicarían. Conviene mover esas tareas a una sesión nueva.
>
> **01/11 (noche) · TIENDA DE MARCELO APAGADA (`activo: false`)** a pedido de Rodrigo, hasta que pague el Premium el **10/11**. Link de pago: `nevux.ar/suscribirme?c=hogar-digital` ($69.900/mes, `mpago.la/2mkcebx`). Cuando pague: `activo: true` y `cobro: { tipo: 'mercadopago', email: '<su email>', gracia: 3 }`. La configuración Premium queda guardada tal cual.
>
> **01/11 (noche) · PUBLICADO: Hogar Digital con el Premium tal cual Destino, en azul** (pedido de Rodrigo: "mandale hasta que quede completo al 100% como Destino"). Home y ficha de producto con las medidas reales de Destino (`docs/referencias/destino.md`). Detalle y lo que falta en `docs/hogar-digital-premium.md`.
> **Lo que sigue:** Rodrigo lo revisa y le avisa a Marcelo. **Si Marcelo da el ok → apagarla (`activo: false` en `lib/clientes.ts`, hogar-digital) hasta el 10/11, que cobra y paga.** Cuando pague el Premium (`nevux.ar/suscribirme?c=hogar-digital`) → `activo: true` y `cobro: { tipo: 'mercadopago', email: '<su email>', gracia: 3 }` (no `planMp`: lo usa Valmont). Local de Campana publicado (falta el horario). Reseñas en espera de verificación (ver `docs/hogar-digital-premium.md`). Faltan de Marcelo: reseñas verificables con producto y foto, si tiene local con atención al público, envío gratis desde algún monto y videos verticales limpios para la portada.
>
> **INTENTO DEL 01/11 (tarde), REVERTIDO:** se prendió la home Destino en la tienda de Marcelo (PR #87) y Rodrigo dijo que **"no se parece nada a la tienda de Destino"**. Se revirtió (Marcelo vuelve a su home anterior y al plan Básico). Por qué no se parecía, comparando con `docs/referencias/img/destino-*.jpg`:
> 1. **Cabecera y pie** seguían siendo los de Brasilia (barra azul, buscador ancho, menú azul, pie azul). Destino: cabecera blanca con el logo grande y la lupa roja, cinta debajo y pie negro.
> 2. **Portada:** foto gigante de producto sobre fondo negro y título en 3 renglones. Destino: video de gente real, título mediano.
> 3. **Fotos:** renders con fondo negro (quedan como cajas oscuras en la tira y las tarjetas). Destino: prendas recortadas sobre gris claro y fotos de gente en "Arma tu outfit".
> 4. **Faltaban 4 secciones** (comunidad, números, reseñas y locales) por no tener datos reales: la home quedaba corta.
> 5. **Colores:** el azul de Brasilia mezclado con la base blanca y negra de Destino.
>
> **Plan acordado con Rodrigo:** (a) en el motor, **cabecera blanca y pie negro estilo Destino** para todos los clientes Premium; (b) portada con video de persona o ambiente; (c) fotos recortadas sobre gris claro para la tira y las tarjetas; (d) pedirle a Marcelo material real para comunidad, números y reseñas. Recién después volver a prenderlo, **mostrándole capturas a Rodrigo antes de publicar**. La configuración del intento está en el commit `b0aa694` (y el clip real del Parlante RGB, sacado de su Reel `DcRbx7esRZI`, en `public/clientes/hogar-digital/parlante-rgb.mp4` de ese commit). Sus otros Reels no sirven para la portada: tienen texto o marca de agua, están en horizontal o muestran productos que no vende.
>
> **LO QUE SIGUE (pedido de Rodrigo, 01/11): pasar a Marcelo (Hogar Digital) al plan Premium.**
> El Premium se arma **tal cual la tienda Destino** (`destinoclothes.mitiendanube.com`, ver `docs/referencias/destino.md`): mismas secciones, mismo orden, mismos diseños y **mismos efectos** que prometemos en el plan (`lib/planes.ts`, la landing y `nevux.ar/disenos`). **Nada inventado**: no agregar secciones ni efectos que no estén en Destino o en el plan, y solo con datos reales de su tienda. Partir de `docs/hogar-digital-premium.md` (ya probado en su tienda) y completar lo que falte de Destino con material real de Marcelo (videos, fotos, reseñas, números) si lo tiene.

1. **Contestarle a Marcelo** (preguntó si debe algo, cuánto sale por mes y las fechas de pago). Hay un borrador en el chat del 01/11 que espera dos datos de Rodrigo: **si Marcelo ya pagó algo** (plan o Instagram de noviembre) y **cómo cobra el Instagram** ($85.000/mes: aparte por transferencia o junto). Totales: Básico + Instagram **$124.900/mes**; Premium + Instagram **$154.900/mes**. La suscripción de Mercado Pago se debita sola el mismo día de cada mes en que se suscribe. Links: Básico `nevux.ar/suscribirme?c=hogar-digital`, Premium `nevux.ar/suscribirme?plan=premium`.
2. **Si Marcelo elige el Premium:** en `lib/clientes.ts` (hogar-digital) poner `plan: 'premium'`, pasar a cobro automático con su email y activar `home.destino` + `home.rotador` con la configuración ya probada en su tienda (**`docs/hogar-digital-premium.md`**: cinta azul `#3498db`, portada con el OVNI, beneficios reales, tira de categorías, destacados de humidificadores y audio, preguntas y banner "Tu rincón relax"; sin comunidad, números ni reseñas porque no tiene reales). Probar con Playwright y una compra real antes de dejarlo.
3. **Si se queda en Básico:** proponerle la **Ficha Pro** (hoy tiene `estiloFicha: 'oscuro'`) y prenderla con su ok.
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

## Decisiones de Rodrigo (01/11/2026)

- La home **va incluida** en los $39.900 del plan Básico (ya figura en `lib/planes.ts`).
- **Avisos de compra en vivo** (`ventas`, nombres y ciudades de ejemplo sobre productos reales): Rodrigo decidió **dejarlos prendidos** (01/11) porque generan urgencia y confianza. Ya se le avisó del riesgo legal (publicidad engañosa); no volver a planteárselo. Alternativa con datos reales si cambia de idea: pedidos reales de Tiendanube o stock real.
- **3 días de gracia** antes de apagar por falta de pago (`lib/cobros.ts`, valor por defecto, y `gracia: 3` en cada cliente).
- Banner del Cyber de Hogar Digital: el jueves 5/11 Rodrigo vuelve al banner anterior (ya lo tiene anotado).

## Pendientes técnicos

- ~~`www.nevux.ar`~~: agregado en Vercel el 01/11 con redirección 308 a `nevux.ar` (proyecto `nexus2026-gx7e`, DNS en Vercel).
- Windsor en plan de prueba hasta ~29/11: después, publicación manual (no se paga).
- La barra de urgencia "84% vendido" es fija. Rodrigo decidió dejarla.

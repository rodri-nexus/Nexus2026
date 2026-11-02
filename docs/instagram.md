# Instagram @nevux.app

Plan armado el 30/10/2026 con la clase 5 del curso (redes, ganchos de 3 segundos, canales de venta) y las clases 1 a 4 (propuesta de valor, motivadores, SPIN y objeciones).

## Diagnóstico (30/10/2026)

- 609 seguidores, **0 publicaciones**, bio vacía, link `http://nevux.ar`.
- Entre el 16 y el 21/10 entraron ~670 seguidores con un alcance diario de 3 a 35 cuentas. Ese patrón no es orgánico. Instagram tiene datos demográficos de solo 12 seguidores (todos de Argentina).
- 0 toques al link del perfil en 30 días.

**Conclusión:** el perfil no convence a quien entra. Primero hay que armar la base (bio, 3 publicaciones fijadas y destacadas) y después generar alcance real. **No comprar seguidores:** bajan el alcance, porque Instagram muestra cada publicación primero a seguidores que nunca interactúan.

## El core (clase 5)

> Ayudo a dueños de tiendas en Tiendanube que tienen visitas pero pocas ventas a vender más con el tráfico que ya tienen, transformando sus fichas de producto. No hablo de conseguir más seguidores ni más anuncios: hablo de lo que pasa después del clic.

- **Cliente ideal:** dueño o dueña de una tienda en Tiendanube (indumentaria, hogar, tecnología, mascotas, cosmética), de 25 a 45 años, que ya vende online y paga anuncios o publica en redes.
- **Motivador principal:** dolor (pagar visitas que no compran). Le siguen la ganancia (más ventas con lo mismo) y la identidad (una tienda que se ve profesional).
- **Canales de venta:** landing (nevux.ar) + WhatsApp. Cada publicación lleva a uno de los dos.
- **Recorrido:** publicación → comentario o mensaje privado → análisis gratis por WhatsApp → suscripción.

## Perfil (lo cambia Rodrigo: Instagram no deja editarlo desde afuera)

**Nombre** (aparece en las búsquedas): `Nevux | Fichas que venden en Tiendanube`

**Bio** (150 caracteres como máximo):
```
Tu Tiendanube tiene visitas. Hacemos que compren 🛒
Fichas de producto que venden · Sin apps
👇 Análisis gratis de tu tienda
```

**Link:** `https://nevux.ar`, con el título "Análisis gratis".

**Botones:** activar "Enviar mensaje" y WhatsApp (3434163999) en Editar perfil → Opciones de contacto. Categoría: "Servicio de marketing digital" o "Diseño web".

**Historias destacadas.** Las portadas están en `public/ig/destacadas/` y las historias de adentro en `public/ig/historias/d-*.jpg` (contenido: `scripts/instagram/destacadas.js`). Se publicaron el 30/10, así que quedan en el archivo de historias para armar cada destacada:

| Destacada | Portada | Qué va adentro |
|---|---|---|
| Qué es | `que-es.jpg` | Qué hace Nevux en 3 historias + link a la landing |
| Antes/Después | `antes-despues.jpg` | Fichas antes y después (con permiso del cliente) |
| Precio | `precio.jpg` | $39.900/mes, qué incluye, garantía de 7 días, cancelás cuando quieras |
| Clientes | `clientes.jpg` | Testimonios y capturas de mensajes reales (con permiso) |
| Preguntas | `preguntas.jpg` | Las objeciones de la landing: precio, tiempo, confianza, necesidad |

## Pilares de contenido

| Pilar | Formato | Para qué (lo que prioriza Instagram) | % |
|---|---|---|---|
| **Errores y arreglos de la ficha** | Carrusel | Guardados y compartidos | 35% |
| **Análisis en vivo** ("Analizo tu ficha") | Reel con la cara de Rodrigo | Alcance a no seguidores y comentarios | 30% |
| **Números y cuentas** | Carrusel o Reel | Guardados; despierta el problema | 15% |
| **Antes/después y casos** | Carrusel | Confianza (prueba social) | 10% |
| **Detrás de escena** | Historias y algún Reel | Confianza en la persona (efecto aura) | 10% |

**Regla de todo el contenido:** cada publicación resuelve **un** problema concreto y termina con **una** acción ("Comentá FICHA", "Escribí ANÁLISIS", "Link en el perfil"). Nunca datos inventados: lo mismo que en la landing.

## Desde el 02/11: Rodrigo publica a mano en Business Suite (pedido de Rodrigo)

**No se programa ni se publica más nada desde Claude.** Las tareas automáticas de @nevux.app y de Hogar Digital quedaron apagadas (`enabled: false`). Se crea el contenido y se le pasa a Rodrigo **día por día, en orden**: primero las historias del día (con el horario y el sticker que conviene agregar), después el post (las imágenes del carrusel en orden, o el Reel) y la descripción lista para copiar.
- **Calidad máxima:** carruseles e historias se capturan en PNG y se exportan a JPG al 97 % con color completo (`generar.js`). Los Reels salen de cuadros PNG, con H.264 CRF 14 `tune animation` y audio AAC a 192 kbps (`generar-reels.js` y `audio.py`).
- **Portada integrada en los Reels:** el primer cuadro del video es la portada (`PRE_PORTADA`, 2 cuadros por defecto), así Business Suite la toma sola como miniatura. `narrar.py` corre la voz lo mismo.

## Frecuencia y horarios (todo programado, hora de Argentina)

| Hora | Qué | Archivo |
|---|---|---|
| 9:47 | Historia 1: pregunta o juego (SÍ/NO, A o B, "contame") | `public/ig/historias/MMDD-1.jpg` |
| 13:17 | Historia 2: concepto de psicología de venta, tip o número | `public/ig/historias/MMDD-2.jpg` |
| **19:30** | **Post del feed todos los días**: carrusel o Reel | `public/ig/agenda.json` |
| 20:17 | Historia 3: aviso de lo que se publicó a las 19:30 | `public/ig/historias/MMDD-3.jpg` |

Las tareas programadas de esta sesión leen `agenda.json` y los archivos de historias en nevux.ar. Para cargar otra semana alcanza con sumar fechas a la agenda y las historias nuevas.

Lo que no se puede programar desde afuera de la app (lo hace Rodrigo): encuestas, cajas de preguntas, stickers de link y música en los Reels.

**Respuesta:** contestar todos los comentarios y mensajes en la primera hora. Es lo que más empuja el alcance de una cuenta chica.

## Calendario: semana 1 (30/10 al 6/11)

| Día | 19:30 | Pieza | Historias (9:47 · 13:17 · 20:17) |
|---|---|---|---|
| Vie 30/10 | Carrusel (8) | 5 errores de la ficha → **fijar** | · · · Nuevo post |
| Sáb 31/10 | **Reel** (17 s) | Qué hace Nevux: el antes y después animado | ¿Visitas pero vende poco? · Sistema 1 · Nuevo reel |
| Dom 1/11 | Carrusel (6) | La cuenta que nadie hace → **fijar** | Mito: más seguidores · +15 ventas · Nuevo post |
| Lun 2/11 | **Reel** (15 s) | Tu mejor precio está escondido | ¿Cuál vende más? A o B · Decí cuándo llega · La respuesta en el reel |
| Mar 3/11 | Carrusel (7) | Qué hace Nevux en tu tienda → **fijar** | Respuesta: la B · Anclaje · Nuevo post |
| Mié 4/11 | Carrusel (5) | Mismo producto, otra ficha | ¿Qué te frena? · Hoy 19:30 · Nuevo post |
| Jue 5/11 | **Reel** (16 s) | La misma visita puede valer el doble (packs) | Mito: urgencia falsa · Prueba social · Nuevo reel |
| Vie 6/11 | Carrusel (7) | Cómo es trabajar con Nevux (pasos + objeciones) | Análisis gratis · Hoy 19:30 · Nuevo post |

**Fijados arriba del perfil:** 5 errores, Qué hace Nevux y La cuenta. Explican el problema, la solución y el número.

**Reels animados:** los arma `scripts/instagram/generar-reels.js` a partir de `reel.html`, y `scripts/instagram/narrar.py` les pone la voz de Tomás y la música de fondo (propia; la API no permite sumar música de Instagram). Los Reels con la cara de Rodrigo (guiones de abajo) suman confianza y alcance: conviene grabar uno por semana desde la semana 2.

## Guiones de Reels (para grabar con el celular, de 20 a 35 segundos)

El primer segundo decide si el Reel vive. Cada guion tiene los tres ganchos de la clase 5: lo que se ve, lo que se lee y lo que se escucha.

### Reel 1: "Tu ficha esconde tu mejor precio"
- **Visual (0–1 s):** zoom rápido sobre el celular, al "10% OFF con transferencia" en letra chiquita.
- **Texto en pantalla:** "TU MEJOR PRECIO ESTÁ ESCONDIDO" (grande, arriba).
- **Diálogo:** "Si tu tienda tiene descuento por transferencia y lo mostrás así de chiquito… estás perdiendo ventas. Mirá."
- **Desarrollo (5–25 s):** pantalla dividida, antes y después: el precio por transferencia grande, "Ahorrás $4.500". "La persona decide en segundos. Si no ve el ahorro, no existe."
- **Cierre:** "Comentá FICHA y te digo qué más le falta a la tuya."

### Reel 2: "Analizo la ficha de un seguidor" (serie semanal)
- **Visual (0–1 s):** Rodrigo mirando el celular, cara de sorpresa, con la ficha de un seguidor al costado (con su permiso).
- **Texto en pantalla:** "ANALIZO TU TIENDA EN 30 SEGUNDOS · #1".
- **Diálogo:** "Me pidieron que analice esta ficha. Tiene 3 cosas que le están costando ventas."
- **Desarrollo:** 3 puntos rápidos, señalando la pantalla.
- **Cierre:** "¿Querés que analice la tuya? Comentá FICHA."
- Es el formato que más comentarios y clientes trae: cada capítulo es un análisis gratis en público, y Rodrigo se ve como el que sabe.

### Reel 3: "No necesitás más seguidores"
- **Visual:** texto tachado, "MÁS SEGUIDORES", que cambia a "UNA FICHA QUE VENDA".
- **Diálogo (provocación):** "Todos te dicen que necesitás más seguidores. Mentira. Si 3.000 personas entran a tu tienda y compran 30, el problema no es cuánta gente entra."
- **Cierre:** "La cuenta completa está en mi perfil."

## Comentarios y mensajes: guion para cerrar (SPIN de la clase 4)

Cuando alguien comenta **FICHA** o escribe **ANÁLISIS**:

1. **Responder el comentario en público:** "¡Te escribo por privado! 🙌". Suma interacción y muestra que se responde.
2. **Mensaje privado:** "¡Hola! Gracias por escribir. ¿Me pasás el link de tu tienda? Te digo qué cambiaría en tu ficha."
3. **Situación:** "¿Hace cuánto vendés por Tiendanube? ¿Más o menos cuántas visitas tenés por mes?"
4. **Problema:** "¿Qué sentís que pasa? ¿Entran y no compran, o compran de a uno?"
5. **Implicación:** "Si de cada 100 visitas comprara 1 más, ¿cuánto sería eso por mes con tu ticket?" (se puede mandar el link de la calculadora).
6. **Necesidad:** "¿Qué cambiaría para vos si la ficha vendiera más con las mismas visitas?"
7. **Análisis:** 3 cosas concretas de su ficha, como regalo (reciprocidad).
8. **Oferta y cierre de alternativa:** "Esto lo dejamos funcionando en tu tienda sin que toques nada. ¿Arrancamos con la prueba en una ficha tuya o preferís ver primero el antes y después de otro cliente?"
9. **Objeciones:** las 4 respuestas de la landing ("Es caro", "No tengo tiempo", "¿Y si no funciona?", "Ya vendo bien").

## Rutina diaria de crecimiento (20 minutos, la hace Rodrigo)

1. **10 comentarios de valor** en publicaciones de tiendas en Tiendanube, de emprendedores y de cuentas de e-commerce argentino. Un aporte real, nunca "¡Buenísimo!" ni links.
2. **Responder** todo lo pendiente: comentarios, mensajes y respuestas a historias.
3. **Historias del día.**
4. **Seguir a 5 a 10 tiendas del cliente ideal** e interactuar con sus historias. Nada de "seguir para que te sigan" masivo.
5. Una vez por semana: **pasar los Reels a TikTok y Facebook** (clase 5: el mismo video llega a otro público).

## Métricas que importan (las leo cada semana desde Windsor)

| Métrica | Por qué | Meta del primer mes |
|---|---|---|
| Alcance de no seguidores | Gente nueva que te descubre | En aumento semana a semana |
| Guardados y compartidos | Lo que más empuja Instagram | Más de 5% del alcance en carruseles |
| Seguidores nuevos por publicación | Qué contenido trae seguidores | Identificar el pilar que más suma |
| Toques al link y mensajes "FICHA" | Conversaciones de venta | Al menos 1 por semana |
| Análisis hechos → clientes | Lo que importa de verdad | Primer cliente que llega por Instagram |

## Archivos

- Piezas listas: `public/ig/<publicación>/<n>.jpg` + `caption.txt`. Se publican desde `https://nevux.ar/ig/...`.
- Para crear o cambiar piezas: editar `scripts/instagram/semana-N.js` y correr `node scripts/instagram/generar.js semana-N`.

## Si vence Windsor (prueba hasta ~29/11; Rodrigo decidió no pagar)

Rodrigo publica a mano desde la app de Instagram, programando cada pieza. Se le pasa el contenido **paso a paso y ordenado, nunca todo junto**:

1. **Primero @nevux.app**, día por día: las 3 historias (imagen y hora), después el post o Reel del día (archivo, portada y el texto para pegar, desde `caption.txt` o `reels/<nombre>.txt`).
2. **Recién cuando termina con su cuenta, Hogar Digital**, con el mismo orden.
3. Antes, apagar las tareas programadas de publicación (`update_trigger enabled=false`) para que no fallen.

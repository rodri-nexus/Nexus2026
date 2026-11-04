# Landing (nevux.ar)

El código está en `app/components/landing/`: `Landing.tsx` (cabecera, portada, barra del celular y orden de las secciones), `secciones.tsx` (caso real, problema, diseños y qué hace), `oferta.tsx` (la cuenta, cómo funciona, comparativa, planes, quién lo hace, preguntas, cierre y pie), `cta.tsx` (botones, links de WhatsApp y de pago, textos compartidos) y `fx.tsx` (movimiento: `Reveal`, `Tilt`, `LazyVideo`, `Glow`, `CountUp`). Los efectos de botones (`nvx-shine`, `nvx-press`) están en `app/globals.css`.

**Regla:** todo dato es real o es una cuenta que hace el visitante con sus números. Nada de precios tachados ni testimonios inventados. Nunca productos ni marca de Valmont: los relojes de las demos dicen "NEVUX" (`scripts/demo/relojes/relojes.js public/demo/disenos/img NEVUX`).

**Rediseño del 03/11/2026, terminado en 3 tandas.** Orden:

| # | Sección | Para qué |
|---|---|---|
| 1 | Cabecera + portada: "No te faltan visitas. Te faltan ventas.", notebook y celular en 3D | Qué es en 5 segundos, el "wow" y los dos botones (análisis gratis y Premium) |
| 3 | Caso real `#premium`: Hogar Digital (video, testimonio de Marcelo, 6 capturas) + tienda demo | Prueba real arriba, en un solo lugar |
| 4 | El problema `#problema` | Reconocer el dolor y las tres preguntas |
| 5 | Diseños `#disenos` (celulares 3D) | Ver cómo puede quedar, Básico contra Premium |
| 6 | Qué hace `#que-hace` (22 piezas con ejemplos animados) | El mecanismo, con datos reales |
| 7 | La cuenta `#cuenta` (calculadora con selector Básico/Premium y número que sube) | Cuánto le deja, con sus números |
| 8 | Cómo funciona `#como-funciona` (3 pasos con línea que se dibuja + 4 dudas de instalación) | Quitar el miedo a instalar |
| 9 | Comparativa con las alternativas | Por qué Nevux y no apps sueltas o rediseñar |
| 10 | Planes `#precio` (2 tarjetas, "¿Cuál me conviene?", cómo se paga, tabla Básico contra Premium, sello de garantía) | Elegir plan |
| 11 | Quién lo hace `#quien` (Rodrigo, sin foto por ahora: `FOTO_RODRIGO` en `oferta.tsx`) | Saber que hay una persona |
| 12 | Preguntas `#preguntas`, agrupadas en Instalación, Planes y pago, Resultados y Garantía | Objeciones |
| 13 | Cierre con los dos botones y pie de página ordenado | Acción |

Movimiento: todo se apaga con `prefers-reduced-motion` (`MotionConfig` en `Landing.tsx`) y los videos se descargan recién cuando aparecen en pantalla.

**Fluidez (03/11, Rodrigo la sentía pesada):**
- Nada de `filter: blur()` animado ni círculos con `blur-[150px]`: las luces de fondo son degradés (`Glow`).
- Solo se animan `transform` y `opacity` (la barra de envío usa `scaleX`, la ficha del celular de la portada usa `translateY`).
- Sin `backdrop-blur` en el celular (cabecera y barra de abajo) y grano sin `mix-blend-mode`.
- En pantallas táctiles no hay inclinación por dedo; solo la del scroll.
- Vitrina de celulares (`app/disenos/Vitrina.tsx`): solo baja el del centro y solo mientras se ve.
- Videos: en pantallas de hasta 768 px se carga `<nombre>-m.mp4` (768 px, ~60% menos). Si se regraba un video, regenerar la versión liviana: `ffmpeg -i X.mp4 -vf "scale=768:-2,fps=24" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -an X-m.mp4`.

## Cómo cambiar cosas

- **Testimonio:** el de Marcelo está en `MARCELO` (`secciones.tsx`), con su permiso. Nuevos testimonios, solo reales y con permiso.
- **Precios:** salen de `lib/planes.ts` (`PRECIO` = Básico). No escribirlos a mano.
- **WhatsApp:** `WHATSAPP_URL` en `cta.tsx`. Cada clic se registra como `Contact` en Meta y `generate_lead` en GA4, con el origen del botón (`header`, `hero`, `caso`, `disenos`, `como-funciona`, `precio`, `preguntas`, `cierre`, `footer`, `barra-mobile`).

## Para confirmar con Rodrigo

- "¿Necesitan mi contraseña?" → "No. La línea la pegás vos desde tu panel, con nuestra guía." (está en cómo funciona y en preguntas).
- Foto para "Quién lo hace": cuando la mande, `public/landing/rodrigo.jpg` y `FOTO_RODRIGO` en `oferta.tsx`.
- Sin plazo ni días de devolución ni factura: no se prometen hasta que Rodrigo los confirme.

# Landing (nevux.ar)

El código está en `app/components/landing/`: `Landing.tsx` (página y secciones 7 en adelante), `secciones.tsx` (caso real, problema, diseños y qué hace), `cta.tsx` (botones, links de WhatsApp y de pago, textos compartidos) y `fx.tsx` (movimiento: `Reveal`, `Tilt`, `LazyVideo`). Los efectos de botones (`nvx-shine`, `nvx-press`) están en `app/globals.css`.

**Regla:** todo dato es real o es una cuenta que hace el visitante con sus números. Nada de precios tachados ni testimonios inventados. Nunca productos ni marca de Valmont: los relojes de las demos dicen "NEVUX" (`scripts/demo/relojes/relojes.js public/demo/disenos/img NEVUX`).

**Rediseño en curso (03/11/2026), en 3 tandas.** Orden actual:

| # | Sección | Para qué |
|---|---|---|
| 1 | Cabecera + portada: "No te faltan visitas. Te faltan ventas.", notebook y celular en 3D | Qué es en 5 segundos, el "wow" y los dos botones (análisis gratis y Premium) |
| 3 | Caso real `#premium`: Hogar Digital (video, testimonio de Marcelo, 6 capturas) + tienda demo | Prueba real arriba, en un solo lugar |
| 4 | El problema `#problema` | Reconocer el dolor y las tres preguntas |
| 5 | Diseños `#disenos` (celulares 3D) | Ver cómo puede quedar, Básico contra Premium |
| 6 | Qué hace `#que-hace` (22 piezas con ejemplos animados) | El mecanismo, con datos reales |
| 7 en adelante | La cuenta, comparativa, cómo trabajamos, confianza, planes, preguntas y cierre | Todavía con el diseño anterior (tandas 2 y 3) |

Movimiento: todo se apaga con `prefers-reduced-motion` y los videos se descargan recién cuando aparecen en pantalla.

## Cómo cambiar cosas

- **Testimonio:** el de Marcelo está en `MARCELO` (`secciones.tsx`), con su permiso. Nuevos testimonios, solo reales y con permiso.
- **Precios:** salen de `lib/planes.ts` (`PRECIO` = Básico). No escribirlos a mano.
- **WhatsApp:** `WHATSAPP_URL` en `cta.tsx`. Cada clic se registra como `Contact` en Meta y `generate_lead` en GA4, con el origen del botón (`header`, `hero`, `caso`, `disenos`, `precio`, `cierre`, `footer`, `barra-mobile`).

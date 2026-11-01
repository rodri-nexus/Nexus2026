# Destino Clothes · home Premium de Praxis (video 4, 01/11/2026)

- **Qué es:** TikTok de 29 s que mandó Rodrigo ("Creación de 0 y rediseño de webs en Tiendanube"). Un desarrollador muestra en la compu la tienda **destinoclothes.mitiendanube.com** (ropa urbana, CABA) y dice que es Tiendanube sin apps, "hecho con programación".
- **Pedido de Rodrigo:** "Si me piden el Premium, quiero dejárselo **tal cual** como está en el video, con lo que vende cada tienda". Es la **referencia oficial del plan Premium**.
- **Medido en vivo el 01/11** (celular de 390 px y computadora de 1440 px). Plantilla **Recife** (la misma de Valmont) + script de Praxis (`c0j9zv.praxis-estudio.pages.dev`). Alto de la home: ~9.800 px.
- **Capturas:** `img/destino-pc.jpg` (computadora, de arriba abajo) e `img/destino-cel.jpg` (celular).

## Estilo

- Blanco y negro, con **rojo** como único acento (palabras clave, etiquetas de descuento, "con transferencia", lupa).
- Títulos en mayúsculas, anchos y gruesos (tipo grotesca extendida). Etiquetas chiquitas arriba de cada título ("OFERTAS · STOCK LIMITADO", "COMUNIDAD 👻", "NUESTRA COMUNIDAD").
- Tarjetas grises muy claras, esquinas redondeadas y botones negros en pastilla.

## Secciones de la home, de arriba abajo

1. **Cabecera** de la plantilla (logo, lupa roja, carrito) y menú en fila en computadora.
2. **Cinta de anuncios corriendo** (38 s por vuelta). Cada frase tiene la parte clave en rojo: "ENVÍO GRATIS + **2 PRENDAS**", "3 Y 6 CUOTAS **SIN INTERÉS**", "-15% OFF **TRANSFERENCIA**", "CAMBIOS **FÁCILES**".
3. **Portada en video a pantalla completa**: pastilla "DESTINO™ · HECHO EN ARGENTINA", título gigante "NO ES SOLO ROPA.", una línea, "Es una forma de expresarte." y dos botones con borde en pastilla ("VER NUEVOS", "ARMAR OUTFIT"). En computadora, a la derecha, **3 tarjetitas de producto flotando** (foto, nombre, precio, ›).
4. **Beneficios en tarjetas** (2×2 en celular, 4 en fila en computadora): "15% OFF pagando con transferencia", "3 y 6 cuotas sin interés", "Envío gratis +120K · 2 prendas" y "Cambios y devoluciones". **Los íconos se dibujan solos** con su trazo (1,6 s).
5. **Tira de categorías** con la prenda recortada sobre una tarjeta clara y el nombre en rojo (CAMPERAS, BAGGY, BOOTCUT/FLARE, REMERAS, DEPORTIVO, BLACK NOCHE). **Corre sola** (54 s por vuelta) y el texto cambia de color al pasar.
6. **"OFERTAS · STOCK LIMITADO / DESTACADOS / VER TODO"**: grilla con etiqueta roja de % (-14%), corte arriba a la derecha (REGULARFIT, BOXYFIT), estrellas con cantidad de reseñas, precio tachado, precio, **"con transferencia" en rojo**, cuotas sin interés, botón negro "VER DETALLES →" y botón redondo de carrito.
7. **"COMUNIDAD 👻 · @DESTINOCLOTHES.OK"**: carrusel de fotos de clientes usando la ropa, con chip del producto ("CAMPERA FEZN").
8. **"ARMA TU OUTFIT"**: categorías que rotan con **video de fondo** que cambia (fundido de 450 ms). Lista CAMPERAS / BERMUDAS / JOGGINS / PANTALONES / REMERAS (la activa en blanco), botón "VER X" y números. En computadora son dos paneles: foto y video.
9. **"NOS ELIGEN TODOS LOS DÍAS"**: tarjeta negra con 4 números (38 envíos diarios, +27.622 ventas, +889 reseñas, 2 locales en CABA). El título sube y aparece (1 s), **la línea se estira** (1,4 s, a los 200 ms), las cifras aparecen después (900 ms, a los 350 ms) y **cuentan hacia arriba**.
10. **"NUESTRA COMUNIDAD · ELLOS YA COMPRARON DESTINO"**: cabecera "EXCELENTE ★★★★★ 4,9 · +1.000 reseñas", botón "DEJÁ TU RESEÑA" y reseñas en tarjetas que se deslizan (800 ms, `cubic-bezier(.65,0,.35,1)`). Son reseñas de una app de reseñas (Revie).
11. **"DESTACADOS · LO MÁS ELEGIDO"**: carrusel de productos con flechas ‹ ›.
12. **"PREGUNTAS FRECUENTES · ANTES DE COMPRAR"**: acordeón con "+" en círculo.
13. **Banner "[DESTINO™] ARMA TU OUTFIT."** con foto grande que hace **zoom lento** (3 s) y botón "NUEVO DROP".
14. **"DESTINO® / BUENOS AIRES · ¿NECESITÁS PROBARTE LAS PRENDAS?"**: un local por tarjeta, con **mapa de Google**, nombre, dirección, horario, "CÓMO LLEGAR →" y "CONSULTAR".
15. **"VAN CON TU ESTILO · ESTO ES PARA VOS"**: carrusel de productos recortados.
16. Newsletter y pie negro con categorías y contacto en acordeón.

**En toda la tienda:**
- **Aviso de compra** abajo a la izquierda: foto, "Thiago M. de Lanús compró", producto, precio, "● hace 20 min · Destino". Entra en 600 ms y el punto late (1,6 s).
- **Carrito lateral** con barra de envío gratis y productos sugeridos (se ve al principio del video).
- Botón "DISEÑO & DESARROLLO PRAXIS" con brillo, en el pie.

## Efectos medidos (ver `docs/efectos.md`, E23 a E30)

| # | Efecto | Medida |
|---|---|---|
| E23 | Íconos que se dibujan solos | Trazo SVG (`stroke-dashoffset`) en 1,6 s, lineal |
| E24 | Tira de categorías que corre | 54 s por vuelta, lineal, sin fin |
| E25 | Cinta con palabras en rojo | 38 s por vuelta |
| E26 | Fondo de categoría en video con fundido | Opacidad en 450 ms |
| E27 | Números que suben | Título 1 s; línea `scaleX` 1,4 s con 200 ms de demora; cifras 900 ms con 350 ms de demora, `cubic-bezier(.2,.7,.2,1)` y conteo |
| E28 | Reseñas en pista | Desliza 800 ms, `cubic-bezier(.65,0,.35,1)` |
| E29 | Banner con zoom lento | `transform` 3 s |
| E30 | Aviso de compra con punto que late | Entrada 600 ms `cubic-bezier(.2,.8,.2,1)`, punto 1,6 s en bucle |

## Qué ya tiene Nevux y qué falta

- **Ya está:**
  - portada con clips (E15);
  - categorías que rotan (E17, falta el fondo en video);
  - foto que alterna (E18);
  - cinta de anuncios;
  - aviso de compra (con otro estilo);
  - preguntas;
  - locales;
  - números y reseñas (sin las animaciones de Destino).
- **Falta armar:**
  - portada estilo Destino (con tarjetitas flotantes);
  - beneficios con íconos que se dibujan;
  - tira de categorías recortadas;
  - tarjeta de producto estilo Destino;
  - comunidad (fotos de clientes);
  - números que suben;
  - reseñas con puntaje;
  - banner con zoom;
  - locales con mapa;
  - aviso de compra estilo Destino;
  - carrito con barra de envío gratis.

## Medidas exactas de cabecera, pie y estilo general (medido en vivo el 01/11/2026, tarde)

Medido con Playwright después de que Rodrigo dijera que la home Premium de Hogar Digital "no se parece nada a Destino". **Estas medidas mandan sobre lo de arriba.**

**Estilo general**
- Fondo de la página: `#eaeaea` (gris claro, no blanco). Textos secundarios `#4B4B4B`. Negro `#0B0B0B`.
- Rojo: **`#BD0003`** (no `#e3262f`).
- Tipografías: títulos en **Dela Gothic One** (peso 400, mayúsculas; títulos de sección 25 px; tarjetas 13 px) y textos en **Archivo** (11 px, `letter-spacing: .14em` en los "Ver todo").
- Portada: esquinas de abajo redondeadas de 20 px (`border-radius: 0 0 20px 20px`).

**Cabecera (fija, flotante)**
- `position: fixed` en la home, a 8 px de los bordes (`margin: 8px 8px 0`, `top: 8px`), `border-radius: 16px`. Alto: 100 px en el celular (92 px al bajar) y 155 px en la computadora (con el menú abajo).
- **Sobre la portada** (`html.dsx-sobre`): fondo transparente, borde `1px rgba(255,255,255,.18)`, sin sombra ni desenfoque. Logo en blanco (`filter: brightness(0) invert(1)`), íconos y menú en blanco.
- **Al bajar:** `background: rgba(255,255,255,.62)`, `backdrop-filter: blur(20px) saturate(1.8)`, borde `1px rgba(255,255,255,.75)`, sombra `0 1px 0 rgba(255,255,255,.55) inset, 0 8px 30px rgba(0,0,0,.06)`. Logo negro. Transición de fondo, borde y sombra: `.35s ease`.
- Logo a la izquierda (176×40 px en el celular, 198×45 en la computadora), **lupa roja en círculo** de 32 px (`#BD0003`, lupa calada en blanco) y carrito con el globito rojo.
- La **cinta de anuncios va adentro de la cabecera**, debajo del logo, con una línea arriba.
- Menú (computadora): Archivo 11 px, peso 500, `letter-spacing: .14em`, mayúsculas. Buscador en pastilla (`border-radius: 999px`, fondo `rgba(255,255,255,.55)`).

**Pie**
- Fondo `#0B0B0B`. Títulos ("CATEGORÍAS", "CONTACTÁNOS") en Dela Gothic One, blancos y en mayúsculas, como acordeón con "+". Links y textos en mayúsculas, 12 px, `letter-spacing: .08em`, blanco al 78 %.
- Newsletter negro: título "NEWSLETTER" en Dela Gothic One, campo en pastilla (`rgba(255,255,255,.08)`, borde `rgba(255,255,255,.25)`).
- Redes centradas y logos de medios de envío.
- Franja legal con degradé `#0B0B0B → #121212 → #1C1C1C` y texto blanco al 82 %.

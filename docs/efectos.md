# Catálogo de efectos ("el wow")

Pedido de Rodrigo (01/11/2026): de cada referencia se guardan **los efectos**, no solo el estilo y la estructura, porque son los que generan el "wow". Se miden con exactitud: en la página real con Playwright (`document.getAnimations()`, duración, demora y curva) y, si no hay página, en el video a 4 o 5 cuadros por segundo. Se replican con código propio.

**Cómo medir una página nueva:** Playwright con celular de 390 px, bajar de a 120 px esperando 350 ms y anotar cada animación distinta (tipo, propiedad, duración, demora, repeticiones y curva). El script de la sesión del 01/11 hacía exactamente eso.

## Medidos en páginas reales

| # | Efecto | Dónde | Cómo es exactamente |
|---|---|---|---|
| E1 | **Barra de compra que entra desde abajo** | Wess (ficha) | Aparece al pasar el botón de compra: `transform` 350 ms, `cubic-bezier(.4,0,.2,1)`. En Praxis: 500 ms, `cubic-bezier(.2,.8,.2,1)` |
| E2 | **Columna de la comparativa que se llena** | Wess (ficha) | Al entrar en pantalla, el fondo de la columna de la marca se estira 3,5 s (`cubic-bezier(.25,.46,.45,.94)`). El título de la marca aparece a los 150 ms (400 ms) y los **tildes saltan con rebote** a los 1.000 ms (350 ms, escala con `cubic-bezier(.175,.885,.32,1.275)`) |
| E3 | **Pilar que crece** (variante de E2) | Praxis (demo) | La barra de color crece en altura 1,4 s (`cubic-bezier(.3,.8,.2,1)`) y los tildes aparecen 350 ms después (350 ms) |
| E4 | **Reseñas que entran con rebote** | Wess (ficha) | Cada tarjeta, al entrar en pantalla, aparece y sube con rebote: 600 ms, `cubic-bezier(.175,.885,.32,1.275)` |
| E5 | **Brillo que cruza el botón** | Wess (ficha) | Una franja de luz cruza el botón o link cada 5,5 s, sin parar |
| E6 | **Olas en movimiento** entre secciones | Wess (ficha) | La ola se desplaza en 18 s, sin parar, lineal |
| E7 | **Cinta de beneficios** | Wess (ficha) | Texto corriendo en 55 s por vuelta, lineal y sin fin |
| E8 | **Aviso de compra** ("Alguien de Córdoba compró 2 termos · hace 3 minutos") | Praxis (demo) | Aparece y sube 450 ms y se va igual. **Solo con ventas reales** |
| E9 | **Elegir pack** | Praxis (demo) | La tarjeta elegida cambia fondo y borde y crece apenas, 350 ms. El punto del botón de opción, 300 ms |
| E10 | **Botón "Agregado ✓"** | Praxis (demo) | Al tocar "Agregar al carrito", el botón se pone verde en 300 ms con una **onda** que sale del dedo (600 ms) |
| E11 | **Video con barra de progreso** | Praxis (demo) | Botón ▶ que aparece (400 ms) y barra de progreso de 8 s abajo del video |
| E12 | **Celular que cae en su lugar** | Praxis (portada de su landing) | El celular entra cayendo, con sombra que se achica, en 1.050 ms. La foto de adentro hace un paneo lento de 6 s y hay vapor que sube en bucle (2,4 s, dos capas desfasadas 1,1 s) |
| E13 | **Cuenta regresiva en cajitas** | Praxis (ficha clara) | HS · MIN · SEG cambian segundo a segundo. **Solo con promo real con fecha de fin** |
| E14 | **Selector por unidad** | Praxis (ficha clara) | Al elegir "Llevá 2", se despliegan los selectores "Unidad 1 / Unidad 2" |

## Medidos en video (home Dámelo, `docs/referencias/praxis-home.md`)

| # | Efecto | Cómo es |
|---|---|---|
| E15 | **Portada en video** | Clips cortos (0,5 a 1 s) a pantalla completa con degradé oscuro y título encima |
| E16 | **Tarjeta de beneficios tipo historias** | La tarjeta se monta sobre la portada y pasa sola cada ~2 s, con rayitas de progreso que se llenan |
| E17 | **Categorías que rotan solas** | La lista JEANS / REMERAS / BERMUDAS / BUZOS se va iluminando de a una (~2 s cada una). Cambia el video y el texto del botón, y la anterior queda apagada |
| E18 | **Foto que alterna frente y espalda** | En las tarjetas de producto, la foto cambia sola entre la primera y la segunda imagen |
| E19 | **Shop the look** | Carrusel de looks (el del centro nítido y los de los costados desenfocados), talles para tocar y "Sumar el look" que agrega todo |
| E20 | **Reseñas que se deslizan solas** | Fila de tarjetas que avanza sola |
| E21 | **Videos de Instagram reproduciéndose** | Grilla de videos verticales sin sonido y en bucle |
| E22 | **Vitrina 3D de celulares** | Tres celulares: el del centro adelante y los de los costados chicos, girados hacia adentro y con fundido. Cada uno baja solo por una tienda (para nuestra página de diseños) |

## Medidos en la tienda Destino (Praxis, Premium; `docs/referencias/destino.md`)

| # | Efecto | Cómo es exactamente |
|---|---|---|
| E23 | **Íconos que se dibujan solos** | El trazo del ícono SVG se dibuja en 1,6 s (`stroke-dashoffset`), lineal |
| E24 | **Tira de categorías que corre** | Prendas recortadas con el nombre en rojo, 54 s por vuelta, sin fin |
| E25 | **Cinta con la palabra clave en rojo** | 38 s por vuelta |
| E26 | **Categoría con video de fondo** | Al cambiar de categoría, el video se funde en 450 ms |
| E27 | **Números que suben** | Título sube y aparece (1 s), línea que se estira (1,4 s, demora 200 ms), cifras que aparecen (900 ms, demora 350 ms) y cuentan hasta el número, `cubic-bezier(.2,.7,.2,1)` |
| E28 | **Reseñas en pista** | La pista se desliza en 800 ms con `cubic-bezier(.65,0,.35,1)` |
| E29 | **Banner con zoom lento** | La foto se acerca en 3 s al aparecer |
| E30 | **Aviso de compra con punto que late** | Entra en 600 ms (`cubic-bezier(.2,.8,.2,1)`), abajo a la izquierda; el punto "●" late cada 1,6 s |

## Ya los tiene Nevux (01/11/2026)

- **Ficha Pro** (`estiloFicha: 'pro'`): E1, E2/E3, E4, E5, E9, E10 y E13, más las pestañas de "En acción".
- **Home Premium:** E15 (`home.portadaVideo`, con videos o fotos), E16 (historias), E17 (`home.rotador`) y E18 (`tarjetas.alternar`).
- **Página de diseños:** E22 (`nevux.ar/disenos`).
- **De antes:** cinta de anuncios (≈E7), vitrina que se balancea, puntos que laten, segundero y V en 3D (Valmont).
- **Falta:** E8 (avisos de compra, solo con ventas reales), E11 (video con barra de progreso), E14 (selector por unidad), E19 (shop the look), E20 (reseñas de Google) y E21 (Instagram).

# Doggies (fafala.mitiendanube.com)

- **Estudiada:** 29/10/2026
- **Ficha analizada:** `/productos/panal-lavable-perra-18cz6/` (pañal lavable para perra, $21.500)
- **Plantilla:** Morelia
- **Apps detectadas:** solo **Wigy** (`wigy.app`, NubeSDK), que agrega el aviso de ventas en vivo. El resto es contenido y código propio de la tienda.
- **Estilo:** tonos tierra (marrón, beige y terracota), tipografía redondeada, tarjetas blancas con sombra suave y numeración en círculos.

**Cómo se midió:** la ficha se cargó con y sin Wigy. Sin Wigy mide 9.550px de alto y con Wigy, 9.705px: la única diferencia es el aviso "Meli de San Isidro compró…".

## Ficha de producto, de arriba a abajo

1. **Cinta superior** con texto que corre. Tenía texto de prueba olvidado ("PERRITOS LINDOS Perra RAABAAAA").
2. **Etiqueta sobre la foto:** "10% OFF comprando 2 o más". La pone la promoción nativa de Tiendanube.
3. **Título largo con beneficio:** "Pañal lavable para perra: celo, incontinencia y postoperatorio".
4. **Precio, precio tachado, cuotas sin interés y % por transferencia** (nativo de la plantilla).
5. **Color y talle** (variantes nativas).
6. **"Elegí tu combo"** con radio buttons:
   - Llevo 1 — $21.500
   - Llevo 2 — 10% OFF — $38.700, tachado $43.000, con la etiqueta "MÁS ELEGIDO" y el subtexto "Uno mientras lavás el otro · **$34.830 con transferencia**". Combina el descuento del pack con el de transferencia.
7. **Franja "⚡ Despacho en el día"**: "Pedí antes de las 14 hs (CABA · GBA · La Plata)".
8. **Franja verde "💸 10% OFF pagando por transferencia".**
9. **Botón "Agregar al carrito".**
10. **Bloque de marca** (logo, "Todo para tu mascota") y **cinta animada:** Despacho en el día · Cambios sin drama 10 días · Te asesoramos por WhatsApp · 3 cuotas sin interés.
11. **Problema** ("¿Está en celo o salió de una operación?"), con 4 viñetas de situaciones y la etiqueta "Despacho en el día".
12. **Antes / Después con deslizador**, hecho con fotos reales del producto en uso.
13. **"Conocé nuestros productos más de cerca":** carrusel de videos verticales tipo historia, con pausa y link "PAÑAL LAVABLE →".
14. **Calculadora de talle:**
    - Campo "Medí su cintura" en cm y botón "Ver mi talle", que devuelve el talle recomendado.
    - Debajo, la tabla XS a XL con rangos en cm.
    - Aclaración: "si queda entre dos talles, elegí el más grande".
    - Desplegable "Ver todas las medidas".
15. **"Se usa en 3 pasos":** tarjetas numeradas con foto (elegís talle y color · se lo colocás · queda seca y cómoda).
16. **Segunda cinta animada** con atributos (alta absorción · control de olores · ajuste sin fugas · lavable).
17. **Comparativa "Pañal DOGGIES vs. andar limpiando":** columna de la marca resaltada con ✓ contra "Sin pañal" con ✕.
18. **"Por qué lo vas a amar":** 4 beneficios en viñetas.
19. **Estadísticas en círculos:** 94% / 90% / 96%, como "datos de nuestra comunidad". No se sabe de dónde salen los números.
20. **Reseñas:** 3 tarjetas con inicial, nombre, barrio, 5 estrellas y "✓ Compra verificada".
21. **"Completá el combo / Combiná con":** cross-sell de un producto complementario (Huellitas antideslizantes $7.000) con "VER PRODUCTO →".
22. **Preguntas frecuentes:** 8 en acordeón. Incluye el detalle legal de cambios y devoluciones (botón de arrepentimiento, quién paga el envío, plazos).
23. **Barra de compra fija** abajo: nombre del producto + "Agregar al carrito".
24. **Aviso de ventas en vivo** (Wigy): "Meli de San Isidro · Compró el Pañal lavable Perra · hace 4 min · verificado ✓".

## Home

Es casi toda la plantilla nativa: hero "Todo lo que tu mascota quiere, sin vueltas", grilla de productos con etiquetas de promoción ("10% OFF comprando 2 o más", "Envío gratis", "Sin stock"), un producto destacado embebido con su selector de combo, newsletter y "Novedades".

**Puntos flojos:**
- El texto de prueba en la cinta superior.
- El bloque del producto destacado se ve cortado: la cinta animada desborda y queda un "Ver más" suelto.
- No tiene secciones de confianza propias en la home.

## Cómo lo hace mejor Nevux

| Pieza de Doggies | Nevux hoy | Cómo lo hacemos mejor |
|---|---|---|
| Combo Llevo 1 / Llevo 2 con precio por transferencia | ✅ Packs 1/2/3 (sin el precio por transferencia en el pack) | Mostrar en cada pack el precio con transferencia, leído de la tienda. Cantidades y textos configurables ("Uno mientras lavás el otro"). |
| Despacho en el día con hora de corte | ✅ Entrega estimada con fecha (v3) | Nuestra versión calcula la fecha real. Sumar una cuenta regresiva: "Pedí en las próximas 2 h 14 min y sale hoy". |
| Franja de % por transferencia | ✅ Bloque "Mejor precio" (v3) | Ya es más visible (precio grande + ahorro). |
| Cintas animadas | ❌ | Cinta configurable con los beneficios del cliente. Sin datos inventados: solo lo que el cliente confirme. |
| Antes / Después con deslizador | ❌ en el código (✅ en la landing de Nevux) | Pieza configurable con 2 fotos que pone el cliente. Táctil y liviana. |
| Videos tipo historia | ❌ | Carrusel de videos verticales cargados por el cliente, que reproduce solo en pantalla y sin sonido. |
| Calculadora de talle | ❌ | **Prioridad alta para indumentaria y mascotas:** el cliente carga la tabla (medida → talle) y la calculadora **elige sola el talle en el selector de la ficha**. Doggies no hace esto. |
| Se usa en 3 pasos | ❌ | Pasos configurables con foto opcional. |
| Comparativa marca vs. alternativa | ❌ | Tabla configurable (filas y nombres de columnas). |
| Estadísticas 94/90/96% | ❌ | **No replicar con números inventados.** Solo con datos reales que el cliente pueda respaldar. |
| Reseñas con "Compra verificada" | ❌ | Reseñas reales que carga el cliente. El sello "verificada" solo si lo es de verdad. |
| Combiná con (cross-sell) | ❌ | Elegir el producto complementario por URL, traer su foto y precio, y agregarlo al carrito sin salir de la ficha. |
| Preguntas frecuentes | ❌ en el código | Acordeón configurable, con la pregunta de cambios y devoluciones precargada según la ley de defensa del consumidor. |
| Barra de compra fija | ✅ | La nuestra muestra foto, nombre, precio y el pack elegido. |
| Aviso de ventas en vivo | ✅ | El texto "verificado ✓" de Wigy es un riesgo cuando la compra es simulada. Nevux no lo pone. Si el cliente conecta sus ventas reales, se puede mostrar. |

## Ideas para la home (Nevux todavía no toca la home)

- Corregir lo que Doggies tiene roto: nada de texto de prueba ni bloques cortados.
- Sumar en la home la franja de confianza (envío, cuotas, cambios, WhatsApp) con datos reales.
- Etiquetas de promoción sobre las fotos de la grilla, leídas de las promociones activas.

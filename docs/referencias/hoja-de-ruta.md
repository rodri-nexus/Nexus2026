# Hoja de ruta del código maestro

Estado de cada pieza de la ficha de producto, con las ideas tomadas de [Wess](wess.md) y [Doggies](doggies.md).
Se construye de a una tanda y cada pieza se prueba sobre una ficha real antes de publicarla.

**Reglas de todas las piezas:**
- Usar datos reales de la tienda o datos que el cliente confirma. Nunca números inventados.
- Si el cliente no ofrece algo, la pieza no se muestra.
- Todo se configura en el bloque `NEVUX` del código.

## Ficha de producto

### Hecho (código maestro v3)

- Botón de compra fijo
- Packs Llevá 1/2/3 que cambian la cantidad del carrito
- Barra de urgencia
- Aviso de ventas en vivo
- Insignias de confianza con cuotas sin interés reales
- Mejor precio por transferencia (se detecta solo)
- Entrega estimada con hora de corte
- Barra de envío gratis
- Ayuda por WhatsApp

### Hecho (código maestro v4): tanda 2, contenido de marca

Todas las piezas se configuran en `NEVUX` y se pueden cambiar por producto con `porProducto`.

- **Cinta animada** de beneficios (`cinta`).
- **Calculadora de talle** (`talles`). Elige sola el talle en la ficha: toca el botón `.js-insta-variant[data-option]` y, si no lo encuentra, cambia el `select`. Si la medida cae entre dos talles, elige el más grande. Probado en Recife (Wess) y Morelia (Doggies).
- **Antes / Después** con deslizador (`antesDespues`).
- **Pasos de uso** con foto opcional (`pasos`).
- **Comparativa** marca vs. alternativa (`comparativa`).
- **Reseñas** (`resenas`). El sello "Compra verificada" solo aparece con `verificada: true`.
- **Preguntas frecuentes** (`faq`), más la pregunta de arrepentimiento según el art. 34 de la Ley 24.240 (`faqDevoluciones`).

### Tanda 3: visual y venta cruzada

1. Precio con transferencia dentro de cada pack (Doggies).
2. Cuenta regresiva para el despacho en el día.
3. "Combiná con": agregar el producto complementario sin salir de la ficha.
4. Carrusel de videos verticales.
5. Galería de colores.
6. Diseño de marca: colores, fuentes y fondos del cliente.

### Arreglos conocidos

- ✅ Insignias angostas en Brasilia y Recife: arreglado en v4. Se insertan debajo del primer bloque que ocupa al menos el 90% del ancho del formulario.
- Logos de medios de pago: no implementado. Tiendanube ya los muestra en "Ver más detalles".

## Home (más adelante)

- **Piezas simples:** beneficios, mejor precio y stock en las tarjetas de producto, preguntas frecuentes, locales y cierre.
- **Piezas complejas:** buscador de talle por pasos y foto con puntos explicativos.
- **Ojo con el modelo de negocio:** armar una home a medida por cliente es más un servicio que el pack de $39.900. Conviene ofrecerlo aparte.

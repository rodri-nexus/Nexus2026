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

### Hecho (código maestro v5): tanda 3, venta cruzada y marca

- **Precio con transferencia dentro de cada pack** (`pk-t`). Usa el % de transferencia de la tienda.
- **Cuenta regresiva** "Pedí en las próximas X h Y min y sale hoy". Se activa con `envio` cuando hoy es día de despacho. Hora de Argentina; se actualiza cada 30 s.
- **Combiná con** (`combina`): lee el producto complementario de la misma tienda (usa solo la ruta, así funciona aunque la URL sea de otro dominio de la tienda). Si no tiene stock, no se muestra. Lo agrega con POST a `/comprar/` sin salir de la ficha.
- **Videos verticales** (`videos`): mp4 o ID de YouTube. Los mp4 se reproducen solo cuando están en pantalla.
- **Galería de colores** (`colores`): al tocar una foto, elige ese color en la ficha.
- **Diseño de marca** (`marca`): secundario, fondo, borde, texto, radio y fuente de las secciones de Nevux.

Probado en Doggies (Morelia): las 6 piezas funcionan, el carrito recibe el producto complementario y el color queda elegido en la ficha.

### Arreglos conocidos

- ✅ Insignias angostas en Brasilia y Recife: arreglado en v4. Se insertan debajo del primer bloque que ocupa al menos el 90% del ancho del formulario.
- Logos de medios de pago: no implementado. Tiendanube ya los muestra en "Ver más detalles".

## Home (más adelante)

- **Piezas simples:** beneficios, mejor precio y stock en las tarjetas de producto, preguntas frecuentes, locales y cierre.
- **Piezas complejas:** buscador de talle por pasos y foto con puntos explicativos.
- **Ojo con el modelo de negocio:** armar una home a medida por cliente es más un servicio que el pack de $39.900. Conviene ofrecerlo aparte.

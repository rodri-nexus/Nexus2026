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

### Hecho después de v5

- **Cuenta regresiva grande en la ficha** (`cuentaRegresiva`), con horas, minutos y segundos, antes de los packs. Comparte la función `montarCuenta` con la de la home. Si la home ya tiene su banner, la ficha incrustada no agrega otro.
- **Avisos de venta con productos reales** (`ventas`): foto, nombre y precio de la tienda; compradores y ciudades que rotan.
- **"Combiná con" automático** (`combina: 'auto'`).

### Hecho (30/10/2026)

- **Bloque de precios en tarjetas** (`precios: true`): tarjeta con el color de la tienda para el precio con transferencia (% OFF y "Ahorrás $X") y tarjeta oscura (el color del pie de la plantilla) para "N cuotas sin interés de $X · Precio final". Usa solo datos reales de Tiendanube: si la tienda no tiene descuento por transferencia o cuotas sin interés, esa tarjeta no aparece. Reemplaza al "Mejor precio" simple. Probado en Doggies (Morelia).
- **Modo evento** (`evento`): Cyber Monday, Hot Sale, etc. Ver `docs/clientes.md`.

### Hecho (31/10/2026): piezas tomadas de la idea de Wess, hechas desde cero

- **Barra de anuncios que rota** (`anuncios`), con flechas. Si hay un evento, su mensaje va primero.
- **Medios de pago en chips** debajo del precio (`mediosDePago`).
- **Antes vs. después en lista** (`problemaSolucion`): solo afirmaciones reales de la tienda.
- **Ficha en estilo oscuro** (`estiloFicha: 'oscuro'`), con separadores en ola.
- **Home: foto con puntos** (`home.puntos`): puntos que laten y se pueden tocar, con su lista.
- **Home: vitrinas** (`home.vitrinas`): trae las tarjetas reales de una categoría y las muestra en carrusel con botón "Ver".
- **Tarjetas destacadas** (`tarjetas.estilo: 'destacado'`) y **comparativa con barra animada**.

### Hecho (31/10/2026): plan Premium

- **Tipografías de marca y entrada animada** de cada sección al bajar (`premium`).
- **Portada de lujo en la home** (`home.hero`): foto que gira y se agranda suave al bajar.
- **Especificaciones** (`especificaciones`), **medidor de muñeca** (`muneca`: compara el diámetro de la caja con la muñeca), **qué incluye** (`incluye`) y **para regalar** (`regalo`).
- **Demo de Valmont & Co.** en `nevux.ar/demo/valmont/` (generador: `scripts/demo/valmont.py`). Fotos, precios y datos ilustrativos.

### Arreglos conocidos

- ✅ Insignias angostas en Brasilia y Recife: arreglado en v4. Se insertan debajo del primer bloque que ocupa al menos el 90% del ancho del formulario.
- Logos de medios de pago: no implementado. Tiendanube ya los muestra en "Ver más detalles".

## Home

### Hecho (motor de `public/nevux.js`)

- **Tarjetas de producto** (`tarjetas`): "Mejor precio" por transferencia y "QUEDAN N" con stock bajo, en la home, las categorías y los productos similares. El stock se lee de `data-variants` cuando la plantilla lo trae (por ejemplo, Brasilia).
- **Secciones de la home** (`home`): beneficios (debajo del banner principal), categorías, por qué elegirnos (tarjetas tipo etiqueta), números, reseñas, preguntas frecuentes, locales y cierre. Van antes del pie de la plantilla. Ver [../home.md](../home.md).

Probado en Brasilia (Hogar Digital), Recife (Wess) y Morelia (Doggies).

### Pendiente

- Buscador de talle por pasos y foto con puntos explicativos.
- **Precio:** armar una home a medida por cliente es más trabajo que el pack de la ficha. Definir si va incluido o como extra.

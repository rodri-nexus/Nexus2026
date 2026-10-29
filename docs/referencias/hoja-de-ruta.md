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

### Tanda 2: contenido de marca

1. **Calculadora de talle** que elige sola el talle en la ficha (idea de Doggies, mejorada).
2. **Antes / Después** con deslizador y fotos del cliente.
3. **Comparativa** marca vs. alternativa.
4. **Cinta animada** de beneficios.
5. **Reseñas reales** del cliente.
6. **Preguntas frecuentes**, con la de cambios y devoluciones precargada.
7. **"Se usa en N pasos".**

### Tanda 3: visual y venta cruzada

1. Precio con transferencia dentro de cada pack (Doggies).
2. Cuenta regresiva para el despacho en el día.
3. "Combiná con": agregar el producto complementario sin salir de la ficha.
4. Carrusel de videos verticales.
5. Galería de colores.
6. Diseño de marca: colores, fuentes y fondos del cliente.

### Arreglos conocidos

- En la plantilla Brasilia (Hogar Digital), las insignias de confianza quedan a media columna. Hay que insertarlas fuera de la grilla del botón.
- Logos de medios de pago: no implementado. Tiendanube ya los muestra en "Ver más detalles".

## Home (más adelante)

- **Piezas simples:** beneficios, mejor precio y stock en las tarjetas de producto, preguntas frecuentes, locales y cierre.
- **Piezas complejas:** buscador de talle por pasos y foto con puntos explicativos.
- **Ojo con el modelo de negocio:** armar una home a medida por cliente es más un servicio que el pack de $39.900. Conviene ofrecerlo aparte.

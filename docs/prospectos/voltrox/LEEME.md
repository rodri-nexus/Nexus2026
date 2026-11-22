# Voltrox Suplementos · prospecto (15/11/2026)

- Tienda: voltroxsuplementos.com · Tiendanube, plantilla **Toluca** · diseño hecho por @julieta_tiendasonline (cuidar cómo se le habla).
- Datos reales (de su tienda y sus preguntas frecuentes): 18 % por transferencia, 3 cuotas sin interés, despacho en 24 hs, envío gratis desde $140.000, Correo Argentino y Andreani, solo online (sin local), cambios 2 días si hubo error, atención de 8 a 20 hs, WhatsApp 3472-525274. Usan **Revie** (reseñas reales de clientes).
- Demo: `config-demo.json` inyectado en su tienda real (no está en `lib/clientes.ts`). Capturas en esta carpeta.
- Motor: se sumó soporte de la cabecera de Toluca (deja su lupa y oculta su barra de anuncios) y `home.destino.alternar: false` (sus segundas fotos son tablas nutricionales).
- Si contrata: pasar la config a `lib/clientes.ts` como `voltrox` (dominio voltroxsuplementos.com) y revisar su popup de suscripción (Nuvem Marketing), que tapa la portada al entrar.

## Versión 2 (16/11): estilo DOTS + Hogar Digital
- Rodrigo no aprobó la primera. Nueva: portada con video propio, sello de reseñas reales (Revie: 15, promedio 5,0) y seguidores (+4.900), grilla oscura, "Cada pedido lo preparamos nosotros" con su video armando un pedido, "en movimiento" con 6 de sus Reels, testimonios reales de WhatsApp (13, con las etiquetas de envío difuminadas), números, "Por qué Voltrox" en 4 pilares, reseñas de la tienda, combos, preguntas y banner.
- Bloques nuevos del motor (sirven para cualquier cliente): `home.destino.sello`, `historia`, `testimonios`, `pilares`, `destacados[].oscuro` y `portada.lleno`.
- Videos y testimonios en `public/clientes/voltrox/`. El carrito no se pudo capturar: su tienda devuelve 403 a los navegadores automáticos al agregar al carrito.

## Ajustes (16/11)
- Pie: "Tienda diseñada por @nevux.app" (opción nueva `credito`).
- Logo de la cabecera girando en 3D con grosor (opción nueva `cabecera.logo3d`). Video: `logo-3d.mp4`.
- Ficha más completa (opción nueva `fichaDestino.extras`): reseñas de la tienda, "Pedidos que ya llegaron" con los testimonios y "Te asesoramos" con sus Reels. Toma lo de la home si no se define aparte.
- Carrito: capturado cargando en la página dos productos reales con sus precios (la tienda bloquea el "agregar" a navegadores automáticos). `carrito-celular.jpg`. Arreglo en el motor: la lista del carrito queda transparente (en Toluca venía con fondo blanco).

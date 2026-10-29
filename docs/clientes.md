# Clientes: alta, apagado y cambios

Cada tienda instala Nevux con **una sola línea**. El código y la configuración viven en nevux.ar, así se puede prender, apagar o cambiar cualquier tienda sin pedirle nada al cliente.

## Cómo funciona

| Archivo | Qué es |
|---|---|
| `public/nevux.js` | El motor, común a todas las tiendas. Si lo mejoramos, se actualiza en todas. |
| `public/c/<cliente>.js` | La línea de cada cliente: interruptor (`activo`), dominios permitidos y su configuración. |
| `public/nevux-master-pro.html` | El portal de entrega. Con `?c=<cliente>` muestra la línea de ese cliente para copiar. |

- **El cliente pega en su Tiendanube** (Configuración > Códigos externos > Códigos de tracking > "Para la tienda"):
  ```html
  <script src="https://nevux.ar/c/<cliente>.js" async></script>
  ```
- **La línea solo funciona en los dominios de `dominios`:** si alguien la copia en otra tienda, no hace nada.
- **Los cambios tardan hasta 5 minutos en verse,** por el cache de esos archivos (`next.config.js`).

## Apagar o prender una tienda (por ejemplo, si deja de pagar)

1. Abrí `public/c/<cliente>.js` en GitHub y tocá el lápiz para editar.
2. Cambiá `activo: true` por `activo: false`, o al revés para prenderla.
3. Commit. Cuando Vercel queda en verde, en hasta 5 minutos Nevux desaparece (o vuelve) en esa tienda.

## Dar de alta un cliente nuevo

1. Copiá `public/c/hogar-digital.js` como `public/c/<nombre-de-la-tienda>.js`. Usá solo minúsculas, números y guiones.
2. Cambiá el comentario de arriba, `dominios` (el dominio de su tienda, sin `www`) y `config`.
3. Antes de prenderlo, probalo sobre una ficha real de su tienda.
4. Mandale el link del portal: `https://nevux.ar/nevux-master-pro.html?c=<nombre-de-la-tienda>`

## Clientes

| Cliente | Archivo | Estado | Pendiente |
|---|---|---|---|
| Hogar Digital (Marcelo) | `c/hogar-digital.js` | Apagado | Datos de envío, WhatsApp, crear la promoción por cantidad (15% y 25%) y permiso para la landing |

## Cobro mensual

- **Tarjeta:** suscripción de Mercado Pago a $39.900/mes. Se cobra sola cada mes.
- **Efectivo y transferencia:** no se pueden debitar solos, porque el cliente tiene que pagar cada mes. Se le manda un link de pago antes del vencimiento.
- **Si un pago no entra:** avisarle al cliente y, si no paga, apagar su tienda con el interruptor.

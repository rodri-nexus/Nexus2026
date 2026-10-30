# Clientes: alta, apagado y cambios

Cada tienda instala Nevux con **una sola línea**. El código y la configuración viven en nevux.ar, así se puede prender, apagar o cambiar cualquier tienda sin pedirle nada al cliente.

## Cómo funciona

| Archivo | Qué es |
|---|---|
| `public/nevux.js` | El motor, común a todas las tiendas. Si lo mejoramos, se actualiza en todas. |
| `lib/clientes.ts` | Cada cliente: interruptor (`activo`), forma de cobro (`cobro`), dominios permitidos y su configuración. |
| `app/c/[archivo]/route.ts` | Arma la línea de cada tienda (`https://nevux.ar/c/<cliente>.js`) según su estado de cobro. |
| `lib/cobros.ts` | Consulta a Mercado Pago si el cliente está al día. |
| `app/panel/route.ts` | Panel privado con el estado de todos los clientes: `https://nevux.ar/panel?clave=<PANEL_CLAVE>`. |
| `public/nevux-master-pro.html` | El portal de entrega. Con `?c=<cliente>` muestra la línea de ese cliente para copiar. |

- **El cliente pega en su Tiendanube** (Tienda online > Editar diseño > Pie de página > Sellos personalizados > "Código Javascript o HTML del sello", y después "Publicar cambios"). El editor de CSS no sirve: no ejecuta código.
  ```html
  <script src="https://nevux.ar/c/<cliente>.js" async></script>
  ```
- **La línea solo funciona en los dominios de `dominios`:** si alguien la copia en otra tienda, no hace nada.
- **Los cambios tardan hasta 5 minutos en verse** (cache de la línea y del motor).

## Prendido y apagado automático

Cada vez que una tienda pide su línea (como mucho cada 5 minutos), nevux.ar decide:

| Situación | Tienda |
|---|---|
| `activo: false` | Apagada (manda el interruptor manual) |
| `cobro: { tipo: 'manual' }` | Prendida (se maneja a mano con `activo`) |
| Suscripción de Mercado Pago activa y con cobro en el último mes (+ días de gracia) | Prendida |
| Suscripción pausada, cancelada o pendiente | Apagada |
| Último cobro hace más de 31 días + gracia | Apagada |
| Mercado Pago no responde o falta el token | **Prendida** (nunca se apaga por un error nuestro) |

Cuando el cliente vuelve a pagar, se prende sola.

### Configuración inicial (una sola vez)

1. **Token de Mercado Pago:** en Mercado Pago Developers, entrá a "Tus integraciones", creá una aplicación y copiá el **Access Token de producción**.
2. **En Vercel:** proyecto → Settings → Environment Variables, agregá:
   - `MP_ACCESS_TOKEN` = el token del paso 1.
   - `PANEL_CLAVE` = una clave que elijas para entrar al panel.
3. **Redeploy** del proyecto en Vercel para que tome las variables.

El token da acceso a tu cuenta de Mercado Pago: va solo en Vercel, nunca en el código ni en un chat.

### Pasar un cliente a cobro automático

En `lib/clientes.ts`, en ese cliente:

```ts
cobro: { tipo: 'mercadopago', email: 'email-con-el-que-se-suscribió@...', gracia: 5 },
```

En lugar de `email` se puede usar `suscripcion: '<ID de la suscripción>'`. Después, revisá en el panel que diga "Al día con Mercado Pago".

## Apagar o prender una tienda a mano

1. Abrí `lib/clientes.ts` en GitHub y tocá el lápiz para editar.
2. En el cliente, cambiá `activo: true` por `activo: false` (o al revés).
3. Commit. Cuando Vercel queda en verde, en hasta 5 minutos Nevux desaparece (o vuelve) en esa tienda.

## Dar de alta un cliente nuevo

1. En `lib/clientes.ts`, copiá el bloque de `"hogar-digital"` con un id nuevo (solo minúsculas, números y guiones).
2. Cambiá `nombre`, `dominios` (sin `www`), `cobro` y `config`.
3. Antes de prenderlo, probalo sobre una ficha real de su tienda.
4. Mandale el link del portal: `https://nevux.ar/nevux-master-pro.html?c=<id>`

## Clientes

| Cliente | Archivo | Estado | Pendiente |
|---|---|---|---|
| Hogar Digital (Marcelo) | `c/hogar-digital.js` | **Prendido** | Permiso para la landing; categorías con fotos y reseñas reales para la home |

## Cobro mensual

**Link para mandarle al cliente:** `https://nevux.ar/suscribirme?c=<id>` (página con el plan, qué incluye, garantía y botón a Mercado Pago, personalizada con el nombre de su tienda). Sin `?c=` sirve para cualquiera. Después de pagar, Mercado Pago lo puede devolver a `https://nevux.ar/gracias` si se configura como URL de retorno del plan.

- **Tarjeta:** suscripción de Mercado Pago a $39.900/mes. Se cobra sola cada mes.
- **Efectivo y transferencia:** no se pueden debitar solos, porque el cliente tiene que pagar cada mes. Se le manda un link de pago antes del vencimiento.
- **Si un pago no entra:** con cobro automático la tienda se apaga sola después de los días de gracia y se prende sola cuando paga. Con cobro manual, apagala con el interruptor.

# Catálogo de diseños para clientes

Pedido de Rodrigo (01/11/2026): **cuando editemos una tienda, preguntarle al cliente qué diseño quiere** mostrándole este catálogo. Cada diseño sale de una tienda de referencia que Rodrigo mandó en video. Se replica la idea, la estructura y los efectos con código propio dentro del motor (`public/nevux.js`), con los colores, los productos y los datos reales de cada cliente.

## Cómo se usa con un cliente

1. Antes de armar o cambiar su tienda, mandarle el catálogo (cuando esté publicado: `nevux.ar/disenos`, con cada diseño bajando solo dentro de un celular, como en los videos de referencia).
2. El cliente elige el diseño de ficha, de home, o los dos.
3. Se configura en `lib/clientes.ts` y se prueba en su tienda con Playwright antes de prenderlo.

## Diseños

| # | Nombre | Parte | Referencia | Estado | Clientes |
|---|---|---|---|---|---|
| 1 | **Wess clásica** | Ficha y home | `docs/referencias/wess.md`, `docs/valmont.md` | Hecho (`estiloFicha: 'wess'`) | Valmont |
| 2 | **Ficha oscura con olas** | Ficha | — | Hecho (`estiloFicha: 'oscuro'`) | Hogar Digital |
| 3 | **Wess Buzo Polo** (escalera de precios, 3 pasos, problema/solución, pestañas "En acción", "Llevalo hoy") | Ficha | `docs/referencias/wess-buzo.md` (video 1 de 3) | Estudiado, falta el ok de Rodrigo para armarlo | — |

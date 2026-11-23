# Instagram de Hogar Digital (@hogardigitaltiendaonline)

**Actualizado:** 01/11/2026. Conectado a Windsor el 01/11: connector `instagram`, account **17841448464906393** (permite publicar, leer estadísticas y responder comentarios). El de Nevux es 17841439255112405: no confundirlos.

## Diagnóstico (01/11/2026, datos de Windsor)

| Dato | Valor | Lectura |
|---|---|---|
| Seguidores / seguidos | 3.484 / 1.471 | Sigue a muchísimas cuentas: crecimiento por "seguir para que te sigan", que después se van |
| Publicaciones | 22 (27 Reels medidos, del 7/7 al 11/9) | **No publica desde el 11/09**: siete semanas sin contenido |
| Vistas en 30 días | ~2.400 | Menos vistas que seguidores en un mes |
| Alcance diario | 0 a 120 cuentas (casi siempre 10-20) | Audiencia dormida |
| Seguidores nuevos en 30 días | 43 | Pero el total baja: se van más de los que llegan |
| Toques en el link del perfil | 1 en 30 días | El perfil no lleva gente a la tienda |
| Reels medidos | 20 a 240 vistas, 50 % a 90 % los saltean en los primeros 3 s | Gancho débil |
| Textos de las publicaciones | **Ninguna tiene texto** (caption vacío) | Sin texto no hay búsqueda, ni llamado a la acción, ni contexto |
| Audiencia | La mayoría de las ciudades con más seguidores son de **India y Bangladés**. De Argentina solo aparecen CABA (31), Rosario, Córdoba, Campana y Mar del Plata (~10 cada una). 1.022 en 18-24 sin género declarado | Seguidores falsos o de intercambio: no compran y le bajan el alcance a todo |
| Perfil | Cartel "Perfil con contenido generado con IA"; bio genérica en minúscula; sin destacadas | Resta confianza |

Lo que sí funcionó (según la captura del perfil): smartwatch en mano (15,8 mil vistas), "empaquetando pedidos" (8.164) y luz solar con beneficios (5.340).

## Plan

1. **Perfil:** nombre para búsquedas, bio con propuesta, envíos y llamado a la acción, link a la tienda y destacadas (Envíos, Opiniones, Medios de pago, Humidificadores, Audio, Smartwatch).
2. **Limpiar de a poco:** dejar de seguir cuentas sin relación (de a 50 por día como máximo) y no volver a "seguir para que te sigan". No comprar seguidores.
3. **Lunes a viernes**, programado desde Windsor: lunes Reel de producto estrella; martes carrusel guardable ("5 regalos de menos de $50.000"); miércoles Reel ambiente/ASMR (humidificadores); jueves confianza (pedidos, envíos, opiniones); viernes Reel con precio real y llamado a comprar. Tres historias por día.
4. **Reels con narración en voz argentina** (ver `docs/estado.md`), con texto en pantalla en los primeros 2 segundos y caption con llamado a la acción en todas las publicaciones.
5. **Precios:** solo los reales de la tienda; nunca precios viejos en los videos.
6. **Público:** Argentina. Hashtags y temas locales; responder todo en la primera hora.

## Servicio

Marcelo dio el ok el 01/11. Rodrigo le cobra **$85.000 por mes** por el contenido (aparte de Nevux). Mismo marketing que @nevux.app, adaptado a su tienda.

## Cómo se arma y se publica

- **Piezas:** `scripts/instagram/hd/`. `plantilla.html` (negro, plateado y azul #3498db, logo de la tienda), `semana-N.js` (carruseles e historias), `generar.js` (`node scripts/instagram/hd/generar.js semana-1`) y `reels.py` (Reels con la voz de Tomás, `es-AR-TomasNeural`, y música de fondo suave de `scripts/instagram/audio.py`). Fuentes en `scripts/instagram/hd/fuentes/`. Precios y fotos de `productos.json`, leídos de la tienda.
- **Salida:** `public/ig/hd/` → `https://nevux.ar/ig/hd/...`. Agenda en `public/ig/hd/agenda.json`.
- **Horarios (Argentina, lunes a viernes):** historia 1 a las **10:12**, historia 2 a las **14:42**, **post a las 19:48** e historia 3 (aviso del post) a las **21:12**. Las tareas programadas corren en la sesión `session_01PDD9EtCY9JFJzsoyimb9Yn`.

## Publicación manual desde el 01/11 (pedido de Rodrigo)

La **semana 1 la programó Rodrigo a mano en Meta Business Suite**: se le pasó día por día, en orden, con las historias, el post y su descripción. **Las 4 tareas automáticas de Hogar Digital quedaron apagadas** (`enabled: false`, no borradas) para que no se publique nada dos veces: historias de 10:12, 14:42 y 21:12, y post de las 19:48. Para las semanas siguientes, pasarle el material de la misma forma, salvo que pida volver a lo automático.
- Pendiente de confirmar con Marcelo: la historia del martes (1103-2) dice "EL MÁS ELEGIDO" sobre el smartwatch. Si no es el más vendido, cambiar el título.

## Semana 1 (2 al 6 de noviembre)

| Día | 19:48 | Pieza | Historias (10:12 · 14:42 · 21:12) |
|---|---|---|---|
| Lun 2/11 | Reel con voz (23 s) | Humidificador OVNI de noche ($73.900) | ¿OVNI o Volcán? · 40-60 % de humedad · Nuevo reel |
| Mar 3/11 | Carrusel (7) | 5 regalos de menos de $50.000 | ¿Próximo regalo? · Smartwatch $27.900 · Nuevo post |
| Mié 4/11 | Reel con voz (24 s) | Armá tu rincón relax (Volcán, Llama, G) | ¿Dónde te relajás? · Llama $72.100 · Nuevo reel |
| Jue 5/11 | Carrusel (6) | Así es comprar en Hogar Digital | ¿Qué te frena? · 30 días de garantía · Nuevo post |
| Vie 6/11 | Reel con voz (23 s) | Música para el finde (3 parlantes) | ¿Juntada o relax? · Parlante RGB $60.000 · Nuevo reel |

## Semana 2 (9 al 13 de noviembre), pasada a Rodrigo día por día el 08/11

Precios revisados en la tienda el 08/11 (`productos.json`). Promos reales que se ven en cada ficha: **10 % con transferencia** y **15 % llevando 2 / 25 % llevando 3**, "no acumulable con algunas promociones". **No usar** "cuotas sin interés" (el checkout cobra interés desde 2 cuotas) ni el monto del envío gratis hasta confirmarlo. Reels con CRF 14 y la portada integrada como primer cuadro (`reels.py`); carruseles e historias en JPG al 97 % (`generar.js semana-2`).

| Día | 19:48 | Pieza | Historias (10:12 · 14:42 · 21:12) |
|---|---|---|---|
| Lun 9/11 | Reel `smartwatch` (28 s) | Smartwatch KD99 Ultra ($27.900) | ¿Cuántas veces sacás el celular? · 10 % con transferencia · Nuevo reel |
| Mar 10/11 | Carrusel (6) `06-pagar-menos` | 2 formas de pagar menos | ¿Cómo pagás? · Auriculares con transferencia · Nuevo post |
| Mié 11/11 | Reel `bienestar` (33 s) | Masajeador ($46.990) y kit de gimnasio ($24.900) | ¿Relajarme o moverme? · Kit de gimnasio · Nuevo reel |
| Jue 12/11 | Carrusel (6) `08-conoce-hogar-digital` | Local, Marcelo y pedidos (cuadros de sus Reels) | ¿Sabías del local? · +35 años · Nuevo post |
| Vie 13/11 | Reel `luz` (26 s) | Luz de emergencia 60 LED ($54.990) | ¿Te quedaste sin luz? · 60 LED · Nuevo reel |

- Las fotos de la **balanza Oryx** en su tienda muestran "NEVUX" en la pantalla: se avisó a Rodrigo para que las cambien; no se usan.
- Sin métricas de la semana 1 (Windsor no estaba disponible en el chat del 08/11).

## Semana 3 (16 al 20 de noviembre), pasada a Rodrigo día por día el 15/11

Marcelo (15/11): no hace dropshipping y no quiere quedarse con mercadería; los productos con batería (parlantes, auriculares) se arruinan en stock. **Mostrar solo lo que tiene en stock y priorizar productos sin batería.** Evalúa sumar productos de Unidrop.

| Día | 19:48 | Pieza | Historias (10:12 · 14:42 · 21:12) |
|---|---|---|---|
| Lun 16/11 | Reel `auriculares` (27 s) | Auriculares Air Max con pantalla ($45.900) | ¿Auriculares o parlante? · Envío gratis desde $50.000 · Nuevo reel |
| Mar 17/11 | Carrusel (7) `09-combo-navideno` | Combo Navideño ($66.700, armado por Marcelo) | ¿Ya armaste el árbol? · El combo · Nuevo post |
| Mié 18/11 | Reel `combo` (30 s) | Combo Navideño (el trípode con aro ya no está en la tienda) | ¿Árbol o arbolito? · 5 cosas en un combo · Nuevo reel |
| Jue 19/11 | Carrusel (8) `10-como-comprar` | Así comprás en Hogar Digital, paso a paso (capturas en vivo, reloj del navegador en jueves 15 h) | ¿Ya compraste online? · Corte 18 h · Nuevo post |
| Vie 20/11 | Reel `volcan` (28 s) | Humidificador Volcán ($70.900) | ¿Encendido o apagado? · $63.810 con transferencia · Nuevo reel |

- **Combo Navideño:** la ficha no muestra envío gratis ni descuento por cantidad: no se prometen. Precio de lista: en la app $79.912 y en la web $89.900 (avisarle a Marcelo cuando vuelva).
- **Productos nuevos (parlante Mixor Impacto, smartwatch ZL73J, smartwatch LAXASFIT H7):** se armaron fotos con fondo de estudio oscuro (`public/clientes/hogar-digital/fotos-nuevas/`, script `scripts/instagram/hd/fondo.py`). Faltan fotos con fondo liso de los colores rojo, azul y negro del parlante.
- 13/11: Marcelo tuvo una venta orgánica (#114, $20.720) después del rediseño. Para usarla en el Instagram de Nevux, pedirle permiso.

## Semana 4 (23 al 27 de noviembre), pasada a Rodrigo día por día el 22/11

Catálogo revisado en vivo el 22/11 (36 productos, precio, stock y fotos de cada ficha; `scripts/instagram/hd/semana-4.js`). Cambios en la tienda: **ya no hay envío gratis desde $50.000** (`envioGratisDesde: 0`), el **Combo Navideño bajó a $44.000** (lista $51.600) y ya no trae los adornos, y llegaron productos nuevos (códigos MODS-, Oryx, Hyundai: parecen de Unidrop). No se usan productos con 2 o 3 unidades de stock. Sin promo de Black Friday cargada: el viernes va un carrusel de regalos.

| Día | 19:48 | Pieza | Historias (10:12 · 14:42 · 21:12) |
|---|---|---|---|
| Lun 23/11 | Carrusel (8) `11-novedades` | 6 productos nuevos | ¿Viste lo nuevo? · Reloj Oryx 3D · Nuevo post |
| Mar 24/11 | Reel `anteojos` (29 s) | Anteojos inteligentes Hyundai HY-C8 ($19.100) | ¿Auriculares o anteojos? · 9 h de música · Nuevo reel |
| Mié 25/11 | Carrusel (6) `12-combo-nuevo-precio` | Combo Navideño a $44.000 | ¿Cuándo armás el árbol? · $44.000 · Nuevo post |
| Jue 26/11 | Reel `antifaz` (28 s) | Antifaz Bluetooth para dormir ($19.100) | ¿Música o silencio? · 8 h de música · Nuevo reel |
| Vie 27/11 | Carrusel (6) `13-regalos-20000` | 4 regalos de menos de $20.000 | ¿Regalo del amigo invisible? · Morral $14.900 · Nuevo post |

- **Para Marcelo:** los anteojos Hyundai muestran un precio de lista de $144.372 (no se usa); el código del combo no nombra la estrella (confirmar si sigue incluida).

## Pendiente

- Si vence Windsor (~29/11): publicación manual, después de la de @nevux.app (ver `docs/instagram.md`).
- Perfil: nombre, bio y destacadas (lo cambia Rodrigo o Marcelo desde la app).
- Semana 2 (9 al 13/11) con lo que funcione mejor de la semana 1.

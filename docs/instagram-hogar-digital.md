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

## Pendiente

- Si vence Windsor (~29/11): publicación manual, después de la de @nevux.app (ver `docs/instagram.md`).
- Perfil: nombre, bio y destacadas (lo cambia Rodrigo o Marcelo desde la app).
- Semana 2 (9 al 13/11) con lo que funcione mejor de la semana 1.

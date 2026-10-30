# Landing (nevux.ar)

El código está en `app/components/landing/Landing.tsx`. El orden de las secciones sigue el curso de marketing (clases 1 a 5).

**Regla:** todo dato es real o es una cuenta que hace el visitante con sus números. Nada de precios tachados ni testimonios inventados.

| # | Sección | Concepto del curso |
|---|---|---|
| — | Franja "Análisis gratis" | Reciprocidad |
| 1 | Hero: "No te faltan visitas. Te faltan ventas." | Gancho contraintuitivo de los primeros 3 segundos; propuesta de valor |
| 2 | El problema + las tres preguntas | Etapa 1 (reconocimiento del problema); motivador de dolor; preguntas SPIN de situación y problema |
| 3 | Hacé la cuenta (calculadora) | Pregunta de implicación; anclaje honesto ("se paga con N ventas") |
| 4 | Mismo producto, otra ficha (antes/después real) | Sistema 2: la parte lógica después de la emocional |
| 5 | Las 22 piezas, agrupadas por lo que resuelven | Motivadores: confianza, decisión, ganancia e identidad |
| 6 | Demo interactiva | Reduce la incertidumbre (costo de riesgo) |
| 7 | Comparativa con apps sueltas y rediseño | Etapas 2 y 3 (búsqueda y evaluación): ser diferente |
| 8 | Cómo trabajamos | El vendedor como facilitador: baja el costo de esfuerzo |
| 9 | Por qué confiar (+ testimonios) | Prueba social al final |
| 10 | Precio, garantía y dos botones | Cierre de alternativa: análisis gratis o suscribirse |
| 11 | Preguntas frecuentes como objeciones | Objeciones de precio, tiempo, confianza y necesidad: validar y responder |
| 12 | "¿Y si el mes que viene…?" | Cierre "¿Y si…?" + consecuencia |

## Cómo cambiar cosas

- **Testimonios:** cargarlos en `TESTIMONIOS` (nombre, tienda, texto), solo con permiso del cliente. Con la lista vacía, no se muestran.
- **Precio:** `PRECIO`. Se usa en la calculadora, en la tarjeta de precio y en la respuesta "Es caro".
- **WhatsApp:** `WHATSAPP_URL`. Cada clic se registra como `Contact` en Meta y `generate_lead` en GA4, con el origen del botón (`franja`, `header`, `hero`, `precio`, `cierre`, `footer`, `barra-mobile`).

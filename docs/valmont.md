# Valmont & Co. — relojería (plan Premium, estilo Wess)

**Actualizado:** 31/10/2026.

## Qué es

- **El cliente:** un cliente de Rodrigo arma una relojería online. Rodrigo se encarga de todo y cobra cuando la tienda esté lista.
- **La tienda:** `valmontrelojes.mitiendanube.com`, plantilla **Morelia**. Ya no tiene contraseña.
- **Nevux:** pegado y funcionando. Línea: `<script src="https://nevux.ar/c/valmont.js" async></script>`. La configuración está en `lib/clientes.ts` → `valmont`.
- **Producto:** relojería **multimarca de originales**: Casio, G-Shock, Mistral, Tressa y smartwatches, comprados a distribuidores oficiales con factura y garantía.
  - **No se trabaja con réplicas.** El proveedor que mostró el cliente (@alltime.mayoristas: "Rolex", "Omega", "Patek", "Hublot", "TAG" y "G-Shock" a $20.000) vende réplicas. Se rechazó usar sus fotos y videos.
  - Si vuelven a aparecer fotos con logos de esas marcas, no se usan.
- **Identidad:**
  - Logo versión A (emblema V en círculo), en `public/clientes/valmont/logo-dorado.png`. El paquete completo se le pasó a Rodrigo.
  - Colores: negro #0C0B0A, dorado #C9A961 y blanco hueso #F4EFE6.
  - Tipografías: Cinzel y Cormorant (logo); Anton, Oswald e Inter (tienda estilo Wess).
- **Instagram:** @valmont.relojes. Lo maneja el cliente.

## Cómo lo quiere Rodrigo

**Idéntico a la tienda de Wess** (`wessindumentaria.com`, diseño de Praxis), pero con ambiente de relojería y en negro y dorado. Se trabaja **por partes**:

1. Rodrigo manda un video o una captura de una parte de Wess.
2. Yo la replico con código propio, con la misma estructura, efectos, textos y dinámica.
3. La pruebo y la publico, y le mando capturas.

Siempre revisar **los efectos**: qué se mueve, qué aparece al bajar, qué avanza solo. Rodrigo preguntó por uno que se me había pasado.

## Partes hechas

| Parte | Qué hay en Wess | Cómo quedó en Valmont | Dónde |
|---|---|---|---|
| **1. Portada** | Franja "CYBER WESS • TERMINA 04D 21H…" con cajas rojas y rayas; logo; etiqueta "DEL 31/10 AL 4/11"; "CYBER" rojo + "WESS" blanco gigantes; texto; botón blanco "TOCÁ ACÁ Y MIRÁ LAS PROMOS ↓"; franja roja diagonal | Franja "VALMONT & CO. • HORA OFICIAL" con la **hora de Argentina en vivo** (si hay `evento`, pasa a ser la cuenta regresiva); logo dorado; etiqueta "RELOJES ORIGINALES"; "VALMONT" dorado + "RELOJERÍA" blanco (Anton); botón "TOCÁ ACÁ Y MIRÁ LOS RELOJES ↓"; franja dorada diagonal y **esfera de reloj gigante con segundero girando** | `home.portada` · motor: bloque "Portada estilo Wess" en `initHome` |
| **2. Beneficios + vitrina** | Lista blanca con íconos de línea en círculo y títulos condensados ("3 cuotas sin interés", "20% OFF transferencia", "Envío a todo el país"); bloque negro "COMBOS CYBER" con logo, etiqueta roja y título gigante; **perchero** con tarjetas colgadas; carrusel que **avanza solo**; botón rojo "VER TODAS LAS PROMOS →" | Beneficios: "Relojes originales", "Garantía oficial", "Envío a todo el país". Vitrina "MÁS VENDIDOS" con etiqueta "SELECCIÓN VALMONT": **barra de exhibición dorada con ganchos**, tarjetas colgadas que **se balancean** y **avanzan solas cada 3 s** (se pausan al tocarlas). Cada tarjeta lleva etiqueta "ORIGINAL", nombre y precio. Botón "VER TODOS LOS RELOJES →" | `home.beneficios` (íconos de línea) y `home.vitrinas[0]` con `estilo: 'wess'` · motor: `vitrinaWess` |

**Antes de las partes, ya estaba hecho (tema Wess general, `premium.tema: 'wess'`):**

- **Títulos y etiquetas:** títulos condensados en mayúsculas y etiquetas con ◆.
- **Ficha oscura con olas:** cinta ancha, qué incluye, para regalar, antes vs. después rojo y dorado, comparativa con la **columna dorada rellena** y tildes en círculos, y preguntas frecuentes **sobre fondo dorado** con tarjetas blancas.
- **Tarjetas `'wess'`:** precio de lista tachado, caja "MEJOR PRECIO", cuotas y botón "VER →".
- **Home:** "Por qué Valmont" (tarjetas tipo etiqueta), preguntas frecuentes en negro y cierre "Esto fue una selección".

## Lo que sigue

1. **Parte 3 en adelante:** esperar el próximo video o captura de Wess que mande Rodrigo y replicarlo igual.
   - **Home de Wess, para referencia:** foto del producto con puntos, buscador de talle en pasos (en Valmont: medidor de muñeca en pasos), "Por qué Wess" en tarjetas tipo etiqueta, "Colgado por poco tiempo" (ofertas en perchas), preguntas frecuentes, locales con "Cómo llegar" (solo si el cliente tiene local), cierre y aviso de compra en vivo.
   - **Ficha de Wess, para referencia:** tabla de talles, "WESS EN MOVIMIENTO" (videos verticales), antes vs. después rojo y verde, "MIRALA DE CERCA" (fotos), "WESS VS LA MARCA GENÉRICA" con columna roja, cinta con ola, reseñas en carrusel, preguntas sobre rojo con íconos y "Productos similares".
2. **Productos:** la tienda todavía **no tiene productos**, así que la vitrina, las tarjetas y las fichas no se ven en su tienda.
   - Cuando el cliente consiga los relojes originales (fotos oficiales del distribuidor, modelos, precios y costos), armar el **CSV para importar en Tiendanube** y las fotos con estética de estudio.
   - Las vitrinas apuntan a `/productos/`. Cuando haya categorías por marca, sumar vitrinas y "Comprá por marca".
3. **Datos reales para reemplazar los textos genéricos:** garantía, medios de pago, descuento por transferencia, cuotas sin interés y envíos.
4. **Panel (lo hace Rodrigo):**
   - Apagar el contenido de ejemplo de Morelia en Editar diseño → Página de inicio: mensaje de bienvenida, productos de ejemplo, categorías, mensaje institucional, producto destacado, banners de promoción, testimonios, video, medios de envío e Instagram.
   - Encabezado en negro #0C0B0A con texto blanco.
   - Subir `valmont-horizontal-dorado.png` como logo.

## Cómo probar sin productos

- **Home:** probarla en la tienda real de Valmont.
- **Vitrina con productos reales:** en Playwright, sobre `hogardigital.com.ar`, inyectando la configuración de Valmont con `home.vitrinas[0].url = '/humidificadores-19h94/'`. Borrar los popups de esa tienda antes de la captura.
- **Ficha:** sobre una ficha Morelia, por ejemplo `fafala.mitiendanube.com/productos/panal-lavable-perra-18cz6/`, inyectando la configuración de Valmont.

## Otros archivos

- **Demo vieja de Valmont, estilo propio:** `nevux.ar/demo/valmont/` (`scripts/demo/valmont.py`). A Rodrigo **no le gustó**, porque quiere el estilo Wess. Sirve solo como muestra del plan Premium.

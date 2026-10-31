# Valmont & Co. — relojería (plan Premium, estilo Wess)

**Actualizado:** 31/10/2026. **Tienda terminada: Rodrigo pidió no tocar nada más.** Pendiente: ok del cliente → apagar (`activo: false`) hasta que pague → al pagar, prender con cobro automático por su email.

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
| **3. Grilla + categorías** | Sección blanca "PROMOCIONES LIMITADAS" con título condensado; grilla de 2 columnas con etiqueta roja "EXCLUSIVO CYBER" sobre la foto, "PRECIO OFICIAL" tachado, "QUEDAN 2", caja "MEJOR PRECIO", cuotas y "VER →"; debajo, fila de 4 categorías (PANTALONES, REMERAS, ABRIGOS, BERMUDAS) con prendas recortadas que **giran solas** | "RELOJES DESTACADOS" (Anton) con 6 productos reales de `/productos/` en 2 columnas (3 en computadora): etiqueta dorada "ORIGINAL" sobre la foto, precio de lista tachado, "QUEDAN N" **solo con el stock real** (3 o menos), "MEJOR PRECIO" solo si hay descuento por transferencia real, cuotas reales y "VER →". Debajo, categorías **por marca**: CASIO, G-SHOCK, MISTRAL y TRESSA, con **relojes dibujados (SVG propios, negro y dorado, sin logos) que giran en 3D**; llevan a la búsqueda de cada marca en la tienda hasta que haya categorías. Sin productos, se ocultan el título y la grilla y quedan las categorías | `home.grilla` · motor: `cargarGrilla` · dibujos en `public/clientes/valmont/cat-*.svg` |
| **4. Foto con puntos + Ofertas** | "Buscá el jean que no pase desapercibido." con link "→ Ver jeans baggy"; 4 detalles en las esquinas (TERMINACIONES FIRMES, CORTE BAGGY, ESTAMPADO DE IMPACTO, DENIM DE CALIDAD) unidos con **líneas** a **puntos que laten** sobre el jean; debajo, otra grilla "Ofertas" | "Buscá el reloj que no pase desapercibido." con link "→ Ver todos los relojes"; foto real del Omega Speedmaster Silver Snoopy (recortada y en diagonal, `detalle-reloj.webp`; Rodrigo pidió foto y no dibujo) y 4 detalles: Esfera con detalle, Corona y pulsadores, Bisel taquimétrico y Malla de acero; el link va a la ficha del Speedmaster. Al aparecer en pantalla **se dibujan las líneas** y **aparecen los puntos**, que después laten. La grilla "Ofertas" está lista en el motor (`home.grilla` acepta una lista) pero **no se activó en Valmont** hasta que el catálogo sea de originales | `home.puntos` con `estilo: 'wess'` · motor: `puntosWess` e `initPuntosWess` · foto en `public/clientes/valmont/detalle-reloj.webp` |
| **5. Cierre de la home** | "VER TODAS LAS OFERTAS →" debajo de las grillas; "TU TALLE EN 20 SEGUNDOS · Probate la ropa sin salir de casa" (buscador de talle en 5 pasos con personaje y medidas); "POR QUÉ WESS" con etiquetas colgadas y código de barras; "COLGADO POR POCO TIEMPO." (perchero curvo, productos colgados, precios en rojo a distintas alturas, flechas, título que se desenfoca y aparece); "LO QUE SIEMPRE NOS PREGUNTAN" a la izquierda con link; cierre "ESTO FUE UNA SELECCIÓN" en arco | Botón "VER TODOS LOS RELOJES →" en la grilla (`grilla.boton`) y precio visible en cada tarjeta. **Medidor de reloj** (`home.medidor`, id `#medidor`): para quién, muñeca (13 a 22 cm), estilo y uso; las fichas PARA, MUÑECA, CAJA y ESTILO se completan solas y al final recomienda el diámetro de caja. "POR QUÉ VALMONT" con 4 etiquetas colgadas que se balancean y código de barras. **"COLGADO POR POCO TIEMPO."** (`home.colgado`): barra curva, relojes reales en marcos colgados de perchas que se balancean, precios dorados a distintas alturas y flechas. Preguntas a la izquierda con link "Medí tu muñeca en 20 segundos" (`faqLink`) y cierre en arco | motor: `medidorReloj`, `initMedidor`, `colgadoHtml`, `cargarColgado` y tema Wess en `initPremium` |

**Antes de las partes, ya estaba hecho (tema Wess general, `premium.tema: 'wess'`):**

- **Títulos y etiquetas:** títulos condensados en mayúsculas y etiquetas con ◆.
- **Ficha oscura con olas:** cinta ancha, qué incluye, para regalar, antes vs. después rojo y dorado, comparativa con la **columna dorada rellena** y tildes en círculos, y preguntas frecuentes **sobre fondo dorado** con tarjetas blancas.
- **Tarjetas `'wess'`:** precio de lista tachado, caja "MEJOR PRECIO", cuotas y botón "VER →".
- **Home:** "Por qué Valmont" (tarjetas tipo etiqueta), preguntas frecuentes en negro y cierre "Esto fue una selección".

## Lo que sigue

1. **Home terminada (5 partes). Sigue la ficha de producto:** esperar el próximo video o captura de Wess que mande Rodrigo y replicarlo igual.
   - **Home de Wess, para referencia:** foto del producto con puntos, buscador de talle en pasos (en Valmont: medidor de muñeca en pasos), "Por qué Wess" en tarjetas tipo etiqueta, "Colgado por poco tiempo" (ofertas en perchas), preguntas frecuentes, locales con "Cómo llegar" (solo si el cliente tiene local), cierre y aviso de compra en vivo.
   - **Ficha de Wess, para referencia:** tabla de talles, "WESS EN MOVIMIENTO" (videos verticales), antes vs. después rojo y verde, "MIRALA DE CERCA" (fotos), "WESS VS LA MARCA GENÉRICA" con columna roja, cinta con ola, reseñas en carrusel, preguntas sobre rojo con íconos y "Productos similares".
2. **Productos (31/10):** el cliente cargó Rolex, Omega y Patek Philippe a $49.900 (réplicas) y categorías por esas marcas. **No se arma nada con esos productos** (ni categorías ni Ofertas). Rodrigo quedó en sacarlos. Antes: la tienda **no tenía productos**, así que la vitrina, las tarjetas y las fichas no se ven en su tienda.
   - Cuando el cliente consiga los relojes originales (fotos oficiales del distribuidor, modelos, precios y costos), armar el **CSV para importar en Tiendanube** y las fotos con estética de estudio.
   - Las vitrinas apuntan a `/productos/`. Cuando haya categorías por marca, sumar vitrinas y "Comprá por marca".
3. **Datos reales para reemplazar los textos genéricos:** garantía, medios de pago, descuento por transferencia, cuotas sin interés y envíos.
4. **Panel (lo hace Rodrigo):**
   - Apagar el contenido de ejemplo de Morelia en Editar diseño → Página de inicio: mensaje de bienvenida, productos de ejemplo, categorías, mensaje institucional, producto destacado, banners de promoción, testimonios, video, medios de envío e Instagram.
   - Encabezado en negro #0C0B0A con texto blanco.
   - Subir `valmont-horizontal-dorado.png` como logo.

## Ficha de producto estilo Wess (31/10/2026)

Rodrigo mandó la ficha completa de Wess y pidió "igual pero al mundo reloj". Se armó como `estiloFicha: 'wess'` con los textos en `config.ficha` (motor: `fichaWessArriba` y `fichaWessAbajo`).

| En Wess | En Valmont |
|---|---|
| Etiqueta "EXCLUSIVO CYBER" y título condensado | Etiqueta dorada "ORIGINAL" (`ficha.pill`) y título en Anton |
| "Precio final", "MEJOR PRECIO", precio grande con % OFF, "ahorrás", cuotas y logos de pago | Igual, con los datos reales: con descuento por transferencia muestra ese precio; si no, el precio de lista tachado y el % OFF. Cuotas solo si la tienda tiene cuotas sin interés |
| Recuadro de envío: cuenta regresiva "Comprá antes de las 18 h", fechas de llegada y envío gratis | Igual con `envio` (**provisorio: corte 14 h, lunes a viernes, 3 a 6 días hábiles; confirmar con el cliente**) |
| Armá tu combo (2 o 3 bermudas) | No aplica a relojes. Se reemplazó por "Elegí cómo pagarlo" en el bloque negro (solo con transferencia o cuotas reales) |
| "Te llega en bolsita de regalo", ★★★★★ CALIDAD WESS, botón rojo | "Llega en su caja, con papeles y accesorios", ★★★★★ CALIDAD VALMONT, botón dorado redondeado |
| Lista: Despachamos en el día, Probátelo en el local, Cambio en 10 días | Envío a todo el país, Caja, papeles y accesorios, Compra protegida (`ficha.confianza`) |
| Videos "03 · CORTE / CAÍDA BAGGY" | "MIRALO DE CERCA": fotos reales del producto con la misma etiqueta encima (`ficha.detalles`) |
| "LA BERMUDA QUE VA CON TODO" + viñetas + "ARMAR MI COMBO" | "EL RELOJ QUE VA CON TODO" + viñetas + "LO QUIERO" (lleva al botón de compra) |
| "HECHA PARA USARLA TODOS LOS DÍAS" (fotos con títulos) | "HECHO PARA USARLO TODOS LOS DÍAS": Esfera, Caja, Malla, Presentación |
| "VIENE LISTO PARA REGALAR" | Igual, "Caja y papeles" |
| "ELEGÍ TU TALLE SIN DUDAR" + "El modelo usa L" | Tabla muñeca → diámetro de caja + "¿Entre dos tamaños?" (o "Este reloj mide X mm" si el producto tiene `muneca.caja` en `porProducto`) y botón al medidor de la home |
| "WESS, DESDE CÓRDOBA" (6 tarjetas) | "COMPRÁ TRANQUILO · VALMONT & CO." (6 tarjetas sin datos inventados) |
| Preguntas y "ARMÁ EL TUYO" | Preguntas de `faq` y "ELEGÍ EL TUYO" con botón a la compra |

WhatsApp del cliente: +54 2954 688637 (`whatsapp: '5492954688637'`). Pendiente: datos reales de envío; videos propios si el cliente los tiene.

### Ajustes del 31/10 (pedido de Rodrigo)

- **Barra de compra fija:** mostraba la foto vacía (Morelia carga las fotos de a poco y el `src` es un marcador). Ahora toma la foto del `srcset` o de `og:image`.
- **Final de la ficha como Wess:** "Productos similares" con las tarjetas de la grilla en carrusel (etiqueta "PREMIUM", precio y "VER →"), y **pie estilo Wess** en toda la tienda: franja dorada "Registrate y recibí nuestras novedades.", marca, menú en filas con flecha, Instagram y WhatsApp, y franja legal gris (`initPie`, textos en `config.pie`).
- **Newsletter gris de la home:** oculto con `ocultar: ['[data-store="home-newsletter"]']`. El del pie queda como franja.
- **Sin la palabra "original":** Rodrigo pidió reemplazarla por "premium" o algo más elegante en todos lados (etiquetas, beneficios, por qué, preguntas, anuncios y cinta).
- **Cabecera estilo Wess:** fondo negro con borde dorado, íconos claros, todo en una fila y, en lugar del nombre en texto, la **V en 3D girando sobre sí misma** con "VALMONT" debajo (Wess usa un logo WebP animado de 46 cuadros que gira igual). Config: `cabecera: { inicial: 'V', nombre: 'VALMONT' }`, motor: `initCabecera`.
- **Productos similares llenos:** Tiendanube solo trae los de la misma categoría (a veces 1). Se completa con el resto del catálogo hasta 8 (`ficha.similaresCantidad`).
- **Plantilla:** Wess usa **Recife** (`LS.theme.code: "recife"`). El 31/10 Rodrigo pasó Valmont de Morelia a Recife. Nevux se probó entero sobre Recife (home, ficha, cabecera y pie). En Recife el pie ya trae el newsletter arriba, "Categorías" desplegable y la franja legal: `initPie` solo le pone colores, marca y redes. **Al cambiar de plantilla se pierde la línea de Nevux de "Sellos personalizados": hay que volver a pegarla.**

## Videos de producto

- **Cómo se hacen:** con una foto del reloj se arma un video vertical de unos 11 segundos (`/home/user/vid/render.py` en la sesión del 31/10). Tiene intro con la V, el reloj recortado sobre fondo negro con brillo dorado, destello de luz, tres primeros planos con etiqueta estilo Wess y el cierre "VALMONT & CO. · Relojería premium". Es animación sobre la foto real: no inventa ángulos.
- **Dónde van:** primera tarjeta de "Miralo de cerca" en la ficha (`fichaVideos` por producto en `porProducto`). Arrancan solos, sin sonido, en bucle, y se pausan fuera de pantalla.
- **Hechos (los 5 relojes):** Rolex Daytona (`/productos/valmont-co/`, `video-rolex-daytona.mp4`), Casio G-Shock G-Steel GST-B400BB-1A (`/productos/valmontco-com/`, `video-gshock-gst-b400.mp4`), Rolex Submariner Date (`/productos/rolex-submariner-date-acero-inoxidable-1roj1/`, `video-rolex-submariner.mp4`), Omega Speedmaster Silver Snoopy (`video-omega-speedmaster.mp4`) y Complications Gold (`/productos/valmontco-m/`, `video-complications-gold.mp4`; el texto del video no nombra marca porque la esfera de la foto dice solo "Geneve").

## Cobro

- **Plan Premium:** $69.900/mes. Link para mandarle al cliente: **https://nevux.ar/suscribirme?c=valmont**. Abre la página con el plan Premium y el botón a `mpago.la/2mkcebx`.
- **Cuando el cliente dé el ok:** apagar Nevux (`activo: false`) hasta que pague.
- **Cuando pague:** `activo: true` y `cobro: { tipo: 'mercadopago', email: '<email con el que se suscribió>', gracia: 5 }`.

## Cómo probar sin productos

- **Home:** probarla en la tienda real de Valmont.
- **Vitrina con productos reales:** en Playwright, sobre `hogardigital.com.ar`, inyectando la configuración de Valmont con `home.vitrinas[0].url = '/humidificadores-19h94/'`. Borrar los popups de esa tienda antes de la captura.
- **Ficha:** sobre una ficha Morelia, por ejemplo `fafala.mitiendanube.com/productos/panal-lavable-perra-18cz6/`, inyectando la configuración de Valmont.

## Otros archivos

- **Demo vieja de Valmont, estilo propio:** `nevux.ar/demo/valmont/` (`scripts/demo/valmont.py`). A Rodrigo **no le gustó**, porque quiere el estilo Wess. Sirve solo como muestra del plan Premium.

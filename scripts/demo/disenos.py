# Genera las demos del catálogo de diseños (public/demo/disenos/): una ficha por diseño con el mismo HTML base que usan
# las plantillas de Tiendanube, para mostrar el motor de Nevux funcionando. Se ven en nevux.ar/disenos dentro de celulares.
# Marca, fotos, precios y textos son ilustrativos (fotos de la demo de relojes). Sin reseñas: en las tiendas reales solo van las reales.
# Uso: python3 scripts/demo/disenos.py
import json, html, os

SALIDA = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'demo', 'disenos')
IMG = '/demo/valmont/img/'

CSS = """
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:#fff;color:#141414}
.demo{background:#141414;color:#fff;text-align:center;font:600 11px Inter;padding:6px 10px;letter-spacing:.04em}
header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #eee}
header b{font:800 17px Inter;letter-spacing:.24em}header span{font-size:20px}
.wrap{max-width:1100px;margin:0 auto;padding:0 16px}
#single-product{display:grid;gap:18px;padding:16px 0 24px}#single-product>*{min-width:0}@media(min-width:900px){#single-product{grid-template-columns:1.1fr 1fr}}
.gal img{width:100%;border-radius:14px;display:block;background:#f3f3f3}.thumbs{display:flex;gap:8px;margin-top:8px}.thumbs img{width:64px;border-radius:8px}
.migas{font-size:11px;color:#888;margin:4px 0 8px}
h1.js-product-name{font:800 26px Inter;margin:0 0 4px}
.js-price-container{margin:8px 0 14px}#price_display{font-size:26px;font-weight:800}
label{display:block;font:700 11px Inter;letter-spacing:.1em;text-transform:uppercase;color:#666;margin:12px 0 6px}
select{width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font:15px Inter;background:#fff}
.qty{display:flex;gap:10px;margin:16px 0 0}.qty input{width:70px;text-align:center;border:1px solid #ddd;border-radius:10px;font:16px Inter}
.btn-add{flex:1;background:#141414;color:#fff;border:0;border-radius:10px;padding:16px;font:700 14px Inter;cursor:pointer}
.stock{font-size:12px;color:#16a34a;margin-top:8px;font-weight:600}
.desc{font-size:14.5px;line-height:1.6;color:#444}
footer{background:#111;color:#999;text-align:center;padding:36px 16px;font-size:12px}
"""

FICHAS = {
    'ficha-oscura': {
        'titulo': 'Reloj Noir Sport', 'fotos': ['noir-1.jpg', 'noir-2.jpg', 'royal-1.jpg'], 'precio': 56250, 'stock': 1,
        'cfg': {
            'color': '#e1251b', 'transferencia': 20, 'estiloFicha': 'pro', 'packs': [], 'ventas': False,
            'carrito': {'envioGratis': 100000}, 'envio': {'corte': 14, 'dias': [1, 2, 3, 4, 5], 'min': 3, 'max': 6},
            'cuentaRegresiva': None,
            'pro': {
                'tema': 'oscuro', 'sello': 'Producto verificado · Nevux Demo',
                'presentacion': {'etiqueta': 'Noir Sport', 'titulo': 'Deportivo de día. Elegante de noche.', 'resumen': 'Caja de 44 mm · Malla de goma · 3 colores',
                                 'texto': 'Negro total con detalles que se notan de cerca. Pensado para usarlo todos los días, desde el gimnasio hasta una cena.',
                                 'puntos': ['Caja de 44 mm', 'Malla de goma', 'Resiste salpicaduras', 'Caja de regalo'], 'boton': 'Comprar ahora'},
                'problema': {'titulo': 'Un reloj más no te arma el look.', 'bajada': 'Lo que suele pasar con los relojes de todos los días:',
                             'items': [{'titulo': 'Se ven baratos', 'texto': 'Brillan de más y se rayan en semanas.'},
                                       {'titulo': 'Todos iguales', 'texto': 'El mismo modelo que tiene todo el mundo.'},
                                       {'titulo': 'Incómodos', 'texto': 'Mallas duras que molestan al rato.'},
                                       {'titulo': 'No combinan', 'texto': 'Colores que no van con nada.'}],
                             'solucion': 'El negro mate cambia todo: un reloj deportivo con presencia de reloj de vestir.'},
                'galeria': {'titulo': 'Miralo de todos los lados.', 'bajada': 'Así es el Noir Sport.',
                            'items': [{'tab': 'Detalle', 'titulo': 'Esfera negra con fecha', 'texto': 'Índices luminosos para leerlo de noche.'},
                                      {'tab': 'De costado', 'titulo': 'Corona y pulsadores', 'texto': 'Terminación mate que no marca huellas.'},
                                      {'tab': 'Colores', 'titulo': 'También en dorado', 'texto': 'Mismo modelo, otra presencia.'}]},
                'porque': {'titulo': 'Pensado para usarlo todos los días.', 'bajada': 'Cuatro detalles que lo separan de un reloj común.',
                           'items': [{'titulo': 'Negro mate', 'texto': 'No brilla de más y disimula el uso.'}, {'titulo': 'Malla de goma', 'texto': 'Cómoda en verano y en invierno.'},
                                     {'titulo': 'Fecha a la vista', 'texto': 'Un detalle práctico que se usa siempre.'}, {'titulo': 'Caja de regalo', 'texto': 'Llega listo para regalar.'}]},
                'oferta': {'recibis': 'El Noir Sport en su caja, con tarjeta de garantía.'},
            },
            'comparativa': {'titulo': '¿Por qué este reloj?', 'marca': 'Noir Sport', 'otro': 'Reloj común',
                            'filas': ['Negro mate con detalles', 'Malla de goma cómoda', 'Fecha a la vista', 'Caja de regalo', '20% OFF por transferencia'],
                            'otroFilas': ['Brillo de más', 'Malla dura', 'Sin fecha', 'Bolsita', 'Precio de lista']},
            'faq': [{'p': '¿Tiene garantía?', 'r': 'Sí, 6 meses por fallas de fabricación.'}, {'p': '¿Cuánto tarda el envío?', 'r': 'Entre 3 y 6 días hábiles a todo el país.'},
                    {'p': '¿Viene en caja?', 'r': 'Sí, viaja en su caja de regalo.'}],
            'whatsapp': '5490000000000',
        },
    },
    'ficha-clara': {
        'titulo': 'Reloj Classic Silver', 'fotos': ['classic-1.jpg', 'classic-2.jpg', 'chrono-1.jpg'], 'precio': 8750, 'stock': 15,
        'cfg': {
            'color': '#9b2c43', 'transferencia': 20, 'estiloFicha': 'pro', 'ventas': False,
            'carrito': {'envioGratis': 20000, 'acento': '#9b2c43'}, 'envio': {'corte': 14, 'dias': [1, 2, 3, 4, 5], 'min': 3, 'max': 6},
            'packs': [{'cantidad': 1, 'titulo': 'Llevá 1', 'descuento': 0}, {'cantidad': 2, 'titulo': 'Llevá 2', 'descuento': 10, 'etiqueta': 'MÁS ELEGIDO'},
                      {'cantidad': 3, 'titulo': 'Llevá 3', 'descuento': 15, 'etiqueta': 'MEJOR PRECIO'}],
            'cuentaRegresiva': {'hasta': '2099-01-01T00:00:00-03:00', 'texto': '🕐 El descuento por cantidad termina en'},
            'pro': {
                'tema': 'claro', 'sello': 'Producto verificado · Nevux Demo',
                'presentacion': {'etiqueta': 'Classic Silver', 'titulo': 'El reloj que va con todo, todos los días.', 'resumen': 'Plateado · Esfera blanca · Cuero negro',
                                 'texto': 'Sobrio y prolijo. Lo usás con jean o con traje y siempre queda bien.',
                                 'puntos': ['Caja plateada', 'Malla de cuero', 'Esfera blanca', 'Caja de regalo'], 'boton': 'Lo quiero'},
                'problema': {'titulo': 'Sabemos lo que te pasa', 'bajada': 'Y por qué con este se termina.', 'etiqueta': 'El problema',
                             'items': [{'titulo': 'Compraste relojes que se ven baratos', 'texto': 'A las semanas pierden el brillo.'},
                                       {'titulo': 'Mallas que molestan', 'texto': 'Duras y frías al tacto.'}],
                             'solucion': {'etiqueta': 'La solución', 'titulo': 'Con el Classic Silver',
                                          'items': ['Acabado plateado que no se ve barato.', 'Malla de cuero que se adapta a tu muñeca.', 'Diseño que combina con todo.']}},
                'porque': {'etiqueta': 'El producto', 'titulo': 'Lo que tiene y por qué importa', 'bajada': 'Cuatro detalles que se notan desde el primer uso.',
                           'items': [{'titulo': 'Caja plateada', 'texto': 'Clásica, para cualquier ocasión.'}, {'titulo': 'Garantía', 'texto': '6 meses por fallas de fabricación.'},
                                     {'titulo': 'Liviano', 'texto': 'Te olvidás de que lo tenés puesto.'}, {'titulo': 'Para regalar', 'texto': 'Llega en su caja.'}]},
            },
            'comparativa': {'titulo': 'Este reloj vs. el genérico', 'bajada': 'Compará antes de decidir: lo que vas a encontrar acá y lo que no.', 'etiqueta': 'Comparativa',
                            'marca': 'Classic', 'otro': 'Genérico', 'filas': ['Acabado que dura', 'Malla de cuero', 'Caja de regalo', 'Garantía de 6 meses']},
            'faq': [{'p': '¿Tiene garantía?', 'r': 'Sí, 6 meses por fallas de fabricación.'}, {'p': '¿Cómo elijo el tamaño?', 'r': 'La caja de 40 mm queda bien en casi todas las muñecas.'},
                    {'p': '¿Puedo cambiarlo?', 'r': 'Sí, tenés 30 días para cambiarlo.'}],
        },
    },
}


def pesos(n):
    return '$' + f'{round(n):,}'.replace(',', '.') + ',00'


def variante(precio, transf, stock):
    cuotas = {str(n): {'installment_value': round(precio / n, 2), 'interest': 0, 'total_value': precio, 'without_interests': True} for n in (1, 3)}
    return {'product_id': 1, 'price_number': precio, 'price_short': pesos(precio), 'compare_at_price_number': None,
            'price_with_payment_discount_short': pesos(precio * (1 - transf / 100)) if transf else None,
            'stock': stock, 'available': True, 'installments_data': json.dumps({'Mercado Pago': cuotas})}



CARRITO_HTML = """<div id="modal-cart" style="position:fixed;top:0;right:0;bottom:0;width:min(420px,92vw);background:#fff;z-index:100000;box-shadow:-10px 0 40px rgba(0,0,0,.2);transform:translateX(105%);transition:transform .45s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;font-family:Inter,sans-serif">
<div style="display:flex;justify-content:space-between;align-items:center;padding:18px 18px 14px"><b style="font:800 16px Inter;letter-spacing:.04em;text-transform:uppercase">Carrito de compras</b><span onclick="cerrarCarrito()" style="cursor:pointer;font-size:24px">×</span></div>
<div style="flex:1;overflow:auto;padding:0 18px"><div class="js-ajax-cart-list"></div></div>
<div style="padding:14px 18px 20px;border-top:1px solid #eee"><div style="display:flex;justify-content:space-between;font:600 14px Inter"><span>Subtotal (sin envío):</span><span class="js-cart-subtotal">$0,00</span></div>
<button style="width:100%;margin-top:12px;background:#111;color:#fff;border:0;border-radius:999px;padding:15px;font:800 13px Inter;letter-spacing:.1em;text-transform:uppercase">Iniciar compra</button></div></div>
<script>
function abrirCarrito(nombre,foto,precio,cant){var l=document.querySelector('#modal-cart .js-ajax-cart-list');l.innerHTML='<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #eee"><img src="'+foto+'" style="width:64px;height:64px;object-fit:cover;border-radius:8px"><div style="font:13px Inter"><b>'+nombre+'</b><div style="margin-top:4px">'+cant+' × $'+precio.toLocaleString('es-AR')+'</div></div></div>';
document.querySelector('#modal-cart .js-cart-subtotal').textContent='$'+(precio*cant).toLocaleString('es-AR')+',00';document.getElementById('modal-cart').style.transform='none';}
function cerrarCarrito(){document.getElementById('modal-cart').style.transform='translateX(105%)';}
</script>"""
os.makedirs(SALIDA, exist_ok=True)
for nombre, F in FICHAS.items():
    v = variante(F['precio'], F['cfg'].get('transferencia', 0), F['stock'])
    fotos = ''.join(f'<img class="js-product-slide" src="{IMG}{f}" alt="">' if i == 0 else '' for i, f in enumerate(F['fotos']))
    thumbs = ''.join(f'<img src="{IMG}{f}" alt="">' for f in F['fotos'])
    stock = 'Última unidad' if F['stock'] == 1 else f"{F['stock']} en stock"
    pagina = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(F['titulo'])} · Demo de Nevux</title><meta name="robots" content="noindex">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<meta property="og:image" content="{IMG}{F['fotos'][0]}">
<style>{CSS}</style><script>window.LS={json.dumps({'template': 'product', 'variants': [v], 'product': {'id': 1}})};
window.NEVUX_CFG={json.dumps(F['cfg'], ensure_ascii=False)};
if(NEVUX_CFG.cuentaRegresiva){{var f=new Date();f.setHours(23,59,59,0);NEVUX_CFG.cuentaRegresiva.hasta=f.toISOString();}}</script></head><body>
<div class="demo">DEMO de Nevux · Marca, fotos y precios ilustrativos</div>
<header><span>☰</span><b>NEVUX DEMO</b><span>🛒</span></header>
<div class="wrap"><div id="single-product" class="js-product-detail"><div class="gal">{fotos}<div class="thumbs">{thumbs}</div></div>
<div><div class="migas">Inicio · Productos · {html.escape(F['titulo'])}</div><h1 class="js-product-name">{html.escape(F['titulo'])}</h1>
<div class="js-price-container"><span id="price_display" class="js-price-display">{pesos(F['precio'])}</span></div>
<form id="product_form" class="js-product-form" onsubmit="event.preventDefault();setTimeout(function(){{abrirCarrito(&#39;{html.escape(F['titulo'])}&#39;,'{IMG}{F['fotos'][0]}',{F['precio']},+document.querySelector('.js-quantity-input').value||1)}},700)">
<label>Color</label><select><option>Negro</option><option>Plateado</option></select>
<div class="qty"><input class="js-quantity-input" name="quantity" type="number" value="1" min="1"><button type="submit" class="js-addtocart btn-add">Agregar al carrito</button></div>
<div class="stock">{stock}</div></form>
<h3 style="font:700 16px Inter;margin:26px 0 6px">Descripción</h3><p class="desc">Fotos y precios de demostración. En tu tienda se usan tus productos, tus precios y tus datos reales.</p></div></div></div>
<footer>Nevux Demo · Tienda de demostración</footer>
{CARRITO_HTML}
<script src="/nevux.js"></script></body></html>"""
    open(os.path.join(SALIDA, nombre + '.html'), 'w').write(pagina)
    print('ok', nombre)

# ----- Home premium (portada con clips, historias, categorías que rotan, tarjetas con foto que alterna) -----
MODELOS = [('Noir Sport', 'noir', 56250), ('Royal Gold', 'royal', 61900), ('Chrono Azul', 'chrono', 58900), ('Classic Silver', 'classic', 49900),
           ('Heritage', 'heritage', 52900), ('Noir Sport Dorado', 'royal', 61900)]
HOME_CFG = {
    'color': '#e1251b', 'transferencia': 20, 'ventas': False,
    'tarjetas': {'estilo': 'destacado', 'transferencia': 20, 'alternar': True},
    'anuncios': ['Envíos a todo el país', '20% OFF pagando con transferencia', '3 cuotas sin interés'],
    'home': {
        'portadaVideo': {'fotos': [IMG + 'hero-royal.png', IMG + 'noir-2.jpg', IMG + 'chrono-2.jpg', IMG + 'royal-2.jpg'], 'cada': 1400,
                         'etiqueta': 'Relojería · Nevux Demo', 'titulo': 'Lo que vas a usar siempre.',
                         'texto': 'Relojes elegidos uno por uno, con caja de regalo y garantía. Te lo mandamos a todo el país.',
                         'boton': 'Ver la colección', 'url': '#coleccion',
                         'historias': [{'icono': 'camion', 'titulo': 'Envíos a todo el país', 'texto': 'Con seguimiento desde que sale'},
                                       {'icono': 'tarjeta', 'titulo': '20% OFF', 'texto': 'Pagando con transferencia'},
                                       {'icono': 'escudo', 'titulo': 'Garantía de 6 meses', 'texto': 'Por escrito, en todos los relojes'}]},
        'rotador': {'etiqueta': 'Encontrá lo tuyo', 'items': [
            {'nombre': 'Deportivos', 'url': '#coleccion', 'foto': IMG + 'noir-1.jpg'}, {'nombre': 'Clásicos', 'url': '#coleccion', 'foto': IMG + 'classic-1.jpg'},
            {'nombre': 'Cronógrafos', 'url': '#coleccion', 'foto': IMG + 'chrono-1.jpg'}, {'nombre': 'Dorados', 'url': '#coleccion', 'foto': IMG + 'royal-1.jpg'}]},
        'porQue': {'etiqueta': 'Nevux Demo', 'titulo': 'Por qué elegirnos', 'items': [
            {'icono': '🎁', 'titulo': 'Caja de regalo', 'texto': 'En todos los relojes.'}, {'icono': '🛡️', 'titulo': 'Garantía', 'texto': '6 meses por escrito.'},
            {'icono': '💬', 'titulo': 'Atención real', 'texto': 'Te respondemos por WhatsApp.'}]},
    },
}
tarjetas = ''.join(f"""<div class="js-item-product" data-variants="{html.escape(json.dumps([variante(p, 20, 5)]))}"><a href="ficha-oscura.html"><div class="img"><img src="{IMG}{f}-1.jpg" alt=""><img class="item-image-secondary" src="{IMG}{f}-2.jpg" alt="" style="display:none"></div></a>
<div class="item-name">{html.escape(n)}</div><div class="item-price-container"><span class="js-price-display item-price">{pesos(p)}</span></div></div>""" for n, f, p in MODELOS)
home = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Home premium · Demo de Nevux</title><meta name="robots" content="noindex">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:10px 0 30px}}@media(min-width:800px){{.grid{{grid-template-columns:repeat(3,1fr)}}}}
.js-item-product{{background:#fff;border-radius:14px;text-decoration:none}}.js-item-product .img img{{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;display:block}}
.item-name{{font-size:13.5px;font-weight:600;margin:8px 0 2px}}.item-price{{font-weight:800}}.ttl{{font:900 26px Inter;text-transform:uppercase;font-style:italic;margin:34px 0 4px}}
</style><script>window.LS={json.dumps({'template': 'home'})};window.NEVUX_CFG={json.dumps(HOME_CFG, ensure_ascii=False)};</script></head><body>
<div class="demo">DEMO de Nevux Premium · Marca, fotos y precios ilustrativos</div>
<header class="js-head-main"><span>☰</span><b>NEVUX DEMO</b><span>🛒</span></header>
<div data-store="home-slider"></div>
<div class="wrap"><h2 class="ttl" id="coleccion">Lo que más sale</h2><div class="grid">{tarjetas}</div></div>
<footer class="js-footer">Nevux Demo · Tienda de demostración</footer>
<script src="/nevux.js"></script></body></html>"""
open(os.path.join(SALIDA, 'home.html'), 'w').write(home)
print('ok home')

# ----- Home Premium estilo Destino (referencia oficial del Premium, docs/referencias/destino.md) -----
# catalogo.html hace de "/productos/": el motor lee de ahí los productos reales, como en una tienda.
CATALOGO = [('Noir Sport', 'noir', 56250, 69900), ('Royal Gold', 'royal', 61900, 0), ('Chrono Azul', 'chrono', 58900, 72900), ('Classic Silver', 'classic', 49900, 0),
            ('Heritage', 'heritage', 52900, 64900), ('Noir Sport Dorado', 'royal', 61900, 0), ('Chrono Edición Azul', 'chrono', 58900, 0), ('Classic Cuero', 'classic', 49900, 59900)]
def var_cat(p, l):
    v = variante(p, 0, 5); v['compare_at_price_number'] = l or None; return v
cat = ''.join(f"""<div class="js-item-product" data-variants="{html.escape(json.dumps([var_cat(p, l)]))}"><a href="ficha-oscura.html" title="{html.escape(n)}"><img src="{IMG}{f}-1.jpg" alt=""><img src="{IMG}{f}-2.jpg" alt=""></a>
<div class="js-item-name">{html.escape(n)}</div><span class="js-price-display">{pesos(p)}</span></div>""" for n, f, p, l in CATALOGO)
open(os.path.join(SALIDA, 'catalogo.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Catálogo demo</title></head><body>{cat}</body></html>')

CAT_URL = '/demo/disenos/catalogo.html'
DESTINO_CFG = {
    'color': '#111111', 'transferencia': 15, 'whatsapp': '5490000000000',
    'tarjetas': {'transferencia': 15, 'cuotas': 6},
    'ventas': {'estilo': 'destino', 'marca': 'Nevux Demo', 'cada': 9},
    'carrito': {'envioGratis': 120000}, 'envio': {'corte': 14, 'dias': [1, 2, 3, 4, 5], 'min': 3, 'max': 6},
    'home': {
        'destino': {
            'cinta': ['Envío gratis + *2 relojes*', '3 y 6 cuotas *sin interés*', '-15% off *transferencia*', 'Cambios *fáciles*'],
            'portada': {'fotos': [IMG + 'hero-royal.png', IMG + 'noir-2.jpg', IMG + 'chrono-2.jpg'], 'etiqueta': 'Nevux Demo™ · Hecho en Argentina',
                        'titulo': 'No es solo un reloj.', 'texto': 'Es una forma de expresarte.', 'boton': 'Ver nuevos', 'url': '#nvd', 'boton2': 'Armá tu look', 'url2': '#nvd', 'productosUrl': CAT_URL},
            'beneficios': [{'icono': 'transferencia', 'titulo': '15% off', 'texto': 'Pagando con transferencia'}, {'icono': 'cuotas', 'titulo': '3 y 6 cuotas', 'texto': 'Sin interés'},
                           {'icono': 'envio', 'titulo': 'Envío gratis +120K', 'texto': '2 relojes · envío gratis'}, {'icono': 'garantia', 'titulo': 'Garantía', 'texto': '6 meses por escrito'}],
            'tira': {'items': [{'nombre': n, 'url': '#', 'foto': IMG + f + '-1.jpg'} for n, f in [('Deportivos', 'noir'), ('Dorados', 'royal'), ('Cronógrafos', 'chrono'), ('Clásicos', 'classic'), ('Cuero', 'heritage'), ('Black', 'noir')]]},
            'destacados': [{'etiqueta': 'Ofertas · Stock limitado', 'titulo': 'Destacados', 'url': CAT_URL, 'cantidad': 4},
                           {'etiqueta': 'Destacados', 'titulo': 'Lo más elegido', 'url': CAT_URL, 'carrusel': True, 'desde': 2, 'cantidad': 6},
                           {'etiqueta': 'Van con tu estilo', 'titulo': 'Esto es para vos', 'url': CAT_URL, 'carrusel': True, 'desde': 1, 'cantidad': 6}],
            'comunidad': {'etiqueta': 'Comunidad 👻', 'titulo': 'Así lo usan', 'cuenta': '@nevux.demo', 'url': '#',
                          'fotos': [{'foto': IMG + f, 'producto': n} for f, n in [('noir-2.jpg', 'Noir Sport'), ('royal-2.jpg', 'Royal Gold'), ('chrono-2.jpg', 'Chrono Azul'), ('classic-2.jpg', 'Classic Silver'), ('heritage-2.jpg', 'Heritage'), ('noir-1.jpg', 'Noir Sport'), ('royal-1.jpg', 'Royal Gold')]]},
            'numeros': {'titulo': 'Nos eligen *todos los días*', 'items': [{'valor': 38, 'texto': 'Envíos diarios'}, {'valor': 27622, 'prefijo': '+', 'texto': 'Ventas'}, {'valor': 889, 'prefijo': '+', 'texto': 'Reseñas'}, {'valor': 2, 'texto': 'Locales'}]},
            'resenas': {'titulo': 'Ellos ya compraron *Nevux Demo*', 'puntaje': 4.9, 'cantidad': '+1.000', 'url': '#', 'items': [
                {'nombre': 'Reseña de ejemplo', 'producto': 'Noir Sport', 'texto': 'Acá van las reseñas reales de tus clientes, con su nombre y el producto que compraron.'},
                {'nombre': 'Reseña de ejemplo', 'producto': 'Royal Gold', 'texto': 'Se leen de tu app de reseñas o las cargamos a mano. Nunca inventadas.'},
                {'nombre': 'Reseña de ejemplo', 'producto': 'Chrono Azul', 'texto': 'La pista avanza sola de a una tarjeta, como en Destino.'},
                {'nombre': 'Reseña de ejemplo', 'producto': 'Classic Silver', 'texto': 'Arriba se muestra tu puntaje real y el botón para dejar una reseña.'},
                {'nombre': 'Reseña de ejemplo', 'producto': 'Heritage', 'texto': 'Sin reseñas reales, esta sección no aparece.'}]},
            'faq': [{'p': '¿Cómo elijo mi reloj?', 'r': 'Escribinos por WhatsApp y te ayudamos a elegir.'}, {'p': '¿Cuándo llega mi pedido?', 'r': 'Entre 3 y 6 días hábiles a todo el país.'}, {'p': '¿Puedo cambiarlo?', 'r': 'Sí, tenés 30 días para cambiarlo.'}],
            'banner': {'etiqueta': '[ Nevux Demo™ ]', 'titulo': 'Armá tu look.', 'foto': IMG + 'hero-royal.png', 'boton': 'Nuevo drop', 'url': '#'},
            'locales': {'etiqueta': 'Nevux Demo® / Buenos Aires', 'titulo': '¿Lo querés ver en persona?', 'texto': 'Vení al local a probártelo. Te ayudamos a elegir.',
                        'items': [{'zona': 'Microcentro', 'nombre': 'Local Obelisco', 'direccion': 'Obelisco, Buenos Aires', 'horario': 'Lun a vie 10 a 19 h · Sáb 10 a 14 h'}]},
        },
        'rotador': {'etiqueta': 'Armá tu look', 'items': [{'nombre': 'Deportivos', 'url': '#', 'foto': IMG + 'noir-2.jpg'}, {'nombre': 'Dorados', 'url': '#', 'foto': IMG + 'royal-2.jpg'},
                                                          {'nombre': 'Cronógrafos', 'url': '#', 'foto': IMG + 'chrono-2.jpg'}, {'nombre': 'Clásicos', 'url': '#', 'foto': IMG + 'classic-2.jpg'}]},
    },
}
dest = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Home Premium estilo Destino · Demo de Nevux</title><meta name="robots" content="noindex">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style><script>window.LS={json.dumps({'template': 'home'})};window.NEVUX_CFG={json.dumps(DESTINO_CFG, ensure_ascii=False)};</script></head><body>
<div class="demo">DEMO de Nevux Premium · Marca, fotos, números y reseñas ilustrativos</div>
<header class="js-head-main"><span>☰</span><b>NEVUX DEMO</b><span style="cursor:pointer" onclick="abrirCarrito('Noir Sport','{IMG}noir-1.jpg',56250,1)">🛒</span></header>
<div data-store="home-slider"></div>
<div class="wrap" id="nvd" style="height:20px"></div>
<div style="display:none">{cat}</div>
<footer class="js-footer">Nevux Demo · Tienda de demostración</footer>
{CARRITO_HTML}
<script src="/nevux.js"></script></body></html>"""
open(os.path.join(SALIDA, 'home-destino.html'), 'w').write(dest)
print('ok home-destino')

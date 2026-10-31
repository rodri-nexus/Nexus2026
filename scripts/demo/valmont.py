# Genera la tienda demo de Valmont & Co. (public/demo/valmont/): una home y una ficha por modelo con el mismo
# HTML base que usan las plantillas de Tiendanube, para mostrar el script Premium de Nevux funcionando.
# Fotos, precios y especificaciones son ilustrativos (la tienda real se arma con las fotos y datos del proveedor).
# Uso: python3 scripts/demo/valmont.py
import json, html, os

SALIDA = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'demo', 'valmont')

MODELOS = [
    {'id': 'heritage', 'nombre': 'Valmont Heritage', 'linea': 'Clásico', 'precio': 50000, 'caja': 40,
     'texto': 'Caja dorada, esfera marfil y malla de cuero marrón. El reloj para todos los días que también va con traje.',
     'specs': [['Diámetro de caja', '40 mm'], ['Caja', 'Tono dorado'], ['Esfera', 'Marfil con fecha'], ['Malla', 'Cuero marrón'], ['Movimiento', 'Cuarzo']]},
    {'id': 'noir', 'nombre': 'Valmont Noir Sport', 'linea': 'Deportivo', 'precio': 50000, 'caja': 44,
     'texto': 'Negro total con detalles dorados y malla de goma. Para quien quiere un reloj con presencia.',
     'specs': [['Diámetro de caja', '44 mm'], ['Caja', 'Negro mate'], ['Esfera', 'Negra con fecha'], ['Malla', 'Goma'], ['Movimiento', 'Cuarzo']]},
    {'id': 'chrono', 'nombre': 'Valmont Chrono Azul', 'linea': 'Cronógrafo', 'precio': 50000, 'caja': 42,
     'texto': 'Esfera azul con tres subesferas y malla de acero. El más elegido para regalar.',
     'specs': [['Diámetro de caja', '42 mm'], ['Caja', 'Plateada'], ['Esfera', 'Azul con 3 subesferas'], ['Malla', 'Metálica'], ['Movimiento', 'Cuarzo']]},
    {'id': 'classic', 'nombre': 'Valmont Classic Silver', 'linea': 'Clásico', 'precio': 50000, 'caja': 40,
     'texto': 'Plateado con esfera blanca y malla de cuero negro. Sobrio, prolijo, para cualquier ocasión.',
     'specs': [['Diámetro de caja', '40 mm'], ['Caja', 'Plateada'], ['Esfera', 'Blanca'], ['Malla', 'Cuero negro'], ['Movimiento', 'Cuarzo']]},
    {'id': 'royal', 'nombre': 'Valmont Royal Gold', 'linea': 'Elegante', 'precio': 50000, 'caja': 42,
     'texto': 'Dorado completo con esfera negra. El que se nota apenas entrás a un lugar.',
     'specs': [['Diámetro de caja', '42 mm'], ['Caja', 'Tono dorado'], ['Esfera', 'Negra con fecha'], ['Malla', 'Metálica dorada'], ['Movimiento', 'Cuarzo']]},
]

def cuotas(precio):
    # 3 cuotas sin interés y hasta 6 con interés (datos de muestra con la misma forma que los de Tiendanube)
    d = {str(n): {'installment_value': round(precio / n, 2), 'interest': 0, 'total_value': precio, 'without_interests': True} for n in (1, 3)}
    d['6'] = {'installment_value': round(precio * 1.18 / 6, 2), 'interest': 0.18, 'total_value': round(precio * 1.18, 2), 'without_interests': False}
    return json.dumps({'Mercado Pago': d})

def variante(m):
    return {'product_id': m['id'], 'price_number': m['precio'], 'price_short': '$' + f"{m['precio']:,}".replace(',', '.'),
            'compare_at_price_number': None, 'price_with_payment_discount_short': None, 'stock': None, 'available': True,
            'installments_data': cuotas(m['precio'])}

def pesos(n):
    return '$' + f'{n:,}'.replace(',', '.') + ',00'

CSS = """
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f4ee;color:#141210}
a{color:inherit}.demo{background:#c9a961;color:#141210;text-align:center;font:600 12px Inter;padding:7px 10px;letter-spacing:.04em}
header{background:#0c0b0a;padding:14px 18px;display:flex;align-items:center;justify-content:space-between}
header img{height:42px}header nav{display:flex;gap:18px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#e9e2d4}header nav a{text-decoration:none}
.wrap{max-width:1100px;margin:0 auto;padding:0 16px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:28px 0}@media(min-width:800px){.grid{grid-template-columns:repeat(4,1fr)}}
.js-item-product{background:#fff;border-radius:14px;padding:10px;text-decoration:none}
.js-item-product img{width:100%;border-radius:10px;display:block}
.item-name{font-size:14px;margin:10px 0 4px}.item-price{font-weight:700;font-size:16px}
.ttl{font:500 30px 'Cormorant Garamond',serif;text-align:center;margin:40px 0 0}
footer.js-footer{background:#0c0b0a;color:#9c8f78;text-align:center;padding:40px 16px;font-size:13px;margin-top:40px}
footer img{height:36px;margin-bottom:10px}
#single-product{display:grid;gap:22px;padding:22px 0}#single-product>*{min-width:0}@media(min-width:900px){#single-product{grid-template-columns:1.1fr 1fr}}
.gal img{width:100%;border-radius:16px;display:block}.thumbs{display:flex;gap:8px;margin-top:8px}.thumbs img{width:72px;border-radius:8px}
h1.js-product-name{font:500 34px 'Cormorant Garamond',serif;margin:6px 0}.linea{font-size:12px;letter-spacing:.3em;color:#9c8f78;text-transform:uppercase}
.js-price-container{margin:8px 0 16px}#price_display{font-size:28px;font-weight:700}
.btn-add{width:100%;background:#0c0b0a;color:#f4efe6;border:0;border-radius:10px;padding:16px;font:700 14px Inter;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
.desc{font-size:15px;line-height:1.6;color:#3a352f}
"""

def pagina(titulo, template, cuerpo, variantes=None):
    ls = {'template': template}
    if variantes: ls['variants'] = variantes
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(titulo)} · Valmont & Co. (demo)</title><meta name="robots" content="noindex">
<link rel="icon" href="img/favicon.png"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap" rel="stylesheet">
<style>{CSS}</style><script>window.LS={json.dumps(ls)};</script></head><body>
<div class="demo">DEMO de Nevux Premium · Fotos, precios y datos ilustrativos</div>
<header><a href="./"><img src="img/logo.png" alt="Valmont & Co."></a><nav><a href="./">Colección</a></nav></header>
{cuerpo}
<footer class="js-footer"><img src="img/logo.png" alt=""><div>Valmont & Co. · Relojería · Tienda de demostración</div></footer>
<script src="config.js"></script><script src="/nevux.js" async></script></body></html>"""

def tarjeta(m):
    v = html.escape(json.dumps([variante(m)]))
    return f"""<div class="js-item-product" data-variants="{v}"><a href="{m['id']}.html"><img src="img/{m['id']}-1.jpg" alt="{html.escape(m['nombre'])}"></a>
<div class="item-name"><a href="{m['id']}.html" style="text-decoration:none">{html.escape(m['nombre'])}</a></div><div class="item-price-container"><span class="js-price-display item-price">{pesos(m['precio'])}</span></div></div>"""

os.makedirs(SALIDA, exist_ok=True)
home = f"""<div data-store="home-slider"></div><div class="wrap"><h2 class="ttl" id="coleccion">La colección</h2><div class="grid">{''.join(tarjeta(m) for m in MODELOS)}</div></div>"""
open(os.path.join(SALIDA, 'index.html'), 'w').write(pagina('Inicio', 'home', home))

por = {}
for m in MODELOS:
    otros = [x for x in MODELOS if x['id'] != m['id']][:4]
    cuerpo = f"""<div class="wrap"><div id="single-product" class="js-product-detail"><div class="gal"><img class="js-product-slide" src="img/{m['id']}-1.jpg" alt="">
<div class="thumbs"><img src="img/{m['id']}-1.jpg" alt=""><img src="img/{m['id']}-2.jpg" alt=""></div></div>
<div><div class="linea">{m['linea']}</div><h1 class="js-product-name">{html.escape(m['nombre'])}</h1>
<div class="js-price-container"><span id="price_display" class="js-price-display">{pesos(m['precio'])}</span></div>
<form id="product_form" class="js-product-form" onsubmit="event.preventDefault();alert('Demo: en la tienda real este botón agrega al carrito.')">
<button type="submit" class="js-addtocart btn-add">Agregar al carrito</button></form>
<h3 style="font:500 22px 'Cormorant Garamond',serif;margin:30px 0 8px">Descripción</h3><p class="desc">{html.escape(m['texto'])}</p></div></div>
<h2 class="ttl">También te puede gustar</h2><div class="grid">{''.join(tarjeta(x) for x in otros)}</div></div>"""
    open(os.path.join(SALIDA, m['id'] + '.html'), 'w').write(pagina(m['nombre'], 'product', cuerpo, [variante(m)]))
    por[m['id']] = {'especificaciones': {'titulo': 'Especificaciones', 'filas': m['specs']}, 'muneca': {'caja': m['caja']}}

cfg = {
    'color': '#c9a961',
    'marca': {'oscuro': '#0c0b0a', 'fuente': 'inherit'},
    'premium': {'titulos': 'Cinzel', 'texto': 'Cormorant Garamond', 'animar': True},
    'transferencia': 10,
    'precios': True,
    'tarjetas': {'estilo': 'destacado', 'transferencia': 10},
    'anuncios': ['Envíos a todo el país', 'Garantía Valmont de 6 meses', '3 cuotas sin interés'],
    'mediosDePago': ['Visa', 'Mastercard', 'Mercado Pago', 'Transferencia'],
    'estiloFicha': 'oscuro',
    'packs': [],
    'envio': {'corte': 16, 'dias': [1, 2, 3, 4, 5], 'min': 3, 'max': 6, 'zona': 'a todo el país'},
    'cuentaRegresiva': True,
    'cinta': ['Garantía Valmont', 'Caja de regalo incluida', 'Envíos a todo el país', '3 cuotas sin interés'],
    'incluye': {'titulo': 'Qué incluye tu Valmont', 'items': [
        {'icono': '⌚', 'titulo': 'Tu reloj', 'texto': 'Revisado antes de salir.'},
        {'icono': '🎁', 'titulo': 'Caja Valmont', 'texto': 'Lista para regalar.'},
        {'icono': '📜', 'titulo': 'Tarjeta de garantía', 'texto': '6 meses por fallas.'},
        {'icono': '🚚', 'titulo': 'Envío protegido', 'texto': 'Con seguimiento.'}]},
    'regalo': {'titulo': '¿Es para regalar?', 'texto': 'Viaja en su caja Valmont. Avisanos y le sumamos una tarjeta con tu mensaje.'},
    'comparativa': {'titulo': '¿Por qué Valmont?', 'marca': 'Valmont', 'otro': 'Genérico', 'filas': ['Caja de regalo incluida', 'Garantía por escrito', 'Atención personalizada', 'Diseño propio']},
    'faq': [
        {'p': '¿Tiene garantía?', 'r': 'Sí, 6 meses por fallas de fabricación, con tarjeta de garantía.'},
        {'p': '¿Cuánto tarda en llegar?', 'r': 'Despachamos de lunes a viernes y llega en 3 a 6 días hábiles.'},
        {'p': '¿Viene en caja?', 'r': 'Sí, todos los relojes viajan en su caja Valmont.'},
        {'p': '¿Puedo pagar en cuotas?', 'r': 'Sí, en 3 cuotas sin interés con tarjeta.'}],
    'porProducto': por,
    'ventas': False,
    'home': {
        'hero': {'etiqueta': 'Valmont & Co. · Relojería', 'titulo': 'El tiempo,', 'destacado': 'bien llevado.',
                 'texto': 'Relojes elegidos uno por uno, con caja de regalo y garantía Valmont.',
                 'foto': 'img/hero-royal.png', 'url': '#coleccion', 'boton': 'Ver la colección'},
        'beneficios': [
            {'icono': '🎁', 'titulo': 'Caja de regalo', 'texto': 'En todos los relojes.'},
            {'icono': '🛡️', 'titulo': 'Garantía Valmont', 'texto': '6 meses por escrito.'},
            {'icono': '💳', 'titulo': '3 cuotas sin interés', 'texto': 'Con tarjeta.'}],
        'puntos': {'etiqueta': 'De cerca', 'titulo': 'Valmont Chrono Azul', 'texto': 'Tocá cada punto.', 'foto': 'img/chrono-2.jpg',
                   'url': 'chrono.html', 'boton': 'Ver el Chrono', 'items': [
                       {'x': 50, 'y': 24, 'titulo': 'Bisel pulido', 'texto': 'Brillo que se nota de lejos.'},
                       {'x': 42, 'y': 50, 'titulo': 'Tres subesferas', 'texto': 'El detalle de un cronógrafo.'},
                       {'x': 73, 'y': 50, 'titulo': 'Corona', 'texto': 'Para ajustar la hora.'},
                       {'x': 50, 'y': 88, 'titulo': 'Malla metálica', 'texto': 'Se ajusta a tu muñeca.'}]},
        'porQue': {'etiqueta': 'Valmont & Co.', 'titulo': 'Por qué Valmont', 'items': [
            {'destacado': 'Caja', 'titulo': 'De regalo', 'texto': 'Cada reloj viaja en su caja Valmont.', 'pie': 'Presentación'},
            {'destacado': '6 meses', 'titulo': 'De garantía', 'texto': 'Por escrito, por fallas de fabricación.', 'pie': 'Garantía Valmont'},
            {'destacado': '3 a 6 días', 'titulo': 'A todo el país', 'texto': 'Despachamos de lunes a viernes.', 'pie': 'Envío protegido'}]},
        'faqTitulo': 'Lo que siempre nos preguntan',
        'faq': [{'p': '¿Tiene garantía?', 'r': 'Sí, 6 meses por fallas de fabricación.'}, {'p': '¿Viene en caja?', 'r': 'Sí, todos en su caja Valmont.'}],
        'cierre': {'etiqueta': 'Valmont & Co.', 'titulo': 'Encontrá el tuyo', 'texto': 'Toda la colección, con caja de regalo y garantía.', 'boton': 'Ver la colección', 'url': './'}
    }
}
open(os.path.join(SALIDA, 'config.js'), 'w').write('/* Configuración de Nevux Premium para la demo de Valmont & Co. */\nwindow.NEVUX_CFG = ' + json.dumps(cfg, ensure_ascii=False, indent=1) + ';\n')
print('ok', len(MODELOS), 'fichas')

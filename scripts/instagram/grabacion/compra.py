# Reel "Una compra real en Hogar Digital": grabación de la tienda en vivo + voz de Tomás + música suave + rótulos de Nevux.
# Uso: python3 scripts/instagram/grabacion/compra.py [compra|movimiento]   (necesita Playwright, edge-tts, numpy, Pillow y ffmpeg)
# Sale en public/ig/reels/compra.mp4 (+ .jpg). La portada va integrada como primer cuadro.
import json, os, subprocess, sys, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, ".."))
from audio import tts, dur, mezclar

RAIZ = os.path.join(AQUI, "..", "..", "..")
SALIDA = os.path.join(RAIZ, "public", "ig", "reels")
FUENTES = os.path.join(AQUI, "..", "hd", "fuentes")
W, H, FPS = 1080, 1920, 30
VERDE, VERDE2, BG = (52, 211, 153), (110, 231, 183), (7, 8, 10)
F = lambda n, s: ImageFont.truetype(os.path.join(FUENTES, n), s)
HOME = "https://hogardigital.com.ar/"
OVNI = "https://hogardigital.com.ar/productos/humidificador-ovni-267/"

REELS = {}
REELS["compra"] = [
    dict(accion="abrir", url=HOME, et="CASO REAL · EN VIVO", tit="Una compra real en Hogar Digital", voz="Así compra un cliente en Hogar Digital. Es su tienda real, en vivo."),
    dict(accion="bajar", texto="ATENCIÓN POR WHATSAPP", margen=330, et="1 · LA HOME", tit="La confianza, primero", voz="Apenas entra, ve envíos a todo el país, garantía y atención por WhatsApp."),
    dict(accion="bajar", texto="DESTACADOS", margen=120, et="2 · LOS PRODUCTOS", tit="Precio y descuento a la vista", voz="Baja, y cada producto tiene el precio y el descuento a la vista."),
    dict(accion="tocar", texto="HUMIDIFICADOR OVNI", url=OVNI, et="3 · LA FICHA", tit="Toca el humidificador OVNI", voz="Toca el humidificador OVNI, y entra a la ficha."),
    dict(accion="bajar", texto="Pagando con transferencia", margen=330, et="3 · LA FICHA", tit="Cuánto paga y cuánto ahorra", voz="Ve cuánto paga con transferencia, y cuánto ahorra."),
    dict(accion="bajar", texto="Sale hoy", margen=200, et="3 · LA FICHA", tit="Cuándo sale su pedido", voz="Y cuándo sale su pedido, con la hora de corte."),
    dict(accion="carrito", et="4 · EL CARRITO", tit="Envío gratis, confirmado", voz="Lo agrega, y el carrito le confirma que tiene envío gratis."),
    dict(accion="panel", texto="TOTAL", margen=60, et="4 · EL CARRITO", tit="Elige cómo pagar", voz="Elige cómo pagar, y con transferencia ve el descuento antes de pagar."),
    dict(accion="cierre", voz="Todo con los datos reales de su tienda. ¿Querés la tuya así? Comentá ficha."),
]
REELS["movimiento"] = [
    dict(accion="abrir", url=HOME, et="CASO REAL · EN VIVO", tit="Sus Reels, dentro de su tienda", voz="¿Tenés videos de tus productos en Instagram? Mirá dónde los puso Hogar Digital."),
    dict(accion="bajar", texto="en movimiento", margen=150, vivo=True, et="EN MOVIMIENTO", tit="Sus videos, en la home", voz="En su home hay una sección con sus propios Reels."),
    dict(accion="vivo", et="EN MOVIMIENTO", tit="Se reproducen solos", voz="Se reproducen solos, sin sonido, y van pasando como en Instagram."),
    dict(accion="vivo", et="EN MOVIMIENTO", tit="Productos funcionando", voz="Quien entra a la tienda ve los productos funcionando, y a Marcelo explicándolos."),
    dict(accion="vivo", et="EN MOVIMIENTO", tit="Cada uno abre su Reel", voz="Y si toca uno, se abre ese Reel en su Instagram."),
    dict(accion="cierre", voz="¿Tenés videos en Instagram? Pueden estar en tu tienda. Comentá ficha."),
]
NOMBRE = sys.argv[1] if len(sys.argv) > 1 else "compra"
ESCENAS = REELS[NOMBRE]

def fondo():
    im = Image.new("RGB", (W, H), BG)
    g = Image.new("L", (W, H), 0); d = ImageDraw.Draw(g)
    d.ellipse((W - 500, -500, W + 500, 400), fill=110)
    g = g.filter(ImageFilter.GaussianBlur(180))
    im.paste(Image.new("RGB", (W, H), (16, 94, 66)), (0, 0), g)
    return im
BASE = fondo()

def marca(d, y=70):
    d.text((80, y), "Nevux", font=F("inter800.ttf", 40), fill=(255, 255, 255))
    d.text((80 + d.textlength("Nevux", font=F("inter800.ttf", 40)) + 14, y + 8), "@nevux.app", font=F("inter800.ttf", 30), fill=(161, 161, 170))

def cuadro(png, esc):
    im = BASE.copy(); d = ImageDraw.Draw(im); marca(d)
    et, tit = esc["et"], esc["tit"]
    fe = F("inter800.ttf", 30); ft = F("mont900.ttf", 54)
    w = d.textlength(et, font=fe) + 44
    d.rounded_rectangle((80, 150, 80 + w, 202), radius=14, fill=VERDE)
    d.text((102, 158), et, font=fe, fill=BG)
    d.text((80, 222), tit, font=ft, fill=(255, 255, 255))
    # pantalla real del celular, achicada y con bordes redondeados
    s = Image.open(png).convert("RGB")
    sw = 860; sh = int(sw * s.height / s.width)
    s = s.resize((sw, sh), Image.LANCZOS)
    x, y = (W - sw) // 2, 330
    m = Image.new("L", (sw, sh), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, sw, sh), radius=48, fill=255)
    marco = Image.new("L", (sw + 28, sh + 28), 0); ImageDraw.Draw(marco).rounded_rectangle((0, 0, sw + 28, sh + 28), radius=60, fill=255)
    im.paste((28, 28, 31), (x - 14, y - 14), marco)
    im.paste(s, (x, y), m)
    return im

def cierre():
    im = BASE.copy(); d = ImageDraw.Draw(im); marca(d)
    d.text((80, 700), "SIN APPS · SIN CAMBIAR DE PLANTILLA", font=F("inter800.ttf", 30), fill=VERDE2)
    d.text((80, 770), "¿Querés tu", font=F("mont900.ttf", 96), fill=(255, 255, 255))
    d.text((80, 880), "tienda así?", font=F("mont900.ttf", 96), fill=VERDE2)
    d.text((80, 1040), "Comentá", font=F("inter800.ttf", 52), fill=(228, 228, 231))
    x = 80 + d.textlength("Comentá ", font=F("inter800.ttf", 52))
    d.rounded_rectangle((x, 1032, x + d.textlength("FICHA", font=F("inter800.ttf", 52)) + 36, 1108), radius=16, fill=(255, 255, 255))
    d.text((x + 18, 1040), "FICHA", font=F("inter800.ttf", 52), fill=BG)
    d.text((80, 1130), "y te digo qué le falta a la tuya.", font=F("inter800.ttf", 52), fill=(228, 228, 231))
    d.text((80, 1760), "nevux.ar", font=F("inter800.ttf", 36), fill=(161, 161, 170))
    return im

def main():
    tmp = tempfile.mkdtemp()
    durs = []
    for i, e in enumerate(ESCENAS):
        a = os.path.join(tmp, f"v{i}.mp3"); tts(e["voz"], a); durs.append(dur(a) + 0.3)
    lista = os.path.join(tmp, "l.txt")
    with open(lista, "w") as f:
        for i in range(len(ESCENAS)):
            sil = os.path.join(tmp, f"s{i}.wav")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(tmp, f"v{i}.mp3"), "-af", "apad=pad_dur=0.3", "-ar", "44100", "-ac", "1", sil], check=True)
            f.write(f"file '{sil}'\n")
    voz = os.path.join(tmp, "voz.m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c:a", "aac", "-b:a", "192k", voz], check=True)
    cuadros = [int(round(d * FPS)) for d in durs]
    plan = [dict({k: v for k, v in e.items() if k not in ("voz",)}, cuadros=c) for e, c in zip(ESCENAS, cuadros) if e["accion"] != "cierre"]
    pj = os.path.join(tmp, "plan.json"); json.dump(plan, open(pj, "w"))
    crudo = os.path.join(tmp, "crudo")
    subprocess.run(["node", os.path.join(AQUI, "grabar.js"), pj, crudo], check=True, env=dict(os.environ, NODE_PATH=subprocess.check_output(["npm", "root", "-g"]).decode().strip()))
    pngs = sorted(os.listdir(crudo))
    fr = os.path.join(tmp, "fr"); os.makedirs(fr)
    n = 0; idx = 0
    for e, c in zip(ESCENAS, cuadros):
        if e["accion"] == "cierre":
            cimg = cierre()
            for j in range(c): cimg.save(os.path.join(fr, f"{n:05d}.png")); n += 1
            continue
        ult = None
        for j in range(c):
            src = os.path.join(crudo, pngs[min(idx, len(pngs) - 1)]); idx += 1
            if src != ult: im = cuadro(src, e); ult = src
            im.save(os.path.join(fr, f"{n:05d}.png")); n += 1
    # Portada integrada: los 2 primeros cuadros son la portada (la home con el rótulo), así Business Suite la toma sola
    portada = Image.open(os.path.join(fr, f"{int(cuadros[0] * 0.6):05d}.png")).copy()
    for j in range(2): portada.save(os.path.join(fr, f"{j:05d}.png"))
    os.makedirs(SALIDA, exist_ok=True)
    sinmusica = os.path.join(tmp, "video.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(fr, "%05d.png"), "-i", voz,
        "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "copy", "-shortest", "-movflags", "+faststart", sinmusica], check=True)
    out = os.path.join(SALIDA, f"{NOMBRE}.mp4")
    mezclar(sinmusica, voz, out)
    portada.convert("RGB").save(os.path.join(SALIDA, f"{NOMBRE}.jpg"), quality=97, subsampling=0)
    print(NOMBRE, f"{sum(durs):.1f} s", f"{os.path.getsize(out) / 1e6:.1f} MB", n, "cuadros")
    shutil.rmtree(tmp, ignore_errors=True)

main()

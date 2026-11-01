# Reels con narración de Hogar Digital: fotos reales de la tienda, textos con la marca y voz argentina (edge-tts, es-AR).
# Uso: python3 scripts/instagram/hd/reels.py [ovni relax parlantes]   (necesita edge-tts, Pillow y ffmpeg)
# Cada escena dura lo que dura su frase narrada, así la voz y la imagen van juntas.
import asyncio, json, math, os, ssl, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(AQUI, "..", "..", "..", "public", "ig", "hd")
FUENTES = os.environ.get("FUENTES", os.path.join(AQUI, "fuentes"))
VOZ = os.environ.get("VOZ", "es-AR-TomasNeural")
P = json.load(open(os.path.join(AQUI, "productos.json")))
W, H, FPS = 1080, 1920, 30
AZUL, PLATA, BG = (52, 152, 219), (217, 221, 227), (10, 12, 16)
F = lambda n, s: ImageFont.truetype(os.path.join(FUENTES, n), s)
plata = lambda n: "$" + f"{round(n):,}".replace(",", ".")

# El contenedor sale a internet por un proxy con su propio certificado
_ctx = ssl.create_default_context
def _ctx2(*a, **k):
    c = _ctx(*a, **k)
    if os.path.exists("/root/.ccr/ca-bundle.crt"): c.load_verify_locations("/root/.ccr/ca-bundle.crt")
    return c
ssl.create_default_context = _ctx2
import edge_tts

REELS = {
    "ovni": [
        dict(tipo="logo", voz="¿Querés que tu cuarto se vea así de noche?"),
        dict(tipo="foto", p="ovni", et="HUMIDIFICADOR OVNI", tit="NIEBLA Y LUZ LED", voz="Este es el humidificador OVNI. Tira niebla y tiene luces LED cálidas."),
        dict(tipo="foto", p="ovni", et="TU DESCANSO", tit="AMBIENTE RELAX", zoom=1, voz="Humedece el ambiente mientras descansás, y queda hermoso en la mesa de luz."),
        dict(tipo="precio", p="ovni", nombre="Humidificador OVNI", voz="Sale setenta y tres mil novecientos, y llevando dos tenés quince por ciento off."),
        dict(tipo="cierre", voz="Pedilo en hogar digital punto com punto ar. Enviamos a todo el país."),
    ],
    "relax": [
        dict(tipo="logo", voz="Tres humidificadores para armar tu rincón relax."),
        dict(tipo="foto", p="volcan", et="01 · VOLCÁN", tit="ERUPCIÓN DE NIEBLA", voz="El Volcán, que simula una erupción de niebla con luz, y viene con control remoto."),
        dict(tipo="foto", p="llama", et="02 · LLAMA", tit="EFECTO FUEGO", voz="El de llama simulada, aromatizante, también con control remoto."),
        dict(tipo="foto", p="g", et="03 · MODELO G", tit="PARLANTE Y LUCES", voz="Y el modelo G, con parlante y luces de colores."),
        dict(tipo="cierre", voz="Elegí el tuyo en hogar digital punto com punto ar. Llevando dos o tres, pagás menos."),
    ],
    "parlantes": [
        dict(tipo="logo", voz="Llega el finde y falta la música."),
        dict(tipo="foto", p="parlante-rgb", et="PARA EL LIVING", tit="PARLANTE RGB", precio=True, voz="El parlante RGB, con luces de colores, a sesenta mil pesos."),
        dict(tipo="foto", p="v8", et="PARA LLEVAR", tit="PARLANTE V8", precio=True, voz="El V8, compacto para llevar a todos lados, a cuarenta y cinco mil novecientos."),
        dict(tipo="foto", p="parlante-12", et="PARA LA JUNTADA", tit="12\" CON MICRÓFONO", precio=True, voz="Y para la juntada grande, el de doce pulgadas con micrófono."),
        dict(tipo="cierre", voz="Pedilos hoy en hogar digital punto com punto ar. Enviamos a todo el país."),
    ],
}

async def tts(texto, archivo):
    await edge_tts.Communicate(texto, VOZ, rate="+6%").save(archivo)

def dur(archivo):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo]).decode())

ease = lambda x: 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, x)))

LOGO = Image.open(os.path.join(PUB, "logo.jpg")).convert("RGB")

def fondo():
    im = Image.new("RGB", (W, H), BG)
    glow = Image.new("L", (W, H), 0); d = ImageDraw.Draw(glow)
    d.ellipse((W / 2 - 700, -900, W / 2 + 700, 500), fill=120)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    im.paste(Image.new("RGB", (W, H), AZUL), (0, 0), glow)
    return im
BASE = fondo()

def texto(d, xy, s, fnt, fill, anchor="la", esp=0):
    if not esp:
        d.text(xy, s, font=fnt, fill=fill, anchor=anchor); return
    # Letra por letra sobre la línea de base, para que las tildes no corran las letras acentuadas
    x, y = xy; tot = sum(d.textlength(c, font=fnt) for c in s) + esp * (len(s) - 1)
    if anchor[0] == "m": x -= tot / 2
    asc, desc = fnt.getmetrics()
    y += asc if anchor[1] == "t" else (asc - desc) / 2 if anchor[1] == "m" else 0
    for c in s: d.text((x, y), c, font=fnt, fill=fill, anchor="ls"); x += d.textlength(c, font=fnt) + esp

def foto_llena(k, t, zoom):
    im = Image.open(os.path.join(PUB, P[k]["img"])).convert("RGB")
    # Fondo: la misma foto desenfocada; adelante, la foto entera con un acercamiento lento
    bg = im.resize((int(H * im.width / im.height), H)) if im.width / im.height < W / H else im.resize((W, int(W * im.height / im.width)))
    bg = bg.resize((max(W, bg.width), max(H, bg.height)))
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H)).filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new("RGB", (W, H), BG), 0.55)
    s = (1.0 + 0.08 * t) * (1.35 if zoom else 1.0)
    fw = int(W * 0.96 * s); fh = int(fw * im.height / im.width)
    fr = im.resize((fw, fh), Image.LANCZOS)
    x = (W - fw) // 2; y = int(H * 0.42 - fh / 2)
    bg.paste(fr, (x, y))
    return bg

def cuadro(esc, t, d_esc):
    k = esc.get("p"); x = t / max(d_esc, 0.01)
    if esc["tipo"] == "logo":
        im = BASE.copy()
        a = ease(t / 0.5)
        lg = LOGO.resize((560, int(560 * LOGO.height / LOGO.width)))
        m = Image.new("L", lg.size, int(255 * a))
        im.paste(lg, ((W - lg.width) // 2, 520), m)
        d = ImageDraw.Draw(im)
        if t > 0.4:
            texto(d, (W / 2, 1300), "MIRÁ ESTO", F("mont900.ttf", 64), AZUL, "mm", esp=8)
        return im
    if esc["tipo"] == "cierre":
        im = BASE.copy(); d = ImageDraw.Draw(im)
        lg = LOGO.resize((420, int(420 * LOGO.height / LOGO.width))); im.paste(lg, ((W - lg.width) // 2, 380))
        texto(d, (W / 2, 1010), "PEDILO HOY", F("mont900.ttf", 92), (255, 255, 255), "mm")
        texto(d, (W / 2, 1110), "hogardigital.com.ar", F("inter800.ttf", 52), PLATA, "mm")
        d.rounded_rectangle((W / 2 - 330, 1220, W / 2 + 330, 1320), radius=50, fill=AZUL)
        texto(d, (W / 2, 1270), "ENVÍOS A TODO EL PAÍS", F("inter800.ttf", 36), (255, 255, 255), "mm", esp=3)
        return im
    if esc["tipo"] == "precio":
        im = foto_llena(k, x, False); d = ImageDraw.Draw(im)
        d.rectangle((0, 1290, W, 1700), fill=(8, 10, 14))
        texto(d, (W / 2, 1360), esc.get("nombre", P[k]["nombre"]).upper(), F("mont900.ttf", 34), (180, 190, 200), "mm", esp=3)
        texto(d, (W / 2, 1480), plata(P[k]["precio"]), F("mont900.ttf", 150), (255, 255, 255), "mm")
        d.rounded_rectangle((W / 2 - 300, 1570, W / 2 + 300, 1660), radius=45, fill=AZUL)
        texto(d, (W / 2, 1615), "LLEVANDO 2: 15% OFF", F("inter800.ttf", 38), (255, 255, 255), "mm", esp=2)
        return im
    im = foto_llena(k, x, esc.get("zoom")); d = ImageDraw.Draw(im)
    a = ease(t / 0.35)
    off = int((1 - a) * -60)
    d.rectangle((60 + off, 1280, 60 + off + 12, 1470), fill=AZUL)
    d.rectangle((72 + off, 1280, W - 60, 1470), fill=(8, 10, 14))
    texto(d, (110 + off, 1312), esc["et"], F("mont900.ttf", 32), (124, 196, 245), "lt", esp=5)
    texto(d, (110 + off, 1362), esc["tit"], F("mont900.ttf", 76), (255, 255, 255), "lt")
    if esc.get("precio"):
        d.rounded_rectangle((60, 1500, 520, 1610), radius=24, fill=(255, 255, 255))
        texto(d, (290, 1555), plata(P[k]["precio"]), F("mont900.ttf", 72), (10, 12, 16), "mm")
    return im

def armar(nombre):
    escenas = REELS[nombre]
    tmp = tempfile.mkdtemp()
    durs = []
    for i, e in enumerate(escenas):
        a = os.path.join(tmp, f"v{i}.mp3"); asyncio.run(tts(e["voz"], a))
        durs.append(dur(a) + 0.25)
    # Audio: las frases una atrás de la otra con 0,25 s de aire
    lista = os.path.join(tmp, "l.txt")
    with open(lista, "w") as f:
        for i in range(len(escenas)):
            sil = os.path.join(tmp, f"s{i}.mp3")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(tmp, f"v{i}.mp3"), "-af", "apad=pad_dur=0.25", sil], check=True)
            f.write(f"file '{sil}'\n")
    voz = os.path.join(tmp, "voz.m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c:a", "aac", "-b:a", "160k", voz], check=True)
    fr = os.path.join(tmp, "fr"); os.makedirs(fr)
    n = 0
    for e, dd in zip(escenas, durs):
        for j in range(int(round(dd * FPS))):
            cuadro(e, j / FPS, dd).save(os.path.join(fr, f"{n:05d}.jpg"), quality=90); n += 1
    os.makedirs(os.path.join(PUB, "reels"), exist_ok=True)
    out = os.path.join(PUB, "reels", f"{nombre}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(fr, "%05d.jpg"), "-i", voz,
        "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "copy", "-shortest", "-movflags", "+faststart", out], check=True)
    # Portada: la primera foto de producto
    port = next(i for i, e in enumerate(escenas) if e["tipo"] in ("foto", "precio"))
    ini = int(sum(durs[:port]) * FPS) + 20
    Image.open(os.path.join(fr, f"{ini:05d}.jpg")).save(os.path.join(PUB, "reels", f"{nombre}.jpg"), quality=90)
    print(nombre, f"{sum(durs):.1f} s", f"{os.path.getsize(out) / 1e6:.1f} MB")

for nombre in (sys.argv[1:] or list(REELS)):
    armar(nombre)

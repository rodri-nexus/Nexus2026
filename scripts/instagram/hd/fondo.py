# Fotos de producto con fondo de estudio oscuro, como las demás de Hogar Digital (negro, haz de luz y base de piedra).
# Recorta el producto de una foto con fondo blanco (relleno desde los bordes: el producto no se toca) y lo apoya sobre el fondo.
# Uso: python3 scripts/instagram/hd/fondo.py entrada.webp salida.jpg [escala=0.72] [tolerancia=28] [piso=0]
# (piso: fracción de abajo del producto donde se borra la sombra gris de la foto original, por ejemplo 0.15)
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

def recorte(im, tol, piso=0.0):
    # si la foto trae transparencia, se apoya sobre blanco (si no, lo transparente queda negro)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA"); b = Image.new("RGBA", im.size, (255, 255, 255, 255)); b.alpha_composite(im); im = b
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    h, w, _ = a.shape
    claro = (a.min(axis=2) > 255 - tol) & ((a.max(axis=2) - a.min(axis=2)) < 22)
    fondo = np.zeros((h, w), bool)
    # relleno desde los bordes, solo por píxeles claros conectados
    from collections import deque
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if claro[y, x] and not fondo[y, x]: fondo[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if claro[y, x] and not fondo[y, x]: fondo[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and claro[ny, nx] and not fondo[ny, nx]:
                fondo[ny, nx] = True; q.append((ny, nx))
    # huecos blancos encerrados (por ejemplo, dentro de la malla de un reloj): blanco puro y grandes
    blanco = (a.min(axis=2) > 243) & ((a.max(axis=2) - a.min(axis=2)) < 10) & ~fondo
    visto = np.zeros((h, w), bool)
    for y0, x0 in zip(*np.nonzero(blanco)):
        if visto[y0, x0]: continue
        comp = [(y0, x0)]; visto[y0, x0] = True; i = 0
        while i < len(comp):
            y, x = comp[i]; i += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and blanco[ny, nx] and not visto[ny, nx]:
                    visto[ny, nx] = True; comp.append((ny, nx))
        if len(comp) > h * w * 0.004:
            ys, xs = zip(*comp); fondo[list(ys), list(xs)] = True
    # sombra gris de la foto original bajo el producto: gris claro sin color en la franja de abajo
    if piso:
        ys = np.nonzero((~fondo).any(axis=1))[0]
        if len(ys):
            y1 = ys[-1]; y0 = int(y1 - (y1 - ys[0]) * piso)
            gris = (a.min(axis=2) > 175) & ((a.max(axis=2) - a.min(axis=2)) < 14)
            fondo[y0:y1 + 1] |= gris[y0:y1 + 1]
    m = Image.fromarray(((~fondo) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.convert("RGBA"); rgba.putalpha(m)
    return rgba.crop(m.getbbox())

def estudio(S=1024, seed=7):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:S, 0:S] / S
    base = 10 + 14 * np.exp(-((x - 0.5) ** 2 + (y - 0.35) ** 2) / 0.12)          # halo central tenue
    haz = np.clip(1 - np.abs((x - 0.15) - (y * 0.55)) / 0.10, 0, 1) * np.clip(1 - y * 1.3, 0, 1)  # haz diagonal desde arriba a la izquierda
    img = np.stack([base + 34 * haz, base + 38 * haz, base + 46 * haz], -1)
    # base de piedra oscura (desde el 68 %), con textura y brillo en el borde
    piso = y > 0.68
    tex = rng.normal(0, 1, (S, S)); tex = np.asarray(Image.fromarray(((tex - tex.min()) / np.ptp(tex) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))) / 255
    p = 16 + 18 * tex + 10 * np.exp(-((x - 0.5) ** 2) / 0.08)
    for c in range(3): img[..., c] = np.where(piso, p + (2 if c == 2 else 0), img[..., c])
    borde = np.exp(-((y - 0.68) ** 2) / 0.00002) * 60 * np.exp(-((x - 0.5) ** 2) / 0.15)
    img += borde[..., None]
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))

def armar(entrada, salida, escala=0.72, tol=28, piso=0.0):
    S = 1024
    prod = recorte(Image.open(entrada), tol, piso)
    f = escala * S / max(prod.size); prod = prod.resize((int(prod.width * f), int(prod.height * f)), Image.LANCZOS)
    bg = estudio(S)
    x = (S - prod.width) // 2; ypiso = int(S * 0.74); y = ypiso - prod.height
    if y < int(S * 0.08): y = int(S * 0.08)
    # sombra de contacto y reflejo suave sobre la piedra
    sombra = Image.new("L", (S, S), 0); d = ImageDraw.Draw(sombra)
    d.ellipse((x + prod.width * 0.08, y + prod.height - 18, x + prod.width * 0.92, y + prod.height + 22), fill=170)
    sombra = sombra.filter(ImageFilter.GaussianBlur(18))
    bg.paste((0, 0, 0), (0, 0), sombra)
    refl = prod.transpose(Image.FLIP_TOP_BOTTOM)
    a = refl.getchannel("A"); grad = Image.linear_gradient("L").resize(refl.size).transpose(Image.FLIP_TOP_BOTTOM)
    a = ImageChops.multiply(a, grad.point(lambda v: int(v * 0.22)))
    refl.putalpha(a)
    bg.paste(refl, (x, y + prod.height), refl)
    # luz de borde: el producto un poco más vivo sobre el fondo oscuro
    bg.paste(prod, (x, y), prod)
    bg.convert("RGB").save(salida, quality=95, subsampling=0)

if __name__ == "__main__":
    a = sys.argv[1:]
    armar(a[0], a[1], float(a[2]) if len(a) > 2 else 0.72, int(a[3]) if len(a) > 3 else 28, float(a[4]) if len(a) > 4 else 0.0)

# Narración (voz de Tomás) + música de fondo para los Reels animados de @nevux.app (public/ig/reels/<nombre>.mp4).
# Cada frase entra en el segundo en que aparece su texto en pantalla (tiempos de reel.html). Si la voz necesita más
# tiempo, la animación se vuelve a armar más lenta (ESCALA) en la medida justa, así imagen y voz van juntas.
# Uso: python3 scripts/instagram/narrar.py [precio packs]   (necesita edge-tts, numpy, Playwright y ffmpeg)
import os, shutil, subprocess, sys, tempfile
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from audio import dur, frase, mezclar, voz_en_tiempos

REELS = os.path.join(AQUI, "..", "..", "public", "ig", "reels")
AIRE = 0.35  # pausa mínima entre frases

# (segundo de reel.html en que aparece el texto, frase) · duración original de la animación
GUIONES = {
    "precio": (15, [
        (0.1, "Tu mejor precio está escondido. Y te está costando ventas."),
        (2.8, "Dos fichas, mismo precio. ¿Cuál vende más?"),
        (6.6, "La B. Porque te dice cuánto ahorrás, en pesos."),
        (9.6, "Perder duele más que ganar. Mostrá el ahorro grande."),
        (12.6, "Comentá ficha, y te digo qué cambiar."),
    ]),
    "packs": (16, [
        (0.1, "La misma visita puede valer el doble."),
        (3.0, "Caso real: llevá uno, dos o tres."),
        (6.4, "Si elige dos, la venta pasa de cuarenta y cinco mil, a setenta y ocho mil."),
        (10.8, "Setenta por ciento más, con la misma visita."),
        (12.8, "Comentá ficha, y te digo qué pack armar."),
    ]),
}


def armar(nombre):
    largo, frases = GUIONES[nombre]
    tmp = tempfile.mkdtemp()
    hechas = [frase(t, tmp, i) for i, (_, t) in enumerate(frases)]
    # Cuánto hay que estirar la animación para que cada frase termine antes de que entre la siguiente
    escala = 1.0
    for i, (ini, _) in enumerate(frases):
        sig = frases[i + 1][0] if i + 1 < len(frases) else largo
        escala = max(escala, (hechas[i][1] + AIRE) / (sig - ini))
    escala = round(escala + 0.005, 3)
    subprocess.run(["node", os.path.join(AQUI, "generar-reels.js"), nombre], check=True, env={**os.environ, "ESCALA": str(escala)})
    video = os.path.join(REELS, f"{nombre}.mp4")
    base = os.path.join(tmp, "base.mp4")
    shutil.copy(video, base)
    total = dur(base)
    pre = int(os.environ.get("PRE_PORTADA", "2")) / 30  # cuadros de portada al principio (generar-reels.js)
    voz, fin = voz_en_tiempos([(ini * escala + pre, t) for ini, t in frases], total, tmp, hechas)
    mezclar(base, voz, video, extra=max(0.0, round(fin + 0.5 - total, 2)))
    print(nombre, f"escala {escala}", f"voz hasta {fin:.1f} s, video {dur(video):.1f} s", f"{os.path.getsize(video) / 1e6:.1f} MB")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    for nombre in (sys.argv[1:] or list(GUIONES)):
        armar(nombre)

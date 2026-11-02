# Audio de los Reels: voz de Tomás (edge-tts, es-AR-TomasNeural) + música de fondo suave.
# La música se genera acá mismo (acordes y arpegio propios), así no hay derechos de autor de por medio.
# Uso desde otros scripts:  from audio import tts, musica, mezclar
import asyncio, math, os, ssl, subprocess, wave
import numpy as np

VOZ = os.environ.get("VOZ", "es-AR-TomasNeural")
SR = 44100

# El contenedor sale a internet por un proxy con su propio certificado
_ctx = ssl.create_default_context
def _ctx2(*a, **k):
    c = _ctx(*a, **k)
    if os.path.exists("/root/.ccr/ca-bundle.crt"): c.load_verify_locations("/root/.ccr/ca-bundle.crt")
    return c
ssl.create_default_context = _ctx2
import edge_tts


def tts(texto, archivo, rate="+6%"):
    asyncio.run(edge_tts.Communicate(texto, VOZ, rate=rate).save(archivo))


def dur(archivo):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo]).decode())


def _nota(n):  # número MIDI → Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def _env(n, ataque, caida):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / ataque) * np.exp(-t / caida)
    return e


def musica(segundos, archivo, bpm=84):
    """Colchón tipo lo-fi: acordes de piano eléctrico suave, bajo y un arpegio tenue. Cálido y sin percusión fuerte."""
    n = int((segundos + 1) * SR)
    out = np.zeros(n)
    negra = 60 / bpm
    compas = 4 * negra
    # Progresión en Re mayor: Dmaj7 · Bm7 · Gmaj7 · A6 (un compás cada uno)
    acordes = [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 66]]
    bajos = [38, 35, 43, 45]
    rng = np.random.default_rng(7)
    k = 0
    t0 = 0.0
    while t0 < segundos + 1:
        ac, bj = acordes[k % 4], bajos[k % 4]
        i0 = int(t0 * SR)
        largo = int(compas * SR * 1.15)
        t = np.arange(largo) / SR
        # Acorde: seno + un poco de armónico, con ataque lento
        pad = sum(np.sin(2 * np.pi * _nota(m) * t) + 0.25 * np.sin(4 * np.pi * _nota(m) * t + 0.3) for m in ac)
        pad *= _env(largo, 0.35, 2.6) * 0.07
        # Bajo redondo
        bajo = np.sin(2 * np.pi * _nota(bj) * t) * _env(largo, 0.02, 1.4) * 0.16
        seg = pad + bajo
        # Arpegio en corcheas, muy suave
        for j in range(8):
            m = ac[(j * 2 + k) % 4] + 12
            a0 = int(j * negra / 2 * SR)
            ln = int(negra * 1.5 * SR)
            if a0 + ln > largo: break
            tt = np.arange(ln) / SR
            nota = np.sin(2 * np.pi * _nota(m) * tt) * _env(ln, 0.005, 0.35) * (0.035 + 0.01 * rng.random())
            seg[a0:a0 + ln] += nota
        fin = min(n, i0 + largo)
        out[i0:fin] += seg[:fin - i0]
        t0 += compas
        k += 1
    # Calidez: filtro pasa bajos simple y un eco corto
    a = 0.18
    for i in range(1, n):
        out[i] = out[i - 1] + a * (out[i] - out[i - 1])
    eco = int(0.28 * SR)
    out[eco:] += 0.25 * out[:-eco]
    out = out[: int(segundos * SR)]
    out /= max(1e-9, np.abs(out).max())
    out *= 0.8
    pcm = (np.stack([out, out], 1) * 32767).astype(np.int16)
    with wave.open(archivo, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def frase(texto, carpeta, i):
    """Genera una frase con la voz y le saca el silencio del principio y del final. Devuelve (archivo, duración)."""
    crudo, a = os.path.join(carpeta, f"c{i}.mp3"), os.path.join(carpeta, f"f{i}.wav")
    tts(texto, crudo)
    corte = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", crudo, "-af", f"{corte},areverse,{corte},areverse", "-ar", str(SR), a], check=True)
    return a, dur(a)


def voz_en_tiempos(frases, total, carpeta, hechas=None):
    """frases: lista de (segundo en que arranca, texto). Devuelve un .wav con cada frase en su momento, y el final real.
    hechas: las frases ya generadas con frase() (para no pedirlas dos veces)."""
    partes, fin = [], 0.0
    for i, (ini, texto) in enumerate(frases):
        a, d = hechas[i] if hechas else frase(texto, carpeta, i)
        ini = max(ini, fin + 0.15)  # nunca se pisan
        partes.append((ini, a))
        fin = ini + d
    filtros, entradas = [], []
    for i, (ini, a) in enumerate(partes):
        entradas += ["-i", a]
        ms = int(ini * 1000)
        filtros.append(f"[{i}]adelay={ms}|{ms},aformat=channel_layouts=stereo[a{i}]")
    filtros.append("".join(f"[a{i}]" for i in range(len(partes))) + f"amix=inputs={len(partes)}:normalize=0,apad=whole_dur={max(total, fin)}[v]")
    salida = os.path.join(carpeta, "voz.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", ";".join(filtros), "-map", "[v]", "-ar", str(SR), salida], check=True)
    return salida, fin


def mezclar(video, voz, salida, extra=0.0):
    """Pone voz + música de fondo al video (reemplaza su audio). La música baja sola cuando habla Tomás.
    extra: segundos que se alarga el último cuadro si la voz termina después del video."""
    total = dur(video) + extra
    carpeta = os.path.dirname(voz)
    mus = os.path.join(carpeta, "musica.wav")
    musica(total, mus)
    fade = max(0.0, total - 1.5)
    filtro = (
        f"[1:a]aformat=channel_layouts=stereo,volume=1.6,asplit=2[v1][v2];"
        f"[2:a]volume=0.32,afade=t=in:d=0.8,afade=t=out:st={fade}:d=1.5[m];"
        f"[m][v2]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=400[md];"
        f"[v1][md]amix=inputs=2:normalize=0,alimiter=limit=0.95,atrim=0:{total}[a]"
    )
    vf = ["-vf", f"tpad=stop_mode=clone:stop_duration={extra}"] if extra > 0 else []
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", voz, "-i", mus, "-filter_complex", filtro,
                    "-map", "0:v", "-map", "[a]", *vf, *(["-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation", "-pix_fmt", "yuv420p"] if extra > 0 else ["-c:v", "copy"]),
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total}", salida], check=True)

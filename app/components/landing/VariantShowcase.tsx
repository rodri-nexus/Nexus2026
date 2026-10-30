"use client";

import { useState } from "react";
import { Check, Play, ArrowRight } from "lucide-react";

// Para reemplazar la demo por un video real, completá UNO de estos dos campos:
//   youtube: "ID_DEL_VIDEO"           (video No listado; el ID es lo que va después de "v=")
//   mp4: "/videos/clasica.mp4"        (archivo subido a /public/videos)
const VARIANTS = [
  {
    name: "Clásica",
    badge: "",
    desc: "La más completa. Sirve para todo tipo de tienda.",
    ideal: ["Todo tipo de tienda", "Hogar", "Tecnología", "Accesorios"],
    includes: ["Botón de compra fijo", "Packs Llevá 2 / Llevá 3", "Barra de urgencia", "Ventas en vivo"],
    dur: 22,
    time: "0:22",
    youtube: "",
    mp4: "",
    g1: "#10B981",
    g2: "#047857",
    demo: {
      brand: "CUMBRE", emoji: "🧉", title: "Termo Cumbre 750 ml", price: "$38.900",
      toast: "🧉 Sofía de Córdoba compró recién",
      bg: "#ffffff", ink: "#18181b", acc: "#10B981", line: "#e4e4e7", sel: "#f0fdf4",
      img: "radial-gradient(circle at 30% 25%, #34d399, #059669 60%, #0a0a0a)", btn: "#18181b", btnt: "#ffffff",
    },
  },
  {
    name: "Antes y Después",
    badge: "",
    desc: "Para productos donde se ve el cambio: cosmética, suplementos, tratamientos.",
    ideal: ["Cosmética", "Suplementos", "Tratamientos", "Limpieza"],
    includes: ["Comparador antes / después", "Botón de compra fijo", "Packs con descuento", "Insignias de confianza"],
    dur: 18,
    time: "0:18",
    youtube: "",
    mp4: "",
    g1: "#f5a623",
    g2: "#d9455b",
    demo: {
      brand: "DERMA+", emoji: "", title: "Sérum Derma+ 30 ml", price: "$24.900",
      toast: "✨ Lucía de Rosario compró 2 recién",
      bg: "#ffffff", ink: "#18181b", acc: "#d9455b", line: "#e4e4e7", sel: "#fff1f2",
      img: "", btn: "#d9455b", btnt: "#ffffff",
    },
  },
  {
    name: "Oscura Premium",
    badge: "Nueva",
    desc: "Para indumentaria y marcas premium con estética dark.",
    ideal: ["Indumentaria", "Calzado", "Marcas premium", "Joyería"],
    includes: ["Estética dark con dorado", "Botón de compra fijo", "Packs con descuento", "Ventas en vivo"],
    dur: 20,
    time: "0:20",
    youtube: "",
    mp4: "",
    g1: "#27272a",
    g2: "#000000",
    demo: {
      brand: "AURORA", emoji: "🧥", title: "Campera Aurora", price: "$89.900",
      toast: "🧥 Martina de CABA compró recién",
      bg: "#0a0a0a", ink: "#f4f6fb", acc: "#d4af37", line: "#27272a", sel: "#18181b",
      img: "radial-gradient(circle at 30% 25%, #3f3f46, #18181b 60%, #000)", btn: "#d4af37", btnt: "#0a0a0a",
    },
  },
];

const DEMO_STYLES = `
.nvx-vcard .nvx-prog span { display: block; height: 100%; width: 0; background: #34d399; }
.nvx-vcard.playing .nvx-prog span { animation: nvx-prog var(--d) linear forwards; }
@keyframes nvx-prog { to { width: 100%; } }
.nvx-rec { display: none; }
.nvx-vcard.playing .nvx-rec { display: flex; }
.nvx-rec:before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; animation: nvx-blink 1s infinite; }
@keyframes nvx-blink { 50% { opacity: .2; } }
.nvx-play { animation: nvx-pulse 2s infinite; }
@keyframes nvx-pulse { 0% { box-shadow: 0 0 0 0 #ffffff88; } 70% { box-shadow: 0 0 0 18px #ffffff00; } 100% { box-shadow: 0 0 0 0 #ffffff00; } }
.nvx-mph { width: 148px; height: 296px; border: 6px solid #0a0a0a; border-radius: 24px; overflow: hidden; position: relative; background: var(--pbg); color: var(--pink); box-shadow: 0 18px 50px #0009; transition: filter .3s; }
.nvx-vcard:not(.playing) .nvx-mph { filter: brightness(.7); }
.nvx-mph:before { content: ""; position: absolute; top: 4px; left: 50%; width: 44px; height: 10px; margin-left: -22px; background: #0a0a0a; border-radius: 8px; z-index: 3; }
.nvx-scroll { padding: 20px 8px 50px; font-size: 8px; line-height: 1.4; }
.nvx-vcard.playing .nvx-scroll { animation: nvx-scroll var(--d) ease-in-out forwards; }
@keyframes nvx-scroll { 0%, 8% { transform: none; } 45%, 55% { transform: translateY(-28%); } 92%, 100% { transform: translateY(-52%); } }
.nvx-brand { font-weight: 800; letter-spacing: .25em; font-size: 7px; color: var(--pacc); }
.nvx-img { height: 96px; border-radius: 9px; margin: 6px 0; display: grid; place-items: center; font-size: 40px; background: var(--pimg); position: relative; overflow: hidden; }
.nvx-img.ba { background: linear-gradient(90deg, #71717a 0 50%, var(--pacc) 50% 100%); }
.nvx-img.ba small { position: absolute; bottom: 4px; font-size: 6px; font-weight: 800; color: #fff; letter-spacing: .1em; }
.nvx-stars { color: #f5a623; font-size: 7px; }
.nvx-title { font-weight: 700; font-size: 10px; }
.nvx-price { font-weight: 800; font-size: 13px; }
.nvx-urg { color: #dc2626; font-weight: 700; font-size: 7px; margin: 4px 0 2px; }
.nvx-urg i { display: block; height: 4px; border-radius: 4px; background: #dc262633; margin-top: 2px; overflow: hidden; }
.nvx-urg i:after { content: ""; display: block; height: 100%; width: 60%; background: #dc2626; }
.nvx-vcard.playing .nvx-urg i:after { animation: nvx-urg var(--d) ease-out forwards; }
@keyframes nvx-urg { to { width: 92%; } }
.nvx-pack { border: 1.5px solid var(--pline); border-radius: 6px; padding: 4px 5px; margin: 4px 0; display: flex; justify-content: space-between; font-size: 7px; }
.nvx-pack.sel { border-color: var(--pacc); background: var(--psel); }
.nvx-pack b { display: block; }
.nvx-badges { display: flex; gap: 3px; margin: 6px 0; flex-wrap: wrap; }
.nvx-badges span { border: 1px solid var(--pline); border-radius: 5px; padding: 2px 4px; font-size: 6px; }
.nvx-txt { opacity: .7; margin: 4px 0; }
.nvx-skel { height: 7px; border-radius: 4px; background: var(--pline); margin: 4px 0; }
.nvx-skel.s { width: 65%; }
.nvx-bar { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; background: var(--pbg); border-top: 1px solid var(--pline); padding: 5px 7px; display: flex; justify-content: space-between; align-items: center; font-size: 7px; }
.nvx-bar span { background: var(--pbtn); color: var(--pbtnt); border-radius: 5px; padding: 4px 7px; font-weight: 700; }
.nvx-vcard.playing .nvx-bar span { animation: nvx-tap var(--d) linear forwards; }
@keyframes nvx-tap { 0%, 84% { transform: none; } 87% { transform: scale(.88); } 90%, 100% { transform: none; } }
.nvx-toast { position: absolute; left: 5px; right: 5px; bottom: 32px; z-index: 2; background: #18181b; color: #fff; border-radius: 7px; padding: 4px 6px; font-size: 6.5px; opacity: 0; transform: translateY(12px); }
.nvx-vcard.playing .nvx-toast { animation: nvx-toast var(--d) ease forwards; }
@keyframes nvx-toast { 0%, 25% { opacity: 0; transform: translateY(12px); } 30%, 55% { opacity: 1; transform: none; } 60%, 100% { opacity: 0; transform: translateY(12px); } }
@media (prefers-reduced-motion: reduce) { .nvx-vcard *, .nvx-vcard *:before, .nvx-vcard *:after { animation: none !important; } }
`;

interface VariantShowcaseProps {
  checkoutUrl: string;
}

export default function VariantShowcase({ checkoutUrl }: VariantShowcaseProps) {
  const [variant, setVariant] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = VARIANTS[variant];
  const hasVideo = Boolean(current.mp4 || current.youtube);

  const changeVariant = (i: number) => {
    setVariant(i);
    setPlaying(false);
  };

  return (
    <section id="variantes" className="py-20 border-b border-[#1a1a1a]">
      <style dangerouslySetInnerHTML={{ __html: DEMO_STYLES }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            3 estilos disponibles
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
            Elegí tu variante
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Tres estilos del Pack. Mirá cómo queda cada uno antes de decidir.
          </p>
        </div>

        {/* Pastillas de variantes */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 sm:justify-center [scrollbar-width:none]">
          {VARIANTS.map((v, i) => (
            <button
              key={v.name}
              onClick={() => changeVariant(i)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                variant === i
                  ? "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-[#141414] border-[#262626] text-neutral-400 hover:border-[#333333]"
              }`}
            >
              {v.name}
              {v.badge && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${variant === i ? "bg-black/20 text-black" : "bg-emerald-500/10 text-emerald-400"}`}>
                  {v.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Video demo: real si hay youtube/mp4, si no, demo animada */}
          <div className="flex justify-center lg:order-2">
            <div
              className={`nvx-vcard w-full max-w-[320px] rounded-3xl overflow-hidden bg-[#141414] border border-[#222222] ${playing ? "playing" : ""}`}
              style={{ ["--d" as string]: `${current.dur}s` }}
            >
              <div
                className="relative h-[330px] grid place-items-center overflow-hidden cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${current.g1}, ${current.g2})` }}
                onClick={() => { if (!playing || !hasVideo) setPlaying(!playing); }}
              >
                {current.mp4 ? (
                  playing ? (
                    <video key={current.mp4 + "-on"} src={current.mp4} muted playsInline loop autoPlay controls className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <video key={current.mp4 + "-off"} src={current.mp4 + "#t=0.1"} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                  )
                ) : current.youtube ? (
                  playing ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${current.youtube}?autoplay=1&mute=1&playsinline=1&rel=0`}
                      title={`Demo ${current.name}`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <img
                      src={`https://img.youtube.com/vi/${current.youtube}/hqdefault.jpg`}
                      alt={`Demo ${current.name}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <>
                    <span className="nvx-rec absolute top-3 left-3 z-10 items-center gap-1.5 text-[11px] font-bold text-white">DEMO</span>
                    <div
                      className="nvx-mph"
                      key={"demo-" + variant + "-" + playing}
                      style={{
                        ["--pbg" as string]: current.demo.bg,
                        ["--pink" as string]: current.demo.ink,
                        ["--pacc" as string]: current.demo.acc,
                        ["--pline" as string]: current.demo.line,
                        ["--psel" as string]: current.demo.sel,
                        ["--pimg" as string]: current.demo.img,
                        ["--pbtn" as string]: current.demo.btn,
                        ["--pbtnt" as string]: current.demo.btnt,
                      }}
                    >
                      <div className="nvx-scroll">
                        <div className="nvx-brand">{current.demo.brand}</div>
                        {variant === 1 ? (
                          <div className="nvx-img ba"><small>ANTES · DESPUÉS</small></div>
                        ) : (
                          <div className="nvx-img">{current.demo.emoji}</div>
                        )}
                        <div className="nvx-stars">★★★★★ <span style={{ opacity: 0.6 }}>4,9</span></div>
                        <div className="nvx-title">{current.demo.title}</div>
                        <div className="nvx-price">{current.demo.price}</div>
                        <div className="nvx-urg">🔥 Quedan pocas unidades · 84% vendido<i></i></div>
                        <div className="nvx-pack"><div><b>Llevá 1</b>Precio de lista</div><div>{current.demo.price}</div></div>
                        <div className="nvx-pack sel"><div><b>Llevá 2 · 15% OFF</b>Más elegido</div><div>✓</div></div>
                        <div className="nvx-pack"><div><b>Llevá 3 · 25% OFF</b>Mejor precio</div><div></div></div>
                        <div className="nvx-badges"><span>🚚 Envío gratis</span><span>💳 3 cuotas</span><span>🔒 Compra segura</span></div>
                        <div className="nvx-skel"></div>
                        <div className="nvx-skel s"></div>
                        <div className="nvx-txt">“Llegó en 48 h, impecable.” — Ana, Paraná</div>
                        <div className="nvx-skel"></div>
                        <div className="nvx-skel s"></div>
                        <div className="nvx-skel"></div>
                      </div>
                      <div className="nvx-toast">{current.demo.toast}</div>
                      <div className="nvx-bar"><div><b>{current.demo.price}</b></div><span>Comprar</span></div>
                    </div>
                  </>
                )}
                {!playing && (
                  <div className="nvx-play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-white text-black grid place-items-center">
                    <Play className="w-6 h-6 fill-black ml-1" />
                  </div>
                )}
              </div>
              <div className="nvx-prog h-1 bg-white/10">
                {!hasVideo && <span key={variant + "-" + playing} onAnimationEnd={() => setPlaying(false)}></span>}
              </div>
              <div className="p-4">
                <div className="font-bold text-white text-sm">Demo · {current.name} · {current.time}</div>
                {!hasVideo && (
                  <p className="text-[11px] text-neutral-500 mt-1">Demo ilustrativa. Pronto: videos reales de tiendas.</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalle de la variante */}
          <div className="lg:order-1 bg-[#141414] border border-[#222222] rounded-2xl p-6 sm:p-8">
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase">
              Variante {variant + 1} · {current.name}
            </span>
            <p className="text-white text-lg sm:text-xl font-bold mt-4 mb-6 leading-snug">{current.desc}</p>

            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mb-2">Ideal para</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {current.ideal.map((r) => (
                <span key={r} className="text-xs text-neutral-300 bg-[#0a0a0a] border border-[#262626] px-3 py-1 rounded-lg">
                  {r}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mb-2">Incluye</div>
            <ul className="space-y-2 mb-8 text-sm text-neutral-300">
              {current.includes.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={checkoutUrl}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Obtener Pack Pro · $39.900/mes</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

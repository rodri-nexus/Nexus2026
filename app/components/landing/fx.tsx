"use client";

// Base de movimiento de la landing (docs/landing.md):
// - Reveal: entrada al bajar (sube y aparece), con escalonado opcional.
// - Tilt: inclinación 3D que sigue el scroll y el mouse, con reflejo de luz.
// - LazyVideo: el video se descarga y se reproduce solo cuando aparece en pantalla (en el celular, la versión liviana).
// - Glow: luz de fondo pintada con un degradé (sin filtros de desenfoque, que traban el scroll en el celular).
// - CountUp: número que sube hasta su valor.
// Fluidez: solo se animan transform y opacity. Todo se apaga con prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 22,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "figure" | "section";
}) {
  // Con "reducir movimiento", el MotionConfig de Landing.tsx apaga el desplazamiento y queda solo la aparición
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

// Media query leída después de montar (así el servidor y el navegador arrancan con el mismo HTML).
function useMedia(q: string) {
  const [si, setSi] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    setSi(mq.matches);
    const cambio = () => setSi(mq.matches);
    mq.addEventListener?.("change", cambio);
    return () => mq.removeEventListener?.("change", cambio);
  }, [q]);
  return si;
}

// Inclinación 3D. `scroll` inclina hacia atrás mientras entra en pantalla y la endereza al llegar al centro.
// Con `scroll={0}` en un celular no hace nada (no hay mouse): se devuelve el contenido tal cual.
export function Tilt({
  children,
  className = "",
  max = 10,
  scroll = 14,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scroll?: number;
  glare?: boolean;
}) {
  const quieto = useMedia("(prefers-reduced-motion: reduce)");
  // En pantallas táctiles la inclinación por dedo se apaga (compite con el scroll)
  const mouse = useMedia("(hover: hover) and (pointer: fine)");
  if (quieto || (!scroll && !mouse)) return <div className={className}>{children}</div>;
  return (
    <TiltActivo className={className} max={mouse ? max : 0} scroll={scroll} glare={glare && mouse}>
      {children}
    </TiltActivo>
  );
}

function TiltActivo({ children, className, max, scroll, glare }: { children: React.ReactNode; className?: string; max: number; scroll: number; glare: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 140, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const sScroll = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const scrollRX = useTransform(sScroll, [0, 1], [scroll, 0]);
  const scrollScale = useTransform(sScroll, [0, 1], scroll ? [0.94, 1] : [1, 1]);

  const rotateX = useTransform<number, number>([scrollRX, sy] as MotionValue<number>[], ([a, b]) => a - b * max);
  const rotateY = useTransform(sx, (v) => v * max);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const fondo = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), transparent 45%)`;

  const mover = (e: React.PointerEvent) => {
    if (!max || e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const soltar = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }} onPointerMove={mover} onPointerLeave={soltar}>
      <motion.div className="relative h-full w-full" style={{ rotateX, rotateY, scale: scrollScale, transformStyle: "preserve-3d" }}>
        {children}
        {glare && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: fondo }} />}
      </motion.div>
    </div>
  );
}

// Luz de fondo: un degradé radial (barato de pintar) en lugar de un círculo con blur de 150 px.
export function Glow({ className = "", color }: { className?: string; color: string }) {
  return <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }} />;
}

// Número que sube hasta su valor la primera vez que se ve; después sigue los cambios con una transición corta.
export function CountUp({ value, format, className = "" }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const quieto = useReducedMotion();
  const actual = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !visto) return;
    if (quieto) {
      actual.current = value;
      el.textContent = format(value);
      return;
    }
    const c = animate(actual.current, value, {
      duration: actual.current === 0 ? 1.2 : 0.45,
      ease: EASE,
      onUpdate: (v) => {
        actual.current = v;
        el.textContent = format(v);
      },
    });
    return () => c.stop();
  }, [value, visto, quieto, format]);
  return (
    <span ref={ref} className={className}>
      {format(visto ? actual.current : 0)}
    </span>
  );
}

// Video que no se descarga hasta que está por aparecer y se pausa al salir de pantalla.
// En pantallas de hasta 768 px usa la versión liviana (`-m.mp4`, 768 px de ancho) si se la pasa en `srcMovil`.
export function LazyVideo({ src, srcMovil, poster, label, className = "" }: { src: string; srcMovil?: string; poster: string; label: string; className?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const fuente = srcMovil && window.matchMedia("(max-width: 768px)").matches ? srcMovil : src;
    if (!("IntersectionObserver" in window)) {
      el.src = fuente;
      return;
    }
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.getAttribute("src")) el.src = fuente;
          if (!quieto) el.play().catch(() => {});
        } else el.pause();
      },
      // 150px de anticipación (04/11): se pide más cerca de aparecerse y no compite con la carga inicial.
      { rootMargin: "150px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, srcMovil]);
  return <video ref={v} poster={poster} muted loop playsInline preload="none" aria-label={label} className={className} />;
}
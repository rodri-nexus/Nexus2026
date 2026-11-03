"use client";

// Base de movimiento de la landing (docs/landing.md):
// - Reveal: entrada al bajar (sube, se enfoca y aparece), con escalonado opcional.
// - Tilt: inclinación 3D que sigue el scroll y el dedo o el mouse, con reflejo de luz.
// - LazyVideo: el video se descarga y se reproduce solo cuando aparece en pantalla.
// Todo se apaga con prefers-reduced-motion. Solo framer-motion y CSS, sin librerías nuevas.

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "figure" | "section";
}) {
  const quieto = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={quieto ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={quieto ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: quieto ? 0.3 : 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

// Inclinación 3D. `scroll` inclina hacia atrás mientras entra en pantalla y la endereza al llegar al centro.
// En el celular responde al dedo arrastrando de costado (el scroll vertical sigue funcionando: touch-action pan-y).
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
  const ref = useRef<HTMLDivElement>(null);
  const quieto = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 140, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const sScroll = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const scrollRX = useTransform(sScroll, [0, 1], [scroll, 0]);
  const scrollScale = useTransform(sScroll, [0, 1], scroll ? [0.92, 1] : [1, 1]);

  const rotateX = useTransform<number, number>([scrollRX, sy] as MotionValue<number>[], ([a, b]) => a - b * max);
  const rotateY = useTransform(sx, (v) => v * max);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const fondo = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), transparent 45%)`;

  const mover = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const soltar = () => {
    px.set(0);
    py.set(0);
  };

  if (quieto) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ perspective: 1400, touchAction: "pan-y" }} onPointerMove={mover} onPointerLeave={soltar} onPointerUp={soltar} onPointerCancel={soltar}>
      <motion.div className="relative h-full w-full will-change-transform" style={{ rotateX, rotateY, scale: scrollScale, transformStyle: "preserve-3d" }}>
        {children}
        {glare && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: fondo }} />}
      </motion.div>
    </div>
  );
}

// Video que no se descarga hasta que está por aparecer y se pausa al salir de pantalla
export function LazyVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.src = src;
      return;
    }
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.src) el.src = src;
          if (!quieto) el.play().catch(() => {});
        } else el.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);
  return <video ref={v} poster={poster} muted loop playsInline preload="none" aria-label={label} className={className} />;
}

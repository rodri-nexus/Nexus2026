"use client";

import { LazyVideo } from "./fx";

// Notebook con un video real de la tienda (grabado en computadora, baja sola). Se descarga y se reproduce solo cuando se ve en pantalla.
// En el celular usa la versión liviana `<nombre>-m.mp4` (768 px), que tiene que estar al lado del video original.
export default function NotebookVideo({ src, poster, url, titulo }: { src: string; poster: string; url: string; titulo: string }) {
  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-t-[18px] bg-[#1b1d22] p-[10px] pb-0 ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]">
        <div className="mb-[8px] flex items-center gap-1.5 px-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-white/10 px-3 py-0.5 text-[10px] text-white/60">{url}</span>
        </div>
        <div className="relative w-full overflow-hidden rounded-t-[6px] bg-black" style={{ aspectRatio: "16 / 10" }}>
          <LazyVideo src={src} srcMovil={src.replace(/\.mp4$/, "-m.mp4")} poster={poster} label={titulo} className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
      </div>
      <div className="relative mx-[-4%] h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#2a2d33] to-[#15171b]">
        <div className="absolute left-1/2 top-0 h-[6px] w-[18%] -translate-x-1/2 rounded-b-md bg-[#0d0e11]" />
      </div>
    </div>
  );
}

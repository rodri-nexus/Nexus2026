import type { Metadata } from "next";
import { PLANES, precioTexto } from "@/lib/planes";
import Vitrina from "./Vitrina";
import { DISENOS } from "@/lib/disenos";

// Catálogo de diseños para mostrarle a un cliente nuevo: nevux.ar/disenos (ver docs/disenos.md y docs/efectos.md)

export const metadata: Metadata = {
  title: "Nevux · Diseños para tu tienda",
  description: "Mirá cómo puede quedar tu Tiendanube: fichas y home con efectos, en el plan Básico o Premium.",
  robots: { index: false },
};

const WHATSAPP = (t: string) => `https://wa.me/5493434163999?text=${encodeURIComponent(t)}`;

export default function DisenosPage() {
  const B = PLANES.basico;
  const P = PLANES.premium;
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(120%_70%_at_50%_0%,#163056_0%,#0a1324_55%,#070b14_100%)] text-white">
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[.3em] text-sky-300">Nevux · Diseños</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
            Así puede quedar <span className="text-sky-300">tu tienda</span>.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-slate-300">
            Confianza, urgencia y claridad para que las visitas se conviertan en compras. Tocá un celular para verlo al frente.
          </p>
        </div>

        <div className="mt-10">
          <Vitrina disenos={DISENOS.map(({ id, nombre, plan, demo }) => ({ id, nombre, plan, demo }))} />
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {DISENOS.map((d) => (
            <div key={d.id} className="rounded-3xl bg-white/[.06] p-5 ring-1 ring-white/10">
              <span className={`inline-block rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[.16em] ${d.plan === "Premium" ? "bg-amber-300 text-black" : "bg-sky-300 text-black"}`}>Plan {d.plan}</span>
              <h2 className="mt-3 text-lg font-extrabold">{d.nombre}</h2>
              <p className="mt-1 text-sm text-slate-300">{d.texto}</p>
              <ul className="mt-4 space-y-2 text-[13.5px] text-slate-200">
                {d.efectos.map((e) => (
                  <li key={e} className="flex gap-2"><span className="text-sky-300">✦</span>{e}</li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <a href={d.demo} target="_blank" rel="noopener" className="flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-center text-sm font-semibold hover:bg-white/15">Ver demo</a>
                <a href={WHATSAPP(`Hola! Quiero el diseño "${d.nombre}" para mi tienda: `)} className="flex-1 rounded-xl bg-sky-400 px-3 py-2.5 text-center text-sm font-bold text-black hover:bg-sky-300">Lo quiero</a>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Elegí tu plan</h2>
          <p className="mt-2 text-center text-sm text-slate-300">Sin cambiar de plantilla y sin apps. Lo dejamos funcionando en tu Tiendanube.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[{ p: B, id: "basico", destacado: false }, { p: P, id: "premium", destacado: true }].map(({ p, id, destacado }) => (
              <div key={id} className={`rounded-3xl p-6 ${destacado ? "bg-gradient-to-b from-amber-200 to-amber-400 text-black" : "bg-white/[.06] ring-1 ring-white/10"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[.2em] ${destacado ? "text-black/70" : "text-sky-300"}`}>{id === "premium" ? "Premium" : "Básico"}</p>
                <h3 className="mt-1 text-xl font-extrabold">{p.nombre}</h3>
                <p className="mt-2 text-4xl font-black">{precioTexto(p.precio)}<span className="text-base font-semibold opacity-70">/mes</span></p>
                <p className={`mt-2 text-sm ${destacado ? "text-black/75" : "text-slate-300"}`}>{p.bajada}</p>
                <ul className="mt-4 space-y-2 text-[14px]">
                  {p.incluye.map((x) => (
                    <li key={x} className="flex gap-2"><span>✓</span>{x}</li>
                  ))}
                </ul>
                <a href={`/suscribirme?plan=${id}`} className={`mt-6 block rounded-2xl px-4 py-3.5 text-center font-bold ${destacado ? "bg-black text-white" : "bg-white text-black"}`}>Quiero el plan {id === "premium" ? "Premium" : "Básico"}</a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Las demos usan una marca, fotos y precios ilustrativos. En tu tienda van tus productos, tus precios y tus datos reales.</p>
        </section>
      </main>
    </div>
  );
}

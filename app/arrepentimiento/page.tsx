"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

const WHATSAPP = "5493434163999";
const EMAIL = "miguelfrancobenitez@gmail.com";

type Tipo = "arrepentimiento" | "baja";

// Código de solicitud que le queda al cliente como comprobante
function nuevoCodigo(tipo: Tipo) {
  const d = new Date();
  const fecha = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const azar = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NVX-${tipo === "baja" ? "BAJ" : "ARR"}-${fecha}-${azar}`;
}

export default function ArrepentimientoPage() {
  const [tipo, setTipo] = useState<Tipo>("arrepentimiento");
  const [datos, setDatos] = useState({ nombre: "", email: "", whatsapp: "", tienda: "", fecha: "", comentario: "" });
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tipo") === "baja") setTipo("baja");
  }, []);

  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDatos({ ...datos, [k]: e.target.value });

  const mensaje = (c: string) =>
    [
      `Solicitud de ${tipo === "baja" ? "BAJA de la suscripción" : "ARREPENTIMIENTO de la compra"} · Código ${c}`,
      `Nombre: ${datos.nombre}`,
      `Email: ${datos.email}`,
      datos.whatsapp && `WhatsApp: ${datos.whatsapp}`,
      `Tienda: ${datos.tienda}`,
      datos.fecha && `Fecha de contratación: ${datos.fecha}`,
      datos.comentario && `Comentario: ${datos.comentario}`,
    ]
      .filter(Boolean)
      .join("\n");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datos.nombre.trim() || !datos.email.trim() || !datos.tienda.trim()) {
      setError("Completá nombre, email y tienda.");
      return;
    }
    setError("");
    const c = nuevoCodigo(tipo);
    setCodigo(c);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje(c))}`, "_blank", "noopener");
  };

  const input =
    "w-full bg-[#0a0b0d] border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors";

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans">
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" aria-label="Inicio">
            <NevuxLogo size="medium" textColor="#ffffff" />
          </a>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Volver
          </a>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          {tipo === "baja" ? "Botón de baja" : "Botón de arrepentimiento"}
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          {tipo === "baja"
            ? "Podés dar de baja tu suscripción al Pack Landing Page Pro cuando quieras, sin permanencia mínima ni costo adicional. La baja corre desde el próximo período: no se te cobra el mes siguiente."
            : "Si contrataste el Pack Landing Page Pro a distancia, tenés 10 días corridos desde la contratación para arrepentirte sin dar explicaciones y sin costo (art. 34 de la Ley 24.240 de Defensa del Consumidor). Te devolvemos el 100% de lo que pagaste."}
        </p>

        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-8">
          {(["arrepentimiento", "baja"] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(t);
                setCodigo(null);
              }}
              className={`py-2.5 rounded-lg text-sm font-bold transition-colors ${
                tipo === t ? "bg-emerald-500 text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t === "baja" ? "Dar de baja" : "Arrepentirme"}
            </button>
          ))}
        </div>

        {codigo ? (
          <div className="bg-[#101114] border border-emerald-500/40 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-bold">Tu solicitud quedó registrada</h2>
            </div>
            <p className="text-sm text-neutral-400 mb-2">Tu código de solicitud es:</p>
            <p className="text-2xl font-black tracking-wider text-emerald-300 mb-5 select-all">{codigo}</p>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              Guardalo como comprobante. Se abrió WhatsApp con tu solicitud: tocá enviar para que nos llegue. Te respondemos dentro
              de las 24 horas. Si preferís, mandala por email.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje(codigo))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black font-black text-sm py-3 rounded-xl"
              >
                <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Solicitud ${codigo}`)}&body=${encodeURIComponent(mensaje(codigo))}`}
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white font-bold text-sm py-3 rounded-xl"
              >
                <Mail className="w-4 h-4" /> Enviar por email
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Nombre y apellido *</span>
              <input className={`${input} mt-1.5`} value={datos.nombre} onChange={set("nombre")} autoComplete="name" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email con el que contrataste *</span>
              <input type="email" className={`${input} mt-1.5`} value={datos.email} onChange={set("email")} autoComplete="email" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">WhatsApp</span>
              <input type="tel" className={`${input} mt-1.5`} value={datos.whatsapp} onChange={set("whatsapp")} autoComplete="tel" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Link de tu tienda *</span>
              <input className={`${input} mt-1.5`} value={datos.tienda} onChange={set("tienda")} placeholder="mitienda.com.ar" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Fecha de contratación</span>
              <input type="date" className={`${input} mt-1.5`} value={datos.fecha} onChange={set("fecha")} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Comentario (opcional)</span>
              <textarea className={`${input} mt-1.5 min-h-[90px]`} value={datos.comentario} onChange={set("comentario")} />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl transition-colors">
              {tipo === "baja" ? "Solicitar la baja" : "Solicitar el arrepentimiento"}
            </button>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Al enviar se genera un código de solicitud y se abre WhatsApp con tus datos. La suscripción también podés cancelarla
              vos mismo desde la app de Mercado Pago, en la sección Suscripciones.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

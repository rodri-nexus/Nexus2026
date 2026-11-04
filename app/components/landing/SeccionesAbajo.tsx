"use client";

// Secciones 3 a 13 de la landing (docs/landing.md), juntas en un solo chunk que
// Landing.tsx carga aparte con next/dynamic: la portada hidrata antes y este
// chunk (el más pesado: videos, vitrina 3D y la calculadora) llega en paralelo.
// El ticket de "Hacé la cuenta" vive acá: es lo único que comparten dos secciones.

import { useState } from "react";
import { CasoReal, Disenos, Problema, QueHace } from "./secciones";
import { Cierre, ComoFunciona, Comparativa, LaCuenta, Pie, Planes, Preguntas, QuienLoHace } from "./oferta";

export default function SeccionesAbajo() {
  const [ticket, setTicket] = useState(35000);

  return (
    <>
      {/* nvx-seccion: el navegador no maqueta ni pinta lo que no se ve (content-visibility) */}
      <div className="nvx-seccion"><CasoReal /></div>
      <div className="nvx-seccion"><Problema /></div>
      <div className="nvx-seccion"><Disenos /></div>
      <div className="nvx-seccion"><QueHace /></div>
      <div className="nvx-seccion"><LaCuenta ticket={ticket} setTicket={setTicket} /></div>
      <div className="nvx-seccion"><ComoFunciona /></div>
      <div className="nvx-seccion"><Comparativa /></div>
      <div className="nvx-seccion"><Planes ticket={ticket} /></div>
      <div className="nvx-seccion"><QuienLoHace /></div>
      <div className="nvx-seccion"><Preguntas /></div>
      <div className="nvx-seccion"><Cierre /></div>
      <div className="nvx-seccion"><Pie /></div>
    </>
  );
}
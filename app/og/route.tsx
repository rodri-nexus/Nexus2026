import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import { CLIENTES } from "@/lib/clientes";

// Imagen de vista previa (1200x630) que muestran WhatsApp, Instagram y Facebook al compartir un link de nevux.ar.
// /og?v=suscripcion&c=<cliente> → "Activá Nevux en <tienda>" con el precio. Sin parámetros → imagen general de Nevux.
export const runtime = "nodejs";

// Tipografía Inter 800 guardada junto a esta ruta: bajarla de Google Fonts en cada pedido demoraba la imagen
// y WhatsApp la descartaba. Si no se puede leer, se usa la de por defecto.
async function cargarFuente(): Promise<ArrayBuffer | null> {
  try {
    const b = await readFile(join(process.cwd(), "app/og/inter-800.ttf"));
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const suscripcion = q.get("v") === "suscripcion";
  const cliente = q.get("c") ? CLIENTES[q.get("c") as string] : undefined;
  const tienda = cliente?.nombre.replace(/\s*\(.*\)\s*$/, "");

  const etiqueta = suscripcion ? "SUSCRIPCIÓN MENSUAL" : "OPTIMIZACIÓN DE FICHAS PARA TIENDANUBE";
  const titulo = suscripcion ? (tienda ? `Activá Nevux en ${tienda}` : "Activá Nevux en tu tienda") : "No te faltan visitas.";
  const destacado = suscripcion ? "Pack Landing Page Pro" : "Te faltan ventas.";

  const fuente = await cargarFuente();

  const imagen = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#07080a",
          backgroundImage: "radial-gradient(circle at 80% 0%, rgba(16,185,129,0.35), rgba(7,8,10,0) 55%)",
          color: "#ffffff",
          fontFamily: fuente ? "Inter" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#000",
              border: "2px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>Nevux</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: "#6ee7b7", marginBottom: 20 }}>{etiqueta}</div>
          <div style={{ fontSize: tienda && tienda.length > 18 ? 66 : 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{titulo}</div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.1, color: "#34d399", letterSpacing: -2, marginTop: 6 }}>{destacado}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {suscripcion ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <div style={{ fontSize: 58, fontWeight: 800 }}>$39.900</div>
              <div style={{ fontSize: 28, color: "#a1a1aa" }}>/ mes · Garantía de 7 días</div>
            </div>
          ) : (
            <div style={{ fontSize: 30, color: "#a1a1aa" }}>Packs, urgencia, envío y botón de compra fijo. Sin apps.</div>
          )}
          <div style={{ fontSize: 28, fontWeight: 700, color: "#6ee7b7" }}>nevux.ar</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fuente ? [{ name: "Inter", data: fuente, weight: 800, style: "normal" }] : undefined,
    }
  );
  // Se manda la imagen entera, con su tamaño: algunos lectores de vista previa (WhatsApp) descartan imágenes enviadas por partes
  const png = await imagen.arrayBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(png.byteLength),
      "Cache-Control": "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}

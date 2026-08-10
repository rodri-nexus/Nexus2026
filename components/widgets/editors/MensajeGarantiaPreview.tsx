"use client";

interface MensajeGarantiaConfig {
  titulo: string;
  texto: string;
  imagenBase64: string;
  colorFondo: string;
  colorTitulo: string;
  colorTexto: string;
  colorBorde: string;
  tamanoTitulo: string;
  tamanoTexto: string;
  bordesRedondeados: number;
  paddingInterno: number;
}

interface Props {
  config: MensajeGarantiaConfig;
}

/**
 * Convierte texto con marcadores markdown-style a HTML seguro.
 * - **texto**  → <strong>
 * - *texto*    → <em>
 * - __texto__  → <u>
 * - "- item"   → <ul><li>
 * También escapa HTML para prevenir XSS.
 */
function parseTextoConMarkdown(texto: string): string {
  if (!texto) return "";

  // 1) Escapar HTML primero
  let out = texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // 2) Detectar listas (líneas que empiezan con "- ")
  const lineas = out.split("\n");
  const bloques: string[] = [];
  let listaAbierta = false;
  let bufferLista: string[] = [];

  const flushLista = () => {
    if (bufferLista.length > 0) {
      bloques.push(
        '<ul style="margin:6px 0;padding-left:20px;">' +
          bufferLista.map((it) => `<li>${it}</li>`).join("") +
          "</ul>"
      );
      bufferLista = [];
    }
    listaAbierta = false;
  };

  for (const linea of lineas) {
    const trimmed = linea.trim();
    if (trimmed.startsWith("- ")) {
      listaAbierta = true;
      bufferLista.push(trimmed.substring(2));
    } else {
      flushLista();
      bloques.push(linea);
    }
  }
  flushLista();

  out = bloques.join("\n");

  // 3) Aplicar formatos (orden importa: __ antes que _, ** antes que *)
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__(.+?)__/g, "<u>$1</u>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 4) Saltos de línea → <br> (pero no dentro de <ul>)
  out = out.replace(/\n/g, "<br/>");

  // 5) Limpiar <br> pegados a <ul>/</ul>
  out = out.replace(/<br\/>\s*<ul/g, "<ul");
  out = out.replace(/<\/ul>\s*<br\/>/g, "</ul>");

  return out;
}

export default function MensajeGarantiaPreview({ config }: Props) {
  const {
    titulo,
    texto,
    imagenBase64,
    colorFondo,
    colorTitulo,
    colorTexto,
    colorBorde,
    tamanoTitulo,
    tamanoTexto,
    bordesRedondeados,
    paddingInterno,
  } = config;

  const tieneImagen = imagenBase64 && imagenBase64.trim() !== "";
  const tieneTitulo = titulo && titulo.trim() !== "";
  const tieneTexto = texto && texto.trim() !== "";

  const textoHtml = parseTextoConMarkdown(texto);

  return (
    <div
      style={{
        background: colorFondo,
        border: `1px solid ${colorBorde}`,
        borderRadius: `${bordesRedondeados}px`,
        padding: `${paddingInterno}px`,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1.5,
      }}
    >
      {tieneImagen && (
        <div
          style={{
            flexShrink: 0,
            width: "56px",
            height: "56px",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <img
            src={imagenBase64}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {tieneTitulo && (
          <div
            style={{
              fontSize: tamanoTitulo,
              fontWeight: 700,
              color: colorTitulo,
              lineHeight: 1.3,
              marginBottom: tieneTexto ? "6px" : 0,
              wordBreak: "break-word",
            }}
          >
            {titulo}
          </div>
        )}

        {tieneTexto && (
          <div
            style={{
              fontSize: tamanoTexto,
              color: colorTexto,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: textoHtml }}
          />
        )}
      </div>
    </div>
  );
    }

// app/plan/pagar/PagarClient.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

interface PagarClientProps {
  email: string;
}

const NARANJA_DATA = {
  alias: "rodrigolazaro24",
  cbu: "4530000800011686104856",
  titular: "Rodrigo Lazaro Spehgt",
  amount: "$30.000",
};

export default function PagarClient({ email }: PagarClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback para navegadores antiguos o webviews móviles
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (err: unknown) {
        console.error("Error al copiar texto:", err);
      }
      document.body.removeChild(textarea);
    }
  }, []);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (selectedFile.size > MAX_SIZE) {
      setError("El archivo supera los 5 MB. Elegí uno más chico.");
      return;
    }

    if (!ALLOWED.includes(selectedFile.type)) {
      setError("Solo se permiten imágenes (JPG, PNG, WebP) o archivos PDF.");
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleSubmit = async () => {
    if (!file) {
      setError("Subí una foto o PDF del comprobante para continuar.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (reference.trim()) {
        formData.append("transfer_reference", reference.trim());
      }

      const res = await fetch("/api/plan/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir el comprobante");
      }

      // Redirigir a pantalla de aprobación pendiente
      router.push(data.redirect || "/plan/pendiente");
      router.refresh();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error inesperado. Probá de nuevo.";
      setError(errMsg);
      setUploading(false);
    }
  };

  const isPdf = file?.type === "application/pdf";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Círculo decorativo */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
          maxWidth: "720px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/plan/expirado"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "#000000",
            opacity: 0.7,
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
        <NevuxLogo size="small" />
        <div style={{ width: "60px" }} />
      </div>

      {/* Contenido */}
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          margin: "0 auto",
          padding: "1rem 1rem 3rem 1rem",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.9rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#059669",
              fontWeight: 700,
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Shield size={12} />
            Pago seguro
          </div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.15rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.6rem 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Activá tu cuenta en{" "}
            <span style={{ color: "#10B981" }}>2 pasos</span>
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.65,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Transferí <strong style={{ color: "#10B981" }}>{NARANJA_DATA.amount}</strong>{" "}
            a Naranja X y subí el comprobante
          </p>
        </motion.div>

        {/* PASO 1 — Datos de transferencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid #f3f4f6",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#10B981",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Transferí a Naranja X
            </h2>
          </div>

          {/* Monto destacado */}
          <div
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              borderRadius: "14px",
              padding: "1.25rem",
              marginBottom: "1rem",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "white",
                opacity: 0.85,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.35rem",
              }}
            >
              Monto a transferir
            </div>
            <div
              style={{
                fontSize: "clamp(2rem, 7vw, 2.75rem)",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {NARANJA_DATA.amount}
            </div>
          </div>

          {/* Datos con copiar */}
          <DataRow
            label="Alias"
            value={NARANJA_DATA.alias}
            fieldKey="alias"
            copied={copiedField === "alias"}
            onCopy={handleCopy}
          />
          <DataRow
            label="CBU"
            value={NARANJA_DATA.cbu}
            fieldKey="cbu"
            copied={copiedField === "cbu"}
            onCopy={handleCopy}
            small
          />
          <DataRow
            label="Titular"
            value={NARANJA_DATA.titular}
            fieldKey="titular"
            copied={copiedField === "titular"}
            onCopy={handleCopy}
            noCopy
          />

          <div
            style={{
              marginTop: "1rem",
              padding: "0.85rem 1rem",
              background: "#ecfdf5",
              borderRadius: "10px",
              border: "1px solid #a7f3d0",
              display: "flex",
              gap: "0.6rem",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              size={16}
              color="#10B981"
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <p
              style={{
                fontSize: "0.8rem",
                color: "#000000",
                opacity: 0.75,
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Transferí el monto <strong>exacto</strong> desde tu app de Naranja X,
              MercadoPago o el banco. Tocá los botones para copiar cada dato.
            </p>
          </div>
        </motion.div>

        {/* PASO 2 — Subir comprobante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid #f3f4f6",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#10B981",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Subí el comprobante
            </h2>
          </div>

          {/* Uploader */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? "#10B981" : "#e5e7eb"}`,
                borderRadius: "14px",
                padding: "2rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                background: dragActive ? "#ecfdf5" : "#f9fafb",
                transition: "all 0.2s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.85rem auto",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
                }}
              >
                <Upload size={24} color="white" strokeWidth={2.5} />
              </div>
              <p
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#000000",
                  margin: "0 0 0.35rem 0",
                }}
              >
                Tocá para subir el comprobante
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#000000",
                  opacity: 0.55,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Foto o PDF · Máximo 5 MB
                <br />
                JPG · PNG · WebP · PDF
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1.5px solid #10B981",
                borderRadius: "14px",
                padding: "1rem",
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isPdf ? (
                  <FileText size={22} color="#10B981" />
                ) : (
                  <ImageIcon size={22} color="#10B981" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#000000",
                    margin: "0 0 0.15rem 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#000000",
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={uploading}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "white",
                  color: "#000000",
                  cursor: uploading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: uploading ? 0.5 : 1,
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Referencia opcional */}
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#000000",
                opacity: 0.75,
                marginBottom: "0.4rem",
              }}
            >
              Número de operación (opcional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Ej: 123456789"
              maxLength={100}
              disabled={uploading}
              style={{
                width: "100%",
                padding: "0.75rem 0.9rem",
                borderRadius: "10px",
                border: inputFocused
                  ? "1.5px solid #10B981"
                  : "1px solid #e5e7eb",
                fontSize: "0.9rem",
                color: "#000000",
                background: uploading ? "#f9fafb" : "white",
                fontFamily: "inherit",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  marginTop: "0.85rem",
                  padding: "0.75rem 0.9rem",
                  background: "#fef2f2",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle
                  size={16}
                  color="#dc2626"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                />
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#dc2626",
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botón enviar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || uploading}
            style={{
              width: "100%",
              padding: "1.15rem 1.5rem",
              background: !file || uploading ? "#93c5fd" : "#10B981",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontSize: "1.05rem",
              fontWeight: 800,
              cursor: !file || uploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontFamily: "inherit",
              boxShadow:
                !file || uploading
                  ? "none"
                  : "0 10px 25px rgba(16, 185, 129, 0.3)",
              opacity: !file || uploading ? 0.6 : 1,
              transition: "background 0.2s, transform 0.15s",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              if (file && !uploading) {
                e.currentTarget.style.background = "#059669";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (file && !uploading) {
                e.currentTarget.style.background = "#10B981";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {uploading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Ya pagué, enviar comprobante
              </>
            )}
          </button>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.55,
              fontWeight: 500,
            }}
          >
            <Clock size={13} />
            Aprobamos tu pago en menos de 24hs
          </div>
        </motion.div>

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.78rem",
            color: "#000000",
            opacity: 0.5,
          }}
        >
          Conectado como {email}
        </div>
      </div>
    </div>
  );
}

// ─── Componente auxiliar ───────────────

function DataRow({
  label,
  value,
  fieldKey,
  copied,
  onCopy,
  small = false,
  noCopy = false,
}: {
  label: string;
  value: string;
  fieldKey: string;
  copied: boolean;
  onCopy: (text: string, field: string) => void;
  small?: boolean;
  noCopy?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.85rem 0.95rem",
        background: "#f9fafb",
        borderRadius: "10px",
        marginBottom: "0.5rem",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#000000",
            opacity: 0.55,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.15rem",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: small ? "0.82rem" : "0.95rem",
            color: "#000000",
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: small
              ? "'SF Mono', Monaco, Consolas, monospace"
              : "inherit",
          }}
        >
          {value}
        </div>
      </div>
      {!noCopy && (
        <button
          type="button"
          onClick={() => onCopy(value, fieldKey)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "none",
            background: copied ? "#10B981" : "white",
            color: copied ? "white" : "#10B981",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            boxShadow: copied
              ? "0 4px 12px rgba(16, 185, 129, 0.25)"
              : "0 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  );
                                                }

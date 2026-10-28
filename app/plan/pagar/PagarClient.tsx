"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Zap,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   1. TYPES, INTERFACES & REAL PAYMENT DATA
   ═══════════════════════════════════════════ */
interface PagarClientProps {
  email: string;
}

interface PaymentField {
  label: string;
  value: string;
  link?: string;
  small?: boolean;
  noCopy?: boolean;
}

interface CountryPaymentConfig {
  id: string;
  flag: string;
  name: string;
  currency: string;
  amount: string;
  title: string;
  instructions: string;
  directPayLink?: string;
  directPayLabel?: string;
  fields: PaymentField[];
}

const COUNTRIES_CONFIG: CountryPaymentConfig[] = [
  {
    id: "AR",
    flag: "🇦🇷",
    name: "Argentina",
    currency: "ARS",
    amount: "$39.900",
    title: "Tarjeta de Crédito, Débito o Mercado Pago",
    instructions:
      "Pagá de forma 100% segura con tu tarjeta o saldo disponible. Tu suscripción se activa al instante.",
    directPayLink: "https://mpago.la/1LqFYin",
    directPayLabel: "Suscribirse (ARS $39.900/mes)",
    fields: [
      {
        label: "Suscripción Oficial",
        value: "Mercado Pago (Cobro Automático)",
        noCopy: true,
      },
      {
        label: "Medios Aceptados",
        value: "Visa, Mastercard, Débito, Mercado Pago",
        noCopy: true,
      },
      {
        label: "Acreditación",
        value: "Inmediata e Instantánea ⚡",
        noCopy: true,
      },
    ],
  },
  {
    id: "BR",
    flag: "🇧🇷",
    name: "Brasil",
    currency: "BRL",
    amount: "R$ 160",
    title: "Pagamento instantâneo via PIX",
    instructions:
      "Toque no botão abaixo para pagar via Pix pelo Belo ou copie a chave.",
    directPayLink: "https://pay.belo.app/checkout?id=6a9f83282534a474802c1467",
    directPayLabel: "Pagar via PIX com Belo →",
    fields: [
      {
        label: "Link de Pagamento Pix",
        value: "https://pay.belo.app/checkout?id=6a9f83282534a474802c1467",
        small: true,
      },
      {
        label: "Beneficiário",
        value: "Rodrigo Lazaro Spehgt",
        noCopy: true,
      },
    ],
  },
  {
    id: "MX",
    flag: "🇲🇽",
    name: "México",
    currency: "MXN",
    amount: "$600 MXN",
    title: "Pago por DolarApp o PayPal",
    instructions:
      "Envía el pago a través de DolarApp o PayPal en pesos mexicanos o USD.",
    fields: [
      { label: "DolarApp Tag", value: "$rodrigospehgt" },
      { label: "PayPal Email", value: "rodrigospehgt@gmail.com" },
      {
        label: "Beneficiario",
        value: "Rodrigo Lazaro Spehgt",
        noCopy: true,
      },
    ],
  },
  {
    id: "CO",
    flag: "🇨🇴",
    name: "Colombia",
    currency: "COP",
    amount: "$120.000 COP",
    title: "Pago con PayPal o DolarApp",
    instructions:
      "Paga con tarjeta internacional mediante PayPal o transferí a DolarApp.",
    fields: [
      { label: "PayPal Email", value: "rodrigospehgt@gmail.com" },
      { label: "DolarApp Tag", value: "$rodrigospehgt" },
      {
        label: "Beneficiario",
        value: "Rodrigo Lazaro Spehgt",
        noCopy: true,
      },
    ],
  },
  {
    id: "CL",
    flag: "🇨🇱",
    name: "Chile",
    currency: "CLP",
    amount: "$28.000 CLP",
    title: "Pago con PayPal o DolarApp",
    instructions:
      "Paga en línea con tarjeta vía PayPal o transferí a DolarApp.",
    fields: [
      { label: "PayPal Email", value: "rodrigospehgt@gmail.com" },
      { label: "DolarApp Tag", value: "$rodrigospehgt" },
      {
        label: "Beneficiario",
        value: "Rodrigo Lazaro Spehgt",
        noCopy: true,
      },
    ],
  },
  {
    id: "GL",
    flag: "🌎",
    name: "Internacional",
    currency: "USD",
    amount: "$30 USD",
    title: "PayPal o DolarApp Global",
    instructions:
      "Paga con tarjeta de crédito o débito internacional vía PayPal.",
    fields: [
      { label: "PayPal Email", value: "rodrigospehgt@gmail.com" },
      { label: "DolarApp Tag", value: "$rodrigospehgt" },
      {
        label: "Beneficiario",
        value: "Rodrigo Lazaro Spehgt",
        noCopy: true,
      },
    ],
  },
];

/* ═══════════════════════════════════════════
   2. STYLES & AUXILIARY COMPONENTS
   ═══════════════════════════════════════════ */
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
          {copied ? (
            <Check size={16} strokeWidth={3} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. COMPONENTE PRINCIPAL (PagarClient)
   ═══════════════════════════════════════════ */
export default function PagarClient({ email }: PagarClientProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Argentina directa y profesional (sin selector de país)
  const activeConfig =
    COUNTRIES_CONFIG.find((c) => c.id === "AR") || COUNTRIES_CONFIG[0];

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
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
          style={{ textAlign: "center", marginBottom: "1.75rem" }}
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
            Pago seguro con Tarjeta o Mercado Pago
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
            <span style={{ color: "#10B981" }}>1 paso</span>
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
            Pagá de forma 100% automatizada con tarjeta de crédito o débito.
            Activación instantánea.
          </p>
        </motion.div>

        {/* Pasarela de Pago Directa — Argentina */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
              {activeConfig.title}
            </h2>
          </div>

          {/* Monto */}
          <div
            style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              borderRadius: "14px",
              padding: "1.25rem",
              marginBottom: "1.25rem",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)",
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
              Monto del plan mensual ({activeConfig.currency})
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
              {activeConfig.amount}
            </div>
          </div>

          {/* BOTÓN PRINCIPAL — Mercado Pago */}
          {activeConfig.directPayLink && (
            <div style={{ marginBottom: "1.25rem" }}>
              <a
                href={activeConfig.directPayLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  width: "100%",
                  padding: "1.15rem 1.25rem",
                  background: "#10B981",
                  color: "#ffffff",
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 8px 22px rgba(16, 185, 129, 0.35)",
                  boxSizing: "border-box",
                  transition: "transform 0.15s ease",
                }}
              >
                <CreditCard size={20} />
                <span>
                  {activeConfig.directPayLabel ||
                    "Suscribirse (ARS $39.900/mes)"}
                </span>
                <ExternalLink size={16} />
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  marginTop: "0.7rem",
                  fontSize: "0.78rem",
                  color: "#059669",
                  fontWeight: 700,
                }}
              >
                <Zap size={14} /> Acreditación instantánea y activación
                automática
              </div>
            </div>
          )}

          {activeConfig.fields.map((f) => (
            <DataRow
              key={f.label}
              label={f.label}
              value={f.value}
              fieldKey={f.label.toLowerCase()}
              copied={copiedField === f.label.toLowerCase()}
              onCopy={handleCopy}
              small={f.small}
              noCopy={f.noCopy}
            />
          ))}

          <div
            style={{
              marginTop: "1.25rem",
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
                textAlign: "left",
              }}
            >
              {activeConfig.instructions}
            </p>
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  LogOut,
  Sparkles,
  Mail,
  RefreshCw,
  Shield,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { createClient } from "@/lib/supabase-browser";

interface PendienteClientProps {
  email: string;
  paymentId: string;
  createdAt: string;
  amount: number;
}

export default function PendienteClient({
  email,
  paymentId,
  createdAt,
  amount,
}: PendienteClientProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(new Date());

  // Auto-refresh cada 30 segundos por si el admin aprobó el pago
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  const handleManualRefresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1000);
  }, [router]);

  const createdDate = new Date(createdAt);
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  const timeAgo =
    diffMinutes < 1
      ? "hace instantes"
      : diffMinutes < 60
      ? `hace ${diffMinutes} min`
      : diffHours < 24
      ? `hace ${diffHours}h`
      : `hace ${Math.floor(diffHours / 24)}d`;

  const formattedAmount = `$${amount.toLocaleString("es-AR")}`;
  const shortId = paymentId.slice(0, 8).toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Círculos decorativos sutiles */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <NevuxLogo size="medium" />
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
        {/* Hero — Check animado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              boxShadow:
                "0 20px 40px rgba(16, 185, 129, 0.25), 0 0 0 8px rgba(16, 185, 129, 0.08)",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.25,
              }}
            >
              <CheckCircle2 size={50} color="white" strokeWidth={2.5} />
            </motion.div>

            {/* Pulso animado */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid #10b981",
                pointerEvents: "none",
              }}
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.9rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#059669",
              fontWeight: 800,
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Sparkles size={12} />
            Comprobante recibido
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "clamp(1.75rem, 5.5vw, 2.35rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            ¡Ya casi está listo! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.7,
              margin: 0,
              maxWidth: "440px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5,
            }}
          >
            Estamos revisando tu pago. En menos de{" "}
            <strong style={{ color: "#10b981" }}>24hs</strong> vas a poder usar
            todos los widgets sin límite.
          </motion.p>
        </motion.div>

        {/* Card de resumen del pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
              gap: "0.5rem",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <Shield size={16} color="#10B981" />
            <h2
              style={{
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Resumen de tu pago
            </h2>
          </div>

          <SummaryRow label="Monto" value={formattedAmount} highlight />
          <SummaryRow label="Método" value="Naranja X" />
          <SummaryRow label="Referencia" value={`#${shortId}`} mono />
          <SummaryRow label="Enviado" value={timeAgo} />
          <SummaryRow label="Estado" value="En revisión" statusPending />
        </motion.div>

        {/* Timeline de próximos pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
          <h2
            style={{
              fontSize: "0.9rem",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 1.25rem 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            ¿Qué pasa ahora?
          </h2>

          <TimelineStep
            number={1}
            title="Verificamos tu transferencia"
            description="Nuestro equipo revisa el comprobante y confirma el pago"
            active
          />
          <TimelineStep
            number={2}
            title="Te avisamos por email"
            description="Vas a recibir un mail de confirmación a esta casilla"
            icon={<Mail size={14} />}
          />
          <TimelineStep
            number={3}
            title="¡Empezás a vender más!"
            description="Se desbloquean los +15 widgets y todas las funciones"
            icon={<Sparkles size={14} />}
            last
          />
        </motion.div>

        {/* Botón refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ marginBottom: "1.25rem" }}
        >
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              background: "white",
              color: "#10B981",
              border: "1.5px solid #10B981",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: refreshing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontFamily: "inherit",
              transition: "all 0.2s",
              boxSizing: "border-box",
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Actualizando..." : "Verificar estado"}
          </button>
          <p
            style={{
              marginTop: "0.6rem",
              fontSize: "0.75rem",
              color: "#000000",
              opacity: 0.5,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            <Clock size={11} style={{ display: "inline", marginRight: "3px" }} />
            Se actualiza automáticamente cada 30 seg
          </p>
        </motion.div>

        {/* WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid #f3f4f6",
            marginBottom: "1.5rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.4rem 0",
              letterSpacing: "-0.01em",
            }}
          >
            ¿Alguna duda?
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#000000",
              opacity: 0.65,
              margin: "0 0 1rem 0",
            }}
          >
            Escribinos por WhatsApp con tu referencia{" "}
            <strong style={{ color: "#000000", opacity: 1 }}>#{shortId}</strong>
          </p>
          <a
            href={`https://wa.me/5493434163999?text=Hola%20Nevux%2C%20subí%20mi%20comprobante%20de%20pago.%20Referencia%3A%20%23${shortId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
            }}
          >
            <MessageCircle size={17} />
            Contactar por WhatsApp
          </a>
        </motion.div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.78rem",
            color: "#000000",
            opacity: 0.5,
            flexWrap: "wrap",
          }}
        >
          <span>Conectado como {email}</span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "transparent",
              border: "none",
              color: "#000000",
              opacity: 0.7,
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            <LogOut size={12} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componentes auxiliares ───────────

function SummaryRow({
  label,
  value,
  highlight = false,
  mono = false,
  statusPending = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
  statusPending?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.65rem 0",
        borderBottom: "1px solid #f9fafb",
        gap: "0.75rem",
      }}
    >
      <span
        style={{
          fontSize: "0.85rem",
          color: "#000000",
          opacity: 0.6,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      {statusPending ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.7rem",
            background: "#fef3c7",
            borderRadius: "999px",
            fontSize: "0.75rem",
            color: "#b45309",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
          {value}
        </span>
      ) : (
        <span
          style={{
            fontSize: highlight ? "1.05rem" : "0.9rem",
            color: highlight ? "#10B981" : "#000000",
            fontWeight: highlight ? 800 : 700,
            fontFamily: mono
              ? "'SF Mono', Monaco, Consolas, monospace"
              : "inherit",
            textAlign: "right",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function TimelineStep({
  number,
  title,
  description,
  active = false,
  icon,
  last = false,
}: {
  number: number;
  title: string;
  description: string;
  active?: boolean;
  icon?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.85rem",
        marginBottom: last ? 0 : "1rem",
        position: "relative",
      }}
    >
      {/* Línea vertical */}
      {!last && (
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: "32px",
            bottom: "-10px",
            width: "2px",
            background: "#f3f4f6",
          }}
        />
      )}

      {/* Número/icono */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: active ? "#10B981" : "#f3f4f6",
          color: active ? "white" : "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.8rem",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
          boxShadow: active
            ? "0 4px 12px rgba(16, 185, 129, 0.25)"
            : "none",
        }}
      >
        {active ? (
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {number}
          </motion.span>
        ) : (
          icon || number
        )}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: "3px" }}>
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#000000",
            margin: "0 0 0.2rem 0",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#000000",
            opacity: 0.6,
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
    }

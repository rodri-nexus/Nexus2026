"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";

export default function VerificarEmailPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "#f9fafb",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "white",
          borderRadius: "20px",
          padding: "3rem 2rem",
          boxShadow:
            "0 20px 60px rgba(255, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
        }}
      >
        {/* Ícono animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#FF0000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            boxShadow: "0 10px 30px rgba(255, 0, 0, 0.3)",
          }}
        >
          <Mail size={40} color="white" strokeWidth={2} />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#000000",
            margin: "0 0 0.75rem 0",
            letterSpacing: "-0.02em",
          }}
        >
          Revisá tu email
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            color: "#000000",
            opacity: 0.6,
            fontSize: "1rem",
            lineHeight: 1.6,
            margin: "0 0 2rem 0",
          }}
        >
          Te enviamos un email con un link para confirmar tu cuenta.
          Hacé click en el link y ya vas a poder iniciar sesión.
        </motion.p>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            {/* CheckCircle verde — semántico confirmación, se mantiene */}
            <CheckCircle2
              size={20}
              color="#10b981"
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div style={{ fontSize: "0.9rem", color: "#000000" }}>
              <strong>Revisá tu bandeja de entrada</strong>
              <br />
              <span style={{ color: "#000000", opacity: 0.6, fontSize: "0.85rem" }}>
                A veces puede tardar unos minutos en llegar
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            {/* CheckCircle verde — semántico confirmación, se mantiene */}
            <CheckCircle2
              size={20}
              color="#10b981"
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div style={{ fontSize: "0.9rem", color: "#000000" }}>
              <strong>¿No lo encontrás?</strong>
              <br />
              <span style={{ color: "#000000", opacity: 0.6, fontSize: "0.85rem" }}>
                Revisá la carpeta de spam o correo no deseado
              </span>
            </div>
          </div>
        </motion.div>

        {/* Link a login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/login"
            style={{
              color: "#FF0000",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← Volver al inicio de sesión
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
        }

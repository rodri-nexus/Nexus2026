"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

interface HelpLink {
  label: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  external?: boolean;
}

const helpLinks: HelpLink[] = [
  {
    label: "Guía de inicio",
    description: "Aprendé a crear tu primer widget",
    href: "/ayuda/guia",
    icon: BookOpen,
  },
  {
    label: "Preguntas frecuentes",
    description: "Encontrá respuestas rápidas",
    href: "/ayuda/faq",
    icon: HelpCircle,
  },
  {
    label: "Contactar soporte",
    description: "Escribinos, te respondemos rápido",
    href: "mailto:soporte@nevux.app",
    icon: Mail,
    external: true,
  },
];

export default function CentroAyuda() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background:
          "linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, rgba(99, 102, 241, 0.03) 100%)",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "2rem 1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blob decorativo */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header con logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "1.75rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NevuxLogo size="medium" />
        </div>

        <h2
          style={{
            margin: "0.25rem 0 0.35rem",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.01em",
          }}
        >
          Centro de ayuda
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#6b7280",
            maxWidth: "320px",
          }}
        >
          ¿Necesitás una mano? Estamos para ayudarte a sacarle el máximo a
          Nevux.
        </p>
      </div>

      {/* Links de ayuda */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {helpLinks.map((link) => {
          const Icon = link.icon;
          return (
            <HelpLinkItem key={link.href} link={link} Icon={Icon} />
          );
        })}
      </div>

      {/* Footer con contacto directo */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          fontSize: "0.8rem",
          color: "#9ca3af",
          position: "relative",
          zIndex: 1,
        }}
      >
        <MessageCircle size={14} />
        <span>Respondemos en menos de 24hs</span>
      </div>
    </motion.section>
  );
}

// Componente reutilizable para cada link de ayuda
interface HelpLinkItemProps {
  link: HelpLink;
  Icon: typeof BookOpen;
}

function HelpLinkItem({ link, Icon }: HelpLinkItemProps) {
  const content = (
    <>
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} color="#6366f1" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "0.1rem",
          }}
        >
          {link.label}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {link.description}
        </div>
      </div>

      <ArrowUpRight
        size={16}
        color="#9ca3af"
        style={{ flexShrink: 0 }}
      />
    </>
  );

  const commonStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #f3f4f6",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.15s",
    cursor: "pointer",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "#c7d2fe";
    e.currentTarget.style.background = "#f9fafb";
    e.currentTarget.style.transform = "translateX(2px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "#f3f4f6";
    e.currentTarget.style.background = "#ffffff";
    e.currentTarget.style.transform = "translateX(0)";
  };

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        style={commonStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      style={commonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </Link>
  );
        }

"use client";

import { motion } from "framer-motion";
import { TrendingUp, Play, Clock, Shield, Mail, Type } from "lucide-react";
import { WidgetDefinition, WidgetCategory } from "@/types/widgets";

const ICON_MAP: Record<WidgetCategory, React.ReactNode> = {
  conversion: <TrendingUp size={22} color="#6366f1" />,
  multimedia: <Play size={22} color="#6366f1" />,
  urgency: <Clock size={22} color="#6366f1" />,
  trust: <Shield size={22} color="#6366f1" />,
  popup: <Mail size={22} color="#6366f1" />,
  description: <Type size={22} color="#6366f1" />,
};

interface WidgetCardProps {
  widget: WidgetDefinition;
  onClick: () => void;
  index: number;
}

export default function WidgetCard({ widget, onClick, index }: WidgetCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "1.25rem",
        background: "#ffffff",
        border: "1.5px solid #f3f4f6",
        borderRadius: "12px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#f3f4f6";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ICON_MAP[widget.category]}
      </div>

      <div style={{ width: "100%" }}>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "0.35rem",
          }}
        >
          {widget.name}
        </div>
        <div
          style={{
            fontSize: "0.82rem",
            color: "#6b7280",
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {widget.description}
        </div>
      </div>
    </motion.button>
  );
          }

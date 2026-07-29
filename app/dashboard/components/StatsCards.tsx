"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, LayoutGrid, ArrowRight } from "lucide-react";

interface StatsCardsProps {
  productsCount: number;
  activeWidgetsCount: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: typeof Package;
  gradient: string;
  href: string;
  actionLabel: string;
}

export default function StatsCards({
  productsCount,
  activeWidgetsCount,
}: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: "Productos",
      value: productsCount,
      icon: Package,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      href: "/productos",
      actionLabel: "Ver productos",
    },
    {
      label: "Widgets activos",
      value: activeWidgetsCount,
      icon: LayoutGrid,
      gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      href: "/widgets",
      actionLabel: "Ver widgets",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1rem",
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <Link
              href={card.href}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "160px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(99, 102, 241, 0.1)";
                  e.currentTarget.style.borderColor = "#c7d2fe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {/* Top: ícono + label */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: card.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 14px rgba(99, 102, 241, 0.25)",
                      }}
                    >
                      <Icon size={20} color="#ffffff" />
                    </div>

                    <ArrowRight
                      size={18}
                      color="#9ca3af"
                      style={{ opacity: 0.6 }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      fontWeight: 500,
                      marginBottom: "0.35rem",
                    }}
                  >
                    {card.label}
                  </div>

                  <div
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.value}
                  </div>
                </div>

                {/* Bottom: acción */}
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "0.85rem",
                    borderTop: "1px solid #f3f4f6",
                    fontSize: "0.8rem",
                    color: "#6366f1",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {card.actionLabel}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
      }

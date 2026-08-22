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
  tutorialId?: string;
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
      gradient: "#10B981",
      href: "/productos",
      actionLabel: "Ver productos",
      tutorialId: "stats-productos",
    },
    {
      label: "Widgets activos",
      value: activeWidgetsCount,
      icon: LayoutGrid,
      gradient: "#10B981",
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
            {...(card.tutorialId
              ? { "data-tutorial": card.tutorialId }
              : {})}
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
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(16, 185, 129, 0.15)";
                  e.currentTarget.style.borderColor = "#a7f3d0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
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
                        boxShadow: "0 6px 14px rgba(16, 185, 129, 0.25)",
                      }}
                    >
                      <Icon size={20} color="#ffffff" />
                    </div>

                    <ArrowRight
                      size={18}
                      color="#000000"
                      style={{ opacity: 0.4 }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      opacity: 0.6,
                      fontWeight: 500,
                      marginBottom: "0.35rem",
                    }}
                  >
                    {card.label}
                  </div>

                  <div
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 800,
                      color: "#000000",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.value}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "0.85rem",
                    borderTop: "1px solid #f3f4f6",
                    fontSize: "0.8rem",
                    color: "#10B981",
                    fontWeight: 700,
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

'use client';

import { useState } from 'react';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface EditorTabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function EditorTabs({ tabs, children }: EditorTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Barra de tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '6px',
          background: '#f3f4f6',
          borderRadius: 14,
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#10B981' : '#000000',
                opacity: isActive ? 1 : 0.6,
                background: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive
                  ? '0 2px 8px rgba(16, 185, 129, 0.18)'
                  : 'none',
                transition: 'all 0.22s ease',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Contenido del tab activo ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: 2,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            style={{
              display: activeIndex === i ? 'block' : 'none',
              animation: activeIndex === i ? 'fadeSlideIn 0.2s ease' : 'none',
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* ── Keyframes globales ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
                 }

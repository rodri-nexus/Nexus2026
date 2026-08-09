'use client';

import React from 'react';

interface Opinion {
  nombre: string;
  estrellas: number;
  texto: string;
  foto: string; // base64 o url
  compraVerificada: boolean;
}

interface CajaOpinionesConfig {
  opiniones: Opinion[];
  colorFondo: string;
  colorTexto: string;
  colorEstrellas: string;
  mostrarBorde: boolean;
  colorBorde: string;
  fuenteNombre: number;
  fuenteOpinion: number;
  bordeRedondeado: number;
  padding: number;
}

interface Props {
  config: CajaOpinionesConfig;
}

export default function CajaOpinionesPreview({ config }: Props) {
  const opinionesValidas = (config.opiniones || []).filter(
    (o) => o && (o.nombre?.trim() || o.texto?.trim())
  );

  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (idx >= opinionesValidas.length && opinionesValidas.length > 0) {
      setIdx(0);
    }
  }, [opinionesValidas.length, idx]);

  const goPrev = () => {
    if (opinionesValidas.length === 0) return;
    setIdx((i) => (i - 1 + opinionesValidas.length) % opinionesValidas.length);
  };
  const goNext = () => {
    if (opinionesValidas.length === 0) return;
    setIdx((i) => (i + 1) % opinionesValidas.length);
  };

  const renderStars = (n: number, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= n ? config.colorEstrellas : '#E5E7EB',
            fontSize: size,
            lineHeight: 1,
          }}
        >
          ★
        </span>
      );
    }
    return <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>;
  };

  const VerifiedBadge = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#3B82F6"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2l2.09 2.26L17 4l.74 2.91L20 8l-1.26 2.5L20 13l-2.26 1.09L17 17l-2.91-.74L12 18l-2.5-1.26L7 17l-.74-2.91L4 13l1.26-2.5L4 8l2.26-1.09L7 4l2.91.74L12 2z" />
      <path
        d="M9 12l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const NavBtn = ({
    dir,
    onClick,
    disabled,
  }: {
    dir: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        color: disabled ? '#D1D5DB' : '#6B7280',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {dir === 'prev' ? '‹' : '›'}
    </button>
  );

  return (
    <div
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 16,
        background: '#FFFFFF',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {opinionesValidas.length === 0 ? (
        <div
          style={{
            background: '#F3F4F6',
            borderRadius: 10,
            padding: '40px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 15,
            }}
          >
            Agrega opiniones para ver el preview
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <NavBtn dir="prev" onClick={() => {}} disabled />
            <NavBtn dir="next" onClick={() => {}} disabled />
          </div>
        </div>
      ) : (
        <div
          style={{
            background: config.colorFondo,
            color: config.colorTexto,
            borderRadius: config.bordeRedondeado,
            padding: config.padding,
            border: config.mostrarBorde ? `1px solid ${config.colorBorde}` : 'none',
            boxSizing: 'border-box',
          }}
        >
          {(() => {
            const o = opinionesValidas[idx];
            return (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        fontSize: config.fuenteNombre,
                        fontWeight: 700,
                        color: config.colorTexto,
                      }}
                    >
                      {o.nombre || 'Anónimo'}
                    </span>
                    {o.compraVerificada && <VerifiedBadge />}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <NavBtn dir="prev" onClick={goPrev} disabled={opinionesValidas.length < 2} />
                    <NavBtn dir="next" onClick={goNext} disabled={opinionesValidas.length < 2} />
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>{renderStars(o.estrellas || 5, 18)}</div>

                {o.texto && (
                  <div
                    style={{
                      fontSize: config.fuenteOpinion,
                      color: config.colorTexto,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {o.texto}
                  </div>
                )}

                {o.foto && (
                  <div style={{ marginTop: 12 }}>
                    <img
                      src={o.foto}
                      alt="Opinión"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 8,
                        display: 'block',
                      }}
                    />
                  </div>
                )}

                {opinionesValidas.length > 1 && (
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {opinionesValidas.map((_, i) => (
                      <span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: i === idx ? config.colorTexto : '#D1D5DB',
                          opacity: i === idx ? 0.8 : 1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          color: '#6B7280',
          fontSize: 13,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Las opiniones aparecerán justo por debajo del botón de "Agregar al carrito".</span>
      </div>
    </div>
  );
  }

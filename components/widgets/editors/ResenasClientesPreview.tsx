'use client'

import React from 'react'

interface ResenasClientesPreviewProps {
  config: any
}

// ═══════════════════════════════════════════════════════════
// Reseñas mockeadas (solo para el preview del editor)
// ═══════════════════════════════════════════════════════════
const RESENAS_MOCK = [
  {
    id: 'mock-1',
    nombre: 'Valentina P.',
    estrellas: 5,
    verificada: true,
    texto: 'La chaqueta es preciosa. Definitivamente volvería a comprar.',
    foto_url: null,
    fecha: 'Hace 2 días',
    talle: 'M',
    ajuste_talle: 'como_esperaba',
  },
  {
    id: 'mock-2',
    nombre: 'Noa S.',
    estrellas: 5,
    verificada: false,
    texto: 'Lo usé en un evento y recibí muchos comentarios. Excelente calidad y llegó rápido.',
    foto_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    fecha: 'Hace 5 días',
    talle: null,
    ajuste_talle: null,
  },
  {
    id: 'mock-3',
    nombre: 'Camila R.',
    estrellas: 4,
    verificada: true,
    texto: 'Muy buena relación calidad-precio. El talle es fiel a la descripción.',
    foto_url: null,
    fecha: 'Hace 1 semana',
    talle: 'S',
    ajuste_talle: 'como_esperaba',
  },
  {
    id: 'mock-4',
    nombre: 'Martín G.',
    estrellas: 5,
    verificada: true,
    texto: 'Superó mis expectativas. Recomendado 100%.',
    foto_url: null,
    fecha: 'Hace 2 semanas',
    talle: null,
    ajuste_talle: null,
  },
]

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════
function calcularPromedio(reviews: typeof RESENAS_MOCK): number {
  if (reviews.length === 0) return 0
  const suma = reviews.reduce((acc, r) => acc + r.estrellas, 0)
  return parseFloat((suma / reviews.length).toFixed(1))
}

function renderEstrellas(cantidad: number, color: string, size: number) {
  const estrellas = []
  for (let i = 1; i <= 5; i++) {
    estrellas.push(
      <span
        key={i}
        style={{
          color: i <= cantidad ? color : '#e5e5e5',
          fontSize: `${size}px`,
          lineHeight: 1,
        }}
      >
        ★
      </span>
    )
  }
  return <span style={{ display: 'inline-flex', gap: '2px' }}>{estrellas}</span>
}

// ═══════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════
export default function ResenasClientesPreview({ config }: ResenasClientesPreviewProps) {
  const {
    titulo = '',
    textoBoton = 'Escribir reseña',
    subtitulo = '',
    ocultarBotonEscribir = false,
    ocultarSiNoHayResenas = false,
    mostrarFecha = false,
    disenoWidget = 'cuadricula',
    estiloNombre = 'resaltado',
    // Colores
    colorBotones = '#1a1a1a',
    colorFondo = 'transparent',
    colorTitulo = '#1a1a1a',
    colorSubtitulo = '#1a1a1a',
    fondoSubtitulo = 'transparent',
    colorFondoResena = '#fafafa',
    colorNombre = '#1a1a1a',
    colorEstrellas = '#f5b300',
    colorTextoResena = '#555555',
    colorFecha = '#999999',
    // Tipografías
    tamanoTitulo = 22,
    tamanoSubtitulo = 16,
    tamanoEstrellas = 16,
    tamanoNombre = 16,
    // Bordes
    bordeBotones = 25,
  } = config || {}

  const reviews = RESENAS_MOCK
  const promedio = calcularPromedio(reviews)
  const totalReviews = reviews.length

  // Si oculta el widget cuando no hay reseñas (mock siempre tiene reseñas, solo mostramos disclaimer)
  if (ocultarSiNoHayResenas && totalReviews === 0) {
    return (
      <div
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          fontStyle: 'italic',
        }}
      >
        (El widget está oculto porque no hay reseñas visibles)
      </div>
    )
  }

  return (
    <div
      style={{
        background: colorFondo === 'transparent' ? 'transparent' : colorFondo,
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Título del widget */}
      {titulo && (
        <h3
          style={{
            fontSize: `${tamanoTitulo}px`,
            fontWeight: 700,
            color: colorTitulo,
            margin: '0 0 4px 0',
          }}
        >
          {titulo}
        </h3>
      )}

      {/* Subtítulo */}
      {subtitulo && (
        <div
          style={{
            display: 'inline-block',
            fontSize: `${tamanoSubtitulo}px`,
            color: colorSubtitulo,
            background:
              fondoSubtitulo === 'transparent' ? 'transparent' : fondoSubtitulo,
            padding:
              fondoSubtitulo === 'transparent' ? '0' : '4px 10px',
            borderRadius: fondoSubtitulo === 'transparent' ? '0' : '6px',
            marginBottom: '16px',
          }}
        >
          {subtitulo}
        </div>
      )}

      {/* Header con puntaje + botón */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 0',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: colorTitulo,
              lineHeight: 1,
            }}
          >
            {promedio.toString().replace('.', ',')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {renderEstrellas(Math.round(promedio), colorEstrellas, tamanoEstrellas + 4)}
            <div
              style={{
                fontSize: '13px',
                color: '#999',
              }}
            >
              {totalReviews} reseñas
            </div>
          </div>
        </div>

        {!ocultarBotonEscribir && (
          <button
            style={{
              background: colorBotones,
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: `${bordeBotones}px`,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {textoBoton}
          </button>
        )}
      </div>

      {/* Grilla de reseñas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            disenoWidget === 'lista'
              ? '1fr'
              : 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              background: colorFondoResena,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Foto (si tiene) */}
            {r.foto_url && (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#eee',
                }}
              >
                <img
                  src={r.foto_url}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* Nombre + verificada */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: `${tamanoNombre}px`,
                  fontWeight: estiloNombre === 'resaltado' ? 700 : 500,
                  color: colorNombre,
                }}
              >
                {r.nombre}
              </span>
              {r.verificada && (
                <span
                  title="Compra verificada"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#1d9bf0',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
            </div>

            {/* Estrellas */}
            {renderEstrellas(r.estrellas, colorEstrellas, tamanoEstrellas)}

            {/* Texto */}
            <p
              style={{
                fontSize: '14px',
                color: colorTextoResena,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {r.texto}
            </p>

            {/* Fecha (opcional) */}
            {mostrarFecha && (
              <div
                style={{
                  fontSize: '12px',
                  color: colorFecha,
                  marginTop: '4px',
                }}
              >
                {r.fecha}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
    }

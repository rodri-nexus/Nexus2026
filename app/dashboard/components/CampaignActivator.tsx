'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Power,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import { getAllCampaignPresets, CampaignPreset } from '@/lib/campaignPresets';
import { createClient } from '@/lib/supabase-browser';

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CampaignActivatorProps {
  storeId: number;
  onCampaignChange?: () => void;
}

interface ActiveCampaignRecord {
  id: string;
  store_id: number;
  campaign_slug: string;
  activated_at: string;
}

/* ═══════════════════════════════════════════
   ESTILOS AUXILIARES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const containerCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1.5px solid #e5e7eb',
  borderRadius: '20px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  boxSizing: 'border-box',
};

const badgePillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.35rem 0.85rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: MODAL DE CONFIRMACIÓN
═══════════════════════════════════════════ */
function ConfirmCampaignModal({
  preset,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: {
  preset: CampaignPreset | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen || !preset) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '22px',
          padding: '1.8rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4b5563',
          }}
        >
          <X size={16} />
        </button>

        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: preset.bgGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          >
            {preset.emoji}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
              Activar Modo {preset.name}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
              Configuración en 1 Clic para toda tu tienda
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
          {preset.description}
        </p>

        {/* Resumen de cambios automáticos */}
        <div
          style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            ⚡ Qué se actualizará automáticamente:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#1f2937', lineHeight: 1.6 }}>
            <li><b>Cuenta Regresiva:</b> Seteada con fin del evento y colores temáticos.</li>
            <li><b>Banner Deslizante:</b> Textos especiales y llamados a la acción.</li>
            <li><b>Badge Cupón:</b> Código <code style={{ background: '#e5e7eb', padding: '1px 5px', borderRadius: 4 }}>{preset.couponCode}</code> con {preset.couponDiscount}.</li>
            <li><b>Ruleta de Descuentos:</b> Premios y porciones adaptadas al evento.</li>
            <li><b>Barra de Progreso:</b> Mensajes y colores festivos.</li>
          </ul>
        </div>

        {/* Respaldo Seguro Info */}
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '0.75rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}
        >
          <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: '#065f46', lineHeight: 1.4, fontWeight: 600 }}>
            <b>100% Reversible:</b> Nevux guarda un respaldo de tus configuraciones. Podés volver a tu diseño original en cualquier momento.
          </span>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: '1.5px solid #e5e7eb',
              background: '#ffffff',
              color: '#374151',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: preset.accentColor,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Aplicando...
              </>
            ) : (
              <>
                <Zap size={16} />
                ¡Activar Ahora!
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CampaignActivator({
  storeId,
  onCampaignChange,
}: CampaignActivatorProps) {
  const presets = useMemo(() => getAllCampaignPresets(), []);

  const [activeRecord, setActiveRecord] = useState<ActiveCampaignRecord | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<CampaignPreset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Consultar campaña activa actual
  useEffect(() => {
    if (!storeId) return;
    let isMounted = true;

    async function checkActiveCampaign() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('active_campaigns')
          .select('*')
          .eq('store_id', storeId)
          .maybeSingle();

        if (!error && isMounted) {
          setActiveRecord(data);
        }
      } catch (err) {
        console.error('Error fetching active campaign:', err);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    }

    checkActiveCampaign();

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  // Manejar apertura de confirmación
  const handleOpenPreset = (preset: CampaignPreset) => {
    setSelectedPreset(preset);
    setIsModalOpen(true);
  };

  // Aplicar campaña
  const handleApplyCampaign = async () => {
    if (!selectedPreset) return;
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/campaigns/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: storeId,
          campaign_slug: selectedPreset.slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al activar la campaña');
      }

      setActiveRecord({
        id: 'temp-' + Date.now(),
        store_id: storeId,
        campaign_slug: selectedPreset.slug,
        activated_at: new Date().toISOString(),
      });

      setFeedback({
        type: 'success',
        message: `¡Modo ${selectedPreset.name} activado exitosamente en toda tu tienda!`,
      });

      setIsModalOpen(false);
      if (onCampaignChange) onCampaignChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  // Revertir y desactivar campaña
  const handleRevertCampaign = async () => {
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/campaigns/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al desactivar la campaña');
      }

      setActiveRecord(null);
      setFeedback({
        type: 'success',
        message: 'Modo especial desactivado. Tu tienda volvió a su diseño original.',
      });

      if (onCampaignChange) onCampaignChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const activePreset = activeRecord ? presets.find((p) => p.slug === activeRecord.campaign_slug) : null;

  return (
    <div style={containerCardStyle}>
      {/* HEADER DEL ACTIVADOR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              ...badgePillStyle,
              background: 'rgba(234, 88, 12, 0.12)',
              color: '#ea580c',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              marginBottom: '0.45rem',
            }}
          >
            <Flame size={12} color="#ea580c" />
            1-Click Booster
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.01em',
            }}
          >
            Modo Fechas Especiales & Black Friday
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
            Transformá toda tu tienda con 1 solo clic en las fechas comerciales más importantes del año.
          </p>
        </div>

        {loadingInitial && <Loader2 size={18} color="#10B981" className="animate-spin" />}
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '12px',
              background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: feedback.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BANNER SI HAY CAMPAÑA ACTIVA */}
      {activePreset && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: activePreset.bgGradient,
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            color: '#ffffff',
            marginBottom: '1.5rem',
            border: `1.5px solid ${activePreset.accentColor}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                fontSize: '2rem',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {activePreset.emoji}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>
                  Modo {activePreset.name} ACTIVO
                </span>
                <span
                  style={{
                    background: '#10B981',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                  }}
                >
                  ● En Vivo
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>
                Tus widgets están sincronizados con la temática y los cupones de {activePreset.name}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRevertCampaign}
            disabled={actionLoading}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.4)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            {actionLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Power size={16} color="#fda4af" />
            )}
            Desactivar y volver a estado normal
          </button>
        </motion.div>
      )}

      {/* GRID DE MODOS ESPECIALES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {presets.map((preset) => {
          const isCurrentlyActive = activeRecord?.campaign_slug === preset.slug;

          return (
            <div
              key={preset.slug}
              style={{
                background: '#ffffff',
                border: isCurrentlyActive ? `2px solid ${preset.accentColor}` : '1.5px solid #f3f4f6',
                borderRadius: '16px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isCurrentlyActive ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {/* Top Header Card */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: preset.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {preset.emoji}
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '999px',
                      background: '#f3f4f6',
                      color: '#374151',
                    }}
                  >
                    {preset.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#000000', marginBottom: '0.3rem' }}>
                  {preset.name}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {preset.description}
                </p>
              </div>

              {/* Botón de Activación */}
              <div>
                {isCurrentlyActive ? (
                  <div
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    ✓ Activo ahora
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPreset(preset)}
                    disabled={actionLoading}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e5e7eb',
                      background: '#ffffff',
                      color: '#000000',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = preset.accentColor;
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    <span>Activar Modo</span>
                    <ArrowRight size={14} color="#6b7280" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <ConfirmCampaignModal
            preset={selectedPreset}
            isOpen={isModalOpen}
            isLoading={actionLoading}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleApplyCampaign}
          />
        )}
      </AnimatePresence>
    </div>
  );
    }

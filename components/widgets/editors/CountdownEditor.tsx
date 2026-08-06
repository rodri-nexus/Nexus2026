// components/widgets/editors/CountdownEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CountdownPreview from './CountdownPreview';
import {
  Toggle,
  ColorPicker,
  Slider,
  FieldInput,
  FieldSelect,
  SectionTitle,
} from './EditorFields';

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
interface WidgetDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface ExistingWidget {
  id: string;
  config: any;
  is_active: boolean;
  target_type: string;
  target_product_id: number | null;
}

interface CountdownEditorProps {
  widgetDefinition: WidgetDefinition;
  existingWidget: ExistingWidget | null;
  targetType: 'product' | 'all';
  productId: number | null;
  storeId: string;
}

type CountdownStyle = 'clasico' | 'retro' | 'glass' | 'neon' | 'flash';
type TimerMode = 'flash' | 'fixed';

interface CountdownConfig {
  title: string;
  subtitle: string;
  mode: TimerMode;
  flashMinutes: number;
  endDate: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  autoRestart: boolean;
  showOnProduct: boolean;
  productPosition: 'before-button' | 'before-title';
  showAsTopBar: boolean;
  showOnCart: boolean;
  style: CountdownStyle;
  alignment: 'center' | 'left';
  showLabels: boolean;
  scale: number;
  bgType: 'solid' | 'gradient';
  colorWidgetBg: string;
  colorSubtitleBg: string;
  colorClockBg: string;
  colorTitle: string;
  colorSubtitle: string;
  colorNumbers: string;
  auraEnabled: boolean;
  colorAuraCalm: string;
  colorAuraMedium: string;
  colorAuraUrgent: string;
  effectsIntensity: number;
  showShimmer: boolean;
  showProgressRing: boolean;
  showParticles: boolean;
  showBounce: boolean;
  showGlowBreath: boolean;
  showVibration: boolean;
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeClock: string;
  borderRadiusClock: number;
  borderRadiusWidget: number;
  paddingWidget: number;
  paddingClock: number;
}

/* ═══════════════════════════════════════════
   CONFIG POR DEFECTO
═══════════════════════════════════════════ */
const defaultConfig: CountdownConfig = {
  title: '🔥 Flash Sale',
  subtitle: 'No te lo pierdas — oferta por tiempo limitado',
  mode: 'flash',
  flashMinutes: 15,
  endDate: '',
  showDays: false,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  autoRestart: true,
  showOnProduct: true,
  productPosition: 'before-button',
  showAsTopBar: false,
  showOnCart: false,
  style: 'flash',
  alignment: 'center',
  showLabels: true,
  scale: 1,
  bgType: 'solid',
  colorWidgetBg: '#DC2626',
  colorSubtitleBg: '#991B1B',
  colorClockBg: '#1a1a2e',
  colorTitle: '#ffffff',
  colorSubtitle: '#fecaca',
  colorNumbers: '#ffffff',
  auraEnabled: true,
  colorAuraCalm: '#8b5cf6',
  colorAuraMedium: '#f97316',
  colorAuraUrgent: '#ef4444',
  effectsIntensity: 80,
  showShimmer: true,
  showProgressRing: false,
  showParticles: true,
  showBounce: true,
  showGlowBreath: true,
  showVibration: true,
  fontSizeTitle: '16px',
  fontSizeSubtitle: '12px',
  fontSizeClock: '22px',
  borderRadiusClock: 8,
  borderRadiusWidget: 12,
  paddingWidget: 20,
  paddingClock: 8,
};

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function toDatetimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

function formatEnd(s: string): string {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (d.toDateString() === new Date().toDateString()) return `Termina hoy a las ${hh}:${mm}`;
  return `Termina el ${d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} a las ${hh}:${mm}`;
}

/* ═══════════════════════════════════════════
   SUB: Card colapsable
═══════════════════════════════════════════ */
function EditorCard({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        marginBottom: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
          {title}
        </span>
        <span style={{ fontSize: 12, color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      {open && <div style={{ padding: '12px 16px 16px' }}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB: Chip de placement
═══════════════════════════════════════════ */
function PlacementChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: active ? '2px solid #6366f1' : '1.5px solid #d1d5db',
        background: active ? '#eef2ff' : '#fafafa',
        color: active ? '#4f46e5' : '#6b7280',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {active && '✓ '}{label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   SUB: Card de estilo
═══════════════════════════════════════════ */
function StyleCard({
  value,
  label,
  emoji,
  active,
  onClick,
}: {
  value: string;
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 8px',
        borderRadius: 12,
        border: active ? '2px solid #6366f1' : '2px solid #e5e7eb',
        background: active ? '#eef2ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#4f46e5' : '#374151' }}>
        {label}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CountdownEditor({
  widgetDefinition,
  existingWidget,
  targetType,
  productId,
  storeId,
}: CountdownEditorProps) {
  const router = useRouter();

  const [config, setConfig] = useState<CountdownConfig>(() => {
    const merged = { ...defaultConfig, ...(existingWidget?.config || {}) };
    // Si viene de flash mode, recalcular endDate
    if (merged.mode === 'flash' && (!merged.endDate || new Date(merged.endDate).getTime() < Date.now())) {
      merged.endDate = toDatetimeLocal(new Date(Date.now() + merged.flashMinutes * 60 * 1000));
    }
    return merged;
  });

  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [isDesktop, setIsDesktop] = useState(false);

  const isEditing = !!existingWidget;

  // Responsive
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const update = <K extends keyof CountdownConfig>(key: K, value: CountdownConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Flash mode: aplicar preset
  const applyFlash = (minutes: number) => {
    const end = new Date(Date.now() + minutes * 60 * 1000);
    setConfig((prev) => ({
      ...prev,
      mode: 'flash' as TimerMode,
      flashMinutes: minutes,
      endDate: toDatetimeLocal(end),
      autoRestart: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showDays: false,
    }));
  };

  // Guardar
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSavedOK(false);
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingWidget?.id ?? null,
          widget_slug: widgetDefinition.slug,
          store_id: storeId,
          target_type: targetType,
          target_product_id: productId,
          config,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar');
      setSavedOK(true);
      setTimeout(() => router.push('/dashboard'), 900);
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  /* ═══ SIDEBAR CONTENT ═══ */
  const sidebarContent = (
    <>
      {/* ── TIMER ── */}
      <EditorCard title="Timer" icon="⏱" defaultOpen={true}>
        {/* Modo */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'flash' as TimerMode, label: '⚡ Flash Loop', desc: 'Se reinicia solo' },
            { id: 'fixed' as TimerMode, label: '📅 Fecha fija', desc: 'Deadline real' },
          ].map((m) => {
            const act = config.mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  update('mode', m.id);
                  if (m.id === 'flash') applyFlash(config.flashMinutes || 15);
                }}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  borderRadius: 10,
                  border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                  background: act ? '#eef2ff' : '#fafafa',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: act ? '#4f46e5' : '#374151' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{m.desc}</div>
              </button>
            );
          })}
        </div>

        {config.mode === 'flash' ? (
          <>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>
              Elegí la duración del loop:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
              {[
                { min: 5, label: '5m' },
                { min: 10, label: '10m' },
                { min: 15, label: '15m' },
                { min: 30, label: '30m' },
              ].map((p) => {
                const act = config.flashMinutes === p.min;
                return (
                  <button
                    key={p.min}
                    type="button"
                    onClick={() => applyFlash(p.min)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 8,
                      border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                      background: act ? '#eef2ff' : '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      color: act ? '#4f46e5' : '#374151',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
              {[
                { min: 60, label: '1 hora' },
                { min: 120, label: '2 horas' },
              ].map((p) => {
                const act = config.flashMinutes === p.min;
                return (
                  <button
                    key={p.min}
                    type="button"
                    onClick={() => applyFlash(p.min)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 8,
                      border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                      background: act ? '#eef2ff' : '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      color: act ? '#4f46e5' : '#374151',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#15803d', marginBottom: 12 }}>
              ✓ Muestra 00:{String(config.flashMinutes).padStart(2, '0')}:00 → cuando llega a 00:00:00 se reinicia
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                Fecha y hora de cierre
              </label>
              <input
                type="datetime-local"
                value={config.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#1a1a2e',
                  background: '#fafafa',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {config.endDate && (
                <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 600 }}>
                  ✓ {formatEnd(config.endDate)}
                </div>
              )}
            </div>
            <Toggle
              label="Reiniciar al terminar"
              description="Vuelve a arrancar cuando llega a 0"
              checked={config.autoRestart}
              onChange={(v) => update('autoRestart', v)}
            />
          </>
        )}

        <div style={{ height: 8 }} />
        <FieldInput label="Título" value={config.title} placeholder="🔥 Flash Sale" onChange={(v) => update('title', v)} />
        <FieldInput label="Subtítulo" value={config.subtitle} placeholder="No te lo pierdas" onChange={(v) => update('subtitle', v)} />

        <SectionTitle>Unidades visibles</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Toggle label="Días" checked={config.showDays} onChange={(v) => update('showDays', v)} />
          <Toggle label="Horas" checked={config.showHours} onChange={(v) => update('showHours', v)} />
          <Toggle label="Minutos" checked={config.showMinutes} onChange={(v) => update('showMinutes', v)} />
          <Toggle label="Segundos" checked={config.showSeconds} onChange={(v) => update('showSeconds', v)} />
        </div>
      </EditorCard>

      {/* ── DESIGN ── */}
      <EditorCard title="Diseño" icon="🎨" defaultOpen={true}>
        <SectionTitle>Estilo</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StyleCard value="flash" label="Flash Sale" emoji="🔥" active={config.style === 'flash'} onClick={() => update('style', 'flash')} />
          <StyleCard value="glass" label="Glass" emoji="💎" active={config.style === 'glass'} onClick={() => update('style', 'glass')} />
          <StyleCard value="neon" label="Neon" emoji="⚡" active={config.style === 'neon'} onClick={() => update('style', 'neon')} />
          <StyleCard value="clasico" label="Clásico" emoji="⏱️" active={config.style === 'clasico'} onClick={() => update('style', 'clasico')} />
          <StyleCard value="retro" label="Retro" emoji="🎰" active={config.style === 'retro'} onClick={() => update('style', 'retro')} />
        </div>

        <Slider label="Escala del widget" value={Math.round(config.scale * 100)} min={70} max={150} onChange={(v) => update('scale', v / 100)} />

        <SectionTitle>Tipo de fondo</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['solid', 'gradient'] as const).map((t) => {
            const act = config.bgType === t;
            return (
              <button key={t} type="button" onClick={() => update('bgType', t)} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                background: act ? '#eef2ff' : '#fafafa',
                fontSize: 13, fontWeight: 700, color: act ? '#4f46e5' : '#374151',
                cursor: 'pointer',
              }}>
                {t === 'solid' ? 'Sólido' : 'Degradé'}
              </button>
            );
          })}
        </div>

        <SectionTitle>Colores</SectionTitle>
        <ColorPicker label="Fondo del widget" value={config.colorWidgetBg} onChange={(v) => update('colorWidgetBg', v)} />
        {config.bgType === 'gradient' && (
          <ColorPicker label="Segundo color degradé" value={config.colorSubtitleBg} onChange={(v) => update('colorSubtitleBg', v)} />
        )}
        <ColorPicker label="Fondo del reloj" value={config.colorClockBg} onChange={(v) => update('colorClockBg', v)} />
        <ColorPicker label="Texto título" value={config.colorTitle} onChange={(v) => update('colorTitle', v)} />
        <ColorPicker label="Texto subtítulo" value={config.colorSubtitle} onChange={(v) => update('colorSubtitle', v)} />
        <ColorPicker label="Números del reloj" value={config.colorNumbers} onChange={(v) => update('colorNumbers', v)} />

        <SectionTitle>Tipografía</SectionTitle>
        <FieldSelect label="Tamaño título" value={config.fontSizeTitle} onChange={(v) => update('fontSizeTitle', v)} options={[
          { value: '13px', label: 'Pequeño' }, { value: '16px', label: 'Mediano' },
          { value: '20px', label: 'Grande' }, { value: '24px', label: 'Muy grande' },
        ]} />
        <FieldSelect label="Tamaño subtítulo" value={config.fontSizeSubtitle} onChange={(v) => update('fontSizeSubtitle', v)} options={[
          { value: '10px', label: 'Pequeño' }, { value: '12px', label: 'Mediano' }, { value: '14px', label: 'Grande' },
        ]} />
        <FieldSelect label="Tamaño reloj" value={config.fontSizeClock} onChange={(v) => update('fontSizeClock', v)} options={[
          { value: '16px', label: 'Pequeño' }, { value: '20px', label: 'Mediano' },
          { value: '22px', label: 'Grande' }, { value: '26px', label: 'Muy grande' }, { value: '32px', label: 'Enorme' },
        ]} />

        <SectionTitle>Espacios y bordes</SectionTitle>
        <Slider label="Borde del reloj" value={config.borderRadiusClock} min={0} max={25} onChange={(v) => update('borderRadiusClock', v)} />
        <Slider label="Borde del widget" value={config.borderRadiusWidget} min={0} max={30} onChange={(v) => update('borderRadiusWidget', v)} />
        <Slider label="Margen widget" value={config.paddingWidget} min={8} max={40} onChange={(v) => update('paddingWidget', v)} />
        <Slider label="Margen reloj" value={config.paddingClock} min={2} max={20} onChange={(v) => update('paddingClock', v)} />

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {(['center', 'left'] as const).map((a) => {
            const act = config.alignment === a;
            return (
              <button key={a} type="button" onClick={() => update('alignment', a)} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                background: act ? '#eef2ff' : '#fafafa', fontSize: 12, fontWeight: 700,
                color: act ? '#4f46e5' : '#374151', cursor: 'pointer',
              }}>
                {a === 'center' ? '↔ Centrado' : '⬅ Izquierda'}
              </button>
            );
          })}
        </div>

        <div style={{ height: 10 }} />
        <Toggle label="Mostrar etiquetas (HRS, MIN, SEG)" checked={config.showLabels} onChange={(v) => update('showLabels', v)} />
      </EditorCard>

      {/* ── EFFECTS ── */}
      <EditorCard title="Efectos premium" icon="✨" defaultOpen={false}>
        <Slider label="Intensidad de efectos" value={config.effectsIntensity} min={0} max={100} onChange={(v) => update('effectsIntensity', v)} />
        <div style={{ height: 8 }} />

        <Toggle label="💎 Reflejo cristal (shimmer)" description="Brillo diagonal que se desliza cada 5 segundos" checked={config.showShimmer} onChange={(v) => update('showShimmer', v)} />
        <Toggle label="🌟 Rebote elástico" description="Los dígitos rebotan al cambiar" checked={config.showBounce} onChange={(v) => update('showBounce', v)} />
        <Toggle label="✨ Glow respirante" description="Aura suave que respira alrededor del widget" checked={config.showGlowBreath} onChange={(v) => update('showGlowBreath', v)} />
        <Toggle label="🔥 Partículas de urgencia" description="Chispas flotantes cuando queda poco tiempo" checked={config.showParticles} onChange={(v) => update('showParticles', v)} />
        <Toggle label="📏 Barra de progreso" description="Barra que se vacía con el tiempo" checked={config.showProgressRing} onChange={(v) => update('showProgressRing', v)} />
        <Toggle label="📳 Vibración final" description="El widget vibra en los últimos 10 segundos" checked={config.showVibration} onChange={(v) => update('showVibration', v)} />

        <div style={{ height: 12 }} />
        <SectionTitle>Aura dinámica por tiempo</SectionTitle>
        <Toggle label="Activar aura dinámica" description="Cambia de color según cuánto falta" checked={config.auraEnabled} onChange={(v) => update('auraEnabled', v)} />
        {config.auraEnabled && (
          <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 12, padding: 14, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10, lineHeight: 1.4 }}>
              Personalizá los colores del aura. Cambian automáticamente.
            </div>
            <ColorPicker label="🟢 Calma (+1 hora)" value={config.colorAuraCalm} onChange={(v) => update('colorAuraCalm', v)} />
            <ColorPicker label="🟡 Media (10-60 min)" value={config.colorAuraMedium} onChange={(v) => update('colorAuraMedium', v)} />
            <ColorPicker label="🔴 Urgente (últimos 10 min)" value={config.colorAuraUrgent} onChange={(v) => update('colorAuraUrgent', v)} />
          </div>
        )}
      </EditorCard>

      {/* ── PLACEMENT ── */}
      <EditorCard title="Ubicación" icon="📍" defaultOpen={true}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.4 }}>
          Elegí dónde aparece el widget. Cada ubicación tiene su propio diseño optimizado.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <PlacementChip label="🏠 Home (barra)" active={config.showAsTopBar} onClick={() => update('showAsTopBar', !config.showAsTopBar)} />
          <PlacementChip label="🛍 Producto" active={config.showOnProduct} onClick={() => update('showOnProduct', !config.showOnProduct)} />
          <PlacementChip label="🛒 Carrito" active={config.showOnCart} onClick={() => update('showOnCart', !config.showOnCart)} />
        </div>

        {config.showOnProduct && (
          <div style={{ paddingLeft: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Posición en el producto:
            </div>
            {[
              { value: 'before-button', label: 'Antes del botón "Agregar al carrito"', desc: 'Máxima conversión' },
              { value: 'before-title', label: 'Antes del título del producto', desc: 'Impacto visual arriba' },
            ].map((opt) => {
              const act = config.productPosition === opt.value;
              return (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: act ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                    background: act ? '#eef2ff' : '#fafafa',
                    marginBottom: 8,
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: act ? '5px solid #6366f1' : '2px solid #d1d5db',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{opt.desc}</div>
                  </div>
                  <input
                    type="radio"
                    name="productPosition"
                    value={opt.value}
                    checked={act}
                    onChange={() => update('productPosition', opt.value as any)}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })}
          </div>
        )}
      </EditorCard>
    </>
  );

  /* ═══ PREVIEW ═══ */
  const previewContent = (
    <div style={{ position: 'relative' }}>
      {/* Desktop/Mobile toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
        <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 3, display: 'inline-flex', gap: 2 }}>
          {(['desktop', 'mobile'] as const).map((m) => {
            const act = previewMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setPreviewMode(m)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: act ? '#ffffff' : 'transparent',
                  boxShadow: act ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: act ? '#1a1a2e' : '#9ca3af',
                  cursor: 'pointer',
                }}
              >
                {m === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview container */}
      <div style={{
        maxWidth: previewMode === 'desktop' ? 600 : 375,
        margin: '0 auto',
        transform: `scale(${config.scale})`,
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease, max-width 0.3s ease',
      }}>
        <CountdownPreview config={config as any} />
      </div>
    </div>
  );

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', paddingBottom: isDesktop ? 20 : 100 }}>
      {/* ── HEADER ── */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1px solid #e5e7eb', background: '#fafafa',
            cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#374151', flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isEditing ? 'Editando' : 'Nuevo widget'}
          </div>
          <div style={{
            fontSize: 16, fontWeight: 700, color: '#1a1a2e',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {widgetDefinition.name}
          </div>
        </div>

        {/* Botones header (siempre visibles) */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#d1d5db'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer', fontSize: 11, fontWeight: 700,
              color: isActive ? '#059669' : '#6b7280',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: isActive ? '#10b981' : '#9ca3af',
            }} />
            {isActive ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}
          >
            {saving ? '...' : savedOK ? '✓' : isEditing ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{
        display: isDesktop ? 'flex' : 'block',
        maxWidth: 1200,
        margin: '0 auto',
        padding: isDesktop ? '20px 20px' : '16px 12px',
        gap: 20,
      }}>
        {/* MOBILE: preview arriba */}
        {!isDesktop && (
          <div style={{ marginBottom: 16 }}>
            {previewContent}
          </div>
        )}

        {/* SIDEBAR */}
        <div style={{
          width: isDesktop ? 380 : '100%',
          flexShrink: 0,
          maxHeight: isDesktop ? 'calc(100vh - 80px)' : 'none',
          overflowY: isDesktop ? 'auto' : 'visible',
          paddingRight: isDesktop ? 4 : 0,
        }}>
          {sidebarContent}
        </div>

        {/* DESKTOP: preview a la derecha */}
        {isDesktop && (
          <div style={{
            flex: 1,
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {previewContent}
          </div>
        )}
      </div>

      {/* ── FOOTER MOBILE ── */}
      {!isDesktop && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
          zIndex: 30,
        }}>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 10,
              border: '1.5px solid ' + (isActive ? '#10b981' : '#e5e7eb'),
              background: isActive ? '#ecfdf5' : '#fafafa',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? '#10b981' : '#9ca3af' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#059669' : '#6b7280' }}>
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 12,
              border: 'none',
              background: savedOK
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            {saving ? 'Guardando...' : savedOK ? '✓ Guardado' : isEditing ? 'Guardar cambios' : 'Crear widget'}
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          position: 'fixed', bottom: isDesktop ? 20 : 90,
          left: 16, right: 16,
          background: '#fee2e2', color: '#991b1b',
          padding: '12px 16px', borderRadius: 12,
          fontSize: 13, fontWeight: 600,
          border: '1px solid #fecaca', zIndex: 40,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

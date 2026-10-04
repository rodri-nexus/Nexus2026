"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';

/* =========================================================================
   INTERFACES Y FUNCIONES AUXILIARES
   ========================================================================= */
interface WidgetConfig {
  cuotas: number;
  minAmount: number;
  msgDefault: string;
  msgCalculated: string;
  template: "moderna" | "flotante" | "minimal" | "bold" | "oscura" | "neon";
  size: "small" | "normal" | "large";
  desktopPos: "top" | "bottom";
  mobilePos: "same" | "top" | "bottom" | "hide";
  iconType: "emoji" | "fontawesome";
  emojiIcon: string;
  inProductBanner: boolean;
  stickyGlobal: boolean;
  inCartDrawer: boolean;
  bgColor: string;
  accentColor: string;
  textColor: string;
  campaignTheme: string;
}

type TabType = 'general' | 'design' | 'fechas';

const THEMES = {
  "black-friday": { bg: "#111827", accent: "#F59E0B", text: "#ffffff" },
  "hot-sale": { bg: "#0F172A", accent: "#EF4444", text: "#ffffff" },
  "cyber-monday": { bg: "#090D16", accent: "#3B82F6", text: "#ffffff" },
  "navidad": { bg: "#064E3B", accent: "#EF4444", text: "#ffffff" },
  "san-valentin": { bg: "#831843", accent: "#F43F5E", text: "#ffffff" },
  "dia-padre-madre": { bg: "#312E81", accent: "#10B981", text: "#ffffff" },
  "liquidacion": { bg: "#7F1D1D", accent: "#FBBF24", text: "#ffffff" }
};

/* =========================================================================
   COMPONENTE PREVIEW LOCAL
   ========================================================================= */
function BarraCuotasPreview({ config }: { config: WidgetConfig }) {
  const [simCartTotal, setSimCartTotal] = useState(35000);

  const {
    cuotas, msgDefault, msgCalculated, template, size, iconType, emojiIcon,
    bgColor, accentColor, textColor, campaignTheme
  } = config;

  let finalBg = bgColor;
  let finalAccent = accentColor;
  let finalTxt = textColor;

  if (campaignTheme && campaignTheme !== "none" && THEMES[campaignTheme as keyof typeof THEMES]) {
    const t = THEMES[campaignTheme as keyof typeof THEMES];
    finalBg = t.bg;
    finalAccent = t.accent;
    finalTxt = t.text;
  }

  const formatMoney = (val: number) => {
    return "$" + Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const montoCuota = simCartTotal > 0 ? (simCartTotal / cuotas) : 0;
  
  let displayText = simCartTotal > 0 
    ? msgCalculated.replace("{{cuotas}}", cuotas.toString()).replace("{{monto_cuota}}", formatMoney(montoCuota))
    : msgDefault.replace("{{cuotas}}", cuotas.toString());

  const padCss = size === "small" ? "8px 14px" : (size === "large" ? "16px 24px" : "12px 18px");
  const bgCss = template === "oscura" ? "#000000" : (template === "neon" ? "#090D16" : finalBg);
  const borderCss = template === "neon" ? `1.5px solid ${finalAccent}` : "none";
  const radiusCss = template === "flotante" ? "999px" : (template === "moderna" ? "10px" : "0px");
  const shadowCss = template === "neon" ? `0 0 12px ${finalAccent}60` : "0 4px 12px rgba(0,0,0,0.12)";
  const fontSizeCss = size === "small" ? "12px" : (size === "large" ? "15px" : "13.5px");

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-2">
        <button onClick={() => setSimCartTotal(0)} className={`px-3 py-1 rounded text-xs font-bold ${simCartTotal === 0 ? 'bg-[#10B981] text-white' : 'bg-gray-200 text-gray-700'}`}>0 Carrito</button>
        <button onClick={() => setSimCartTotal(35000)} className={`px-3 py-1 rounded text-xs font-bold ${simCartTotal === 35000 ? 'bg-[#10B981] text-white' : 'bg-gray-200 text-gray-700'}`}>$35.000 Carrito</button>
      </div>

      <div className="w-full bg-gray-100 min-h-[120px] rounded-xl relative flex items-center justify-center p-4 overflow-hidden border border-gray-200">
        <div style={{
          background: bgCss, border: borderCss, borderRadius: radiusCss, padding: padCss, boxShadow: shadowCss,
          color: finalTxt, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", maxWidth: "800px"
        }}>
          {iconType === "emoji" ? (
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{emojiIcon}</span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={finalAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          )}
          <span style={{ fontSize: fontSizeCss, fontWeight: 800, textAlign: "center", lineHeight: 1.3 }}>
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPONENTE PRINCIPAL (EDITOR)
   ========================================================================= */
export default function BarraCuotasEditor({ widgetId, storeId }: { widgetId?: string; storeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [config, setConfig] = useState<WidgetConfig>({
    cuotas: 3,
    minAmount: 0,
    msgDefault: "¡Hasta {{cuotas}} cuotas sin interés en toda la tienda! 🎉",
    msgCalculated: "Pagá en {{cuotas}} cuotas sin interés de {{monto_cuota}}",
    template: "moderna",
    size: "normal",
    desktopPos: "top",
    mobilePos: "same",
    iconType: "emoji",
    emojiIcon: "💳",
    inProductBanner: true,
    stickyGlobal: true,
    inCartDrawer: true,
    bgColor: "#111827",
    accentColor: "#10B981",
    textColor: "#ffffff",
    campaignTheme: "none"
  });

  useEffect(() => {
    if (widgetId) {
      loadWidget();
    }
  }, [widgetId]);

  async function loadWidget() {
    setLoading(true);
    const { data, error } = await supabase.from('store_widgets').select('*').eq('id', widgetId).single();
    if (data && data.config) {
      setConfig({ ...config, ...data.config });
    }
    setLoading(false);
  }

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value };
      if (['bgColor', 'accentColor', 'textColor'].includes(key)) {
        next.campaignTheme = 'none';
      }
      return next;
    });
  };

  async function handleSave() {
    setSaving(true);
    const payload = {
      store_id: storeId,
      widget_slug: 'barra-cuotas',
      is_active: true,
      config: config
    };

    if (widgetId) {
      await supabase.from('store_widgets').update(payload).eq('id', widgetId);
    } else {
      await supabase.from('store_widgets').insert([payload]);
    }
    setSaving(false);
    router.push('/dashboard');
    router.refresh();
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Barra de Cuotas Sin Interés</h1>
          <p className="text-sm text-gray-500 font-medium">Categoría: Conversión</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">VISTA PREVIA EN VIVO</h2>
        <BarraCuotasPreview config={config} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
          <button onClick={() => setActiveTab('general')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'general' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-white' : 'text-gray-500 hover:text-gray-900'}`}>⚙️ General</button>
          <button onClick={() => setActiveTab('design')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'design' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-white' : 'text-gray-500 hover:text-gray-900'}`}>🎨 Diseño y Colores</button>
          <button onClick={() => setActiveTab('fechas')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'fechas' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-white' : 'text-gray-500 hover:text-gray-900'}`}>🔥 Fechas Especiales</button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-sm text-orange-800 font-semibold uppercase mb-1">⚠️ IMPORTANTE</p>
                <p className="text-sm text-orange-700">
                  Esta barra es informativa. Las cuotas sin interés reales las definís en tu medio de pago (Mercado Pago, Ualá, etc.). Asegurate de que la cantidad de cuotas configurada acá coincida con lo que tenés en tu pasarela, para no prometerle al cliente algo que después no aparece en el checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Cantidad de Cuotas</label>
                  <input type="number" value={config.cuotas} onChange={e => updateConfig('cuotas', parseInt(e.target.value) || 1)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Monto Mínimo de Compra (Opcional)</label>
                  <input type="number" value={config.minAmount} onChange={e => updateConfig('minAmount', parseFloat(e.target.value) || 0)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Mensaje Default (Carrito en 0)</label>
                  <input type="text" value={config.msgDefault} onChange={e => updateConfig('msgDefault', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium" />
                  <p className="text-xs text-gray-500 mt-1">Usa <code className="bg-gray-200 px-1 rounded">{{cuotas}}</code> para el número.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Mensaje Calculado (Con precio/carrito)</label>
                  <input type="text" value={config.msgCalculated} onChange={e => updateConfig('msgCalculated', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium" />
                  <p className="text-xs text-gray-500 mt-1">Usa <code className="bg-gray-200 px-1 rounded">{{cuotas}}</code> y <code className="bg-gray-200 px-1 rounded">{{monto_cuota}}</code>.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">Ubicaciones del Widget</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={config.stickyGlobal} onChange={e => updateConfig('stickyGlobal', e.target.checked)} className="w-5 h-5 text-[#10B981] bg-gray-100 border-gray-300 rounded focus:ring-[#10B981]" />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Barra Fija Global (Sticky)</span>
                      <span className="block text-xs text-gray-500 font-medium">Sigue al usuario mientras navega.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={config.inProductBanner} onChange={e => updateConfig('inProductBanner', e.target.checked)} className="w-5 h-5 text-[#10B981] bg-gray-100 border-gray-300 rounded focus:ring-[#10B981]" />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Debajo del Botón de Compra</span>
                      <span className="block text-xs text-gray-500 font-medium">Se inyecta en la ficha del producto.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={config.inCartDrawer} onChange={e => updateConfig('inCartDrawer', e.target.checked)} className="w-5 h-5 text-[#10B981] bg-gray-100 border-gray-300 rounded focus:ring-[#10B981]" />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Dentro del Carrito Lateral</span>
                      <span className="block text-xs text-gray-500 font-medium">Visible al abrir el carrito.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Plantilla Visual</label>
                  <select value={config.template} onChange={e => updateConfig('template', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium">
                    <option value="moderna">Moderna (Bordes redondeados)</option>
                    <option value="flotante">Flotante (Estilo píldora)</option>
                    <option value="minimal">Minimalista (Bordes rectos)</option>
                    <option value="oscura">Dark Mode Forzado</option>
                    <option value="neon">Neón Gamer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Tamaño</label>
                  <select value={config.size} onChange={e => updateConfig('size', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium">
                    <option value="small">Pequeño</option>
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Posición Desktop (Sticky)</label>
                  <select value={config.desktopPos} onChange={e => updateConfig('desktopPos', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium">
                    <option value="top">Arriba (Top)</option>
                    <option value="bottom">Abajo (Bottom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Posición Mobile (Sticky)</label>
                  <select value={config.mobilePos} onChange={e => updateConfig('mobilePos', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium">
                    <option value="same">Igual que Desktop</option>
                    <option value="top">Forzar Arriba</option>
                    <option value="bottom">Forzar Abajo</option>
                    <option value="hide">Ocultar en Mobile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Tipo de Ícono</label>
                  <select value={config.iconType} onChange={e => updateConfig('iconType', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium">
                    <option value="emoji">Emoji Nativo</option>
                    <option value="fontawesome">Ícono Vectorial (Tarjeta)</option>
                  </select>
                </div>
                {config.iconType === 'emoji' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Emoji</label>
                    <input type="text" value={config.emojiIcon} onChange={e => updateConfig('emojiIcon', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#10B981] focus:border-[#10B981] block p-3 font-medium" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">Colores Personalizados</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Fondo</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.bgColor} onChange={e => updateConfig('bgColor', e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.bgColor} onChange={e => updateConfig('bgColor', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#10B981] focus:border-[#10B981] block p-2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Acento/Ícono</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.accentColor} onChange={e => updateConfig('accentColor', e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.accentColor} onChange={e => updateConfig('accentColor', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#10B981] focus:border-[#10B981] block p-2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Texto</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.textColor} onChange={e => updateConfig('textColor', e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.textColor} onChange={e => updateConfig('textColor', e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#10B981] focus:border-[#10B981] block p-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fechas' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-medium mb-4">Activar un preset pisará los colores personalizados. Si editás un color manualmente, el preset se desactivará.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${config.campaignTheme === 'none' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="campaignTheme" value="none" checked={config.campaignTheme === 'none'} onChange={() => updateConfig('campaignTheme', 'none')} className="hidden" />
                  <span className="text-sm font-bold text-gray-900">Ninguno (Usar mis colores)</span>
                </label>
                {Object.entries(THEMES).map(([key, t]) => (
                  <label key={key} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${config.campaignTheme === key ? 'border-[#10B981] bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="campaignTheme" value={key} checked={config.campaignTheme === key} onChange={() => updateConfig('campaignTheme', key)} className="hidden" />
                    <span className="text-sm font-bold text-gray-900 capitalize">{key.replace(/-/g, ' ')}</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: t.bg }}></div>
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: t.accent }}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all text-lg flex items-center justify-center gap-2">
        {saving ? 'GUARDANDO...' : 'GUARDAR WIDGET'}
      </button>

      <div className="text-center mt-12 mb-8">
        <a href="https://wa.me/5493435042812" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-full transition-colors">
          <span>Soporte Nevux</span>
        </a>
      </div>
    </div>
  );
}

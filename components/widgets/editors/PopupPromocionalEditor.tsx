'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Save, Eye, Sparkles, Palette, Mail, 
  Upload, Image as ImageIcon, MousePointer
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface Props {
  widgetDefinition: any
  existingWidget?: any
  targetType?: any
  productId?: any
  categoryId?: any
  storeId: any
}

const CAMPAIGN_PRESETS = [
  { id: 'black-friday', name: 'Black Friday', bg: '#0F172A', text: '#FFFFFF', btnBg: '#F59E0B', btnText: '#000000' },
  { id: 'hot-sale', name: 'Hot Sale', bg: '#FFFFFF', text: '#0F172A', btnBg: '#EF4444', btnText: '#FFFFFF' },
  { id: 'cyber-monday', name: 'Cyber Monday', bg: '#090D16', text: '#FFFFFF', btnBg: '#3B82F6', btnText: '#FFFFFF' },
  { id: 'navidad', name: 'Navidad', bg: '#064E3B', text: '#FFFFFF', btnBg: '#EF4444', btnText: '#FFFFFF' },
  { id: 'san-valentin', name: 'San Valentín', bg: '#FFF1F2', text: '#831843', btnBg: '#F43F5E', btnText: '#FFFFFF' },
  { id: 'dia-padre-madre', name: 'Día Especial', bg: '#F0FDF4', text: '#166534', btnBg: '#10B981', btnText: '#FFFFFF' },
  { id: 'liquidacion', name: 'Liquidación', bg: '#FEF2F2', text: '#991B1B', btnBg: '#DC2626', btnText: '#FFFFFF' },
]

export default function PopupPromocionalEditor({
  widgetDefinition,
  existingWidget,
  targetType: initialTargetType = 'all',
  productId: initialProductId = null,
  categoryId: initialCategoryId = null,
  storeId,
}: Props) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'contenido' | 'estilos' | 'disparo'>('general')

  // Config State
  const initialConfig = existingWidget?.config || {}
  const [isActive, setIsActive] = useState(existingWidget ? existingWidget.is_active : true)
  const [targetType, setTargetType] = useState(existingWidget?.target_type || initialTargetType)
  
  // Text Content
  const [title, setTitle] = useState(initialConfig.title || '¡Oferta especial!')
  const [subtitle, setSubtitle] = useState(initialConfig.subtitle || 'Aprovechá esta promoción exclusiva')
  const [bodyText, setBodyText] = useState(initialConfig.body_text || 'Descuentos imperdibles en toda la tienda por tiempo limitado.')
  const [legalText, setLegalText] = useState(initialConfig.legal_text || 'Válido por tiempo limitado. No acumulable con otras promociones.')
  const [headerImage, setHeaderImage] = useState(initialConfig.header_image || '')

  // Countdown & Email
  const [showCountdown, setShowCountdown] = useState(initialConfig.show_countdown ?? true)
  const [countdownDate, setCountdownDate] = useState(initialConfig.countdown_date || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16))
  const [collectEmail, setCollectEmail] = useState(initialConfig.collect_email ?? true)

  // CTA Button
  const [btnText, setBtnText] = useState(initialConfig.btn_text || '¡Quiero aprovechar!')
  const [btnActionType, setBtnActionType] = useState<'close' | 'link'>(initialConfig.btn_action_type || 'close')
  const [btnLink, setBtnLink] = useState(initialConfig.btn_link || '')
  const [showReopenBtn, setShowReopenBtn] = useState(initialConfig.show_reopen_btn ?? true)

  // Trigger & Frequency
  const [trigger, setTrigger] = useState(initialConfig.trigger || 'enter')
  const [frequency, setFrequency] = useState(initialConfig.frequency || 'once-visit')

  // Appearance
  const [bgColor, setBgColor] = useState(initialConfig.bg_color || '#ffffff')
  const [textColor, setTextColor] = useState(initialConfig.text_color || '#111827')
  const [btnBgColor, setBtnBgColor] = useState(initialConfig.btn_bg_color || '#10B981')
  const [btnTextColor, setBtnTextColor] = useState(initialConfig.btn_text_color || '#ffffff')
  const [titleSize, setTitleSize] = useState(initialConfig.title_size || '22')
  const [borderRadius, setBorderRadius] = useState(initialConfig.border_radius || '16')
  const [campaignTheme, setCampaignTheme] = useState(initialConfig.campaignTheme || 'none')

  // Canvas Image Compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const scale = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        setHeaderImage(compressedBase64)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const applyPreset = (preset: typeof CAMPAIGN_PRESETS[0]) => {
    setCampaignTheme(preset.id)
    setBgColor(preset.bg)
    setTextColor(preset.text)
    setBtnBgColor(preset.btnBg)
    setBtnTextColor(preset.btnText)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        store_id: storeId,
        widget_slug: 'popup-promocional',
        name: 'Pop-up Promocional',
        is_active: isActive,
        target_type: targetType,
        product_id: targetType === 'product' ? initialProductId : null,
        category_id: targetType === 'category' ? initialCategoryId : null,
        config: {
          title,
          subtitle,
          body_text: bodyText,
          legal_text: legalText,
          header_image: headerImage,
          show_countdown: showCountdown,
          countdown_date: countdownDate,
          collect_email: collectEmail,
          btn_text: btnText,
          btn_action_type: btnActionType,
          btn_link: btnLink,
          show_reopen_btn: showReopenBtn,
          trigger,
          frequency,
          bg_color: bgColor,
          text_color: textColor,
          btn_bg_color: btnBgColor,
          btn_text_color: btnTextColor,
          title_size: titleSize,
          border_radius: borderRadius,
          campaignTheme,
        },
      }

      if (existingWidget?.id) {
        await supabase.from('widgets').update(payload).eq('id', existingWidget.id)
      } else {
        await supabase.from('widgets').insert([payload])
      }

      router.push('/widgets')
      router.refresh()
    } catch (err) {
      console.error('Error al guardar:', err)
      alert('Ocurrió un error al guardar el widget.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Pop-up Promocional
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Nevux
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Captá la atención de tus visitantes con ofertas y cuenta regresiva
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              General
            </button>
            <button
              onClick={() => setActiveTab('contenido')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'contenido'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Contenido
            </button>
            <button
              onClick={() => setActiveTab('estilos')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'estilos'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Estilos
            </button>
            <button
              onClick={() => setActiveTab('disparo')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'disparo'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              Disparo
            </button>
          </div>

          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Fechas Especiales (Presets)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAMPAIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      campaignTheme === preset.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{preset.name}</span>
                    <div className="flex gap-1 mt-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.bg }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.btnBg }} />
                    </div>
                  </button>
                ))}
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ubicación / Target de Segmentación
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Toda la tienda' },
                    { id: 'product', label: 'Ficha producto' },
                    { id: 'category', label: 'Categoría' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetType(item.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                        targetType === item.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTENIDO */}
          {activeTab === 'contenido' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título principal
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Texto del cuerpo (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Imagen de cabecera
                  </label>
                  <div className="flex items-center gap-3">
                    {headerImage ? (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border">
                        <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setHeaderImage('')}
                          className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Subir imagen
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Captar Email</span>
                    <span className="text-[11px] text-slate-400">Agrega un campo para recolectar correos</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={collectEmail}
                    onChange={(e) => setCollectEmail(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Cuenta Regresiva</span>
                    <span className="text-[11px] text-slate-400">Muestra timer de urgencia</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCountdown}
                    onChange={(e) => setShowCountdown(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </div>

                {showCountdown && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha límite de la oferta
                    </label>
                    <input
                      type="datetime-local"
                      value={countdownDate}
                      onChange={(e) => setCountdownDate(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <hr className="border-slate-100 dark:border-slate-800" />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Texto del botón de acción
                  </label>
                  <input
                    type="text"
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Acción del botón
                    </label>
                    <select
                      value={btnActionType}
                      onChange={(e: any) => setBtnActionType(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="close">Cerrar Pop-up</option>
                      <option value="link">Abrir Link Externo</option>
                    </select>
                  </div>
                  {btnActionType === 'link' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        URL destino
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={btnLink}
                        onChange={(e) => setBtnLink(e.target.value)}
                        className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Texto legal / aclaración
                  </label>
                  <input
                    type="text"
                    value={legalText}
                    onChange={(e) => setLegalText(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: ESTILOS */}
          {activeTab === 'estilos' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fondo del modal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color de texto
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fondo del botón
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={btnBgColor}
                      onChange={(e) => setBtnBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={btnBgColor}
                      onChange={(e) => setBtnBgColor(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Texto del botón
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={btnTextColor}
                      onChange={(e) => setBtnTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={btnTextColor}
                      onChange={(e) => setBtnTextColor(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tamaño de título (px)
                  </label>
                  <input
                    type="number"
                    value={titleSize}
                    onChange={(e) => setTitleSize(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bordes redondeados (px)
                  </label>
                  <input
                    type="number"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: DISPARO & FRECUENCIA */}
          {activeTab === 'disparo' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ¿Cuándo debe aparecer el Pop-up? (Trigger)
                </label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="enter">Al ingresar a la tienda (Inmediato)</option>
                  <option value="delay-5">Esperar 5 segundos</option>
                  <option value="delay-10">Esperar 10 segundos</option>
                  <option value="scroll-50">Al scrollear 50% de la página</option>
                  <option value="exit-intent">Intención de salida (Exit Intent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frecuencia de despliegue
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="once-visit">Una sola vez por sesión / visita</option>
                  <option value="once-day">Una vez al día</option>
                  <option value="always">Siempre que navegue</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Botón flotante de reapertura
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Muestra un widget en la esquina para volver a abrir el pop-up
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showReopenBtn}
                  onChange={(e) => setShowReopenBtn(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview Box */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Previsualización en tiempo real
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                Interactive
              </span>
            </div>

            {/* Simulated Popup Canvas */}
            <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-4 min-h-[380px] flex items-center justify-center">
              <div
                className="w-full max-w-[340px] shadow-2xl overflow-hidden transition-all duration-300 relative"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                {/* Close Button */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center text-xs font-bold z-10">
                  ✕
                </div>

                {headerImage && (
                  <img src={headerImage} alt="Header" className="w-full h-32 object-cover block" />
                )}

                <div className="p-5 text-center space-y-3">
                  {title && (
                    <div
                      className="font-bold leading-tight"
                      style={{ fontSize: `${Math.min(Number(titleSize), 22)}px` }}
                    >
                      {title}
                    </div>
                  )}

                  {subtitle && (
                    <div className="text-xs opacity-80 leading-snug">{subtitle}</div>
                  )}

                  {bodyText && (
                    <div className="text-[11px] opacity-75 leading-relaxed">{bodyText}</div>
                  )}

                  {showCountdown && (
                    <div className="flex justify-center gap-1.5 py-1">
                      <div className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-center">
                        <span className="block text-xs font-extrabold" style={{ color: btnBgColor }}>02</span>
                        <span className="text-[8px] uppercase opacity-60">Días</span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-center">
                        <span className="block text-xs font-extrabold" style={{ color: btnBgColor }}>14</span>
                        <span className="text-[8px] uppercase opacity-60">Hs</span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-center">
                        <span className="block text-xs font-extrabold" style={{ color: btnBgColor }}>35</span>
                        <span className="text-[8px] uppercase opacity-60">Min</span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-center">
                        <span className="block text-xs font-extrabold" style={{ color: btnBgColor }}>50</span>
                        <span className="text-[8px] uppercase opacity-60">Seg</span>
                      </div>
                    </div>
                  )}

                  {collectEmail && (
                    <input
                      type="email"
                      placeholder="Tu email aquí..."
                      disabled
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                  )}

                  <button
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-bold transition shadow-sm"
                    style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                  >
                    {btnText}
                  </button>

                  {legalText && (
                    <div className="text-[9px] opacity-50 leading-tight">{legalText}</div>
                  )}
                </div>
              </div>

              {showReopenBtn && (
                <div
                  className="absolute bottom-3 left-3 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1"
                  style={{ backgroundColor: btnBgColor, color: btnTextColor }}
                >
                  🎁 Oferta
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }

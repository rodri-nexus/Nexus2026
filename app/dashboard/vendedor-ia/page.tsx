"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  Bot, 
  Send, 
  Settings, 
  MessageSquare, 
  ShoppingBag, 
  Zap, 
  ArrowRight,
  User
} from "lucide-react";

export default function VendedorIAPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Settings State
  const [settings, setSettings] = useState({
    enabled: true,
    human_tone: "warm",
    auto_whatsapp: true,
    custom_prompt: ""
  });

  // Chat State
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const res = await fetch(`/api/ai/virtual-salesman?user_id=${user.id}`);
        const data = await res.json();
        if (data && !data.error) setSettings(data);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveSettings = async () => {
    setSaving(true);
    await fetch("/api/ai/virtual-salesman", {
      method: "POST",
      body: JSON.stringify({
        action: "save",
        user_id: user?.id,
        settings
      })
    });
    setSaving(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        body: JSON.stringify({
          action: "chat",
          user_id: user?.id, // CRÍTICO: Enviamos el ID para que el backend busque la tienda
          message: input,
          history: messages
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Perdón, tuve un problema técnico. ¿Me repetís?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando configuración...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bot className="text-emerald-500 w-8 h-8" />
          Vendedor Virtual IA
        </h1>
        <p className="text-gray-400 mt-2">Tu asistente inteligente que vende por vos 24/7 en tu tienda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PANEL DE CONFIGURACIÓN */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 text-emerald-500 font-semibold uppercase text-sm tracking-wider">
            <Settings className="w-4 h-4" />
            Configuración del Asesor
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Tono de Voz</label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                value={settings.human_tone}
                onChange={(e) => setSettings({...settings, human_tone: e.target.value})}
              >
                <option value="warm">Empático y Cálido (Recomendado)</option>
                <option value="professional">Profesional y Directo</option>
                <option value="enthusiastic">Súper Entusiasta y Vendedor</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <p className="text-white font-medium">Cierre por WhatsApp</p>
                <p className="text-xs text-gray-400">Ofrecer derivar al chat humano para cerrar la venta</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, auto_whatsapp: !settings.auto_whatsapp})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.auto_whatsapp ? 'bg-emerald-500' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.auto_whatsapp ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Instrucciones Personalizadas (Opcional)</label>
              <textarea 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                placeholder="Ej: 'Menciona siempre que tenemos 3 cuotas sin interés'..."
                value={settings.custom_prompt}
                onChange={(e) => setSettings({...settings, custom_prompt: e.target.value})}
              />
            </div>

            <button 
              onClick={saveSettings}
              disabled={saving}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>

        {/* SIMULADOR DE CHAT */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-800/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Bot className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Simulador en Vivo</p>
                <p className="text-emerald-500 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  CONECTADO A TIENDANUBE
                </p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1120]">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Probá tu Vendedor Virtual acá abajo.<br/>Preguntale por productos, precios o talles.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-gray-900 font-medium rounded-tr-none' 
                    : 'bg-gray-800 text-white rounded-tl-none border border-gray-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white p-3 rounded-2xl rounded-tl-none border border-gray-700 animate-pulse text-xs">
                  Nevux IA está escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="relative">
              <input 
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="Preguntá algo a tu IA..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={chatLoading}
                className="absolute right-2 top-1.5 p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-gray-900 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                                                                          }

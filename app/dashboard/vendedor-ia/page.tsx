"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Bot, 
  Send, 
  Settings, 
  MessageSquare, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function VendedorIAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [settings, setSettings] = useState({
    enabled: true,
    human_tone: "warm",
    auto_whatsapp: true,
    custom_prompt: ""
  });

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const res = await fetch(`/api/ai/virtual-salesman?user_id=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error) setSettings(data);
          }
        }
      } catch (e) {
        console.error("Error cargando configuración del vendedor:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await fetch("/api/ai/virtual-salesman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          user_id: user.id,
          settings
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Error guardando settings:", e);
    } finally {
      setSaving(false);
    }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          user_id: user?.id,
          message: input,
          history: messages
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || "¡Hola! Decime en qué te puedo ayudar." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Perdón, tuve una pequeña interrupción. ¿Me repetís tu consulta?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Cargando Vendedor Virtual IA...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 text-white">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <Bot className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Vendedor Virtual IA</h1>
            <p className="text-gray-400 text-sm mt-0.5">Asesor comercial inteligente y empático 24/7 conectado a tu Tiendanube.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PANEL DE CONFIGURACIÓN */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            Configuración del Asesor
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tono de Voz</label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
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
                <p className="text-sm font-medium text-white">Cierre por WhatsApp</p>
                <p className="text-xs text-gray-400">Ofrecer derivar al chat humano para concretar la venta</p>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({...settings, auto_whatsapp: !settings.auto_whatsapp})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.auto_whatsapp ? 'bg-emerald-500' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.auto_whatsapp ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instrucciones Personalizadas (Opcional)</label>
              <textarea 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                placeholder="Ej: 'Menciona siempre que enviamos gratis a todo el país en compras superiores a $40.000'..."
                value={settings.custom_prompt}
                onChange={(e) => setSettings({...settings, custom_prompt: e.target.value})}
              />
            </div>

            <button 
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {saving ? "Guardando..." : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Configuración Guardada
                </>
              ) : "Guardar Cambios"}
            </button>
          </div>
        </div>

        {/* SIMULADOR DE CHAT */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[550px] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800 bg-gray-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                <Bot className="text-emerald-500 w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Simulador en Vivo</p>
                <p className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  CONECTADO A TIENDANUBE
                </p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/60">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">Probá tu Vendedor Virtual acá abajo.</p>
                <p className="text-gray-500 text-xs mt-1">Preguntale por productos, precios, talles o envíos.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-gray-950 font-medium rounded-tr-none' 
                    : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700/80 shadow-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-emerald-400 p-3 rounded-2xl rounded-tl-none border border-gray-700/80 text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Nevux IA está respondiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-500"
                placeholder="Preguntá algo a tu IA..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                type="button"
                onClick={handleSendMessage}
                disabled={chatLoading}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-gray-950 font-bold transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
          }

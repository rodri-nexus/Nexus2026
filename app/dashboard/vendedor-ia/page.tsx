"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Bot, 
  Send, 
  Settings, 
  MessageSquare,
  Zap,
  ShoppingBag
} from "lucide-react";

// Inicializamos Supabase fuera o dentro, pero con los valores correctos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VendedorIAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        try {
          const res = await fetch(`/api/ai/virtual-salesman?user_id=${user.id}`);
          const data = await res.json();
          if (data && !data.error) setSettings(data);
        } catch (e) {
          console.error("Error cargando settings");
        }
      }
      setLoading(false);
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
    await fetch("/api/ai/virtual-salesman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        user_id: user.id,
        settings
      })
    });
    setSaving(false);
    alert("Configuración guardada");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading || !user) return;

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
          user_id: user.id,
          message: input,
          history: messages
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Perdón, che, se me cortó la conexión. ¿Me repetís?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white bg-[#0B1120] min-h-screen text-center">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-[#0B1120] p-4 md:p-8 pb-24 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <Bot className="text-emerald-500 w-8 h-8" />
            <h1 className="text-2xl font-bold">Vendedor Virtual IA</h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">El asistente inteligente que atiende tu tienda 24/7.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PANEL CONFIGURACION */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6 text-emerald-500 font-semibold text-xs uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Personalización
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tono de voz del asesor</label>
                <select 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                  value={settings.human_tone}
                  onChange={(e) => setSettings({...settings, human_tone: e.target.value})}
                >
                  <option value="warm">Cálido y Humano (Recomendado)</option>
                  <option value="professional">Profesional</option>
                  <option value="enthusiastic">Vendedor Entusiasta</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div>
                  <p className="text-sm font-medium">Cierre por WhatsApp</p>
                  <p className="text-[10px] text-gray-500">Ofrecer chat humano al detectar intención de compra</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, auto_whatsapp: !settings.auto_whatsapp})}
                  className={`w-10 h-5 rounded-full transition-colors relative ${settings.auto_whatsapp ? 'bg-emerald-500' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.auto_whatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Instrucciones extra</label>
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white h-24 resize-none text-sm outline-none focus:border-emerald-500"
                  placeholder="Ej: Menciona que tenemos 10% off en efectivo..."
                  value={settings.custom_prompt}
                  onChange={(e) => setSettings({...settings, custom_prompt: e.target.value})}
                />
              </div>

              <button 
                onClick={saveSettings}
                disabled={saving}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-3 rounded-xl transition-all"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>

          {/* SIMULADOR */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[550px] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-800 bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Bot className="text-emerald-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter">Simulador Nevux</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-emerald-500 font-bold uppercase">Catálogo Live Tiendanube</span>
                  </div>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F172A]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs italic">Preguntale qué productos hay en stock...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-emerald-500 p-2 px-4 rounded-full text-[10px] animate-pulse">
                    IA Nevux escribiendo...
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-900 border-t border-gray-800">
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500"
                  placeholder="Escribí tu mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={chatLoading}
                  className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-gray-900 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }

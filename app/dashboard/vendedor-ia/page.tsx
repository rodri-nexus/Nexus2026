"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Bot, 
  Send, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingCart, 
  Settings, 
  Zap, 
  CheckCircle2, 
  Info,
  Layers,
  LayoutDashboard,
  Package,
  HelpCircle,
  Search,
  Bell,
  Store
} from "lucide-react";

// Sidebar integrada
function SideMenu() {
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Carritos Abandonados", href: "/dashboard/carritos", icon: ShoppingCart },
    { label: "Productos & Stock", href: "/dashboard/productos", icon: Package },
    { label: "Copilot IA", href: "/dashboard/vendedor-ia", icon: Bot, active: true },
    { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
  ];

  return (
    <aside style={{ width: "260px", backgroundColor: "#ffffff", borderRight: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, zIndex: 20 }}>
      {/* Brand Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "18px" }}>
          N
        </div>
        <div>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827", letterSpacing: "-0.02em" }}>Nevux</span>
          <span style={{ fontSize: "10px", backgroundColor: "#ecfdf5", color: "#10B981", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", marginLeft: "6px" }}>SaaS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ padding: "0 12px 8px 12px", fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Menú Principal
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <Link key={idx} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#10B981" : "#4b5563",
                backgroundColor: isActive ? "#ecfdf5" : "transparent",
                transition: "all 0.15s ease",
                cursor: "pointer"
              }}>
                <Icon size={18} color={isActive ? "#10B981" : "#6b7280"} />
                <span>{item.label}</span>
                {isActive && (
                  <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Store Info */}
      <div style={{ padding: "16px", borderTop: "1.5px solid #f3f4f6", backgroundColor: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={18} color="#4b5563" />
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Tiendanube Conectada</div>
            <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "500" }}>● En línea</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Dashboard Header integrado
function DashboardHeader() {
  return (
    <header style={{ height: "64px", backgroundColor: "#ffffff", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "320px" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <Search size={16} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Buscar órdenes, productos, métricas..." 
            style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", backgroundColor: "#fafafa" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "6px" }}>
          <Bell size={20} color="#4b5563" />
          <span style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }} />
        </button>
        <div style={{ height: "24px", width: "1px", backgroundColor: "#e5e7eb" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "13px" }}>
            NV
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>Merchant Nevux</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>Tiendanube AR</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Centro de Ayuda integrado
function CentroAyuda() {
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div style={{ backgroundColor: "#ecfdf5", padding: "8px", borderRadius: "8px" }}>
          <HelpCircle size={20} color="#10B981" />
        </div>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>Centro de Soporte Copilot</h3>
      </div>
      <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.5", marginBottom: "16px" }}>
        ¿Tenés dudas de cómo potenciar las ventas con Nevux Copilot? Nuestro equipo técnico y de estrategia te apoya en tiempo real.
      </p>
      <a 
        href="https://wa.me/5491122334455?text=Hola%20Nevux,%20necesito%20ayuda%20con%20el%20Copilot" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#ecfdf5", color: "#10B981", fontWeight: "600", fontSize: "13px", textDecoration: "none", border: "1px solid #a7f3d0" }}
      >
        Hablar con Soporte Oficial
      </a>
    </div>
  );
}

export default function VendedorIAPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'mcp'>('chat');
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu Copilot de Nevux. Estoy conectado a tu Tiendanube en tiempo real. ¿Querés saber cómo vienen las ventas de hoy, revisar el stock o recuperar carritos?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    whatsapp_phone: "",
    daily_report_enabled: true,
    stock_alerts_enabled: true,
    auto_cart_recovery: false
  });

  useEffect(() => {
    fetchMetrics();
    fetchSettings();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/ai/virtual-salesman');
      const data = await res.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/ai/copilot-settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/ai/copilot-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Configuración guardada con éxito");
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/virtual-salesman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Perdón, tuve un problema al conectar con tu tienda. ¿Probamos de nuevo?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <SideMenu />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashboardHeader />
        
        <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {/* Header de la sección */}
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
                Nevux Copilot IA
              </h1>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Tu asistente comercial inteligente conectado a Tiendanube.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", backgroundColor: "#fff", padding: "4px", borderRadius: "8px", border: "1.5px solid #e5e7eb" }}>
              <button 
                onClick={() => setActiveTab('chat')}
                style={{ 
                  padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", transition: "all 0.2s",
                  backgroundColor: activeTab === 'chat' ? "#10B981" : "transparent",
                  color: activeTab === 'chat' ? "#fff" : "#6b7280",
                  border: "none", cursor: "pointer"
                }}
              >
                Chat Live
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                style={{ 
                  padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", transition: "all 0.2s",
                  backgroundColor: activeTab === 'settings' ? "#10B981" : "transparent",
                  color: activeTab === 'settings' ? "#fff" : "#6b7280",
                  border: "none", cursor: "pointer"
                }}
              >
                WhatsApp & Reportes
              </button>
              <button 
                onClick={() => setActiveTab('mcp')}
                style={{ 
                  padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", transition: "all 0.2s",
                  backgroundColor: activeTab === 'mcp' ? "#10B981" : "transparent",
                  color: activeTab === 'mcp' ? "#fff" : "#6b7280",
                  border: "none", cursor: "pointer"
                }}
              >
                Conexión MCP
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }}>
            
            {/* Columna Izquierda: Acción Principal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", height: "600px", display: "flex", flexDirection: "column", overflow: "hidden" }}
                  >
                    <div style={{ padding: "16px", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }}></div>
                      <span style={{ fontWeight: "600", color: "#374151" }}>Copilot Online</span>
                    </div>
                    
                    <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                      {messages.map((msg, i) => (
                        <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: "80%" }}>
                          <div style={{ 
                            padding: "12px 16px", borderRadius: "12px", fontSize: "14px", lineHeight: "1.5",
                            backgroundColor: msg.role === 'user' ? "#10B981" : "#f3f4f6",
                            color: msg.role === 'user' ? "#fff" : "#1f2937",
                            border: msg.role === 'user' ? "none" : "1.5px solid #e5e7eb"
                          }}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && <div style={{ color: "#9ca3af", fontSize: "12px", fontStyle: "italic" }}>El Copilot está analizando tu tienda...</div>}
                    </div>

                    <div style={{ padding: "16px", borderTop: "1.5px solid #e5e7eb", display: "flex", gap: "8px" }}>
                      <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Preguntale al Copilot (ej: ¿Cómo vienen las ventas?)"
                        style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "14px" }}
                      />
                      <button 
                        onClick={sendMessage}
                        style={{ backgroundColor: "#10B981", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}
                      >
                        <Send size={16} /> Enviar
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", padding: "24px" }}
                  >
                    <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Settings size={20} color="#10B981" /> Configuración de Notificaciones
                    </h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Tu número de WhatsApp (con código de país, ej: 54911...)</label>
                        <input 
                          type="text"
                          value={settings.whatsapp_phone}
                          onChange={(e) => setSettings({...settings, whatsapp_phone: e.target.value})}
                          placeholder="5491122334455"
                          style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1.5px solid #e5e7eb", outline: "none" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px" }}>Reporte Diario Automático</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>Recibí un resumen de ventas a las 20:00hs.</div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={settings.daily_report_enabled}
                          onChange={(e) => setSettings({...settings, daily_report_enabled: e.target.checked})}
                          style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px" }}>Alertas de Stock Crítico</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>Avisame cuando un producto se esté agotando.</div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={settings.stock_alerts_enabled}
                          onChange={(e) => setSettings({...settings, stock_alerts_enabled: e.target.checked})}
                          style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                        />
                      </div>

                      <button 
                        onClick={saveSettings}
                        style={{ backgroundColor: "#10B981", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginTop: "10px" }}
                      >
                        Guardar Configuración
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'mcp' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", padding: "24px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ backgroundColor: "#ecfdf5", padding: "10px", borderRadius: "10px" }}>
                        <Layers size={24} color="#10B981" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>Model Context Protocol (MCP)</h2>
                        <span style={{ fontSize: "12px", color: "#10B981", fontWeight: "600" }}>ESTADO: ACTIVO & SEGURO</span>
                      </div>
                    </div>

                    <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                      Nevux utiliza el protocolo <strong>MCP</strong> para permitir que modelos de lenguaje avanzado (como Claude 3.5 o GPT-4o) comprendan el contexto de tu tienda de manera segura y estandarizada.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                      <div style={{ padding: "16px", border: "1.5px solid #e5e7eb", borderRadius: "10px" }}>
                        <Zap size={18} color="#10B981" style={{ marginBottom: "8px" }} />
                        <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>Acceso a Datos Live</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>La IA no adivina, lee directamente tus órdenes y stock.</div>
                      </div>
                      <div style={{ padding: "16px", border: "1.5px solid #e5e7eb", borderRadius: "10px" }}>
                        <CheckCircle2 size={18} color="#10B981" style={{ marginBottom: "8px" }} />
                        <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>Privacidad de Grado Bancario</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>Tus credenciales nunca se comparten con la IA.</div>
                      </div>
                    </div>

                    <div style={{ padding: "16px", backgroundColor: "#eff6ff", borderRadius: "10px", border: "1px solid #dbeafe" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#1e40af", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                        <Info size={16} /> Tip del CEO
                      </div>
                      <p style={{ fontSize: "13px", color: "#1e40af", opacity: 0.9 }}>
                        El MCP permite que Nevux sea compatible con herramientas como Cursor o Claude Desktop. Si sos desarrollador, podés conectar tu propio agente a la API de Nevux.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Columna Derecha: Métricas en Tiempo Real */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Card: Ventas Hoy */}
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ backgroundColor: "#ecfdf5", padding: "8px", borderRadius: "8px" }}>
                    <TrendingUp size={20} color="#10B981" />
                  </div>
                  <span style={{ fontSize: "12px", color: "#10B981", fontWeight: "600", backgroundColor: "#d1fae5", padding: "2px 8px", borderRadius: "12px" }}>
                    Live
                  </span>
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Ventas de Hoy</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "4px 0" }}>
                  ARS ${metrics?.totalSales?.toLocaleString() || "0"}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Sincronizado hace segundos
                </div>
              </div>

              {/* Card: Carritos */}
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ backgroundColor: "#eff6ff", padding: "8px", borderRadius: "8px" }}>
                    <ShoppingCart size={20} color="#3b82f6" />
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Carritos Recuperables</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "4px 0" }}>
                  {metrics?.abandonedCartsCount || 0}
                </div>
                <button 
                  onClick={() => setInput("¿Cómo puedo recuperar los carritos abandonados?")}
                  style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: "600" }}
                >
                  Recuperar ahora →
                </button>
              </div>

              {/* Card: Stock Crítico */}
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ backgroundColor: "#fff1f2", padding: "8px", borderRadius: "8px" }}>
                    <AlertTriangle size={20} color="#f43f5e" />
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Stock Crítico</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color="#f43f5e", margin: "4px 0" }}>
                  {metrics?.criticalStockProducts?.length || 0} <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "400" }}>productos</span>
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                  {metrics?.criticalStockProducts?.length > 0 ? "Requiere reposición inmediata" : "Inventario saludable"}
                </div>
              </div>

              {/* Card: Proyección Semanal */}
              <div style={{ backgroundColor: "#111827", padding: "20px", borderRadius: "12px", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <Bot size={18} color="#10B981" />
                  <span style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Proyección IA</span>
                </div>
                <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>Cierre de semana estimado</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>
                  ARS ${(metrics?.totalSales * 7.2 || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style={{ height: "4px", width: "100%", backgroundColor: "#374151", borderRadius: "2px", overflow: "hidden", marginBottom: "8px" }}>
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "65%" }}
                    style={{ height: "100%", backgroundColor: "#10B981" }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", display: "flex", justifyContent: "space-between" }}>
                  <span>Basado en tendencia actual</span>
                  <span style={{ color: "#10B981" }}>+12% vs ayer</span>
                </div>
              </div>

              <CentroAyuda />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
      }

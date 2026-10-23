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
  Layers,
  LayoutDashboard,
  Package,
  HelpCircle,
  Menu,
  X,
  Store
} from "lucide-react";

export default function VendedorIAPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'mcp'>('chat');
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu Copilot de Nevux. Estoy conectado a tu Tiendanube en tiempo real. ¿Querés saber cómo vienen las ventas de hoy, revisar el stock o recuperar carritos?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Carritos Abandonados", href: "/dashboard/carritos", icon: ShoppingCart },
    { label: "Productos & Stock", href: "/dashboard/productos", icon: Package },
    { label: "Copilot IA", href: "/dashboard/vendedor-ia", icon: Bot, active: true },
    { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      
      <style jsx global>{`
        @media (max-width: 768px) {
          .nevux-desktop-sidebar { display: none !important; }
          .nevux-main-grid { grid-template-columns: 1fr !important; }
          .nevux-tab-bar { flex-wrap: wrap !important; width: 100% !important; }
          .nevux-header-box { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className="nevux-desktop-sidebar" style={{ width: "260px", backgroundColor: "#ffffff", borderRight: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "18px" }}>
            N
          </div>
          <div>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Nevux</span>
            <span style={{ fontSize: "10px", backgroundColor: "#ecfdf5", color: "#10B981", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", marginLeft: "6px" }}>SaaS</span>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ padding: "0 12px 8px 12px", fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase" }}>
            Menú Principal
          </div>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link key={idx} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#10B981" : "#4b5563",
                  backgroundColor: isActive ? "#ecfdf5" : "transparent"
                }}>
                  <Icon size={18} color={isActive ? "#10B981" : "#6b7280"} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1.5px solid #f3f4f6", backgroundColor: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={18} color="#4b5563" />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>Tiendanube Conectada</div>
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "500" }}>● En línea</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex" }}>
          <div style={{ width: "280px", backgroundColor: "#fff", height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#10B981" }}>Nevux</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none" }}><X size={24} /></button>
            </div>
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: "none", padding: "12px 0", color: item.active ? "#10B981" : "#374151", fontWeight: item.active ? "700" : "500", display: "flex", gap: "10px" }}>
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Header */}
        <header style={{ height: "64px", backgroundColor: "#ffffff", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setMobileMenuOpen(true)} style={{ border: "none", background: "none", cursor: "pointer" }}>
              <Menu size={22} color="#374151" />
            </button>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#111827" }}>Nevux SaaS</div>
          </div>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "13px" }}>
            NV
          </div>
        </header>

        <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          
          <div className="nevux-header-box" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>Nevux Copilot IA</h1>
              <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Tu asistente comercial inteligente conectado a Tiendanube.</p>
            </div>

            <div className="nevux-tab-bar" style={{ display: "flex", gap: "6px", backgroundColor: "#fff", padding: "4px", borderRadius: "8px", border: "1.5px solid #e5e7eb" }}>
              <button onClick={() => setActiveTab('chat')} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", backgroundColor: activeTab === 'chat' ? "#10B981" : "transparent", color: activeTab === 'chat' ? "#fff" : "#6b7280", border: "none", cursor: "pointer" }}>Chat Live</button>
              <button onClick={() => setActiveTab('settings')} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", backgroundColor: activeTab === 'settings' ? "#10B981" : "transparent", color: activeTab === 'settings' ? "#fff" : "#6b7280", border: "none", cursor: "pointer" }}>WhatsApp & Reportes</button>
              <button onClick={() => setActiveTab('mcp')} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", backgroundColor: activeTab === 'mcp' ? "#10B981" : "transparent", color: activeTab === 'mcp' ? "#fff" : "#6b7280", border: "none", cursor: "pointer" }}>Conexión MCP</button>
            </div>
          </div>

          <div className="nevux-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
            
            {/* Columna Izquierda: Chat / Settings */}
            <div>
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", height: "550px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }}></div>
                      <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>Copilot Online</span>
                    </div>

                    <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {messages.map((msg, i) => (
                        <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: "85%" }}>
                          <div style={{ padding: "10px 14px", borderRadius: "12px", fontSize: "13px", lineHeight: "1.5", backgroundColor: msg.role === 'user' ? "#10B981" : "#f3f4f6", color: msg.role === 'user' ? "#fff" : "#1f2937", border: msg.role === 'user' ? "none" : "1.5px solid #e5e7eb", whiteSpace: "pre-line" }}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && <div style={{ color: "#9ca3af", fontSize: "12px", fontStyle: "italic" }}>El Copilot está analizando tu tienda...</div>}
                    </div>

                    <div style={{ padding: "12px", borderTop: "1.5px solid #e5e7eb", display: "flex", gap: "8px" }}>
                      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Preguntale al Copilot (ej: ¿Qué producto tiene menos stock?)" style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "13px" }} />
                      <button onClick={sendMessage} style={{ backgroundColor: "#10B981", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px" }}><Send size={15} /> Enviar</button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", padding: "20px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Settings size={18} color="#10B981" /> Configuración de Notificaciones</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>WhatsApp (ej: 54911...)</label>
                        <input type="text" value={settings.whatsapp_phone} onChange={(e) => setSettings({...settings, whatsapp_phone: e.target.value})} placeholder="5491122334455" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "13px", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px" }}>Reporte Diario Automático</div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>Resumen diario por WhatsApp a las 20:00hs.</div>
                        </div>
                        <input type="checkbox" checked={settings.daily_report_enabled} onChange={(e) => setSettings({...settings, daily_report_enabled: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#10B981" }} />
                      </div>
                      <button onClick={saveSettings} style={{ backgroundColor: "#10B981", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Guardar Configuración</button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'mcp' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ backgroundColor: "#ecfdf5", padding: "8px", borderRadius: "8px" }}><Layers size={20} color="#10B981" /></div>
                      <div>
                        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 }}>Model Context Protocol (MCP)</h2>
                        <span style={{ fontSize: "11px", color: "#10B981", fontWeight: "600" }}>ESTADO: ACTIVO & SEGURO</span>
                      </div>
                    </div>
                    <p style={{ color: "#4b5563", fontSize: "13px", lineHeight: "1.5" }}>Nevux utiliza el protocolo <strong>MCP</strong> para conectar modelos de inteligencia artificial directamente con el contexto de tu Tiendanube sin exponer credenciales ni datos sensibles.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Columna Derecha: Métricas en Vivo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ backgroundColor: "#ecfdf5", padding: "6px", borderRadius: "6px" }}><TrendingUp size={18} color="#10B981" /></div>
                  <span style={{ fontSize: "11px", color: "#10B981", fontWeight: "600", backgroundColor: "#d1fae5", padding: "2px 6px", borderRadius: "10px" }}>Live</span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Ventas de Hoy</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "2px 0" }}>ARS ${metrics?.totalSales?.toLocaleString() || "0"}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>Sincronizado con Tiendanube</div>
              </div>

              <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ backgroundColor: "#eff6ff", padding: "6px", borderRadius: "6px" }}><ShoppingCart size={18} color="#3b82f6" /></div>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Carritos Recuperables</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "2px 0" }}>{metrics?.abandonedCartsCount || 0}</div>
                <button onClick={() => { setActiveTab('chat'); setInput("¿Cuánta plata tengo en carritos abandonados?"); }} style={{ fontSize: "11px", color: "#3b82f6", background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: "600" }}>Recuperar ahora →</button>
              </div>

              <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ backgroundColor: "#fff1f2", padding: "6px", borderRadius: "6px" }}><AlertTriangle size={18} color="#f43f5e" /></div>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Stock Crítico</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f43f5e", margin: "2px 0" }}>{metrics?.criticalStockProducts?.length || 0} <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "400" }}>productos</span></div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>{metrics?.criticalStockProducts?.length > 0 ? "Requiere reposición rápida" : "Inventario saludable"}</div>
              </div>

              <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "12px", border: "1.5px solid #e5e7eb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <HelpCircle size={18} color="#10B981" />
                  <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0 }}>Soporte Copilot</h3>
                </div>
                <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: "1.4", marginBottom: "12px" }}>¿Necesitás asistencia técnica o comercial? Consultanos directo por WhatsApp.</p>
                <a href="https://wa.me/5491122334455?text=Hola%20Nevux,%20necesito%20ayuda" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%", padding: "8px", borderRadius: "6px", backgroundColor: "#ecfdf5", color: "#10B981", fontWeight: "600", fontSize: "12px", textDecoration: "none", border: "1px solid #a7f3d0", boxSizing: "border-box" }}>Hablar con Soporte Oficial</a>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
      }

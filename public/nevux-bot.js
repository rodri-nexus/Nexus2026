// public/nevux-bot.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";

  function detectStoreId() {
    if (window.NEVUX_STORE_ID) return window.NEVUX_STORE_ID;
    if (window.Store && (window.Store.id || window.Store.store_id))
      return window.Store.id || window.Store.store_id;
    if (window.LS && window.LS.store && window.LS.store.id) return window.LS.store.id;
    if (window.LS && window.LS.storeId) return window.LS.storeId;
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id)
      return window.__NUVEMSHOP_STORE__.id;
    
    const meta = document.querySelector('meta[name="store-id"]');
    if (meta) return meta.content;
    
    const html = document.documentElement.innerHTML;
    let m = html.match(/"store_id":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    m = html.match(/"storeId":\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    return null;
  }

  const storeId = detectStoreId();
  if (!storeId) return;

  // Consultar configuración del Bot para esta tienda
  fetch(`${API_BASE}/api/nevuxbot/config?storeId=${storeId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.config && data.config.is_active) {
        initNevuxBot(data.config, storeId);
      }
    })
    .catch((err) => console.error("[NevuxBot] Error cargando config:", err));

  function initNevuxBot(config, storeId) {
    const botName = config.bot_name || "Sofía";
    const primaryColor = config.primary_color || "#10B981";

    // 1. Inyectar Estilos CSS Premium (Glassmorphism + Dark Mode + Mobile Responsive)
    const style = document.createElement("style");
    style.innerHTML = `
      #nevux-bot-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        background-color: #000000;
        border: 2px solid ${primaryColor};
        border-radius: 50%;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
      }
      #nevux-bot-bubble:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 24px rgba(16, 185, 129, 0.5);
      }
      #nevux-bot-bubble .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid ${primaryColor};
        border-radius: 50%;
        animation: nevux-pulse 2s infinite;
        opacity: 0;
      }
      @keyframes nevux-pulse {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(1.4); opacity: 0; }
      }
      #nevux-bot-window {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 370px;
        height: 520px;
        max-height: calc(100vh - 140px);
        max-width: calc(100vw - 48px);
        background: rgba(10, 10, 10, 0.96);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 16px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        z-index: 999999;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #nevux-bot-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .nb-header {
        padding: 16px;
        background: linear-gradient(135deg, #000000, #051b14);
        border-bottom: 1px solid rgba(16, 185, 129, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nb-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .nb-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, ${primaryColor}, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
      }
      .nb-status-container {
        display: flex;
        flex-direction: column;
      }
      .nb-name {
        color: #ffffff;
        font-weight: 600;
        font-size: 15px;
        line-height: 1.2;
      }
      .nb-status {
        color: rgba(255, 255, 255, 0.6);
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
      }
      .nb-status::before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: ${primaryColor};
        border-radius: 50%;
        box-shadow: 0 0 6px ${primaryColor};
      }
      .nb-close-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, background 0.2s;
      }
      .nb-close-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      .nb-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .nb-messages::-webkit-scrollbar {
        width: 6px;
      }
      .nb-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      .nb-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      .nb-messages::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.4);
      }
      .nb-msg {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 14px;
        font-size: 13.5px;
        line-height: 1.4;
        word-break: break-word;
      }
      .nb-msg.user {
        align-self: flex-end;
        background: #000000;
        color: #ffffff;
        border: 1px solid ${primaryColor};
        border-bottom-right-radius: 2px;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
      }
      .nb-msg.bot {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-bottom-left-radius: 2px;
      }
      .nb-typing {
        display: none;
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.08);
        padding: 12px 16px;
        border-radius: 14px;
        border-bottom-left-radius: 2px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        align-items: center;
        gap: 4px;
      }
      .nb-dot {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: nb-bounce 1.4s infinite ease-in-out both;
      }
      .nb-dot:nth-child(1) { animation-delay: -0.32s; }
      .nb-dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes nb-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
      .nb-input-container {
        padding: 12px 16px;
        background: #000000;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .nb-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 10px 16px;
        color: #ffffff;
        font-size: 13.5px;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
      }
      .nb-input:focus {
        border-color: ${primaryColor};
        background: rgba(255, 255, 255, 0.1);
      }
      .nb-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
      .nb-send-btn {
        width: 36px;
        height: 36px;
        background: ${primaryColor};
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        flex-shrink: 0;
      }
      .nb-send-btn:hover {
        background: #059669;
      }
      .nb-send-btn:active {
        transform: scale(0.92);
      }
      @media (max-width: 480px) {
        #nevux-bot-window {
          bottom: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
          border-radius: 0 !important;
          border: none !important;
        }
        .nb-header {
          padding-top: env(safe-area-inset-top, 20px) !important;
        }
      }
    `;
    document.head.appendChild(style);

    // 2. Crear elementos HTML en el DOM de la tienda
    const bubble = document.createElement("div");
    bubble.id = "nevux-bot-bubble";
    bubble.innerHTML = `
      <div class="pulse-ring"></div>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    const chatWindow = document.createElement("div");
    chatWindow.id = "nevux-bot-window";
    chatWindow.innerHTML = `
      <div class="nb-header">
        <div class="nb-header-info">
          <div class="nb-avatar">${botName.substring(0, 2).toUpperCase()}</div>
          <div class="nb-status-container">
            <span class="nb-name">${botName}</span>
            <span class="nb-status">En línea</span>
          </div>
        </div>
        <button class="nb-close-btn" id="nevux-bot-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="nb-messages" id="nevux-bot-messages"></div>
      <div class="nb-typing" id="nevux-bot-typing">
        <div class="nb-dot"></div>
        <div class="nb-dot"></div>
        <div class="nb-dot"></div>
      </div>
      <div class="nb-input-container">
        <input type="text" class="nb-input" id="nevux-bot-input" placeholder="Escribí tu mensaje..." autocomplete="off">
        <button class="nb-send-btn" id="nevux-bot-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(chatWindow);

    // 3. Variables de Control y de Historial
    const messagesContainer = document.getElementById("nevux-bot-messages");
    const inputField = document.getElementById("nevux-bot-input");
    const sendButton = document.getElementById("nevux-bot-send");
    const closeButton = document.getElementById("nevux-bot-close");
    const typingIndicator = document.getElementById("nevux-bot-typing");

    const storageKey = `nevux_bot_history_${storeId}`;
    let history = [];

    // Cargar historial de localStorage
    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        history = JSON.parse(savedHistory);
      }
    } catch (e) {
      console.error("[NevuxBot] Error leyendo localStorage:", e);
    }

    // Renderizar historial o Mensaje de Bienvenida si está vacío
    if (history.length === 0) {
      appendMessage("bot", `¡Hola! Soy ${botName}, tu asesora personal. ¿En qué te puedo ayudar hoy? 😊`, false);
    } else {
      history.forEach((msg) => {
        appendMessage(msg.sender, msg.text, false);
      });
    }

    // 4. Listeners para abrir / cerrar ventana
    bubble.addEventListener("click", () => {
      chatWindow.classList.add("open");
      bubble.style.display = "none";
      scrollToBottom();
      setTimeout(() => inputField.focus(), 200);
    });

    closeButton.addEventListener("click", () => {
      chatWindow.classList.remove("open");
      bubble.style.display = "flex";
    });

    // 5. Envío de Mensajes
    function handleSend() {
      const text = inputField.value.trim();
      if (!text) return;

      appendMessage("user", text, true);
      inputField.value = "";
      scrollToBottom();

      // Mostrar indicador "escribiendo..."
      typingIndicator.style.display = "flex";
      scrollToBottom();

      fetch(`${API_BASE}/api/nevuxbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: storeId,
          message: text,
          conversationHistory: history,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error en respuesta");
          return res.json();
        })
        .then((data) => {
          typingIndicator.style.display = "none";
          if (data && data.reply) {
            appendMessage("bot", data.reply, true);
          } else {
            appendMessage("bot", "No pude procesar tu mensaje en este momento. ¿Me lo repetís?", true);
          }
          scrollToBottom();
        })
        .catch((err) => {
          console.error("[NevuxBot] Error enviando chat:", err);
          typingIndicator.style.display = "none";
          appendMessage("bot", "Disculpas, tengo un problema de conexión temporal. ¿Intentamos de nuevo?", false);
          scrollToBottom();
        });
    }

    sendButton.addEventListener("click", handleSend);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });

    function appendMessage(sender, text, save = true) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `nb-msg ${sender}`;
      msgDiv.innerText = text;
      messagesContainer.appendChild(msgDiv);

      if (save) {
        history.push({ sender, text });
        try {
          localStorage.setItem(storageKey, JSON.stringify(history));
        } catch (e) {
          console.error("[NevuxBot] Error guardando localStorage:", e);
        }
      }
    }

    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
})();

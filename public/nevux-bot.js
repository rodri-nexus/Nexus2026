// public/nevux-bot.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const isDebug = window.location.search.includes("nevux");

  function showDebugBanner(text, isError) {
    if (!isDebug) return;
    let banner = document.getElementById("nevux-debug-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "nevux-debug-banner";
      banner.style.cssText =
        "position:fixed;top:0;left:0;right:0;background:#000000;color:#10B981;font-size:12px;font-family:sans-serif;padding:10px 12px;z-index:2147483647;border-bottom:1px solid #10B981;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.9);";
      document.body ? document.body.appendChild(banner) : document.documentElement.appendChild(banner);
    }
    banner.style.color = isError ? "#f87171" : "#10B981";
    banner.innerText = "🔍 [NevuxBot]: " + text;
  }

  function detectStoreId() {
    // 1. Leer directamente desde el script src tag (?storeId=7401217)
    var currentScript = document.currentScript || (function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.indexOf('nevux-bot.js') !== -1) {
          return scripts[i];
        }
      }
      return null;
    })();

    if (currentScript && currentScript.src) {
      var match = currentScript.src.match(/[?&]storeId=([^&]+)/);
      if (match && match[1]) return String(match[1]).trim();
    }

    // 2. Leer desde la variable global inyectada por nevux-widget.js
    if (window.NEVUX_STORE_ID) return String(window.NEVUX_STORE_ID).trim();
    if (window.LS && window.LS.store && window.LS.store.id) return String(window.LS.store.id).trim();
    if (window.LS && window.LS.storeId) return String(window.LS.storeId).trim();
    if (window.Store && (window.Store.id || window.Store.store_id)) return String(window.Store.id || window.Store.store_id).trim();
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id) return String(window.__NUVEMSHOP_STORE__.id).trim();

    var meta = document.querySelector('meta[name="store-id"]') || document.querySelector('meta[property="store:id"]');
    if (meta && meta.content) return String(meta.content).trim();

    var html = document.documentElement ? document.documentElement.innerHTML : "";
    var m = html.match(/"store_id":\s*(\d+)/) || html.match(/"storeId":\s*(\d+)/) || html.match(/store_id\s*=\s*(\d+)/);
    if (m && m[1]) return String(m[1]).trim();

    return null;
  }

  function hasWhatsAppButton() {
    return Boolean(
      document.querySelector(
        'a[href*="wa.me"], a[href*="whatsapp.com"], .whatsapp-button, #whatsapp-icon, .btn-whatsapp, [class*="whatsapp"]'
      )
    );
  }

  let attempts = 0;
  function startBot() {
    const storeId = detectStoreId();
    const hasBody = Boolean(document.body);

    if (!storeId || !hasBody) {
      attempts++;
      if (attempts < 30) {
        setTimeout(startBot, 200);
      } else {
        showDebugBanner("No se pudo obtener el storeId", true);
      }
      return;
    }

    showDebugBanner(`Tienda ID ${storeId} conectada. Consultando servidor...`, false);

    fetch(`${API_BASE}/api/nevuxbot/config?storeId=${storeId}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.config) {
          if (data.config.is_active) {
            showDebugBanner(`Bot ACTIVO para tienda ID ${storeId} (${data.config.bot_name})`, false);
            initNevuxBot(data.config, storeId);
          } else {
            showDebugBanner(`Bot INACTIVO en panel para tienda ID ${storeId}. Entrá a /dashboard/nevuxbot y activalo.`, true);
          }
        } else {
          showDebugBanner(`Sin respuesta para tienda ID ${storeId}`, true);
        }
      })
      .catch((err) => {
        console.error("[NevuxBot] Error cargando config:", err);
        showDebugBanner("Error conectando con la API de Nevux", true);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startBot);
  } else {
    startBot();
  }

  function initNevuxBot(config, storeId) {
    if (document.getElementById("nevux-bot-bubble")) return;

    const botName = config.bot_name || "Sofía";
    const primaryColor = config.primary_color || "#10B981";
    const withWhatsApp = hasWhatsAppButton();
    const bottomPos = withWhatsApp ? "96px" : "24px";
    const windowBottomPos = withWhatsApp ? "168px" : "96px";

    // 1. Estilos Glassmorphic Dark
    const style = document.createElement("style");
    style.innerHTML = `
      #nevux-bot-bubble {
        position: fixed !important;
        bottom: ${bottomPos} !important;
        right: 24px !important;
        width: 58px !important;
        height: 58px !important;
        background-color: #000000 !important;
        border: 2px solid ${primaryColor} !important;
        border-radius: 50% !important;
        box-shadow: 0 6px 22px rgba(16, 185, 129, 0.4) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2147483647 !important;
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease !important;
      }
      #nevux-bot-bubble:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 8px 28px rgba(16, 185, 129, 0.55) !important;
      }
      #nevux-bot-bubble .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid ${primaryColor};
        border-radius: 50%;
        animation: nevux-pulse 2.2s infinite;
        opacity: 0;
        pointer-events: none;
      }
      @keyframes nevux-pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.45); opacity: 0; }
      }
      #nevux-bot-window {
        position: fixed !important;
        bottom: ${windowBottomPos} !important;
        right: 24px !important;
        width: 370px !important;
        height: 520px !important;
        max-height: calc(100vh - 120px) !important;
        max-width: calc(100vw - 32px) !important;
        background: rgba(10, 10, 10, 0.96) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
        border-radius: 18px !important;
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75) !important;
        display: flex !important;
        flex-direction: column !important;
        z-index: 2147483647 !important;
        overflow: hidden !important;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }
      #nevux-bot-window.open {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
        pointer-events: auto !important;
      }
      .nb-header {
        padding: 16px 18px !important;
        background: linear-gradient(135deg, #000000, #051b14) !important;
        border-bottom: 1px solid rgba(16, 185, 129, 0.2) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }
      .nb-header-info {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      .nb-avatar {
        width: 40px !important;
        height: 40px !important;
        background: linear-gradient(135deg, ${primaryColor}, #059669) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-weight: bold !important;
        font-size: 15px !important;
        box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3) !important;
      }
      .nb-status-container {
        display: flex !important;
        flex-direction: column !important;
      }
      .nb-name {
        color: #ffffff !important;
        font-weight: 600 !important;
        font-size: 15px !important;
        line-height: 1.2 !important;
      }
      .nb-status {
        color: rgba(255, 255, 255, 0.6) !important;
        font-size: 11px !important;
        display: flex !important;
        align-items: center !important;
        gap: 5px !important;
        margin-top: 2px !important;
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
        background: none !important;
        border: none !important;
        color: rgba(255, 255, 255, 0.6) !important;
        cursor: pointer !important;
        padding: 6px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .nb-close-btn:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }
      .nb-messages {
        flex: 1 !important;
        padding: 16px !important;
        overflow-y: auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      .nb-msg {
        max-width: 82% !important;
        padding: 11px 15px !important;
        border-radius: 15px !important;
        font-size: 13.5px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
      }
      .nb-msg.user {
        align-self: flex-end !important;
        background: #000000 !important;
        color: #ffffff !important;
        border: 1px solid ${primaryColor} !important;
        border-bottom-right-radius: 3px !important;
      }
      .nb-msg.bot {
        align-self: flex-start !important;
        background: rgba(255, 255, 255, 0.08) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-bottom-left-radius: 3px !important;
      }
      .nb-typing {
        display: none;
        align-self: flex-start !important;
        background: rgba(255, 255, 255, 0.08) !important;
        padding: 12px 16px !important;
        border-radius: 15px !important;
        border-bottom-left-radius: 3px !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        align-items: center !important;
        gap: 5px !important;
      }
      .nb-dot {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.7);
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
        padding: 12px 16px !important;
        background: #000000 !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .nb-input {
        flex: 1 !important;
        background: rgba(255, 255, 255, 0.07) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 20px !important;
        padding: 10px 16px !important;
        color: #ffffff !important;
        font-size: 13.5px !important;
        outline: none !important;
      }
      .nb-input:focus {
        border-color: ${primaryColor} !important;
      }
      .nb-input::placeholder {
        color: rgba(255, 255, 255, 0.4) !important;
      }
      .nb-send-btn {
        width: 38px !important;
        height: 38px !important;
        background: ${primaryColor} !important;
        border: none !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #ffffff !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
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
          padding-top: max(16px, env(safe-area-inset-top)) !important;
        }
      }
    `;
    document.head.appendChild(style);

    // 2. Crear elementos en el DOM
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
        <button class="nb-close-btn" id="nevux-bot-close" type="button">
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
        <button class="nb-send-btn" id="nevux-bot-send" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(chatWindow);

    // 3. Control de Mensajes
    const messagesContainer = document.getElementById("nevux-bot-messages");
    const inputField = document.getElementById("nevux-bot-input");
    const sendButton = document.getElementById("nevux-bot-send");
    const closeButton = document.getElementById("nevux-bot-close");
    const typingIndicator = document.getElementById("nevux-bot-typing");

    const storageKey = `nevux_bot_history_${storeId}`;
    let history = [];

    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        history = JSON.parse(savedHistory);
      }
    } catch (e) {
      console.error("[NevuxBot] Error leyendo localStorage:", e);
    }

    if (history.length === 0) {
      appendMessage(
        "bot",
        `¡Hola! Soy ${botName}, tu asesora personal. ¿En qué te puedo ayudar hoy? 😊`,
        false
      );
    } else {
      history.forEach((msg) => {
        appendMessage(msg.sender, msg.text, false);
      });
    }

    // 4. Listeners
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

    // 5. Envío
    function handleSend() {
      const text = inputField.value.trim();
      if (!text) return;

      appendMessage("user", text, true);
      inputField.value = "";
      scrollToBottom();

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
            appendMessage(
              "bot",
              "No pude procesar tu mensaje en este momento. ¿Me lo repetís?",
              true
            );
          }
          scrollToBottom();
        })
        .catch((err) => {
          console.error("[NevuxBot] Error enviando chat:", err);
          typingIndicator.style.display = "none";
          appendMessage(
            "bot",
            "Disculpas, tengo un problema de conexión temporal. ¿Intentamos de nuevo?",
            false
          );
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

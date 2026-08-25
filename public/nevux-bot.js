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
        "position:fixed;top:0;left:0;right:0;background:#000;color:#10B981;font-size:11px;font-family:sans-serif;padding:12px;z-index:2147483647;border-bottom:2px solid #10B981;text-align:center;";
      document.body ? document.body.appendChild(banner) : document.documentElement.appendChild(banner);
    }
    banner.style.color = isError ? "#ff4d4d" : "#10B981";
    banner.innerText = "🔍 [NevuxBot]: " + text;
  }

  function detectStoreId() {
    // 1. Prioridad: Lo que nevux-widget.js nos pasó en la variable global
    if (window.NEVUX_STORE_ID) return String(window.NEVUX_STORE_ID);

    // 2. Leer desde el script src tag (?storeId=7401217)
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('nevux-bot.js')) {
        var match = scripts[i].src.match(/[?&]storeId=([^&]+)/);
        if (match && match[1]) return String(match[1]);
      }
    }

    // 3. Detección por carpetas CDN (Tiendanube /stores/007/401/217/)
    var html = document.documentElement ? document.documentElement.innerHTML : "";
    var cdnMatch = html.match(/\/stores\/(\d{3})\/(\d{3})\/(\d{3})\//);
    if (cdnMatch) return String(parseInt(cdnMatch[1] + cdnMatch[2] + cdnMatch[3], 10));

    // 4. Otros métodos estándar
    if (window.LS && window.LS.store && window.LS.store.id) return String(window.LS.store.id);
    var meta = document.querySelector('meta[name="store-id"]');
    if (meta && meta.content) return String(meta.content);

    return null;
  }

  function hasWhatsAppButton() {
    return Boolean(document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"], .whatsapp-button, [class*="whatsapp"]'));
  }

  function startBot() {
    const storeId = detectStoreId();
    if (!storeId || !document.body) {
      setTimeout(startBot, 250);
      return;
    }

    showDebugBanner(`Tienda ID ${storeId} - Consultando...`, false);

    fetch(`${API_BASE}/api/nevuxbot/config?storeId=${storeId}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.config && data.config.is_active) {
          showDebugBanner(`Bot ACTIVO para ${storeId}`, false);
          initNevuxBot(data.config, storeId);
        } else {
          showDebugBanner(`Bot INACTIVO para tienda ${storeId}. Revisar switch en Dashboard.`, true);
        }
      })
      .catch((err) => {
        showDebugBanner("Error de conexión con Nevux API", true);
      });
  }

  startBot();

  function initNevuxBot(config, storeId) {
    if (document.getElementById("nevux-bot-bubble")) return;

    const botName = config.bot_name || "Sofía";
    const primaryColor = config.primary_color || "#10B981";
    const withWA = hasWhatsAppButton();
    const bottom = withWA ? "96px" : "24px";
    const winBottom = withWA ? "168px" : "96px";

    const style = document.createElement("style");
    style.innerHTML = `
      #nevux-bot-bubble {
        position: fixed !important; bottom: ${bottom} !important; right: 24px !important;
        width: 60px !important; height: 60px !important; background: #000 !important;
        border: 2px solid ${primaryColor} !important; border-radius: 50% !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; cursor: pointer !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        z-index: 2147483647 !important; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #nevux-bot-bubble:active { transform: scale(0.9); }
      #nevux-bot-bubble .pulse {
        position: absolute; width: 100%; height: 100%; border: 2px solid ${primaryColor};
        border-radius: 50%; animation: nb-pulse 2s infinite; pointer-events: none;
      }
      @keyframes nb-pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
      #nevux-bot-window {
        position: fixed !important; bottom: ${winBottom} !important; right: 24px !important;
        width: 370px !important; height: 520px !important; max-height: calc(100vh - 120px) !important;
        max-width: calc(100vw - 32px) !important; background: rgba(10,10,10,0.96) !important;
        backdrop-filter: blur(16px); border: 1px solid rgba(16,185,129,0.3);
        border-radius: 18px; box-shadow: 0 16px 40px rgba(0,0,0,0.6);
        display: none; flex-direction: column; z-index: 2147483647; overflow: hidden;
        font-family: sans-serif !important;
      }
      #nevux-bot-window.open { display: flex !important; }
      .nb-header { padding: 16px; background: #000; border-bottom: 1px solid rgba(16,185,129,0.2); display: flex; align-items: center; justify-content: space-between; }
      .nb-avatar { width: 36px; height: 36px; background: ${primaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; }
      .nb-info { margin-left: 12px; flex: 1; }
      .nb-name { color: #fff; font-size: 14px; font-weight: 600; display: block; }
      .nb-online { color: ${primaryColor}; font-size: 11px; }
      .nb-close { background: none; border: none; color: #fff; opacity: 0.5; cursor: pointer; padding: 4px; }
      .nb-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
      .nb-msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.4; color: #fff; }
      .nb-msg.user { align-self: flex-end; background: #000; border: 1px solid ${primaryColor}; border-bottom-right-radius: 2px; }
      .nb-msg.bot { align-self: flex-start; background: rgba(255,255,255,0.1); border-bottom-left-radius: 2px; }
      .nb-typing { display: none; align-self: flex-start; background: rgba(255,255,255,0.1); padding: 10px 14px; border-radius: 14px; gap: 4px; }
      .nb-dot { width: 6px; height: 6px; background: #fff; border-radius: 50%; animation: nb-bounce 1.4s infinite ease-in-out; }
      @keyframes nb-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      .nb-input-wrap { padding: 12px; background: #000; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px; }
      .nb-input { flex: 1; background: #222; border: 1px solid #333; border-radius: 20px; padding: 8px 16px; color: #fff; outline: none; }
      .nb-send { background: ${primaryColor}; border: none; width: 36px; height: 36px; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      @media (max-width: 480px) { #nevux-bot-window { bottom: 0 !important; right: 0 !important; width: 100% !important; height: 100% !important; border-radius: 0 !important; } }
    `;
    document.head.appendChild(style);

    const bubble = document.createElement("div");
    bubble.id = "nevux-bot-bubble";
    bubble.innerHTML = `<div class="pulse"></div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

    const win = document.createElement("div");
    win.id = "nevux-bot-window";
    win.innerHTML = `
      <div class="nb-header">
        <div class="nb-avatar">${botName[0].toUpperCase()}</div>
        <div class="nb-info"><span class="nb-name">${botName}</span><span class="nb-online">En línea</span></div>
        <button class="nb-close">✕</button>
      </div>
      <div class="nb-messages"></div>
      <div class="nb-typing"><div class="nb-dot"></div><div class="nb-dot"></div><div class="nb-dot"></div></div>
      <div class="nb-input-wrap">
        <input type="text" class="nb-input" placeholder="Escribe aquí...">
        <button class="nb-send">➤</button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    const msgs = win.querySelector(".nb-messages");
    const input = win.querySelector(".nb-input");
    const send = win.querySelector(".nb-send");
    const typing = win.querySelector(".nb-typing");
    const storageKey = "nevux_history_" + storeId;
    let history = JSON.parse(localStorage.getItem(storageKey) || "[]");

    function append(sender, text, save = true) {
      const d = document.createElement("div");
      d.className = "nb-msg " + sender;
      d.innerText = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      if(save) { history.push({sender, text}); localStorage.setItem(storageKey, JSON.stringify(history)); }
    }

    if(history.length === 0) append("bot", `¡Hola! Soy ${botName}, ¿en qué puedo ayudarte?`, false);
    else history.forEach(m => append(m.sender, m.text, false));

    bubble.onclick = () => { win.classList.add("open"); bubble.style.display = "none"; input.focus(); };
    win.querySelector(".nb-close").onclick = () => { win.classList.remove("open"); bubble.style.display = "flex"; };

    function sendMessage() {
      const val = input.value.trim();
      if(!val) return;
      append("user", val);
      input.value = "";
      typing.style.display = "flex";
      msgs.scrollTop = msgs.scrollHeight;

      fetch(`${API_BASE}/api/nevuxbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, message: val, conversationHistory: history })
      })
      .then(r => r.json())
      .then(d => {
        typing.style.display = "none";
        append("bot", d.reply || "Lo siento, no pude entenderte.");
      })
      .catch(() => { typing.style.display = "none"; append("bot", "Error de conexión."); });
    }

    send.onclick = sendMessage;
    input.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
  }
})();

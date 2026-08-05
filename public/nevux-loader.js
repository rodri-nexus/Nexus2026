// public/nevux-loader.js
// Loader de Nevux: carga dinámicamente el script principal desde Vercel.
// Este archivo se sube a Tiendanube Partners como versión del script.
// Cambios en nevux-widget.js se reflejan en vivo SIN subir versiones nuevas.
(function () {
  "use strict";
  var s = document.createElement("script");
  s.src = "https://nexus2026-gx7e.vercel.app/nevux-widget.js?v=" + Date.now();
  s.async = true;
  document.head.appendChild(s);
})();

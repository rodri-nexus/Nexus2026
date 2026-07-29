"use client";

export default function NevuxLogo({
  size = "medium",
  showText = true,
}: {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}) {
  const sizes = {
    small: { icon: 24, text: "1.1rem", gap: "0.4rem" },
    medium: { icon: 32, text: "1.5rem", gap: "0.5rem" },
    large: { icon: 48, text: "2rem", gap: "0.65rem" },
  };

  const currentSize = sizes[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: currentSize.gap,
        userSelect: "none",
      }}
    >
      {/* Ícono SVG - Gemas apiladas 3D */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient principal violeta */}
          <linearGradient id="nevuxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Gradient medio */}
          <linearGradient id="nevuxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          {/* Gradient inferior más oscuro */}
          <linearGradient id="nevuxGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* Sombra suave */}
          <filter id="nevuxShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Gema inferior (más grande) */}
        <g filter="url(#nevuxShadow)">
          <path
            d="M20 30 L6 23 L20 16 L34 23 Z"
            fill="url(#nevuxGrad3)"
          />
          {/* Highlight superior gema inferior */}
          <path
            d="M20 16 L6 23 L20 25 L34 23 Z"
            fill="url(#nevuxGrad2)"
            opacity="0.7"
          />
        </g>

        {/* Gema media */}
        <g filter="url(#nevuxShadow)">
          <path
            d="M20 22 L8 16 L20 10 L32 16 Z"
            fill="url(#nevuxGrad2)"
          />
          <path
            d="M20 10 L8 16 L20 17 L32 16 Z"
            fill="url(#nevuxGrad1)"
            opacity="0.8"
          />
        </g>

        {/* Gema superior (más chica) */}
        <g filter="url(#nevuxShadow)">
          <path
            d="M20 14 L10 9 L20 4 L30 9 Z"
            fill="url(#nevuxGrad1)"
          />
          {/* Brillo blanco en la punta */}
          <path
            d="M20 4 L14 7 L20 8 L26 7 Z"
            fill="white"
            opacity="0.4"
          />
        </g>

        {/* Brillo/sparkle esquina superior derecha */}
        <circle cx="33" cy="6" r="1.2" fill="white" opacity="0.9" />
        <circle cx="33" cy="6" r="2.5" fill="white" opacity="0.3" />
      </svg>

      {/* Texto Nevux */}
      {showText && (
        <span
          style={{
            fontSize: currentSize.text,
            fontWeight: 800,
            background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          Nevux
        </span>
      )}
    </div>
  );
}

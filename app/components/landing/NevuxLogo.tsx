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
      {/* Ícono SVG - N Monograma Futurista */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Degradé para la diagonal de la N que se desvanece hacia la derecha */}
          <linearGradient
            id="nevuxDiagonalGrad"
            x1="13.5"
            y1="11.5"
            x2="28.5"
            y2="30.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Círculo base negro */}
        <circle cx="20" cy="20" r="20" fill="#000000" />

        {/* Trazo vertical izquierdo */}
        <rect x="13.5" y="11.5" width="3.5" height="17" fill="#FFFFFF" />

        {/* Trazo vertical derecho superior */}
        <rect x="23" y="11.5" width="3.5" height="9" fill="#FFFFFF" />

        {/* Trazo diagonal cortante que se desvanece al salir */}
        <polygon
          points="13.5,11.5 17,11.5 28.5,30.5 25,30.5"
          fill="url(#nevuxDiagonalGrad)"
        />
      </svg>

      {/* Texto Nevux */}
      {showText && (
        <span
          style={{
            fontSize: currentSize.text,
            fontWeight: 800,
            color: "#000000",
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

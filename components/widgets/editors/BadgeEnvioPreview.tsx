'use client';

import React from 'react';

interface BadgeEnvioPreviewProps {
  config: {
    showIcon?: boolean;
    badgeText?: string;
    badgeBounce?: boolean;
    badgePosition?: 'top-right' | 'inline-end';
    bgColor?: string;
    textColor?: string;
    gradient?: boolean;
    gradientColor?: string;
    fontSize?: number;
    showBorder?: boolean;
    padding?: number;
    borderRadius?: number;
    effect?: 'halo' | 'zoom' | 'none';
    badgeBgColor?: string;
    badgeTextColor?: string;
  };
}

export default function BadgeEnvioPreview({ config }: BadgeEnvioPreviewProps) {
  const {
    showIcon = true,
    badgeText = '',
    badgeBounce = false,
    badgePosition = 'top-right',
    bgColor = '#ededed',
    textColor = '#000000',
    gradient = false,
    gradientColor = '#d4d4d4',
    fontSize = 13,
    showBorder = false,
    padding = 10,
    borderRadius = 25,
    effect = 'none',
    badgeBgColor = '#ff0000',
    badgeTextColor = '#ffffff',
  } = config;

  const background = gradient
    ? `linear-gradient(90deg, ${bgColor}, ${gradientColor})`
    : bgColor;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background,
    color: textColor,
    fontSize: `${fontSize}px`,
    padding: `${padding}px ${padding + 6}px`,
    borderRadius: `${borderRadius}px`,
    border: showBorder ? '1px solid rgba(0,0,0,0.15)' : 'none',
    fontWeight: 500,
    position: 'relative',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    animation:
      effect === 'zoom'
        ? 'nevuxEnvioZoom 2s ease-in-out infinite'
        : undefined,
  };

  const haloStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: `${borderRadius}px`,
    boxShadow: `0 0 0 0 ${bgColor}`,
    animation: 'nevuxEnvioHalo 2s ease-out infinite',
    pointerEvents: 'none',
  };

  const badgeBase: React.CSSProperties = {
    background: badgeBgColor,
    color: badgeTextColor,
    fontSize: '10px',
    fontWeight: 700,
    padding: '3px 7px',
    borderRadius: '999px',
    lineHeight: 1,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    animation: badgeBounce
      ? 'nevuxEnvioBounce 1.2s ease-in-out infinite'
      : undefined,
  };

  const badgeFloating: React.CSSProperties = {
    ...badgeBase,
    position: 'absolute',
    top: '-8px',
    right: '-8px',
  };

  const badgeInline: React.CSSProperties = {
    ...badgeBase,
    marginLeft: '4px',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '24px 16px',
        minHeight: '80px',
      }}
    >
      <style>{`
        @keyframes nevuxEnvioHalo {
          0% { box-shadow: 0 0 0 0 ${bgColor}80; }
          70% { box-shadow: 0 0 0 12px ${bgColor}00; }
          100% { box-shadow: 0 0 0 0 ${bgColor}00; }
        }
        @keyframes nevuxEnvioZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes nevuxEnvioBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
      `}</style>

      <div style={containerStyle}>
        {effect === 'halo' && <span style={haloStyle} />}

        {showIcon && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M10 17h4V5H2v12h3" />
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
            <path d="M14 17h1" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
        )}

        <span style={{ position: 'relative', zIndex: 1 }}>Envío gratis</span>

        {badgeText && badgePosition === 'inline-end' && (
          <span style={badgeInline}>{badgeText}</span>
        )}

        {badgeText && badgePosition === 'top-right' && (
          <span style={badgeFloating}>{badgeText}</span>
        )}
      </div>
    </div>
  );
    }

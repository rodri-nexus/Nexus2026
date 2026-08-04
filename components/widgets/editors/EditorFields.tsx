// components/widgets/editors/EditorFields.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════
   TOGGLE
═══════════════════════════════════════════ */
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid #f1f3f5',
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 48,
          height: 26,
          borderRadius: 13,
          border: 'none',
          cursor: 'pointer',
          background: checked
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : '#d1d5db',
          position: 'relative',
          transition: 'background 0.25s ease',
          flexShrink: 0,
          outline: 'none',
          boxShadow: checked ? '0 0 12px rgba(102,126,234,0.4)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 24 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.25s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COLOR PICKER
═══════════════════════════════════════════ */
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleHexChange = (raw: string) => {
    const cleaned = raw.startsWith('#') ? raw : '#' + raw;
    onChange(cleaned);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Swatch clickeable */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: value,
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {/* Input nativo oculto */}
        <input
          ref={inputRef}
          type="color"
          value={value.startsWith('#') && value.length >= 7 ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
        {/* Input hex visible */}
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexChange(e.target.value)}
          maxLength={7}
          style={{
            flex: 1,
            padding: '9px 12px',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 13,
            fontFamily: 'monospace',
            color: '#374151',
            background: '#fafafa',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#667eea')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDER
═══════════════════════════════════════════ */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (val: number) => void;
}

export function Slider({ label, value, min, max, unit = 'px', onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#667eea',
            background: '#f0f0ff',
            padding: '2px 8px',
            borderRadius: 6,
            minWidth: 36,
            textAlign: 'center',
          }}
        >
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 3, background: '#e5e7eb' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            transition: 'width 0.1s',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            width: '100%',
            opacity: 0,
            cursor: 'pointer',
            height: 20,
            margin: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            border: '2.5px solid #667eea',
            boxShadow: '0 2px 8px rgba(102,126,234,0.35)',
            pointerEvents: 'none',
            transition: 'left 0.1s',
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RADIO GROUP
═══════════════════════════════════════════ */
interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
}

export function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 12,
              border: value === opt.value ? '2px solid #667eea' : '2px solid #e5e7eb',
              background: value === opt.value ? '#f5f3ff' : '#fafafa',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: value === opt.value ? '5px solid #667eea' : '2px solid #d1d5db',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{opt.label}</div>
              {opt.description && (
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{opt.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIELD INPUT
═══════════════════════════════════════════ */
interface FieldInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

export function FieldInput({ label, value, placeholder, onChange }: FieldInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          fontSize: 14,
          color: '#1a1a2e',
          background: '#fafafa',
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#667eea')}
        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIELD TEXTAREA
═══════════════════════════════════════════ */
interface FieldTextareaProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (val: string) => void;
}

export function FieldTextarea({ label, value, placeholder, rows = 3, onChange }: FieldTextareaProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1.5px solid #e5e7eb',
          borderRadius: 10,
          fontSize: 14,
          color: '#1a1a2e',
          background: '#fafafa',
          outline: 'none',
          transition: 'border-color 0.2s',
          resize: 'vertical',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#667eea')}
        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIELD SELECT
═══════════════════════════════════════════ */
interface SelectOption {
  value: string;
  label: string;
}

interface FieldSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
}

export function FieldSelect({ label, value, options, onChange }: FieldSelectProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 36px 10px 14px',
            border: '1.5px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            color: '#1a1a2e',
            background: '#fafafa',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#667eea')}
          onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#9ca3af',
            fontSize: 12,
          }}
        >
          ▼
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION TITLE
═══════════════════════════════════════════ */
interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
        marginTop: 4,
        paddingBottom: 8,
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      {children}
    </div>
  );
        }

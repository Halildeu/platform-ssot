import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  clampRgba,
  formatHsl,
  hexToRgba,
  hslToRgba,
  parseAnyColor,
  parseHslString,
  parseRgbaString,
  rgbaToHex,
  rgbaToHsl,
  rgbaToString,
  type RgbaColor,
} from '../color-utils';

type SurfaceToneOption = { id: string; label?: string; color: string };

type Props = {
  color: RgbaColor;
  surfaceTone: string | null;
  onColorChange: (color: RgbaColor) => void;
  surfaceToneOptions: SurfaceToneOption[];
  onSurfaceToneChange: (toneId: string, toneColor: string) => void;
  onCustomColorActivate?: () => void;
  localeText?: {
    hexLabel?: string;
    hexAriaLabel?: string;
    rgbaLabel?: string;
    rgbaAriaLabel?: string;
    hslLabel?: string;
    hslAriaLabel?: string;
    hueLabel?: string;
    hueAriaLabel?: string;
    opacityLabel?: string;
    opacityAriaLabel?: string;
    readySurfaceTonesLabel?: string;
  };
};

const toRgbaString = (rgba: RgbaColor) => rgbaToString(clampRgba(rgba));

const UniversalColorPanel: React.FC<Props> = ({
  color,
  surfaceTone,
  onColorChange,
  surfaceToneOptions,
  onSurfaceToneChange,
  onCustomColorActivate,
  localeText,
}) => {
  const [local, setLocal] = useState<RgbaColor>(color);
  useEffect(() => {
    setLocal(color);
  }, [color]);

  const hsl = useMemo(() => rgbaToHsl(local), [local]);

  const emitColor = useCallback(
    (next: RgbaColor) => {
      const clamped = clampRgba(next);
      setLocal(clamped);
      onCustomColorActivate?.();
      onColorChange(clamped);
    },
    [onColorChange, onCustomColorActivate],
  );

  const handleHexChange = (value: string) => {
    const parsed = hexToRgba(value);
    if (parsed) {
      emitColor({ ...parsed, a: local.a });
    }
  };

  const handleRgbaChange = (value: string) => {
    const parsed = parseRgbaString(value);
    if (parsed) {
      emitColor(parsed);
    }
  };

  const handleHslChange = (value: string) => {
    const parsed = parseHslString(value);
    if (parsed) {
      emitColor(parsed);
    }
  };

  const handlePadChange = (s: number, l: number) => {
    emitColor(hslToRgba(hsl.h, s * 100, l * 100, local.a));
  };

  const handleHueChange = (hue: number) => {
    const nextS = hsl.s < 1 ? 100 : hsl.s;
    const nextL = hsl.s < 1 && (hsl.l <= 5 || hsl.l >= 95) ? 50 : hsl.l;
    emitColor(hslToRgba(hue, nextS, nextL, local.a));
  };

  const handleAlphaChange = (alpha: number) => {
    emitColor({ ...local, a: alpha });
  };

  const handleToneClick = (tone: SurfaceToneOption) => {
    const parsed = parseAnyColor(tone.color);
    if (parsed) {
      onSurfaceToneChange(tone.id, toRgbaString(parsed));
      setLocal(parsed);
    }
  };

  const gradientHue = `hsl(${hsl.h}, 100%, 50%)`;
  const hueTrack =
    'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  const padStyle = {
    background: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to right, #ffffff 0%, ${gradientHue} 100%)`,
  };
  const padX = Math.min(1, Math.max(0, hsl.s / 100));
  const padY = 1 - Math.min(1, Math.max(0, hsl.l / 100));

  const resolvedLocaleText = {
    hexLabel: localeText?.hexLabel ?? 'HEX',
    hexAriaLabel: localeText?.hexAriaLabel ?? 'HEX color code',
    rgbaLabel: localeText?.rgbaLabel ?? 'RGBA',
    rgbaAriaLabel: localeText?.rgbaAriaLabel ?? 'RGBA color code',
    hslLabel: localeText?.hslLabel ?? 'HSL',
    hslAriaLabel: localeText?.hslAriaLabel ?? 'HSL color code',
    hueLabel: localeText?.hueLabel ?? 'Hue',
    hueAriaLabel: localeText?.hueAriaLabel ?? 'Hue value',
    opacityLabel: localeText?.opacityLabel ?? 'Opacity',
    opacityAriaLabel: localeText?.opacityAriaLabel ?? 'Opacity value',
    readySurfaceTonesLabel: localeText?.readySurfaceTonesLabel ?? 'Ready surface tones',
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-panel p-3 shadow-xs">
      <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-text-secondary sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.hexLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            defaultValue={rgbaToHex(local)}
            value={rgbaToHex(local)}
            onChange={(e) => handleHexChange(e.target.value)}
            aria-label={resolvedLocaleText.hexAriaLabel}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.rgbaLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={`rgba(${Math.round(local.r)}, ${Math.round(local.g)}, ${Math.round(local.b)}, ${local.a.toFixed(2)})`}
            onChange={(e) => handleRgbaChange(e.target.value)}
            aria-label={resolvedLocaleText.rgbaAriaLabel}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.hslLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={formatHsl(local)}
            onChange={(e) => handleHslChange(e.target.value)}
            aria-label={resolvedLocaleText.hslAriaLabel}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-muted p-3">
        <div
          className="relative h-36 w-full rounded-lg"
          style={padStyle}
          onPointerDown={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const s = (e.clientX - rect.left) / rect.width;
            const l = 1 - (e.clientY - rect.top) / rect.height;
            handlePadChange(s, l);
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const s = (e.clientX - rect.left) / rect.width;
            const l = 1 - (e.clientY - rect.top) / rect.height;
            handlePadChange(s, l);
          }}
        >
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xs"
            style={{ left: `${padX * 100}%`, top: `${padY * 100}%`, width: 14, height: 14 }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary">
            <span>{resolvedLocaleText.hueLabel}</span>
            <span className="text-text-subtle">{Math.round(hsl.h)}°</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={360}
              step={0.5}
              value={hsl.h}
              onChange={(e) => handleHueChange(Number(e.target.value))}
              className="h-6 w-full appearance-none rounded-full accent-action-primary-bg"
              style={{ background: hueTrack }}
              aria-label={resolvedLocaleText.hueAriaLabel}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full border border-border-subtle shadow-xs"
              style={{
                left: `${(hsl.h / 360) * 100}%`,
                background: `hsl(${hsl.h}, 100%, 50%)`,
              }}
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <span className="w-14">{resolvedLocaleText.opacityLabel}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={local.a}
              onChange={(e) => handleAlphaChange(Number(e.target.value))}
              className="flex-1 accent-action-primary-bg h-3"
              aria-label={resolvedLocaleText.opacityAriaLabel}
            />
            <span className="w-12 text-right text-[11px] font-medium text-text-subtle">{Math.round(local.a * 100)}%</span>
          </label>
        </div>
      </div>

      {surfaceToneOptions.length > 0 ? (
        <div className="flex flex-col gap-2 text-xs font-semibold text-text-secondary">
          <span>{resolvedLocaleText.readySurfaceTonesLabel}</span>
          <div className="grid grid-cols-3 gap-2">
            {surfaceToneOptions.map((option) => {
              const active = surfaceTone === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`flex h-10 w-full items-center justify-center rounded-lg border text-[11px] font-medium transition focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                    active ? 'border-action-primary-border shadow-xs' : 'border-border-subtle hover:border-text-secondary'
                  }`}
                  style={{ background: option.color || 'var(--surface-panel-bg)' }}
                  aria-pressed={active}
                  aria-label={option.label ?? option.id}
                  onClick={() => handleToneClick(option)}
                >
                  <span className="sr-only">{option.label ?? option.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UniversalColorPanel;

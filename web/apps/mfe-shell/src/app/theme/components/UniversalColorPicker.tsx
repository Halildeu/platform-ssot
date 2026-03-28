import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  clampRgba,
  formatHsl,
  hexToRgba,
  hsvToRgb,
  parseAnyColor,
  parseHslString,
  parseRgbaString,
  rgbToHsv,
  rgbaToHex,
  rgbaToString,
  type RgbaColor,
} from '../color-utils';

type SurfaceToneOption = { id: string; label?: string; color: string; group?: string };
type SurfaceTonePaletteGroup = { id: string; label?: string; tones: SurfaceToneOption[] };

type Props = {
  color: RgbaColor;
  surfaceTone: string | null;
  surfaceTonePresets: SurfaceToneOption[];
  surfaceTonePalette: SurfaceTonePaletteGroup[];
  onSurfaceToneChange: (toneId: string, toneColor: RgbaColor) => void;
  onManualColorChange: (color: RgbaColor) => void;
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
  };
};

type PickerState = {
  rgba: RgbaColor;
  hue: number;
  s: number;
  v: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const UniversalColorPicker: React.FC<Props> = ({
  color,
  surfaceTone,
  surfaceTonePresets,
  surfaceTonePalette,
  onSurfaceToneChange,
  onManualColorChange,
  localeText,
}) => {
  const initHsv = useMemo(() => {
    const hsv = rgbToHsv(color.r, color.g, color.b);
    return {
      rgba: color,
      hue: hsv.h,
      s: hsv.s / 100,
      v: hsv.v / 100,
    };
  }, [color]);

  const lastHueRef = useRef<number>(initHsv.hue);
  const [picker, setPicker] = useState<PickerState>(initHsv);

  useEffect(() => {
    const hsv = rgbToHsv(color.r, color.g, color.b);
    const hue = hsv.s === 0 ? lastHueRef.current : hsv.h;
    lastHueRef.current = hue;
    setPicker({
      rgba: color,
      hue,
      s: hsv.s / 100,
      v: hsv.v / 100,
    });
  }, [color]);

  const updateFromHsv = useCallback(
    (hue: number, s: number, v: number, alpha: number) => {
      const { r, g, b } = hsvToRgb(hue, s * 100, v * 100);
      const next: RgbaColor = clampRgba({ r, g, b, a: alpha });
      lastHueRef.current = hue;
      setPicker({ rgba: next, hue, s, v });
      onManualColorChange(next);
    },
    [onManualColorChange],
  );

  const handlePad = (clientX: number, clientY: number, rect: DOMRect) => {
    const s = clamp01((clientX - rect.left) / rect.width);
    const v = clamp01(1 - (clientY - rect.top) / rect.height);
    updateFromHsv(picker.hue, s, v, picker.rgba.a);
  };

  const handleHueChange = (h: number) => {
    updateFromHsv(h, picker.s, picker.v, picker.rgba.a);
  };

  const handleAlphaChange = (a: number) => {
    const next = clampRgba({ ...picker.rgba, a });
    setPicker((prev) => ({ ...prev, rgba: next }));
    onManualColorChange(next);
  };

  const handleHexChange = (value: string) => {
    const parsed = hexToRgba(value);
    if (parsed) {
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      const hue = hsv.s === 0 ? lastHueRef.current : hsv.h;
      lastHueRef.current = hue;
      setPicker({ rgba: { ...parsed, a: picker.rgba.a }, hue, s: hsv.s / 100, v: hsv.v / 100 });
      onManualColorChange({ ...parsed, a: picker.rgba.a });
    }
  };

  const handleRgbaChange = (value: string) => {
    const parsed = parseRgbaString(value);
    if (parsed) {
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      const next = { ...parsed, a: parsed.a };
      const hue = hsv.s === 0 ? lastHueRef.current : hsv.h;
      lastHueRef.current = hue;
      setPicker({ rgba: next, hue, s: hsv.s / 100, v: hsv.v / 100 });
      onManualColorChange(next);
    }
  };

  const handleHslChange = (value: string) => {
    const parsed = parseHslString(value);
    if (parsed) {
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      const hue = hsv.s === 0 ? lastHueRef.current : hsv.h;
      lastHueRef.current = hue;
      setPicker({ rgba: { ...parsed, a: picker.rgba.a }, hue, s: hsv.s / 100, v: hsv.v / 100 });
      onManualColorChange({ ...parsed, a: picker.rgba.a });
    }
  };

  const handleToneClick = (option: SurfaceToneOption) => {
    const parsed = parseAnyColor(option.color);
    if (!parsed) return;
    const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
    const next = { ...parsed, a: 1 };
    setPicker({ rgba: next, hue: hsv.h, s: hsv.s / 100, v: hsv.v / 100 });
    onSurfaceToneChange(option.id, next);
  };

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
  };

  const renderSwatch = (option: SurfaceToneOption) => {
    const active = surfaceTone === option.id;
    return (
      <button
        key={option.id}
        type="button"
        className={`h-9 w-9 rounded-lg border transition focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
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
  };

  const gradientHue = `hsl(${picker.hue}, 100%, 50%)`;
  const hueTrack =
    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  const opacityTrack = useMemo(
    () =>
      `linear-gradient(to right, rgba(${picker.rgba.r}, ${picker.rgba.g}, ${picker.rgba.b}, 0), rgba(${picker.rgba.r}, ${picker.rgba.g}, ${picker.rgba.b}, 1))`,
    [picker.rgba],
  );
  const padStyle = {
    backgroundImage: `
      linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)),
      linear-gradient(to right, #ffffff, ${gradientHue})
    `,
    backgroundRepeat: 'no-repeat',
  };
  const padX = clamp01(picker.s);
  const padY = clamp01(1 - picker.v);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-panel p-3 shadow-xs">
      <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-text-secondary sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.hexLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={rgbaToHex(picker.rgba)}
            onChange={(e) => handleHexChange(e.target.value)}
            aria-label={resolvedLocaleText.hexAriaLabel}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.rgbaLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={rgbaToString(picker.rgba)}
            onChange={(e) => handleRgbaChange(e.target.value)}
            aria-label={resolvedLocaleText.rgbaAriaLabel}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>{resolvedLocaleText.hslLabel}</span>
          <input
            className="h-9 rounded-md border border-border-subtle bg-surface-panel px-2 text-sm font-mono text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={formatHsl(picker.rgba)}
            onChange={(e) => handleHslChange(e.target.value)}
            aria-label={resolvedLocaleText.hslAriaLabel}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-muted p-3">
        <div
          className="relative h-40 w-full rounded-lg"
          style={padStyle}
          onPointerDown={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            handlePad(e.clientX, e.clientY, rect);
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            handlePad(e.clientX, e.clientY, rect);
          }}
        >
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xs"
            style={{
              left: `${padX * 100}%`,
              top: `${padY * 100}%`,
              width: 14,
              height: 14,
              background: `rgba(${picker.rgba.r}, ${picker.rgba.g}, ${picker.rgba.b}, ${picker.rgba.a})`,
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary">
            <span>{resolvedLocaleText.hueLabel}</span>
            <span className="text-text-subtle">{Math.round(picker.hue)}°</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={360}
              step={0.5}
              value={picker.hue}
              onChange={(e) => handleHueChange(Number(e.target.value))}
              className="h-6 w-full appearance-none rounded-full accent-action-primary-bg"
              style={{ background: hueTrack }}
              aria-label={resolvedLocaleText.hueAriaLabel}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full border border-border-subtle shadow-xs"
              style={{
                left: `${(picker.hue / 360) * 100}%`,
                background: `hsl(${picker.hue}, 100%, 50%)`,
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary">
              <span>{resolvedLocaleText.opacityLabel}</span>
              <span className="text-text-subtle">{Math.round(picker.rgba.a * 100)}%</span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={picker.rgba.a}
                onChange={(e) => handleAlphaChange(Number(e.target.value))}
                className="h-6 w-full appearance-none rounded-full accent-action-primary-bg"
                style={{ background: opacityTrack }}
                aria-label={resolvedLocaleText.opacityAriaLabel}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
              <div
                className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full border border-border-subtle shadow-xs"
                style={{
                  left: `${picker.rgba.a * 100}%`,
                  background: `rgba(${picker.rgba.r}, ${picker.rgba.g}, ${picker.rgba.b}, ${picker.rgba.a})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const paletteSwatches = surfaceTonePalette.flatMap((group) => group.tones);
        const all = (paletteSwatches.length > 0 ? paletteSwatches : surfaceTonePresets).reduce<SurfaceToneOption[]>(
          (acc, option) => {
            if (!acc.find((item) => item.id === option.id)) acc.push(option);
            return acc;
          },
          [],
        );
        if (all.length === 0) return null;
        return (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {all.map(renderSwatch)}
          </div>
        );
      })()}
    </div>
  );
};

export default UniversalColorPicker;

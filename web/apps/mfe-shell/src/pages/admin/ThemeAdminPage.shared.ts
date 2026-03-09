import { resolveThemeModeKey } from 'mfe-ui-kit';

export type ThemeRegistryControlType = 'COLOR' | 'OPACITY' | 'RADIUS' | 'MOTION';
export type ThemeRegistryEditableBy = 'USER_ALLOWED' | 'ADMIN_ONLY';

export type ThemeRegistryEntry = {
  id: string;
  key: string;
  label: string;
  groupName: string;
  controlType: ThemeRegistryControlType;
  editableBy: ThemeRegistryEditableBy;
  cssVars?: string[];
  description?: string;
};

export type ThemeSummary = {
  id: string;
  name: string;
  type: 'GLOBAL' | 'USER';
  appearance?: string;
  surfaceTone?: string | null;
  activeFlag?: boolean | null;
  visibility?: string | null;
  axes?: {
    accent?: string;
    density?: string;
    radius?: string;
    elevation?: string;
    motion?: string;
  };
};

export type ThemeDetails = ThemeSummary & {
  overrides?: Record<string, string>;
};

export type ThemeAdminRow = ThemeRegistryEntry & {
  value?: string;
};

export type ThemeMetaState = {
  appearance: string;
  surfaceTone: string | null;
  axes: {
    accent: string;
    density: string;
    radius: string;
    elevation: string;
    motion: string;
  };
};

export type ThemeColorPickerState = {
  key: string;
  label: string;
  color: { r: number; g: number; b: number; a: number };
};

export type ThemeOption = {
  value: string;
  label: string;
};

export const groupOrder = ['surface', 'text', 'border', 'selection', 'accent', 'overlay', 'grid', 'erpAction', 'status'];

export const groupLabelMap: Record<string, string> = {
  surface: 'Surface',
  text: 'Text',
  border: 'Border',
  selection: 'Selection',
  accent: 'Accent',
  overlay: 'Overlay',
  grid: 'Grid',
  erpAction: 'Action',
  status: 'Status',
};

export const usageHintByKey: Record<string, string> = {
  'surface.page.bg': 'Uygulama sayfa zemini (body).',
  'surface.default.bg': 'Genel yüzeyler/kartlar (çoğu container).',
  'surface.panel.bg': 'Popover/panel container’ları (örn: Uygulamalar menüsü).',
  'surface.muted.bg': 'Muted/hover yüzeyi (örn: hover:bg-surface-muted, ikon balonları).',
  'surface.header.bg': 'Header yüzeyi (bg-surface-header).',
  'surface.raised.bg': 'Yükseltilmiş kart/yüzey (shadow ile).',
  'overlay.bg': 'Modal/backdrop overlay (bg-surface-overlay).',
};

export const densityOptions: ThemeOption[] = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

export const radiusOptions: ThemeOption[] = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'sharp', label: 'Sharp' },
];

export const elevationOptions: ThemeOption[] = [
  { value: 'raised', label: 'Raised' },
  { value: 'flat', label: 'Flat' },
];

export const motionOptions: ThemeOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'reduced', label: 'Reduced' },
];

export const accentOptions: ThemeOption[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'light', label: 'Light' },
  { value: 'violet', label: 'Violet' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'graphite', label: 'Graphite' },
];

export const surfaceToneOptions = [
  ...Array.from({ length: 6 }, (_, index) => `ultra-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `mid-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `deep-${index + 1}`),
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const resolveTailwindHint = (key: string): string | null => {
  if (key === 'overlay.bg') return 'bg-surface-overlay';
  if (key === 'selection.bg') return 'bg-selection';
  if (key.startsWith('surface.') && key.endsWith('.bg')) {
    const suffix = key.replace(/^surface\./, '').replace(/\.bg$/, '');
    return `bg-surface-${suffix}`;
  }
  if (key.startsWith('text.')) {
    const suffix = key.replace(/^text\./, '');
    return `text-text-${suffix}`;
  }
  if (key.startsWith('border.')) {
    const suffix = key.replace(/^border\./, '');
    return `border-border-${suffix}`;
  }
  return null;
};

export const resolveThemeAttr = (appearanceRaw: string | undefined | null, densityRaw: string | undefined | null) =>
  resolveThemeModeKey({ appearance: appearanceRaw, density: densityRaw });

export const parseColor = (raw: string | undefined | null): { r: number; g: number; b: number } | null => {
  if (!raw) return null;
  const value = raw.trim();
  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    const int = Number.parseInt(hex, 16);
    if (Number.isNaN(int)) return null;
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }
  const rgbMatch = value.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgbMatch) {
    return {
      r: clamp(Number.parseFloat(rgbMatch[1]), 0, 255),
      g: clamp(Number.parseFloat(rgbMatch[2]), 0, 255),
      b: clamp(Number.parseFloat(rgbMatch[3]), 0, 255),
    };
  }
  return null;
};

const relativeLuminance = (rgb: { r: number; g: number; b: number }) => {
  const channel = (color: number) => {
    const value = color / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const r = channel(rgb.r);
  const g = channel(rgb.g);
  const b = channel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (bg: { r: number; g: number; b: number }, fg: { r: number; g: number; b: number }) => {
  const maxL = Math.max(relativeLuminance(bg), relativeLuminance(fg));
  const minL = Math.min(relativeLuminance(bg), relativeLuminance(fg));
  return (maxL + 0.05) / (minL + 0.05);
};

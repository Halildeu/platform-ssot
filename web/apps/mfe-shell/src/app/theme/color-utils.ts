export type RgbaColor = { r: number; g: number; b: number; a: number };
export type HsvColor = { h: number; s: number; v: number };
export type HslColor = { h: number; s: number; l: number };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const parseAlpha = (raw: string | undefined | null): number => {
  if (!raw) return 1;
  const value = raw.trim();
  if (!value) return 1;
  if (value.endsWith('%')) {
    const n = Number(value.slice(0, -1));
    return Number.isNaN(n) ? 1 : clamp(n / 100, 0, 1);
  }
  const n = Number(value);
  return Number.isNaN(n) ? 1 : clamp(n, 0, 1);
};

const parseCssRgbSpaceSeparated = (input: string): RgbaColor | null => {
  const match = input
    .trim()
    .match(/^rgba?\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i);
  if (!match) return null;
  const [, rRaw, gRaw, bRaw, aRaw] = match;
  const parseChannel = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed.endsWith('%')) {
      const n = Number(trimmed.slice(0, -1));
      return Number.isNaN(n) ? null : clamp((n / 100) * 255, 0, 255);
    }
    const n = Number(trimmed);
    return Number.isNaN(n) ? null : clamp(n, 0, 255);
  };
  const r = parseChannel(rRaw);
  const g = parseChannel(gRaw);
  const b = parseChannel(bRaw);
  if (r === null || g === null || b === null) return null;
  return { r, g, b, a: parseAlpha(aRaw) };
};

const parseCssColorSrgb = (input: string): RgbaColor | null => {
  const match = input
    .trim()
    .match(/^color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i);
  if (!match) return null;
  const [, rRaw, gRaw, bRaw, aRaw] = match;
  const r = Number(rRaw);
  const g = Number(gRaw);
  const b = Number(bRaw);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return {
    r: clamp(r, 0, 1) * 255,
    g: clamp(g, 0, 1) * 255,
    b: clamp(b, 0, 1) * 255,
    a: parseAlpha(aRaw),
  };
};

export const hexToRgba = (hex: string): RgbaColor | null => {
  const sanitized = hex.trim().replace('#', '');
  if (![3, 6].includes(sanitized.length)) return null;
  const normalized = sanitized.length === 3 ? sanitized.split('').map((ch) => ch + ch).join('') : sanitized;
  const int = Number.parseInt(normalized, 16);
  if (Number.isNaN(int)) return null;
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
    a: 1,
  };
};

export const rgbaToHex = (rgba: RgbaColor): string => {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(clamp(Math.round(rgba.r), 0, 255))}${toHex(clamp(Math.round(rgba.g), 0, 255))}${toHex(
    clamp(Math.round(rgba.b), 0, 255),
  )}`;
};

export const rgbaToString = (rgba: RgbaColor): string =>
  `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${Number(rgba.a.toFixed(2))})`;

export const rgbaToHsl = (rgba: RgbaColor): { h: number; s: number; l: number; a: number } => {
  const r = clamp(rgba.r / 255);
  const g = clamp(rgba.g / 255);
  const b = clamp(rgba.b / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100, a: rgba.a };
};

export const hslToRgba = (h: number, s: number, l: number, a = 1): RgbaColor => {
  const sNorm = clamp(s / 100);
  const lNorm = clamp(l / 100);
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (h >= 0 && h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: clamp(a),
  };
};

export const parseRgbaString = (input: string): RgbaColor | null => {
  const match = input.replace(/\s+/g, '').match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,([\d.]+))?\)$/i);
  if (!match) return null;
  const [, r, g, b, a = '1'] = match;
  const nr = Number(r);
  const ng = Number(g);
  const nb = Number(b);
  const na = Number(a);
  if ([nr, ng, nb].some((v) => Number.isNaN(v))) return null;
  return { r: nr, g: ng, b: nb, a: clamp(na, 0, 1) };
};

export const parseHslString = (input: string): RgbaColor | null => {
  const match = input.replace(/\s+/g, '').match(/^hsla?\(([-\d.]+),([\d.]+)%?,([\d.]+)%?(?:,([\d.]+))?\)$/i);
  if (!match) return null;
  const [, h, s, l, a = '1'] = match;
  const nh = Number(h);
  const ns = Number(s);
  const nl = Number(l);
  const na = Number(a);
  if ([nh, ns, nl].some((v) => Number.isNaN(v))) return null;
  return hslToRgba(((nh % 360) + 360) % 360, ns, nl, clamp(na, 0, 1));
};

export const formatHsl = (rgba: RgbaColor): string => {
  const { h, s, l, a } = rgbaToHsl(rgba);
  const alpha = a >= 1 ? '' : `, ${a.toFixed(2)}`;
  return `hsla(${Math.round(h)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%${alpha})`;
};

export const parseAnyColor = (input: string): RgbaColor | null => {
  if (!input) return null;
  const normalized = input.trim();
  if (!normalized) return null;
  if (normalized.toLowerCase() === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (normalized.startsWith('#')) return hexToRgba(normalized);
  const srgb = parseCssColorSrgb(normalized);
  if (srgb) return srgb;
  const rgba = parseRgbaString(normalized);
  if (rgba) return rgba;
  const spaced = parseCssRgbSpaceSeparated(normalized);
  if (spaced) return spaced;
  const hsl = parseHslString(normalized);
  if (hsl) return hsl;
  return null;
};

export const clampRgba = (rgba: RgbaColor): RgbaColor => ({
  r: clamp(rgba.r, 0, 255),
  g: clamp(rgba.g, 0, 255),
  b: clamp(rgba.b, 0, 255),
  a: clamp(rgba.a, 0, 1),
});

export const rgbToHsv = (r: number, g: number, b: number): HsvColor => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }
  h *= 60;
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  return { h, s: s * 100, v: max * 100 };
};

export const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  const sn = clamp(s / 100, 0, 1);
  const vn = clamp(v / 100, 0, 1);
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h >= 0 && h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
};

export const rgbToHsl = (r: number, g: number, b: number): HslColor => {
  const rgba = { r, g, b, a: 1 };
  const hsl = rgbaToHsl(rgba);
  return { h: hsl.h, s: hsl.s, l: hsl.l };
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  const rgba = hslToRgba(h, s, l, 1);
  return { r: rgba.r, g: rgba.g, b: rgba.b };
};

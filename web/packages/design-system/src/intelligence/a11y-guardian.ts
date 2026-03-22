/* A11y Guardian — runtime accessibility monitoring */

export interface A11yViolation {
  rule: string;
  element: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  message: string;
  fix: string;
}

export interface A11yGuardianResult {
  violations: A11yViolation[];
  score: number;
  contrastIssues: ContrastIssue[];
}

export interface ContrastIssue {
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  level: 'AA' | 'AAA';
}

/**
 * Calculate contrast ratio between two colors.
 * Colors should be in hex format (#RRGGBB).
 */
export function calculateContrastRatio(fg: string, bg: string): number {
  const lumFg = relativeLuminance(hexToRgb(fg));
  const lumBg = relativeLuminance(hexToRgb(bg));
  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if a color pair meets WCAG contrast requirements.
 */
export function checkContrast(
  fg: string,
  bg: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText = false,
): ContrastIssue | null {
  const ratio = calculateContrastRatio(fg, bg);
  const required = level === 'AAA'
    ? (isLargeText ? 4.5 : 7)
    : (isLargeText ? 3 : 4.5);

  if (ratio >= required) return null;

  return {
    foreground: fg,
    background: bg,
    ratio: Math.round(ratio * 100) / 100,
    required,
    level,
  };
}

function contrastRatioFromLum(a: number, b: number): number {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l, l, l];

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [hue2rgb(p, q, h + 1/3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1/3)];
}

/**
 * Suggest a color adjustment to meet contrast requirements.
 * Uses HSL-based lightness stepping to preserve hue and saturation.
 */
export function suggestContrastFix(fg: string, bg: string, level: 'AA' | 'AAA' = 'AA'): string {
  const bgLum = relativeLuminance(hexToRgb(bg));
  const required = level === 'AAA' ? 7 : 4.5;
  const needsDarker = bgLum > 0.5;

  // Convert to HSL, adjust lightness
  const [r, g, b] = hexToRgb(fg);
  let [h, s, l] = rgbToHsl(r, g, b);

  for (let i = 0; i < 50; i++) {
    l = needsDarker ? Math.max(0, l - 0.02) : Math.min(1, l + 0.02);
    const [ar, ag, ab] = hslToRgb(h, s, l);
    const ratio = contrastRatioFromLum(
      relativeLuminance([ar, ag, ab]),
      bgLum,
    );
    if (ratio >= required) {
      return '#' + [ar, ag, ab].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
    }
  }

  return needsDarker ? '#000000' : '#ffffff';
}

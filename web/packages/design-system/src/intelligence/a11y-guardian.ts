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

/**
 * Suggest a color adjustment to meet contrast requirements.
 * Returns a darker/lighter version of the foreground color.
 */
export function suggestContrastFix(fg: string, bg: string, level: 'AA' | 'AAA' = 'AA'): string {
  const bgLum = relativeLuminance(hexToRgb(bg));
  const required = level === 'AAA' ? 7 : 4.5;

  // Determine if we need lighter or darker foreground
  const needsDarker = bgLum > 0.5;

  // Simple approach: step the foreground toward black or white
  const [r, g, b] = hexToRgb(fg);
  const step = needsDarker ? -0.1 : 0.1;

  let adjusted: [number, number, number] = [r, g, b];
  for (let i = 0; i < 20; i++) {
    adjusted = [
      Math.max(0, Math.min(1, adjusted[0] + step)),
      Math.max(0, Math.min(1, adjusted[1] + step)),
      Math.max(0, Math.min(1, adjusted[2] + step)),
    ];
    const ratio = (Math.max(relativeLuminance(adjusted), bgLum) + 0.05) /
                  (Math.min(relativeLuminance(adjusted), bgLum) + 0.05);
    if (ratio >= required) break;
  }

  return '#' + adjusted.map(c =>
    Math.round(c * 255).toString(16).padStart(2, '0'),
  ).join('');
}

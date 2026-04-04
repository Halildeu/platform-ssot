/**
 * Colorblind-Safe Color Palettes
 *
 * Based on research by Paul Tol (SRON) and Color Universal Design (CUD).
 * Each palette is designed for a specific type of color vision deficiency.
 *
 * @see https://personal.sron.nl/~pault/data/colourschemes.pdf
 * @see decisions/topics/chart-viz-engine-selection.v1.json (CHART-009)
 */

export const COLORBLIND_PALETTES: Record<string, string[]> = {
  /** Deuteranopia (red-green, most common ~8% males) */
  deuteranopia: [
    '#0077BB', // blue
    '#33BBEE', // cyan
    '#EE7733', // orange
    '#CC3311', // red
    '#009988', // teal
    '#EE3377', // magenta
    '#BBBBBB', // grey
    '#000000', // black
  ],

  /** Protanopia (red-blind, ~1% males) */
  protanopia: [
    '#4477AA', // blue
    '#66CCEE', // cyan
    '#CCBB44', // yellow
    '#EE6677', // pink
    '#228833', // green
    '#AA3377', // purple
    '#BBBBBB', // grey
    '#000000', // black
  ],

  /** Tritanopia (blue-yellow, rare ~0.01%) */
  tritanopia: [
    '#332288', // indigo
    '#88CCEE', // light blue
    '#44AA99', // teal
    '#117733', // green
    '#999933', // olive
    '#DDCC77', // sand
    '#CC6677', // rose
    '#882255', // wine
  ],

  /** Monochrome (all CVD types + print-safe) */
  monochrome: [
    '#1a1a2e',
    '#4a4a5a',
    '#7a7a8a',
    '#aaaaaa',
    '#cccccc',
    '#e0e0e0',
    '#333333',
    '#666666',
  ],
};

/* Pattern Detection — predict component needs from usage context */

export interface PatternPrediction {
  pattern: string;
  confidence: number;
  suggestedComponents: string[];
  reason: string;
}

/** Known page-level patterns and their typical component compositions */
const PAGE_PATTERNS: Array<{ name: string; indicators: string[]; components: string[] }> = [
  { name: 'CRUD List Page', indicators: ['EntityGridTemplate', 'FilterBar', 'Button'], components: ['DetailDrawer', 'FormDrawer', 'Pagination', 'SearchInput'] },
  { name: 'Dashboard Page', indicators: ['SmartDashboard', 'Card', 'BarChart'], components: ['LineChart', 'PieChart', 'Badge', 'Tabs'] },
  { name: 'Settings Page', indicators: ['Switch', 'Input', 'Card'], components: ['Accordion', 'Button', 'Select', 'Tabs'] },
  { name: 'Detail Page', indicators: ['DetailDrawer', 'Descriptions', 'Tabs'], components: ['Badge', 'Timeline', 'Button', 'Avatar'] },
  { name: 'Form Page', indicators: ['Input', 'Select', 'Button', 'FormField'], components: ['DatePicker', 'Checkbox', 'Upload', 'Steps'] },
  { name: 'Auth Page', indicators: ['Input', 'Button', 'Card'], components: ['Checkbox', 'LinkInline', 'Alert'] },
];

/**
 * Detect patterns from a list of components used in a file/page.
 * Suggests additional components that typically appear together.
 */
export function detectPatterns(usedComponents: string[]): PatternPrediction[] {
  const predictions: PatternPrediction[] = [];
  const usedSet = new Set(usedComponents.map(c => c.toLowerCase()));

  for (const pattern of PAGE_PATTERNS) {
    const matchCount = pattern.indicators.filter(i => usedSet.has(i.toLowerCase())).length;
    if (matchCount === 0) continue;

    const confidence = matchCount / pattern.indicators.length;
    const missing = pattern.components.filter(c => !usedSet.has(c.toLowerCase()));

    if (confidence >= 0.3 && missing.length > 0) {
      predictions.push({
        pattern: pattern.name,
        confidence: Math.round(confidence * 100) / 100,
        suggestedComponents: missing,
        reason: `${matchCount}/${pattern.indicators.length} indicators match — likely a ${pattern.name}`,
      });
    }
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Predict bundle impact of adding suggested components.
 */
export function predictBundleImpact(components: string[]): { totalKB: number; breakdown: Record<string, number> } {
  const SIZES: Record<string, number> = {
    DetailDrawer: 4, FormDrawer: 4, Pagination: 3, SearchInput: 3,
    LineChart: 15, PieChart: 12, Badge: 0.8, Tabs: 5,
    Accordion: 4, Button: 2, Select: 4, DatePicker: 12,
    Checkbox: 1.5, Upload: 8, Steps: 4, Timeline: 3,
    Avatar: 1, LinkInline: 0.5, Alert: 1.5, Input: 3,
  };

  const breakdown: Record<string, number> = {};
  let totalKB = 0;
  for (const c of components) {
    const size = SIZES[c] ?? 3;
    breakdown[c] = size;
    totalKB += size;
  }
  return { totalKB: Math.round(totalKB * 10) / 10, breakdown };
}

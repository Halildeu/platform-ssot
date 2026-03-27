/* Predictive Component Engine — suggest missing components based on code analysis */

import { PAGE_PATTERNS, COMBINATION_RULES } from './component-patterns';
import type { PagePattern } from './component-patterns';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PredictionResult {
  component: string;
  confidence: number;
  reason: string;
  category: 'missing' | 'recommended' | 'optional';
  bundleImpactKB: number;
  importStatement: string;
}

export interface PredictionReport {
  detectedPattern: { id: string; name: string; confidence: number } | null;
  existingComponents: string[];
  predictions: PredictionResult[];
  totalBundleImpactKB: number;
}

/* ------------------------------------------------------------------ */
/*  Import extraction                                                  */
/* ------------------------------------------------------------------ */

const IMPORT_REGEX = /import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
const JSX_COMPONENT_REGEX = /<([A-Z][A-Za-z0-9]*)/g;

/**
 * Extract component names from import statements and JSX usage.
 */
export function extractComponents(code: string): string[] {
  const components = new Set<string>();

  // From imports
  let match: RegExpExecArray | null;
  IMPORT_REGEX.lastIndex = 0;
  while ((match = IMPORT_REGEX.exec(code)) !== null) {
    const imports = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
    for (const imp of imports) {
      if (imp && /^[A-Z]/.test(imp)) {
        components.add(imp);
      }
    }
  }

  // From JSX usage
  JSX_COMPONENT_REGEX.lastIndex = 0;
  while ((match = JSX_COMPONENT_REGEX.exec(code)) !== null) {
    components.add(match[1]);
  }

  return [...components];
}

/* ------------------------------------------------------------------ */
/*  Pattern detection                                                  */
/* ------------------------------------------------------------------ */

interface DetectedPattern {
  pattern: PagePattern;
  confidence: number;
  matchedSignals: number;
}

function detectPattern(code: string): DetectedPattern | null {
  let bestMatch: DetectedPattern | null = null;

  for (const pattern of PAGE_PATTERNS) {
    let matchedSignals = 0;
    for (const signal of pattern.signals) {
      signal.lastIndex = 0;
      if (signal.test(code)) {
        matchedSignals++;
      }
    }

    if (matchedSignals === 0) continue;

    const confidence = matchedSignals / pattern.signals.length;
    if (!bestMatch || confidence > bestMatch.confidence) {
      bestMatch = { pattern, confidence, matchedSignals };
    }
  }

  return bestMatch && bestMatch.confidence >= 0.2 ? bestMatch : null;
}

/* ------------------------------------------------------------------ */
/*  Prediction engine                                                  */
/* ------------------------------------------------------------------ */

function getImportStatement(componentName: string): string {
  return `import { ${componentName} } from '@mfe/design-system';`;
}

/**
 * Predict missing components based on source code analysis.
 *
 * 1. Extracts existing component imports and JSX usage.
 * 2. Detects the page pattern (dashboard, CRUD, form, etc.).
 * 3. Identifies missing expected components from the pattern.
 * 4. Applies combination rules for additional suggestions.
 * 5. Sorts by confidence * importance weight.
 */
export function predictComponents(code: string): PredictionReport {
  const existingComponents = extractComponents(code);
  const existingSet = new Set(existingComponents.map(c => c.toLowerCase()));

  const detected = detectPattern(code);
  const predictions: PredictionResult[] = [];
  const addedComponents = new Set<string>();

  // Pattern-based predictions
  if (detected) {
    const { pattern, confidence: patternConfidence } = detected;

    for (const expected of pattern.expectedComponents) {
      if (existingSet.has(expected.name.toLowerCase())) continue;
      if (addedComponents.has(expected.name)) continue;

      const importanceWeight =
        expected.importance === 'required' ? 1.0 :
        expected.importance === 'recommended' ? 0.75 :
        0.5;

      const confidence = Math.round(patternConfidence * importanceWeight * 100) / 100;

      if (confidence >= 0.15) {
        predictions.push({
          component: expected.name,
          confidence,
          reason: `${pattern.name} pattern typically includes ${expected.name} (${expected.importance})`,
          category: expected.importance === 'required' ? 'missing' : expected.importance === 'recommended' ? 'recommended' : 'optional',
          bundleImpactKB: expected.bundleKB,
          importStatement: getImportStatement(expected.name),
        });
        addedComponents.add(expected.name);
      }
    }
  }

  // Combination rule predictions
  for (const rule of COMBINATION_RULES) {
    if (!existingSet.has(rule.if.toLowerCase())) continue;
    if (existingSet.has(rule.then.toLowerCase())) continue;
    if (addedComponents.has(rule.then)) continue;

    // Find bundle size from any pattern that includes this component
    let bundleKB = 3.0; // default
    for (const pattern of PAGE_PATTERNS) {
      const comp = pattern.expectedComponents.find(c => c.name === rule.then);
      if (comp) { bundleKB = comp.bundleKB; break; }
    }

    predictions.push({
      component: rule.then,
      confidence: rule.confidence,
      reason: rule.reason,
      category: 'recommended',
      bundleImpactKB: bundleKB,
      importStatement: getImportStatement(rule.then),
    });
    addedComponents.add(rule.then);
  }

  // Sort by confidence descending, then by category weight
  const categoryWeight = { missing: 3, recommended: 2, optional: 1 };
  predictions.sort((a, b) => {
    const scoreA = a.confidence * categoryWeight[a.category];
    const scoreB = b.confidence * categoryWeight[b.category];
    return scoreB - scoreA;
  });

  const totalBundleImpactKB = Math.round(
    predictions.reduce((sum, p) => sum + p.bundleImpactKB, 0) * 10
  ) / 10;

  return {
    detectedPattern: detected
      ? { id: detected.pattern.id, name: detected.pattern.name, confidence: detected.confidence }
      : null,
    existingComponents,
    predictions,
    totalBundleImpactKB,
  };
}

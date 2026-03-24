export { reviewCode, getReviewRules, type ReviewIssue, type ReviewResult, type ReviewSeverity } from './design-review';
export { detectPatterns, predictBundleImpact, type PatternPrediction } from './pattern-detection';
export { calculateContrastRatio, checkContrast, suggestContrastFix, type A11yViolation, type A11yGuardianResult, type ContrastIssue } from './a11y-guardian';
export { PAGE_PATTERNS, COMBINATION_RULES, type PagePattern, type CombinationRule } from './component-patterns';
export { predictComponents, extractComponents, type PredictionResult, type PredictionReport } from './predictive-engine';
export { createA11yGuardian, type A11yGuardian, type A11yGuardianOptions } from './a11y-runtime-guardian';
export { runtimeA11yRules, getRuleById, type RuntimeA11yRule, type RuntimeViolation } from './a11y-runtime-rules';
export { detectDrift, type DriftReport, type DriftViolation, type DriftType, type DriftSeverity } from './drift-detector';

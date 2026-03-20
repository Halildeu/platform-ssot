/**
 * ESLint rule: no-css-var-without-fallback
 *
 * Detects CSS custom property usage (var(--...)) without a fallback value
 * in TSX/TS files. Ensures design system resilience by requiring fallback
 * values for all CSS variable references.
 *
 * ALLOWED:
 *   var(--action-primary, #1a73e8)
 *   var(--action-primary, var(--fallback))
 *   var(--action-primary, transparent)
 *
 * FLAGGED:
 *   var(--action-primary)
 *   `color: var(--text-muted)`
 */

// Files that define CSS custom properties (exempt from fallback requirement)
const TOKEN_FILE_PATTERNS = [
  /token-bridge\.css/,
  /theme\.css/,
  /tokens?\.(css|scss|less)/,
  /variables\.(css|scss|less)/,
];

// Test file patterns (exempt from the rule)
const TEST_FILE_PATTERNS = [
  /__tests__\//,
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\/__mocks__\//,
  /\/test\//,
  /\/tests\//,
  /\.stories\.[jt]sx?$/,
];

/**
 * Regex to find var(--...) WITHOUT a fallback.
 *
 * Matches: var(--some-prop)
 * Does NOT match: var(--some-prop, fallback)
 *
 * Explanation:
 *   var\(          - literal "var("
 *   \s*            - optional whitespace
 *   (--[\w-]+)     - capture group: CSS custom property name
 *   \s*            - optional whitespace
 *   \)             - literal ")" — if there's a comma before ), the regex won't match
 *
 * We use a negative lookahead to reject matches that have a comma (indicating a fallback).
 */
const CSS_VAR_WITHOUT_FALLBACK = /var\(\s*(--[\w-]+)\s*\)/g;

/**
 * Regex to find ALL var(--...) patterns (with or without fallback).
 * Used to determine which matches actually have fallbacks.
 */
const CSS_VAR_ALL = /var\(\s*--[\w-]+[\s,)]/g;

/**
 * More precise check: find var(--prop) calls without a comma before the closing paren.
 * This handles nested var() calls properly by tracking parenthesis depth.
 */
function findVarsWithoutFallback(str) {
  const results = [];

  // First, find all var() calls and parse their structure
  const varCalls = [];
  const varStartPattern = /var\(\s*/g;
  let match;

  while ((match = varStartPattern.exec(str)) !== null) {
    const startIndex = match.index;
    const afterOpen = match.index + match[0].length;

    // Check that next chars are -- (custom property)
    if (str.slice(afterOpen, afterOpen + 2) !== '--') {
      continue;
    }

    // Walk forward to find the property name
    let i = afterOpen + 2;
    while (i < str.length && /[\w-]/.test(str[i])) {
      i++;
    }

    const propName = str.slice(afterOpen, i);

    // Skip whitespace
    while (i < str.length && /\s/.test(str[i])) {
      i++;
    }

    if (i >= str.length) continue;

    const hasFallback = str[i] === ',';

    // Find the matching closing paren (tracking nesting depth)
    let depth = 1;
    let j = afterOpen;
    while (j < str.length && depth > 0) {
      if (str[j] === '(') depth++;
      else if (str[j] === ')') depth--;
      if (depth > 0) j++;
    }
    const endIndex = j + 1;

    varCalls.push({ propName, startIndex, endIndex, hasFallback });
  }

  // Now filter: only flag var() calls without fallback that are NOT
  // themselves nested inside another var() as a fallback argument
  for (const call of varCalls) {
    if (call.hasFallback) continue;

    // Check if this var() is nested as a fallback inside an outer var()
    const isNestedFallback = varCalls.some(
      (outer) =>
        outer !== call &&
        outer.hasFallback &&
        outer.startIndex < call.startIndex &&
        outer.endIndex > call.endIndex,
    );

    if (isNestedFallback) continue;

    results.push({
      propName: call.propName,
      startIndex: call.startIndex,
      endIndex: call.endIndex,
      text: str.slice(call.startIndex, call.endIndex),
    });
  }

  return results;
}

/**
 * Check if a file path matches any of the given patterns.
 */
function matchesAnyPattern(filePath, patterns) {
  return patterns.some((pattern) => pattern.test(filePath));
}

/**
 * Collect CSS custom property definitions from the file (--prop-name: value).
 * Properties defined in the same file are exempt from the fallback requirement.
 */
function collectDefinedProperties(sourceCode) {
  const text = sourceCode.getText();
  const defined = new Set();
  const defPattern = /(--[\w-]+)\s*:/g;
  let m;
  while ((m = defPattern.exec(text)) !== null) {
    defined.add(m[1]);
  }
  return defined;
}

export const rules = {
  'no-css-var-without-fallback': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require fallback values for CSS custom properties (var(--prop, fallback)) to ensure design system resilience.',
        recommended: true,
      },
      messages: {
        missingFallback:
          'CSS variable "{{propName}}" used without a fallback value. ' +
          'Use var({{propName}}, <fallback>) to ensure resilience when the custom property is undefined. ' +
          'Example: var({{propName}}, #000) or var({{propName}}, var(--other-prop))',
      },
      schema: [
        {
          type: 'object',
          properties: {
            exemptProperties: {
              type: 'array',
              items: { type: 'string' },
              description:
                'CSS custom property names (e.g. "--brand-primary") that are exempt from requiring a fallback.',
            },
            exemptFilePatterns: {
              type: 'array',
              items: { type: 'string' },
              description:
                'Additional file path regex patterns to exempt from this rule.',
            },
          },
          additionalProperties: false,
        },
      ],
    },

    create(context) {
      const filename = context.filename || context.getFilename();
      const options = context.options[0] || {};
      const exemptProperties = new Set(options.exemptProperties || []);
      const extraFilePatterns = (options.exemptFilePatterns || []).map(
        (p) => new RegExp(p),
      );

      // Skip test files
      if (matchesAnyPattern(filename, TEST_FILE_PATTERNS)) {
        return {};
      }

      // Skip token definition files
      if (matchesAnyPattern(filename, TOKEN_FILE_PATTERNS)) {
        return {};
      }

      // Skip extra exempt file patterns from options
      if (extraFilePatterns.length && matchesAnyPattern(filename, extraFilePatterns)) {
        return {};
      }

      let definedProperties = null;

      function getDefinedProperties() {
        if (definedProperties === null) {
          definedProperties = collectDefinedProperties(context.sourceCode || context.getSourceCode());
        }
        return definedProperties;
      }

      function checkStringForVars(node, value) {
        const violations = findVarsWithoutFallback(value);
        for (const v of violations) {
          // Skip if property is defined in same file
          if (getDefinedProperties().has(v.propName)) {
            continue;
          }
          // Skip if property is in exempt list
          if (exemptProperties.has(v.propName)) {
            continue;
          }

          context.report({
            node,
            messageId: 'missingFallback',
            data: { propName: v.propName },
          });
        }
      }

      return {
        // String literals: "var(--foo)"
        Literal(node) {
          if (typeof node.value !== 'string') return;
          if (!node.value.includes('var(--')) return;
          checkStringForVars(node, node.value);
        },

        // Template literals: `color: var(--foo)`
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            const raw = quasi.value.cooked ?? quasi.value.raw;
            if (!raw.includes('var(--')) continue;
            checkStringForVars(node, raw);
          }
        },
      };
    },
  },
};

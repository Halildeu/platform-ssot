/**
 * Shared flatten / normalize utilities for design-token tooling.
 *
 * Extracted from detect-token-drift.mjs and figma-sync.mjs so that
 * multiple scripts (drift detection, round-trip sync, build pipeline)
 * can share one canonical implementation.
 */

import { createHash } from 'node:crypto';

/* ------------------------------------------------------------------ */
/*  Flatten helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Flatten Figma raw tokens (format: { value: "..." }) into dot-path → value map.
 * Only leaf nodes that carry a `value` property are collected.
 */
export function flattenFigmaRaw(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && 'value' in value) {
      // Leaf token in Figma format
      result[path] = normalizeValue(value.value);
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenFigmaRaw(value, path));
    }
  }
  return result;
}

/**
 * Flatten DTCG tokens ($value/$type format) into dot-path → value map.
 */
export function flattenDtcg(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && '$value' in value) {
      result[path] = normalizeValue(value.$value);
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenDtcg(value, path));
    }
  }
  return result;
}

/**
 * Flatten a plain JS/TS token object (e.g. `{ color: { brand: '#fff' } }`)
 * into dot-path → normalized-value map.
 *
 * Accepts either a single object or an array of objects (multiple modules).
 * Primitive leaves (string | number | boolean) are collected; objects recurse.
 */
export function flattenTsTokens(modules, prefix = '') {
  const items = Array.isArray(modules) ? modules : [modules];
  const result = {};

  for (const obj of items) {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        result[path] = normalizeValue(value);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenTsTokens(value, path));
      } else {
        result[path] = normalizeValue(value);
      }
    }
  }

  return result;
}

/**
 * Normalize values for comparison — stringify objects/arrays, lowercase strings.
 */
export function normalizeValue(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).toLowerCase().trim();
}

/* ------------------------------------------------------------------ */
/*  Map Figma raw keys → DTCG keys                                    */
/* ------------------------------------------------------------------ */

/**
 * The Figma raw section uses a different namespace structure than DTCG.
 * This builds a best-effort mapping from figma raw flat keys to DTCG flat keys.
 *
 * Figma raw:  color.brand.primary.500 → DTCG: color.primary.500
 * Figma raw:  radius.sm              → DTCG: radius.sm
 * Figma raw:  space.1                → DTCG: spacing.1
 * etc.
 */
export function buildKeyMap(figmaKeys, dtcgKeys) {
  const dtcgSet = new Set(dtcgKeys);
  const map = new Map();

  for (const fk of figmaKeys) {
    // Direct match
    if (dtcgSet.has(fk)) {
      map.set(fk, fk);
      continue;
    }

    // Try common renames (Figma namespace → DTCG namespace)
    const candidates = [
      fk,
      /* Color namespace renames */
      fk.replace(/^color\.brand\./, 'color.'),
      fk.replace(/^color\.neutral\./, 'color.gray.'),
      fk.replace(/^color\.info\./, 'color.blue.'),
      fk.replace(/^color\.success\./, 'color.green.'),
      fk.replace(/^color\.warning\./, 'color.amber.'),
      fk.replace(/^color\.danger\./, 'color.red.'),
      /* Special color aliases */
      ...(fk === 'color.neutral.0' ? ['color.white'] : []),
      ...(fk === 'color.black' ? ['color.black'] : []),
      /* Space/Spacing namespace (Figma uses dot for fractions: 0.5, DTCG uses dash: 0-5) */
      fk.replace(/^space\./, 'spacing.'),
      fk.replace(/^space\.(\d+)\.(\d+)$/, 'spacing.$1-$2'),
      /* Shadow/Elevation namespace */
      fk.replace(/^shadow\./, 'elevation.'),
      /* Typography namespace renames */
      fk.replace(/^typography\.font\.family\./, 'typography.fontFamily.'),
      fk.replace(/^typography\.font\.size\./, 'typography.fontSize.'),
      fk.replace(/^typography\.font\.weight\./, 'typography.fontWeight.'),
      fk.replace(/^typography\./, 'typography.'),
      /* Motion namespace */
      fk.replace(/^motion\.easing\./, 'motion.easing.'),
      fk.replace(/^motion\.duration\./, 'motion.duration.'),
      /* Motion name aliases */
      ...(fk === 'motion.easing.standard' ? ['motion.easing.default'] : []),
      ...(fk === 'motion.easing.enter' ? ['motion.easing.in'] : []),
      ...(fk === 'motion.easing.exit' ? ['motion.easing.out'] : []),
      ...(fk === 'motion.duration.medium' ? ['motion.duration.normal'] : []),
      /* Typography aliases */
      ...(fk === 'typography.font.family.base'
        ? ['typography.fontFamily.base', 'typography.fontFamily.sans']
        : []),
      ...(fk === 'typography.font.family.sans' ? ['typography.fontFamily.sans'] : []),
      ...(fk === 'typography.font.family.mono' ? ['typography.fontFamily.mono'] : []),
    ];

    let matched = false;
    for (const candidate of candidates) {
      if (dtcgSet.has(candidate)) {
        map.set(fk, candidate);
        matched = true;
        break;
      }
    }

    if (!matched) {
      map.set(fk, null); // not found in DTCG
    }
  }

  return map;
}

/* ------------------------------------------------------------------ */
/*  Color conversion helpers                                           */
/* ------------------------------------------------------------------ */

/**
 * Convert a hex string (#RRGGBB or #RRGGBBAA) to Figma's {r,g,b,a} format
 * where each channel is 0-1.
 */
export function hexToFigmaColor(hex) {
  const clean = hex.replace(/^#/, '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const a = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/**
 * Convert Figma's {r,g,b,a} color (0-1 per channel) to #hex string.
 * Returns rgba() notation when alpha < 1.
 */
export function figmaColorToHex(color) {
  if (!color || typeof color !== 'object') return color;
  const { r, g, b, a } = color;
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  if (a !== undefined && a < 1) {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a.toFixed(2)})`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* ------------------------------------------------------------------ */
/*  Hashing                                                            */
/* ------------------------------------------------------------------ */

/**
 * Deterministic SHA-256 hash of a token value (for sync-state tracking).
 * Accepts any JSON-serialisable value.
 */
export function hashValue(val) {
  const str = typeof val === 'string' ? val : JSON.stringify(val);
  return createHash('sha256').update(str).digest('hex');
}

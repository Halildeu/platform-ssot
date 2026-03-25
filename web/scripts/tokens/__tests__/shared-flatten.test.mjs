import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  flattenFigmaRaw,
  flattenDtcg,
  flattenTsTokens,
  normalizeValue,
  buildKeyMap,
  hexToFigmaColor,
  figmaColorToHex,
  hashValue,
} from '../shared-flatten.mjs';

/* ------------------------------------------------------------------ */
/*  flattenFigmaRaw                                                    */
/* ------------------------------------------------------------------ */

describe('flattenFigmaRaw', () => {
  it('flattens a nested Figma raw token tree', () => {
    const input = {
      color: {
        brand: {
          primary: { value: '#ff0000' },
          secondary: { value: '#00ff00' },
        },
      },
    };
    const result = flattenFigmaRaw(input);
    assert.equal(result['color.brand.primary'], '#ff0000');
    assert.equal(result['color.brand.secondary'], '#00ff00');
  });

  it('skips non-leaf objects without value property', () => {
    const input = {
      group: {
        nested: { value: '8px' },
      },
    };
    const result = flattenFigmaRaw(input);
    assert.equal(Object.keys(result).length, 1);
    assert.equal(result['group.nested'], '8px');
  });

  it('normalizes leaf values', () => {
    const input = { token: { value: '  #AABBCC  ' } };
    const result = flattenFigmaRaw(input);
    assert.equal(result['token'], '#aabbcc');
  });
});

/* ------------------------------------------------------------------ */
/*  flattenDtcg                                                        */
/* ------------------------------------------------------------------ */

describe('flattenDtcg', () => {
  it('flattens DTCG $value tokens', () => {
    const input = {
      color: {
        primary: { $value: '#111', $type: 'color' },
        gray: {
          100: { $value: '#eee', $type: 'color' },
        },
      },
    };
    const result = flattenDtcg(input);
    assert.equal(result['color.primary'], '#111');
    assert.equal(result['color.gray.100'], '#eee');
  });

  it('ignores $-prefixed top-level keys', () => {
    const input = {
      $description: 'Color tokens',
      red: { $value: '#f00', $type: 'color' },
    };
    const result = flattenDtcg(input);
    assert.equal(result['red'], '#f00');
    assert.equal(result['$description'], undefined);
  });
});

/* ------------------------------------------------------------------ */
/*  flattenTsTokens                                                    */
/* ------------------------------------------------------------------ */

describe('flattenTsTokens', () => {
  it('flattens a simple nested object', () => {
    const input = { spacing: { sm: '4px', md: '8px' } };
    const result = flattenTsTokens(input);
    assert.equal(result['spacing.sm'], '4px');
    assert.equal(result['spacing.md'], '8px');
  });

  it('accepts an array of modules and merges them', () => {
    const a = { color: { red: '#f00' } };
    const b = { spacing: { sm: '4px' } };
    const result = flattenTsTokens([a, b]);
    assert.equal(result['color.red'], '#f00');
    assert.equal(result['spacing.sm'], '4px');
  });

  it('normalizes primitive values', () => {
    const input = { num: 42, flag: true };
    const result = flattenTsTokens(input);
    assert.equal(result['num'], '42');
    assert.equal(result['flag'], 'true');
  });

  it('handles null and undefined values', () => {
    const input = { a: null, b: undefined };
    const result = flattenTsTokens(input);
    assert.equal(result['a'], '');
    assert.equal(result['b'], '');
  });
});

/* ------------------------------------------------------------------ */
/*  normalizeValue                                                     */
/* ------------------------------------------------------------------ */

describe('normalizeValue', () => {
  it('lowercases hex strings', () => {
    assert.equal(normalizeValue('#AABBCC'), '#aabbcc');
  });

  it('trims whitespace', () => {
    assert.equal(normalizeValue('  hello  '), 'hello');
  });

  it('returns empty string for null/undefined', () => {
    assert.equal(normalizeValue(null), '');
    assert.equal(normalizeValue(undefined), '');
  });

  it('stringifies objects', () => {
    const obj = { r: 1, g: 0, b: 0 };
    assert.equal(normalizeValue(obj), JSON.stringify(obj));
  });
});

/* ------------------------------------------------------------------ */
/*  buildKeyMap                                                        */
/* ------------------------------------------------------------------ */

describe('buildKeyMap', () => {
  it('maps direct matches', () => {
    const figma = ['color.red'];
    const dtcg = ['color.red'];
    const map = buildKeyMap(figma, dtcg);
    assert.equal(map.get('color.red'), 'color.red');
  });

  it('remaps color.brand.* → color.*', () => {
    const figma = ['color.brand.primary.500'];
    const dtcg = ['color.primary.500'];
    const map = buildKeyMap(figma, dtcg);
    assert.equal(map.get('color.brand.primary.500'), 'color.primary.500');
  });

  it('remaps space.* → spacing.*', () => {
    const figma = ['space.4'];
    const dtcg = ['spacing.4'];
    const map = buildKeyMap(figma, dtcg);
    assert.equal(map.get('space.4'), 'spacing.4');
  });

  it('returns null for unmatched keys', () => {
    const figma = ['unknown.token'];
    const dtcg = ['other.token'];
    const map = buildKeyMap(figma, dtcg);
    assert.equal(map.get('unknown.token'), null);
  });
});

/* ------------------------------------------------------------------ */
/*  hexToFigmaColor + figmaColorToHex round-trip                       */
/* ------------------------------------------------------------------ */

describe('hexToFigmaColor', () => {
  it('converts #RRGGBB to {r,g,b,a} with a=1', () => {
    const c = hexToFigmaColor('#ff0000');
    assert.ok(Math.abs(c.r - 1) < 0.01);
    assert.ok(Math.abs(c.g - 0) < 0.01);
    assert.ok(Math.abs(c.b - 0) < 0.01);
    assert.equal(c.a, 1);
  });

  it('handles 8-digit hex with alpha', () => {
    const c = hexToFigmaColor('#ff000080');
    assert.ok(Math.abs(c.a - 0.502) < 0.01);
  });
});

describe('figmaColorToHex', () => {
  it('converts {r,g,b,a=1} to #hex', () => {
    assert.equal(figmaColorToHex({ r: 1, g: 0, b: 0, a: 1 }), '#ff0000');
  });

  it('returns rgba() when alpha < 1', () => {
    const result = figmaColorToHex({ r: 1, g: 0, b: 0, a: 0.5 });
    assert.ok(result.startsWith('rgba('));
  });

  it('returns input for non-object', () => {
    assert.equal(figmaColorToHex(null), null);
    assert.equal(figmaColorToHex('hello'), 'hello');
  });
});

describe('hex round-trip', () => {
  it('hex → figma → hex preserves value for opaque colors', () => {
    const original = '#1a2b3c';
    const figma = hexToFigmaColor(original);
    const back = figmaColorToHex(figma);
    assert.equal(back, original);
  });
});

/* ------------------------------------------------------------------ */
/*  hashValue                                                          */
/* ------------------------------------------------------------------ */

describe('hashValue', () => {
  it('produces a 64-char hex string', () => {
    const h = hashValue('test');
    assert.equal(h.length, 64);
    assert.match(h, /^[0-9a-f]{64}$/);
  });

  it('is deterministic', () => {
    assert.equal(hashValue('abc'), hashValue('abc'));
  });

  it('differs for different inputs', () => {
    assert.notEqual(hashValue('a'), hashValue('b'));
  });

  it('handles objects', () => {
    const h = hashValue({ r: 1, g: 0 });
    assert.equal(h.length, 64);
  });
});

/**
 * Contract Tests: Collaboration — State, Export, Sharing, Annotations
 *
 * @see contract P7 DoD
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serializeState, deserializeState } from '../collaboration/dashboard-state';
import type { DashboardState } from '../collaboration/dashboard-state';
import { createShareUrl, parseShareUrl } from '../collaboration/dashboard-sharing';

/* ================================================================== */
/*  Dashboard State Serialization                                      */
/* ================================================================== */

describe('serializeState / deserializeState', () => {
  const state: DashboardState = {
    filters: { department: 'IT', year: 2026 },
    zoom: { start: 10, end: 90 },
    timeRange: '90d',
  };

  it('round-trips state correctly', () => {
    const encoded = serializeState(state);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
    const decoded = deserializeState(encoded);
    expect(decoded).toEqual(state);
  });

  it('handles empty state', () => {
    const empty: DashboardState = { filters: {} };
    const decoded = deserializeState(serializeState(empty));
    expect(decoded).toEqual(empty);
  });

  it('returns null for invalid input', () => {
    expect(deserializeState('not-base64!!!')).toBeNull();
    expect(deserializeState('')).toBeNull();
  });
});

/* ================================================================== */
/*  Dashboard Sharing                                                  */
/* ================================================================== */

describe('createShareUrl / parseShareUrl', () => {
  const state: DashboardState = { filters: { dept: 'HR' }, timeRange: '30d' };

  it('creates URL with encoded state', () => {
    const url = createShareUrl(state, { baseUrl: 'https://app.test/dashboard' });
    expect(url).toContain('https://app.test/dashboard');
    expect(url).toContain('share=');
  });

  it('round-trips via create + parse', () => {
    const url = createShareUrl(state, { baseUrl: 'https://app.test/d' });
    const parsed = parseShareUrl(url);
    expect(parsed).toEqual(state);
  });

  it('returns null for URL without share param', () => {
    expect(parseShareUrl('https://app.test/d')).toBeNull();
  });

  it('custom param name works', () => {
    const url = createShareUrl(state, { baseUrl: 'https://app.test', paramName: 'q' });
    expect(url).toContain('q=');
    const parsed = parseShareUrl(url, { paramName: 'q' });
    expect(parsed).toEqual(state);
  });
});

/* ================================================================== */
/*  Chart Annotations (unit — no React render needed)                  */
/* ================================================================== */

describe('Annotation types', () => {
  it('Annotation interface is importable', async () => {
    const mod = await import('../collaboration/chart-annotations');
    expect(mod.useChartAnnotations).toBeDefined();
  });
});

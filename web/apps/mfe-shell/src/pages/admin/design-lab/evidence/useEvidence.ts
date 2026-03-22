/**
 * Hook that reads the evidence registry and provides typed data to panels.
 * In development: reads from .evidence/registry.json via fetch
 * In CI: reads from uploaded artifact
 * Fallback: returns "no data" state
 */

import { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type EvidenceStatus = 'configured' | 'passing' | 'failing' | 'never_run' | 'missing' | 'no_data';

export interface VisualRegressionEvidence {
  provider: 'chromatic' | 'playwright' | 'none';
  workflow_exists: boolean;
  last_run: string | null;
  status: EvidenceStatus;
  stats: {
    pass: number;
    fail: number;
    changed: number;
    new: number;
    skipped: number;
  };
}

export interface SecurityCheckEvidence {
  workflow_exists: boolean;
  status: EvidenceStatus;
}

export interface SecurityEvidence {
  codeql: SecurityCheckEvidence;
  secret_scan: SecurityCheckEvidence;
  trivy: SecurityCheckEvidence;
  sbom: SecurityCheckEvidence;
  guardrails: SecurityCheckEvidence;
  [key: string]: SecurityCheckEvidence;
}

export interface BenchmarksEvidence {
  workflow_exists: boolean;
  last_run: string | null;
  threshold_enforced: boolean;
  results: Record<string, unknown>;
}

export interface CoverageEvidence {
  available: boolean;
  lines: number | null;
  branches: number | null;
  functions: number | null;
  statements: number | null;
}

export interface CompatibilityEvidence {
  workflow_exists: boolean;
  matrix: {
    node: string[];
    react: string[];
  };
}

export interface TestSuiteEvidence {
  files: number;
  tests: number;
  pass: number;
  fail: number;
}

export interface TestsEvidence {
  design_system: TestSuiteEvidence;
  x_suite: TestSuiteEvidence;
  shell: TestSuiteEvidence;
  [key: string]: TestSuiteEvidence;
}

export interface DocsTruthEvidence {
  phantom_imports: number;
  stale_examples: number;
  last_check: string | null;
}

export interface EvidenceRegistry {
  timestamp: string;
  version: string;
  visual_regression: VisualRegressionEvidence;
  security: SecurityEvidence;
  benchmarks: BenchmarksEvidence;
  coverage: CoverageEvidence;
  compatibility: CompatibilityEvidence;
  tests: TestsEvidence;
  docs_truth: DocsTruthEvidence;
}

export type EvidenceState =
  | { status: 'loading' }
  | { status: 'loaded'; data: EvidenceRegistry }
  | { status: 'no_data' };

/* ------------------------------------------------------------------ */
/*  Fallback (no_data) registry                                         */
/* ------------------------------------------------------------------ */

const NO_DATA_CHECK: SecurityCheckEvidence = { workflow_exists: false, status: 'no_data' };
const NO_DATA_SUITE: TestSuiteEvidence = { files: 0, tests: 0, pass: 0, fail: 0 };

export const FALLBACK_REGISTRY: EvidenceRegistry = {
  timestamp: '',
  version: '0.0.0',
  visual_regression: {
    provider: 'none',
    workflow_exists: false,
    last_run: null,
    status: 'no_data',
    stats: { pass: 0, fail: 0, changed: 0, new: 0, skipped: 0 },
  },
  security: {
    codeql: NO_DATA_CHECK,
    secret_scan: NO_DATA_CHECK,
    trivy: NO_DATA_CHECK,
    sbom: NO_DATA_CHECK,
    guardrails: NO_DATA_CHECK,
  },
  benchmarks: {
    workflow_exists: false,
    last_run: null,
    threshold_enforced: false,
    results: {},
  },
  coverage: {
    available: false,
    lines: null,
    branches: null,
    functions: null,
    statements: null,
  },
  compatibility: {
    workflow_exists: false,
    matrix: { node: [], react: [] },
  },
  tests: {
    design_system: NO_DATA_SUITE,
    x_suite: NO_DATA_SUITE,
    shell: NO_DATA_SUITE,
  },
  docs_truth: {
    phantom_imports: 0,
    stale_examples: 0,
    last_check: null,
  },
};

/* ------------------------------------------------------------------ */
/*  Session cache                                                       */
/* ------------------------------------------------------------------ */

let sessionCache: EvidenceRegistry | null = null;

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetches the evidence registry and caches for the session.
 * Returns typed evidence data for use in Design Lab panels.
 */
export function useEvidence(): EvidenceState {
  const [state, setState] = useState<EvidenceState>(
    sessionCache ? { status: 'loaded', data: sessionCache } : { status: 'loading' },
  );
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (sessionCache || fetchedRef.current) return;
    fetchedRef.current = true;

    const paths = [
      '/.evidence/registry.json',
      '/evidence/registry.json',
      './evidence/registry.json',
    ];

    async function tryFetch() {
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data: EvidenceRegistry = await res.json();
            sessionCache = data;
            setState({ status: 'loaded', data });
            return;
          }
        } catch {
          // try next path
        }
      }
      // None worked — no_data
      setState({ status: 'no_data' });
    }

    tryFetch();
  }, []);

  return state;
}

/**
 * Convenience: returns the registry data or the fallback.
 * Panels that just need the data without loading states can use this.
 */
export function useEvidenceData(): EvidenceRegistry {
  const state = useEvidence();
  if (state.status === 'loaded') return state.data;
  return FALLBACK_REGISTRY;
}

/**
 * Check if evidence is available (not fallback).
 */
export function useEvidenceAvailable(): boolean {
  const state = useEvidence();
  return state.status === 'loaded';
}

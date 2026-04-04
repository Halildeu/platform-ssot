/**
 * What-If Analysis — Parameter sliders → computed projections
 *
 * @see contract P8 DoD: "What-if analysis: parameter sliders → computed projections"
 */

import { useState, useCallback, useMemo } from 'react';

export interface WhatIfParameter {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface WhatIfResult {
  /** Current parameter values */
  values: Record<string, number>;
  /** Projected data based on current parameter values */
  projectedData: number[];
  /** Baseline data (unchanged) */
  baselineData: number[];
  /** Difference between projected and baseline */
  delta: number[];
  /** Total impact percentage */
  totalImpactPct: number;
}

/**
 * Hook for what-if scenario analysis.
 *
 * @param baselineData - Original data series
 * @param parameters - Adjustable parameters
 * @param computeFn - Function that computes projected data from parameter values
 */
export function useWhatIfAnalysis(
  baselineData: number[],
  parameters: WhatIfParameter[],
  computeFn: (baseline: number[], values: Record<string, number>) => number[],
) {
  const defaults = useMemo(() => {
    const d: Record<string, number> = {};
    for (const p of parameters) d[p.id] = p.defaultValue;
    return d;
  }, [parameters]);

  const [values, setValues] = useState<Record<string, number>>(defaults);

  const projectedData = useMemo(
    () => computeFn(baselineData, values),
    [baselineData, values, computeFn],
  );

  const delta = useMemo(
    () => baselineData.map((b, i) => (projectedData[i] ?? 0) - b),
    [baselineData, projectedData],
  );

  const totalImpactPct = useMemo(() => {
    const baseSum = baselineData.reduce((a, b) => a + b, 0);
    const projSum = projectedData.reduce((a, b) => a + b, 0);
    return baseSum !== 0 ? ((projSum - baseSum) / Math.abs(baseSum)) * 100 : 0;
  }, [baselineData, projectedData]);

  const setParameter = useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const reset = useCallback(() => setValues(defaults), [defaults]);

  const result: WhatIfResult = {
    values,
    projectedData,
    baselineData,
    delta,
    totalImpactPct,
  };

  return { result, parameters, setParameter, reset };
}

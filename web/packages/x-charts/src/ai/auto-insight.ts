/**
 * Auto-Insight Engine — Anomaly Detection + Trend Identification
 *
 * Pure client-side statistical analysis on chart data arrays.
 * No LLM needed — uses IQR for anomalies, OLS for trends.
 *
 * @see contract P5 DoD: "Auto-insight: anomaly detection", "trend identification"
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Anomaly {
  index: number;
  value: number;
  /** How many IQR away from median */
  zScore: number;
  direction: 'high' | 'low';
}

export interface Trend {
  direction: 'up' | 'down' | 'flat';
  slope: number;
  rSquared: number;
  /** Human-readable summary */
  summary: string;
}

export interface InsightResult {
  anomalies: Anomaly[];
  trend: Trend | null;
  /** Quick text summary of all insights */
  summary: string;
}

/* ------------------------------------------------------------------ */
/*  Anomaly Detection (IQR method)                                     */
/* ------------------------------------------------------------------ */

/**
 * Detect anomalies using the Interquartile Range (IQR) method.
 *
 * Points beyond Q1 - k*IQR or Q3 + k*IQR are flagged.
 *
 * @param data - Numeric values
 * @param sensitivity - IQR multiplier (lower = more sensitive). @default 1.5
 */
export function detectAnomalies(data: number[], sensitivity = 1.5): Anomaly[] {
  if (data.length < 4) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  if (iqr === 0) return []; // No variance

  const lowerBound = q1 - sensitivity * iqr;
  const upperBound = q3 + sensitivity * iqr;
  const median = sorted[Math.floor(sorted.length / 2)];

  const anomalies: Anomaly[] = [];
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v < lowerBound || v > upperBound) {
      anomalies.push({
        index: i,
        value: v,
        zScore: iqr > 0 ? Math.abs(v - median) / iqr : 0,
        direction: v > upperBound ? 'high' : 'low',
      });
    }
  }

  return anomalies;
}

/* ------------------------------------------------------------------ */
/*  Trend Identification (OLS regression)                              */
/* ------------------------------------------------------------------ */

/**
 * Identify the overall trend in a data series using linear regression.
 *
 * @param data - Numeric values (time-ordered)
 * @param flatThreshold - Absolute slope below this = "flat". @default 0.01
 */
export function identifyTrends(data: number[], flatThreshold = 0.01): Trend | null {
  if (data.length < 2) return null;

  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;

  let ssXY = 0;
  let ssXX = 0;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - xMean;
    const dy = data[i] - yMean;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssTot += dy * dy;
  }

  const slope = ssXX === 0 ? 0 : ssXY / ssXX;
  const predicted = x.map((xi) => slope * xi + (yMean - slope * xMean));

  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssRes += (data[i] - predicted[i]) ** 2;
  }
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  const normalizedSlope = yMean !== 0 ? slope / Math.abs(yMean) : slope;
  const direction: Trend['direction'] =
    Math.abs(normalizedSlope) < flatThreshold ? 'flat' : slope > 0 ? 'up' : 'down';

  const pctChange = n > 1 && data[0] !== 0
    ? ((data[n - 1] - data[0]) / Math.abs(data[0])) * 100
    : 0;

  let summary: string;
  if (direction === 'flat') {
    summary = `Veri stabil (R²=${rSquared.toFixed(2)})`;
  } else if (direction === 'up') {
    summary = `Yükselen trend: +${pctChange.toFixed(1)}% değişim (R²=${rSquared.toFixed(2)})`;
  } else {
    summary = `Düşen trend: ${pctChange.toFixed(1)}% değişim (R²=${rSquared.toFixed(2)})`;
  }

  return { direction, slope, rSquared, summary };
}

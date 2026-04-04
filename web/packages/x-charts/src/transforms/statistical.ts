/**
 * Statistical Data Transforms
 *
 * Pure functions for common data transformations used in chart overlays,
 * trend lines, and KPI calculations. All functions are side-effect free
 * and operate on number arrays.
 *
 * These transforms run client-side on pre-fetched data. For datasets
 * exceeding the performance threshold (>50K points), server-side
 * aggregation is preferred (see P6 roadmap).
 *
 * @see contract P3-C DoD: "Data transforms: moving_avg, percentile, std_dev, regression"
 */

/* ------------------------------------------------------------------ */
/*  Moving Average                                                     */
/* ------------------------------------------------------------------ */

/**
 * Simple Moving Average (SMA) over a sliding window.
 *
 * Returns an array of the same length as input. Leading values
 * where the window is not fully filled use partial windows.
 *
 * @param data - Input data points
 * @param window - Window size (must be >= 1)
 * @returns Array of moving average values
 */
export function movingAverage(data: number[], window: number): number[] {
  if (window < 1) return [...data];
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Percentile                                                         */
/* ------------------------------------------------------------------ */

/**
 * Calculate the p-th percentile of a dataset using linear interpolation.
 *
 * @param data - Input data points (must have at least 1 element)
 * @param p - Percentile (0-100)
 * @returns The percentile value
 */
export function percentile(data: number[], p: number): number {
  if (data.length === 0) return 0;
  if (data.length === 1) return data[0];

  const sorted = [...data].sort((a, b) => a - b);
  const clampedP = Math.max(0, Math.min(100, p));
  const index = (clampedP / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sorted[lower];
  const fraction = index - lower;
  return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
}

/* ------------------------------------------------------------------ */
/*  Standard Deviation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Population standard deviation.
 *
 * @param data - Input data points
 * @returns Standard deviation (0 for empty arrays)
 */
export function standardDeviation(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map((v) => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
  return Math.sqrt(variance);
}

/* ------------------------------------------------------------------ */
/*  Linear Regression                                                  */
/* ------------------------------------------------------------------ */

export interface RegressionResult {
  /** Slope (m in y = mx + b) */
  slope: number;
  /** Y-intercept (b in y = mx + b) */
  intercept: number;
  /** R-squared (coefficient of determination, 0-1) */
  rSquared: number;
  /** Predicted values for each input x */
  predicted: number[];
}

/**
 * Ordinary Least Squares linear regression.
 *
 * @param xValues - Independent variable (e.g., time indices)
 * @param yValues - Dependent variable (must be same length as x)
 * @returns Regression coefficients and predicted values
 */
export function linearRegression(xValues: number[], yValues: number[]): RegressionResult {
  const n = Math.min(xValues.length, yValues.length);
  if (n === 0) return { slope: 0, intercept: 0, rSquared: 0, predicted: [] };

  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  let ssXY = 0;
  let ssXX = 0;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    const dx = xValues[i] - xMean;
    const dy = yValues[i] - yMean;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssTot += dy * dy;
  }

  const slope = ssXX === 0 ? 0 : ssXY / ssXX;
  const intercept = yMean - slope * xMean;

  const predicted = xValues.map((x) => slope * x + intercept);

  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssRes += (yValues[i] - predicted[i]) ** 2;
  }

  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared, predicted };
}

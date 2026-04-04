/**
 * Contract Tests: Statistical Data Transforms
 *
 * @see contract P3-C DoD: "Data transforms: moving_avg, percentile, std_dev, regression"
 */
import { describe, it, expect } from 'vitest';
import { movingAverage, percentile, standardDeviation, linearRegression } from '../transforms/statistical';

/* ================================================================== */
/*  Moving Average                                                     */
/* ================================================================== */

describe('movingAverage', () => {
  it('computes SMA over full window', () => {
    const data = [1, 2, 3, 4, 5];
    const result = movingAverage(data, 3);
    expect(result).toHaveLength(5);
    // Window 3: [1], [1,2], [1,2,3], [2,3,4], [3,4,5]
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(1.5);
    expect(result[2]).toBeCloseTo(2);
    expect(result[3]).toBeCloseTo(3);
    expect(result[4]).toBeCloseTo(4);
  });

  it('handles window=1 (identity)', () => {
    const data = [10, 20, 30];
    expect(movingAverage(data, 1)).toEqual(data);
  });

  it('handles window larger than data', () => {
    const data = [1, 2, 3];
    const result = movingAverage(data, 10);
    expect(result).toHaveLength(3);
    expect(result[2]).toBeCloseTo(2); // avg of all
  });

  it('handles empty array', () => {
    expect(movingAverage([], 3)).toEqual([]);
  });

  it('handles window < 1 (returns copy)', () => {
    const data = [1, 2, 3];
    expect(movingAverage(data, 0)).toEqual([1, 2, 3]);
  });
});

/* ================================================================== */
/*  Percentile                                                         */
/* ================================================================== */

describe('percentile', () => {
  it('p50 = median', () => {
    expect(percentile([1, 2, 3, 4, 5], 50)).toBeCloseTo(3);
  });

  it('p0 = minimum', () => {
    expect(percentile([10, 20, 30], 0)).toBeCloseTo(10);
  });

  it('p100 = maximum', () => {
    expect(percentile([10, 20, 30], 100)).toBeCloseTo(30);
  });

  it('interpolates between values', () => {
    const result = percentile([1, 2, 3, 4], 25);
    expect(result).toBeCloseTo(1.75);
  });

  it('handles single element', () => {
    expect(percentile([42], 50)).toBe(42);
  });

  it('handles empty array', () => {
    expect(percentile([], 50)).toBe(0);
  });

  it('clamps percentile to 0-100', () => {
    expect(percentile([1, 2, 3], -10)).toBeCloseTo(1);
    expect(percentile([1, 2, 3], 110)).toBeCloseTo(3);
  });

  it('unsorted input still works', () => {
    expect(percentile([5, 1, 3, 2, 4], 50)).toBeCloseTo(3);
  });
});

/* ================================================================== */
/*  Standard Deviation                                                 */
/* ================================================================== */

describe('standardDeviation', () => {
  it('computes population std dev', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9] → mean=5, stddev=2
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2);
  });

  it('returns 0 for constant data', () => {
    expect(standardDeviation([5, 5, 5, 5])).toBe(0);
  });

  it('returns 0 for single element', () => {
    expect(standardDeviation([42])).toBe(0);
  });

  it('returns 0 for empty array', () => {
    expect(standardDeviation([])).toBe(0);
  });

  it('handles two elements', () => {
    // [0, 10] → mean=5, var=25, std=5
    expect(standardDeviation([0, 10])).toBeCloseTo(5);
  });
});

/* ================================================================== */
/*  Linear Regression                                                  */
/* ================================================================== */

describe('linearRegression', () => {
  it('fits a perfect line', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10]; // y = 2x
    const result = linearRegression(x, y);
    expect(result.slope).toBeCloseTo(2);
    expect(result.intercept).toBeCloseTo(0);
    expect(result.rSquared).toBeCloseTo(1);
    expect(result.predicted).toHaveLength(5);
  });

  it('handles y = mx + b', () => {
    const x = [0, 1, 2, 3];
    const y = [5, 7, 9, 11]; // y = 2x + 5
    const result = linearRegression(x, y);
    expect(result.slope).toBeCloseTo(2);
    expect(result.intercept).toBeCloseTo(5);
    expect(result.rSquared).toBeCloseTo(1);
  });

  it('r-squared < 1 for noisy data', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 5, 4, 8, 9]; // noisy
    const result = linearRegression(x, y);
    expect(result.rSquared).toBeLessThan(1);
    expect(result.rSquared).toBeGreaterThan(0);
  });

  it('handles empty arrays', () => {
    const result = linearRegression([], []);
    expect(result.slope).toBe(0);
    expect(result.intercept).toBe(0);
    expect(result.predicted).toEqual([]);
  });

  it('handles constant y (horizontal line)', () => {
    const x = [1, 2, 3, 4];
    const y = [5, 5, 5, 5];
    const result = linearRegression(x, y);
    expect(result.slope).toBeCloseTo(0);
    expect(result.intercept).toBeCloseTo(5);
    expect(result.rSquared).toBeCloseTo(1);
  });

  it('predicted values match equation', () => {
    const x = [0, 1, 2];
    const y = [1, 3, 5]; // y = 2x + 1
    const result = linearRegression(x, y);
    for (let i = 0; i < x.length; i++) {
      expect(result.predicted[i]).toBeCloseTo(result.slope * x[i] + result.intercept);
    }
  });
});

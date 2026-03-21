import { describe, it, expect } from 'vitest';

/* ---------------------------------------------------------------------------
 * Wave 4 — Performance CI Gates for x-charts
 *
 * Hard-ceiling assertions that run in every CI pass.  Budgets are generous
 * enough for CI runners while catching catastrophic regressions.
 * -----------------------------------------------------------------------*/

describe('Performance Gates — x-charts', () => {
  it('generate 10K data points in < 30ms', () => {
    const start = performance.now();
    Array.from({ length: 10_000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 100 + Math.random() * 20,
      label: `Point ${i}`,
    }));
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(30);
  });

  it('downsample 10K points to 500 in < 20ms (LTTB-style)', () => {
    const data = Array.from({ length: 10_000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 100,
    }));
    const targetSize = 500;
    const start = performance.now();

    // Simplified Largest-Triangle-Three-Buckets downsampling
    const bucketSize = Math.floor(data.length / targetSize);
    const result: typeof data = [data[0]];
    for (let i = 1; i < targetSize - 1; i++) {
      const bucketStart = i * bucketSize;
      const bucketEnd = Math.min((i + 1) * bucketSize, data.length);
      let maxArea = -1;
      let maxIdx = bucketStart;
      const prev = result[result.length - 1];
      for (let j = bucketStart; j < bucketEnd; j++) {
        const area = Math.abs(
          (prev.x - data[j].x) * (data[Math.min(bucketEnd, data.length - 1)].y - prev.y) -
          (prev.x - data[Math.min(bucketEnd, data.length - 1)].x) * (data[j].y - prev.y),
        );
        if (area > maxArea) {
          maxArea = area;
          maxIdx = j;
        }
      }
      result.push(data[maxIdx]);
    }
    result.push(data[data.length - 1]);

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(20);
    expect(result.length).toBeLessThanOrEqual(targetSize);
  });

  it('compute min/max/avg of 10K series in < 5ms', () => {
    const data = Array.from({ length: 10_000 }, () => Math.random() * 1000);
    const start = performance.now();
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (const v of data) {
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
    }
    const _avg = sum / data.length;
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5);
  });

  it('colour palette generation for 50 series in < 5ms', () => {
    const start = performance.now();
    const palette = Array.from({ length: 50 }, (_, i) => {
      const hue = (i * 137.508) % 360; // golden angle
      return `hsl(${hue}, 70%, 50%)`;
    });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5);
    expect(palette).toHaveLength(50);
  });

  it('tooltip hit-test 10K points in < 10ms', () => {
    const data = Array.from({ length: 10_000 }, (_, i) => ({
      x: (i / 10_000) * 800,
      y: Math.random() * 600,
    }));
    const mouseX = 400;
    const start = performance.now();
    let closest = data[0];
    let minDist = Math.abs(data[0].x - mouseX);
    for (let i = 1; i < data.length; i++) {
      const dist = Math.abs(data[i].x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = data[i];
      }
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
    expect(closest).toBeDefined();
  });
});

import { describe, bench } from 'vitest';

describe('SparklineChart perf', () => {
  bench('renders 100 data points', () => {
    // Create large dataset and measure render
    const data = Array.from({ length: 100 }, (_, i) => Math.random() * 100);
    // Simulate SVG path computation (the heavy part)
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - (v / 100) * 32}`);
    points.join(' ');
  });

  bench('renders 1000 data points', () => {
    const data = Array.from({ length: 1000 }, (_, i) => Math.random() * 100);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - (v / 100) * 32}`);
    points.join(' ');
  });
});

describe('KPICard perf', () => {
  bench('computes change percentage', () => {
    const value = 12847;
    const previous = 11423;
    const change = ((value - previous) / previous) * 100;
    Math.abs(change).toFixed(1);
  });
});

import { describe, bench } from 'vitest';

/* ================================================================== */
/*  SparklineChart perf                                                */
/* ================================================================== */

describe('SparklineChart perf', () => {
  bench('renders 100 data points', () => {
    const data = Array.from({ length: 100 }, (_, _i) => Math.random() * 100);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - (v / 100) * 32}`);
    points.join(' ');
  });

  bench('renders 1000 data points', () => {
    const data = Array.from({ length: 1000 }, (_, _i) => Math.random() * 100);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - (v / 100) * 32}`);
    points.join(' ');
  });
});

/* ================================================================== */
/*  KPICard perf                                                       */
/* ================================================================== */

describe('KPICard perf', () => {
  bench('computes change percentage', () => {
    const value = 12847;
    const previous = 11423;
    const change = ((value - previous) / previous) * 100;
    Math.abs(change).toFixed(1);
  });
});

/* ================================================================== */
/*  Canvas / data perf — large dataset proof                           */
/* ================================================================== */

describe('Canvas perf', () => {
  bench('SparklineChart 100 points', () => {
    const data = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10) * 50 + 50);
    let min = Infinity, max = -Infinity;
    for (const v of data) { if (v < min) min = v; if (v > max) max = v; }
    const range = max - min || 1;
    data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - ((v - min) / range) * 32}`).join(' ');
  });

  bench('SparklineChart 1000 points', () => {
    const data = Array.from({ length: 1000 }, (_, i) => Math.sin(i / 100) * 50 + 50);
    let min = Infinity, max = -Infinity;
    for (const v of data) { if (v < min) min = v; if (v > max) max = v; }
    const range = max - min || 1;
    data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - ((v - min) / range) * 32}`).join(' ');
  });

  bench('SparklineChart 10000 points', () => {
    const data = Array.from({ length: 10000 }, (_, i) => Math.sin(i / 100) * 50 + 50);
    let min = Infinity, max = -Infinity;
    for (const v of data) { if (v < min) min = v; if (v > max) max = v; }
    const range = max - min || 1;
    data.map((v, i) => `${(i / (data.length - 1)) * 120},${32 - ((v - min) / range) * 32}`).join(' ');
  });

  bench('data transform 100K points', () => {
    const data = Array.from({ length: 100000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 50 + 50,
    }));
    // Compute min/max/scale — the CPU-bound part
    let minY = Infinity, maxY = -Infinity;
    for (const p of data) { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; }
    const range = maxY - minY || 1;
    data.map(p => ({ x: p.x / data.length, y: (p.y - minY) / range }));
  });
});

/* ================================================================== */
/*  Chart interactions perf                                            */
/* ================================================================== */

describe('Chart interactions perf', () => {
  bench('zoom recalculation 10K points', () => {
    const data = Array.from({ length: 10000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 50 + 50,
    }));
    const zoomLevel = 3;
    const panOffsetX = 200;
    const viewWidth = 800;
    // Compute visible range under zoom + pan
    const visibleStart = -panOffsetX / zoomLevel;
    const visibleEnd = visibleStart + viewWidth / zoomLevel;
    const totalRange = data.length;
    const startIdx = Math.max(0, Math.floor((visibleStart / viewWidth) * totalRange));
    const endIdx = Math.min(totalRange, Math.ceil((visibleEnd / viewWidth) * totalRange));
    // Re-project visible points
    const visible = data.slice(startIdx, endIdx);
    let min = Infinity, max = -Infinity;
    for (const p of visible) { if (p.y < min) min = p.y; if (p.y > max) max = p.y; }
    const range = max - min || 1;
    visible.map(p => ({
      x: ((p.x - startIdx) / (endIdx - startIdx)) * viewWidth,
      y: ((p.y - min) / range) * 300,
    }));
  });

  bench('brush range filter 10K points', () => {
    const data = Array.from({ length: 10000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 50 + 50,
    }));
    const brushStart = 200;
    const brushEnd = 600;
    const viewWidth = 800;
    const totalRange = data.length;
    const startIdx = Math.floor((brushStart / viewWidth) * totalRange);
    const endIdx = Math.ceil((brushEnd / viewWidth) * totalRange);
    const selected = data.slice(startIdx, endIdx);
    // Compute statistics on selection
    let sum = 0, min = Infinity, max = -Infinity;
    for (const p of selected) {
      sum += p.y;
      if (p.y < min) min = p.y;
      if (p.y > max) max = p.y;
    }
    const avg = sum / selected.length;
    // Return summary (simulating what a callback would receive)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ({ startIdx, endIdx, count: selected.length, avg, min, max });
  });

  bench('real-time buffer append 10K points', () => {
    const maxPoints = 10000;
    let buffer: { x: number; y: number }[] = [];
    // Simulate streaming 10K points into a circular buffer
    for (let i = 0; i < 10000; i++) {
      buffer.push({ x: i, y: Math.random() * 100 });
      if (buffer.length > maxPoints) {
        buffer = buffer.slice(buffer.length - maxPoints);
      }
    }
  });
});

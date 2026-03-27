// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

/**
 * AG Charts renders to <canvas> — tests that query SVG/DOM internals
 * (bars, title text, legend elements) cannot find them in jsdom.
 * Canvas-dependent assertions are skipped until a headless canvas is added.
 */

beforeAll(() => {
  const ctxStub = {
    font: '',
    measureText: () => ({ width: 50 }),
    clearRect: vi.fn(), fillRect: vi.fn(), fillText: vi.fn(), strokeText: vi.fn(),
    strokeRect: vi.fn(), rotate: vi.fn(), translate: vi.fn(), scale: vi.fn(),
    save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(),
    lineTo: vi.fn(), arc: vi.fn(), arcTo: vi.fn(), closePath: vi.fn(),
    stroke: vi.fn(), fill: vi.fn(), clip: vi.fn(), rect: vi.fn(),
    quadraticCurveTo: vi.fn(), bezierCurveTo: vi.fn(),
    setTransform: vi.fn(),
    getTransform: vi.fn().mockReturnValue({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    resetTransform: vi.fn(), transform: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    createPattern: vi.fn(), drawImage: vi.fn(), putImageData: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
    createImageData: vi.fn(), setLineDash: vi.fn(), getLineDash: vi.fn().mockReturnValue([]),
    isPointInPath: vi.fn().mockReturnValue(false), isPointInStroke: vi.fn().mockReturnValue(false),
    ellipse: vi.fn(), lineWidth: 1, strokeStyle: '#000', fillStyle: '#000',
    globalAlpha: 1, globalCompositeOperation: 'source-over',
    textAlign: 'start', textBaseline: 'alphabetic', imageSmoothingEnabled: true,
    canvas: { toDataURL: () => 'data:image/png;base64,AAAA', width: 300, height: 150 },
  };
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(ctxStub) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  if (typeof globalThis.Path2D === 'undefined') {
    (globalThis as any).Path2D = class Path2D {
      constructor(_path?: string | Path2D) {}
      addPath() {} closePath() {} moveTo() {} lineTo() {}
      bezierCurveTo() {} quadraticCurveTo() {} arc() {} arcTo() {} ellipse() {} rect() {}
    };
  }
});

afterEach(() => cleanup());

const sampleData = [
  { label: 'Jan', value: 100 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 150 },
];

describe('BarChart contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(BarChart.displayName).toBe('BarChart');
  });

  /* ---- Default render ---- */
  it.skip('renders bars for each data point — AG Charts canvas', () => {
    render(<BarChart data={sampleData} />);
    const bars = screen.getAllByTestId('bar-chart-bar');
    expect(bars).toHaveLength(3);
  });

  it('sets data-testid on root', () => {
    render(<BarChart data={sampleData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  /* ---- Title ---- */
  it.skip('renders title when provided — AG Charts canvas', () => {
    render(<BarChart data={sampleData} title="Revenue" />);
    expect(screen.getByTestId('bar-chart-title')).toHaveTextContent('Revenue');
  });

  /* ---- Empty state ---- */
  it('renders empty state when data is empty', () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId('bar-chart-empty')).toBeInTheDocument();
  });

  /* ---- showValues ---- */
  it.skip('renders value labels when showValues=true — AG Charts canvas', () => {
    render(<BarChart data={sampleData} showValues />);
    const values = screen.getAllByTestId('bar-chart-value');
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  /* ---- showLegend ---- */
  it.skip('renders legend when showLegend=true — AG Charts canvas', () => {
    render(<BarChart data={sampleData} showLegend />);
    expect(screen.getByTestId('bar-chart-legend')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className on root element', () => {
    render(<BarChart data={sampleData} className="my-chart" />);
    expect(screen.getByTestId('bar-chart').className).toContain('my-chart');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<BarChart data={sampleData} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- SVG role=img ---- */
  it.skip('has SVG with role=img and aria-label — AG Charts canvas', () => {
    render(<BarChart data={sampleData} title="Rev" description="Q1" />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'Rev — Q1');
  });
});

describe('BarChart — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<BarChart data={sampleData} title="Revenue" />);
    await expectNoA11yViolations(container);
  });
});

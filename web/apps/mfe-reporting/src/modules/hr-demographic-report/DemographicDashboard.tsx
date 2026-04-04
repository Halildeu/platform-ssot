import React, { useEffect, useMemo, useState } from 'react';
import { getSummary, getLiveKPIs, getLiveCharts } from './api';
import type { DemographicSummary } from './types';
import {
  PieChart as XPieChart,
  BarChart as XBarChart,
  TreemapChart as XTreemapChart,
  RadarChart as XRadarChart,
} from '@mfe/x-charts';

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------
const SERIES_COLORS = [
  'var(--action-primary)',
  'var(--state-success-text)',
  'var(--state-warning-text)',
  'var(--state-error-text)',
  'var(--accent-primary)',
  'var(--state-info-text)',
  'var(--accent-soft)',
  'var(--state-success-border)',
  'var(--state-warning-border)',
  'var(--accent-focus)',
];

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
const KPICard: React.FC<{
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
}> = ({ label, value, trend, trendLabel = 'gecen aya gore' }) => (
  <div
    style={{
      padding: '16px 20px',
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-default)',
      flex: 1,
      minWidth: 140,
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: 'var(--text-secondary)',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
      {value}
    </div>
    {trend !== undefined && (
      <div
        style={{
          fontSize: 12,
          color:
            trend > 0
              ? 'var(--state-success-text)'
              : trend < 0
                ? 'var(--state-error-text)'
                : 'var(--text-secondary)',
          marginTop: 4,
        }}
      >
        {trend > 0 ? '\u2191' : trend < 0 ? '\u2193' : '\u2192'}{' '}
        {Math.abs(trend)}% {trendLabel}
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Chart Card wrapper
// ---------------------------------------------------------------------------
const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  span?: number;
}> = ({ title, children, span = 1 }) => (
  <div
    style={{
      gridColumn: `span ${span}`,
      padding: 20,
      borderRadius: 12,
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-default)',
    }}
  >
    <h3
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 16,
        margin: 0,
        paddingBottom: 16,
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// SVG Legend
// ---------------------------------------------------------------------------
function Legend({
  items,
}: {
  items: Array<{ label: string; value: number; color: string }>;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {items.map((d, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: d.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Charts — x-charts wrappers (replaced SVG implementations)
// ---------------------------------------------------------------------------

function PieChartLocal({
  data,
  size = 180,
}: {
  data: Array<{ label: string; value: number }>;
  size?: number;
}) {
  if (!data.length || data.every((d) => d.value === 0)) return null;
  return (
    <div>
      <XPieChart data={data} donut showLegend size="sm" />
    </div>
  );
}

function VerticalBarChartLocal({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (!data.length) return null;
  return <XBarChart data={data} size="sm" showValues />;
}

function HorizontalBarChartLocal({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (!data.length) return null;
  return <XBarChart data={data} orientation="horizontal" size="sm" />;
}

function TreemapLocal({ data }: { data: Array<{ label: string; value: number }> }) {
  if (!data.length) return null;
  return <XTreemapChart data={data} size="sm" />;
}

function GaugeLocal({
  value,
  label,
  max = 100,
}: {
  value: number;
  label: string;
  max?: number;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-secondary">{label}</div>
    </div>
  );
}

function RadarLocal({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (!data.length) return null;
  return <XRadarChart data={data} size="sm" />;
}

// Legacy SVG PieChart (preserved for reference, replaced by PieChartLocal above)
function _LegacyPieChart({
  data,
  size = 180,
}: {
  data: Array<{ label: string; value: number }>;
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const innerR = r * 0.55;
  let currentAngle = -Math.PI / 2;

  const colored = data.map((d, i) => ({
    ...d,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));

  return (
    <div>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size, display: 'block', margin: '0 auto' }}
      >
        {colored.map((d, i) => {
          const angle = (d.value / total) * 2 * Math.PI;
          const x1 = cx + r * Math.cos(currentAngle);
          const y1 = cy + r * Math.sin(currentAngle);
          currentAngle += angle;
          const x2 = cx + r * Math.cos(currentAngle);
          const y2 = cy + r * Math.sin(currentAngle);
          const large = angle > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
              fill={d.color}
              stroke="var(--surface-default)"
              strokeWidth="2"
            >
              <title>
                {d.label}: {d.value} ({((d.value / total) * 100).toFixed(1)}%)
              </title>
            </path>
          );
        })}
        {/* Donut hole */}
        <circle cx={cx} cy={cy} r={innerR} fill="var(--surface-default)" />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="var(--text-primary)"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="10"
          fill="var(--text-secondary)"
        >
          Toplam
        </text>
      </svg>
      <Legend items={colored} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vertical Bar Chart
// ---------------------------------------------------------------------------
function _LegacyVerticalBarChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barAreaLeft = 35;
  const barAreaTop = 10;
  const barAreaWidth = 260;
  const barAreaHeight = 150;
  const barWidth = Math.min(32, (barAreaWidth / data.length) * 0.6);
  const gap = (barAreaWidth - barWidth * data.length) / (data.length + 1);
  const svgWidth = barAreaLeft + barAreaWidth + 10;
  const svgHeight = barAreaTop + barAreaHeight + 30;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" style={{ display: 'block' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = barAreaTop + barAreaHeight * (1 - frac);
        return (
          <g key={i}>
            <line
              x1={barAreaLeft}
              y1={y}
              x2={barAreaLeft + barAreaWidth}
              y2={y}
              stroke="var(--border-subtle)"
              strokeWidth="0.5"
            />
            <text
              x={barAreaLeft - 4}
              y={y + 3}
              textAnchor="end"
              fontSize="8"
              fill="var(--text-secondary)"
            >
              {Math.round(maxVal * frac)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * barAreaHeight;
        const x = barAreaLeft + gap + i * (barWidth + gap);
        const y = barAreaTop + barAreaHeight - barH;
        const color = SERIES_COLORS[i % SERIES_COLORS.length];
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={color} opacity={0.85}>
              <title>
                {d.label}: {d.value}
              </title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--text-primary)"
            >
              {d.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={barAreaTop + barAreaHeight + 12}
              textAnchor="middle"
              fontSize="8"
              fill="var(--text-secondary)"
            >
              {d.label.length > 7 ? d.label.slice(0, 6) + '\u2026' : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Horizontal Bar Chart (legacy SVG)
// ---------------------------------------------------------------------------
function _LegacyHorizontalBarChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barHeight = 24;
  const gap = 6;
  const labelWidth = 90;
  const chartWidth = 220;
  const height = data.length * (barHeight + gap) + 4;

  return (
    <svg
      viewBox={`0 0 ${labelWidth + chartWidth + 50} ${height}`}
      width="100%"
      style={{ display: 'block' }}
    >
      {data.map((d, i) => {
        const y = i * (barHeight + gap);
        const w = (d.value / maxVal) * chartWidth;
        const color = SERIES_COLORS[i % SERIES_COLORS.length];
        return (
          <g key={i}>
            <text
              x={labelWidth - 8}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--text-secondary)"
            >
              {d.label.length > 14 ? d.label.slice(0, 13) + '\u2026' : d.label}
            </text>
            <rect x={labelWidth} y={y} width={w} height={barHeight} rx={4} fill={color} opacity={0.85}>
              <title>
                {d.label}: {d.value}
              </title>
            </rect>
            <text
              x={labelWidth + w + 6}
              y={y + barHeight / 2 + 4}
              fontSize="10"
              fontWeight="600"
              fill="var(--text-primary)"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Treemap (legacy SVG)
// ---------------------------------------------------------------------------
function _LegacyTreemap({ data }: { data: Array<{ label: string; value: number }> }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const width = 320;
  const height = 200;

  // Simple squarified-ish layout: split into rows
  const rects: Array<{ x: number; y: number; w: number; h: number; item: typeof sorted[0]; color: string }> = [];
  let remainingItems = [...sorted];
  let currentY = 0;
  let remainingHeight = height;
  let remainingTotal = total;

  while (remainingItems.length > 0) {
    // Take items for this row: fill until row fraction > 0.3 or all remaining
    let rowTotal = 0;
    const rowItems: typeof sorted = [];
    const targetRowFraction = Math.min(0.5, remainingItems.length <= 2 ? 1 : 0.4);

    for (const item of remainingItems) {
      rowItems.push(item);
      rowTotal += item.value;
      if (rowTotal / remainingTotal >= targetRowFraction && remainingItems.length > rowItems.length) break;
    }

    remainingItems = remainingItems.slice(rowItems.length);
    const rowFraction = rowTotal / remainingTotal;
    const rowHeight = Math.max(36, remainingHeight * rowFraction);
    remainingTotal -= rowTotal;
    remainingHeight -= rowHeight;

    let currentX = 0;
    for (let j = 0; j < rowItems.length; j++) {
      const item = rowItems[j];
      const itemFraction = item.value / rowTotal;
      const itemWidth = width * itemFraction;
      rects.push({
        x: currentX,
        y: currentY,
        w: itemWidth,
        h: rowHeight,
        item,
        color: SERIES_COLORS[(rects.length) % SERIES_COLORS.length],
      });
      currentX += itemWidth;
    }
    currentY += rowHeight;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }}>
      {rects.map((r, i) => (
        <g key={i}>
          <rect
            x={r.x + 1}
            y={r.y + 1}
            width={Math.max(0, r.w - 2)}
            height={Math.max(0, r.h - 2)}
            rx={4}
            fill={r.color}
            opacity={0.85}
          >
            <title>
              {r.item.label}: {r.item.value} ({((r.item.value / total) * 100).toFixed(1)}%)
            </title>
          </rect>
          {r.w > 40 && r.h > 28 && (
            <>
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--surface-default)"
              >
                {r.item.label.length > Math.floor(r.w / 7)
                  ? r.item.label.slice(0, Math.floor(r.w / 7) - 1) + '\u2026'
                  : r.item.label}
              </text>
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 10}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.85)"
              >
                {r.item.value} ({Math.round((r.item.value / total) * 100)}%)
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Gauge (legacy SVG semi-circle)
// ---------------------------------------------------------------------------
function _LegacyGauge({
  value,
  target,
  label,
  unit = '%',
}: {
  value: number;
  target: number;
  label: string;
  unit?: string;
}) {
  const cx = 80;
  const cy = 72;
  const r = 55;
  const maxAngle = Math.PI;
  const ratio = Math.min(value / 100, 1);
  const valueAngle = ratio * maxAngle;
  const targetRatio = Math.min(target / 100, 1);

  const color =
    value >= target
      ? 'var(--state-success-text)'
      : value >= target * 0.7
        ? 'var(--state-warning-text)'
        : 'var(--state-error-text)';

  // Arc path helper
  const arc = (startAngle: number, endAngle: number) => {
    const x1 = cx + r * Math.cos(Math.PI + startAngle);
    const y1 = cy - r * Math.sin(Math.PI + startAngle);
    const x2 = cx + r * Math.cos(Math.PI + endAngle);
    const y2 = cy - r * Math.sin(Math.PI + endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  };

  // Target needle
  const needleAngle = Math.PI + targetRatio * maxAngle;
  const needleX = cx + (r + 6) * Math.cos(needleAngle);
  const needleY = cy - (r + 6) * Math.sin(needleAngle);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <svg viewBox="0 0 160 90" width="100%" style={{ maxWidth: 160, display: 'block', margin: '0 auto' }}>
        {/* Background arc */}
        <path d={arc(0, maxAngle)} fill="none" stroke="var(--surface-muted)" strokeWidth="10" strokeLinecap="round" />
        {/* Value arc */}
        {valueAngle > 0.01 && (
          <path d={arc(0, valueAngle)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        )}
        {/* Target marker */}
        <circle cx={needleX} cy={needleY} r="3" fill="var(--text-primary)" />
        {/* Value text */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text-primary)">
          {value}
          <tspan fontSize="10" fill="var(--text-secondary)">{unit}</tspan>
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fill="var(--text-secondary)">
          Hedef: {target}{unit}
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stacked Horizontal Bar
// ---------------------------------------------------------------------------
function StackedBar({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const barHeight = 32;
  const height = barHeight + 40;
  const width = 320;

  const colored = data.map((d, i) => ({
    ...d,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));

  let currentX = 0;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }}>
        {colored.map((d, i) => {
          const segW = (d.value / total) * width;
          const x = currentX;
          currentX += segW;
          return (
            <rect
              key={i}
              x={x}
              y={0}
              width={segW}
              height={barHeight}
              rx={i === 0 ? 4 : 0}
              fill={d.color}
              opacity={0.85}
            >
              <title>
                {d.label}: {d.value} ({((d.value / total) * 100).toFixed(1)}%)
              </title>
            </rect>
          );
        })}
        {/* Percentage labels */}
        {(() => {
          let labelX = 0;
          return colored.map((d, i) => {
            const segW = (d.value / total) * width;
            const cx = labelX + segW / 2;
            labelX += segW;
            if (segW < 25) return null;
            return (
              <text
                key={`lbl-${i}`}
                x={cx}
                y={barHeight / 2 + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--surface-default)"
              >
                {Math.round((d.value / total) * 100)}%
              </text>
            );
          });
        })()}
      </svg>
      <Legend items={colored} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bullet Chart
// ---------------------------------------------------------------------------
function BulletChart({
  label,
  actual,
  target,
  max,
  unit = '%',
}: {
  label: string;
  actual: number;
  target: number;
  max: number;
  unit?: string;
}) {
  const width = 280;
  const barH = 16;
  const height = 40;
  const actualW = Math.min((actual / max) * width, width);
  const targetX = Math.min((target / max) * width, width);

  const color =
    actual >= target
      ? 'var(--state-success-text)'
      : actual >= target * 0.7
        ? 'var(--state-warning-text)'
        : 'var(--state-error-text)';

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {actual}{unit}
          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 4 }}>
            / {target}{unit}
          </span>
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }}>
        {/* Background */}
        <rect x={0} y={8} width={width} height={barH} rx={4} fill="var(--surface-muted)" />
        {/* Actual */}
        <rect x={0} y={8} width={actualW} height={barH} rx={4} fill={color} opacity={0.85} />
        {/* Target line */}
        <line x1={targetX} y1={4} x2={targetX} y2={28} stroke="var(--text-primary)" strokeWidth="2" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------
function ProgressBar({
  label,
  value,
  target,
  unit = '%',
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
}) {
  const percentage = Math.min((value / target) * 100, 100);
  const color =
    value >= target
      ? 'var(--state-success-text)'
      : value >= target * 0.8
        ? 'var(--state-warning-text)'
        : 'var(--state-error-text)';

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
          {value}{unit}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          background: 'var(--surface-muted)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: 4,
            background: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shannon diversity index (normalized 0-100)
// ---------------------------------------------------------------------------
function computeDiversityIndex(dist: Array<{ label: string; value: number }>): number {
  const total = dist.reduce((s, d) => s + d.value, 0);
  if (total === 0) return 0;
  let entropy = 0;
  for (const d of dist) {
    if (d.value > 0) {
      const p = d.value / total;
      entropy -= p * Math.log2(p);
    }
  }
  const maxEntropy = Math.log2(dist.length || 1);
  return maxEntropy > 0 ? Math.round((entropy / maxEntropy) * 100) : 0;
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------
const DashboardSection: React.FC<{
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            color: 'var(--text-secondary)',
            padding: '2px 8px',
          }}
        >
          {open ? 'Grafikleri Gizle \u25B2' : 'Grafikleri Goster \u25BC'}
        </button>
      </div>
      {open && children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Age Pyramid Chart (horizontal bars: male LEFT, female RIGHT)
// ---------------------------------------------------------------------------
function AgePyramidChart({
  data,
}: {
  data: Array<{ ageGroup: string; male: number; female: number }>;
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.male, d.female]), 1);
  const barHeight = 18;
  const gap = 4;
  const centerX = 160;
  const sideWidth = 120;
  const labelWidth = 40;
  const svgWidth = centerX * 2;
  const svgHeight = data.length * (barHeight + gap) + 20;

  return (
    <div>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" style={{ display: 'block' }}>
        {/* Header */}
        <text x={centerX - sideWidth / 2} y={12} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--action-primary)">
          Erkek
        </text>
        <text x={centerX + sideWidth / 2} y={12} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--accent-soft)">
          Kadin
        </text>
        {data.map((d, i) => {
          const y = 18 + i * (barHeight + gap);
          const maleW = (d.male / maxVal) * sideWidth;
          const femaleW = (d.female / maxVal) * sideWidth;
          return (
            <g key={i}>
              {/* Male bar (grows left from center) */}
              <rect
                x={centerX - labelWidth / 2 - maleW}
                y={y}
                width={maleW}
                height={barHeight}
                rx={3}
                fill="var(--action-primary)"
                opacity={0.8}
              >
                <title>Erkek {d.ageGroup}: {d.male}</title>
              </rect>
              {d.male > 0 && (
                <text
                  x={centerX - labelWidth / 2 - maleW - 4}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize="8"
                  fill="var(--text-secondary)"
                >
                  {d.male}
                </text>
              )}
              {/* Age group label */}
              <text
                x={centerX}
                y={y + barHeight / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill="var(--text-primary)"
              >
                {d.ageGroup}
              </text>
              {/* Female bar (grows right from center) */}
              <rect
                x={centerX + labelWidth / 2}
                y={y}
                width={femaleW}
                height={barHeight}
                rx={3}
                fill="var(--accent-soft)"
                opacity={0.8}
              >
                <title>Kadin {d.ageGroup}: {d.female}</title>
              </rect>
              {d.female > 0 && (
                <text
                  x={centerX + labelWidth / 2 + femaleW + 4}
                  y={y + barHeight / 2 + 4}
                  textAnchor="start"
                  fontSize="8"
                  fill="var(--text-secondary)"
                >
                  {d.female}
                </text>
              )}
            </g>
          );
        })}
        {/* Center line */}
        <line
          x1={centerX}
          y1={16}
          x2={centerX}
          y2={svgHeight}
          stroke="var(--border-subtle)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aliases: map old SVG function names → x-charts wrappers
// ---------------------------------------------------------------------------
const PieChart = PieChartLocal;
const VerticalBarChart = VerticalBarChartLocal;
const HorizontalBarChart = HorizontalBarChartLocal;
const Treemap = TreemapLocal;
const Gauge = GaugeLocal;

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: 'span 3', marginTop: 24, marginBottom: 8 }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--border-subtle)',
          paddingBottom: 8,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
const DemographicDashboard: React.FC = () => {
  const summary = useMemo<DemographicSummary>(() => getSummary(), []);
  const diversityIndex = useMemo(
    () => computeDiversityIndex(summary.generationDistribution),
    [summary.generationDistribution],
  );

  // ── Canlı Workcube verisi ──
  const [liveKPIs, setLiveKPIs] = useState<Array<{ id: string; title: string; value: number | null; formattedValue: string; trend?: { direction: string; percentage: number } | null }> | null>(null);
  const [liveCharts, setLiveCharts] = useState<Array<{ id: string; title: string; chartType: string; data: Array<{ label: string; value: number }> }> | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'live' | 'mock'>('loading');

  useEffect(() => {
    let active = true;
    Promise.all([getLiveKPIs(), getLiveCharts()])
      .then(([kpis, charts]) => {
        if (!active) return;
        if (kpis && charts) {
          setLiveKPIs(kpis);
          setLiveCharts(charts);
          setDataSource('live');
        } else {
          setDataSource('mock');
        }
      })
      .catch(() => { if (active) setDataSource('mock'); });
    return () => { active = false; };
  }, []);

  // Helper: canlı chart verisini al, yoksa mock summary'den düş
  const getChartData = (chartId: string): Array<{ label: string; value: number }> | null => {
    if (liveCharts) {
      const chart = liveCharts.find((c) => c.id === chartId);
      if (chart && chart.data && chart.data.length > 0) return chart.data;
    }
    return null;
  };

  // Helper: chart başlığına [MOCK] etiketi ekle — canlı veri yoksa
  const chartTitle = (title: string, chartId?: string): string => {
    if (chartId && getChartData(chartId)) return title;
    if (!chartId) return `${title} [MOCK]`;
    return `${title} [MOCK]`;
  };

  // Helper: canlı KPI değerini al
  const getKPIValue = (kpiId: string): { value: string; trend?: number } | null => {
    if (liveKPIs) {
      const kpi = liveKPIs.find((k) => k.id === kpiId);
      if (kpi) return {
        value: kpi.formattedValue,
        trend: kpi.trend ? (kpi.trend.direction === 'down' ? -kpi.trend.percentage : kpi.trend.percentage) : undefined,
      };
    }
    return null;
  };

  // Trends: canlı veriden veya mock
  const trends = {
    headcount: getKPIValue('headcount')?.trend ?? 2.3,
    genderRatio: getKPIValue('female-ratio')?.trend ?? 1.2,
    avgAge: getKPIValue('avg-age')?.trend ?? -0.4,
    tenure: getKPIValue('avg-tenure')?.trend ?? 0.8,
    turnover: -1.5,
    dei: 3.1,
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Data source indicator */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
        <span style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 4,
          background: dataSource === 'live' ? 'var(--state-success-bg)' : dataSource === 'mock' ? 'var(--state-warning-bg)' : 'var(--surface-muted)',
          color: dataSource === 'live' ? 'var(--state-success-text)' : dataSource === 'mock' ? 'var(--state-warning-text)' : 'var(--text-secondary)',
          fontWeight: 600,
        }}>
          {dataSource === 'live' ? '● Canlı Veri (Workcube SQL)' : dataSource === 'mock' ? '○ Mock Veri' : '◌ Yükleniyor...'}
        </span>
      </div>
      {/* ── KPI Strip ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <KPICard
          label="Toplam Calisan"
          value={getKPIValue('headcount')?.value ?? summary.totalHeadcount}
          trend={trends.headcount}
        />
        <KPICard
          label="Kadin / Erkek"
          value={getKPIValue('female-ratio')?.value ?? `${summary.genderRatio.female}/${summary.genderRatio.male}%`}
          trend={trends.genderRatio}
        />
        <KPICard
          label="Ortalama Yas"
          value={getKPIValue('avg-age')?.value ?? summary.avgAge.toFixed(1)}
          trend={trends.avgAge}
        />
        <KPICard
          label="Ort. Kidem"
          value={getKPIValue('avg-tenure')?.value ? `${getKPIValue('avg-tenure')!.value} yil` : `${summary.avgTenure.toFixed(1)} yil`}
          trend={trends.tenure}
        />
        <KPICard
          label="Devir Hizi"
          value={`${summary.turnoverRate}%`}
          trend={trends.turnover}
        />
        <KPICard
          label="DEI Skoru"
          value={`${summary.deiScore}/100`}
          trend={trends.dei}
        />
      </div>

      <DashboardSection>
        {/* ── ROW 1: Cinsiyet / Yas Grubu / Egitim ────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ChartCard title={chartTitle("Cinsiyet Dagilimi", "gender-distribution")}>
            <PieChart data={getChartData('gender-distribution') ?? summary.genderDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Yas Grubu Dagilimi", "age-distribution")}>
            <VerticalBarChart data={getChartData('age-distribution') ?? summary.ageGroups} />
          </ChartCard>
          <ChartCard title={chartTitle("Egitim Seviyesi", "education-distribution")}>
            <HorizontalBarChart data={getChartData('education-distribution') ?? summary.educationLevels} />
          </ChartCard>
        </div>

        {/* ── ROW 2: Departman / Kidem / Istihdam ─────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ChartCard title={chartTitle("Departman Dagilimi", "dept-headcount")}>
            <Treemap data={getChartData('dept-headcount') ?? summary.departments} />
          </ChartCard>
          <ChartCard title={chartTitle("Kidem Dagilimi", "tenure-distribution")}>
            <VerticalBarChart data={getChartData('tenure-distribution') ?? summary.tenureDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Istihdam Turu", "duty-type")}>
            <PieChart data={getChartData('duty-type') ?? summary.employmentTypes} />
          </ChartCard>
        </div>

        {/* ── ROW 3: DEI Gauges / Nesil / Lokasyon ────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ChartCard title={chartTitle("DEI Gostergeleri", "female-manager-ratio")}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              <Gauge value={(() => {
                const fmData = getChartData('female-manager-ratio');
                if (fmData) {
                  const mgr = fmData.find(d => d.label === 'Yonetici')?.value ?? 0;
                  const total = fmData.reduce((s, d) => s + d.value, 0);
                  return total > 0 ? Math.round((mgr / total) * 100) : 0;
                }
                return summary.femaleManagerRate;
              })()} target={50} label="Kadin Yonetici %" />
              <Gauge
                value={(() => {
                  const disData = getChartData('disability-employment');
                  if (disData) {
                    const disabled = disData.find(d => d.label === 'Engelli')?.value ?? 0;
                    const total = disData.reduce((s, d) => s + d.value, 0);
                    return total > 0 ? Math.round((disabled / total) * 1000) / 10 : 0;
                  }
                  return Math.round(summary.disabilityRate * 10);
                })()}
                target={30}
                label="Engelli Istihdam"
                unit="/100"
              />
              <Gauge value={(() => {
                const genData = getChartData('generation-distribution');
                return genData ? computeDiversityIndex(genData) : diversityIndex;
              })()} target={70} label="Nesil Cesitliligi" unit="/100" />
              <Gauge value={summary.deiScore} target={80} label="Genel DEI" unit="/100" />
            </div>
          </ChartCard>
          <ChartCard title={chartTitle("Nesil Dagilimi", "generation-distribution")}>
            <StackedBar data={getChartData('generation-distribution') ?? summary.generationDistribution} />
            <div style={{ marginTop: 12 }}>
              <HorizontalBarChart data={getChartData('generation-distribution') ?? summary.generationDistribution} />
            </div>
          </ChartCard>
          <ChartCard title={chartTitle("Lokasyon Dagilimi", "location-distribution")}>
            <PieChart data={getChartData('location-distribution') ?? summary.locationDistribution} />
          </ChartCard>
        </div>

        {/* ── ROW 4: Bullet Charts + Etik Uyum ────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <ChartCard title={chartTitle("Yonetici / Calisan Oranlari", "manager-ratio")}>
            <BulletChart
              label="Kadin Yonetici Orani"
              actual={(() => {
                const fmData = getChartData('female-manager-ratio');
                if (fmData) {
                  const mgr = fmData.find(d => d.label === 'Yonetici')?.value ?? 0;
                  const total = fmData.reduce((s, d) => s + d.value, 0);
                  return total > 0 ? Math.round((mgr / total) * 100) : 0;
                }
                return summary.femaleManagerRate;
              })()}
              target={50}
              max={100}
            />
            <BulletChart
              label="Engelli Istihdam Orani"
              actual={(() => {
                const disData = getChartData('disability-employment');
                if (disData) {
                  const disabled = disData.find(d => d.label === 'Engelli')?.value ?? 0;
                  const total = disData.reduce((s, d) => s + d.value, 0);
                  return total > 0 ? Math.round((disabled / total) * 1000) / 10 : 0;
                }
                return summary.disabilityRate;
              })()}
              target={3}
              max={10}
            />
            <BulletChart
              label="Yonetici Orani"
              actual={(() => {
                const mrData = getChartData('manager-ratio');
                if (mrData) {
                  const mgr = mrData.find(d => d.label === 'Yonetici')?.value ?? 0;
                  const total = mrData.reduce((s, d) => s + d.value, 0);
                  return total > 0 ? Math.round((mgr / total) * 1000) / 10 : 0;
                }
                return summary.managerRatio;
              })()}
              target={15}
              max={30}
            />
          </ChartCard>
          <ChartCard title={chartTitle("Etik ve Uyum")}>
            <ProgressBar label="Etik Egitim Tamamlama" value={88} target={95} />
            <ProgressBar label="Veri Gizliligi Uyumu" value={92} target={100} />
            <ProgressBar label="Davranis Kurallari Onayi" value={96} target={100} />
            <ProgressBar label="Anti-Yolsuzluk Belgesi" value={78} target={90} />
          </ChartCard>
        </div>

        {/* ── ROW 5: Medeni Durum / Askerlik / Engel Durumu ────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SectionHeader>Temel Demografik (APQC HC-1)</SectionHeader>
          <ChartCard title={chartTitle("Medeni Durum", "marital-status")}>
            <PieChart data={getChartData('marital-status') ?? summary.maritalStatusDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Askerlik Durumu (Erkek)", "military-status")}>
            <VerticalBarChart data={getChartData('military-status') ?? summary.militaryStatusDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Engel Durumu", "disability-distribution")}>
            <PieChart data={getChartData('disability-distribution') ?? summary.disabilityDistribution} />
          </ChartCard>
        </div>

        {/* ── ROW 6: Lokasyon / Pozisyon Seviyesi / Yas Piramidi ─ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SectionHeader>Organizasyonel (APQC HC-2)</SectionHeader>
          <ChartCard title={chartTitle("Lokasyon Dagilimi", "location-distribution")}>
            <PieChart data={getChartData('location-distribution') ?? summary.locationDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Pozisyon Seviyesi", "position-level")}>
            <VerticalBarChart data={getChartData('position-level') ?? summary.positionLevelDistribution} />
          </ChartCard>
          <ChartCard title={chartTitle("Yas Piramidi (Erkek / Kadin)", "age-pyramid-male")}>
            <AgePyramidChart data={(() => {
              const maleData = getChartData('age-pyramid-male');
              const femaleData = getChartData('age-pyramid-female');
              if (maleData && femaleData) {
                // Merge live data into pyramid format
                const groups = Array.from(new Set([...maleData.map(d => d.label), ...femaleData.map(d => d.label)])).sort();
                return groups.map(g => ({
                  ageGroup: g,
                  male: maleData.find(d => d.label === g)?.value ?? 0,
                  female: femaleData.find(d => d.label === g)?.value ?? 0,
                }));
              }
              return summary.agePyramid;
            })()} />
          </ChartCard>
        </div>

        {/* ── ROW 7: Isgucu Dinamikleri ────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SectionHeader>Isgucu Dinamikleri (APQC HC-4)</SectionHeader>
          <ChartCard title={chartTitle("Devamsizlik & Ise Alim", "new-hires-12m")}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Gauge value={summary.absenteeismRate} target={3} label="Devamsizlik Orani" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>
                  Yeni Ise Alim (12 ay)
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {(() => {
                    const hireData = getChartData('new-hires-12m');
                    if (hireData && hireData.length > 0) return hireData[0].value;
                    return summary.timeToFillDays;
                  })()}
                </div>
              </div>
            </div>
          </ChartCard>
          <ChartCard title={chartTitle("Ic Transfer & Terfi", "internal-transfers")}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>
                  Ic Transfer (Son 1 Yil)
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {(() => {
                    const trData = getChartData('internal-transfers');
                    if (trData && trData.length > 0) return trData[0].value;
                    return Math.round(summary.internalTransferRate);
                  })()}
                </div>
              </div>
              <Gauge value={summary.promotionRate} target={8} label="Terfi Orani" />
            </div>
          </ChartCard>
          <ChartCard title={chartTitle("Ayrilma Oranlari", "turnover-reasons")}>
            {(() => {
              const reasonData = getChartData('turnover-reasons');
              if (reasonData && reasonData.length > 0) {
                return <HorizontalBarChart data={reasonData} />;
              }
              return (
                <>
                  <BulletChart
                    label="Gonullu Ayrilma"
                    actual={summary.voluntaryTurnoverRate}
                    target={8}
                    max={20}
                  />
                  <BulletChart
                    label="Zorunlu Ayrilma"
                    actual={summary.involuntaryTurnoverRate}
                    target={2}
                    max={10}
                  />
                </>
              );
            })()}
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
              Kontrol Araligi: <strong style={{ color: 'var(--text-primary)' }}>{(() => {
                const mrData = getChartData('manager-ratio');
                if (mrData) {
                  const mgr = mrData.find(d => d.label === 'Yonetici')?.value ?? 0;
                  const total = mrData.reduce((s, d) => s + d.value, 0);
                  return mgr > 0 ? Math.round((total / mgr) * 10) / 10 : 0;
                }
                return summary.spanOfControl;
              })()}</strong> calisan/yonetici
            </div>
          </ChartCard>
        </div>

        {/* ── ROW 8: Etik & Uyum (detayli) ─────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SectionHeader>Etik & Uyum</SectionHeader>
          <ChartCard title={chartTitle("Etik Metrikler")}>
            <ProgressBar label="Etik Egitim Tamamlama" value={summary.ethicsTrainingRate} target={95} />
            <ProgressBar label="Veri Gizliligi Uyumu" value={summary.dataPrivacyComplianceRate} target={100} />
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              Ihbar Hatti Basvuru (12 ay):{' '}
              <strong style={{ color: 'var(--text-primary)', fontSize: 18 }}>
                {summary.whistleblowerCases}
              </strong>
            </div>
          </ChartCard>
          <ChartCard title={chartTitle("Disiplin Islemleri")}>
            <VerticalBarChart data={summary.disciplinaryActions} />
          </ChartCard>
          <ChartCard title={chartTitle("Uyum Ozeti")}>
            <BulletChart
              label="Etik Egitim"
              actual={summary.ethicsTrainingRate}
              target={95}
              max={100}
            />
            <BulletChart
              label="Veri Gizliligi"
              actual={summary.dataPrivacyComplianceRate}
              target={100}
              max={100}
            />
          </ChartCard>
        </div>

        {/* ── ROW 9: Maas Esitligi ──────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <SectionHeader>Maas & Esitlik</SectionHeader>
          <ChartCard title={chartTitle("Cinsiyet Maas Karsilastirma", "salary-by-gender")}>
            <HorizontalBarChart data={getChartData('salary-by-gender') ?? summary.avgSalaryByGender} />
          </ChartCard>
          <ChartCard title={chartTitle("Maas Farki", "salary-by-gender")}>
            {(() => {
              const salData = getChartData('salary-by-gender');
              const male = salData?.find(d => d.label === 'Erkek')?.value ?? summary.avgSalaryByGender.find(d => d.label === 'Erkek')?.value ?? 0;
              const female = salData?.find(d => d.label === 'Kadın' || d.label === 'Kadin')?.value ?? summary.avgSalaryByGender.find(d => d.label === 'Kadın')?.value ?? 0;
              const gap = male > 0 ? Math.round(((male - female) / male) * 1000) / 10 : summary.genderPayGapPercent;
              return (
                <>
                  <BulletChart label="Cinsiyet Maas Farki" actual={gap} target={0} max={20} />
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                    Hedef: <strong>%0</strong> fark &mdash; mevcut fark{' '}
                    <strong style={{ color: 'var(--state-warning-text)' }}>%{gap}</strong>
                  </div>
                </>
              );
            })()}
          </ChartCard>
          <ChartCard title={chartTitle("Maas Farki Trendi", "salary-gender-trend")}>
            {(() => {
              const trendData = getChartData('salary-gender-trend');
              // Use live trend data if available, compute pay gap % per year
              const trendPoints: Array<{ label: string; gap: number }> = [];
              if (trendData && trendData.length > 0) {
                for (const row of trendData) {
                  const maleAvg = (row as Record<string, unknown>).male_avg as number | null;
                  const femaleAvg = (row as Record<string, unknown>).female_avg as number | null;
                  if (maleAvg && femaleAvg && maleAvg > 0) {
                    trendPoints.push({ label: row.label, gap: Math.round(((maleAvg - femaleAvg) / maleAvg) * 1000) / 10 });
                  }
                }
              }
              const useMock = trendPoints.length === 0;
              const points = useMock ? [8.2, 7.5, 7.1, 6.8, 6.3, 5.9] : trendPoints.map(p => p.gap);
              const labels = useMock ? ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26'] : trendPoints.map(p => p.label);
              const maxY = Math.max(10, ...points.map(p => Math.ceil(p)));
              const xStart = 40;
              const xEnd = 260;
              const xStep = (xEnd - xStart) / Math.max(points.length - 1, 1);
              const yTop = 10;
              const yBottom = 110;
              const pts = points.map((v, idx) => ({
                x: xStart + idx * xStep,
                y: yTop + ((maxY - v) / maxY) * (yBottom - yTop),
                v,
                label: labels[idx],
              }));
              const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ');
              return (
                <svg viewBox="0 0 280 120" width="100%" style={{ display: 'block' }}>
                  {[0, 30, 60, 90, 120].map((y, i) => (
                    <line key={i} x1={30} y1={y} x2={270} y2={y} stroke="var(--border-subtle)" strokeWidth="0.5" />
                  ))}
                  <polyline points={polyline} fill="none" stroke="var(--state-warning-text)" strokeWidth="2" strokeLinejoin="round" />
                  {pts.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="3" fill="var(--state-warning-text)" />
                      <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--text-primary)">
                        %{p.v}
                      </text>
                      <text x={p.x} y={115} textAnchor="middle" fontSize="7" fill="var(--text-secondary)">
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              );
            })()}
          </ChartCard>
        </div>
      </DashboardSection>
    </div>
  );
};

export default DemographicDashboard;

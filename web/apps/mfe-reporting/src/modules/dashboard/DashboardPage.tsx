import React, { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { ChartCard } from './ChartCard';
import type { ChartResult, ChartDataRow, KpiResult, DrillToDto } from './types';

// Import design-system components
let SmartDashboard: React.ComponentType<any> | null = null;
let BarChart: React.ComponentType<any> | null = null;
let LineChart: React.ComponentType<any> | null = null;
let PieChart: React.ComponentType<any> | null = null;
let AreaChart: React.ComponentType<any> | null = null;

try {
  const ds = require('@mfe/design-system');
  SmartDashboard = ds.SmartDashboard;
  BarChart = ds.BarChart;
  LineChart = ds.LineChart;
  PieChart = ds.PieChart;
  AreaChart = ds.AreaChart;
} catch {
  // design-system not available — will render fallback
}

type DashboardPageProps = {
  dashboardKey: string;
};

const resolveBasePath = (pathname: string): string => {
  if (pathname.startsWith('/admin/reports')) return '/admin/reports';
  return '/reports';
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ dashboardKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = resolveBasePath(location.pathname);
  const { metadata, kpis, charts, loading, error, timeRange, setTimeRange, refresh } =
    useDashboardData(dashboardKey);

  const handleDrillDown = useCallback(
    (drillTo: DrillToDto | null | undefined, dataPoint?: ChartDataRow) => {
      if (!drillTo?.reportKey) return;
      let path = `${basePath}/${drillTo.reportKey}`;
      const params = new URLSearchParams();

      if (drillTo.filters) {
        params.set('advancedFilter', JSON.stringify(drillTo.filters));
      } else if (drillTo.filterColumn && drillTo.filterFromField && dataPoint) {
        const filterValue = dataPoint[drillTo.filterFromField];
        if (filterValue != null) {
          const filter = {
            [drillTo.filterColumn]: {
              filterType: typeof filterValue === 'number' ? 'number' : 'text',
              type: 'equals',
              filter: filterValue,
            },
          };
          params.set('advancedFilter', JSON.stringify(filter));
        }
      }

      const qs = params.toString();
      if (qs) path += `?${qs}`;
      navigate(path);
    },
    [basePath, navigate],
  );

  const widgets = useMemo(() => {
    return kpis.map((kpi) => ({
      key: kpi.id,
      title: kpi.title,
      type: 'kpi' as const,
      value: kpi.formattedValue,
      trend: kpi.trend
        ? { direction: kpi.trend.direction, percentage: kpi.trend.percentage }
        : undefined,
      tone: (kpi.tone as any) || 'default',
      size: 'sm' as const,
      pinned: true,
      content: kpi.benchmark?.value != null ? (
        <div className="mt-1 text-xs text-text-subtle">
          {kpi.benchmark.label}: {formatBenchmark(kpi.benchmark.value, kpi.format)}
        </div>
      ) : undefined,
      onRefresh: undefined,
    }));
  }, [kpis]);

  const chartMap = useMemo(() => {
    const map = new Map<string, ChartResult>();
    for (const c of charts) {
      map.set(c.id, c);
    }
    return map;
  }, [charts]);

  const renderChart = useCallback(
    (chart: ChartResult) => {
      const chartData = chart.data.map((d) => ({
        label: String(d.label ?? ''),
        value: Number(d.value ?? 0),
      }));

      const chartProps: Record<string, unknown> = {
        size: 'lg' as const,
        animate: true,
        ...(chart.chartConfig || {}),
      };

      let chartElement: React.ReactNode = null;

      switch (chart.chartType) {
        case 'bar':
          chartElement = BarChart ? (
            <BarChart data={chartData} {...chartProps} />
          ) : (
            <FallbackChart data={chartData} />
          );
          break;
        case 'line': {
          const labels = chartData.map((d) => d.label);
          const series = [{ name: chart.title, data: chartData.map((d) => d.value) }];
          chartElement = LineChart ? (
            <LineChart labels={labels} series={series} {...chartProps} />
          ) : (
            <FallbackChart data={chartData} />
          );
          break;
        }
        case 'pie':
          chartElement = PieChart ? (
            <PieChart data={chartData} showLegend showPercentage {...chartProps} />
          ) : (
            <FallbackChart data={chartData} />
          );
          break;
        case 'area': {
          const areaLabels = chartData.map((d) => d.label);
          const areaSeries = [{ name: chart.title, data: chartData.map((d) => d.value) }];
          chartElement = AreaChart ? (
            <AreaChart labels={areaLabels} series={areaSeries} gradient {...chartProps} />
          ) : (
            <FallbackChart data={chartData} />
          );
          break;
        }
        default:
          chartElement = <FallbackChart data={chartData} />;
      }

      return (
        <ChartCard
          key={chart.id}
          chart={chart}
          onDrillDown={(c, dp) => handleDrillDown(c.drillTo, dp)}
        >
          {chartElement}
        </ChartCard>
      );
    },
    [handleDrillDown],
  );

  if (error) {
    return (
      <div className="rounded-lg border border-border-subtle bg-surface-primary p-8 text-center">
        <p className="text-sm text-text-subtle">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-2 text-sm text-action-primary-text hover:underline"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (loading && !metadata) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded-xs bg-surface-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!metadata) return null;

  const timeRangeLabels: Record<string, string> = {
    '7d': 'Son 7 Gün',
    '30d': 'Son 30 Gün',
    '90d': 'Son 90 Gün',
    '180d': 'Son 6 Ay',
    '1y': 'Son 1 Yıl',
    'ytd': 'Yıl Başından',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{metadata.title}</h2>
          <p className="text-sm text-text-subtle">{metadata.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-border-subtle bg-surface-primary px-3 py-1.5 text-sm text-text-primary"
          >
            {metadata.timeRanges.map((tr) => (
              <option key={tr} value={tr}>
                {timeRangeLabels[tr] ?? tr}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-md border border-border-subtle px-3 py-1.5 text-sm text-text-primary hover:bg-surface-muted disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {/* KPI Widgets */}
      {SmartDashboard && widgets.length > 0 ? (
        <SmartDashboard
          widgets={widgets}
          columns={3}
          density="compact"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      ) : widgets.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi) => (
            <KpiFallbackCard key={kpi.id} kpi={kpi} onClick={() => handleDrillDown(kpi.drillTo)} />
          ))}
        </div>
      ) : null}

      {/* Chart Sections */}
      {metadata.layout?.sections
        ?.filter((s) => s.type === 'chart-row')
        .map((section, idx) => (
          <div
            key={idx}
            className={`grid gap-4 ${section.ids.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {section.ids.map((chartId) => {
              const chart = chartMap.get(chartId);
              return chart ? renderChart(chart) : null;
            })}
          </div>
        ))}
    </div>
  );
};

const KpiFallbackCard: React.FC<{ kpi: KpiResult; onClick: () => void }> = ({ kpi, onClick }) => {
  const toneColors: Record<string, string> = {
    danger: 'border-l-red-500',
    warning: 'border-l-amber-500',
    success: 'border-l-green-500',
    info: 'border-l-blue-500',
    default: 'border-l-gray-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-border-subtle border-l-4 ${toneColors[kpi.tone] ?? toneColors.default} bg-surface-primary p-3 text-left shadow-xs transition-shadow hover:shadow-md`}
    >
      <div className="text-xs text-text-subtle">{kpi.title}</div>
      <div className="mt-1 text-xl font-bold text-text-primary">{kpi.formattedValue}</div>
      {kpi.trend && (
        <div className={`mt-1 text-xs ${kpi.trend.direction === 'up' ? 'text-state-success-text' : kpi.trend.direction === 'down' ? 'text-state-danger-text' : 'text-text-subtle'}`}>
          {kpi.trend.direction === 'up' ? '↑' : kpi.trend.direction === 'down' ? '↓' : '→'}{' '}
          {kpi.trend.percentage}%
        </div>
      )}
      {kpi.benchmark?.value != null && (
        <div className="mt-1 text-xs text-text-subtle">
          {kpi.benchmark.label}: {formatBenchmark(kpi.benchmark.value, kpi.format)}
        </div>
      )}
    </button>
  );
};

const abbreviateNumber = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
};

const FallbackChart: React.FC<{ data: Array<{ label: string; value: number }> }> = ({ data }) => (
  <div className="flex flex-col gap-1 overflow-hidden">
    {data.slice(0, 10).map((d, i) => (
      <div key={i} className="flex min-w-0 items-center gap-2 text-sm">
        <span className="w-24 shrink-0 truncate text-text-subtle">{d.label}</span>
        <div className="min-w-0 flex-1">
          <div
            className="h-4 rounded-xs bg-action-primary-bg"
            style={{ width: `${Math.min(100, (d.value / Math.max(...data.map((x) => x.value), 1)) * 100)}%` }}
          />
        </div>
        <span className="w-16 shrink-0 truncate text-right text-text-primary" title={String(d.value)}>
          {abbreviateNumber(d.value)}
        </span>
      </div>
    ))}
  </div>
);

function formatBenchmark(value: number, format: string): string {
  if (format === 'percent') return `${(value * 100).toFixed(1)}%`;
  if (format === 'decimal') return value.toFixed(1);
  return String(value);
}

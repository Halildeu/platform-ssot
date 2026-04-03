import React from 'react';
import { getLiveKPIs, getLiveCharts, refreshDashboardData } from './api';
import type { DashboardKPI, DashboardChart, DashboardChartItem, DashboardFilters } from './api';
import { BarChart, PieChart } from '@mfe/design-system';
import type { ChartClickEvent } from '@mfe/design-system';
import { AgGridReact } from 'ag-grid-react';
import { AgCharts } from 'ag-charts-react';
import type { AgChartOptions } from 'ag-charts-community';
import type { ColDef } from 'ag-grid-community';
import type { CrossFilter } from './crossFilterTypes';
import { CHART_FILTER_MAP, KPI_FILTER_MAP, toggleCrossFilter } from './crossFilterTypes';
import ActiveFilterChips from './ActiveFilterChips';
import type { HrCompensationFilters } from './types';

/* ------------------------------------------------------------------ */
/*  Formatters                                                         */
/* ------------------------------------------------------------------ */

const formatCurrency = (v: number | null): string => {
  if (v == null) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(v);
};

const formatPercent = (v: number | null): string => {
  if (v == null) return '-';
  return `%${(v * 100).toFixed(1)}`;
};

const formatNumber = (v: number | null): string => {
  if (v == null) return '-';
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(v);
};

const formatDecimal = (v: number | null): string => {
  if (v == null) return '-';
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(v);
};

const formatValue = (v: number | null, format?: string): string => {
  if (format === 'currency') return formatCurrency(v);
  if (format === 'percent') return formatPercent(v);
  if (format === 'decimal') return formatDecimal(v);
  if (v == null) return '-';
  return formatNumber(v);
};

const chartCurrencyFormatter = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatNumber(value);
};

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const sectionClass = 'mb-6';
const chartRowClass = 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6';
const chartFullClass = 'grid grid-cols-1 gap-4 mb-6';
const cardClass = 'rounded-lg border border-border-subtle bg-surface-default p-4';
const kpiStripClass = 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6';

const toneColors: Record<string, string> = {
  success: 'text-state-success-text',
  warning: 'text-state-warning-text',
  danger: 'text-state-danger-text',
  info: 'text-action-primary',
};

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */

const KPICard: React.FC<{ kpi: DashboardKPI; onClick?: () => void; active?: boolean }> = ({ kpi, onClick, active }) => {
  const toneClass = toneColors[kpi.tone ?? 'info'] ?? 'text-text-primary';
  const trendIcon = kpi.trend?.direction === 'up' ? '\u2191' : kpi.trend?.direction === 'down' ? '\u2193' : '';
  const interactiveClass = onClick ? 'cursor-pointer hover:ring-2 hover:ring-action-primary/40 transition' : '';
  const activeClass = active ? 'ring-2 ring-action-primary' : '';
  return (
    <div
      className={`${cardClass} flex flex-col gap-1 ${interactiveClass} ${activeClass}`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="text-xs text-text-subtle truncate" title={kpi.title}>{kpi.title}</span>
      <span className={`text-lg font-semibold ${toneClass}`}>{formatValue(kpi.value, kpi.format)}</span>
      {kpi.trend && (
        <span className="text-xs text-text-subtle">
          {trendIcon} {kpi.trend.percentage != null ? `${kpi.trend.percentage > 0 ? '+' : ''}${kpi.trend.percentage.toFixed(1)}%` : ''}
        </span>
      )}
      {kpi.benchmark?.label && (
        <span className="text-xs text-text-subtle">{kpi.benchmark.label}: {kpi.benchmark.value != null ? formatValue(kpi.benchmark.value, kpi.format) : 'N/A'}</span>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ChartDataGrid — AG Grid client-mode for chart data                 */
/* ------------------------------------------------------------------ */

interface ChartGridColumn {
  key: string;
  label: string;
  format?: 'currency' | 'percent' | 'number';
}

/** Lightweight AG Grid for chart summary data — no toolbar/variant overhead */
const ChartDataGrid: React.FC<{
  data: DashboardChartItem[];
  columns: ChartGridColumn[];
}> = ({ data, columns }) => {
  if (!data || data.length === 0) return null;

  const colDefs = React.useMemo<ColDef[]>(() =>
    columns.map((col, idx) => ({
      field: col.key,
      headerName: col.label,
      flex: idx === 0 ? 1.5 : 1,
      minWidth: idx === 0 ? 160 : 100,
      sortable: true,
      type: idx > 0 ? 'rightAligned' : undefined,
      valueFormatter: idx > 0 ? (params: { value: unknown }) => {
        const v = params.value;
        if (v == null) return '-';
        const num = typeof v === 'number' ? v : Number(v);
        if (isNaN(num)) return String(v);
        if (col.format === 'currency') return formatCurrency(num);
        if (col.format === 'percent') return formatPercent(num);
        return formatNumber(num);
      } : undefined,
    })),
    [columns],
  );

  return (
    <div className="ag-theme-quartz mt-3" style={{ height: Math.min(data.length * 32 + 42, 260) }}>
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        headerHeight={32}
        rowHeight={32}
        suppressCellFocus
        suppressMovableColumns
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ChartBlock — card with chart + optional AG Grid                    */
/* ------------------------------------------------------------------ */

const ChartBlock: React.FC<{
  chart: DashboardChart | undefined;
  title?: string;
  height?: string;
  children?: React.ReactNode;
  gridColumns?: ChartGridColumn[];
}> = ({ chart, title, height, children, gridColumns }) => {
  const chartTitle = chart?.title ?? title ?? '';
  const data = chart?.data ?? [];
  return (
    <div className={cardClass}>
      <h3 className="text-sm font-medium text-text-primary mb-3">{chartTitle}</h3>
      <div className={`${height ?? 'h-72'} overflow-hidden`}>
        {chart && data.length > 0 ? children : <EmptyState />}
      </div>
      {gridColumns && data.length > 0 && (
        <ChartDataGrid data={data} columns={gridColumns} />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Chart Renderers                                                    */
/* ------------------------------------------------------------------ */

const renderBarChart = (
  data: DashboardChartItem[],
  config?: Record<string, unknown>,
  valueFormatter?: (value: number) => string,
  onDataPointClick?: (event: ChartClickEvent) => void,
) => {
  if (!data.length) return <EmptyState />;
  const orientation = config?.orientation === 'horizontal' ? 'horizontal' as const : 'vertical' as const;
  return (
    <BarChart
      data={data}
      orientation={orientation}
      showValues={Boolean(config?.showValues)}
      valueFormatter={valueFormatter}
      onDataPointClick={onDataPointClick}
    />
  );
};

/** Dual-axis line chart — left axis: currency (Ort. Maaş), right axis: count (Çalışan) */
const DualAxisLineChart: React.FC<{ data: DashboardChartItem[] }> = ({ data }) => {
  const hasDualSeries = data.some((d) => d.value2 != null);

  const options = React.useMemo((): AgChartOptions => {
    const chartData = data.map((d) => ({
      label: d.label,
      salary: d.value,
      count: (d.value2 as number) ?? 0,
    }));

    const series: AgChartOptions['series'] = [
      {
        type: 'line' as const,
        xKey: 'label',
        yKey: 'salary',
        yName: 'Ort. Maaş',
        stroke: '#3b82f6',
        marker: { enabled: true, size: 6, fill: '#3b82f6' },
      },
    ];

    if (hasDualSeries) {
      series.push({
        type: 'bar' as const,
        xKey: 'label',
        yKey: 'count',
        yName: 'Çalışan Sayısı',
        fill: '#f59e0b',
        fillOpacity: 0.6,
      } as any);
    }

    const axes: AgChartOptions['axes'] = [
      {
        type: 'category',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
        keys: ['salary'],
        title: { text: 'Ort. Maaş (₺)' },
        label: { formatter: (p: any) => chartCurrencyFormatter(p.value) },
        gridLine: { enabled: true },
      },
    ];

    if (hasDualSeries) {
      axes.push({
        type: 'number',
        position: 'right',
        keys: ['count'],
        title: { text: 'Çalışan Sayısı' },
        label: { formatter: (p: any) => formatNumber(p.value) },
        gridLine: { enabled: false },
      } as any);
    }

    return {
      data: chartData,
      series,
      axes,
      legend: { enabled: true },
    } as AgChartOptions;
  }, [data, hasDualSeries]);

  return <AgCharts options={options} style={{ height: 320, width: '100%' }} />;
};

const renderPieChart = (
  data: DashboardChartItem[],
  valueFormatter?: (value: number) => string,
  onDataPointClick?: (event: ChartClickEvent) => void,
) => {
  if (!data.length) return <EmptyState />;
  return <PieChart data={data} showLegend valueFormatter={valueFormatter} onDataPointClick={onDataPointClick} />;
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-sm text-text-subtle">
    Veri bulunamadı
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Dashboard Component                                           */
/* ------------------------------------------------------------------ */

interface CompensationDashboardProps {
  filters?: Partial<HrCompensationFilters>;
}

const CompensationDashboard: React.FC<CompensationDashboardProps> = ({ filters: sidebarFilters }) => {
  const [kpis, setKpis] = React.useState<DashboardKPI[]>([]);
  const [charts, setCharts] = React.useState<DashboardChart[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const [crossFilters, setCrossFilters] = React.useState<CrossFilter[]>([]);

  const effectiveFilters = React.useMemo<DashboardFilters>(() => {
    const merged: DashboardFilters = { ...sidebarFilters };
    for (const cf of crossFilters) {
      if (cf.dimension === 'department') merged.department = String(cf.value);
      else if (cf.dimension === 'gender') merged.gender = String(cf.value);
      else if (cf.dimension === 'collarType') merged.collarType = String(cf.value);
      else if (cf.dimension === 'education') merged.education = String(cf.value);
    }
    return merged;
  }, [sidebarFilters, crossFilters]);


  React.useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      Promise.all([getLiveKPIs(effectiveFilters), getLiveCharts(effectiveFilters)])
        .then(([k, c]) => {
          if (active) {
            setKpis(k ?? []);
            setCharts(c ?? []);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, crossFilters.length > 0 || sidebarFilters ? 300 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [effectiveFilters, retryCount]);

  const handleRetry = React.useCallback(() => {
    refreshDashboardData();
    setRetryCount((c) => c + 1);
  }, []);

  const handleChartClick = React.useCallback((chartId: string, event: ChartClickEvent) => {
    const mapping = CHART_FILTER_MAP[chartId];
    if (!mapping) return;
    const label = event.label ?? event.datum?.[mapping.valueField] ?? '';
    if (!label) return;
    setCrossFilters((prev) =>
      toggleCrossFilter(prev, {
        sourceId: `chart:${chartId}`,
        dimension: mapping.dimension,
        value: String(label),
        displayLabel: `${mapping.dimension}: ${label}`,
      }),
    );
  }, []);

  const handleKpiClick = React.useCallback((kpiId: string) => {
    const dimension = KPI_FILTER_MAP[kpiId];
    if (!dimension) return;
    setCrossFilters((prev) =>
      toggleCrossFilter(prev, {
        sourceId: `kpi:${kpiId}`,
        dimension,
        value: kpiId,
        displayLabel: `KPI: ${kpiId}`,
      }),
    );
  }, []);

  const handleRemoveFilter = React.useCallback((filter: CrossFilter) => {
    setCrossFilters((prev) => prev.filter((f) => !(f.dimension === filter.dimension && f.value === filter.value)));
  }, []);

  const handleClearAll = React.useCallback(() => {
    setCrossFilters([]);
  }, []);

  const makeChartClickHandler = React.useCallback(
    (chartId: string) => {
      if (!CHART_FILTER_MAP[chartId]) return undefined;
      return (event: ChartClickEvent) => handleChartClick(chartId, event);
    },
    [handleChartClick],
  );

  const findChart = (id: string) => charts.find((c) => c.id === id);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="h-20 animate-pulse rounded-lg bg-surface-muted" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
      </div>
    );
  }

  const hasData = kpis.length > 0 || charts.length > 0;

  return (
    <div className={sectionClass}>
      {!hasData && (
        <div className="mb-6 rounded-lg border border-state-warning-border bg-state-warning-surface p-4 text-sm text-state-warning-text flex items-center justify-between gap-3">
          <span>Dashboard verileri yüklenemedi. Backend report-service servisinin çalıştığından emin olun.</span>
          <button
            type="button"
            onClick={handleRetry}
            className="shrink-0 rounded-lg bg-action-primary px-3 py-1.5 text-xs font-semibold text-action-primary-text shadow-xs transition hover:opacity-90"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Active Cross-Filter Chips */}
      <ActiveFilterChips filters={crossFilters} onRemove={handleRemoveFilter} onClearAll={handleClearAll} />

      {/* KPI Strip */}
      <div className={kpiStripClass}>
        {kpis.length > 0 ? kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            onClick={KPI_FILTER_MAP[kpi.id] ? () => handleKpiClick(kpi.id) : undefined}
            active={crossFilters.some((f) => f.sourceId === `kpi:${kpi.id}`)}
          />
        )) : (
          <>
            {['Medyan Maaş', 'Compa-Ratio', 'Cinsiyet Farkı', 'İşveren Maliyeti', 'YoY Artış', 'P90/P10', 'Fazla Mesai', 'Gini'].map((label) => (
              <div key={label} className={`${cardClass} flex flex-col gap-1`}>
                <span className="text-xs text-text-subtle">{label}</span>
                <span className="text-lg font-semibold text-text-subtle">—</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Maaş Dağılımı Histogramı */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('salary-histogram')}
          title="Maaş Dağılımı Histogramı"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Bant' },
            { key: 'value', label: 'Kişi Sayısı', format: 'number' },
          ]}
        >
          {renderBarChart(findChart('salary-histogram')?.data ?? [], findChart('salary-histogram')?.chartConfig, undefined, makeChartClickHandler('salary-histogram'))}
        </ChartBlock>
      </div>

      {/* Departman Bazlı Maaş Karşılaştırma */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('dept-salary-comparison')}
          title="Departman Bazlı Maaş Karşılaştırma"
          height="h-96"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-salary-comparison')?.data ?? [], { ...findChart('dept-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter, makeChartClickHandler('dept-salary-comparison'))}
        </ChartBlock>
      </div>

      {/* Cinsiyet + Eğitim */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('gender-salary-comparison')}
          title="Cinsiyet Bazlı Maaş Karşılaştırma"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Erkek Ort.', format: 'currency' },
            { key: 'value2', label: 'Kadın Ort.', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('gender-salary-comparison')?.data ?? [], { ...findChart('gender-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter, makeChartClickHandler('gender-salary-comparison'))}
        </ChartBlock>

        <ChartBlock
          chart={findChart('education-salary-premium')}
          title="Eğitim Seviyesi Primi"
          gridColumns={[
            { key: 'label', label: 'Eğitim' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('education-salary-premium')?.data ?? [], { ...findChart('education-salary-premium')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter, makeChartClickHandler('education-salary-premium'))}
        </ChartBlock>
      </div>

      {/* 12 Aylık Maaş Trendi */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('salary-trend-12m')}
          title="12 Aylık Maaş Trendi"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Ay' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
            { key: 'value2', label: 'Çalışan Sayısı', format: 'number' },
          ]}
        >
          <DualAxisLineChart data={findChart('salary-trend-12m')?.data ?? []} />
        </ChartBlock>
      </div>

      {/* Yaka Tipi + Kıdem */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('collar-type-salary')}
          title="Yaka Tipi Dağılımı"
          gridColumns={[
            { key: 'label', label: 'Yaka Tipi' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
            { key: 'value2', label: 'Kişi Sayısı', format: 'number' },
          ]}
        >
          {renderBarChart(findChart('collar-type-salary')?.data ?? [], findChart('collar-type-salary')?.chartConfig, chartCurrencyFormatter, makeChartClickHandler('collar-type-salary'))}
        </ChartBlock>

        <ChartBlock
          chart={findChart('tenure-salary-relation')}
          title="Kıdem — Maaş İlişkisi"
          gridColumns={[
            { key: 'label', label: 'Kıdem Bandı' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('tenure-salary-relation')?.data ?? [], findChart('tenure-salary-relation')?.chartConfig, chartCurrencyFormatter, makeChartClickHandler('tenure-salary-relation'))}
        </ChartBlock>
      </div>

      {/* Maliyet Yapısı Şelale */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('cost-waterfall')}
          title="Maliyet Yapısı Şelale"
          height="h-96"
          gridColumns={[
            { key: 'label', label: 'Maliyet Kalemi' },
            { key: 'value', label: 'Tutar', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('cost-waterfall')?.data ?? [], { orientation: 'horizontal', showValues: true, showGrid: true }, chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* Şirket Pie + Departman Yüzdelik */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('company-payroll-pie')}
          title="Şirket Bordro Dağılımı"
          height="h-72"
          gridColumns={[
            { key: 'label', label: 'Şirket' },
            { key: 'value', label: 'Toplam Bordro', format: 'currency' },
          ]}
        >
          {renderPieChart(findChart('company-payroll-pie')?.data ?? [], chartCurrencyFormatter, makeChartClickHandler('company-payroll-pie'))}
        </ChartBlock>

        <ChartBlock
          chart={findChart('dept-percentile-radar')}
          title="Departman Yüzdelik Karşılaştırma"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'min_val', label: 'Min', format: 'currency' },
            { key: 'value', label: 'Ort.', format: 'currency' },
            { key: 'max_val', label: 'Max', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-percentile-radar')?.data ?? [], { ...findChart('dept-percentile-radar')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter, makeChartClickHandler('dept-percentile-radar'))}
        </ChartBlock>
      </div>
    </div>
  );
};

export default CompensationDashboard;

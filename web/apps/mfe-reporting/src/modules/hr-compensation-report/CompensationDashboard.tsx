import React from 'react';
import { getLiveKPIs, getLiveCharts } from './api';
import type { DashboardKPI, DashboardChart, DashboardChartItem } from './api';
import { BarChart, LineChart, PieChart, EntityGridTemplate } from '@mfe/design-system';
import type { ColDef } from 'ag-grid-community';

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

const formatValue = (v: number | null, format?: string): string => {
  if (format === 'currency') return formatCurrency(v);
  if (format === 'percent') return formatPercent(v);
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

const KPICard: React.FC<{ kpi: DashboardKPI }> = ({ kpi }) => {
  const toneClass = toneColors[kpi.tone ?? 'info'] ?? 'text-text-primary';
  const trendIcon = kpi.trend?.direction === 'up' ? '\u2191' : kpi.trend?.direction === 'down' ? '\u2193' : '';
  return (
    <div className={`${cardClass} flex flex-col gap-1`}>
      <span className="text-xs text-text-subtle truncate" title={kpi.title}>{kpi.title}</span>
      <span className={`text-lg font-semibold ${toneClass}`}>{kpi.formattedValue || formatValue(kpi.value, kpi.format)}</span>
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

const ChartDataGrid: React.FC<{
  gridId: string;
  data: DashboardChartItem[];
  columns: ChartGridColumn[];
}> = ({ gridId, data, columns }) => {
  if (!data || data.length === 0) return null;

  const colDefs = React.useMemo<ColDef[]>(() =>
    columns.map((col, idx) => ({
      field: col.key,
      headerName: col.label,
      flex: idx === 0 ? 1.5 : 1,
      minWidth: idx === 0 ? 160 : 100,
      sortable: true,
      filter: true,
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
    <div className="mt-3" style={{ height: Math.min(data.length * 42 + 56, 320) }}>
      <EntityGridTemplate
        gridId={gridId}
        gridSchemaVersion={1}
        columnDefs={colDefs}
        dataSourceMode="client"
        rowData={data}
        total={data.length}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ChartBlock — card with chart + optional AG Grid                    */
/* ------------------------------------------------------------------ */

const ChartBlock: React.FC<{
  chart: DashboardChart | undefined;
  gridId: string;
  title?: string;
  height?: string;
  children?: React.ReactNode;
  gridColumns?: ChartGridColumn[];
}> = ({ chart, gridId, title, height, children, gridColumns }) => {
  const chartTitle = chart?.title ?? title ?? '';
  const data = chart?.data ?? [];
  return (
    <div className={cardClass}>
      <h3 className="text-sm font-medium text-text-primary mb-3">{chartTitle}</h3>
      <div className={height ?? 'h-64'}>
        {chart && data.length > 0 ? children : <EmptyState />}
      </div>
      {gridColumns && data.length > 0 && (
        <ChartDataGrid gridId={gridId} data={data} columns={gridColumns} />
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
) => {
  if (!data.length) return <EmptyState />;
  const orientation = config?.orientation === 'horizontal' ? 'horizontal' as const : 'vertical' as const;
  return (
    <BarChart
      data={data}
      orientation={orientation}
      showValues={Boolean(config?.showValues)}
      valueFormatter={valueFormatter}
    />
  );
};

const renderLineChart = (data: DashboardChartItem[], valueFormatter?: (value: number) => string) => {
  if (!data.length) return <EmptyState />;
  const labels = data.map((d) => d.label);
  const series = [{ name: 'Ort. Maaş', data: data.map((d) => d.value) }];
  if (data.some((d) => d.value2 != null)) {
    series.push({ name: 'Çalışan', data: data.map((d) => (d.value2 as number) ?? 0) });
  }
  return <LineChart labels={labels} series={series} showGrid valueFormatter={valueFormatter} />;
};

const renderPieChart = (data: DashboardChartItem[], valueFormatter?: (value: number) => string) => {
  if (!data.length) return <EmptyState />;
  return <PieChart data={data} showLegend valueFormatter={valueFormatter} />;
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-sm text-text-subtle">
    Veri bulunamadı
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Dashboard Component                                           */
/* ------------------------------------------------------------------ */

const CompensationDashboard: React.FC = () => {
  const [kpis, setKpis] = React.useState<DashboardKPI[]>([]);
  const [charts, setCharts] = React.useState<DashboardChart[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getLiveKPIs(), getLiveCharts()])
      .then(([k, c]) => {
        if (active) {
          setKpis(k ?? []);
          setCharts(c ?? []);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

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
        <div className="mb-6 rounded-lg border border-state-warning-border bg-state-warning-surface p-4 text-sm text-state-warning-text">
          Dashboard verileri yüklenemedi. Backend report-service servisinin çalıştığından emin olun.
        </div>
      )}

      {/* KPI Strip */}
      <div className={kpiStripClass}>
        {kpis.length > 0 ? kpis.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />) : (
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
          gridId="dash-salary-histogram"
          title="Maaş Dağılımı Histogramı"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Bant' },
            { key: 'value', label: 'Kişi Sayısı', format: 'number' },
          ]}
        >
          {renderBarChart(findChart('salary-histogram')?.data ?? [], findChart('salary-histogram')?.chartConfig)}
        </ChartBlock>
      </div>

      {/* Departman Bazlı Maaş Karşılaştırma */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('dept-salary-comparison')}
          gridId="dash-dept-salary"
          title="Departman Bazlı Maaş Karşılaştırma"
          height="h-96"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-salary-comparison')?.data ?? [], { ...findChart('dept-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* Cinsiyet + Eğitim */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('gender-salary-comparison')}
          gridId="dash-gender-salary"
          title="Cinsiyet Bazlı Maaş Karşılaştırma"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Erkek Ort.', format: 'currency' },
            { key: 'value2', label: 'Kadın Ort.', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('gender-salary-comparison')?.data ?? [], { ...findChart('gender-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('education-salary-premium')}
          gridId="dash-education-salary"
          title="Eğitim Seviyesi Primi"
          gridColumns={[
            { key: 'label', label: 'Eğitim' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('education-salary-premium')?.data ?? [], { ...findChart('education-salary-premium')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* 12 Aylık Maaş Trendi */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('salary-trend-12m')}
          gridId="dash-salary-trend"
          title="12 Aylık Maaş Trendi"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Ay' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
            { key: 'value2', label: 'Çalışan Sayısı', format: 'number' },
          ]}
        >
          {renderLineChart(findChart('salary-trend-12m')?.data ?? [], chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* Yaka Tipi + Kıdem */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('collar-type-salary')}
          gridId="dash-collar-salary"
          title="Yaka Tipi Dağılımı"
          gridColumns={[
            { key: 'label', label: 'Yaka Tipi' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
            { key: 'value2', label: 'Kişi Sayısı', format: 'number' },
          ]}
        >
          {renderBarChart(findChart('collar-type-salary')?.data ?? [], findChart('collar-type-salary')?.chartConfig, chartCurrencyFormatter)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('tenure-salary-relation')}
          gridId="dash-tenure-salary"
          title="Kıdem — Maaş İlişkisi"
          gridColumns={[
            { key: 'label', label: 'Kıdem Bandı' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('tenure-salary-relation')?.data ?? [], findChart('tenure-salary-relation')?.chartConfig, chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* Maliyet Yapısı Şelale */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('cost-waterfall')}
          gridId="dash-cost-waterfall"
          title="Maliyet Yapısı Şelale"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Maliyet Kalemi' },
            { key: 'value', label: 'Tutar', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('cost-waterfall')?.data ?? [], { showValues: true, showGrid: true }, chartCurrencyFormatter)}
        </ChartBlock>
      </div>

      {/* Şirket Pie + Departman Yüzdelik */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('company-payroll-pie')}
          gridId="dash-company-payroll"
          title="Şirket Bordro Dağılımı"
          gridColumns={[
            { key: 'label', label: 'Şirket' },
            { key: 'value', label: 'Toplam Bordro', format: 'currency' },
          ]}
        >
          {renderPieChart(findChart('company-payroll-pie')?.data ?? [], chartCurrencyFormatter)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('dept-percentile-radar')}
          gridId="dash-dept-percentile"
          title="Departman Yüzdelik Karşılaştırma"
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'min_val', label: 'Min', format: 'currency' },
            { key: 'value', label: 'Ort.', format: 'currency' },
            { key: 'max_val', label: 'Max', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-percentile-radar')?.data ?? [], { ...findChart('dept-percentile-radar')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
        </ChartBlock>
      </div>
    </div>
  );
};

export default CompensationDashboard;

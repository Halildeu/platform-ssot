import React from 'react';
import { getLiveKPIs, getLiveCharts } from './api';
import type { DashboardKPI, DashboardChart, DashboardChartItem } from './api';
import { BarChart, LineChart, PieChart } from '@mfe/design-system';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const sectionClass = 'mb-6';
const chartRowClass = 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6';
const chartFullClass = 'grid grid-cols-1 gap-4 mb-6';
const cardClass = 'rounded-lg border border-border-subtle bg-surface-default p-4';
const kpiStripClass = 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6';

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

const formatDecimal = (v: number | null): string => {
  if (v == null) return '-';
  return v.toFixed(2);
};

const formatNumber = (v: number | null): string => {
  if (v == null) return '-';
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(v);
};

const formatValue = (v: number | null, format?: string): string => {
  if (format === 'currency') return formatCurrency(v);
  if (format === 'percent') return formatPercent(v);
  if (format === 'decimal') return formatDecimal(v);
  if (v == null) return '-';
  return formatNumber(v);
};

/** Chart axis/bar label formatter — compact TRY display */
const chartCurrencyFormatter = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatNumber(value);
};

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
/*  MiniGrid — tabular summary under charts                            */
/* ------------------------------------------------------------------ */

const MiniGrid: React.FC<{ data: DashboardChartItem[]; columns: { key: string; label: string; format?: string }[] }> = ({ data, columns }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-2 py-1.5 font-medium text-text-subtle whitespace-nowrap ${idx === 0 ? 'text-left' : 'text-right'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-border-subtle hover:bg-surface-muted">
              {columns.map((col, colIdx) => {
                const raw = row[col.key];
                const val = typeof raw === 'number'
                  ? (col.format === 'currency' ? formatCurrency(raw) : col.format === 'percent' ? formatPercent(raw) : formatNumber(raw))
                  : (raw ?? '-');
                return (
                  <td
                    key={col.key}
                    className={`px-2 py-1.5 whitespace-nowrap text-text-primary ${colIdx === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {String(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ChartBlock — card with optional height + MiniGrid                  */
/* ------------------------------------------------------------------ */

const ChartBlock: React.FC<{
  chart: DashboardChart | undefined;
  title?: string;
  height?: string;
  children?: React.ReactNode;
  gridColumns?: { key: string; label: string; format?: string }[];
}> = ({ chart, title, height, children, gridColumns }) => {
  const chartTitle = chart?.title ?? title ?? '';
  const data = chart?.data ?? [];
  return (
    <div className={cardClass}>
      <h3 className="text-sm font-medium text-text-primary mb-3">{chartTitle}</h3>
      <div className={height ?? 'h-64'}>
        {chart && data.length > 0 ? children : <EmptyState />}
      </div>
      {gridColumns && data.length > 0 && <MiniGrid data={data} columns={gridColumns} />}
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
        <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  const hasData = kpis.length > 0 || charts.length > 0;

  return (
    <div className={sectionClass}>
      {/* Data Source Warning */}
      {!hasData && (
        <div className="mb-6 rounded-lg border border-state-warning-border bg-state-warning-surface p-4 text-sm text-state-warning-text">
          Dashboard verileri yüklenemedi. Backend report-service servisinin çalıştığından ve <code className="font-mono text-xs">hr-compensation</code> dashboard tanımının yüklendiğinden emin olun.
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
          title="Maaş Dağılımı Histogramı"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Bant' },
            { key: 'value', label: 'Kişi Sayısı' },
          ]}
        >
          {renderBarChart(findChart('salary-histogram')?.data ?? [], findChart('salary-histogram')?.chartConfig)}
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
          {renderBarChart(findChart('dept-salary-comparison')?.data ?? [], { ...findChart('dept-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
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
          {renderBarChart(findChart('gender-salary-comparison')?.data ?? [], { ...findChart('gender-salary-comparison')?.chartConfig, orientation: 'horizontal' }, chartCurrencyFormatter)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('education-salary-premium')}
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
          title="12 Aylık Maaş Trendi"
          height="h-80"
          gridColumns={[
            { key: 'label', label: 'Ay' },
            { key: 'value', label: 'Ort. Maaş', format: 'currency' },
            { key: 'value2', label: 'Çalışan Sayısı' },
          ]}
        >
          {renderLineChart(findChart('salary-trend-12m')?.data ?? [], chartCurrencyFormatter)}
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
            { key: 'value2', label: 'Kişi Sayısı' },
          ]}
        >
          {renderBarChart(findChart('collar-type-salary')?.data ?? [], findChart('collar-type-salary')?.chartConfig, chartCurrencyFormatter)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('tenure-salary-relation')}
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

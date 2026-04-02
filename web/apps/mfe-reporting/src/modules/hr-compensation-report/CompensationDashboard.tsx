import React from 'react';
import { getLiveKPIs, getLiveCharts, refreshDashboardData } from './api';
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

const formatValue = (v: number | null, format?: string): string => {
  if (format === 'currency') return formatCurrency(v);
  if (format === 'percent') return formatPercent(v);
  if (format === 'decimal') return formatDecimal(v);
  if (v == null) return '-';
  return String(v);
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
/*  Chart + Mini Grid Block                                            */
/* ------------------------------------------------------------------ */

const MiniGrid: React.FC<{ data: DashboardChartItem[]; columns: { key: string; label: string; format?: string }[] }> = ({ data, columns }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col) => (
              <th key={col.key} className="px-2 py-1.5 text-left font-medium text-text-subtle whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-border-subtle hover:bg-surface-muted">
              {columns.map((col) => {
                const raw = row[col.key];
                const val = typeof raw === 'number'
                  ? (col.format === 'currency' ? formatCurrency(raw) : col.format === 'percent' ? formatPercent(raw) : raw.toLocaleString('tr-TR'))
                  : (raw ?? '-');
                return (
                  <td key={col.key} className="px-2 py-1.5 whitespace-nowrap text-text-primary">
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

const ChartBlock: React.FC<{
  chart: DashboardChart | undefined;
  children?: React.ReactNode;
  gridColumns?: { key: string; label: string; format?: string }[];
}> = ({ chart, children, gridColumns }) => {
  if (!chart) return null;
  const data = chart.data ?? [];
  return (
    <div className={cardClass}>
      <h3 className="text-sm font-medium text-text-primary mb-3">{chart.title}</h3>
      <div className="h-64">
        {children}
      </div>
      {gridColumns && <MiniGrid data={data} columns={gridColumns} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Chart Renderers                                                    */
/* ------------------------------------------------------------------ */

const renderBarChart = (data: DashboardChartItem[], config?: Record<string, unknown>) => {
  if (!data.length) return <EmptyState />;
  const orientation = config?.orientation === 'horizontal' ? 'horizontal' as const : 'vertical' as const;
  return <BarChart data={data} orientation={orientation} showValues={Boolean(config?.showValues)} />;
};

const renderLineChart = (data: DashboardChartItem[]) => {
  if (!data.length) return <EmptyState />;
  const labels = data.map((d) => d.label);
  const series = [{ name: 'Ort. Maas', data: data.map((d) => d.value) }];
  if (data.some((d) => d.value2 != null)) {
    series.push({ name: 'Calisan', data: data.map((d) => (d.value2 as number) ?? 0) });
  }
  return <LineChart labels={labels} series={series} showGrid />;
};

const renderPieChart = (data: DashboardChartItem[]) => {
  if (!data.length) return <EmptyState />;
  return <PieChart data={data} showLegend />;
};

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-sm text-text-subtle">
    Veri bulunamadi
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
        <div className="h-64 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className={sectionClass}>
      {/* KPI Strip */}
      <div className={kpiStripClass}>
        {kpis.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* Blok 1: Maas Dagilimi Histogrami */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('salary-histogram')}
          gridColumns={[
            { key: 'label', label: 'Bant' },
            { key: 'value', label: 'Kisi Sayisi' },
          ]}
        >
          {renderBarChart(findChart('salary-histogram')?.data ?? [], findChart('salary-histogram')?.chartConfig)}
        </ChartBlock>
      </div>

      {/* Blok 2: Departman Bazli Karsilastirma */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('dept-salary-comparison')}
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Ort. Maas', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-salary-comparison')?.data ?? [], findChart('dept-salary-comparison')?.chartConfig)}
        </ChartBlock>
      </div>

      {/* Blok 3-4: Cinsiyet + Egitim */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('gender-salary-comparison')}
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'value', label: 'Erkek Ort.', format: 'currency' },
            { key: 'value2', label: 'Kadin Ort.', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('gender-salary-comparison')?.data ?? [], findChart('gender-salary-comparison')?.chartConfig)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('education-salary-premium')}
          gridColumns={[
            { key: 'label', label: 'Egitim' },
            { key: 'value', label: 'Ort. Maas', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('education-salary-premium')?.data ?? [], findChart('education-salary-premium')?.chartConfig)}
        </ChartBlock>
      </div>

      {/* Blok 5: 12 Aylik Trend */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('salary-trend-12m')}
          gridColumns={[
            { key: 'label', label: 'Ay' },
            { key: 'value', label: 'Ort. Maas', format: 'currency' },
            { key: 'value2', label: 'Calisan Sayisi' },
          ]}
        >
          {renderLineChart(findChart('salary-trend-12m')?.data ?? [])}
        </ChartBlock>
      </div>

      {/* Blok 6-7: Yaka Tipi + Kidem */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('collar-type-salary')}
          gridColumns={[
            { key: 'label', label: 'Yaka Tipi' },
            { key: 'value', label: 'Ort. Maas', format: 'currency' },
            { key: 'value2', label: 'Kisi Sayisi' },
          ]}
        >
          {renderBarChart(findChart('collar-type-salary')?.data ?? [], findChart('collar-type-salary')?.chartConfig)}
        </ChartBlock>

        <ChartBlock
          chart={findChart('tenure-salary-relation')}
          gridColumns={[
            { key: 'label', label: 'Kidem Bandi' },
            { key: 'value', label: 'Ort. Maas', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('tenure-salary-relation')?.data ?? [], findChart('tenure-salary-relation')?.chartConfig)}
        </ChartBlock>
      </div>

      {/* Blok 8: Maliyet Selale */}
      <div className={chartFullClass}>
        <ChartBlock
          chart={findChart('cost-waterfall')}
          gridColumns={[
            { key: 'label', label: 'Maliyet Kalemi' },
            { key: 'value', label: 'Tutar', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('cost-waterfall')?.data ?? [], { showValues: true, showGrid: true })}
        </ChartBlock>
      </div>

      {/* Blok 9-10: Sirket Pie + Departman */}
      <div className={chartRowClass}>
        <ChartBlock
          chart={findChart('company-payroll-pie')}
          gridColumns={[
            { key: 'label', label: 'Sirket' },
            { key: 'value', label: 'Toplam Bordro', format: 'currency' },
          ]}
        >
          {renderPieChart(findChart('company-payroll-pie')?.data ?? [])}
        </ChartBlock>

        <ChartBlock
          chart={findChart('dept-percentile-radar')}
          gridColumns={[
            { key: 'label', label: 'Departman' },
            { key: 'min_val', label: 'Min', format: 'currency' },
            { key: 'value', label: 'Ort.', format: 'currency' },
            { key: 'max_val', label: 'Max', format: 'currency' },
          ]}
        >
          {renderBarChart(findChart('dept-percentile-radar')?.data ?? [], findChart('dept-percentile-radar')?.chartConfig)}
        </ChartBlock>
      </div>
    </div>
  );
};

export default CompensationDashboard;

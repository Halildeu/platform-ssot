# @corp/x-charts

Composable charting library for dashboards, reports, and inline data visualization. Wraps Recharts with design-system tokens, responsive defaults, and interaction hooks.

## Installation

```bash
pnpm add @corp/x-charts
```

Peer dependencies:

```bash
pnpm add @corp/design-system recharts
```

## Quick Start

```tsx
import { BarChart } from '@corp/x-charts';

const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
];

export function RevenueChart() {
  return (
    <BarChart
      data={data}
      xAxis={{ dataKey: 'month' }}
      series={[{ dataKey: 'revenue', label: 'Revenue', color: 'primary' }]}
      height={300}
    />
  );
}
```

## Dashboard with KPIs

```tsx
import { KPICard, ChartDashboard, LineChart } from '@corp/x-charts';

export function SalesDashboard() {
  return (
    <ChartDashboard columns={3}>
      <KPICard title="Total Revenue" value="$125K" trend={+12.5} />
      <KPICard title="Active Users" value="1,842" trend={-3.1} />
      <KPICard title="Conversion" value="4.2%" trend={+0.8} />
      <LineChart
        data={monthlyData}
        xAxis={{ dataKey: 'month' }}
        series={[{ dataKey: 'sales', label: 'Sales' }]}
        height={250}
      />
    </ChartDashboard>
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `BarChart` | Vertical / horizontal bar charts |
| `LineChart` | Line and area charts |
| `PieChart` | Pie and donut charts |
| `SparklineChart` | Inline mini charts for tables and cards |
| `FunnelChart` | Funnel / conversion charts |
| `WaterfallChart` | Waterfall (bridge) charts |
| `KPICard` | Key performance indicator card with trend |
| `ChartDashboard` | Grid layout for chart + KPI composition |

## Hooks

| Hook | Description |
|------|-------------|
| `useChartInteractions` | Adds zoom, pan, and brush to any chart |
| `useRealTimeData` | Streams data updates into chart state |

## API Reference

Full props documentation: [/api/x-charts](/api/x-charts)

## License

Private -- internal use only.

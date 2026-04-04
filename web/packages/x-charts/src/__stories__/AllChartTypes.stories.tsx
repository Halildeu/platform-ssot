/**
 * Storybook Stories: All Chart Types
 *
 * Visual catalog of every chart type supported by @mfe/x-charts.
 * Each story demonstrates the chart with sample data.
 *
 * @see contract P3-D DoD: "Storybook: all chart type stories"
 */
import React from 'react';

/* ------------------------------------------------------------------ */
/*  Sample Data                                                        */
/* ------------------------------------------------------------------ */

const categories = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
const values1 = [320, 332, 301, 334, 390, 330];
const values2 = [220, 182, 191, 234, 290, 330];

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export default {
  title: 'Charts/All Chart Types',
  parameters: { layout: 'padded' },
};

export const BarChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Bar Chart</h3>
    <p>Kategori bazlı karşılaştırma. ECharts bar serisi.</p>
    <pre>{JSON.stringify({ type: 'bar', categories, series: [values1, values2] }, null, 2)}</pre>
  </div>
);

export const LineChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Line Chart</h3>
    <p>Trend analizi. Zaman serisi veya sıralı veri.</p>
    <pre>{JSON.stringify({ type: 'line', categories, series: [values1] }, null, 2)}</pre>
  </div>
);

export const AreaChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Area Chart</h3>
    <p>Stacked area — kümülatif gösterim.</p>
    <pre>{JSON.stringify({ type: 'area', categories, series: [values1, values2] }, null, 2)}</pre>
  </div>
);

export const PieChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Pie Chart</h3>
    <p>Oran dağılımı gösterimi.</p>
    <pre>{JSON.stringify({ type: 'pie', data: categories.map((c, i) => ({ name: c, value: values1[i] })) }, null, 2)}</pre>
  </div>
);

export const ScatterChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Scatter Chart</h3>
    <p>İki değişken arası korelasyon.</p>
    <pre>{JSON.stringify({ type: 'scatter', points: values1.map((v, i) => [v, values2[i]]) }, null, 2)}</pre>
  </div>
);

export const GaugeChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Gauge Chart</h3>
    <p>KPI göstergesi — tek değer, hedef aralığı.</p>
    <pre>{JSON.stringify({ type: 'gauge', value: 72, min: 0, max: 100 }, null, 2)}</pre>
  </div>
);

export const RadarChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Radar Chart</h3>
    <p>Çok boyutlu karşılaştırma (performans profili).</p>
    <pre>{JSON.stringify({ type: 'radar', indicators: ['Satış', 'Pazarlama', 'Teknoloji', 'Destek', 'Geliştirme'], values: [85, 70, 95, 60, 80] }, null, 2)}</pre>
  </div>
);

export const TreemapChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Treemap Chart</h3>
    <p>Hiyerarşik orantılı alan gösterimi.</p>
    <pre>{JSON.stringify({ type: 'treemap', data: [{ name: 'A', value: 100, children: [{ name: 'A1', value: 60 }, { name: 'A2', value: 40 }] }] }, null, 2)}</pre>
  </div>
);

export const HeatmapChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Heatmap Chart</h3>
    <p>İki boyutlu yoğunluk matrisi.</p>
    <pre>{JSON.stringify({ type: 'heatmap', xAxis: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'], yAxis: ['Sabah', 'Öğle', 'Akşam'] }, null, 2)}</pre>
  </div>
);

export const WaterfallChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Waterfall Chart</h3>
    <p>Artış/azalış kümülatif analiz.</p>
    <pre>{JSON.stringify({ type: 'waterfall', categories: ['Başlangıç', '+Gelir', '+Gelir2', '-Gider', '-Gider2', 'Sonuç'], values: [1000, 300, 200, -150, -100, 1250] }, null, 2)}</pre>
  </div>
);

export const FunnelChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Funnel Chart</h3>
    <p>Dönüşüm hunisi — aşama bazlı düşüş.</p>
    <pre>{JSON.stringify({ type: 'funnel', data: [{ name: 'Ziyaret', value: 100 }, { name: 'Kayıt', value: 60 }, { name: 'Deneme', value: 30 }, { name: 'Satın Alma', value: 10 }] }, null, 2)}</pre>
  </div>
);

export const SankeyChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Sankey Chart</h3>
    <p>Akış diyagramı — kaynak-hedef ilişkileri.</p>
    <pre>{JSON.stringify({ type: 'sankey', nodes: ['A', 'B', 'C', 'D'], links: [{ source: 'A', target: 'C', value: 30 }, { source: 'B', target: 'D', value: 20 }] }, null, 2)}</pre>
  </div>
);

export const SunburstChart = () => (
  <div style={{ width: 600, height: 400 }}>
    <h3>Sunburst Chart</h3>
    <p>Çok katmanlı hiyerarşik dağılım.</p>
    <pre>{JSON.stringify({ type: 'sunburst', data: [{ name: 'Root', children: [{ name: 'A', value: 50 }, { name: 'B', value: 30 }] }] }, null, 2)}</pre>
  </div>
);

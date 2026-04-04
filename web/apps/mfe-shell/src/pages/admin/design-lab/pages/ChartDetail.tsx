/**
 * ChartDetail — Design Lab individual chart component detail page
 */

import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CHART_DETAILS: Record<string, {
  name: string;
  importPath: string;
  propsTable: Array<{ name: string; type: string; default?: string; description: string }>;
  themes: string[];
}> = {
  "bar-chart": {
    name: "BarChart",
    importPath: "import { BarChart } from '@mfe/x-charts';",
    propsTable: [
      { name: "data", type: "ChartDataPoint[]", description: "Veri noktalari" },
      { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Cubuk yonu" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Grafik boyutu" },
      { name: "showValues", type: "boolean", default: "false", description: "Deger etiketleri" },
      { name: "showGrid", type: "boolean", default: "true", description: "Grid cizgileri" },
      { name: "showLegend", type: "boolean", default: "false", description: "Legend goster" },
      { name: "title", type: "string", description: "Grafik basligi" },
      { name: "animate", type: "boolean", default: "true", description: "Animasyon" },
    ],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "line-chart": {
    name: "LineChart",
    importPath: "import { LineChart } from '@mfe/x-charts';",
    propsTable: [
      { name: "series", type: "ChartSeries[]", description: "Seri verileri" },
      { name: "labels", type: "string[]", description: "X ekseni etiketleri" },
      { name: "showDots", type: "boolean", default: "true", description: "Nokta isaretleri" },
      { name: "showArea", type: "boolean", default: "false", description: "Alan dolgusu" },
      { name: "curved", type: "boolean", default: "false", description: "Bezier egriler" },
    ],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "pie-chart": {
    name: "PieChart",
    importPath: "import { PieChart } from '@mfe/x-charts';",
    propsTable: [
      { name: "data", type: "ChartDataPoint[]", description: "Dilim verileri" },
      { name: "donut", type: "boolean", default: "false", description: "Halka modu" },
      { name: "showLabels", type: "boolean", default: "false", description: "Etiketler" },
      { name: "showPercentage", type: "boolean", default: "false", description: "Yuzde goster" },
      { name: "innerLabel", type: "ReactNode", description: "Halka ici icerik" },
    ],
    themes: ["light", "dark", "high-contrast", "print"],
  },
};

const ChartDetail: React.FC = () => {
  const { chartId } = useParams<{ chartId: string }>();
  const navigate = useNavigate();
  const detail = chartId ? CHART_DETAILS[chartId] : null;

  return (
    <div className="space-y-6 p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/design-lab/charts")}
        className="text-sm text-action-primary hover:underline"
      >
        &larr; Charts
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {detail?.name ?? chartId}
        </h1>
        {detail && (
          <code className="mt-2 block rounded-lg bg-surface-muted px-3 py-2 text-xs text-text-secondary">
            {detail.importPath}
          </code>
        )}
      </div>

      {/* Props Table */}
      {detail?.propsTable && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Props API</h2>
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Prop</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Default</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {detail.propsTable.map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-2 font-mono text-xs text-action-primary">{p.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-text-tertiary">{p.type}</td>
                    <td className="px-4 py-2 text-xs text-text-secondary">{p.default ?? "—"}</td>
                    <td className="px-4 py-2 text-xs text-text-secondary">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Theme Support */}
      {detail?.themes && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Theme Destegi</h2>
          <div className="flex gap-2">
            {detail.themes.map((t) => (
              <span key={t} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-text-secondary">
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Placeholder for live demo */}
      {!detail && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border-subtle bg-surface-muted text-sm text-text-tertiary">
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div>{chartId}</div>
            <div className="text-xs mt-1">Detay sayfasi hazirlanıyor</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDetail;

/**
 * ECharts Modular Imports — Tree-Shaking Optimized
 *
 * IMPORTANT: Never `import * as echarts from 'echarts'` — that pulls ~800KB.
 * Only import from 'echarts/core' + specific chart/component modules.
 * This file is the SINGLE ENTRY POINT for all ECharts imports in the platform.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-007)
 */

/* ------------------------------------------------------------------ */
/*  Core                                                               */
/* ------------------------------------------------------------------ */
import * as echarts from 'echarts/core';

/* ------------------------------------------------------------------ */
/*  Renderers — Canvas default, SVG for SSR/a11y fallback             */
/* ------------------------------------------------------------------ */
import { CanvasRenderer } from 'echarts/renderers';
import { SVGRenderer } from 'echarts/renderers';

/* ------------------------------------------------------------------ */
/*  Chart Types (add new types here as needed)                         */
/* ------------------------------------------------------------------ */
import { BarChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';
import { ScatterChart } from 'echarts/charts';
import { SankeyChart } from 'echarts/charts';
import { TreemapChart } from 'echarts/charts';
import { RadarChart } from 'echarts/charts';
import { GaugeChart } from 'echarts/charts';
import { FunnelChart } from 'echarts/charts';
import { HeatmapChart } from 'echarts/charts';
import { SunburstChart } from 'echarts/charts';
// Future: import { BoxplotChart } from 'echarts/charts';
// Future: import { CandlestickChart } from 'echarts/charts';
// Future: import { ParallelChart } from 'echarts/charts';
// Future: import { GraphChart } from 'echarts/charts';

/* ------------------------------------------------------------------ */
/*  Components (UI features used by charts)                            */
/* ------------------------------------------------------------------ */
import { TitleComponent } from 'echarts/components';
import { TooltipComponent } from 'echarts/components';
import { LegendComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import { DatasetComponent } from 'echarts/components';
import { TransformComponent } from 'echarts/components';
import { DataZoomComponent } from 'echarts/components';
import { ToolboxComponent } from 'echarts/components';
import { AriaComponent } from 'echarts/components';
import { MarkLineComponent } from 'echarts/components';
import { MarkPointComponent } from 'echarts/components';
import { MarkAreaComponent } from 'echarts/components';
import { VisualMapComponent } from 'echarts/components';
// Future: import { GeoComponent } from 'echarts/components';

/* ------------------------------------------------------------------ */
/*  Register — Call ONCE at app startup                                */
/* ------------------------------------------------------------------ */

let _registered = false;

export function registerECharts(): void {
  if (_registered) return;

  echarts.use([
    // Renderers
    CanvasRenderer,
    SVGRenderer,
    // Charts
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    SankeyChart, TreemapChart, RadarChart, GaugeChart,
    FunnelChart, HeatmapChart, SunburstChart,
    // Components
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    ToolboxComponent,
    AriaComponent,
    MarkLineComponent,
    MarkPointComponent,
    MarkAreaComponent,
    VisualMapComponent,
  ]);

  _registered = true;
}

/* ------------------------------------------------------------------ */
/*  Re-export core for renderer usage                                  */
/* ------------------------------------------------------------------ */
export { echarts };
export type { ECharts, EChartsOption } from 'echarts/core';

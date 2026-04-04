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
// Future P3: import { SankeyChart } from 'echarts/charts';
// Future P3: import { TreemapChart } from 'echarts/charts';
// Future P3: import { RadarChart } from 'echarts/charts';
// Future P3: import { GaugeChart } from 'echarts/charts';
// Future P3: import { FunnelChart } from 'echarts/charts';
// Future P3: import { HeatmapChart } from 'echarts/charts';
// Future P3: import { SunburstChart } from 'echarts/charts';
// Future P3: import { BoxplotChart } from 'echarts/charts';
// Future P3: import { CandlestickChart } from 'echarts/charts';
// Future P3: import { ParallelChart } from 'echarts/charts';
// Future P3: import { GraphChart } from 'echarts/charts';

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
// Future P3: import { VisualMapComponent } from 'echarts/components';
// Future P3: import { GeoComponent } from 'echarts/components';

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
  ]);

  _registered = true;
}

/* ------------------------------------------------------------------ */
/*  Re-export core for renderer usage                                  */
/* ------------------------------------------------------------------ */
export { echarts };
export type { ECharts, EChartsOption } from 'echarts/core';

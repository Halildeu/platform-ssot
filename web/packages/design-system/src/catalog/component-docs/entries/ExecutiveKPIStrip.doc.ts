import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ExecutiveKPIStrip",
  indexItem: {
    "name": "ExecutiveKPIStrip",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Yonetici KPI strip, trend gosterge",
    "demoMode": "live",
    "description": "Sparkline, trend gostergeleri ve hedef gauge'lari ile donatilmis responsive KPI metrik kart gridi; yonetici dashboard'lari icin tasarlanmistir.",
    "sectionIds": [
      "component_library_management"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility"
    ],
    "tags": [
      "enterprise",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_14_enterprise_suite",
    "acceptanceContractId": "ui-library-wave-14-enterprise-suite-v1",
    "importStatement": "import { ExecutiveKPIStrip } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ExecutiveKPIStrip",
    "variantAxes": [
      "size: sm | md | lg",
      "columns: 2 | 3 | 4 | 5 | 6"
    ],
    "stateModel": [
      "default",
      "loading",
      "with-trends"
    ],
    "previewStates": ["default-types"],
    "behaviorModel": [
      "responsive grid columns (mobile 1, tablet 2, desktop configurable)",
      "sparkline SVG polyline rendering",
      "mini gauge arc rendering",
      "trend badge with directional color",
      "metric click interaction",
      "loading skeleton state",
      "per-metric access control"
    ],
    "props": [
      { "name": "metrics", "type": "KPIMetric[]", "default": "-", "required": true, "description": "Gosterilecek KPI metrikleri." },
      { "name": "columns", "type": "2 | 3 | 4 | 5 | 6", "default": "4", "required": false, "description": "Masaustunde gorunen sutun sayisi." },
      { "name": "size", "type": "KPIStripSize", "default": "md", "required": false, "description": "Kart boyut varyanti." },
      { "name": "loading", "type": "boolean", "default": "false", "required": false, "description": "Yukleme iskelet durumunu gosterir." },
      { "name": "access", "type": "AccessLevel", "default": "-", "required": false, "description": "Genel erisim seviyesi." },
      { "name": "accessReason", "type": "string", "default": "-", "required": false, "description": "Erisim kisitlamasi aciklamasi." },
      { "name": "onMetricClick", "type": "(metricId: string) => void", "default": "-", "required": false, "description": "Metrik kartina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "responsive column grid",
      "sparkline and gauge rendering",
      "trend badge colors"
    ],
    "regressionFocus": [
      "bos metrics dizisi",
      "loading state skeleton",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

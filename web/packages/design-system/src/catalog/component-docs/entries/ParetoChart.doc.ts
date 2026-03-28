import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ParetoChart",
  indexItem: {
    "name": "ParetoChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "80/20 analiz, bar + kumulatif cizgi",
    "demoMode": "live",
    "description": "Bar grafik (sol eksen) ve kumulatif yuzde cizgisi (sag eksen) birlestiren Pareto 80/20 analiz grafigi; %80 referans cizgisi ve hover etkilesimi destekler.",
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
    "importStatement": "import { ParetoChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ParetoChart",
    "variantAxes": [
      "showCumulativeLine: true | false",
      "show80Line: true | false"
    ],
    "stateModel": [
      "default",
      "with-cumulative-line",
      "with-80-line"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "auto descending sort by value",
      "bar chart rendering (left y-axis)",
      "cumulative percentage line (right y-axis)",
      "80% reference dashed line",
      "percentage labels on cumulative points",
      "bar hover highlight",
      "bar click interaction",
      "custom value formatter"
    ],
    "props": [
      { "name": "items", "type": "ParetoItem[]", "default": "-", "required": true, "description": "Pareto ogeleri (deger azalan sirada otomatik siralanir)." },
      { "name": "height", "type": "number | string", "default": "-", "required": false, "description": "Grafik yuksekligi." },
      { "name": "showCumulativeLine", "type": "boolean", "default": "-", "required": false, "description": "Kumulatif yuzde cizgisini gosterir." },
      { "name": "showPercentLabels", "type": "boolean", "default": "-", "required": false, "description": "Kumulatif cizgi uzerinde yuzde etiketlerini gosterir." },
      { "name": "show80Line", "type": "boolean", "default": "-", "required": false, "description": "%80 kumulatif noktasinda kesikli referans cizgisi gosterir." },
      { "name": "format", "type": "(value: number) => string", "default": "-", "required": false, "description": "Cubuk etiketleri icin ozel deger formatlayici." },
      { "name": "onItemClick", "type": "(item: ParetoItem) => void", "default": "-", "required": false, "description": "Cubuga tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "bar + cumulative line combo",
      "80% reference line",
      "hover highlight"
    ],
    "regressionFocus": [
      "bos items dizisi",
      "tek ogeli grafik",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

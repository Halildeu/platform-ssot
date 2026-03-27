import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MicroChart",
  indexItem: {
    "name": "MicroChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "6 tip mini inline SVG grafik",
    "demoMode": "live",
    "description": "Sparkline, bar, bullet, progress, waffle ve donut-ring tiplerini destekleyen kompakt inline mikro grafik bileseni.",
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
    "importStatement": "import { MicroChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MicroChart",
    "variantAxes": [
      "type: sparkline | bar | bullet | progress | waffle | donut-ring"
    ],
    "stateModel": [
      "sparkline",
      "bar",
      "bullet",
      "progress",
      "waffle",
      "donut-ring"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "6 farkli gorsellestime tipi",
      "otomatik olcekleme",
      "renk ve iz rengi ozellestirme",
      "erisilebilirlik etiketi destegi"
    ],
    "props": [
      { "name": "type", "type": "MicroChartType", "default": "-", "required": true, "description": "Gorsellestime tipi." },
      { "name": "data", "type": "number[]", "default": "-", "required": true, "description": "Veri noktalari; yorumlama tipe gore degisir." },
      { "name": "width", "type": "number", "default": "64", "required": false, "description": "Genislik (px)." },
      { "name": "height", "type": "number", "default": "32", "required": false, "description": "Yukseklik (px)." },
      { "name": "color", "type": "string", "default": "var(--interactive-primary)", "required": false, "description": "Birincil renk." },
      { "name": "trackColor", "type": "string", "default": "var(--surface-muted)", "required": false, "description": "Ikincil / iz rengi." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." },
      { "name": "ariaLabel", "type": "string", "default": "-", "required": false, "description": "Aria etiket gecersiz kilma." }
    ],
    "previewFocus": [
      "all 6 chart types",
      "auto-scaling behavior",
      "custom color theming"
    ],
    "regressionFocus": [
      "bos data dizisi goruntuleme",
      "tek elemanli data",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

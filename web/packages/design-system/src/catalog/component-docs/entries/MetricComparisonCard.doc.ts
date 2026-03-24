import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MetricComparisonCard",
  indexItem: {
    "name": "MetricComparisonCard",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "metrics",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "metrik karsilastirma, donem bazli, KPI kart",
    "demoMode": "live",
    "description": "Trend oku, yuzde degisim, opsiyonel hedef cubugu ve sparkline mini grafik ile donem bazli metrik karsilastirma karti.",
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
    "importStatement": "import { MetricComparisonCard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MetricComparisonCard",
    "variantAxes": [
      "size: sm | md | lg",
      "format: number | currency | percent"
    ],
    "stateModel": [
      "default",
      "with-target",
      "with-sparkline",
      "inverted-trend"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "title with sparkline in header",
      "large current value display",
      "trend arrow (up green / down red) with percentage",
      "previous value comparison",
      "optional target progress bar",
      "optional sparkline mini chart",
      "size variants (sm/md/lg)",
      "invertTrend for cost metrics"
    ],
    "props": [
      { "name": "title", "type": "string", "default": "-", "required": true, "description": "Metrik baslik." },
      { "name": "currentValue", "type": "number", "default": "-", "required": true, "description": "Mevcut donem degeri." },
      { "name": "previousValue", "type": "number", "default": "-", "required": true, "description": "Onceki donem degeri." },
      { "name": "format", "type": "'number' | 'currency' | 'percent'", "default": "number", "required": false, "description": "Sayi format tipi." },
      { "name": "currencySymbol", "type": "string", "default": "TRY", "required": false, "description": "Para birimi kodu." },
      { "name": "period", "type": "{ current: string; previous: string }", "default": "-", "required": false, "description": "Donem etiketleri." },
      { "name": "target", "type": "number", "default": "-", "required": false, "description": "Hedef deger (ilerleme cubugu gosterir)." },
      { "name": "sparklineData", "type": "number[]", "default": "-", "required": false, "description": "Sparkline veri noktalari." },
      { "name": "size", "type": "'sm' | 'md' | 'lg'", "default": "md", "required": false, "description": "Kart boyut varyanti." },
      { "name": "invertTrend", "type": "boolean", "default": "false", "required": false, "description": "Trend renklerini tersine cevirir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "trend arrow with percentage",
      "target progress bar",
      "sparkline mini chart"
    ],
    "regressionFocus": [
      "sifir deger karsilastirma",
      "ters trend renkleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KPICard",
  indexItem: {
    "name": "KPICard",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts KPI",
    "demoMode": "planned",
    "description": "Tek bir KPI metrigini baslik, deger, trend gostergesi ve opsiyonel sparkline ile ozetleyen kart bileseni.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "charts",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { KPICard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KPICard",
    "variantAxes": [
      "trend: up | down | neutral",
      "sparkline: visible | hidden"
    ],
    "stateModel": [
      "default",
      "loading",
      "error"
    ],
    "previewStates": [
      "default",
      "trend-up",
      "trend-down",
      "with-sparkline",
      "dark-theme"
    ],
    "behaviorModel": [
      "metric value formatting",
      "trend indicator rendering",
      "sparkline integration",
      "comparison period display",
      "loading skeleton state",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": true,
        "description": "KPI metrik basligi."
      },
      {
        "name": "value",
        "type": "number | string",
        "default": "-",
        "required": true,
        "description": "Goruntulenen ana metrik degeri."
      },
      {
        "name": "trend",
        "type": "'up' | 'down' | 'neutral'",
        "default": "neutral",
        "required": false,
        "description": "Trend yonu gostergesi."
      },
      {
        "name": "trendValue",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Trend degisim yuzde veya deger metni."
      },
      {
        "name": "sparklineData",
        "type": "number[]",
        "default": "-",
        "required": false,
        "description": "Mini sparkline grafigi icin veri dizisi."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yuklenme durumunda skeleton gosterir."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number | string) => string",
        "default": "-",
        "required": false,
        "description": "Deger gosterim formatlama fonksiyonu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Kart boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "trend indicator rendering",
      "sparkline integration",
      "value formatting"
    ],
    "regressionFocus": [
      "trend yonu ikon dogrulugu",
      "sparkline veri guncelleme",
      "loading skeleton gorunumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

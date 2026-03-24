import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PivotTable",
  indexItem: {
    "name": "PivotTable",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "tables",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Capraz tablo pivot analiz bileseni",
    "demoMode": "live",
    "description": "Ham veriyi satir ve sutun boyutlarina gore gruplandiran, toplama fonksiyonlari (sum, count, avg, min, max) uygulayan hafif pivot tablo bileseni.",
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
    "importStatement": "import { PivotTable } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "PivotTable",
    "variantAxes": [
      "compact: true | false",
      "showTotals: true | false"
    ],
    "stateModel": [
      "default",
      "multiple-values",
      "compact-sortable"
    ],
    "previewStates": ["default-types", "data-loaded", "dark-theme"],
    "behaviorModel": [
      "pivot engine — row x column grouping",
      "aggregation: sum, count, avg, min, max",
      "sortable column headers",
      "row and column totals with grand total",
      "cell click handler with coordinates",
      "custom number formatting",
      "compact mode with reduced spacing"
    ],
    "props": [
      { "name": "data", "type": "Record<string, unknown>[]", "default": "-", "required": true, "description": "Pivotlanacak ham veri dizisi." },
      { "name": "rows", "type": "string[]", "default": "-", "required": true, "description": "Satir boyut alanlari." },
      { "name": "columns", "type": "string[]", "default": "-", "required": true, "description": "Sutun boyut alanlari." },
      { "name": "values", "type": "PivotValueConfig[]", "default": "-", "required": true, "description": "Agregasyon tanimlari." },
      { "name": "onCellClick", "type": "(cell: PivotCellClickEvent) => void", "default": "-", "required": false, "description": "Hucre tiklandiginda tetiklenen geri cagirim." },
      { "name": "showTotals", "type": "boolean", "default": "false", "required": false, "description": "Satir/sutun toplamlarini goster." },
      { "name": "compact", "type": "boolean", "default": "false", "required": false, "description": "Kompakt mod — kucuk dolgu ve yazi tipi." },
      { "name": "sortable", "type": "boolean", "default": "false", "required": false, "description": "Sutun basliklarini tiklayarak siralama." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "pivot computation accuracy",
      "totals row/column rendering",
      "sort interaction on headers"
    ],
    "regressionFocus": [
      "bos veri dizisi edge case",
      "tek satir/sutun boyutu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

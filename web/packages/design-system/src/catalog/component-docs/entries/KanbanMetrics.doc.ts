import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanMetrics",
  indexItem: {
    "name": "KanbanMetrics",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Kanban Metrics",
    "demoMode": "planned",
    "description": "Kanban tahtasi metriklerini ozetleyen display bileseni; WIP limitleri, tamamlanma oranlari ve gecikme gostergelerini sunar.",
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
      "kanban",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { KanbanMetrics } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanMetrics",
    "variantAxes": [
      "layout: inline | panel",
      "detail: summary | detailed"
    ],
    "stateModel": [
      "default",
      "loading",
      "wip-exceeded"
    ],
    "previewStates": [
      "summary-view",
      "detailed-view",
      "wip-exceeded",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "WIP limit indicator",
      "completion rate calculation",
      "overdue card highlight",
      "column distribution chart",
      "loading skeleton state",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "columns",
        "type": "KanbanColumnMetric[]",
        "default": "[]",
        "required": true,
        "description": "Her kolon icin metrik verileri dizisi."
      },
      {
        "name": "wipLimits",
        "type": "Record<string, number>",
        "default": "-",
        "required": false,
        "description": "Kolon bazli WIP (Work In Progress) limitleri."
      },
      {
        "name": "layout",
        "type": "'inline' | 'panel'",
        "default": "inline",
        "required": false,
        "description": "Metrik gosterim duzen modu."
      },
      {
        "name": "showCompletionRate",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Tamamlanma orani gostergesini gosterir veya gizler."
      },
      {
        "name": "showOverdue",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Geciken kart sayisi gostergesini gosterir veya gizler."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yuklenme durumunda skeleton gosterir."
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
        "description": "Metrik paneli boyut varyantini belirler."
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
      "WIP limit indicator",
      "completion rate display",
      "overdue highlight"
    ],
    "regressionFocus": [
      "WIP limit asimi vurgulama",
      "tamamlanma orani hesaplama dogrulugu",
      "loading skeleton gorunumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

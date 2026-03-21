import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanCard",
  indexItem: {
    "name": "KanbanCard",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "x_kanban",
    "taxonomySubgroup": "X-Kanban",
    "demoMode": "planned",
    "description": "Kanban tahtasinda tek bir karti gorsel olarak temsil eden bilesen. Suruklenebilir ve tiklanabilir yapida calisir.",
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
    "importStatement": "import { KanbanCard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanCard",
    "variantAxes": [
      "state: idle | dragging | selected"
    ],
    "stateModel": [
      "idle",
      "hovered",
      "dragging"
    ],
    "previewStates": [
      "idle",
      "dragging",
      "selected",
      "dark-theme"
    ],
    "behaviorModel": [
      "card visual representation",
      "drag handle initiation",
      "click interaction for detail",
      "elevation change on drag",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "card",
        "type": "KanbanCard",
        "default": "-",
        "required": true,
        "description": "Goruntulecek kart nesnesinin tum verilerini icerir."
      },
      {
        "name": "onClick",
        "type": "(card: KanbanCard) => void",
        "default": "-",
        "required": false,
        "description": "Karta tiklandiginda tetiklenen callback."
      },
      {
        "name": "onDragStart",
        "type": "(card: KanbanCard) => void",
        "default": "-",
        "required": false,
        "description": "Surukle-birak islemi basladiginda tetiklenen callback."
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
      "card content layout",
      "drag initiation interaction",
      "elevation and shadow on drag"
    ],
    "regressionFocus": [
      "drag-start callback dogrulugu",
      "hover ve drag state gecisleri",
      "kart icerik tasma kontrolu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

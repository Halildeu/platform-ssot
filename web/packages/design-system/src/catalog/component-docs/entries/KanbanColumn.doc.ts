import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanColumn",
  indexItem: {
    "name": "KanbanColumn",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Kanban",
    "demoMode": "planned",
    "description": "Kanban tahtasinda tek bir kolonu temsil eden container bilesen. Kart drop alani ve baslik gosterimi saglar.",
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
    "importStatement": "import { KanbanColumn } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanColumn",
    "variantAxes": [
      "state: idle | drag-over"
    ],
    "stateModel": [
      "idle",
      "drag-over",
      "empty"
    ],
    "previewStates": [
      "with-cards",
      "empty-column",
      "drag-over",
      "dark-theme"
    ],
    "behaviorModel": [
      "card list rendering within column",
      "drop zone highlight on drag-over",
      "column header with card count",
      "custom card render delegation",
      "keyboard card reordering",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "column",
        "type": "KanbanColumn",
        "default": "-",
        "required": true,
        "description": "Kolon tanimlama nesnesi (id, baslik, renk vb.)."
      },
      {
        "name": "cards",
        "type": "KanbanCard[]",
        "default": "[]",
        "required": true,
        "description": "Bu kolonda goruntulecek kart nesneleri dizisi."
      },
      {
        "name": "onDrop",
        "type": "(cardId: string, index: number) => void",
        "default": "-",
        "required": false,
        "description": "Kart bu kolona birakildiginda tetiklenen callback."
      },
      {
        "name": "onCardClick",
        "type": "(card: KanbanCard) => void",
        "default": "-",
        "required": false,
        "description": "Kolondaki bir karta tiklandiginda tetiklenen callback."
      },
      {
        "name": "renderCard",
        "type": "(card: KanbanCard) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Kart icerigini ozellestirmek icin render fonksiyonu."
      },
      {
        "name": "isDragOver",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Kolon uzerinde aktif bir surukle-birak islemi olup olmadigini belirtir."
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
        "description": "Kolon boyut varyantini belirler."
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
      "card list rendering",
      "drag-over visual highlight",
      "empty column state"
    ],
    "regressionFocus": [
      "drop callback index dogrulugu",
      "bos kolon goruntuleme",
      "drag-over state gecisleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

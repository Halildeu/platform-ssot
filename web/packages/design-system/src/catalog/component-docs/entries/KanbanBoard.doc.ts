import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanBoard",
  indexItem: {
    "name": "KanbanBoard",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "x_kanban",
    "taxonomySubgroup": "Kanban board",
    "demoMode": "planned",
    "description": "Surukle-birak destekli kolon bazli kanban tahtasi container bileseni. Kart tasima, kolon ekleme ve ozel kart renderlamaya olanak tanir.",
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
    "importStatement": "import { KanbanBoard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanBoard",
    "variantAxes": [
      "layout: horizontal-scroll | wrap"
    ],
    "stateModel": [
      "empty",
      "loaded",
      "dragging"
    ],
    "previewStates": [
      "multi-column",
      "empty-board",
      "dragging-card",
      "dark-theme"
    ],
    "behaviorModel": [
      "column-based card layout",
      "cross-column drag-and-drop",
      "custom card render slot",
      "column add action",
      "keyboard card navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "columns",
        "type": "KanbanColumn[]",
        "default": "[]",
        "required": true,
        "description": "Kanban tahtasinda goruntulecek kolon tanimlari dizisi."
      },
      {
        "name": "cards",
        "type": "KanbanCard[]",
        "default": "[]",
        "required": true,
        "description": "Kolonlara dagitilacak kart nesneleri dizisi."
      },
      {
        "name": "onCardMove",
        "type": "(cardId: string, fromColumn: string, toColumn: string, index: number) => void",
        "default": "-",
        "required": false,
        "description": "Kart baska bir kolona tasindiginda tetiklenen callback."
      },
      {
        "name": "onCardClick",
        "type": "(card: KanbanCard) => void",
        "default": "-",
        "required": false,
        "description": "Karta tiklandiginda tetiklenen callback."
      },
      {
        "name": "onColumnAdd",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Yeni kolon ekleme aksiyonu tetiklendiginde cagrilacak callback."
      },
      {
        "name": "renderCard",
        "type": "(card: KanbanCard) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Kart icerigini ozellestirmek icin render fonksiyonu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "addColumnLabel",
        "type": "string",
        "default": "Kolon Ekle",
        "required": false,
        "description": "Yeni kolon ekleme butonunun etiket metni."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Board boyut varyantini belirler."
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
      "multi-column card layout",
      "cross-column drag-and-drop",
      "empty board state"
    ],
    "regressionFocus": [
      "kart tasima callback dogrulugu",
      "bos tahta goruntuleme",
      "keyboard ile kolon/kart navigasyonu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

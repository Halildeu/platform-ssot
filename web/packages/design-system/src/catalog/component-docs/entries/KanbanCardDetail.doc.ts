import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "KanbanCardDetail",
  indexItem: {
    "name": "KanbanCardDetail",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_kanban",
    "subgroup": "kanban",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Kanban Card Detail",
    "demoMode": "planned",
    "description": "Kanban kart detay overlay bileseni; kart icerigini, yorumlari, etiketi ve atamalari tam gorunumde sunar.",
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
    "importStatement": "import { KanbanCardDetail } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "KanbanCardDetail",
    "variantAxes": [
      "mode: view | edit",
      "layout: drawer | modal"
    ],
    "stateModel": [
      "viewing",
      "editing",
      "saving"
    ],
    "previewStates": [
      "view-mode",
      "edit-mode",
      "with-comments",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "card detail overlay display",
      "inline field editing",
      "comment thread rendering",
      "label/assignee management",
      "close on outside click",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "card",
        "type": "KanbanCard",
        "default": "-",
        "required": true,
        "description": "Detay gorunumunde gosterilecek kart verisi."
      },
      {
        "name": "open",
        "type": "boolean",
        "default": "false",
        "required": true,
        "description": "Overlay gorunurluk durumunu kontrol eder."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "default": "-",
        "required": true,
        "description": "Overlay kapatildiginda tetiklenen callback."
      },
      {
        "name": "onSave",
        "type": "(card: KanbanCard) => Promise<void>",
        "default": "-",
        "required": false,
        "description": "Kart degisiklikleri kaydedildiginde tetiklenen async callback."
      },
      {
        "name": "mode",
        "type": "'view' | 'edit'",
        "default": "view",
        "required": false,
        "description": "Goruntuleme veya duzenleme modu."
      },
      {
        "name": "layout",
        "type": "'drawer' | 'modal'",
        "default": "drawer",
        "required": false,
        "description": "Overlay gosterim bicimi."
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
        "description": "Detay paneli boyut varyantini belirler."
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
      "view vs edit mode",
      "comment thread rendering",
      "overlay layout variants"
    ],
    "regressionFocus": [
      "mod gecis tutarliligi",
      "kaydetme async akisi",
      "close on outside click davranisi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

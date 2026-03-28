import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MentionList",
  indexItem: {
    "name": "MentionList",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_editor",
    "subgroup": "editor",
    "taxonomyGroupId": "x_editor",
    "taxonomySubgroup": "Mention list",
    "demoMode": "planned",
    "description": "Editor icerisinde '@' karakteri ile tetiklenen kullanici/kaynak mention overlay listesi; arama ve secim destegi saglar.",
    "sectionIds": [
      "component_library_management",
      "form_controls",
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
      "editor",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { MentionList } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MentionList",
    "variantAxes": [
      "type: user | channel | document",
      "position: caret | fixed"
    ],
    "stateModel": [
      "hidden",
      "visible",
      "loading",
      "empty"
    ],
    "previewStates": [
      "user-list",
      "filtered-results",
      "loading",
      "empty-results",
      "dark-theme"
    ],
    "behaviorModel": [
      "@ character trigger",
      "async user search",
      "keyboard arrow navigation",
      "mention insertion on select",
      "caret-relative positioning",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "items",
        "type": "MentionItem[]",
        "default": "[]",
        "required": true,
        "description": "Mention listesinde gosterilecek oge dizisi."
      },
      {
        "name": "onSelect",
        "type": "(item: MentionItem) => void",
        "default": "-",
        "required": true,
        "description": "Mention ogesi secildiginde tetiklenen callback."
      },
      {
        "name": "onSearch",
        "type": "(query: string) => void",
        "default": "-",
        "required": false,
        "description": "Arama metni degistiginde tetiklenen callback."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Arama sonuclari yuklenirken gosterilen durum."
      },
      {
        "name": "emptyMessage",
        "type": "string",
        "default": "Sonuc bulunamadi",
        "required": false,
        "description": "Sonuc bulunmadiginda gosterilecek mesaj."
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
        "description": "Liste boyut varyantini belirler."
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
      "@ trigger appearance",
      "async search results",
      "keyboard selection"
    ],
    "regressionFocus": [
      "caret pozisyon hesaplama",
      "async arama debounce zamanlama",
      "bos sonuc durumu gorunumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

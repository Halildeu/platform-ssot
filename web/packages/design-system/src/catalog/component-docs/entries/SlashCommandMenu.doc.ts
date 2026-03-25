import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SlashCommandMenu",
  indexItem: {
    "name": "SlashCommandMenu",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_editor",
    "subgroup": "editor",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "X-Editor Slash Command",
    "demoMode": "planned",
    "description": "Editor icerisinde '/' karakteri ile tetiklenen komut menusu overlay bileseni; blok ekleme ve formatlama komutlari sunar.",
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
    "importStatement": "import { SlashCommandMenu } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SlashCommandMenu",
    "variantAxes": [
      "position: caret | fixed",
      "filter: text | category"
    ],
    "stateModel": [
      "hidden",
      "visible",
      "filtering"
    ],
    "previewStates": [
      "visible-full",
      "filtered-results",
      "empty-results",
      "dark-theme"
    ],
    "behaviorModel": [
      "slash character trigger",
      "command search filtering",
      "keyboard arrow navigation",
      "command execution dispatch",
      "caret-relative positioning",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "commands",
        "type": "SlashCommand[]",
        "default": "[]",
        "required": true,
        "description": "Menude gosterilecek komut tanimlari dizisi."
      },
      {
        "name": "editorRef",
        "type": "RefObject<EditorInstance>",
        "default": "-",
        "required": true,
        "description": "Editor ornegiyle iletisim kurmak icin ref nesnesi."
      },
      {
        "name": "onSelect",
        "type": "(command: SlashCommand) => void",
        "default": "-",
        "required": true,
        "description": "Komut secildiginde tetiklenen callback."
      },
      {
        "name": "filterPlaceholder",
        "type": "string",
        "default": "Komut ara...",
        "required": false,
        "description": "Filtre alaninin placeholder metni."
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
        "description": "Menu boyut varyantini belirler."
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
      "slash trigger appearance",
      "command filtering",
      "keyboard navigation"
    ],
    "regressionFocus": [
      "caret pozisyon hesaplama",
      "filtre sonuc esleme dogrulugu",
      "escape ile kapatma davranisi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

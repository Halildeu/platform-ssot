import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditorToolbar",
  indexItem: {
    "name": "EditorToolbar",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_editor",
    "subgroup": "editor",
    "taxonomyGroupId": "x_editor",
    "taxonomySubgroup": "X-Editor",
    "demoMode": "planned",
    "description": "Zengin metin editoru icin formatlama butonlarini barindiran toolbar bileseni. Bold, italic, liste, link gibi aksiyonlari saglar.",
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
    "importStatement": "import { EditorToolbar } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditorToolbar",
    "variantAxes": [
      "layout: full | compact"
    ],
    "stateModel": [
      "idle",
      "active-format"
    ],
    "previewStates": [
      "default",
      "with-active-formats",
      "compact",
      "dark-theme"
    ],
    "behaviorModel": [
      "formatting button toggle states",
      "editor ref command dispatch",
      "active format visual indicators",
      "keyboard accessible toolbar navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "editorRef",
        "type": "RefObject<EditorInstance>",
        "default": "-",
        "required": true,
        "description": "Editor ornegiyle iletisim kurmak icin ref nesnesi."
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
        "description": "Toolbar boyut varyantini belirler."
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
      "formatting button states",
      "active format indicators",
      "toolbar navigation flow"
    ],
    "regressionFocus": [
      "format toggle state senkronizasyonu",
      "editor ref komut gonderim dogrulugu",
      "keyboard toolbar navigasyonu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditorMenuBubble",
  indexItem: {
    "name": "EditorMenuBubble",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "forms_data_entry",
    "subgroup": "editor",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-Editor",
    "demoMode": "planned",
    "description": "Metin secimi uzerinde gorunen yuzey (floating) formatlama menusu. Secim bazli hizli formatlama aksiyonlari saglar.",
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
    "importStatement": "import { EditorMenuBubble } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditorMenuBubble",
    "variantAxes": [
      "position: auto | fixed"
    ],
    "stateModel": [
      "hidden",
      "visible",
      "positioning"
    ],
    "previewStates": [
      "hidden",
      "visible-with-selection",
      "dark-theme"
    ],
    "behaviorModel": [
      "selection-triggered visibility",
      "floating position calculation",
      "format command dispatch",
      "click-outside dismissal",
      "keyboard escape dismissal",
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
        "description": "Bubble menu boyut varyantini belirler."
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
      "selection-triggered appearance",
      "floating position accuracy",
      "format action buttons"
    ],
    "regressionFocus": [
      "pozisyon hesaplama viewport sinirlarinda",
      "click-outside dismiss davranisi",
      "secim kaldirildiginda gizlenme",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

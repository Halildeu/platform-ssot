import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RichTextEditor",
  indexItem: {
    "name": "RichTextEditor",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_editor",
    "subgroup": "editor",
    "taxonomyGroupId": "x_editor",
    "taxonomySubgroup": "X-Editor",
    "demoMode": "planned",
    "description": "Zengin metin duzenleme icin ana bilesen. Bold, italic, liste, link gibi formatlama secenekleri ile HTML veya JSON cikti formatini destekler.",
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
    "importStatement": "import { RichTextEditor } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "RichTextEditor",
    "variantAxes": [
      "outputFormat: html | json",
      "mode: editable | readOnly"
    ],
    "stateModel": [
      "empty",
      "editing",
      "readOnly"
    ],
    "previewStates": [
      "empty",
      "with-content",
      "readOnly",
      "dark-theme"
    ],
    "behaviorModel": [
      "rich text formatting (bold, italic, underline, lists)",
      "controlled value management",
      "read-only mode rendering",
      "auto-focus on mount",
      "min/max height constraints",
      "keyboard shortcut formatting",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "value",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Editorun kontrol edilen icerik degeri (HTML veya JSON)."
      },
      {
        "name": "onChange",
        "type": "(value: string) => void",
        "default": "-",
        "required": false,
        "description": "Icerik degistiginde tetiklenen callback."
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Bos editor icin yer tutucu metin."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Salt okunur modu aktif eder, duzenlemeyi devre disi birakir."
      },
      {
        "name": "autoFocus",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Bilesen mount oldugunda otomatik fokus almasini saglar."
      },
      {
        "name": "minHeight",
        "type": "number | string",
        "default": "120",
        "required": false,
        "description": "Editor alaninin minimum yuksekligi."
      },
      {
        "name": "maxHeight",
        "type": "number | string",
        "default": "-",
        "required": false,
        "description": "Editor alaninin maksimum yuksekligi; asimlarda scroll aktif olur."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "toolbar",
        "type": "ToolbarConfig | boolean",
        "default": "true",
        "required": false,
        "description": "Toolbar yapilandirmasi; false ile gizlenir, nesne ile ozellestirilir."
      },
      {
        "name": "outputFormat",
        "type": "'html' | 'json'",
        "default": "html",
        "required": false,
        "description": "Cikti formatini belirler; HTML string veya JSON dokuman yapisi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Editor boyut varyantini belirler."
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
      "text formatting toolbar interaction",
      "content editing experience",
      "readOnly mode rendering"
    ],
    "regressionFocus": [
      "onChange callback icerik format dogrulugu",
      "readOnly modda toolbar gizleme",
      "min/max height scroll davranisi",
      "keyboard shortcut formatlama paritesi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

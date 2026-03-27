import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditorTableMenu",
  indexItem: {
    "name": "EditorTableMenu",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_editor",
    "subgroup": "editor",
    "taxonomyGroupId": "x_editor",
    "taxonomySubgroup": "Editor table menu",
    "demoMode": "planned",
    "description": "Editor icerisindeki tablo blogu icin satir/sutun ekleme, silme ve birlestirme islemlerini sunan interaktif menu bileseni.",
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
    "importStatement": "import { EditorTableMenu } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditorTableMenu",
    "variantAxes": [
      "context: row | column | cell",
      "position: contextMenu | toolbar"
    ],
    "stateModel": [
      "hidden",
      "visible",
      "executing"
    ],
    "previewStates": [
      "row-context",
      "column-context",
      "cell-merge",
      "dark-theme"
    ],
    "behaviorModel": [
      "row add/remove actions",
      "column add/remove actions",
      "cell merge/split",
      "context-aware menu items",
      "keyboard shortcut display",
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
        "name": "tableRef",
        "type": "RefObject<HTMLTableElement>",
        "default": "-",
        "required": true,
        "description": "Hedef tablo elementi referansi."
      },
      {
        "name": "onAction",
        "type": "(action: TableAction) => void",
        "default": "-",
        "required": false,
        "description": "Tablo islemi gerceklestirildiginde tetiklenen callback."
      },
      {
        "name": "showShortcuts",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Menu ogelerinde klavye kisayollarini gosterir."
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
      "context-aware menu items",
      "row/column operations",
      "cell merge/split"
    ],
    "regressionFocus": [
      "satir/sutun ekleme pozisyon dogrulugu",
      "hucre birlestirme/ayirma tutarliligi",
      "menu pozisyon hesaplama",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

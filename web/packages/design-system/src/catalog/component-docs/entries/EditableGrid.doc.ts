import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditableGrid",
  indexItem: {
    "name": "EditableGrid",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Editable",
    "demoMode": "planned",
    "description": "Hucre ici duzenleme destekli grid bileseni; inline editing, validasyon ve batch kaydetme islevselligi sunar.",
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
      "data-grid",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { EditableGrid } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditableGrid",
    "variantAxes": [
      "editMode: cell | row | fullRow",
      "editTrigger: click | doubleClick"
    ],
    "stateModel": [
      "readOnly",
      "editing",
      "validating",
      "dirty"
    ],
    "previewStates": [
      "readOnly",
      "cell-editing",
      "row-editing",
      "with-validation-error",
      "dark-theme"
    ],
    "behaviorModel": [
      "inline cell editing",
      "row edit mode",
      "cell validation on blur",
      "dirty state tracking",
      "batch save/discard",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "rowData",
        "type": "any[]",
        "default": "[]",
        "required": true,
        "description": "Grid satir verileri dizisi."
      },
      {
        "name": "columnDefs",
        "type": "EditableColDef[]",
        "default": "[]",
        "required": true,
        "description": "Duzenlenebilirlik bilgisi iceren kolon tanimlari."
      },
      {
        "name": "editMode",
        "type": "'cell' | 'row' | 'fullRow'",
        "default": "cell",
        "required": false,
        "description": "Duzenleme modu: tek hucre, satir veya tam satir."
      },
      {
        "name": "editTrigger",
        "type": "'click' | 'doubleClick'",
        "default": "doubleClick",
        "required": false,
        "description": "Duzenleme modunu baslatan tetikleyici."
      },
      {
        "name": "onCellValueChange",
        "type": "(params: CellValueChangeParams) => void",
        "default": "-",
        "required": false,
        "description": "Hucre degeri degistiginde tetiklenen callback."
      },
      {
        "name": "onSave",
        "type": "(changes: RowChange[]) => Promise<void>",
        "default": "-",
        "required": false,
        "description": "Toplu kaydetme islemi icin async callback."
      },
      {
        "name": "onDiscard",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Degisiklikleri iptal etme callback'i."
      },
      {
        "name": "cellValidators",
        "type": "Record<string, (value: any) => string | null>",
        "default": "-",
        "required": false,
        "description": "Kolon bazli hucre validasyon fonksiyonlari."
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
        "description": "Grid boyut varyantini belirler."
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
      "inline cell editing",
      "validation error display",
      "dirty state indicator"
    ],
    "regressionFocus": [
      "hucre validasyon zamanlama dogrulugu",
      "batch save/discard islem akisi",
      "edit mode gecis tutarliligi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RepeatableFieldGroup",
  indexItem: {
    "name": "RepeatableFieldGroup",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "forms_data_entry",
    "subgroup": "form_builder",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-FormBuilder Repeatable",
    "demoMode": "planned",
    "description": "Dinamik olarak satir eklenip cikarilabilen tekrarlanabilir alan grubu bileseni; dizi tipindeki form verileri icin kullanilir.",
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
      "form-builder",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { RepeatableFieldGroup } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "RepeatableFieldGroup",
    "variantAxes": [
      "layout: stacked | inline",
      "addPosition: top | bottom"
    ],
    "stateModel": [
      "empty",
      "has-items",
      "max-reached",
      "reordering"
    ],
    "previewStates": [
      "empty",
      "with-items",
      "max-reached",
      "reordering",
      "dark-theme"
    ],
    "behaviorModel": [
      "dynamic row add/remove",
      "drag-to-reorder rows",
      "min/max item limits",
      "per-row validation",
      "empty state rendering",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "fields",
        "type": "FormFieldSchema[]",
        "default": "[]",
        "required": true,
        "description": "Her tekrar satirinda gosterilecek alan schema dizisi."
      },
      {
        "name": "value",
        "type": "Record<string, any>[]",
        "default": "[]",
        "required": false,
        "description": "Mevcut satir degerleri dizisi (controlled mod)."
      },
      {
        "name": "onChange",
        "type": "(value: Record<string, any>[]) => void",
        "default": "-",
        "required": false,
        "description": "Satir eklendiginde, cikarildiginda veya degistiginde tetiklenen callback."
      },
      {
        "name": "minItems",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Minimum satir sayisi."
      },
      {
        "name": "maxItems",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Maksimum satir sayisi."
      },
      {
        "name": "addLabel",
        "type": "string",
        "default": "Ekle",
        "required": false,
        "description": "Yeni satir ekleme butonunun etiket metni."
      },
      {
        "name": "reorderable",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Satirlarin surukle-birak ile yeniden siralanabilmesini aktif eder."
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
        "description": "Alan grubu boyut varyantini belirler."
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
      "dynamic row add/remove",
      "drag-to-reorder interaction",
      "min/max limit enforcement"
    ],
    "regressionFocus": [
      "min/max sinir kontrolu dogrulugu",
      "satir silme sonrasi indeks guncelleme",
      "drag reorder callback dogrulugu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

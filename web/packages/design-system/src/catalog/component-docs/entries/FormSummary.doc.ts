import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FormSummary",
  indexItem: {
    "name": "FormSummary",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_form_builder",
    "subgroup": "form_builder",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "X-FormBuilder Summary",
    "demoMode": "planned",
    "description": "Form verilerinin gonderim oncesi ozet gorunumunu sunan display bileseni; alan bazli deger listesi ve duzenleme baglantilari saglar.",
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
    "importStatement": "import { FormSummary } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FormSummary",
    "variantAxes": [
      "layout: list | grid | sections",
      "editable: true | false"
    ],
    "stateModel": [
      "default",
      "loading",
      "empty"
    ],
    "previewStates": [
      "list-layout",
      "grid-layout",
      "with-edit-links",
      "empty-fields",
      "dark-theme"
    ],
    "behaviorModel": [
      "field-value pair rendering",
      "section grouping",
      "edit link navigation",
      "empty field handling",
      "value formatting",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "fields",
        "type": "FormSummaryField[]",
        "default": "[]",
        "required": true,
        "description": "Ozet gorunumunde listelenecek alan-deger ciftleri dizisi."
      },
      {
        "name": "layout",
        "type": "'list' | 'grid' | 'sections'",
        "default": "list",
        "required": false,
        "description": "Ozet gosterim duzeni."
      },
      {
        "name": "editable",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Her alan yaninda duzenleme baglantisi gosterir."
      },
      {
        "name": "onEditField",
        "type": "(fieldName: string) => void",
        "default": "-",
        "required": false,
        "description": "Duzenleme baglantisina tiklandiginda tetiklenen callback."
      },
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Ozet bolumu baslik metni."
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
        "description": "Ozet paneli boyut varyantini belirler."
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
      "field-value pair layout",
      "edit link interaction",
      "section grouping"
    ],
    "regressionFocus": [
      "bos alan gosterim durumu",
      "duzenleme baglantisi navigasyon",
      "layout varyant gecisleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

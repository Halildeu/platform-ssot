import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Select",
  indexItem: {
  "name": "Select",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "select",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Select / Dropdown / Combobox",
  "demoMode": "live",
  "description": "Arama gerekmeyen committed secim listelerini native popup, grouped context ve selected metadata badge ile sunar; advanced arama/async akislari icin canonical upgrade path Combobox'tir.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-12",
    "forms",
    "beta",
    "select"
  ],
  "importStatement": "import { Select } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Select",
  "variantAxes": [
    "mode: controlled",
    "placeholder: on | off",
    "access: full | readonly | disabled | hidden",
    "selection-meta: auto | hidden",
    "group-description: on | off"
  ],
  "stateModel": [
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "error",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "selected value",
      "placeholder option visibility",
      "readonly/disabled interaction guard",
      "option disabled state",
      "selected metadata badge",
      "selected group context"
    ],
  "props": [
    {
      "name": "value",
      "type": "string",
      "default": "-",
      "required": true,
      "description": "Controlled secim state'ini tanimlar."
    },
    {
      "name": "onChange",
      "type": "(value: string) => void",
      "default": "-",
      "required": true,
      "description": "Secim degisim callback'i."
    },
    {
      "name": "options",
      "type": "Array<{ label; value; description?; metaLabel?; tone? } | { label; description?; options[] }>",
      "default": "[]",
      "required": true,
      "description": "Native select icin committed option listesi sunar; option ve group seviyesinde description ve selected-state metadata destekler."
    },
    {
      "name": "label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilirlik icin aria-label degeri."
    },
    {
      "name": "helperText",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Alan altinda gosterilen yardimci metin."
    },
    {
      "name": "error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Dogrulama geri bildirimi."
    },
    {
      "name": "readOnly",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native readonly davranisini aktif eder."
    },
    {
      "name": "placeholder",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Deger secilmeden once gizli/disabled placeholder option gosterir."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve interaction kontrolu."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Tooltip/title nedeni icin aciklama metni."
    },
    {
      "name": "showSelectionMeta",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Secili option'in metaLabel veya groupLabel degerini trigger icinde badge olarak gosterir."
    },
    {
      "name": "clearable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Secimi temizleme davranisini acar."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Chevron yerine yukleme gostergesi render eder ve select'i devre disi birakir."
    },
    {
      "name": "fullWidth",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Parent genisligine yayilmayi kontrol eder."
    },
    {
      "name": "slotProps",
      "type": "SlotProps<SelectSlot>",
      "default": "-",
      "required": false,
      "description": "Internal slot elementlerinde className, style vb. override imkani saglar."
    },
    {
      "name": "emptyStateLabel",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Bos durumda helper metin uretme davranisi."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "controlled selection",
    "placeholder-first flow",
    "readonly and disabled states",
    "grouped option context",
    "selected metadata badge"
  ],
  "regressionFocus": [
    "onChange access guard",
    "placeholder option parity",
    "option disabled semantics",
    "selected metadata visibility",
    "group description fallback"
  ]
},
};

export default entry;

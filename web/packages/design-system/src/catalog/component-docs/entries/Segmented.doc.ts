import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Segmented",
  indexItem: {
  "name": "Segmented",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "navigation",
  "subgroup": "segmented_toggle",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Segmented / Toggle Group",
  "demoMode": "live",
  "description": "Tekli veya coklu secim gerektiren navigation ve filter akislarina segmented control primitive'i sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
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
    "wave-2",
    "navigation",
    "beta",
    "selection"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { Segmented } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/Segmented.stories.tsx"
  ]
},
  apiItem: {
  "name": "Segmented",
  "variantAxes": [
    "selection: single | multiple",
    "orientation: horizontal | vertical",
    "size: sm | md | lg",
    "layout: default | full-width",
    "surface: default | outline | ghost",
    "shape: rounded-sm | pill",
    "content: label | label-description | icon-label | icon-badge"
  ],
  "stateModel": [
    "disabled",
    "controlled selection"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "multi-select",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled selection",
      "single exclusive selection",
      "multiple toggle selection",
      "nullable exclusive deselect",
      "roving focus keyboard navigation",
      "readonly or disabled interaction guard",
      "item-level class override",
      "route or filter adapter compatibility",
      "preset recipe composition"
    ],
  "props": [
    {
      "name": "items",
      "type": "SegmentedItem[]",
      "default": "-",
      "required": true,
      "description": "Label, icon, description ve disabled bilgisini tasiyan secim listesi."
    },
    {
      "name": "value",
      "type": "string | string[]",
      "default": "-",
      "required": false,
      "description": "Controlled secim state'i."
    },
    {
      "name": "defaultValue",
      "type": "string | string[]",
      "default": "-",
      "required": false,
      "description": "Uncontrolled secim state'i."
    },
    {
      "name": "onValueChange",
      "type": "(value: string | string[]) => void",
      "default": "-",
      "required": false,
      "description": "Secim degisim callback'i."
    },
    {
      "name": "selectionMode",
      "type": "'single' | 'multiple'",
      "default": "'single'",
      "required": false,
      "description": "Segmented control'un exclusive veya coklu toggle davranisini belirler."
    },
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "default": "horizontal",
      "required": false,
      "description": "Yuzeyin yerlesim yonunu belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Hit target boyutunu belirler."
    },
    {
      "name": "fullWidth",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Genislik dagilimini kontrol eder."
    },
    {
      "name": "appearance",
      "type": "'default' | 'outline' | 'ghost'",
      "default": "default",
      "required": false,
      "description": "Surface tonunu belirler."
    },
    {
      "name": "shape",
      "type": "'rounded' | 'pill'",
      "default": "rounded",
      "required": false,
      "description": "Koseli veya pill formunu belirler."
    },
    {
      "name": "iconPosition",
      "type": "'start' | 'end' | 'top'",
      "default": "start",
      "required": false,
      "description": "Ikon yerlesimini belirler."
    },
    {
      "name": "allowEmptySelection",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Single modda secimin sifirlanabilmesini belirler."
    },
    {
      "name": "ariaLabel",
      "type": "string",
      "default": "Segmented control",
      "required": false,
      "description": "A11y landmark adi."
    },
    {
      "name": "classes",
      "type": "SegmentedClasses",
      "default": "-",
      "required": false,
      "description": "Dar slot class override yuzeyi."
    },
    {
      "name": "variant",
      "type": "'default' | 'outline' | 'ghost'",
      "default": "default",
      "required": false,
      "description": "Surface tonunu belirler. appearance icin modern alias."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim seviyesi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "adapter helpers",
      "type": "createSegmentedItemsFromRoutes / createSegmentedItemsFromFilters / createSegmentedPreset / resolveSegmentedNextValue",
      "default": "-",
      "required": false,
      "description": "Route/filter girdilerini canonical item listesine donusturmek, preset cikarimi yapmak ve secim sonucunu deterministic sekilde hesaplamak icin kullanilir."
    }
  ],
  "previewFocus": [
    "exclusive segmented navigation",
    "multi-select filter chips",
    "vertical choice stack",
    "outline or ghost surface with badges",
    "route and filter adapter recipes"
  ],
  "regressionFocus": [
    "radio vs button semantics parity",
    "arrow key roving focus",
    "readonly and disabled guard",
    "controlled value sync",
    "nullable exclusive deselect",
    "icon and badge layout parity",
    "item-level class contract",
    "route current badge mapping",
    "filter count badge normalization",
    "preset output parity"
  ]
},
};

export default entry;

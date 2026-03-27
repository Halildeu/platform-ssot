import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "NavigationRail",
  indexItem: {
  "name": "NavigationRail",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "menu_navigation",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Navigation Rail",
  "demoMode": "live",
  "description": "Top-level uygulama destinasyonlari icin soldan erisilen, badge ve icon destekli navigation rail primitive'i sunar.",
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
    "layout"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { NavigationRail } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/NavigationRail.stories.tsx"
  ]
},
  apiItem: {
  "name": "NavigationRail",
  "variantAxes": [
    "density: sm | md",
    "layout: regular | compact",
    "alignment: start | center",
    "surface: default | outline | ghost",
    "label-visibility: always | active | none",
    "content: icon | icon-label | icon-label-description | icon-badge"
  ],
  "stateModel": [
    "controlled or uncontrolled active destination",
    "currentPath-based route selection",
    "roving focus keyboard navigation",
    "click or enter activation",
    "readonly or disabled interaction guard",
    "footer slot composition",
    "helper-driven destination normalization"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "compact-icon-rail",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled active destination",
      "currentPath-based route selection",
      "roving focus keyboard navigation",
      "click or enter activation",
      "readonly or disabled interaction guard",
      "footer slot composition",
      "helper-driven destination normalization"
    ],
  "props": [
    {
      "name": "items",
      "type": "NavigationRailItem[]",
      "default": "-",
      "required": true,
      "description": "Icon, label, description, badge ve disabled bilgisini tasiyan top-level navigation item listesi."
    },
    {
      "name": "value / defaultValue / onValueChange",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled aktif destination state'ini yonetir."
    },
    {
      "name": "compact / size / align / appearance / labelVisibility",
      "type": "boolean / 'sm' | 'md' / 'start' | 'center' / 'default' | 'outline' | 'ghost' / 'always' | 'active' | 'none'",
      "default": "false / 'md' / 'start' / 'default' / 'always'",
      "required": false,
      "description": "Rail'in ikon-odakli mini modunu, hit target boyutunu, dikey hizasini, surface tonunu ve label gorunurluk politikasini belirler."
    },
    {
      "name": "currentPath / items[].href / items[].matchPath",
      "type": "string / string / string | string[]",
      "default": "- / - / -",
      "required": false,
      "description": "Route-aware kullanimi destekler; mevcut path'e gore aktif destination'i canonical olarak secmeye yardim eder."
    },
    {
      "name": "footer",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Rail'in altinda secondary action veya settings alani icin ek slot sunar."
    },
    {
      "name": "helper exports",
      "type": "createNavigationDestinationItems / createNavigationRailPreset / resolveNavigationRailActiveValue",
      "default": "-",
      "required": false,
      "description": "Route girdilerini rail item dizisine normalize etmek, canonical preset cikarmak ve aktif destination'i deterministik sekilde hesaplamak icin kullanilir."
    },
    {
      "name": "ariaLabel / classes / access",
      "type": "string / NavigationRailClasses / 'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "'Navigation rail' / - / 'full'",
      "required": false,
      "description": "Navigation landmark adini, dar slot class override yuzeyini ve policy tabanli gorunurluk/etkilesim seviyesini tanimlar."
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
    "primary app destinations",
    "compact icon rail",
    "badge-backed destination state",
    "route-aware active destination",
    "footer-backed secondary action zone",
    "preset-backed side navigation"
  ],
  "regressionFocus": [
    "aria-current parity",
    "arrow key focus roving",
    "readonly and disabled guard",
    "compact accessibility label",
    "currentPath route selection",
    "active-only label visibility",
    "helper output parity"
  ]
},
};

export default entry;

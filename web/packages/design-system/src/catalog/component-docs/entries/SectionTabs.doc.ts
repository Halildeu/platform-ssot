import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SectionTabs",
  indexItem: {
  "name": "SectionTabs",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "tabs",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Tabs",
  "demoMode": "live",
  "description": "Uzun aciklamali bolum sekmelerini kompakt, yatay scroll odakli bir section-level tab shell'inde toplar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "responsive_layout"
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
  "importStatement": "import { SectionTabs } from '@mfe/design-system';",
  "whereUsed": [
    "web/packages/design-system/src/components/DetailSectionTabs.tsx",
    "web/stories/SectionTabs.stories.tsx"
  ]
},
  apiItem: {
  "name": "SectionTabs",
  "variantAxes": [
    "density: compact | comfortable",
    "layout: scroll | wrap | auto",
    "descriptionVisibility: always | hover | active | active-or-hover",
    "descriptionDisplay: inline | tooltip",
    "content: label | label-description | label-badge",
    "surface: compact pill tabs"
  ],
  "stateModel": [
    "controlled or uncontrolled active section",
    "single exclusive selection",
    "segmented-backed roving focus keyboard navigation",
    "horizontal scroll viewport or breakpoint-driven auto wrap",
    "readonly or hidden interaction guard"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "scroll-viewport",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled or uncontrolled active section",
      "single exclusive selection",
      "segmented-backed roving focus keyboard navigation",
      "horizontal scroll viewport or breakpoint-driven auto wrap",
      "readonly or hidden interaction guard"
    ],
  "props": [
    {
      "name": "items",
      "type": "SectionTabsItem[]",
      "default": "-",
      "required": true,
      "description": "Value, label, description, badge ve disabled bilgisini tasiyan section tab listesi."
    },
    {
      "name": "value / defaultValue / onValueChange",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled aktif section state'ini yonetir."
    },
    {
      "name": "density / layout / autoWrapBreakpoint / descriptionVisibility / descriptionDisplay",
      "type": "'compact' | 'comfortable' / 'scroll' | 'wrap' | 'auto' / SectionTabsBreakpoint / 'always' | 'hover' | 'active' | 'active-or-hover' / 'inline' | 'tooltip'",
      "default": "'compact' / 'scroll' / '2xl' / 'active-or-hover' / 'tooltip'",
      "required": false,
      "description": "Tab shell'inin dikey yogunlugunu, yatay scroll mu yoksa auto-wrap mi kullanacagini ve aciklamanin inline mi yoksa kucuk floating hint kapsulu olarak mi gosterilecegini belirler."
    },
    {
      "name": "ariaLabel / classes / className",
      "type": "string / SectionTabsClasses / string",
      "default": "'Section tabs' / - / -",
      "required": false,
      "description": "A11y tablist adini, viewport ve segmented slot'lari icin dar class override yuzeyini ve root sinifini belirler."
    },
    {
      "name": "access / accessReason",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden' / string",
      "default": "'full' / -",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim seviyesini tanimlar."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Additional CSS class for custom styling."
    }
  ],
  "previewFocus": [
    "compact detail-tab shell",
    "horizontal scroll section navigation",
    "floating description hint capsule",
    "auto layout breakpoint fallback"
  ],
  "regressionFocus": [
    "active section parity",
    "test-id passthrough",
    "scroll viewport presence",
    "description tooltip visibility policy",
    "auto layout contract",
    "hidden access guard"
  ]
},
};

export default entry;

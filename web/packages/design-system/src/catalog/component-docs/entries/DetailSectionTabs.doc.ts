import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DetailSectionTabs",
  indexItem: {
  "name": "DetailSectionTabs",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "page_blocks",
  "subgroup": "recipes",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Tabs",
  "demoMode": "live",
  "description": "SectionTabs primitive'ini documentation ve detail workspace'leri icin opinionated bir section navigation recipe'ine donusturur.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
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
    "wave-11",
    "recipes",
    "beta",
    "navigation"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1",
  "importStatement": "import { DetailSectionTabs } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/stories/DetailSectionTabs.stories.tsx"
  ]
},
  apiItem: {
  "name": "DetailSectionTabs",
  "variantAxes": [
    "density: compact | comfortable",
    "sticky: true | false",
    "layout: auto wrap threshold",
    "description: floating hint tooltip"
  ],
  "stateModel": [
    "controlled active detail section",
    "single exclusive selection",
    "SectionTabs-backed roving focus",
    "sticky detail navigation shell"
  ],
    "previewStates": ["sticky-navigation", "tooltip-description", "auto-wrap", "dark-theme"],
    "behaviorModel": [
      "controlled active detail section",
      "single exclusive selection",
      "SectionTabs-backed roving focus",
      "sticky detail navigation shell"
    ],
  "props": [
    {
      "name": "tabs",
      "type": "DetailSectionTabItem[]",
      "default": "-",
      "required": true,
      "description": "Id, label, description, badge ve disabled kararlarini tasiyan detail tab listesi."
    },
    {
      "name": "activeTabId / onTabChange",
      "type": "string / (tabId: string) => void",
      "default": "- / -",
      "required": true,
      "description": "Aktif detail section state'ini recipe seviyesinde yonetir."
    },
    {
      "name": "density / autoWrapBreakpoint / sticky",
      "type": "'compact' | 'comfortable' / SectionTabsBreakpoint / boolean",
      "default": "'compact' / 'xl' / true",
      "required": false,
      "description": "Detay sekmelerinin yogunlugunu, auto-wrap esigini ve sticky davranisini belirler."
    },
    {
      "name": "ariaLabel / testIdPrefix / className / classes",
      "type": "string / string / string / SectionTabsClasses",
      "default": "'Detay sekmeleri' / - / - / -",
      "required": false,
      "description": "A11y tablist adini, test id yuzeyini ve dar class override katmanini tasir."
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
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "design lab detail workspace tabs",
    "tooltip-based compact description hints",
    "earlier auto-wrap breakpoint"
  ],
  "regressionFocus": [
    "detail tab selection parity",
    "sticky shell contract",
    "test-id passthrough",
    "tooltip hint visibility"
  ]
},
};

export default entry;

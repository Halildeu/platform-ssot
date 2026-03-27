import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PageHeader",
  indexItem: {
  "name": "PageHeader",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "page_blocks",
  "subgroup": "page_shell",
  "taxonomyGroupId": "page_blocks",
  "taxonomySubgroup": "Page Shell",
  "demoMode": "live",
  "description": "Title, description, status, meta ve action alanlarini tek page header shell icinde toplar.",
  "sectionIds": [
    "component_library_management",
    "responsive_layout",
    "navigation_patterns"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "doctor_frontend_evidence"
  ],
  "tags": [
    "wave-7",
    "page-blocks",
    "beta",
    "header",
    "page-shell"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_7_page_blocks",
  "acceptanceContractId": "ui-library-wave-7-page-blocks-v1",
  "importStatement": "import { PageHeader } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "PageHeader",
  "variantAxes": [
    "density: compact | default",
    "align: start | center",
    "status: none | badge",
    "actions: none | dual-cta | aside | responsive-stack",
    "navigation: plain | breadcrumb | back-action",
    "footer: none | contract-strip",
    "secondary-nav: none | tab-strip"
  ],
  "stateModel": [
    "meta chip rendering",
    "tag helper rendering",
    "stat helper rendering",
    "status badge presence",
    "subtitle presence",
    "breadcrumb visibility",
    "back action visibility",
    "align centered layout",
    "footer slot presence",
    "secondary nav presence",
    "responsive action stacking",
    "slot class passthrough",
    "action wrap",
    "aside stacking"
  ],
    "previewStates": [
      "loading",
      "compact",
      "dark-theme"
    ],
    "behaviorModel": [
      "meta chip rendering",
      "tag helper rendering",
      "stat helper rendering",
      "status badge presence",
      "subtitle presence",
      "breadcrumb visibility",
      "back action visibility",
      "align centered layout",
      "footer slot presence",
      "secondary nav presence",
      "responsive action stacking",
      "slot class passthrough",
      "action wrap",
      "aside stacking"
    ],
  "props": [
    {
      "name": "breadcrumb / backAction",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Ust seviye navigasyon ve geri donus aksiyonu."
    },
    {
      "name": "eyebrow / title / subtitle / description",
      "type": "ReactNode",
      "default": "-",
      "required": true,
      "description": "Header bilgi hiyerarsisini kurar."
    },
    {
      "name": "meta",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Chip veya metadata slotu."
    },
    {
      "name": "tagItems / statItems",
      "type": "PageHeaderTagItem[] / PageHeaderStatItem[]",
      "default": "[]",
      "required": false,
      "description": "Hazir badge ve metric helper yuzeyi."
    },
    {
      "name": "status",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Title yanindaki durum sinyali."
    },
    {
      "name": "actions / aside",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Sag alandaki CTA ve yardimci panel slotlari."
    },
    {
      "name": "footer",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Header altindaki ikinci seviye kontrat veya nav stripi."
    },
    {
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Header yogunlugunu dusurur."
    },
    {
      "name": "secondaryNav / classes",
      "type": "ReactNode / PageHeaderClasses",
      "default": "-",
      "required": false,
      "description": "Tab-strip benzeri ikincil navigasyon ve dar slot class override yuzeyi."
    },
    {
      "name": "align / responsiveActions / ariaLabel",
      "type": "'start' | 'center' / boolean / string",
      "default": "'start' / false / 'page-header'",
      "required": false,
      "description": "Yerlesim hizasini, aksiyon stack heuristigini ve section landmark adini belirler."
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
      "description": "Header boyut varyanti."
    }
  ],
  "previewFocus": [
    "release page header",
    "compact detail header",
    "status + actions shell",
    "breadcrumb + back action header",
    "stat helper + footer strip",
    "secondary nav with tabs"
  ],
  "regressionFocus": [
    "header wrap parity",
    "meta chip overflow",
    "aside alignment",
    "breadcrumb and back action spacing",
    "center alignment shell",
    "footer separator spacing",
    "responsive action stacking",
    "secondary nav spacing",
    "slot class passthrough"
  ]
},
};

export default entry;

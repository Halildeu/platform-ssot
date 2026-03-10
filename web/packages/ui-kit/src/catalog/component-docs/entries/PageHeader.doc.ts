import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PageHeader",
  indexItem: {
  "name": "PageHeader",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
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
  "importStatement": "import { PageHeader } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "PageHeader",
  "variantAxes": [
    "density: compact | default",
    "status: none | badge",
    "actions: none | dual-cta | aside"
  ],
  "stateModel": [
    "meta chip rendering",
    "status badge presence",
    "action wrap",
    "aside stacking"
  ],
  "props": [
    {
      "name": "eyebrow / title / description",
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
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Header yogunlugunu dusurur."
    }
  ],
  "previewFocus": [
    "release page header",
    "compact detail header",
    "status + actions shell"
  ],
  "regressionFocus": [
    "header wrap parity",
    "meta chip overflow",
    "aside alignment"
  ]
},
};

export default entry;

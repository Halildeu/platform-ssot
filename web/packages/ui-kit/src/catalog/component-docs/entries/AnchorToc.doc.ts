import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AnchorToc",
  indexItem: {
  "name": "AnchorToc",
  "kind": "component",
  "importStatement": "import { AnchorToc } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "navigation",
  "subgroup": "anchor-toc",
  "tags": [
    "beta",
    "contextual-navigation",
    "navigation",
    "wave-2"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Anchor / Table of contents",
  "demoMode": "live",
  "description": "AnchorToc primitivei; uzun sayfa, policy ve docs-site akislari icin derin link ve aktif heading navigation davranisini tek API ile sunar.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "deep_link_and_shareable_state",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1"
},
  apiItem: {
  "name": "AnchorToc",
  "variantAxes": [
    "density: comfortable | compact",
    "layout: static | sticky",
    "mode: controlled | uncontrolled"
  ],
  "stateModel": [
    "active section",
    "hash sync",
    "disabled item",
    "hierarchical depth"
  ],
  "props": [
    {
      "name": "items",
      "type": "AnchorTocItem[]",
      "default": "-",
      "required": true,
      "description": "Her heading icin id, label, level, meta ve disabled bilgisini tasir."
    },
    {
      "name": "value / defaultValue",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Controlled veya uncontrolled aktif bolum secimi."
    },
    {
      "name": "syncWithHash",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Deep-link ve shareable hash state davranisini acar."
    },
    {
      "name": "sticky",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uzun policy/docs ekranlarinda sabit navigation paneli davranisi saglar."
    },
    {
      "name": "density",
      "type": "'comfortable' | 'compact'",
      "default": "comfortable",
      "required": false,
      "description": "Bilgi yogunluguna gore spacing kararini belirler."
    }
  ],
  "previewFocus": [
    "policy outline",
    "hash sync + active heading",
    "hierarchical depth"
  ],
  "regressionFocus": [
    "aria-current location",
    "hash persistence",
    "disabled anchor guard"
  ]
},
};

export default entry;

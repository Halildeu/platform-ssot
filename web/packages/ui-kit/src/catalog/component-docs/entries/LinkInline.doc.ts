import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "LinkInline",
  indexItem: {
  "name": "LinkInline",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "content",
  "subgroup": "link",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Link",
  "demoMode": "live",
  "description": "Inline link primitivei; internal, external ve current-state davranisini ortak API ile verir.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "link"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { LinkInline } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "LinkInline",
  "variantAxes": [
    "tone: primary | secondary",
    "underline: always | hover | none",
    "state: internal | external | current | blocked"
  ],
  "stateModel": [
    "current",
    "disabled",
    "readonly-access",
    "external"
  ],
  "props": [
    {
      "name": "href",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Blocked durumda span fallback render edilir."
    },
    {
      "name": "tone",
      "type": "'primary' | 'secondary'",
      "default": "primary",
      "required": false,
      "description": "Link'in semantic gorunurluk seviyesi."
    },
    {
      "name": "underline",
      "type": "'always' | 'hover' | 'none'",
      "default": "hover",
      "required": false,
      "description": "Underline davranisi ve information scent seviyesi."
    },
    {
      "name": "current / external / disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Current page, harici baglanti ve blocked fallback durumlari."
    },
    {
      "name": "leadingVisual / trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline icon veya arrow slotlari."
    }
  ],
  "previewFocus": [
    "internal vs external",
    "current vs blocked",
    "secondary tone"
  ],
  "regressionFocus": [
    "external target/rel guvenligi",
    "focus-visible ve current-state semantics",
    "blocked state ile normal text ayrisimi"
  ]
},
};

export default entry;

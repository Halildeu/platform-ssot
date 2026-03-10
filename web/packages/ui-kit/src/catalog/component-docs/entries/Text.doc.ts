import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Text",
  indexItem: {
  "name": "Text",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "content",
  "subgroup": "text",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Typography",
  "demoMode": "live",
  "description": "Tipografi primitivei; semantic preset, tone, clamp/truncate ve mono davranisini tek API ile verir.",
  "sectionIds": [
    "component_library_management",
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
    "stable",
    "typography"
  ],
  "uxPrimaryThemeId": "accessibility_and_inclusive_design",
  "uxPrimarySubthemeId": "contrast_typography_readability",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Text } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/features/theme/theme-matrix-gallery.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/ThemeAdminPage.tsx",
    "web/apps/mfe-shell/src/pages/runtime/ThemeMatrixPage.tsx"
  ]
},
  apiItem: {
  "name": "Text",
  "variantAxes": [
    "preset: display | heading | title | body | body-sm | caption | mono",
    "variant: primary | secondary | muted | success | danger",
    "wrap: wrap | nowrap | pretty | balance"
  ],
  "stateModel": [
    "truncate",
    "clampLines",
    "align",
    "tabularNums",
    "mono"
  ],
  "props": [
    {
      "name": "preset",
      "type": "'display' | 'heading' | 'title' | 'body' | 'body-sm' | 'caption' | 'mono'",
      "default": "body-sm",
      "required": false,
      "description": "Semantic typography preset'i ve line-height kararini belirler."
    },
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'muted' | 'success' | 'danger'",
      "default": "primary",
      "required": false,
      "description": "Semantic tone katmani."
    },
    {
      "name": "wrap",
      "type": "'wrap' | 'nowrap' | 'pretty' | 'balance'",
      "default": "wrap",
      "required": false,
      "description": "Uzun kopya satir dagilimi kararini belirler."
    },
    {
      "name": "truncate / clampLines",
      "type": "boolean / number",
      "default": "false / -",
      "required": false,
      "description": "Single-line ve multi-line overflow davranisi."
    },
    {
      "name": "align",
      "type": "'left' | 'center' | 'right'",
      "default": "left",
      "required": false,
      "description": "Metin hizalama karari."
    },
    {
      "name": "tabularNums",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Finansal ve sayisal kolonlarda sabit rakam genisligi saglar."
    }
  ],
  "previewFocus": [
    "semantic scale",
    "tone ve emphasis",
    "pretty wrap + tabular nums"
  ],
  "regressionFocus": [
    "contrast ve readability",
    "clamp/truncate overflow",
    "theme axis gecislerinde semantic typography"
  ]
},
};

export default entry;

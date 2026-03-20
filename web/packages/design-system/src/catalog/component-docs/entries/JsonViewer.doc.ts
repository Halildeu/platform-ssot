import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "JsonViewer",
  indexItem: {
  "name": "JsonViewer",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "data_display",
  "subgroup": "json_viewer",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Code / JSON viewer",
  "demoMode": "live",
  "description": "Kontrat, kanıt ve yapılandırma payloadlarını okunur ağaç görünümüyle gösteren JSON viewer primitivei.",
  "sectionIds": [
    "table_data_display",
    "documentation_standards",
    "integration_distribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "tags": [
    "wave-4",
    "data-display",
    "beta",
    "json-viewer"
  ],
  "uxPrimaryThemeId": "trust_privacy_security_ux",
  "uxPrimarySubthemeId": "user_visible_audit_log",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { JsonViewer } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "JsonViewer",
  "variantAxes": [
    "depth: collapsed | progressive expand",
    "surface: default | constrained height",
    "type badges: on | off"
  ],
  "stateModel": [
    "undefined / empty payload",
    "nested expand-collapse",
    "readonly contract snapshot"
  ],
    "previewStates": [
      "loading",
      "compact",
      "dark-theme"
    ],
    "behaviorModel": [
      "undefined / empty payload",
      "nested expand-collapse",
      "readonly contract snapshot"
    ],
  "props": [
    {
      "name": "value",
      "type": "unknown",
      "default": "-",
      "required": true,
      "description": "Gösterilecek payload; primitive, object veya array olabilir."
    },
    {
      "name": "rootLabel",
      "type": "string",
      "default": "payload",
      "required": false,
      "description": "Ağaç kökünde gösterilecek label."
    },
    {
      "name": "defaultExpandedDepth",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "İlk açılışta hangi derinliğe kadar expanded gösterileceğini belirler."
    },
    {
      "name": "maxHeight",
      "type": "number | string",
      "default": "420",
      "required": false,
      "description": "Uzun payloadlarda scrollable viewer yüksekliği."
    },
    {
      "name": "showTypes",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Primitive ve node type badge gösterimini açar."
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
      "description": "Viewer boyut varyanti."
    }
  ],
  "previewFocus": [
    "release evidence payload",
    "policy snapshot",
    "undefined / primitive fallback"
  ],
  "regressionFocus": [
    "nested node toggle",
    "empty payload handling",
    "type badge rendering"
  ]
},
};

export default entry;

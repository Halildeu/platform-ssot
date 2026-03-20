import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Avatar",
  indexItem: {
  "name": "Avatar",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "content",
  "subgroup": "identity",
  "taxonomyGroupId": "general",
  "taxonomySubgroup": "Avatar & Identity",
  "demoMode": "live",
  "description": "Identity primitivei; image, initials ve fallback icon davranisini gizlilik varsayimlariyla sunar.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "tags": [
    "wave-1",
    "foundation-primitives",
    "beta",
    "identity"
  ],
  "uxPrimaryThemeId": "trust_privacy_security_ux",
  "uxPrimarySubthemeId": "privacy_by_design_defaults",
  "roadmapWaveId": "wave_1_foundation_primitives",
  "acceptanceContractId": "ui-library-wave-1-foundation-primitives-v1",
  "importStatement": "import { Avatar } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "Avatar",
  "variantAxes": [
    "size: xs | sm | md | lg | xl | 2xl",
    "shape: circle | square",
    "fallback: image | initials | icon"
  ],
  "stateModel": [
    "image-loaded",
    "broken-image-fallback",
    "privacy-safe-identity"
  ],
    "previewStates": [
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "image-loaded",
      "broken-image-fallback",
      "privacy-safe-identity"
    ],
  "props": [
    {
      "name": "src",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Profil görseli kaynağı; hata durumunda fallback devreye girer."
    },
    {
      "name": "initials",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Image fallback icin 1-2 karakter initials."
    },
    {
      "name": "alt",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilir label kaynagi."
    },
    {
      "name": "size",
      "type": "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
      "default": "md",
      "required": false,
      "description": "Kimlik yoğunluğu ve avatar hacmi."
    },
    {
      "name": "shape",
      "type": "'circle' | 'square'",
      "default": "circle",
      "required": false,
      "description": "Kimlik yüzey geometrisi."
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Image ve initials yerine gösterilecek kontrollü icon fallback."
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
    "size matrisi",
    "image / initials / icon fallback",
    "square kimlik varyantı"
  ],
  "regressionFocus": [
    "broken image sonrası deterministic fallback",
    "fallback metadata",
    "privacy-safe identity rendering"
  ]
},
};

export default entry;

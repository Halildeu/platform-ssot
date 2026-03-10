import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Avatar",
  indexItem: {
  "name": "Avatar",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
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
  "importStatement": "import { Avatar } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "Avatar",
  "variantAxes": [
    "size: sm | md | lg | xl",
    "shape: circle | square",
    "fallback: image | initials | icon"
  ],
  "stateModel": [
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
      "name": "name / alt",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Initials üretimi ve erişilebilir label kaynağı."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg' | 'xl'",
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
      "name": "fallbackIcon",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Image ve initials yerine gösterilecek kontrollü icon fallback."
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

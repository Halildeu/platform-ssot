import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "LinkInline",
  indexItem: {
  "name": "LinkInline",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
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
  "importStatement": "import { LinkInline } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "LinkInline",
  "variantAxes": [
    "variant: primary | secondary",
    "underline: always | hover | none",
    "state: internal | external | current | blocked"
  ],
  "stateModel": [
    "disabled",
    "current"
  ],
    "previewStates": [
      "disabled",
      "external",
      "current-page",
      "dark-theme"
    ],
    "behaviorModel": [
      "current",
      "readonly-access",
      "theme-aware token resolution"
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
      "name": "variant",
      "type": "'primary' | 'secondary'",
      "default": "primary",
      "required": false,
      "description": "Link'in semantic gorunurluk seviyesi. Eski isim: tone (deprecated)."
    },
    {
      "name": "underline",
      "type": "'always' | 'hover' | 'none'",
      "default": "hover",
      "required": false,
      "description": "Underline davranisi ve information scent seviyesi."
    },
    {
      "name": "current",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Current page durumu."
    },
    {
      "name": "external",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Harici baglanti durumu."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Blocked fallback durumu."
    },
    {
      "name": "leadingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline on icon slotu."
    },
    {
      "name": "trailingVisual",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Inline arka icon veya arrow slotu."
    },
    {
      "name": "asChild",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Slot uzerinden child element'e LinkInline propslarini aktarir; router Link bilesenleri ile kompozisyon icin kullanilir."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve etkilesim duzeyi."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisim kisitlamasi nedenini tooltip olarak gosterir."
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
      "description": "Bilesen boyut varyantini belirler."
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

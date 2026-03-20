import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AvatarGroup",
  indexItem: {
    "name": "AvatarGroup",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "content",
    "subgroup": "identity",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "Avatar & Identity",
    "demoMode": "live",
    "description": "Birden fazla avatar'i overlap gorseliyle gruplar; max siniri, excess badge ve access-control destegi sunar.",
    "sectionIds": [
      "component_library_management",
      "documentation_standards"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-2",
      "content",
      "stable",
      "identity"
    ],
    "importStatement": "import { AvatarGroup } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "AvatarGroup",
    "variantAxes": [
      "size: xs | sm | md | lg | xl",
      "shape: circle | square",
      "spacing: tight | normal | loose"
    ],
    "stateModel": [
      "excess count badge",
      "access-controlled interaction"
    ],
    "previewStates": [
      "disabled",
      "dark-theme"
    ],
    "behaviorModel": [
      "max item capping with +N badge",
      "overlap spacing via negative margin",
      "access-aware click interaction"
    ],
    "props": [
      {
        "name": "items",
        "type": "AvatarGroupItem[]",
        "default": "-",
        "required": true,
        "description": "Gosterilecek avatar ogeleri."
      },
      {
        "name": "max",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "+N badge'inden once gosterilecek maksimum avatar sayisi."
      },
      {
        "name": "size",
        "type": "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        "default": "md",
        "required": false,
        "description": "Avatar boyut varyanti."
      },
      {
        "name": "shape",
        "type": "'circle' | 'square'",
        "default": "circle",
        "required": false,
        "description": "Avatar sekil varyanti."
      },
      {
        "name": "spacing",
        "type": "'tight' | 'normal' | 'loose'",
        "default": "normal",
        "required": false,
        "description": "Overlap bosluk ayari."
      },
      {
        "name": "renderExcess",
        "type": "(count: number) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Excess count badge icin ozel renderer."
      },
      {
        "name": "onClick",
        "type": "(item: AvatarGroupItem) => void",
        "default": "-",
        "required": false,
        "description": "Avatar tiklandiginda cagrilacak callback."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      },
      {
        "name": "access",
        "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
        "default": "full",
        "required": false,
        "description": "Policy tabanli gorunurluk ve etkilesim kontrolu."
      }
    ],
    "previewFocus": [
      "size ve shape matrisi",
      "max + excess badge",
      "spacing varyantlari"
    ],
    "regressionFocus": [
      "excess badge rendering",
      "access-aware click guard",
      "overlap z-index ordering"
    ]
  },
};

export default entry;

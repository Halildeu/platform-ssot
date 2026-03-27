import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EmptyState",
  indexItem: {
    "name": "EmptyState",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "feedback",
    "subgroup": "empty",
    "taxonomyGroupId": "feedback",
    "taxonomySubgroup": "Empty & Placeholder",
    "demoMode": "live",
    "description": "Bos veri gorunum yer tutucusu; ikon, baslik, aciklama ve primary/secondary aksiyon slotlari sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment"
    ],
    "tags": [
      "wave-2",
      "feedback",
      "stable"
    ],
    "importStatement": "import { EmptyState } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EmptyState",
    "variantAxes": [
      "compact: true | false"
    ],
    "stateModel": [
      "access-controlled visibility"
    ],
    "previewStates": ["no-data", "error", "filtered-empty", "dark-theme"],
    "behaviorModel": [
      "compact vs full-size display",
      "access-aware hidden state"
    ],
    "props": [
      {
        "name": "icon",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Illustrasyon veya ikon."
      },
      {
        "name": "title",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Baslik metni."
      },
      {
        "name": "description",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Aciklama metni."
      },
      {
        "name": "action",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Primary aksiyon elementi (orn. Button)."
      },
      {
        "name": "secondaryAction",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Secondary aksiyon elementi."
      },
      {
        "name": "compact",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Inline kullanim icin kompakt varyant."
      },
      {
        "name": "access",
        "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
        "default": "full",
        "required": false,
        "description": "Policy tabanli gorunurluk kontrolu."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "'md'",
        "required": false,
        "description": "Component size variant."
      }
    ],
    "previewFocus": [
      "compact vs full-size",
      "icon + title + action composition",
      "inline usage"
    ],
    "regressionFocus": [
      "compact spacing consistency",
      "access-aware hidden rendering"
    ]
  },
};

export default entry;

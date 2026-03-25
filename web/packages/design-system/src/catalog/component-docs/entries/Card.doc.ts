import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Card",
  indexItem: {
    "name": "Card",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "layout",
    "subgroup": "container",
    "taxonomyGroupId": "page_blocks",
    "taxonomySubgroup": "Card & Container",
    "demoMode": "live",
    "description": "Elevated content container primitivei; variant, padding, hoverable ve slot-based polymorphism destegi sunar.",
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
      "stable",
      "layout"
    ],
    "importStatement": "import { Card, CardHeader, CardBody, CardFooter } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Card",
    "variantAxes": [
      "variant: elevated | outlined | filled | ghost",
      "padding: none | sm | md | lg"
    ],
    "stateModel": [
      "hoverable",
      "polymorphic rendering (asChild / as)"
    ],
    "previewStates": ["elevated", "outlined", "filled", "ghost", "hoverable", "dark-theme"],
    "behaviorModel": [
      "hoverable interaction effects",
      "polymorphic rendering via asChild / as",
      "slot-based sub-component composition"
    ],
    "props": [
      {
        "name": "variant",
        "type": "'elevated' | 'outlined' | 'filled' | 'ghost'",
        "default": "elevated",
        "required": false,
        "description": "Kart yuzey stilini belirler."
      },
      {
        "name": "padding",
        "type": "'none' | 'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Kart ic bosluk boyutunu belirler."
      },
      {
        "name": "hoverable",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Hover efektlerini aktif eder; cursor, shadow ve scale degisiklikleri uygular."
      },
      {
        "name": "as",
        "type": "'div' | 'button' | 'article' | 'section'",
        "default": "div",
        "required": false,
        "description": "Render edilecek HTML elementini belirler."
      },
      {
        "name": "asChild",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Slot bazli polymorphism; Card propslarini child elementa merge eder."
      },
      {
        "name": "slotProps",
        "type": "SlotProps<'root' | 'header' | 'body' | 'footer'>",
        "default": "-",
        "required": false,
        "description": "Internal slot elementlerine className, style vb. override yuzeyini saglar."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root elemana ek CSS sinifi."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Kart ici icerik; CardHeader, CardBody, CardFooter ile compose edilir."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Kart boyut varyanti."
      }
    ],
    "previewFocus": [
      "variant matrisi",
      "padding ve hoverable kombinasyonu",
      "asChild polymorphism"
    ],
    "regressionFocus": [
      "slot props override chain",
      "hoverable interaction feedback",
      "polymorphic element rendering"
    ]
  },
};

export default entry;

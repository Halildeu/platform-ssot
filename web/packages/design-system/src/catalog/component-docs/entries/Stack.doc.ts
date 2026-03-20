import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Stack",
  indexItem: {
    "name": "Stack",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "layout",
    "subgroup": "flexbox",
    "taxonomyGroupId": "layout",
    "taxonomySubgroup": "Stack & Spacing",
    "demoMode": "live",
    "description": "Flexbox layout primitivei; direction, align, justify, gap ve wrap ile tutarli spacing ve alignment sunar. HStack/VStack kolaylik wrapper'lari icerir.",
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
      "wave-1",
      "foundation-primitives",
      "stable",
      "layout"
    ],
    "importStatement": "import { Stack, HStack, VStack } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Stack",
    "variantAxes": [
      "direction: row | column | row-reverse | column-reverse",
      "gap: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12"
    ],
    "stateModel": [
      "responsive layout adaptation"
    ],
    "previewStates": ["horizontal", "vertical", "wrap", "dark-theme"],
    "behaviorModel": [
      "flexbox direction control",
      "alignment and justification",
      "gap spacing",
      "flex wrap toggle"
    ],
    "props": [
      {
        "name": "direction",
        "type": "'row' | 'column' | 'row-reverse' | 'column-reverse'",
        "default": "column",
        "required": false,
        "description": "Flex yonunu belirler."
      },
      {
        "name": "align",
        "type": "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
        "default": "-",
        "required": false,
        "description": "Cross-axis hizalama."
      },
      {
        "name": "justify",
        "type": "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
        "default": "-",
        "required": false,
        "description": "Main-axis hizalama."
      },
      {
        "name": "gap",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12",
        "default": "3",
        "required": false,
        "description": "Elemanlar arasi bosluk."
      },
      {
        "name": "wrap",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Flex wrap davranisini aktif eder."
      },
      {
        "name": "as",
        "type": "'div' | 'section' | 'article' | 'nav' | 'main' | 'aside' | 'ul' | 'ol'",
        "default": "div",
        "required": false,
        "description": "Render edilecek HTML elementini belirler."
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
      "direction ve gap matrisi",
      "align + justify kombinasyonlari",
      "HStack/VStack convenience API"
    ],
    "regressionFocus": [
      "gap consistency across directions",
      "polymorphic element rendering"
    ]
  },
};

export default entry;

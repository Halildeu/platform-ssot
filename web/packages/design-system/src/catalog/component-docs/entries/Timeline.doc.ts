import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Timeline",
  indexItem: {
    "name": "Timeline",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "content",
    "subgroup": "timeline",
    "taxonomyGroupId": "general",
    "taxonomySubgroup": "Timeline & History",
    "demoMode": "live",
    "description": "Zaman cizgisi componenti; sol/sag/alternatif mod, pending durumu, ozel dot ve connector destegi sunar.",
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
      "wave-3",
      "content",
      "stable"
    ],
    "importStatement": "import { Timeline } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Timeline",
    "variantAxes": [
      "mode: left | right | alternate",
      "size: sm | md | lg"
    ],
    "stateModel": [
      "pending item indicator",
      "reverse order"
    ],
    "previewStates": ["default", "dark-theme"],
    "behaviorModel": [
      "left/right/alternate layout",
      "pending item with custom dot",
      "reverse chronological order",
      "connector line rendering",
      "custom dot and color per item"
    ],
    "props": [
      {
        "name": "items",
        "type": "TimelineItem[]",
        "default": "-",
        "required": true,
        "description": "Zaman cizgisi ogeleri dizisi."
      },
      {
        "name": "mode",
        "type": "'left' | 'right' | 'alternate'",
        "default": "left",
        "required": false,
        "description": "Icerik yerlesim modu."
      },
      {
        "name": "reverse",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Ters kronolojik siralama."
      },
      {
        "name": "pending",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Bekleyen son oge icerigi."
      },
      {
        "name": "pendingDot",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Bekleyen oge icin ozel dot."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Gorsel boyut varyanti."
      },
      {
        "name": "showConnector",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Ogeler arasi baglanti cizgisini gosterir."
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
      "mode layout matrix",
      "pending item display",
      "custom dot variants"
    ],
    "regressionFocus": [
      "alternate mode alignment",
      "reverse order with pending",
      "connector line gaps",
      "custom dot rendering"
    ]
  },
};

export default entry;

import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MasterDetail",
  indexItem: {
    "name": "MasterDetail",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "layout",
    "subgroup": "master-detail",
    "taxonomyGroupId": "page_blocks",
    "taxonomySubgroup": "Master-Detail & Split View",
    "demoMode": "live",
    "description": "Master-detail yapisim deseni; liste-detay bolunmus goruntuleme, oran kontrolu, collapse ve divider destegi sunar.",
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
      "layout",
      "stable"
    ],
    "importStatement": "import { MasterDetail } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MasterDetail",
    "variantAxes": [
      "ratio: string (e.g. '1:2', '1:3')"
    ],
    "stateModel": [
      "master collapsed / expanded",
      "detail empty placeholder",
      "selection active"
    ],
    "previewStates": ["master-only", "detail-open", "loading", "dark-theme"],
    "behaviorModel": [
      "master-detail split layout",
      "configurable ratio",
      "master panel collapse toggle",
      "empty detail placeholder",
      "divider visibility control",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "master",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Master (liste) paneli icerigi."
      },
      {
        "name": "detail",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Detail (detay) paneli icerigi."
      },
      {
        "name": "detailEmpty",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Secim yapilmadiginda gosterilecek bos durum icerigi."
      },
      {
        "name": "hasSelection",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Detay iceriginin aktif olup olmadigini belirler."
      },
      {
        "name": "ratio",
        "type": "string",
        "default": "1:2",
        "required": false,
        "description": "Master ve detail arasi genislik orani."
      },
      {
        "name": "masterHeader",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Master paneli baslik icerigi."
      },
      {
        "name": "detailHeader",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Detail paneli baslik icerigi."
      },
      {
        "name": "collapsible",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Master panelinin daraltilabilir olmasini saglar."
      },
      {
        "name": "divider",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Paneller arasi ayirici cizgi gostergesi."
      },
      {
        "name": "masterMinWidth",
        "type": "number | string",
        "default": "-",
        "required": false,
        "description": "Master paneli minimum genisligi."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "required": false,
        "description": "Additional CSS class for custom styling."
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
      "ratio variants",
      "collapse toggle",
      "empty detail state"
    ],
    "regressionFocus": [
      "collapse animation smoothness",
      "ratio responsive behavior",
      "detail empty/active transition",
      "divider drag resize (if enabled)"
    ]
  },
};

export default entry;

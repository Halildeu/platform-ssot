import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SankeyDiagram",
  indexItem: {
    "name": "SankeyDiagram",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Akis/deger akisi diagram",
    "demoMode": "live",
    "description": "Node ve link yapisinda agirlikli yonlu iliskileri gorselestiren Sankey akis diyagrami; hover vurgulama, gradient linkler ve deger etiketleri destekler.",
    "sectionIds": [
      "component_library_management"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility"
    ],
    "tags": [
      "enterprise",
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_14_enterprise_suite",
    "acceptanceContractId": "ui-library-wave-14-enterprise-suite-v1",
    "importStatement": "import { SankeyDiagram } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SankeyDiagram",
    "variantAxes": [
      "showValues: true | false"
    ],
    "stateModel": [
      "default",
      "hover-node",
      "hover-link"
    ],
    "previewStates": ["default", "dark-theme"],
    "behaviorModel": [
      "topological node layering",
      "proportional link thickness",
      "gradient link coloring",
      "hover node/link highlight",
      "click handlers for nodes and links",
      "auto-layout algorithm"
    ],
    "props": [
      { "name": "nodes", "type": "SankeyNode[]", "default": "-", "required": true, "description": "Diagram dugumleri." },
      { "name": "links", "type": "SankeyLink[]", "default": "-", "required": true, "description": "Dugumler arasi agirlikli baglantilar." },
      { "name": "width", "type": "number", "default": "700", "required": false, "description": "Diagram genisligi." },
      { "name": "height", "type": "number", "default": "400", "required": false, "description": "Diagram yuksekligi." },
      { "name": "nodeWidth", "type": "number", "default": "20", "required": false, "description": "Dugum dikdortgen genisligi." },
      { "name": "nodePadding", "type": "number", "default": "12", "required": false, "description": "Dugumler arasi dikey bosluk." },
      { "name": "showValues", "type": "boolean", "default": "false", "required": false, "description": "Linklerde deger etiketlerini gosterir." },
      { "name": "formatOptions", "type": "FormatOptions", "default": "{}", "required": false, "description": "Sayi formatlama secenekleri." },
      { "name": "onNodeClick", "type": "(node: SankeyNode) => void", "default": "-", "required": false, "description": "Dugume tiklandiginda tetiklenir." },
      { "name": "onLinkClick", "type": "(link: SankeyLink) => void", "default": "-", "required": false, "description": "Linke tiklandiginda tetiklenir." },
      { "name": "palette", "type": "string[]", "default": "DEFAULT_PALETTE", "required": false, "description": "Dugum renk paleti." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "multi-layer node layout",
      "proportional link rendering",
      "hover highlight interaction"
    ],
    "regressionFocus": [
      "bos node/link dizisi",
      "dongusel baglanti yonetimi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

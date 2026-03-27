import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SWOTMatrix",
  indexItem: {
    "name": "SWOTMatrix",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "strategy",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "SWOT, stratejik analiz, 4 kadran matrisi",
    "demoMode": "live",
    "description": "Guclu yonler, zayif yonler, firsatlar ve tehditleri renk kodlu 2x2 izgarada goruntuleyen 4 kadranli stratejik analiz matrisi.",
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
    "importStatement": "import { SWOTMatrix } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SWOTMatrix",
    "variantAxes": [
      "compact: true | false"
    ],
    "stateModel": [
      "default",
      "compact",
      "empty-quadrants"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "2x2 color-coded quadrant grid",
      "S (green), W (red), O (blue), T (amber)",
      "priority badges (H/M/L) per item",
      "clickable items with keyboard support",
      "empty state per quadrant",
      "compact mode reduces spacing",
      "item count per quadrant in header",
      "summary footer with totals"
    ],
    "props": [
      { "name": "strengths", "type": "SWOTItem[]", "default": "-", "required": true, "description": "Guclu yonler kadrani ogeler." },
      { "name": "weaknesses", "type": "SWOTItem[]", "default": "-", "required": true, "description": "Zayif yonler kadrani ogeler." },
      { "name": "opportunities", "type": "SWOTItem[]", "default": "-", "required": true, "description": "Firsatlar kadrani ogeler." },
      { "name": "threats", "type": "SWOTItem[]", "default": "-", "required": true, "description": "Tehditler kadrani ogeler." },
      { "name": "onItemClick", "type": "(quadrant: SWOTQuadrant, item: SWOTItem) => void", "default": "-", "required": false, "description": "Oge tiklandiginda tetiklenir." },
      { "name": "title", "type": "string", "default": "-", "required": false, "description": "Matris baslik metni." },
      { "name": "compact", "type": "boolean", "default": "false", "required": false, "description": "Kompakt gorunumu etkinlestirir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "4 color-coded quadrants",
      "priority badges",
      "compact mode layout"
    ],
    "regressionFocus": [
      "bos kadran gosterimi",
      "tum onceliklerin dogru badge renkleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

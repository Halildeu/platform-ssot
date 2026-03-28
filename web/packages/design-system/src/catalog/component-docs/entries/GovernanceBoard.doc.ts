import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "GovernanceBoard",
  indexItem: {
    "name": "GovernanceBoard",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Yonetisim panosu",
    "demoMode": "live",
    "description": "Ozet seridi, ciddiyet gostergeleri ve katlanabilir gruplarla uyumluluk yonetisim panosu; domain, durum veya ciddiyet bazinda gruplama destekler.",
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
    "importStatement": "import { GovernanceBoard } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "GovernanceBoard",
    "variantAxes": [
      "groupBy: domain | status | severity"
    ],
    "stateModel": [
      "ungrouped",
      "grouped-domain",
      "grouped-severity"
    ],
    "previewStates": ["default-grid", "empty-board"],
    "behaviorModel": [
      "summary strip with compliance counts",
      "severity border indicators",
      "compliance status badges",
      "collapsible group sections",
      "findings count display",
      "item click interaction"
    ],
    "props": [
      { "name": "items", "type": "GovernanceItem[]", "default": "-", "required": true, "description": "Gosterilecek yonetisim kontrol ogeleri." },
      { "name": "groupBy", "type": "GovernanceGroupBy", "default": "-", "required": false, "description": "Ogelerin gruplama stratejisi." },
      { "name": "onItemClick", "type": "(item: GovernanceItem) => void", "default": "-", "required": false, "description": "Yonetisim ogesi satirina tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "summary strip metrics",
      "severity indicators",
      "group collapse/expand"
    ],
    "regressionFocus": [
      "bos items dizisi",
      "tum ogeler compliant durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

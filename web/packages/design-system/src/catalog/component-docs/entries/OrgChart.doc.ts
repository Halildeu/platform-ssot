import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "OrgChart",
  indexItem: {
    "name": "OrgChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "charts",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Hiyerarsik organizasyon semasi SVG bileseni",
    "demoMode": "live",
    "description": "Organizasyon hiyerarsisini agac yapisiyla goruntuleyen SVG tabanli bilesen; dugum genislet/daralt, yol vurgulama ve kompakt mod destegi sunar.",
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
    "importStatement": "import { OrgChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "OrgChart",
    "variantAxes": [
      "orientation: vertical | horizontal",
      "compact: true | false"
    ],
    "stateModel": [
      "default",
      "highlighted-path",
      "compact"
    ],
    "previewStates": ["default-types", "dark-theme"],
    "behaviorModel": [
      "hierarchical tree layout algorithm",
      "connector line rendering",
      "avatar circle with initials",
      "expand/collapse children toggle",
      "path highlighting via colored borders",
      "compact mode with tighter spacing"
    ],
    "props": [
      { "name": "data", "type": "OrgChartNode", "default": "-", "required": true, "description": "Organizasyon hiyerarsisinin kok dugumu." },
      { "name": "onNodeClick", "type": "(node: OrgChartNode) => void", "default": "-", "required": false, "description": "Dugum tiklandiginda tetiklenen geri cagirim." },
      { "name": "orientation", "type": "'vertical' | 'horizontal'", "default": "vertical", "required": false, "description": "Agac yonelimi." },
      { "name": "nodeWidth", "type": "number", "default": "160", "required": false, "description": "Dugum kutusu genisligi (piksel)." },
      { "name": "nodeHeight", "type": "number", "default": "72", "required": false, "description": "Dugum kutusu yuksekligi (piksel)." },
      { "name": "compact", "type": "boolean", "default": "false", "required": false, "description": "Kompakt mod — daha kucuk dugumler ve siki aralik." },
      { "name": "highlightPath", "type": "string[]", "default": "[]", "required": false, "description": "Vurgulanacak dugum ID dizisi." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "hierarchical tree layout",
      "connector line rendering",
      "expand/collapse interaction"
    ],
    "regressionFocus": [
      "derin hiyerarsi performansi",
      "tek dugum edge case",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

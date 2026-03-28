import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ProcessFlow",
  indexItem: {
    "name": "ProcessFlow",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "diagrams",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "BPMN tarzi surec akisi",
    "demoMode": "live",
    "description": "8 farkli dugum tipi (start, end, task, decision, subprocess, timer, message, parallel-gateway), otomatik layout, durum rozeti ve yol vurgulama destegi sunan SVG surec akis diyagrami.",
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
    "importStatement": "import { ProcessFlow } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ProcessFlow",
    "variantAxes": [
      "orientation: horizontal | vertical"
    ],
    "stateModel": [
      "idle",
      "active-path",
      "completed"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "auto-layout with topological sort",
      "8 node type shape rendering",
      "status badge overlay",
      "active pulse animation",
      "path highlighting",
      "bezier edge routing",
      "node click interaction"
    ],
    "props": [
      { "name": "nodes", "type": "ProcessNode[]", "default": "-", "required": true, "description": "Surec dugumleri (task, decision, gateway vb.)." },
      { "name": "edges", "type": "ProcessEdge[]", "default": "-", "required": true, "description": "Dugumler arasi yonlu kenarlar." },
      { "name": "orientation", "type": "'horizontal' | 'vertical'", "default": "horizontal", "required": false, "description": "Otomatik duzenleme yonu." },
      { "name": "highlightPath", "type": "string[]", "default": "[]", "required": false, "description": "Aktif yurutme yolu olarak vurgulanacak dugum ID'leri." },
      { "name": "onNodeClick", "type": "(nodeId: string) => void", "default": "-", "required": false, "description": "Dugum tiklandiginda tetiklenir." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "all 8 node types rendering",
      "path highlighting",
      "status badge display"
    ],
    "regressionFocus": [
      "bos nodes/edges dizisi",
      "dongusel edge yonetimi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

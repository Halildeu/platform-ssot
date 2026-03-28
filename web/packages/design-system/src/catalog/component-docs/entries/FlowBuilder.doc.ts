import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FlowBuilder",
  indexItem: {
    "name": "FlowBuilder",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "diagrams",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "No-code gorsel is akisi tasarimcisi",
    "demoMode": "live",
    "description": "ProcessFlow uzerine insa edilen, SVG canvas uzerinde surukle-birak dugum ekleme, kenar cizme, pan/zoom, undo/redo, ozellik paneli ve minimap destegi sunan interaktif is akisi tasarimcisi.",
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
    "importStatement": "import { FlowBuilder } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FlowBuilder",
    "variantAxes": [
      "readOnly: true | false",
      "showToolbar: true | false",
      "showGrid: true | false",
      "showMinimap: true | false",
      "snapToGrid: true | false"
    ],
    "stateModel": [
      "idle",
      "dragging-node",
      "connecting-edge",
      "panning",
      "selected"
    ],
    "previewStates": ["empty-canvas", "sample-flow", "read-only"],
    "behaviorModel": [
      "SVG canvas with pan and zoom",
      "8 BPMN node type shapes",
      "drag-to-reposition nodes",
      "click output port to draw edges",
      "bezier edge routing",
      "undo/redo history stack",
      "keyboard shortcuts (Delete, Escape, Ctrl+Z, Ctrl+Y)",
      "node properties panel with label, type, metadata editing",
      "snap-to-grid support",
      "minimap overview",
      "access control (hidden/disabled/readonly)"
    ],
    "props": [
      { "name": "nodes", "type": "FlowNode[]", "default": "-", "required": true, "description": "Konumlu is akisi dugumleri." },
      { "name": "edges", "type": "FlowEdge[]", "default": "-", "required": true, "description": "Dugumler arasi yonlu kenarlar." },
      { "name": "onNodesChange", "type": "(nodes: FlowNode[]) => void", "default": "-", "required": false, "description": "Dugum dizisi degistiginde tetiklenir." },
      { "name": "onEdgesChange", "type": "(edges: FlowEdge[]) => void", "default": "-", "required": false, "description": "Kenar dizisi degistiginde tetiklenir." },
      { "name": "onNodeAdd", "type": "(node: FlowNode) => void", "default": "-", "required": false, "description": "Yeni dugum eklendiginde tetiklenir." },
      { "name": "onNodeDelete", "type": "(nodeId: string) => void", "default": "-", "required": false, "description": "Dugum silindiginde tetiklenir." },
      { "name": "onEdgeAdd", "type": "(edge: FlowEdge) => void", "default": "-", "required": false, "description": "Yeni kenar eklendiginde tetiklenir." },
      { "name": "onEdgeDelete", "type": "(edgeId: string) => void", "default": "-", "required": false, "description": "Kenar silindiginde tetiklenir." },
      { "name": "onNodeSelect", "type": "(node: FlowNode | null) => void", "default": "-", "required": false, "description": "Dugum secimi degistiginde tetiklenir." },
      { "name": "readOnly", "type": "boolean", "default": "false", "required": false, "description": "Duzenleme etkilesimlerini devre disi birakir." },
      { "name": "showMinimap", "type": "boolean", "default": "false", "required": false, "description": "Sag alt kosede mini harita gosterir." },
      { "name": "showToolbar", "type": "boolean", "default": "true", "required": false, "description": "Ust araç cubugunu gosterir." },
      { "name": "showGrid", "type": "boolean", "default": "true", "required": false, "description": "Noktalı arka plan izgarasini gosterir." },
      { "name": "snapToGrid", "type": "boolean", "default": "false", "required": false, "description": "Dugum konumlarini izgaraya yaslar." },
      { "name": "gridSize", "type": "number", "default": "20", "required": false, "description": "Izgara hucre boyutu (px)." },
      { "name": "height", "type": "number | string", "default": "600", "required": false, "description": "Canvas yuksekligi." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "toolbar node adding",
      "node drag interaction",
      "edge connection flow",
      "properties panel editing"
    ],
    "regressionFocus": [
      "bos canvas durumu",
      "readOnly etkisizlestirme",
      "undo/redo gecmis yonetimi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

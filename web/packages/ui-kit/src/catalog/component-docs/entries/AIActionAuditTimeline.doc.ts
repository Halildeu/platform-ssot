import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "AIActionAuditTimeline",
  indexItem: {
  "name": "AIActionAuditTimeline",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "beta",
  "group": "ai_helpers",
  "subgroup": "approval_audit",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Approval / Audit",
  "demoMode": "live",
  "description": "AI aksiyonlari, insan onayi ve sistem gozlemlerini secilebilir audit timeline yuzeyinde toplar.",
  "sectionIds": [
    "governance_contribution",
    "documentation_standards",
    "integration_distribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-6",
    "ai-native-helpers",
    "beta",
    "audit"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "ai_action_audit_trail",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1",
  "importStatement": "import { AIActionAuditTimeline } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "AIActionAuditTimeline",
  "variantAxes": [
    "mode: interactive | readonly",
    "density: default | compact",
    "selection: active | passive"
  ],
  "stateModel": [
    "selected audit event",
    "actor badge mapping",
    "status badge mapping"
  ],
  "props": [
    {
      "name": "items",
      "type": "AIActionAuditTimelineItem[]",
      "default": "[]",
      "required": true,
      "description": "Actor, status, title, timestamp ve summary alanlarini tasir."
    },
    {
      "name": "selectedId",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Secili timeline maddesini vurgular."
    },
    {
      "name": "onSelectItem",
      "type": "(id: string, item: AIActionAuditTimelineItem) => void",
      "default": "-",
      "required": false,
      "description": "Interactive timeline secim callback'ini uretir."
    },
    {
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Summary alanini daha yogun ritimde gosterir."
    }
  ],
  "previewFocus": [
    "interactive audit trail",
    "readonly evidentiary log"
  ],
  "regressionFocus": [
    "readonly selection guard",
    "actor/status badge mapping",
    "selected event emphasis"
  ]
},
};

export default entry;

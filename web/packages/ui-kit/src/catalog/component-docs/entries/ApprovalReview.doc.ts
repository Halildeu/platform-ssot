import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ApprovalReview",
  indexItem: {
  "name": "ApprovalReview",
  "kind": "component",
  "importStatement": "import { ApprovalReview } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "ai_helpers",
  "subgroup": "approval_audit",
  "tags": [
    "approval",
    "recipes",
    "stable",
    "wave-11"
  ],
  "availability": "exported",
  "lifecycle": "stable",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Approval / Review recipes",
  "demoMode": "live",
  "description": "Approval checkpoint, citation evidence ve audit timeline akisini tek review recipe katmaninda birlestirir.",
  "sectionIds": [
    "governance_contribution",
    "integration_distribution",
    "documentation_standards"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "human_approval_checkpoints",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1"
},
  apiItem: {
  "name": "ApprovalReview",
  "variantAxes": [
    "layout: checkpoint-first | evidence-first",
    "selection: controlled | uncontrolled",
    "mode: interactive | readonly"
  ],
  "stateModel": [
    "selected citation",
    "selected audit item",
    "approval action propagation"
  ],
  "props": [
    {
      "name": "checkpoint",
      "type": "ApprovalCheckpointProps",
      "default": "-",
      "required": true,
      "description": "Review recipe icindeki canonical approval kartini tanimlar."
    },
    {
      "name": "citations / auditItems",
      "type": "CitationPanelItem[] / AIActionAuditTimelineItem[]",
      "default": "[] / []",
      "required": true,
      "description": "Evidence seti ve audit timeline kayitlarini birlikte verir."
    },
    {
      "name": "selectedCitationId / selectedAuditId",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Controlled modda aktif evidence ve audit maddesini belirler."
    },
    {
      "name": "onCitationSelect / onAuditSelect",
      "type": "(id, item) => void",
      "default": "-",
      "required": false,
      "description": "Recipe icindeki secim olaylarini consumer katmana tasir."
    }
  ],
  "previewFocus": [
    "approval + evidence review",
    "audit rich escalation surface"
  ],
  "regressionFocus": [
    "selection state parity",
    "checkpoint passthrough stability",
    "readonly interaction guard"
  ]
},
};

export default entry;

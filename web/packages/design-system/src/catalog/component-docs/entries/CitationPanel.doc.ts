import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "CitationPanel",
  indexItem: {
  "name": "CitationPanel",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "ai_helpers",
  "subgroup": "citations_prompting",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Citations / Prompting",
  "demoMode": "live",
  "description": "Kaynak ve alinti seffafligini secilebilir, readonly ve governed modlarla panel yuzeyinde sunar.",
  "sectionIds": [
    "documentation_standards",
    "governance_contribution",
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
    "citations"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "confidence_and_source_transparency",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1",
  "importStatement": "import { CitationPanel } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx"
  ]
},
  apiItem: {
  "name": "CitationPanel",
  "variantAxes": [
    "mode: interactive | readonly",
    "density: default | compact",
    "selection: active | passive"
  ],
  "stateModel": [
    "selected citation",
    "source type tone mapping",
    "empty state"
  ],
    "previewStates": ["no-citations", "with-citations", "expanded", "dark-theme"],
    "behaviorModel": [
      "selected citation",
      "source type tone mapping",
      "empty state"
    ],
  "props": [
    {
      "name": "items",
      "type": "CitationPanelItem[]",
      "default": "[]",
      "required": true,
      "description": "Title, excerpt, source, locator ve kind bilgisini tasir."
    },
    {
      "name": "activeCitationId",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Secili citation satirini vurgular."
    },
    {
      "name": "onOpenCitation",
      "type": "(id: string, item: CitationPanelItem) => void",
      "default": "-",
      "required": false,
      "description": "Interactive modda satira tiklandiginda callback uretir."
    },
    {
      "name": "compact",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Excerpt yuzeyini daha yogun satir ritmine ceker."
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
    "source transparency panel",
    "readonly reference surface"
  ],
  "regressionFocus": [
    "readonly open guard",
    "active citation highlight",
    "empty state rendering"
  ]
},
};

export default entry;

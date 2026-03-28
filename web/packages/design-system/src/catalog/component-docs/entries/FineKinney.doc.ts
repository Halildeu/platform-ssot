import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FineKinney",
  indexItem: {
    "name": "FineKinney",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "data-display",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "ISG risk skoru (OxFxS), 5 seviye risk tablosu",
    "demoMode": "live",
    "description": "Fine-Kinney ISG risk degerlendirme tablosu; Olasilik x Frekans x Siddet hesaplamasiyla 5 seviyeli risk skoru, kontrol onlemleri ve durum takibi sunar.",
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
    "importStatement": "import { FineKinney } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FineKinney",
    "variantAxes": [
      "compact: true | false",
      "showControls: true | false",
      "showStatus: true | false"
    ],
    "stateModel": [
      "default",
      "compact",
      "with-controls"
    ],
    "previewStates": ["default-types", "loading-state"],
    "behaviorModel": [
      "P x F x S risk score calculation",
      "5-level risk classification (acceptable to very-high)",
      "risk level color coding",
      "sortable columns",
      "controls and status columns toggle",
      "summary statistics strip",
      "risk row click interaction",
      "locale text customization"
    ],
    "props": [
      { "name": "risks", "type": "FineKinneyRisk[]", "default": "-", "required": true, "description": "Gosterilecek risk ogeleri dizisi." },
      { "name": "onRiskClick", "type": "(risk: FineKinneyRisk) => void", "default": "-", "required": false, "description": "Risk satirina tiklandiginda tetiklenir." },
      { "name": "showControls", "type": "boolean", "default": "-", "required": false, "description": "Kontroller sutununu gosterir." },
      { "name": "showStatus", "type": "boolean", "default": "-", "required": false, "description": "Durum sutununu gosterir." },
      { "name": "compact", "type": "boolean", "default": "-", "required": false, "description": "Kompakt satir yuksekligi kullanir." },
      { "name": "localeText", "type": "Partial<FineKinneyLocaleText>", "default": "-", "required": false, "description": "Yerellestirilmis etiketler (Turkce varsayilan)." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "risk score calculation display",
      "5-level risk classification",
      "controls and status columns"
    ],
    "regressionFocus": [
      "bos risks dizisi",
      "ekstrem skor degerleri",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

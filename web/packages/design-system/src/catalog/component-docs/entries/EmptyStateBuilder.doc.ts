import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EmptyStateBuilder",
  indexItem: {
    "name": "EmptyStateBuilder",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "feedback",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "6 sebep-bazli bos durum ekrani",
    "demoMode": "live",
    "description": "6 farkli sebep tipine (no-data, no-results, no-permission, error, first-time, filtered-empty) gore ikon, mesaj ve eylem butonu sunan baglamsal bos durum bileseni.",
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
    "importStatement": "import { EmptyStateBuilder } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EmptyStateBuilder",
    "variantAxes": [
      "reason: no-data | no-results | no-permission | error | first-time | filtered-empty",
      "size: sm | md | lg"
    ],
    "stateModel": [
      "no-data",
      "no-results",
      "error",
      "first-time"
    ],
    "previewStates": ["no-data", "error", "filtered-empty", "dark-theme"],
    "behaviorModel": [
      "reason-based icon selection",
      "default Turkish messaging per reason",
      "title and description override",
      "primary and secondary action buttons",
      "size-responsive layout",
      "locale text overrides"
    ],
    "props": [
      { "name": "reason", "type": "EmptyStateReason", "default": "-", "required": true, "description": "Bos durum sebebi; varsayilan ikon ve mesaji belirler." },
      { "name": "title", "type": "string", "default": "-", "required": false, "description": "Sebep icin varsayilan basligi gecersiz kilar." },
      { "name": "description", "type": "string", "default": "-", "required": false, "description": "Sebep icin varsayilan aciklamayi gecersiz kilar." },
      { "name": "primaryAction", "type": "EmptyStateAction", "default": "-", "required": false, "description": "Aciklama altinda gosterilen birincil eylem butonu." },
      { "name": "secondaryAction", "type": "EmptyStateAction", "default": "-", "required": false, "description": "Birincil eylemin yaninda gosterilen ikincil buton." },
      { "name": "size", "type": "EmptyStateSize", "default": "md", "required": false, "description": "Ikon boyutu, yazi boyutu ve dolgu kontrolu." },
      { "name": "localeText", "type": "EmptyStateBuilderLocaleText", "default": "-", "required": false, "description": "Sebep bazinda yerellestirilmis etiketler." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "all 6 reason types",
      "action button rendering",
      "size variants"
    ],
    "regressionFocus": [
      "localeText ile ozel metin",
      "action disabled durumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

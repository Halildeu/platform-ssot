import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EmptyErrorLoading",
  indexItem: {
  "name": "EmptyErrorLoading",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "group": "feedback",
  "subgroup": "state_recipes",
  "taxonomyGroupId": "feedback",
  "taxonomySubgroup": "Empty / Error / Loading recipes",
  "demoMode": "live",
  "description": "Bos, hata ve yukleniyor durumlarini Empty, Spinner ve Skeleton katmanlariyla ayni feedback recipe altinda toplar.",
  "sectionIds": [
    "state_feedback",
    "documentation_standards",
    "component_library_management"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "tags": [
    "wave-11",
    "recipes",
    "stable",
    "state-feedback"
  ],
  "uxPrimaryThemeId": "feedback_state_and_visibility",
  "uxPrimarySubthemeId": "loading_empty_error_success_patterns",
  "roadmapWaveId": "wave_11_recipes",
  "acceptanceContractId": "ui-library-wave-11-recipes-v1",
  "importStatement": "import { EmptyErrorLoading } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ]
},
  apiItem: {
  "name": "EmptyErrorLoading",
  "variantAxes": [
    "mode: empty | error | loading",
    "skeleton: on | off",
    "recovery: passive | retry-action"
  ],
  "stateModel": [
    "mode switch",
    "retry CTA visibility",
    "skeleton stack visibility"
  ],
  "props": [
    {
      "name": "mode",
      "type": "'empty' | 'error' | 'loading'",
      "default": "-",
      "required": true,
      "description": "Recipe icindeki aktif state branch'ini belirler."
    },
    {
      "name": "errorLabel / retryLabel / onRetry",
      "type": "ReactNode / string / () => void",
      "default": "- / 'Tekrar dene' / -",
      "required": false,
      "description": "Error state'teki geri donus mesajini ve aksiyonunu tanimlar."
    },
    {
      "name": "loadingLabel / showSkeleton",
      "type": "string / boolean",
      "default": "'Yukleniyor' / true",
      "required": false,
      "description": "Loading branch'indeki spinner ve skeleton davranisini kontrol eder."
    }
  ],
  "previewFocus": [
    "loading with skeleton",
    "error recovery panel",
    "empty fallback"
  ],
  "regressionFocus": [
    "mode branch parity",
    "retry callback wiring",
    "spinner + skeleton visibility"
  ]
},
};

export default entry;

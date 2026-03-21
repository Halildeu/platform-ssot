import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MobileStepper",
  indexItem: {
  "name": "MobileStepper",
  "kind": "component",
  "availability": "planned",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "navigation",
  "subgroup": "steps",
  "taxonomyGroupId": "navigation",
  "taxonomySubgroup": "Steps",
  "demoMode": "live",
  "description": "Kucuk viewport senaryolari icin dots, text veya progress varyantli kompakt stepper primitive'i.",
  "sectionIds": [
    "component_library_management",
    "navigation_patterns",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support",
    "design_tokens",
    "preview_visibility"
  ],
  "tags": [
    "wave-2",
    "navigation",
    "beta",
    "mobile"
  ],
  "uxPrimaryThemeId": "navigation_information_scent",
  "uxPrimarySubthemeId": "orientation_and_wayfinding",
  "roadmapWaveId": "wave_2_navigation",
  "acceptanceContractId": "ui-library-wave-2-navigation-v1",
  "importStatement": "import { MobileStepper } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "MobileStepper",
  "variantAxes": [
    "variant: dots | text | progress",
    "position: static | bottom",
    "access: full | readonly | disabled | hidden"
  ],
  "stateModel": [
    "controlled active step index",
    "total steps count",
    "next/back navigation guards",
    "variant-specific indicator rendering"
  ],
    "previewStates": ["first-step", "middle-step", "last-step", "dark-theme"],
    "behaviorModel": [
      "controlled active step index",
      "total steps count",
      "next/back navigation guards",
      "variant-specific indicator rendering"
    ],
  "props": [
    {
      "name": "activeStep",
      "type": "number",
      "default": "0",
      "required": true,
      "description": "Aktif adim index degerini belirler."
    },
    {
      "name": "steps",
      "type": "number",
      "default": "-",
      "required": true,
      "description": "Toplam adim sayisini tanimlar."
    },
    {
      "name": "variant",
      "type": "'dots' | 'text' | 'progress'",
      "default": "dots",
      "required": false,
      "description": "Kompakt stepper gosterim varyantini belirler: dot indikatoru, metin sayaci veya progress bar."
    },
    {
      "name": "onNext / onBack",
      "type": "() => void / () => void",
      "default": "- / -",
      "required": false,
      "description": "Ileri ve geri navigasyon callback'lerini tanimlar."
    },
    {
      "name": "nextLabel / backLabel",
      "type": "string / string",
      "default": "'Ileri' / 'Geri'",
      "required": false,
      "description": "Next ve back buton etiketlerini belirler."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Bilesen boyut varyantini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "''",
      "required": false,
      "description": "Additional CSS class for custom styling."
    }
  ],
  "previewFocus": [
    "dots variant compact indicator",
    "text variant step counter",
    "progress variant bar"
  ],
  "regressionFocus": [
    "first/last step boundary guards",
    "variant rendering parity",
    "access guard interaction"
  ]
},
};

export default entry;

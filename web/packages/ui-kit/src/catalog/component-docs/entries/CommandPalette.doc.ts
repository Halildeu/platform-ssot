import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "CommandPalette",
  indexItem: {
  "name": "CommandPalette",
  "kind": "component",
  "importStatement": "import { CommandPalette } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "ai_helpers",
  "subgroup": "command_palette",
  "tags": [
    "ai-native-helpers",
    "beta",
    "command",
    "wave-6"
  ],
  "availability": "exported",
  "lifecycle": "beta",
  "taxonomyGroupId": "ai_native_helpers",
  "taxonomySubgroup": "Command palette",
  "demoMode": "live",
  "description": "Global komut, route ve AI yardimci aksiyonlarini tek palette icinde arama/keyboard ile sunar.",
  "sectionIds": [
    "component_library_management",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "ai_assisted_decision_experience",
  "uxPrimarySubthemeId": "safe_prompt_templates_and_scope",
  "roadmapWaveId": "wave_6_ai_native_helpers",
  "acceptanceContractId": "ui-library-wave-6-ai-native-helpers-v1"
},
  apiItem: {
  "name": "CommandPalette",
  "variantAxes": [
    "scope: global | approval | policy",
    "state: open | closed",
    "layout: grouped | flat"
  ],
  "stateModel": [
    "controlled vs uncontrolled query",
    "keyboard navigation",
    "filtered results",
    "readonly browsing vs actionable full mode"
  ],
  "props": [
    {
      "name": "open",
      "type": "boolean",
      "default": "false",
      "required": true,
      "description": "Palette acikligini kontrol eder."
    },
    {
      "name": "items",
      "type": "CommandPaletteItem[]",
      "default": "-",
      "required": true,
      "description": "Baslik, aciklama, grup, shortcut ve badge bilgisine sahip komut listesi."
    },
    {
      "name": "query / defaultQuery",
      "type": "string",
      "default": "\"\"",
      "required": false,
      "description": "Arama sorgusunu controlled veya uncontrolled sekilde yonetir."
    },
    {
      "name": "onQueryChange",
      "type": "(query: string) => void",
      "default": "-",
      "required": false,
      "description": "Arama girdisi her degistiginde yeni sorguyu bildirir."
    },
    {
      "name": "onSelect",
      "type": "(id: string, item: CommandPaletteItem) => void",
      "default": "-",
      "required": false,
      "description": "Secilen komut kimligini ve item bilgisini dondurur."
    },
    {
      "name": "onClose",
      "type": "() => void",
      "default": "-",
      "required": false,
      "description": "Escape veya overlay click sonrasinda palette kapanisini bildirir."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve secim davranisini kontrol eder."
    }
  ],
  "previewFocus": [
    "global search + grouped actions",
    "approval shortcut scope",
    "readonly browse mode"
  ],
  "regressionFocus": [
    "keyboard navigation parity",
    "query filtering stability",
    "readonly/disabled selection guard"
  ]
},
};

export default entry;

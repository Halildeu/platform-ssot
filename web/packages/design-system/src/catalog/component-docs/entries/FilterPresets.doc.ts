import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "FilterPresets",
  indexItem: {
    "name": "FilterPresets",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "inputs",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Kaydedilmis filtre setleri",
    "demoMode": "live",
    "description": "Filtre preset'lerini chip olarak gosteren, kaydetme, silme ve varsayilan olarak isaretleme eylemleri sunan toolbar bileseni.",
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
    "importStatement": "import { FilterPresets } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "FilterPresets",
    "variantAxes": [
      "mode: view | save"
    ],
    "stateModel": [
      "default",
      "save-popover",
      "delete-confirm"
    ],
    "previewStates": ["edit-mode", "loading-state"],
    "behaviorModel": [
      "preset chip selection",
      "save popover with name input",
      "delete confirmation dialog",
      "set default star icon toggle",
      "shared preset lock indicator"
    ],
    "props": [
      { "name": "presets", "type": "FilterPreset[]", "default": "-", "required": true, "description": "Gosterilecek filtre preset'leri." },
      { "name": "activePresetId", "type": "string | null", "default": "-", "required": false, "description": "Aktif preset ID'si veya null." },
      { "name": "onSelect", "type": "(preset: FilterPreset) => void", "default": "-", "required": true, "description": "Preset chip'ine tiklandiginda tetiklenir." },
      { "name": "onSave", "type": "(name: string, filters: Record<string, unknown>) => void", "default": "-", "required": false, "description": "Yeni preset kaydetme fonksiyonu." },
      { "name": "onDelete", "type": "(presetId: string) => void", "default": "-", "required": false, "description": "Preset silme fonksiyonu." },
      { "name": "onSetDefault", "type": "(presetId: string) => void", "default": "-", "required": false, "description": "Preset'i varsayilan olarak isaretleme." },
      { "name": "currentFilters", "type": "Record<string, unknown>", "default": "{}", "required": false, "description": "Yeni preset kaydederken kullanilan aktif filtre degerleri." },
      { "name": "localeText", "type": "FilterPresetsLocaleText", "default": "-", "required": false, "description": "Yerellestirilmis etiketler." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "preset chip active state",
      "save new preset flow",
      "delete confirmation"
    ],
    "regressionFocus": [
      "bos presets dizisi",
      "shared preset silme engeli",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

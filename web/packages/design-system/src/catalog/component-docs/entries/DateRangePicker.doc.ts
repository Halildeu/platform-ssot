import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "DateRangePicker",
  indexItem: {
    "name": "DateRangePicker",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "enterprise",
    "subgroup": "inputs",
    "taxonomyGroupId": "enterprise",
    "taxonomySubgroup": "Dashboard donem secici",
    "demoMode": "live",
    "description": "Hazir preset kisayollari ve ozel aralik girisli cift takvim tarih araligi secici; dashboard filtreleme senaryolari icin tasarlanmistir.",
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
    "importStatement": "import { DateRangePicker } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "DateRangePicker",
    "variantAxes": [
      "mode: preset | custom"
    ],
    "stateModel": [
      "closed",
      "open-presets",
      "open-custom"
    ],
    "previewStates": ["edit-mode", "loading-state"],
    "behaviorModel": [
      "preset shortcut selection",
      "custom range date inputs",
      "outside click dismiss",
      "Escape key dismiss",
      "min/max date clamping",
      "locale-aware formatting"
    ],
    "props": [
      { "name": "value", "type": "DateRange", "default": "-", "required": false, "description": "Kontrol edilen deger." },
      { "name": "onChange", "type": "(range: DateRange) => void", "default": "-", "required": false, "description": "Degisiklik isleyicisi." },
      { "name": "locale", "type": "string", "default": "en-US", "required": false, "description": "Tarih formatlama icin yerel ayar." },
      { "name": "disabledPresets", "type": "PresetKey[]", "default": "[]", "required": false, "description": "Devre disi birakilacak preset'ler." },
      { "name": "minDate", "type": "Date", "default": "-", "required": false, "description": "Secilebilir minimum tarih." },
      { "name": "maxDate", "type": "Date", "default": "-", "required": false, "description": "Secilebilir maksimum tarih." },
      { "name": "placeholder", "type": "string", "default": "Select date range", "required": false, "description": "Aralik secilmediginde gosterilen metin." },
      { "name": "className", "type": "string", "default": "-", "required": false, "description": "Root element icin ek CSS sinifi." }
    ],
    "previewFocus": [
      "preset selection flow",
      "custom date range input",
      "min/max date constraints"
    ],
    "regressionFocus": [
      "disabledPresets ile preset devre disi birakma",
      "minDate > maxDate kontrolu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

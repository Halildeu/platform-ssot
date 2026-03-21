import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useAsyncCombobox",
  indexItem: {
  "name": "useAsyncCombobox",
  "kind": "hook",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "forms",
  "subgroup": "combobox",
  "taxonomyGroupId": "hooks",
  "taxonomySubgroup": "Hooks (useX)",
  "demoMode": "inspector",
  "description": "Debounced async option yukleme, abort ve reload davranisini combobox akislarina tasiyan hook.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "governance_contribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { useAsyncCombobox } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "useAsyncCombobox",
  "variantAxes": [
    "fetch-state: idle | loading | loaded | error",
    "debounce: configurable ms",
    "abort: auto-cancel on new query"
  ],
  "stateModel": [
    "debounced query dispatch",
    "abort controller lifecycle",
    "loading state management",
    "fetched options cache",
    "reload trigger"
  ],
    "previewStates": [],
    "behaviorModel": [
      "debounced query dispatch",
      "abort controller lifecycle",
      "loading state management",
      "fetched options cache",
      "reload trigger"
    ],
  "props": [
    {
      "name": "fetchOptions",
      "type": "(query: string, signal: AbortSignal) => Promise<ComboboxOption[]>",
      "default": "-",
      "required": true,
      "description": "Arama sorgusuna gore async option listesi donduren fonksiyon; AbortSignal ile iptal destegi tasir."
    },
    {
      "name": "debounceMs",
      "type": "number",
      "default": "300",
      "required": false,
      "description": "Sorgu gonderim gecikmesini milisaniye cinsinden belirler."
    },
    {
      "name": "minQueryLength",
      "type": "number",
      "default": "1",
      "required": false,
      "description": "Fetch tetiklemesi icin minimum karakter sayisini belirler."
    },
    {
      "name": "return value",
      "type": "{ options, loading, error, reload, onQueryRequest }",
      "default": "-",
      "required": false,
      "description": "Combobox onQueryRequest prop'una baglanan handler, yuklenen options listesi, loading ve error state'lerini dondurur."
    }
  ],
  "previewFocus": [
    "debounced async search flow",
    "abort on rapid query change",
    "loading state pass-through to Combobox"
  ],
  "regressionFocus": [
    "abort controller cleanup on unmount",
    "minQueryLength threshold guard",
    "concurrent request cancellation",
    "error state recovery on reload"
  ]
},
};

export default entry;

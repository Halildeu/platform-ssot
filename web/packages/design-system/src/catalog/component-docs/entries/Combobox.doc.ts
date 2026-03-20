import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Combobox",
  indexItem: {
  "name": "Combobox",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "forms",
  "subgroup": "combobox",
  "taxonomyGroupId": "data_entry",
  "taxonomySubgroup": "Select / Dropdown / Combobox",
  "demoMode": "live",
  "description": "Inline arama, filtreleme, tekli veya coklu secim ve tags akislarini ayni field shell icinde birlestiren combobox primitivei.",
  "sectionIds": [
    "component_library_management",
    "documentation_standards",
    "accessibility_compliance"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment",
    "a11y_keyboard_support"
  ],
  "uxPrimaryThemeId": "task_completion_architecture",
  "uxPrimarySubthemeId": "critical_path_minimization",
  "roadmapWaveId": "wave_12_component_parity",
  "acceptanceContractId": "ui-library-wave-12-component-parity-v1",
  "tags": [
    "wave-12",
    "forms",
    "beta",
    "autocomplete"
  ],
  "importStatement": "import { Combobox } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "Combobox",
  "variantAxes": [
    "selectionMode: single | multiple | tags",
    "size: sm | md | lg",
    "popup: inline | portal",
    "access: full | readonly | disabled | hidden",
    "freeSolo: on | off"
  ],
  "stateModel": [
    "disabled",
    "readOnly",
    "error",
    "loading"
  ],
    "previewStates": [
      "disabled",
      "readonly",
      "loading",
      "error",
      "dark-theme"
    ],
    "behaviorModel": [
      "controlled/uncontrolled value",
      "controlled/uncontrolled inputValue",
      "controlled/uncontrolled open",
      "option filtering and keyword matching",
      "highlight navigation",
      "tag removal for multi/tags mode",
      "loading and empty state feedback",
      "freeSolo commit flow",
      "access-aware interaction guard"
    ],
  "props": [
    {
      "name": "options",
      "type": "Array<ComboboxOption | ComboboxOptionGroup>",
      "default": "-",
      "required": true,
      "description": "Flat veya grouped option listesini tanimlar; her option label, value, description ve keywords alanlari tasir."
    },
    {
      "name": "label",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Erisilebilirlik icin aria-label degeri."
    },
    {
      "name": "helperText",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Alan altinda gosterilen yardimci metin."
    },
    {
      "name": "error",
      "type": "ReactNode",
      "default": "-",
      "required": false,
      "description": "Dogrulama geri bildirimi."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled davranisini aktif eder."
    },
    {
      "name": "readOnly",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native readonly davranisini aktif eder."
    },
    {
      "name": "selectionMode",
      "type": "'single' | 'multiple' | 'tags'",
      "default": "single",
      "required": false,
      "description": "Tekli secim, coklu secim veya tags akis modunu belirler."
    },
    {
      "name": "value",
      "type": "string | null",
      "default": "null",
      "required": false,
      "description": "Single mode controlled secim state'i."
    },
    {
      "name": "onValueChange",
      "type": "(value: string | null, option: ComboboxOption | null) => void",
      "default": "-",
      "required": false,
      "description": "Single mode secim degisim callback'i."
    },
    {
      "name": "values",
      "type": "string[]",
      "default": "[]",
      "required": false,
      "description": "Multiple/tags mode controlled secim state'i."
    },
    {
      "name": "onValuesChange",
      "type": "(values: string[], options: ComboboxResolvedOption[]) => void",
      "default": "-",
      "required": false,
      "description": "Multiple/tags mode secim degisim callback'i."
    },
    {
      "name": "inputValue",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Arama input state'ini kontrol eder."
    },
    {
      "name": "onInputChange",
      "type": "(inputValue: string) => void",
      "default": "-",
      "required": false,
      "description": "Her keystroke callback'i."
    },
    {
      "name": "onQueryRequest",
      "type": "(query: string) => void",
      "default": "-",
      "required": false,
      "description": "Debounced query request callback'i."
    },
    {
      "name": "queryDebounceMs",
      "type": "number",
      "default": "250",
      "required": false,
      "description": "Query request debounce suresi (ms)."
    },
    {
      "name": "freeSolo",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Option listesinde olmayan serbest deger girisini acar."
    },
    {
      "name": "onFreeSoloCommit",
      "type": "(value: string) => void",
      "default": "-",
      "required": false,
      "description": "Serbest deger commit callback'i."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Async yukleme gostergesi."
    },
    {
      "name": "loadingText",
      "type": "ReactNode",
      "default": "Yukleniyor...",
      "required": false,
      "description": "Yukleme sirasinda gosterilen metin."
    },
    {
      "name": "noOptionsText",
      "type": "ReactNode",
      "default": "Sonuc bulunamadi.",
      "required": false,
      "description": "Bos sonuc metni."
    },
    {
      "name": "clearable",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Secim temizleme davranisini acar."
    },
    {
      "name": "renderOption",
      "type": "(option, state) => ReactNode",
      "default": "-",
      "required": false,
      "description": "Custom option render fonksiyonu."
    },
    {
      "name": "disabledItemFocusPolicy",
      "type": "'skip' | 'allow'",
      "default": "skip",
      "required": false,
      "description": "Disabled item klavye navigasyon politikasi."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Policy tabanli gorunurluk ve interaction kontrolu."
    },
    {
      "name": "accessReason",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Interaction kisitlamasinin nedeni."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Density ve hit-area kararini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    }
  ],
  "previewFocus": [
    "single vs multiple vs tags selection",
    "async search with loading state",
    "grouped options with disabled items",
    "freeSolo custom value entry",
    "readonly and disabled access guards"
  ],
  "regressionFocus": [
    "selection mode transition parity",
    "keyboard navigation with disabled items",
    "freeSolo commit and clear interaction",
    "portal vs inline popup positioning",
    "access guard onChange prevention"
  ]
},
};

export default entry;

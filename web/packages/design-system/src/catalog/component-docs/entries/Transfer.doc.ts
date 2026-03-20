import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Transfer",
  indexItem: {
    "name": "Transfer",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "inputs",
    "subgroup": "transfer",
    "taxonomyGroupId": "data_entry",
    "taxonomySubgroup": "Transfer & Shuttle",
    "demoMode": "live",
    "description": "Transfer componenti; kaynak ve hedef liste arasinda oge aktarimi, arama, toplu secim ve ozel render destegi sunar.",
    "sectionIds": [
      "component_library_management",
      "state_feedback",
      "accessibility_compliance"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-3",
      "data-entry",
      "stable"
    ],
    "importStatement": "import { Transfer } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Transfer",
    "variantAxes": [
      "size: sm | md | lg",
      "searchable: on | off"
    ],
    "stateModel": [
      "source / target selection",
      "search filter active",
      "select all toggle",
      "disabled",
      "readOnly",
      "error",
      "loading"
    ],
    "previewStates": [
      "disabled",
      "readonly",
      "loading",
      "dark-theme"
    ],
    "behaviorModel": [
      "source-to-target transfer",
      "target-to-source transfer",
      "search filtering in both lists",
      "select all / deselect all",
      "custom item rendering"
    ],
    "props": [
      {
        "name": "dataSource",
        "type": "TransferItem[]",
        "default": "-",
        "required": true,
        "description": "Transfer kaynak veri dizisi."
      },
      {
        "name": "targetKeys",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Controlled hedef liste anahtarlari."
      },
      {
        "name": "defaultTargetKeys",
        "type": "string[]",
        "default": "[]",
        "required": false,
        "description": "Uncontrolled baslangic hedef anahtarlari."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Liste ici arama aktif eder."
      },
      {
        "name": "filterOption",
        "type": "(input: string, item: TransferItem) => boolean",
        "default": "-",
        "required": false,
        "description": "Ozel filtre fonksiyonu."
      },
      {
        "name": "titles",
        "type": "[string, string]",
        "default": "['Kaynak', 'Hedef']",
        "required": false,
        "description": "Sol ve sag liste basliklari."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Boyut varyanti."
      },
      {
        "name": "showSelectAll",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Tumunu sec checkbox gostergesi."
      },
      {
        "name": "renderItem",
        "type": "(item: TransferItem) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Ozel oge render fonksiyonu."
      },
      {
        "name": "localeText",
        "type": "TransferLocaleText",
        "default": "-",
        "required": false,
        "description": "Yerellestirilmis metin overridelari."
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
        "description": "Salt okunur durumu aktif eder."
      },
      {
        "name": "error",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Dogrulama geri bildirimi."
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Yukleme gostergesi render eder ve etkilesimi devre disi birakir."
      },
      {
        "name": "onChange",
        "type": "(targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void",
        "default": "-",
        "required": false,
        "description": "Transfer islemi gerceklestiginde cagrilacak callback."
      },
      {
        "name": "onSearch",
        "type": "(direction: 'left' | 'right', value: string) => void",
        "default": "-",
        "required": false,
        "description": "Arama degistiginde cagrilacak callback."
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
      "source-target transfer flow",
      "search filtering",
      "select all behavior"
    ],
    "regressionFocus": [
      "transfer direction correctness",
      "select all with filtered items",
      "keyboard navigation between lists",
      "custom renderItem interaction"
    ]
  },
};

export default entry;

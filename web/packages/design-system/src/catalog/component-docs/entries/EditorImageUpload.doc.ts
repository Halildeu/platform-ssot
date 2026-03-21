import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditorImageUpload",
  indexItem: {
    "name": "EditorImageUpload",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "editor",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-Editor Image Upload",
    "demoMode": "planned",
    "description": "Editor icerisinde gorsel yukleme ve yerlistirme overlay bileseni; surukle-birak, dosya secimi ve URL ile ekleme destegi saglar.",
    "sectionIds": [
      "component_library_management",
      "form_controls",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "editor",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { EditorImageUpload } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditorImageUpload",
    "variantAxes": [
      "mode: upload | url | drag",
      "position: inline | modal"
    ],
    "stateModel": [
      "idle",
      "dragging-over",
      "uploading",
      "error"
    ],
    "previewStates": [
      "idle",
      "drag-over",
      "uploading-progress",
      "error-state",
      "dark-theme"
    ],
    "behaviorModel": [
      "drag-and-drop file handling",
      "file picker integration",
      "URL image embedding",
      "upload progress indicator",
      "file type/size validation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "default": "false",
        "required": true,
        "description": "Overlay gorunurluk durumunu kontrol eder."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "default": "-",
        "required": true,
        "description": "Overlay kapatildiginda tetiklenen callback."
      },
      {
        "name": "onUpload",
        "type": "(file: File) => Promise<string>",
        "default": "-",
        "required": true,
        "description": "Dosya yukleme islemi; yuklenen gorselin URL'ini dondurur."
      },
      {
        "name": "onInsert",
        "type": "(url: string, alt: string) => void",
        "default": "-",
        "required": true,
        "description": "Gorsel editore yerlestirildiginde tetiklenen callback."
      },
      {
        "name": "acceptedTypes",
        "type": "string[]",
        "default": "['image/*']",
        "required": false,
        "description": "Kabul edilen dosya tipleri dizisi."
      },
      {
        "name": "maxSize",
        "type": "number",
        "default": "5242880",
        "required": false,
        "description": "Maksimum dosya boyutu (byte)."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Root element icin ek CSS sinifi."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Overlay boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "drag-and-drop interaction",
      "upload progress indicator",
      "URL embed mode"
    ],
    "regressionFocus": [
      "dosya tipi validasyon dogrulugu",
      "boyut siniri asim hatasi",
      "upload progress guncelleme",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

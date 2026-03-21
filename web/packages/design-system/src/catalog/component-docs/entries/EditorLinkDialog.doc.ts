import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "EditorLinkDialog",
  indexItem: {
    "name": "EditorLinkDialog",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "planned",
    "maturity": "experimental",
    "group": "forms_data_entry",
    "subgroup": "editor",
    "taxonomyGroupId": "forms_data_entry",
    "taxonomySubgroup": "X-Editor Link Dialog",
    "demoMode": "planned",
    "description": "Editor icerisinde baglanti ekleme ve duzenleme icin overlay dialog bileseni; URL, metin ve yeni sekmede acma secenekleri sunar.",
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
    "importStatement": "import { EditorLinkDialog } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "EditorLinkDialog",
    "variantAxes": [
      "mode: create | edit",
      "position: inline | modal"
    ],
    "stateModel": [
      "hidden",
      "visible",
      "validating"
    ],
    "previewStates": [
      "create-mode",
      "edit-mode",
      "validation-error",
      "dark-theme"
    ],
    "behaviorModel": [
      "URL input validation",
      "link text editing",
      "open-in-new-tab toggle",
      "existing link detection",
      "keyboard submit/cancel",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "default": "false",
        "required": true,
        "description": "Dialog gorunurluk durumunu kontrol eder."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "default": "-",
        "required": true,
        "description": "Dialog kapatildiginda tetiklenen callback."
      },
      {
        "name": "onSubmit",
        "type": "(link: LinkData) => void",
        "default": "-",
        "required": true,
        "description": "Baglanti kaydedildiginde tetiklenen callback."
      },
      {
        "name": "initialUrl",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Duzenleme modunda mevcut URL degeri."
      },
      {
        "name": "initialText",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Duzenleme modunda mevcut baglanti metni."
      },
      {
        "name": "onRemove",
        "type": "() => void",
        "default": "-",
        "required": false,
        "description": "Mevcut baglantiyi kaldirma callback'i."
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
        "description": "Dialog boyut varyantini belirler."
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
      "create vs edit mode",
      "URL validation feedback",
      "link removal action"
    ],
    "regressionFocus": [
      "URL validasyon formati dogrulugu",
      "secili metin ile onceliklendirme",
      "keyboard submit/cancel akisi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;

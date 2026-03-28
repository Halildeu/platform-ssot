import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "Dialog",
  indexItem: {
    "name": "Dialog",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "stable",
    "group": "overlays",
    "subgroup": "dialog",
    "taxonomyGroupId": "feedback",
    "taxonomySubgroup": "Modal / Dialog / Confirm",
    "demoMode": "live",
    "description": "Native <dialog> tabanli modal overlay primitivei; boyut, dismiss davranisi ve slot yapisiyla erisilebilir dialog akislari sunar.",
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
      "wave-1",
      "foundation-primitives",
      "stable",
      "overlay"
    ],
    "importStatement": "import { Dialog } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "Dialog",
    "variantAxes": [
      "size: sm | md | lg | xl | full"
    ],
    "stateModel": [
      "open / closed",
      "escape dismiss",
      "backdrop dismiss"
    ],
    "previewStates": [
      "open",
      "closed",
      "dark-theme"
    ],
    "behaviorModel": [
      "open / closed state",
      "escape key dismiss",
      "backdrop click dismiss",
      "overlay-engine layer-stack registration",
      "native dialog showModal / close",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "default": "false",
        "required": true,
        "description": "Dialogun acik olup olmadigini kontrol eder."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "default": "-",
        "required": true,
        "description": "Dialog kapatildiginda cagrilacak callback."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        "default": "md",
        "required": false,
        "description": "Dialog genislik presetini belirler."
      },
      {
        "name": "closable",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Close butonunun gorunurlugunu kontrol eder."
      },
      {
        "name": "closeOnBackdrop",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Backdrop tiklandiginda dialog kapatilir mi kararini verir."
      },
      {
        "name": "closeOnEscape",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Escape tusuna basildiginda dialog kapatilir mi kararini verir."
      },
      {
        "name": "title",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Dialog baslik icerigi."
      },
      {
        "name": "description",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Baslik altinda gosterilen aciklama metni."
      },
      {
        "name": "footer",
        "type": "ReactNode",
        "default": "-",
        "required": false,
        "description": "Footer aksiyon alani."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Dialog root elementine ek CSS sinifi."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "required": true,
        "description": "Dialog body icerigi."
      },
      {
        "name": "slotProps",
        "type": "SlotProps<'root' | 'backdrop' | 'panel' | 'title' | 'description'>",
        "default": "-",
        "required": false,
        "description": "Internal slot elementlerine override yuzeyini saglar."
      }
    ],
    "previewFocus": [
      "size matrisi",
      "dismiss behavior matrix",
      "title + description + footer layout"
    ],
    "regressionFocus": [
      "native dialog a11y",
      "escape/backdrop close parity",
      "overlay-engine layer-stack cleanup"
    ]
  },
};

export default entry;

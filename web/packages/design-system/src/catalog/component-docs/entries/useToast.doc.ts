import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "useToast",
  indexItem: {
  "name": "useToast",
  "kind": "hook",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "feedback",
  "subgroup": "toast_notification",
  "taxonomyGroupId": "runtime_utilities",
  "taxonomySubgroup": "Hooks (useX)",
  "demoMode": "inspector",
  "description": "Context bagli toast API'sini push, dismiss ve severity helper'lariyla sunan hook.",
  "sectionIds": [
    "utility_components",
    "integration_distribution",
    "state_feedback"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { useToast } from '@mfe/design-system';",
  "whereUsed": [
    "web/apps/mfe-shell/src/app/ShellApp.ui.tsx",
    "web/packages/design-system/src/components/entity-grid/EntityGridTemplate.tsx",
    "web/stories/ToastProvider.stories.tsx"
  ]
},
  apiItem: {
  "name": "useToast",
  "variantAxes": [
    "severity helper: success | info | warning | error | loading",
    "payload: string title | structured toast input",
    "dismissal: dismiss(id) | dismissAll()",
    "provider-state: mounted | missing-provider"
  ],
  "stateModel": [
    "toast context lookup",
    "imperative push delegation",
    "severity-specific helper delegation",
    "dismiss and dismissAll passthrough",
    "provider guard error"
  ],
    "previewStates": [],
    "behaviorModel": [
      "toast context lookup",
      "imperative push delegation",
      "severity-specific helper delegation",
      "dismiss and dismissAll passthrough",
      "provider guard error"
    ],
  "props": [
    {
      "name": "hook args",
      "type": "-",
      "default": "-",
      "required": false,
      "description": "Hook parametre almaz; aktif ToastProvider context'ini okuyup ayni toast API yuzeyini geri dondurur."
    },
    {
      "name": "return api",
      "type": "ToastApi",
      "default": "-",
      "required": false,
      "description": "toasts, push, dismiss, dismissAll ve success/info/warning/error/loading helper'larini expose eder."
    },
    {
      "name": "push input / helper input",
      "type": "ToastInput | string",
      "default": "-",
      "required": false,
      "description": "String kisa title, object ise title, description, action, duration, closable ve onClose alanlarini tasir."
    }
  ],
  "previewFocus": [
    "success, error ve loading helper tetikleri",
    "dismissAll ile queue temizleme",
    "ToastProvider story shell entegrasyonu"
  ],
  "regressionFocus": [
    "provider disi guard error",
    "loading toast non-expiring default",
    "dismissAll passthrough",
    "structured input delegation"
  ]
},
};

export default entry;

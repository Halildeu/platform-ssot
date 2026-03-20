import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "resolveAccessState",
  indexItem: {
  "name": "resolveAccessState",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "runtime",
  "subgroup": "access",
  "taxonomyGroupId": "auth_security_ui",
  "taxonomySubgroup": "Permission gates",
  "demoMode": "inspector",
  "description": "Permission/access seviyesini render davranisina cevirir.",
  "sectionIds": [
    "utility_components",
    "accessibility_compliance",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { resolveAccessState } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "resolveAccessState",
  "variantAxes": [
    "input: full | readonly | disabled | hidden",
    "consumer: component render | event guard",
    "output: state + booleans"
  ],
  "stateModel": [
    "default full fallback",
    "hidden flag derivation",
    "readonly/disabled boolean mapping"
  ],
    "previewStates": [],
    "behaviorModel": [
      "default full fallback",
      "hidden flag derivation",
      "readonly/disabled boolean mapping"
    ],
  "props": [
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "full",
      "required": false,
      "description": "Access seviyesini state, isHidden, isReadonly ve isDisabled alanlarina normalize eder."
    }
  ],
  "previewFocus": [
    "access level resolution",
    "render visibility mapping"
  ],
  "regressionFocus": [
    "default full fallback",
    "hidden/readonly/disabled parity",
    "boolean flag correctness"
  ]
},
};

export default entry;

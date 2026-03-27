import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "withAccessGuard",
  indexItem: {
  "name": "withAccessGuard",
  "kind": "function",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "stable",
  "group": "runtime",
  "subgroup": "access",
  "taxonomyGroupId": "hocs",
  "taxonomySubgroup": "withAccessGuard",
  "demoMode": "inspector",
  "description": "Readonly/disabled guard davranisini event handler seviyesinde uygular.",
  "sectionIds": [
    "utility_components",
    "accessibility_compliance",
    "integration_distribution"
  ],
  "qualityGates": [
    "registry_export_sync"
  ],
  "importStatement": "import { withAccessGuard } from '@mfe/design-system';",
  "whereUsed": []
},
  apiItem: {
  "name": "withAccessGuard",
  "variantAxes": [
    "state: full | readonly | disabled",
    "handler: sync | async | absent",
    "blocking: native-disabled | policy-guard"
  ],
  "stateModel": [
    "preventDefault + stopPropagation",
    "handler passthrough",
    "external disabled precedence"
  ],
    "previewStates": [],
    "behaviorModel": [
      "preventDefault + stopPropagation",
      "handler passthrough",
      "external disabled precedence"
    ],
  "props": [
    {
      "name": "state",
      "type": "AccessLevel",
      "default": "-",
      "required": true,
      "description": "Event handler'in hangi access seviyesinde calisacagini belirler."
    },
    {
      "name": "handler",
      "type": "(event) => void | Promise<void>",
      "default": "-",
      "required": false,
      "description": "Block edilmedigi durumda cagrilacak asil event handler."
    },
    {
      "name": "externallyDisabled",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Native disabled veya dis policy override'i oldugunda handler'i ek olarak bloke eder."
    }
  ],
  "previewFocus": [
    "readonly click guard",
    "disabled event suppression",
    "handler passthrough"
  ],
  "regressionFocus": [
    "preventDefault/stopPropagation parity",
    "async handler passthrough",
    "external disabled precedence"
  ]
},
};

export default entry;

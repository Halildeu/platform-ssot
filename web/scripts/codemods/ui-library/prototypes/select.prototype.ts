export const selectCodemodPrototype = {
  candidateId: 'select-mfe-shell-codemod',
  component: 'Select',
  transformKind: 'options-prop-normalization',
  runPlan: [
    "findImport('Select', '@mfe/design-system')",
    'locate JSX nodes with options + placeholder signals',
    'preserve controlled value/onChange pair',
    "inject approved accessReason only for readonly variants missing an explanation",
  ],
};

export default selectCodemodPrototype;

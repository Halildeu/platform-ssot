export const emptyCodemodPrototype = {
  candidateId: 'empty-mfe-shell-codemod',
  component: 'Empty',
  transformKind: 'jsx-prop-normalization',
  runPlan: [
    "findImport('Empty', '@mfe/design-system')",
    "findJsxElements('Empty')",
    "if access === 'readonly' and accessReason missing -> inject approved fallback",
    'preserve description prop and className exactly as-is',
  ],
};

export default emptyCodemodPrototype;

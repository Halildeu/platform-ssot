export const themePreviewCardCodemodPrototype = {
  candidateId: 'themepreviewcard-mfe-shell-codemod',
  component: 'ThemePreviewCard',
  transformKind: 'selection-state-normalization',
  runPlan: [
    "findImport('ThemePreviewCard', '@mfe/design-system')",
    'normalize boolean selected prop usage',
    'preserve className width and density layout utilities',
    'skip computed selected expressions requiring owner review',
  ],
};

export default themePreviewCardCodemodPrototype;

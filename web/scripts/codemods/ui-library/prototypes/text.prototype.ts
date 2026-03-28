export const textCodemodPrototype = {
  candidateId: 'text-mfe-shell-codemod',
  component: 'Text',
  transformKind: 'typography-prop-normalization',
  runPlan: [
    "findImport('Text', '@mfe/design-system')",
    'locate Text JSX nodes with variant/preset signals',
    'preserve text content and semantic element choice',
    'skip clamp/truncate mixed cases until visual diff review completes',
  ],
};

export default textCodemodPrototype;

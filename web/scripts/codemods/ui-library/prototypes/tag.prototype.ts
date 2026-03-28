export const tagCodemodPrototype = {
  candidateId: 'tag-mfe-shell-codemod',
  component: 'Tag',
  transformKind: 'tone-access-normalization',
  runPlan: [
    "findImport('Tag', '@mfe/design-system')",
    'normalize tone/access prop ordering',
    'preserve child label text and casing',
    'skip non-semantic tone values until manual review clears the mapping',
  ],
};

export default tagCodemodPrototype;

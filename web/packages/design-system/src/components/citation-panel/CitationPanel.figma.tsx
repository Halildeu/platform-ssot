import figma from '@figma/code-connect';
import { CitationPanel } from './CitationPanel';

figma.connect(CitationPanel, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    compact: figma.boolean('Compact'),
  },
  example: ({ compact }) => (
    <CitationPanel compact={compact} />
  ),
});

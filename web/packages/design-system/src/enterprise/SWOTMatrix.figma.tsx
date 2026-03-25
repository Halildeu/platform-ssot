import figma from '@figma/code-connect';
import { SWOTMatrix } from './SWOTMatrix';

figma.connect(SWOTMatrix, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    compact: figma.boolean('Compact'),
  },
  example: ({ title, compact }) => (
    <SWOTMatrix title={title} compact={compact} />
  ),
});

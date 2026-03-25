import figma from '@figma/code-connect';
import { EntitySummaryBlock } from './EntitySummaryBlock';

figma.connect(EntitySummaryBlock, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    alt: figma.string('Alt'),
    name: figma.string('Name'),
  },
  example: ({ alt, name }) => (
    <EntitySummaryBlock alt={alt} name={name} />
  ),
});

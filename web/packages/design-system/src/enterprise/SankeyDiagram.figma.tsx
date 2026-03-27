import figma from '@figma/code-connect';
import { SankeyDiagram } from './SankeyDiagram';

figma.connect(SankeyDiagram, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showValues: figma.boolean('ShowValues'),
  },
  example: ({ showValues }) => (
    <SankeyDiagram showValues={showValues} />
  ),
});

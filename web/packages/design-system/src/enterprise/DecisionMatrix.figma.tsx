import figma from '@figma/code-connect';
import { DecisionMatrix } from './DecisionMatrix';

figma.connect(DecisionMatrix, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showWeightedTotals: figma.boolean('ShowWeightedTotals'),
    highlightWinner: figma.boolean('HighlightWinner'),
    title: figma.string('Title'),
  },
  example: ({ showWeightedTotals, highlightWinner, title }) => (
    <DecisionMatrix showWeightedTotals={showWeightedTotals} highlightWinner={highlightWinner} title={title} />
  ),
});

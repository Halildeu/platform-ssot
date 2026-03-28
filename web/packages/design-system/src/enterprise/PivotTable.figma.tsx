import figma from '@figma/code-connect';
import { PivotTable } from './PivotTable';

figma.connect(PivotTable, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showTotals: figma.boolean('ShowTotals'),
    compact: figma.boolean('Compact'),
    sortable: figma.boolean('Sortable'),
  },
  example: ({ showTotals, compact, sortable }) => (
    <PivotTable showTotals={showTotals} compact={compact} sortable={sortable} />
  ),
});

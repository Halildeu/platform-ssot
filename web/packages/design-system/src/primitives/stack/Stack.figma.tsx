import figma from '@figma/code-connect';
import { Stack } from './Stack';

figma.connect(Stack, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    direction: figma.enum('Direction', {
      row: 'row',
      column: 'column',
      row-reverse: 'row-reverse',
      column-reverse: 'column-reverse',
    }),
    align: figma.enum('Align', {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch',
      baseline: 'baseline',
    }),
    justify: figma.enum('Justify', {
      start: 'start',
      center: 'center',
      end: 'end',
      between: 'between',
      around: 'around',
      evenly: 'evenly',
    }),
    wrap: figma.boolean('Wrap'),
  },
  example: (props) => (
    <Stack {...props} />
  ),
});

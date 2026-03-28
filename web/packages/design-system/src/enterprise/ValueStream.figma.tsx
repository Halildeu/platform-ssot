import figma from '@figma/code-connect';
import { ValueStream } from './ValueStream';

figma.connect(ValueStream, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    timeUnit: figma.enum('TimeUnit', {
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
    }),
  },
  example: ({ timeUnit }) => (
    <ValueStream timeUnit={timeUnit} />
  ),
});

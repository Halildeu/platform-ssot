import figma from '@figma/code-connect';
import { TimePicker } from './TimePicker';

figma.connect(TimePicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invalid: figma.boolean('Invalid'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ invalid, fullWidth }) => (
    <TimePicker invalid={invalid} fullWidth={fullWidth} />
  ),
});

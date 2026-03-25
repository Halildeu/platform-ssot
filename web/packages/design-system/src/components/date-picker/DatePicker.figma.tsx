import figma from '@figma/code-connect';
import { DatePicker } from './DatePicker';

figma.connect(DatePicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invalid: figma.boolean('Invalid'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ invalid, fullWidth }) => (
    <DatePicker invalid={invalid} fullWidth={fullWidth} />
  ),
});

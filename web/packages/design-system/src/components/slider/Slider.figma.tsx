import figma from '@figma/code-connect';
import { Slider } from './Slider';

figma.connect(Slider, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invalid: figma.boolean('Invalid'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ invalid, fullWidth }) => (
    <Slider invalid={invalid} fullWidth={fullWidth} />
  ),
});

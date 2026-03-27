import figma from '@figma/code-connect';
import { SummaryStrip } from './SummaryStrip';

figma.connect(SummaryStrip, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <SummaryStrip  />
  ),
});

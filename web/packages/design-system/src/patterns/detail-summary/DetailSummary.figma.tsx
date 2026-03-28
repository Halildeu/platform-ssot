import figma from '@figma/code-connect';
import { DetailSummary } from './DetailSummary';

figma.connect(DetailSummary, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <DetailSummary  />
  ),
});

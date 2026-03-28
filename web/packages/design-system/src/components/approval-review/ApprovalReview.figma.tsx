import figma from '@figma/code-connect';
import { ApprovalReview } from './ApprovalReview';

figma.connect(ApprovalReview, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <ApprovalReview  />
  ),
});

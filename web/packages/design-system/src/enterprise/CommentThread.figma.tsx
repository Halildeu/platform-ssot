import figma from '@figma/code-connect';
import { CommentThread } from './CommentThread';

figma.connect(CommentThread, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showReplyForm: figma.boolean('ShowReplyForm'),
  },
  example: ({ showReplyForm }) => (
    <CommentThread showReplyForm={showReplyForm} />
  ),
});

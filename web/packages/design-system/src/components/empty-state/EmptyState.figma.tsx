import figma from '@figma/code-connect';
import { EmptyState } from './EmptyState';

figma.connect(EmptyState, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    compact: figma.boolean('Compact'),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ compact, accessReason }) => (
    <EmptyState compact={compact} accessReason={accessReason} />
  ),
});

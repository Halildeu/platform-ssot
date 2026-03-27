import figma from '@figma/code-connect';
import { ApprovalWorkflow } from './ApprovalWorkflow';

figma.connect(ApprovalWorkflow, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    compact: figma.boolean('Compact'),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ orientation, compact, accessReason }) => (
    <ApprovalWorkflow orientation={orientation} compact={compact} accessReason={accessReason} />
  ),
});

import figma from '@figma/code-connect';
import { ApprovalCheckpoint } from './ApprovalCheckpoint';

figma.connect(ApprovalCheckpoint, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    status: figma.enum('Status', {
      pending: 'pending',
      approved: 'approved',
      rejected: 'rejected',
      blocked: 'blocked',
    }),
    primaryActionLabel: figma.string('PrimaryActionLabel'),
    secondaryActionLabel: figma.string('SecondaryActionLabel'),
  },
  example: ({ status, primaryActionLabel, secondaryActionLabel }) => (
    <ApprovalCheckpoint status={status} primaryActionLabel={primaryActionLabel} secondaryActionLabel={secondaryActionLabel} />
  ),
});

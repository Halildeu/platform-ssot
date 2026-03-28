import figma from '@figma/code-connect';
import { GovernanceBoard } from './GovernanceBoard';

figma.connect(GovernanceBoard, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    groupBy: figma.enum('GroupBy', {
      domain: 'domain',
      status: 'status',
      severity: 'severity',
    }),
  },
  example: ({ groupBy }) => (
    <GovernanceBoard groupBy={groupBy} />
  ),
});

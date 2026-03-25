import figma from '@figma/code-connect';
import { AIActionAuditTimeline } from './AIActionAuditTimeline';

figma.connect(AIActionAuditTimeline, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    compact: figma.boolean('Compact'),
  },
  example: ({ compact }) => (
    <AIActionAuditTimeline compact={compact} />
  ),
});

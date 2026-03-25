import figma from '@figma/code-connect';
import { FineKinney } from './FineKinney';

figma.connect(FineKinney, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showControls: figma.boolean('ShowControls'),
    showStatus: figma.boolean('ShowStatus'),
    compact: figma.boolean('Compact'),
  },
  example: ({ showControls, showStatus, compact }) => (
    <FineKinney showControls={showControls} showStatus={showStatus} compact={compact} />
  ),
});

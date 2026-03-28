import figma from '@figma/code-connect';
import { AnchorToc } from './AnchorToc';

figma.connect(AnchorToc, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
    }),
    sticky: figma.boolean('Sticky'),
    syncWithHash: figma.boolean('SyncWithHash'),
    navigationLabel: figma.string('NavigationLabel'),
  },
  example: (props) => (
    <AnchorToc {...props} />
  ),
});

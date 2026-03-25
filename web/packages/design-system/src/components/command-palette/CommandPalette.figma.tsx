import figma from '@figma/code-connect';
import { CommandPalette } from './CommandPalette';

figma.connect(CommandPalette, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    query: figma.string('Query'),
    defaultQuery: figma.string('DefaultQuery'),
    placeholder: figma.string('Placeholder'),
    emptyStateLabel: figma.string('EmptyStateLabel'),
  },
  example: (props) => (
    <CommandPalette {...props} />
  ),
});

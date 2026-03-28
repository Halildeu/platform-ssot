import figma from '@figma/code-connect';
import { ThemePreviewCard } from './ThemePreviewCard';

figma.connect(ThemePreviewCard, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    selected: figma.boolean('Selected'),
  },
  example: ({ selected }) => (
    <ThemePreviewCard selected={selected} />
  ),
});

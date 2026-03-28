import figma from '@figma/code-connect';
import { AIGuidedAuthoring } from './AIGuidedAuthoring';

figma.connect(AIGuidedAuthoring, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    paletteOpen: figma.boolean('PaletteOpen'),
    defaultPaletteOpen: figma.boolean('DefaultPaletteOpen'),
  },
  example: ({ paletteOpen, defaultPaletteOpen }) => (
    <AIGuidedAuthoring paletteOpen={paletteOpen} defaultPaletteOpen={defaultPaletteOpen} />
  ),
});

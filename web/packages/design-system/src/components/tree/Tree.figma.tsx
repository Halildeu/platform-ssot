import figma from '@figma/code-connect';
import { Tree } from './Tree';

figma.connect(Tree, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
    }),
    loading: figma.boolean('Loading'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ density, loading, fullWidth }) => (
    <Tree density={density} loading={loading} fullWidth={fullWidth} />
  ),
});

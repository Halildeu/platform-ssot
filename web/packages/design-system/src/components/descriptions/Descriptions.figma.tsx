import figma from '@figma/code-connect';
import { Descriptions } from './Descriptions';

figma.connect(Descriptions, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
    }),
    bordered: figma.boolean('Bordered'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ density, bordered, fullWidth }) => (
    <Descriptions density={density} bordered={bordered} fullWidth={fullWidth} />
  ),
});

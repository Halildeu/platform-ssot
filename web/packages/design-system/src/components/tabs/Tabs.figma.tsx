import figma from '@figma/code-connect';
import { Tabs } from './Tabs';

figma.connect(Tabs, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      line: 'line',
      enclosed: 'enclosed',
      pill: 'pill',
      standard: 'standard',
      fullWidth: 'fullWidth',
      scrollable: 'scrollable',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    activeKey: figma.string('ActiveKey'),
    defaultActiveKey: figma.string('DefaultActiveKey'),
    fullWidth: figma.boolean('FullWidth'),
    density: figma.enum('Density', {
      compact: 'compact',
      comfortable: 'comfortable',
      spacious: 'spacious',
    }),
  },
  example: (props) => (
    <Tabs {...props} />
  ),
});

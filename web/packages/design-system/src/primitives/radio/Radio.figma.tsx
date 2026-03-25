import figma from '@figma/code-connect';
import { Radio } from './Radio';

figma.connect(Radio, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    description: figma.string('Description'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    radioSize: figma.enum('RadioSize', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    density: figma.enum('Density', {
      compact: 'compact',
      comfortable: 'comfortable',
      spacious: 'spacious',
    }),
    loading: figma.boolean('Loading'),
  },
  example: (props) => (
    <Radio {...props} />
  ),
});

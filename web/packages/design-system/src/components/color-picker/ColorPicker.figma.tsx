import figma from '@figma/code-connect';
import { ColorPicker } from './ColorPicker';

figma.connect(ColorPicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    format: figma.enum('Format', {
      hex: 'hex',
      rgb: 'rgb',
      hsl: 'hsl',
    }),
    showInput: figma.boolean('ShowInput'),
    showPresets: figma.boolean('ShowPresets'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    label: figma.string('Label'),
    description: figma.string('Description'),
  },
  example: (props) => (
    <ColorPicker {...props} />
  ),
});

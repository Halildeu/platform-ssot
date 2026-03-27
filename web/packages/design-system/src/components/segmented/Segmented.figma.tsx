import figma from '@figma/code-connect';
import { Segmented } from './Segmented';

figma.connect(Segmented, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    selectionMode: figma.enum('SelectionMode', {
      single: 'single',
      multiple: 'multiple',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    appearance: figma.enum('Appearance', {
      default: 'default',
      outline: 'outline',
      ghost: 'ghost',
    }),
    variant: figma.enum('Variant', {
      default: 'default',
      outline: 'outline',
      ghost: 'ghost',
    }),
    shape: figma.enum('Shape', {
      rounded: 'rounded',
      pill: 'pill',
    }),
    iconPosition: figma.enum('IconPosition', {
      start: 'start',
      end: 'end',
      top: 'top',
    }),
    allowEmptySelection: figma.boolean('AllowEmptySelection'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: (props) => (
    <Segmented {...props} />
  ),
});

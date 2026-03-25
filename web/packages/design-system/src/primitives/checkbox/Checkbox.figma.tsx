import figma from '@figma/code-connect';
import { Checkbox } from './Checkbox';

figma.connect(Checkbox, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    checkboxSize: figma.enum('CheckboxSize', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    defaultChecked: figma.boolean('DefaultChecked'),
    indeterminate: figma.boolean('Indeterminate'),
    density: figma.enum('Density', {
      compact: 'compact',
      comfortable: 'comfortable',
      spacious: 'spacious',
    }),
    variant: figma.enum('Variant', {
      default: 'default',
      card: 'card',
    }),
    loading: figma.boolean('Loading'),
  },
  example: (props) => (
    <Checkbox {...props} />
  ),
});

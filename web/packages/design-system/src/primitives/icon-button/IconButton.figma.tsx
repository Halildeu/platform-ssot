import figma from '@figma/code-connect';
import { IconButton } from './IconButton';

figma.connect(IconButton, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      primary: 'primary',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      danger: 'danger',
    }),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    loading: figma.boolean('Loading'),
    rounded: figma.boolean('Rounded'),
  },
  example: (props) => (
    <IconButton {...props} />
  ),
});

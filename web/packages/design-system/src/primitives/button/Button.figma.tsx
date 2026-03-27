import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      primary: 'primary',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      danger: 'danger',
      link: 'link',
    }),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, variant, size, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  ),
});

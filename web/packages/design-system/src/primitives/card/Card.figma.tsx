import figma from '@figma/code-connect';
import { Card } from './Card';

figma.connect(Card, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      elevated: 'elevated',
      outlined: 'outlined',
      filled: 'filled',
      ghost: 'ghost',
    }),
    padding: figma.enum('Padding', {
      none: 'none',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    hoverable: figma.boolean('Hoverable'),
  },
  example: ({ variant, padding, hoverable }) => (
    <Card variant={variant} padding={padding} hoverable={hoverable} />
  ),
});

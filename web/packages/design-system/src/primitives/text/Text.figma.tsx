import figma from '@figma/code-connect';
import { Text } from './Text';

figma.connect(Text, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      default: 'default',
      secondary: 'secondary',
      muted: 'muted',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
    }),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      base: 'base',
      lg: 'lg',
      xl: 'xl',
      2xl: '2xl',
      3xl: '3xl',
      4xl: '4xl',
    }),
    weight: figma.enum('Weight', {
      normal: 'normal',
      medium: 'medium',
      semibold: 'semibold',
      bold: 'bold',
    }),
    truncate: figma.boolean('Truncate'),
    mono: figma.boolean('Mono'),
  },
  example: (props) => (
    <Text {...props} />
  ),
});

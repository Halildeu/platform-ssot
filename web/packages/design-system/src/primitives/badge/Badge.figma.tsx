import figma from '@figma/code-connect';
import { Badge } from './Badge';

figma.connect(Badge, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      error: 'error',
      danger: 'danger',
      info: 'info',
      muted: 'muted',
    }),
    tone: figma.enum('Tone', {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      error: 'error',
      danger: 'danger',
      info: 'info',
      muted: 'muted',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    dot: figma.boolean('Dot'),
  },
  example: (props) => (
    <Badge {...props} />
  ),
});

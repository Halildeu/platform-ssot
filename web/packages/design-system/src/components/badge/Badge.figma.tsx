import figma from '@figma/code-connect';
import { Badge } from './Badge';

figma.connect(Badge, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      default: 'default',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
    }),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
  },
  example: ({ label, variant, size }) => (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  ),
});

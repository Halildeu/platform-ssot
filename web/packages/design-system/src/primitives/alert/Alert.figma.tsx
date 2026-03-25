import figma from '@figma/code-connect';
import { Alert } from './Alert';

figma.connect(Alert, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error',
    }),
    severity: figma.enum('Severity', {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error',
    }),
    closable: figma.boolean('Closable'),
  },
  example: ({ variant, severity, closable }) => (
    <Alert variant={variant} severity={severity} closable={closable} />
  ),
});

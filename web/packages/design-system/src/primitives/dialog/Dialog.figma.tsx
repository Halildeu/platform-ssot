import figma from '@figma/code-connect';
import { Dialog } from './Dialog';

figma.connect(Dialog, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      full: 'full',
    }),
    closable: figma.boolean('Closable'),
    closeOnBackdrop: figma.boolean('CloseOnBackdrop'),
    closeOnEscape: figma.boolean('CloseOnEscape'),
  },
  example: (props) => (
    <Dialog {...props} />
  ),
});

import figma from '@figma/code-connect';
import { FormDrawer } from './FormDrawer';

figma.connect(FormDrawer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    placement: figma.enum('Placement', {
      right: 'right',
      left: 'left',
    }),
    closeOnBackdrop: figma.boolean('CloseOnBackdrop'),
    closeOnEscape: figma.boolean('CloseOnEscape'),
    loading: figma.boolean('Loading'),
  },
  example: (props) => (
    <FormDrawer {...props} />
  ),
});

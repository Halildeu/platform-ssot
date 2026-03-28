import figma from '@figma/code-connect';
import { DetailDrawer } from './DetailDrawer';

figma.connect(DetailDrawer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    size: figma.enum('Size', {
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      full: 'full',
    }),
    closeOnBackdrop: figma.boolean('CloseOnBackdrop'),
  },
  example: ({ open, size, closeOnBackdrop }) => (
    <DetailDrawer open={open} size={size} closeOnBackdrop={closeOnBackdrop} />
  ),
});

import figma from '@figma/code-connect';
import { Drawer } from './Drawer';

figma.connect(Drawer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    placement: figma.enum('Placement', {
      left: 'left',
      right: 'right',
      top: 'top',
      bottom: 'bottom',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      full: 'full',
    }),
    closeOnOverlayClick: figma.boolean('CloseOnOverlayClick'),
    closeOnEscape: figma.boolean('CloseOnEscape'),
    showOverlay: figma.boolean('ShowOverlay'),
  },
  example: (props) => (
    <Drawer {...props} />
  ),
});

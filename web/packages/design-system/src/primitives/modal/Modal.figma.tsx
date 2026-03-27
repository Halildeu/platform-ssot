import figma from '@figma/code-connect';
import { Modal } from './Modal';

figma.connect(Modal, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    fullWidth: figma.boolean('FullWidth'),
    surface: figma.enum('Surface', {
      base: 'base',
      confirm: 'confirm',
      destructive: 'destructive',
      audit: 'audit',
    }),
    variant: figma.enum('Variant', {
      base: 'base',
      confirm: 'confirm',
      destructive: 'destructive',
      audit: 'audit',
    }),
    closeOnOverlayClick: figma.boolean('CloseOnOverlayClick'),
    closeOnEscape: figma.boolean('CloseOnEscape'),
    keepMounted: figma.boolean('KeepMounted'),
    destroyOnHidden: figma.boolean('DestroyOnHidden'),
    disablePortal: figma.boolean('DisablePortal'),
  },
  example: (props) => (
    <Modal {...props} />
  ),
});

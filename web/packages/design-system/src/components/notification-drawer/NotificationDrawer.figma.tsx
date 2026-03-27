import figma from '@figma/code-connect';
import { NotificationDrawer } from './NotificationDrawer';

figma.connect(NotificationDrawer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    closeLabel: figma.string('CloseLabel'),
    closeOnOverlayClick: figma.boolean('CloseOnOverlayClick'),
    closeOnEscape: figma.boolean('CloseOnEscape'),
    keepMounted: figma.boolean('KeepMounted'),
    destroyOnHidden: figma.boolean('DestroyOnHidden'),
    disablePortal: figma.boolean('DisablePortal'),
    dialogLabel: figma.string('DialogLabel'),
    widthClassName: figma.string('WidthClassName'),
    panelClassName: figma.string('PanelClassName'),
  },
  example: (props) => (
    <NotificationDrawer {...props} />
  ),
});

import figma from '@figma/code-connect';
import { Popover } from './Popover';

figma.connect(Popover, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    triggerMode: figma.enum('TriggerMode', {
      click: 'click',
      hover: 'hover',
      focus: 'focus',
      hover-focus: 'hover-focus',
    }),
    open: figma.boolean('Open'),
    defaultOpen: figma.boolean('DefaultOpen'),
    disablePortal: figma.boolean('DisablePortal'),
    flipOnCollision: figma.boolean('FlipOnCollision'),
    showArrow: figma.boolean('ShowArrow'),
    arrowClassName: figma.string('ArrowClassName'),
    panelClassName: figma.string('PanelClassName'),
  },
  example: (props) => (
    <Popover {...props} />
  ),
});

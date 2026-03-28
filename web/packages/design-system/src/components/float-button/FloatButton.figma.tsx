import figma from '@figma/code-connect';
import { FloatButton } from './FloatButton';

figma.connect(FloatButton, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    tooltip: figma.string('Tooltip'),
    shape: figma.enum('Shape', {
      circle: 'circle',
      square: 'square',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    position: figma.enum('Position', {
      bottom-right: 'bottom-right',
      bottom-left: 'bottom-left',
      top-right: 'top-right',
      top-left: 'top-left',
    }),
    trigger: figma.enum('Trigger', {
      click: 'click',
      hover: 'hover',
    }),
    open: figma.boolean('Open'),
  },
  example: (props) => (
    <FloatButton {...props} />
  ),
});

import figma from '@figma/code-connect';
import { Tooltip } from './Tooltip';

figma.connect(Tooltip, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    placement: figma.enum('Placement', {
      top: 'top',
      bottom: 'bottom',
      left: 'left',
      right: 'right',
    }),
    align: figma.enum('Align', {
      start: 'start',
      center: 'center',
      end: 'end',
    }),
    disabled: figma.boolean('Disabled'),
    showArrow: figma.boolean('ShowArrow'),
  },
  example: (props) => (
    <Tooltip {...props} />
  ),
});

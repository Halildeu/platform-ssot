import figma from '@figma/code-connect';
import { Dropdown } from './Dropdown';

figma.connect(Dropdown, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    placement: figma.enum('Placement', {
      bottom-start: 'bottom-start',
      bottom-end: 'bottom-end',
      top-start: 'top-start',
      top-end: 'top-end',
    }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ placement, disabled }) => (
    <Dropdown placement={placement} disabled={disabled} />
  ),
});

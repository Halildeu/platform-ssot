import figma from '@figma/code-connect';
import { Accordion } from './Accordion';

figma.connect(Accordion, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    selectionMode: figma.enum('SelectionMode', {
      single: 'single',
      multiple: 'multiple',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
    bordered: figma.boolean('Bordered'),
    ghost: figma.boolean('Ghost'),
    showArrow: figma.boolean('ShowArrow'),
    expandIconPosition: figma.enum('ExpandIconPosition', {
      start: 'start',
      end: 'end',
    }),
    disableGutters: figma.boolean('DisableGutters'),
    destroyOnHidden: figma.boolean('DestroyOnHidden'),
    collapsible: figma.enum('Collapsible', {
      header: 'header',
      icon: 'icon',
      disabled: 'disabled',
    }),
  },
  example: (props) => (
    <Accordion {...props} />
  ),
});

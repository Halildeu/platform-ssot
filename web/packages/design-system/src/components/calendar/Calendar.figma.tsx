import figma from '@figma/code-connect';
import { Calendar } from './Calendar';

figma.connect(Calendar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    mode: figma.enum('Mode', {
      single: 'single',
      multiple: 'multiple',
      range: 'range',
    }),
    showWeekNumbers: figma.boolean('ShowWeekNumbers'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    showOutsideDays: figma.boolean('ShowOutsideDays'),
  },
  example: (props) => (
    <Calendar {...props} />
  ),
});

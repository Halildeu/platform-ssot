import figma from '@figma/code-connect';
import { Timeline } from './Timeline';

figma.connect(Timeline, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    color: figma.enum('Color', {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info',
    }),
    pending: figma.boolean('Pending'),
  },
  example: ({ color, pending }) => (
    <Timeline color={color} pending={pending} />
  ),
});

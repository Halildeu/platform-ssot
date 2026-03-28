import figma from '@figma/code-connect';
import { Steps } from './Steps';

figma.connect(Steps, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    direction: figma.enum('Direction', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    status: figma.enum('Status', {
      wait: 'wait',
      process: 'process',
      finish: 'finish',
      error: 'error',
    }),
    dot: figma.boolean('Dot'),
  },
  example: (props) => (
    <Steps {...props} />
  ),
});

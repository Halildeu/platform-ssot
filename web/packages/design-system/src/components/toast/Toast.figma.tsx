import figma from '@figma/code-connect';
import { Toast } from './Toast';

figma.connect(Toast, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    position: figma.enum('Position', {
      top-right: 'top-right',
      top-center: 'top-center',
      bottom-right: 'bottom-right',
      bottom-center: 'bottom-center',
    }),
    animated: figma.boolean('Animated'),
  },
  example: ({ position, animated }) => (
    <Toast position={position} animated={animated} />
  ),
});

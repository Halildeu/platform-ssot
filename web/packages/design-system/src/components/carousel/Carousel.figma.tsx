import figma from '@figma/code-connect';
import { Carousel } from './Carousel';

figma.connect(Carousel, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    autoPlay: figma.boolean('AutoPlay'),
    showDots: figma.boolean('ShowDots'),
    showArrows: figma.boolean('ShowArrows'),
    loop: figma.boolean('Loop'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    orientation: figma.enum('Orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
  },
  example: (props) => (
    <Carousel {...props} />
  ),
});

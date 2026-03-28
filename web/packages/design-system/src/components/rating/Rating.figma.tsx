import figma from '@figma/code-connect';
import { Rating } from './Rating';

figma.connect(Rating, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    allowHalf: figma.boolean('AllowHalf'),
    allowClear: figma.boolean('AllowClear'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    showValue: figma.boolean('ShowValue'),
  },
  example: (props) => (
    <Rating {...props} />
  ),
});

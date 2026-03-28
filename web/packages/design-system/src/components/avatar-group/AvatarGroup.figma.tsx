import figma from '@figma/code-connect';
import { AvatarGroup } from './AvatarGroup';

figma.connect(AvatarGroup, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    shape: figma.enum('Shape', {
      circle: 'circle',
      square: 'square',
    }),
    spacing: figma.enum('Spacing', {
      tight: 'tight',
      normal: 'normal',
      loose: 'loose',
    }),
  },
  example: ({ size, shape, spacing }) => (
    <AvatarGroup size={size} shape={shape} spacing={spacing} />
  ),
});

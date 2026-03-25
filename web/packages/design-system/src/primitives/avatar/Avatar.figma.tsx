import figma from '@figma/code-connect';
import { Avatar } from './Avatar';

figma.connect(Avatar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    src: figma.string('Src'),
    alt: figma.string('Alt'),
    initials: figma.string('Initials'),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
      2xl: '2xl',
    }),
    shape: figma.enum('Shape', {
      circle: 'circle',
      square: 'square',
    }),
  },
  example: (props) => (
    <Avatar {...props} />
  ),
});

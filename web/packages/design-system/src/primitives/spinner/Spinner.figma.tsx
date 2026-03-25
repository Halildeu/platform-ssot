import figma from '@figma/code-connect';
import { Spinner } from './Spinner';

figma.connect(Spinner, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    label: figma.string('Label'),
    mode: figma.enum('Mode', {
      inline: 'inline',
      block: 'block',
    }),
  },
  example: ({ size, label, mode }) => (
    <Spinner size={size} label={label} mode={mode} />
  ),
});

import figma from '@figma/code-connect';
import { LinkInline } from './LinkInline';

figma.connect(LinkInline, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    tone: figma.enum('Tone', {
      primary: 'primary',
      secondary: 'secondary',
    }),
    variant: figma.enum('Variant', {
      primary: 'primary',
      secondary: 'secondary',
    }),
    underline: figma.enum('Underline', {
      always: 'always',
      hover: 'hover',
      none: 'none',
    }),
    current: figma.boolean('Current'),
    disabled: figma.boolean('Disabled'),
    external: figma.boolean('External'),
  },
  example: (props) => (
    <LinkInline {...props} />
  ),
});

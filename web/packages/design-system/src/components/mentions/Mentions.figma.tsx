import figma from '@figma/code-connect';
import { Mentions } from './Mentions';

figma.connect(Mentions, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    trigger: figma.string('Trigger'),
    placeholder: figma.string('Placeholder'),
    label: figma.string('Label'),
    error: figma.boolean('Error'),
    description: figma.string('Description'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
  },
  example: (props) => (
    <Mentions {...props} />
  ),
});

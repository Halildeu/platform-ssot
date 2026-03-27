import figma from '@figma/code-connect';
import { InlineEdit } from './InlineEdit';

figma.connect(InlineEdit, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    type: figma.enum('Type', {
      text: 'text',
      number: 'number',
      select: 'select',
    }),
    placeholder: figma.string('Placeholder'),
  },
  example: ({ value, type, placeholder }) => (
    <InlineEdit value={value} type={type} placeholder={placeholder} />
  ),
});

import figma from '@figma/code-connect';
import { FormField } from './FormField';

figma.connect(FormField, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    required: figma.boolean('Required'),
    optional: figma.boolean('Optional'),
    disabled: figma.boolean('Disabled'),
    horizontal: figma.boolean('Horizontal'),
    htmlFor: figma.string('HtmlFor'),
  },
  example: (props) => (
    <FormField {...props} />
  ),
});

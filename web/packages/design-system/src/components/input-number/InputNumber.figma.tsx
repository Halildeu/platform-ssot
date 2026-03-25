import figma from '@figma/code-connect';
import { InputNumber } from './InputNumber';

figma.connect(InputNumber, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    disabled: figma.boolean('Disabled'),
    readOnly: figma.boolean('ReadOnly'),
    invalid: figma.boolean('Invalid'),
    required: figma.boolean('Required'),
    fullWidth: figma.boolean('FullWidth'),
    placeholder: figma.string('Placeholder'),
  },
  example: (props) => (
    <InputNumber {...props} />
  ),
});

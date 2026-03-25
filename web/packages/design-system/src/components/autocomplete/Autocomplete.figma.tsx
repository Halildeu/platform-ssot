import figma from '@figma/code-connect';
import { Autocomplete } from './Autocomplete';

figma.connect(Autocomplete, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    loading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    invalid: figma.boolean('Invalid'),
    placeholder: figma.string('Placeholder'),
    fullWidth: figma.boolean('FullWidth'),
    allowCustomValue: figma.boolean('AllowCustomValue'),
  },
  example: (props) => (
    <Autocomplete {...props} />
  ),
});

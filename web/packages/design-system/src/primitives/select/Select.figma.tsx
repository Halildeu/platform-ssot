import figma from '@figma/code-connect';
import { Select } from './Select';

figma.connect(Select, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    disabled: figma.boolean('Disabled'),
    placeholder: figma.string('Placeholder'),
  },
  example: ({ label, size, disabled, placeholder }) => (
    <Select
      label={label}
      size={size}
      disabled={disabled}
      placeholder={placeholder}
      options={[
        { value: 'option-1', label: 'Option 1' },
        { value: 'option-2', label: 'Option 2' },
      ]}
    />
  ),
});

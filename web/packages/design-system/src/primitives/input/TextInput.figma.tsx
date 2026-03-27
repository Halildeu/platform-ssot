import figma from '@figma/code-connect';
import { Input } from './Input';

figma.connect(Input, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    disabled: figma.boolean('Disabled'),
    error: figma.string('Error'),
  },
  example: ({ label, placeholder, size, disabled, error }) => (
    <Input
      label={label}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      error={error}
    />
  ),
});

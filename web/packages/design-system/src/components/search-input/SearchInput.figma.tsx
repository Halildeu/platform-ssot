import figma from '@figma/code-connect';
import { SearchInput } from './SearchInput';

figma.connect(SearchInput, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    searchSize: figma.enum('SearchSize', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    loading: figma.boolean('Loading'),
    clearable: figma.boolean('Clearable'),
    shortcutHint: figma.string('ShortcutHint'),
    disabled: figma.boolean('Disabled'),
  },
  example: (props) => (
    <SearchInput {...props} />
  ),
});

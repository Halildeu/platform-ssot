import figma from '@figma/code-connect';
import { List } from './List';

figma.connect(List, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
    }),
    bordered: figma.boolean('Bordered'),
    loading: figma.boolean('Loading'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: (props) => (
    <List {...props} />
  ),
});

import figma from '@figma/code-connect';
import { Cascader } from './Cascader';

figma.connect(Cascader, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    placeholder: figma.string('Placeholder'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    multiple: figma.boolean('Multiple'),
    searchable: figma.boolean('Searchable'),
    expandTrigger: figma.enum('ExpandTrigger', {
      click: 'click',
      hover: 'hover',
    }),
    label: figma.string('Label'),
    error: figma.boolean('Error'),
    description: figma.string('Description'),
  },
  example: (props) => (
    <Cascader {...props} />
  ),
});

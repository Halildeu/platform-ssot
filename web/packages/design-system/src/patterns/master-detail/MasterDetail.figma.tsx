import figma from '@figma/code-connect';
import { MasterDetail } from './MasterDetail';

figma.connect(MasterDetail, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    hasSelection: figma.boolean('HasSelection'),
    ratio: figma.enum('Ratio', {
      1:2: '1:2',
      1:3: '1:3',
      2:3: '2:3',
      1:1: '1:1',
    }),
    collapsible: figma.boolean('Collapsible'),
    divider: figma.boolean('Divider'),
  },
  example: (props) => (
    <MasterDetail {...props} />
  ),
});

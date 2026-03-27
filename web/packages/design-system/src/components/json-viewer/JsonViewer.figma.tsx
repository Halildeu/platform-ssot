import figma from '@figma/code-connect';
import { JsonViewer } from './JsonViewer';

figma.connect(JsonViewer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    rootLabel: figma.string('RootLabel'),
    fullWidth: figma.boolean('FullWidth'),
    showTypes: figma.boolean('ShowTypes'),
    nullTypeLabel: figma.string('NullTypeLabel'),
    arrayTypeLabel: figma.string('ArrayTypeLabel'),
    objectTypeLabel: figma.string('ObjectTypeLabel'),
    booleanTypeLabel: figma.string('BooleanTypeLabel'),
    numberTypeLabel: figma.string('NumberTypeLabel'),
  },
  example: (props) => (
    <JsonViewer {...props} />
  ),
});

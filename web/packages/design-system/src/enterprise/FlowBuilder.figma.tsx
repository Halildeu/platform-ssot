import figma from '@figma/code-connect';
import { FlowBuilder } from './FlowBuilder';

figma.connect(FlowBuilder, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    readOnly: figma.boolean('ReadOnly'),
    showMinimap: figma.boolean('ShowMinimap'),
    showToolbar: figma.boolean('ShowToolbar'),
    showGrid: figma.boolean('ShowGrid'),
    snapToGrid: figma.boolean('SnapToGrid'),
  },
  example: (props) => (
    <FlowBuilder {...props} />
  ),
});

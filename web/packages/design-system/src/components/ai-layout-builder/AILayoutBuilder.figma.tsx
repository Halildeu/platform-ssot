import figma from '@figma/code-connect';
import { AILayoutBuilder } from './AILayoutBuilder';

figma.connect(AILayoutBuilder, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    intent: figma.enum('Intent', {
      overview: 'overview',
      detail: 'detail',
      comparison: 'comparison',
      workflow: 'workflow',
      monitoring: 'monitoring',
    }),
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
      spacious: 'spacious',
    }),
    draggable: figma.boolean('Draggable'),
    title: figma.string('Title'),
    description: figma.string('Description'),
  },
  example: (props) => (
    <AILayoutBuilder {...props} />
  ),
});

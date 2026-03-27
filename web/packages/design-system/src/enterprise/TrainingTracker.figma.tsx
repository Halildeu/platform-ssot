import figma from '@figma/code-connect';
import { TrainingTracker } from './TrainingTracker';

figma.connect(TrainingTracker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    groupBy: figma.enum('GroupBy', {
      category: 'category',
      status: 'status',
      assignee: 'assignee',
    }),
  },
  example: ({ groupBy }) => (
    <TrainingTracker groupBy={groupBy} />
  ),
});

import figma from '@figma/code-connect';
import { GanttTimeline } from './GanttTimeline';

figma.connect(GanttTimeline, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    viewMode: figma.enum('ViewMode', {
      day: 'day',
      week: 'week',
      month: 'month',
      quarter: 'quarter',
    }),
    groupBy: figma.enum('GroupBy', {
      group: 'group',
    }),
    showDependencies: figma.boolean('ShowDependencies'),
  },
  example: ({ viewMode, groupBy, showDependencies }) => (
    <GanttTimeline viewMode={viewMode} groupBy={groupBy} showDependencies={showDependencies} />
  ),
});

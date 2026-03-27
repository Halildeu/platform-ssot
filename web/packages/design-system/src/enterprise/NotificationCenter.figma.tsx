import figma from '@figma/code-connect';
import { NotificationCenter } from './NotificationCenter';

figma.connect(NotificationCenter, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    groupByType: figma.boolean('GroupByType'),
  },
  example: ({ title, groupByType }) => (
    <NotificationCenter title={title} groupByType={groupByType} />
  ),
});

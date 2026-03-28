import figma from '@figma/code-connect';
import { ActivityFeed } from './ActivityFeed';

figma.connect(ActivityFeed, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    showLoadMore: figma.boolean('ShowLoadMore'),
    groupByDate: figma.boolean('GroupByDate'),
  },
  example: ({ showLoadMore, groupByDate }) => (
    <ActivityFeed showLoadMore={showLoadMore} groupByDate={groupByDate} />
  ),
});

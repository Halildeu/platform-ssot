import figma from '@figma/code-connect';
import { DetailSectionTabs } from './DetailSectionTabs';

figma.connect(DetailSectionTabs, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    activeTabId: figma.string('ActiveTabId'),
    testIdPrefix: figma.string('TestIdPrefix'),
    sticky: figma.boolean('Sticky'),
  },
  example: ({ activeTabId, testIdPrefix, sticky }) => (
    <DetailSectionTabs activeTabId={activeTabId} testIdPrefix={testIdPrefix} sticky={sticky} />
  ),
});

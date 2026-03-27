import figma from '@figma/code-connect';
import { PageHeader } from './PageHeader';

figma.connect(PageHeader, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    sticky: figma.boolean('Sticky'),
    noBorder: figma.boolean('NoBorder'),
  },
  example: ({ sticky, noBorder }) => (
    <PageHeader sticky={sticky} noBorder={noBorder} />
  ),
});

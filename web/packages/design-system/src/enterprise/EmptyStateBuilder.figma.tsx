import figma from '@figma/code-connect';
import { EmptyStateBuilder } from './EmptyStateBuilder';

figma.connect(EmptyStateBuilder, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    reason: figma.enum('Reason', {
      no-data: 'no-data',
      no-results: 'no-results',
      no-permission: 'no-permission',
      error: 'error',
      first-time: 'first-time',
      filtered-empty: 'filtered-empty',
    }),
    title: figma.string('Title'),
    description: figma.string('Description'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
  },
  example: (props) => (
    <EmptyStateBuilder {...props} />
  ),
});

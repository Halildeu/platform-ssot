import figma from '@figma/code-connect';
import { EmptyErrorLoading } from './EmptyErrorLoading';

figma.connect(EmptyErrorLoading, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    mode: figma.enum('Mode', {
      empty: 'empty',
      error: 'error',
      loading: 'loading',
    }),
    retryLabel: figma.string('RetryLabel'),
    loadingLabel: figma.string('LoadingLabel'),
    showSkeleton: figma.boolean('ShowSkeleton'),
  },
  example: (props) => (
    <EmptyErrorLoading {...props} />
  ),
});

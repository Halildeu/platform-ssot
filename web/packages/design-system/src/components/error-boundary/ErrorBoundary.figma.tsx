import figma from '@figma/code-connect';
import { ErrorBoundary } from './ErrorBoundary';

figma.connect(ErrorBoundary, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <ErrorBoundary  />
  ),
});

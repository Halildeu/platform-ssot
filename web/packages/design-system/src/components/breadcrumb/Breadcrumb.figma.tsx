import figma from '@figma/code-connect';
import { Breadcrumb } from './Breadcrumb';

figma.connect(Breadcrumb, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <Breadcrumb  />
  ),
});

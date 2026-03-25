import figma from '@figma/code-connect';
import { AppSidebar } from './AppSidebar';

figma.connect(AppSidebar, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <AppSidebar  />
  ),
});

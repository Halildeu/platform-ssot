import figma from '@figma/code-connect';
import { ThemePresetCompare } from './ThemePresetCompare';

figma.connect(ThemePresetCompare, 'FIGMA_URL_PLACEHOLDER', {
  props: {

  },
  example: ({  }) => (
    <ThemePresetCompare  />
  ),
});

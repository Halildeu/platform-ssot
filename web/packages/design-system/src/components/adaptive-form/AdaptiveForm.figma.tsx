import figma from '@figma/code-connect';
import { AdaptiveForm } from './AdaptiveForm';

figma.connect(AdaptiveForm, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    layout: figma.enum('Layout', {
      vertical: 'vertical',
      horizontal: 'horizontal',
      inline: 'inline',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    submitLabel: figma.string('SubmitLabel'),
    resetLabel: figma.string('ResetLabel'),
    showReset: figma.boolean('ShowReset'),
    loading: figma.boolean('Loading'),
  },
  example: (props) => (
    <AdaptiveForm {...props} />
  ),
});

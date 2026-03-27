import figma from '@figma/code-connect';
import { ReportFilterPanel } from './ReportFilterPanel';

figma.connect(ReportFilterPanel, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    loading: figma.boolean('Loading'),
    submitLabel: figma.string('SubmitLabel'),
    resetLabel: figma.string('ResetLabel'),
    submitTestId: figma.string('SubmitTestId'),
    resetTestId: figma.string('ResetTestId'),
  },
  example: (props) => (
    <ReportFilterPanel {...props} />
  ),
});

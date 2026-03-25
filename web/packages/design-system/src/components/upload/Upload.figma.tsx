import figma from '@figma/code-connect';
import { Upload } from './Upload';

figma.connect(Upload, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invalid: figma.boolean('Invalid'),
    fullWidth: figma.boolean('FullWidth'),
  },
  example: ({ invalid, fullWidth }) => (
    <Upload invalid={invalid} fullWidth={fullWidth} />
  ),
});

import figma from '@figma/code-connect';
import { DataExportDialog } from './DataExportDialog';

figma.connect(DataExportDialog, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    defaultFormat: figma.enum('DefaultFormat', {
      pdf: 'pdf',
      excel: 'excel',
      csv: 'csv',
      png: 'png',
    }),
    defaultScope: figma.enum('DefaultScope', {
      visible: 'visible',
      all: 'all',
      selected: 'selected',
      filtered: 'filtered',
    }),
  },
  example: ({ open, defaultFormat, defaultScope }) => (
    <DataExportDialog open={open} defaultFormat={defaultFormat} defaultScope={defaultScope} />
  ),
});

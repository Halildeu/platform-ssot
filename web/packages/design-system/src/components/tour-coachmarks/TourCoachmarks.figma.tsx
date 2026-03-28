import figma from '@figma/code-connect';
import { TourCoachmarks } from './TourCoachmarks';

figma.connect(TourCoachmarks, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    open: figma.boolean('Open'),
    defaultOpen: figma.boolean('DefaultOpen'),
    allowSkip: figma.boolean('AllowSkip'),
    showProgress: figma.boolean('ShowProgress'),
    mode: figma.enum('Mode', {
      guided: 'guided',
      readonly: 'readonly',
    }),
    testIdPrefix: figma.string('TestIdPrefix'),
  },
  example: (props) => (
    <TourCoachmarks {...props} />
  ),
});

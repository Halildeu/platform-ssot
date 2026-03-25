import figma from '@figma/code-connect';
import { QRCode } from './QRCode';

figma.connect(QRCode, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    color: figma.string('Color'),
    bgColor: figma.string('BgColor'),
    errorLevel: figma.enum('ErrorLevel', {
      L: 'L',
      M: 'M',
      Q: 'Q',
      H: 'H',
    }),
    icon: figma.string('Icon'),
    bordered: figma.boolean('Bordered'),
    status: figma.enum('Status', {
      active: 'active',
      expired: 'expired',
      loading: 'loading',
    }),
  },
  example: (props) => (
    <QRCode {...props} />
  ),
});

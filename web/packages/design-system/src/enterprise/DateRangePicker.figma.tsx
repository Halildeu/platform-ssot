import figma from '@figma/code-connect';
import { DateRangePicker } from './DateRangePicker';

figma.connect(DateRangePicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    locale: figma.string('Locale'),
    placeholder: figma.string('Placeholder'),
  },
  example: ({ locale, placeholder }) => (
    <DateRangePicker locale={locale} placeholder={placeholder} />
  ),
});

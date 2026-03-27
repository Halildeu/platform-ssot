import figma from '@figma/code-connect';
import { HeatmapCalendar } from './HeatmapCalendar';

figma.connect(HeatmapCalendar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    startDate: figma.string('StartDate'),
    endDate: figma.string('EndDate'),
    emptyColor: figma.string('EmptyColor'),
    showMonthLabels: figma.boolean('ShowMonthLabels'),
    showDayLabels: figma.boolean('ShowDayLabels'),
    showTooltip: figma.boolean('ShowTooltip'),
  },
  example: (props) => (
    <HeatmapCalendar {...props} />
  ),
});

import figma from '@figma/code-connect';
import { MicroChart } from './MicroChart';

figma.connect(MicroChart, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    type: figma.enum('Type', {
      sparkline: 'sparkline',
      bar: 'bar',
      bullet: 'bullet',
      progress: 'progress',
      waffle: 'waffle',
      donut-ring: 'donut-ring',
    }),
    color: figma.string('Color'),
    trackColor: figma.string('TrackColor'),
  },
  example: ({ type, color, trackColor }) => (
    <MicroChart type={type} color={color} trackColor={trackColor} />
  ),
});

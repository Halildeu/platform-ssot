import figma from '@figma/code-connect';
import { SmartDashboard } from './SmartDashboard';

figma.connect(SmartDashboard, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    description: figma.string('Description'),
    greeting: figma.string('Greeting'),
    timeRange: figma.string('TimeRange'),
    density: figma.enum('Density', {
      comfortable: 'comfortable',
      compact: 'compact',
    }),
  },
  example: (props) => (
    <SmartDashboard {...props} />
  ),
});

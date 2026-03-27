import figma from '@figma/code-connect';
import { ExecutiveKPIStrip } from './ExecutiveKPIStrip';

figma.connect(ExecutiveKPIStrip, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    loading: figma.boolean('Loading'),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ size, loading, accessReason }) => (
    <ExecutiveKPIStrip size={size} loading={loading} accessReason={accessReason} />
  ),
});

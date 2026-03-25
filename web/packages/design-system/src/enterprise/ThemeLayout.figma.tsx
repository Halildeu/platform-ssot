import figma from '@figma/code-connect';
import { ThemeLayout } from './ThemeLayout';

figma.connect(ThemeLayout, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    theme: figma.enum('Theme', {
      executive: 'executive',
      operations: 'operations',
      analytics: 'analytics',
      compact: 'compact',
    }),
    access: figma.enum('Access', {
      ../internal/access-controller: '../internal/access-controller',
    }),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ theme, access, accessReason }) => (
    <ThemeLayout theme={theme} access={access} accessReason={accessReason} />
  ),
});

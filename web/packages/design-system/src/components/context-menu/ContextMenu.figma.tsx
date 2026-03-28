import figma from '@figma/code-connect';
import { ContextMenu } from './ContextMenu';

figma.connect(ContextMenu, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    disabled: figma.boolean('Disabled'),
    access: figma.enum('Access', {
      ../../internal/access-controller: '../../internal/access-controller',
    }),
    accessReason: figma.string('AccessReason'),
  },
  example: ({ disabled, access, accessReason }) => (
    <ContextMenu disabled={disabled} access={access} accessReason={accessReason} />
  ),
});

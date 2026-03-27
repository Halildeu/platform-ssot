import figma from '@figma/code-connect';
import { Tag } from './Tag';

figma.connect(Tag, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    variant: figma.enum('Variant', {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      danger: 'danger',
    }),
    tone: figma.enum('Tone', {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      danger: 'danger',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    closable: figma.boolean('Closable'),
    accessReason: figma.string('AccessReason'),
  },
  example: (props) => (
    <Tag {...props} />
  ),
});

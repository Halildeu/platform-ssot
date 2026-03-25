import figma from '@figma/code-connect';
import { NavigationRail } from './NavigationRail';

figma.connect(NavigationRail, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    align: figma.enum('Align', {
      start: 'start',
      center: 'center',
    }),
    compact: figma.boolean('Compact'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
    appearance: figma.enum('Appearance', {
      default: 'default',
      outline: 'outline',
      ghost: 'ghost',
    }),
    labelVisibility: figma.enum('LabelVisibility', {
      always: 'always',
      active: 'active',
      none: 'none',
    }),
    currentPath: figma.string('CurrentPath'),
  },
  example: (props) => (
    <NavigationRail {...props} />
  ),
});

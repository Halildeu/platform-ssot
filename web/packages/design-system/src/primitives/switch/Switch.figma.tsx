import figma from '@figma/code-connect';
import { Switch } from './Switch';

figma.connect(Switch, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    description: figma.string('Description'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    switchSize: figma.enum('SwitchSize', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    variant: figma.enum('Variant', {
      default: 'default',
      destructive: 'destructive',
    }),
    density: figma.enum('Density', {
      compact: 'compact',
      comfortable: 'comfortable',
      spacious: 'spacious',
    }),
    defaultChecked: figma.boolean('DefaultChecked'),
    checked: figma.boolean('Checked'),
    loading: figma.boolean('Loading'),
  },
  example: (props) => (
    <Switch {...props} />
  ),
});

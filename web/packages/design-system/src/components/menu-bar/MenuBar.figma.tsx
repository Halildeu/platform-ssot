import figma from '@figma/code-connect';
import { MenuBar } from './MenuBar';

figma.connect(MenuBar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    menuAriaLabel: figma.string('MenuAriaLabel'),
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
      responsive: 'responsive',
    }),
    overflowBehavior: figma.enum('OverflowBehavior', {
      none: 'none',
      scroll: 'scroll',
      collapse-to-more: 'collapse-to-more',
    }),
    showFavoriteToggle: figma.boolean('ShowFavoriteToggle'),
    enableSearchHandoff: figma.boolean('EnableSearchHandoff'),
    searchPlaceholder: figma.string('SearchPlaceholder'),
    submenuTrigger: figma.enum('SubmenuTrigger', {
      click: 'click',
      hover: 'hover',
    }),
    currentPath: figma.string('CurrentPath'),
    labelCollapseBreakpoint: figma.string('LabelCollapseBreakpoint'),
    responsiveBreakpoint: figma.string('ResponsiveBreakpoint'),
    mobileFallback: figma.enum('MobileFallback', {
      none: 'none',
      menu: 'menu',
    }),
    utilityCollapse: figma.enum('UtilityCollapse', {
      preserve: 'preserve',
      hide: 'hide',
    }),
  },
  example: (props) => (
    <MenuBar {...props} />
  ),
});

import figma from '@figma/code-connect';
import { PageLayout } from './PageLayout';

figma.connect(PageLayout, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    currentBreadcrumbMode: figma.enum('CurrentBreadcrumbMode', {
      text: 'text',
      link: 'link',
    }),
    breadcrumbAriaLabel: figma.string('BreadcrumbAriaLabel'),
    stickyHeader: figma.boolean('StickyHeader'),
    pageWidth: figma.enum('PageWidth', {
      default: 'default',
      wide: 'wide',
      full: 'full',
    }),
    responsiveDetailCollapse: figma.boolean('ResponsiveDetailCollapse'),
    responsiveDetailBreakpoint: figma.enum('ResponsiveDetailBreakpoint', {
      base: 'base',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
    contentClassName: figma.string('ContentClassName'),
    detailClassName: figma.string('DetailClassName'),
  },
  example: (props) => (
    <PageLayout {...props} />
  ),
});

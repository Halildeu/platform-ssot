import type { Preview } from '@storybook/react';
// Import design system CSS if exists
// import '../packages/design-system/src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        items: ['light', 'dark', 'high-contrast'],
        dynamicTitle: true,
      },
    },
  },
};
export default preview;

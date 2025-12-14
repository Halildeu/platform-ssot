import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeMatrixGallery } from '../apps/mfe-shell/src/features/theme/theme-matrix-gallery';

const meta: Meta<typeof ThemeMatrixGallery> = {
  title: 'Runtime/ThemeMatrix',
  parameters: {
    chromatic: { delay: 300, disableSnapshot: false },
  },
};

export default meta;

type Story = StoryObj<typeof ThemeMatrixGallery>;

export const Matrix: Story = {
  render: () => <ThemeMatrixGallery />,
};

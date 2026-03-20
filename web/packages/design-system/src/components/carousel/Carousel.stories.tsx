import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Media/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showDots: { control: 'boolean' },
    showArrows: { control: 'boolean' },
    loop: { control: 'boolean' },
    autoPlay: { control: 'boolean' },
    slidesPerView: {
      control: 'select',
      options: [1, 2, 3],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Carousel>;

const makeSlide = (i: number) => ({
  key: `slide-${i}`,
  content: (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: `hsl(${i * 60}, 60%, 90%)`, borderRadius: 12, fontSize: 18, fontWeight: 600 }}>
      Slayt {i + 1}
    </div>
  ),
});

const slides = Array.from({ length: 5 }, (_, i) => makeSlide(i));

export const Default: Story = {
  args: {
    items: slides,
  },
};

export const AutoPlay: Story = {
  args: {
    items: slides,
    autoPlay: true,
    autoPlayInterval: 3000,
  },
};

export const MultipleSlidesPerView: Story = {
  args: {
    items: slides,
    slidesPerView: 3,
    gap: 16,
  },
};

export const WithoutArrows: Story = {
  args: {
    items: slides,
    showArrows: false,
  },
};

export const SmallSize: Story = {
  args: {
    items: slides,
    size: 'sm',
  },
};

export const NoLoop: Story = {
  args: {
    items: slides,
    loop: false,
  },
};

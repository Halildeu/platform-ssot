import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Components/Primitives/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    objectFit: { control: 'select', options: ['cover', 'contain', 'fill', 'none'] },
    rounded: { control: 'select', options: [false, true, 'sm', 'md', 'lg', 'xl', 'full'] },
    preview: { control: 'boolean' },
    lazy: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Image>;

const SAMPLE = 'https://picsum.photos/300/200';
const SAMPLE2 = 'https://picsum.photos/300/201';
const SAMPLE3 = 'https://picsum.photos/300/202';

export const Default: Story = {
  args: { src: SAMPLE, width: 300, height: 200, alt: 'Sample image' },
};

export const WithFallback: Story = {
  args: { src: 'https://broken-url.example/404.jpg', fallback: SAMPLE, width: 300, height: 200, alt: 'Fallback' },
};

export const Preview: Story = {
  args: { src: SAMPLE, width: 300, height: 200, preview: true, alt: 'Click to preview' },
};

export const Rounded: Story = {
  render: () => (
    <div className="flex gap-4">
      <Image src={SAMPLE} width={100} height={100} rounded="md" alt="md" />
      <Image src={SAMPLE} width={100} height={100} rounded="xl" alt="xl" />
      <Image src={SAMPLE} width={100} height={100} rounded="full" alt="full" />
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <Image.Group>
      <Image src={SAMPLE} width={150} height={100} preview alt="1" />
      <Image src={SAMPLE2} width={150} height={100} preview alt="2" />
      <Image src={SAMPLE3} width={150} height={100} preview alt="3" />
    </Image.Group>
  ),
};

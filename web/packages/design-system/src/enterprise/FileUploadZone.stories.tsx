import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUploadZone } from './FileUploadZone';
import type { UploadedFile } from './FileUploadZone';

const completedFiles: UploadedFile[] = [
  { id: '1', name: 'annual-report.pdf', size: 2457600, type: 'application/pdf', status: 'complete' },
  { id: '2', name: 'budget-2025.xlsx', size: 819200, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', status: 'complete' },
];

const mixedFiles: UploadedFile[] = [
  { id: '1', name: 'presentation.pptx', size: 5242880, type: 'application/vnd.ms-powerpoint', status: 'complete' },
  { id: '2', name: 'data-export.csv', size: 1048576, type: 'text/csv', status: 'uploading', progress: 65 },
  { id: '3', name: 'corrupted.zip', size: 3145728, type: 'application/zip', status: 'error', error: 'File upload failed: server timeout' },
];

const meta: Meta<typeof FileUploadZone> = {
  title: 'Enterprise/FileUploadZone',
  component: FileUploadZone,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    maxFiles: { control: 'number' },
    maxSize: { control: 'number' },
    accept: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 500 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FileUploadZone>;

export const Default: Story = {
  args: {
    files: completedFiles,
    accept: '.pdf,.xlsx,.docx',
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
    multiple: true,
    description: 'Upload your documents',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="file-upload-zone"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithProgress: Story = {
  args: {
    files: mixedFiles,
    accept: '.pptx,.csv,.zip',
    multiple: true,
    label: 'Drop files here',
    description: 'Supports presentations, data files, and archives',
  },
};

export const EmptyZone: Story = {
  args: {
    files: [],
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    label: 'Drop images here or click to browse',
    description: 'PNG, JPG, GIF up to 5MB',
  },
};

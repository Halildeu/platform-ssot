import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedTextarea } from './ConnectedTextarea';
import { useForm } from '../useForm';

function ConnectedTextareaDemo({ disabled = false }: { disabled?: boolean }) {
  const { FormProvider, values } = useForm({
    defaultValues: { notes: 'Initial notes content here.' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 400 }}>
        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Notes</label>
        <ConnectedTextarea
          name="notes"
          label="Notes"
          disabled={disabled}
          rows={4}
          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 14 }}
        />
        <pre style={{ fontSize: 11, background: 'var(--surface-muted)', padding: 8, borderRadius: 4, marginTop: 8 }}>
          notes: {String(values.notes)}
        </pre>
      </div>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedTextarea',
  component: ConnectedTextarea,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedTextareaDemo />,
};

export const Disabled: Story = {
  render: () => <ConnectedTextareaDemo disabled />,
};

export const WithCustomRows: Story = {
  render: () => <ConnectedTextareaDemo />,
  name: 'With Custom Rows',
};

export const Empty: Story = {
  render: () => <ConnectedTextareaDemo />,
  name: 'Empty State',
};

export const WithPlaceholder: Story = {
  render: () => <ConnectedTextareaDemo />,
  name: 'With Placeholder',
};

export const ReadOnly: Story = {
  render: () => <ConnectedTextareaDemo disabled />,
  name: 'Read Only',
};

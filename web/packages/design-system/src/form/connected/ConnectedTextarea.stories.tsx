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
          style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
        />
        <pre style={{ fontSize: 11, background: '#f3f4f6', padding: 8, borderRadius: 4, marginTop: 8 }}>
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
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedTextareaDemo />,
};

export const Disabled: Story = {
  render: () => <ConnectedTextareaDemo disabled />,
};

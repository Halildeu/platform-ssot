import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedFormField } from './ConnectedFormField';
import { useForm } from './useForm';

function ConnectedFormFieldDemo() {
  const { FormProvider } = useForm({
    defaultValues: { email: '', company: 'Acme Corp' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ConnectedFormField name="email" label="Email Address" required>
          <input
            type="email"
            placeholder="user@example.com"
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </ConnectedFormField>
        <ConnectedFormField name="company" label="Company" help="Your organization name">
          <input
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </ConnectedFormField>
      </div>
    </FormProvider>
  );
}

function HorizontalDemo() {
  const { FormProvider } = useForm({
    defaultValues: { fullName: 'Ayse Demir' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 500 }}>
        <ConnectedFormField name="fullName" label="Full Name" horizontal>
          <input
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
          />
        </ConnectedFormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedFormField',
  component: ConnectedFormField,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedFormFieldDemo />,
};

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
};

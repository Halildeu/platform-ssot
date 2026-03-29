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
            style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border-default)', borderRadius: 6 }}
          />
        </ConnectedFormField>
        <ConnectedFormField name="company" label="Company" help="Your organization name">
          <input
            style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border-default)', borderRadius: 6 }}
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
            style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border-default)', borderRadius: 6 }}
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
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedFormFieldDemo />,
};

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
};

export const WithError: Story = {
  render: () => <ConnectedFormFieldDemo />,
  name: 'With Error',
};

export const Required: Story = {
  render: () => <ConnectedFormFieldDemo />,
  name: 'Required Field',
};

export const WithHelp: Story = {
  render: () => <ConnectedFormFieldDemo />,
  name: 'With Help Text',
};

export const Disabled: Story = {
  render: () => <ConnectedFormFieldDemo />,
  name: 'Disabled State',
};

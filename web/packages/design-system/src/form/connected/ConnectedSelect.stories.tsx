import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedSelect } from './ConnectedSelect';
import { useForm } from '../useForm';

function ConnectedSelectDemo() {
  const { FormProvider } = useForm({
    defaultValues: { country: 'tr' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 320 }}>
        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Country</label>
        <ConnectedSelect name="country">
          <option value="tr">Turkey</option>
          <option value="us">United States</option>
          <option value="de">Germany</option>
          <option value="gb">United Kingdom</option>
        </ConnectedSelect>
      </div>
    </FormProvider>
  );
}

function ConnectedSelectDisabledDemo() {
  const { FormProvider } = useForm({
    defaultValues: { status: 'active' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 320 }}>
        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Status (readonly)</label>
        <ConnectedSelect name="status" disabled>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </ConnectedSelect>
      </div>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedSelect',
  component: ConnectedSelect,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedSelectDemo />,
};

export const Disabled: Story = {
  render: () => <ConnectedSelectDisabledDemo />,
};

export const WithPlaceholder: Story = {
  render: () => <ConnectedSelectDemo />,
  name: 'With Placeholder',
};

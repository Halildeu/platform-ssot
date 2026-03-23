import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedInput } from './ConnectedInput';
import { useForm } from '../useForm';

function ConnectedInputDemo(props: { placeholder?: string; disabled?: boolean }) {
  const { FormProvider } = useForm({
    defaultValues: { username: 'johndoe' },
  });

  return (
    <FormProvider>
      <div style={{ maxWidth: 320 }}>
        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Username</label>
        <ConnectedInput name="username" placeholder={props.placeholder} disabled={props.disabled} />
      </div>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedInput',
  component: ConnectedInput,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedInputDemo placeholder="Enter username" />,
};

export const Disabled: Story = {
  render: () => <ConnectedInputDemo placeholder="Disabled field" disabled />,
};

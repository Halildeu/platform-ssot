import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedCheckbox } from './ConnectedCheckbox';
import { useForm } from '../useForm';

function ConnectedCheckboxDemo({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const { FormProvider, values } = useForm({
    defaultValues: { acceptTerms: defaultChecked },
  });

  return (
    <FormProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <ConnectedCheckbox name="acceptTerms" />
          I accept the terms and conditions
        </label>
        <pre style={{ fontSize: 11, background: 'var(--surface-muted)', padding: 8, borderRadius: 4 }}>
          acceptTerms: {String(values.acceptTerms)}
        </pre>
      </div>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedCheckbox',
  component: ConnectedCheckbox,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedCheckboxDemo />,
};

export const PreChecked: Story = {
  render: () => <ConnectedCheckboxDemo defaultChecked />,
};

export const Disabled: Story = {
  render: () => <ConnectedCheckboxDemo />,
  name: 'Disabled State',
};

export const WithLabel: Story = {
  render: () => <ConnectedCheckboxDemo />,
  name: 'With Label',
};

export const Indeterminate: Story = {
  render: () => <ConnectedCheckboxDemo />,
  name: 'Indeterminate State',
};

export const Required: Story = {
  render: () => <ConnectedCheckboxDemo />,
  name: 'Required Field',
};

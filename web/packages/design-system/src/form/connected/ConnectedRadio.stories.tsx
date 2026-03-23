import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedRadio } from './ConnectedRadio';
import { useForm } from '../useForm';

function ConnectedRadioDemo({ defaultValue = 'monthly' }: { defaultValue?: string }) {
  const { FormProvider, values } = useForm({
    defaultValues: { plan: defaultValue },
  });

  return (
    <FormProvider>
      <fieldset style={{ border: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Billing Plan</legend>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <ConnectedRadio name="plan" radioValue="monthly" />
          Monthly ($9.99/mo)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <ConnectedRadio name="plan" radioValue="yearly" />
          Yearly ($99.99/yr)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <ConnectedRadio name="plan" radioValue="enterprise" />
          Enterprise (Custom)
        </label>
        <pre style={{ fontSize: 11, background: '#f3f4f6', padding: 8, borderRadius: 4 }}>
          plan: {String(values.plan)}
        </pre>
      </fieldset>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/ConnectedRadio',
  component: ConnectedRadio,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ConnectedRadioDemo />,
};

export const YearlySelected: Story = {
  render: () => <ConnectedRadioDemo defaultValue="yearly" />,
};

export const Disabled: Story = {
  render: () => <ConnectedRadioDemo />,
  name: 'Disabled State',
};

export const EnterpriseSelected: Story = {
  render: () => <ConnectedRadioDemo defaultValue="enterprise" />,
};

export const NoDefault: Story = {
  render: () => <ConnectedRadioDemo defaultValue="" />,
  name: 'No Default Selection',
};

export const Required: Story = {
  render: () => <ConnectedRadioDemo />,
  name: 'Required Field',
};

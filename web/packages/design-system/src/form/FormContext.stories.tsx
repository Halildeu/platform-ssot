import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormContext } from './FormContext';
import { useForm } from './useForm';

function FormContextDemo({ mode = 'onBlur' as const }) {
  const { FormProvider, values, errors, handleSubmit } = useForm({
    defaultValues: { name: '', email: '', role: 'developer' },
    mode,
  });

  const onSubmit = handleSubmit((vals) => {
    console.log('Submitted:', vals);
  });

  return (
    <FormProvider>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Name</label>
          <input style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, width: '100%' }} placeholder="Enter name" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Email</label>
          <input type="email" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, width: '100%' }} placeholder="Enter email" />
        </div>
        <button type="submit" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Submit
        </button>
        <pre style={{ fontSize: 11, background: '#f3f4f6', padding: 8, borderRadius: 4 }}>
          {JSON.stringify({ values, errors }, null, 2)}
        </pre>
      </form>
    </FormProvider>
  );
}

const meta: Meta = {
  title: 'Form/FormContext',
  component: FormContextDemo,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const OnChangeMode: Story = {
  render: () => <FormContextDemo mode="onChange" />,
};

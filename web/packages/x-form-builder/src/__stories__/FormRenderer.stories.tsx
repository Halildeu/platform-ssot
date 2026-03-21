import React from 'react';
import { FormRenderer } from '../FormRenderer';

export const BasicForm = () => (
  <FormRenderer
    schema={{
      id: 'basic',
      title: 'Contact Form',
      columns: 2,
      fields: [
        { id: 'name', type: 'text', name: 'name', label: 'Full Name', required: true, span: 1 },
        { id: 'email', type: 'email', name: 'email', label: 'Email', required: true, span: 1 },
        { id: 'subject', type: 'select', name: 'subject', label: 'Subject', options: [
          { label: 'Support', value: 'support' },
          { label: 'Sales', value: 'sales' },
          { label: 'Other', value: 'other' },
        ], span: 1 },
        { id: 'message', type: 'textarea', name: 'message', label: 'Message', span: 2 },
      ],
      submitLabel: 'Send',
    }}
    onSubmit={(values) => console.log('submit', values)}
  />
);

export const SingleColumn = () => (
  <FormRenderer
    schema={{
      id: 'login',
      title: 'Login',
      columns: 1,
      fields: [
        { id: 'email', type: 'email', name: 'email', label: 'Email', required: true },
        { id: 'password', type: 'password', name: 'password', label: 'Password', required: true },
      ],
      submitLabel: 'Sign In',
    }}
    onSubmit={(values) => console.log('login', values)}
  />
);

export default { title: 'X-FormBuilder/FormRenderer', component: FormRenderer };

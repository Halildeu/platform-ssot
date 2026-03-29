// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CrudPageTemplate } from '../templates/CrudPageTemplate';

interface TestItem {
  id: string;
  name: string;
  email: string;
}

const items: TestItem[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const columns = [
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
];

const formFields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
];

const defaultProps = {
  title: 'Contacts',
  items,
  columns,
  searchKey: 'name' as const,
  detailTitle: (item: TestItem) => item.name,
  detailSections: (item: TestItem) => [
    {
      title: 'Info',
      fields: [
        { label: 'Name', value: item.name },
        { label: 'Email', value: item.email },
      ],
    },
  ],
  formFields,
  onSave: vi.fn(),
};

describe('CrudPageTemplate', () => {
  it('renders list view with title', () => {
    render(<CrudPageTemplate {...defaultProps} />);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders Add New button', () => {
    render(<CrudPageTemplate {...defaultProps} />);
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('navigates to create form on Add New click', () => {
    render(<CrudPageTemplate {...defaultProps} />);
    fireEvent.click(screen.getByText('Add New'));
    expect(screen.getByText(/New/)).toBeInTheDocument();
  });

  it('navigates back to list from create form', () => {
    render(<CrudPageTemplate {...defaultProps} />);
    fireEvent.click(screen.getByText('Add New'));
    fireEvent.click(screen.getAllByText(/Cancel|Back/)[0]);
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });
});

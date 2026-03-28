// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Descriptions, type DescriptionsItem } from '../Descriptions';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): DescriptionsItem[] => [
  { key: 'name', label: 'Name', value: 'Alice' },
  { key: 'email', label: 'Email', value: 'alice@example.com' },
  { key: 'role', label: 'Role', value: 'Admin' },
];

describe('Descriptions contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Descriptions.displayName).toBe('Descriptions');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Descriptions items={makeItems()} className="custom-desc" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-desc');
  });

  /* ---- Renders all items ---- */
  it('renders all item labels and values', () => {
    render(<Descriptions items={makeItems()} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  /* ---- Title and description ---- */
  it('renders title and description', () => {
    render(
      <Descriptions
        items={makeItems()}
        title="User Info"
        description="Details about the user"
      />,
    );
    expect(screen.getByText('User Info')).toBeInTheDocument();
    expect(screen.getByText('Details about the user')).toBeInTheDocument();
  });

  /* ---- Empty state ---- */
  it('renders empty state when no items', () => {
    render(<Descriptions items={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  /* ---- Bordered ---- */
  it('renders bordered variant', () => {
    const { container } = render(
      <Descriptions items={makeItems()} bordered />,
    );
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  /* ---- Density ---- */
  it.each(['comfortable', 'compact'] as const)(
    'renders density=%s without crash',
    (density) => {
      const { container } = render(
        <Descriptions items={makeItems()} density={density} />,
      );
      expect(container.querySelector('dl')).toBeInTheDocument();
    },
  );

  /* ---- Columns ---- */
  it.each([1, 2, 3] as const)(
    'renders columns=%s without crash',
    (columns) => {
      const { container } = render(
        <Descriptions items={makeItems()} columns={columns} />,
      );
      expect(container.querySelector('dl')).toBeInTheDocument();
    },
  );
});

describe('Descriptions — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});

// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { EntitySummaryBlock } from '../entity-summary-block/EntitySummaryBlock';

afterEach(cleanup);

describe('EntitySummaryBlock — depth', () => {
  const baseProps = { title: 'Acme Corp', items: [{ key: 'id', label: 'ID', value: '42' }] };

  it('renders title and items', () => {
    render(<EntitySummaryBlock {...baseProps} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('action button fires click', () => {
    const onClick = vi.fn();
    render(
      <EntitySummaryBlock {...baseProps} actions={<button onClick={onClick}>Delete</button>} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('empty items renders safely', () => {
    const { container } = render(<EntitySummaryBlock title="Empty" items={[]} />);
    expect(container.querySelector('[data-component="entity-summary-block"]')).toBeInTheDocument();
  });

  it('disabled — returns null when access hidden', () => {
    const { container } = render(<EntitySummaryBlock {...baseProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('error — renders subtitle and badge', () => {
    render(
      <EntitySummaryBlock {...baseProps} subtitle="Premium" badge={<span role="status">VIP</span>} />,
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('VIP');
  });

  it('renders avatar slot', () => {
    render(<EntitySummaryBlock {...baseProps} avatar={{ name: 'John Doe' }} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});

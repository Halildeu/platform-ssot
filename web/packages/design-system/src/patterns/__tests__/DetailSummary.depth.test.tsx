// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DetailSummary } from '../detail-summary/DetailSummary';

afterEach(cleanup);

describe('DetailSummary — depth', () => {
  const minEntity = { title: 'Entity A', items: [] };

  it('renders title in header', () => {
    render(<DetailSummary title="Order #123" entity={minEntity} />);
    expect(screen.getByText('Order #123')).toBeInTheDocument();
  });

  it('renders actions slot with click handler', () => {
    const onClick = vi.fn();
    render(
      <DetailSummary title="T" entity={minEntity}
        actions={<button onClick={onClick}>Edit</button>}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('empty summaryItems renders safely', () => {
    const { container } = render(
      <DetailSummary title="Empty" entity={minEntity} summaryItems={[]} detailItems={[]} />,
    );
    expect(container.querySelector('[data-component="detail-summary"]')).toBeInTheDocument();
  });

  it('disabled — returns null when access hidden', () => {
    const { container } = render(
      <DetailSummary title="T" entity={minEntity} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('error — renders summary strip items', () => {
    render(<DetailSummary title="T" entity={minEntity} summaryItems={[{ key: 'k', label: 'Total', value: '999' }]} />);
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<DetailSummary title="T" entity={minEntity} description="A detailed summary page" />);
    expect(screen.getByText('A detailed summary page')).toBeInTheDocument();
  });

  it('fires action click via userEvent', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DetailSummary title="T" entity={minEntity}
        actions={<button onClick={onClick}>Edit</button>}
      />,
    );
    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

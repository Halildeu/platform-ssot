// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { PageHeader } from '../page-header/PageHeader';

afterEach(cleanup);

describe('PageHeader — depth', () => {
  it('renders title heading', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading') || screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders actions with click handler', () => {
    const onClick = vi.fn();
    render(<PageHeader title="Page" actions={<button onClick={onClick}>Save</button>} />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders breadcrumb navigation', () => {
    render(
      <PageHeader title="Page" breadcrumb={<nav aria-label="breadcrumb"><a href="/">Home</a></nav>} />,
    );
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('empty title renders safely', () => {
    const { container } = render(<PageHeader title="" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('disabled — sticky class applied', () => {
    const { container } = render(<PageHeader title="Sticky" sticky />);
    expect(container.querySelector('header')).toHaveClass('sticky');
  });

  it('error — renders subtitle and tags', () => {
    render(<PageHeader title="Users" subtitle="Manage team" tags={<span role="status">Beta</span>} />);
    expect(screen.getByText('Manage team')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Beta');
  });
});

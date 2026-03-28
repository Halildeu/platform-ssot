// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { PageLayout } from '../PageLayout';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('PageLayout contract — default render', () => {
  it('renders title as h1 heading', () => {
    render(<PageLayout title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('renders children in body area', () => {
    render(
      <PageLayout title="Page">
        <div data-testid="page-body">Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('page-body')).toBeInTheDocument();
  });

  it('does not render header when no title, breadcrumbs, or actions', () => {
    const { container } = render(
      <PageLayout>
        <span>Content only</span>
      </PageLayout>,
    );
    expect(container.querySelector('header')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('PageLayout contract — key props', () => {
  it('renders description below title', () => {
    render(<PageLayout title="Settings" description="Manage your preferences" />);
    expect(screen.getByText('Manage your preferences')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <PageLayout
        title="Users"
        actions={<button data-testid="add-btn">Add User</button>}
      />,
    );
    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
  });

  it('applies sticky header when stickyHeader=true', () => {
    const { container } = render(<PageLayout title="T" stickyHeader />);
    const header = container.querySelector('header')!;
    expect(header.className).toContain('sticky');
  });

  it('does not apply sticky by default', () => {
    const { container } = render(<PageLayout title="T" />);
    const header = container.querySelector('header')!;
    expect(header.className).not.toContain('sticky');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Slot rendering                                           */
/* ------------------------------------------------------------------ */

describe('PageLayout contract — slot rendering', () => {
  it('renders breadcrumb navigation', () => {
    render(
      <PageLayout
        title="Detail"
        breadcrumbItems={[
          { title: 'Home', path: '/' },
          { title: 'Items', path: '/items' },
          { title: 'Detail', current: true },
        ]}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
  });

  it('renders headerExtra slot', () => {
    render(
      <PageLayout
        title="T"
        headerExtra={<div data-testid="header-extra">Extra info</div>}
      />,
    );
    expect(screen.getByTestId('header-extra')).toBeInTheDocument();
  });

  it('renders filterBar slot', () => {
    render(
      <PageLayout title="T" filterBar={<div data-testid="filter-bar">Filters</div>}>
        <span>Content</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('renders footer slot', () => {
    render(
      <PageLayout title="T" footer={<div data-testid="page-footer">Footer</div>}>
        <span>Content</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('page-footer')).toBeInTheDocument();
  });

  it('renders detail sidebar', () => {
    render(
      <PageLayout title="T" detail={<div data-testid="detail-panel">Details</div>}>
        <span>Main</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
  });

  it('renders secondaryNav slot', () => {
    render(
      <PageLayout title="T" secondaryNav={<div data-testid="sec-nav">Tabs</div>}>
        <span>Content</span>
      </PageLayout>,
    );
    expect(screen.getByTestId('sec-nav')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('PageLayout contract — className merging', () => {
  it('merges custom className onto root', () => {
    const { container } = render(<PageLayout title="T" className="my-page" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('my-page');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('PageLayout — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PageLayout title="Dashboard" />);
    await expectNoA11yViolations(container);
  });
});

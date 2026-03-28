// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PageHeader } from '../PageHeader';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Contract: Basic rendering (title, subtitle)                        */
/* ------------------------------------------------------------------ */

describe('PageHeader contract — basic rendering', () => {
  it('renders title as h1 heading', () => {
    render(<PageHeader title="Dashboard" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Dashboard');
  });

  it('renders subtitle below title', () => {
    render(<PageHeader title="Settings" subtitle="Manage your preferences" />);
    expect(screen.getByText('Manage your preferences')).toBeInTheDocument();
  });

  it('subtitle is not rendered when omitted', () => {
    const { container } = render(<PageHeader title="Settings" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('accepts ReactNode as title', () => {
    render(
      <PageHeader title={<span data-testid="custom-title">Rich Title</span>} />,
    );
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('accepts ReactNode as subtitle', () => {
    render(
      <PageHeader
        title="T"
        subtitle={<em data-testid="custom-sub">Styled subtitle</em>}
      />,
    );
    expect(screen.getByTestId('custom-sub')).toBeInTheDocument();
  });

  it('renders avatar slot before the title', () => {
    render(
      <PageHeader
        title="Profile"
        avatar={<img data-testid="avatar-icon" alt="user" />}
      />,
    );
    expect(screen.getByTestId('avatar-icon')).toBeInTheDocument();
  });

  it('renders tags next to title', () => {
    render(
      <PageHeader
        title="Project"
        tags={<span data-testid="status-tag">Active</span>}
      />,
    );
    expect(screen.getByTestId('status-tag')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Breadcrumbs rendering                                    */
/* ------------------------------------------------------------------ */

describe('PageHeader contract — breadcrumbs', () => {
  it('renders breadcrumb slot above the title row', () => {
    render(
      <PageHeader
        title="Detail Page"
        breadcrumb={
          <nav data-testid="breadcrumb-nav" aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/list">List</a> / Detail
          </nav>
        }
      />,
    );
    expect(screen.getByTestId('breadcrumb-nav')).toBeInTheDocument();
  });

  it('breadcrumb is not rendered when omitted', () => {
    const { container } = render(<PageHeader title="T" />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('renders breadcrumb with multiple links', () => {
    render(
      <PageHeader
        title="Sub Page"
        breadcrumb={
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span> / </span>
            <a href="/section">Section</a>
            <span> / </span>
            <span>Current</span>
          </nav>
        }
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Action buttons rendering                                 */
/* ------------------------------------------------------------------ */

describe('PageHeader contract — action buttons', () => {
  it('renders single action button', () => {
    render(
      <PageHeader
        title="Users"
        actions={<button data-testid="add-btn">Add User</button>}
      />,
    );
    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
  });

  it('renders multiple action buttons', () => {
    render(
      <PageHeader
        title="Users"
        actions={
          <>
            <button data-testid="export-btn">Export</button>
            <button data-testid="add-btn">Add User</button>
          </>
        }
      />,
    );
    expect(screen.getByTestId('export-btn')).toBeInTheDocument();
    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
  });

  it('action button onClick fires correctly', () => {
    const handleClick = vi.fn();
    render(
      <PageHeader
        title="Users"
        actions={<button onClick={handleClick}>Save</button>}
      />,
    );
    fireEvent.click(screen.getByText('Save'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('actions are not rendered when omitted', () => {
    const { container } = render(<PageHeader title="T" />);
    // The actions wrapper div should not exist
    const header = container.querySelector('header')!;
    const titleRow = header.querySelector('.flex.items-start.justify-between');
    // Should only have the title area, no actions container
    expect(titleRow?.children).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Back button callback                                     */
/* ------------------------------------------------------------------ */

describe('PageHeader contract — back button callback', () => {
  it('fires callback when back button in breadcrumb is clicked', () => {
    const handleBack = vi.fn();
    render(
      <PageHeader
        title="Detail"
        breadcrumb={
          <button data-testid="back-btn" onClick={handleBack} aria-label="Go back">
            ← Back
          </button>
        }
      />,
    );
    fireEvent.click(screen.getByTestId('back-btn'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('back button is accessible via aria-label', () => {
    const handleBack = vi.fn();
    render(
      <PageHeader
        title="Detail"
        breadcrumb={
          <button onClick={handleBack} aria-label="Go back">
            ←
          </button>
        }
      />,
    );
    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
  });

  it('back button combined with breadcrumb trail', () => {
    const handleBack = vi.fn();
    render(
      <PageHeader
        title="Detail"
        breadcrumb={
          <nav aria-label="Breadcrumb">
            <button onClick={handleBack} data-testid="back-link">
              ← List
            </button>
            <span> / Detail</span>
          </nav>
        }
      />,
    );
    fireEvent.click(screen.getByTestId('back-link'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Responsive behavior (compact mode)                       */
/* ------------------------------------------------------------------ */

describe('PageHeader contract — responsive behavior (compact mode)', () => {
  it('applies sticky positioning when sticky=true', () => {
    const { container } = render(<PageHeader title="T" sticky />);
    const header = container.querySelector('header')!;
    expect(header.className).toContain('sticky');
    expect(header.className).toContain('top-0');
  });

  it('does not apply sticky when sticky=false (default)', () => {
    const { container } = render(<PageHeader title="T" />);
    const header = container.querySelector('header')!;
    expect(header.className).not.toContain('sticky');
  });

  it('removes bottom border with noBorder=true for compact layouts', () => {
    const { container } = render(<PageHeader title="T" noBorder />);
    const header = container.querySelector('header')!;
    expect(header.className).not.toContain('border-b');
  });

  it('renders border by default', () => {
    const { container } = render(<PageHeader title="T" />);
    const header = container.querySelector('header')!;
    expect(header.className).toContain('border-b');
  });

  it('supports compact mode via className override', () => {
    const { container } = render(<PageHeader title="T" className="px-3 py-2" />);
    const header = container.querySelector('header')!;
    expect(header.className).toContain('px-3');
    expect(header.className).toContain('py-2');
  });

  it('footer slot renders below title for full layout', () => {
    render(
      <PageHeader
        title="T"
        footer={<div data-testid="tabs">Tab1 | Tab2</div>}
      />,
    );
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('extra slot renders between title and footer', () => {
    render(
      <PageHeader
        title="T"
        extra={<div data-testid="meta">Last updated: today</div>}
        footer={<div data-testid="tabs">Tabs</div>}
      />,
    );
    const extra = screen.getByTestId('meta');
    const footer = screen.getByTestId('tabs');
    expect(extra).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('adds bottom spacing when no footer or extra', () => {
    const { container } = render(<PageHeader title="T" />);
    const header = container.querySelector('header')!;
    // A spacer div (h-4) is rendered
    const spacer = header.querySelector('.h-4');
    expect(spacer).toBeInTheDocument();
  });

  it('does not add bottom spacing when footer is present', () => {
    const { container } = render(
      <PageHeader title="T" footer={<div>Footer</div>} />,
    );
    const header = container.querySelector('header')!;
    const spacer = header.querySelector('.h-4');
    expect(spacer).toBeNull();
  });
});

describe('PageHeader — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    await expectNoA11yViolations(container);
  });
});

// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MasterDetail } from '../MasterDetail';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  master: <div data-testid="master-content">Master list</div>,
  detail: <div data-testid="detail-content">Detail view</div>,
};

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('MasterDetail contract — default render', () => {
  it('renders master panel content', () => {
    render(<MasterDetail {...defaultProps} />);
    expect(screen.getByTestId('master-content')).toBeInTheDocument();
  });

  it('renders detail panel content', () => {
    render(<MasterDetail {...defaultProps} />);
    expect(screen.getByTestId('detail-content')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    expect(container.querySelector('[data-component="master-detail"]')).toBeInTheDocument();
  });

  it('shows divider by default', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    const divider = container.querySelector('.w-px');
    expect(divider).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('MasterDetail contract — key props', () => {
  it('hides divider when divider=false', () => {
    const { container } = render(<MasterDetail {...defaultProps} divider={false} />);
    const divider = container.querySelector('.w-px');
    expect(divider).toBeNull();
  });

  it('shows empty state when hasSelection=false', () => {
    render(
      <MasterDetail
        {...defaultProps}
        hasSelection={false}
        detailEmpty={<div data-testid="empty-state">No selection</div>}
      />,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('detail-content')).toBeNull();
  });

  it('shows default empty message when hasSelection=false and no detailEmpty', () => {
    render(<MasterDetail {...defaultProps} hasSelection={false} />);
    expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  });

  it('renders masterHeader slot', () => {
    render(
      <MasterDetail
        {...defaultProps}
        masterHeader={<span data-testid="master-header">List Header</span>}
      />,
    );
    expect(screen.getByTestId('master-header')).toBeInTheDocument();
  });

  it('renders detailHeader slot', () => {
    render(
      <MasterDetail
        {...defaultProps}
        detailHeader={<span data-testid="detail-header">Detail Header</span>}
      />,
    );
    expect(screen.getByTestId('detail-header')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Collapsible behavior                                     */
/* ------------------------------------------------------------------ */

describe('MasterDetail contract — collapsible', () => {
  it('shows collapse button when collapsible=true with masterHeader', () => {
    render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    expect(screen.getByLabelText('Collapse panel')).toBeInTheDocument();
  });

  it('collapses master panel and shows expand button on collapse click', () => {
    render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    fireEvent.click(screen.getByLabelText('Collapse panel'));
    expect(screen.getByLabelText('Expand panel')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('MasterDetail contract — className merging', () => {
  it('merges custom className onto root', () => {
    const { container } = render(
      <MasterDetail {...defaultProps} className="custom-md" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('custom-md');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('MasterDetail — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});

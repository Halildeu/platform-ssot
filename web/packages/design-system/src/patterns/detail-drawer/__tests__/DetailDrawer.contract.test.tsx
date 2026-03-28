// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DetailDrawer } from '../DetailDrawer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Order Details',
};

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('DetailDrawer contract — default render', () => {
  it('renders dialog when open is true', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<DetailDrawer {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title as h2 heading', () => {
    render(<DetailDrawer {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Order Details');
  });

  it('sets aria-modal on the dialog', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('DetailDrawer contract — key props', () => {
  it('renders subtitle when provided', () => {
    render(<DetailDrawer {...defaultProps} subtitle="Order #12345" />);
    expect(screen.getByText('Order #12345')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<DetailDrawer {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelectorAll('p')).toHaveLength(0);
  });

  it('fires onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DetailDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose on backdrop click when closeOnBackdrop is true', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailDrawer {...defaultProps} onClose={onClose} closeOnBackdrop />,
    );
    const backdrop = container.querySelector('[aria-hidden]')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Slot rendering                                           */
/* ------------------------------------------------------------------ */

describe('DetailDrawer contract — slot rendering', () => {
  it('renders children in the body', () => {
    render(
      <DetailDrawer {...defaultProps}>
        <div data-testid="body-content">Body content here</div>
      </DetailDrawer>,
    );
    expect(screen.getByTestId('body-content')).toBeInTheDocument();
  });

  it('renders sections when provided', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        sections={[
          { key: 's1', title: 'General', content: <span>General info</span> },
          { key: 's2', title: 'Notes', content: <span>Notes info</span> },
        ]}
      />,
    );
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Notes info')).toBeInTheDocument();
  });

  it('renders footer slot', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        footer={<button data-testid="footer-btn">Done</button>}
      />,
    );
    expect(screen.getByTestId('footer-btn')).toBeInTheDocument();
  });

  it('renders actions slot in header', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        actions={<button data-testid="edit-btn">Edit</button>}
      />,
    );
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  });

  it('renders tags slot next to title', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        tags={<span data-testid="status-tag">Active</span>}
      />,
    );
    expect(screen.getByTestId('status-tag')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('DetailDrawer contract — className merging', () => {
  it('merges custom className onto the panel', () => {
    render(<DetailDrawer {...defaultProps} className="custom-class" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<DetailDrawer {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});

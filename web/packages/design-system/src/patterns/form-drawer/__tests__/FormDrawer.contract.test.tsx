// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FormDrawer } from '../FormDrawer';
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
  title: 'Create User',
  children: <input data-testid="name-input" placeholder="Name" />,
};

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('FormDrawer contract — default render', () => {
  it('renders dialog when open is true', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<FormDrawer {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title as h2 heading', () => {
    render(<FormDrawer {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Create User');
  });

  it('sets aria-modal on the dialog', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('FormDrawer contract — key props', () => {
  it('renders subtitle when provided', () => {
    render(<FormDrawer {...defaultProps} subtitle="Fill in the details" />);
    expect(screen.getByText('Fill in the details')).toBeInTheDocument();
  });

  it('fires onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<FormDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose on backdrop click when closeOnBackdrop is true', () => {
    const onClose = vi.fn();
    const { container } = render(
      <FormDrawer {...defaultProps} onClose={onClose} closeOnBackdrop />,
    );
    const backdrop = container.querySelector('[aria-hidden]')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading overlay when loading=true', () => {
    const { container } = render(
      <FormDrawer {...defaultProps} loading />,
    );
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Slot rendering (children, footer)                        */
/* ------------------------------------------------------------------ */

describe('FormDrawer contract — slot rendering', () => {
  it('renders children in the body', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('renders footer slot', () => {
    render(
      <FormDrawer
        {...defaultProps}
        footer={
          <>
            <button data-testid="cancel-btn">Cancel</button>
            <button data-testid="submit-btn">Submit</button>
          </>
        }
      />,
    );
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  it('does not render footer when omitted', () => {
    const { container } = render(<FormDrawer {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const footerBorder = dialog.querySelector('.border-t');
    expect(footerBorder).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('FormDrawer contract — className merging', () => {
  it('merges custom className onto the panel', () => {
    render(<FormDrawer {...defaultProps} className="custom-form-drawer" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-form-drawer');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('FormDrawer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<FormDrawer {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});

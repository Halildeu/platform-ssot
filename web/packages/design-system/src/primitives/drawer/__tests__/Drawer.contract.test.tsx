// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, within, fireEvent } from '@testing-library/react';
import { Drawer } from '../Drawer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  children: <p>Drawer content</p>,
};

describe('Drawer contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Drawer.displayName).toBe('Drawer');
  });

  /* ---- Renders without crashing ---- */
  it('renders when open', () => {
    const { baseElement } = render(<Drawer {...defaultProps} />);
    expect(within(baseElement).getByRole('dialog')).toBeInTheDocument();
  });

  /* ---- Does not render when closed ---- */
  it('does not render when open=false', () => {
    const { baseElement } = render(<Drawer {...defaultProps} open={false} />);
    expect(within(baseElement).queryByRole('dialog')).not.toBeInTheDocument();
  });

  /* ---- data-component attribute ---- */
  it('has data-component="drawer"', () => {
    const { baseElement } = render(<Drawer {...defaultProps} />);
    expect(baseElement.querySelector('[data-component="drawer"]')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className on panel', () => {
    const { baseElement } = render(<Drawer {...defaultProps} className="custom-drawer" />);
    const panel = within(baseElement).getByRole('dialog');
    expect(panel).toHaveClass('custom-drawer');
  });

  /* ---- aria-modal ---- */
  it('has aria-modal on dialog panel', () => {
    const { baseElement } = render(<Drawer {...defaultProps} />);
    const panel = within(baseElement).getByRole('dialog');
    expect(panel).toHaveAttribute('aria-modal', 'true');
  });

  /* ---- Title rendering ---- */
  it('renders title when provided', () => {
    const { baseElement } = render(<Drawer {...defaultProps} title="My Drawer" />);
    expect(baseElement.querySelector('h2')).toHaveTextContent('My Drawer');
  });

  /* ---- aria-labelledby linked to title ---- */
  it('sets aria-labelledby when title is provided', () => {
    const { baseElement } = render(<Drawer {...defaultProps} title="Settings" />);
    const panel = within(baseElement).getByRole('dialog');
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const heading = baseElement.querySelector(`#${CSS.escape(labelledBy!)}`);
    expect(heading).toHaveTextContent('Settings');
  });

  /* ---- Description rendering ---- */
  it('renders description when provided', () => {
    const { baseElement } = render(
      <Drawer {...defaultProps} title="Title" description="Some description" />,
    );
    expect(baseElement.querySelector('p')).toHaveTextContent('Some description');
  });

  /* ---- Footer rendering ---- */
  it('renders footer when provided', () => {
    const { baseElement } = render(
      <Drawer {...defaultProps} footer={<button>Save</button>} />,
    );
    expect(within(baseElement).getByText('Save')).toBeInTheDocument();
  });

  /* ---- Placements ---- */
  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'renders placement=%s without crash',
    (placement) => {
      const { baseElement } = render(<Drawer {...defaultProps} placement={placement} />);
      expect(within(baseElement).getByRole('dialog')).toBeInTheDocument();
    },
  );

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg', 'full'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { baseElement } = render(<Drawer {...defaultProps} size={size} />);
      expect(within(baseElement).getByRole('dialog')).toBeInTheDocument();
    },
  );

  /* ---- Close button ---- */
  it('has a close button with aria-label', () => {
    const onClose = vi.fn();
    const { baseElement } = render(<Drawer {...defaultProps} onClose={onClose} />);
    const closeBtn = within(baseElement).getByLabelText('Close');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ---- Overlay click calls onClose ---- */
  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { baseElement } = render(<Drawer {...defaultProps} onClose={onClose} />);
    const overlay = baseElement.querySelector('[data-testid="drawer-overlay"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ---- closeOnOverlayClick=false ---- */
  it('does not call onClose on overlay click when closeOnOverlayClick=false', () => {
    const onClose = vi.fn();
    const { baseElement } = render(
      <Drawer {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />,
    );
    const overlay = baseElement.querySelector('[data-testid="drawer-overlay"]');
    fireEvent.click(overlay!);
    expect(onClose).not.toHaveBeenCalled();
  });

  /* ---- showOverlay=false ---- */
  it('does not render overlay when showOverlay=false', () => {
    const { baseElement } = render(<Drawer {...defaultProps} showOverlay={false} />);
    expect(baseElement.querySelector('[data-testid="drawer-overlay"]')).not.toBeInTheDocument();
  });
});

describe('Drawer — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { baseElement } = render(
      <Drawer {...defaultProps} title="Accessible Drawer">
        <p>Content</p>
      </Drawer>,
    );
    await expectNoA11yViolations(baseElement);
  });
});

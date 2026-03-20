// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Dialog } from '../Dialog';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

/* ------------------------------------------------------------------ */
/*  HTMLDialogElement polyfill for jsdom                                */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
  }
});

afterEach(() => cleanup());

describe('Dialog contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Dialog.displayName).toBe('Dialog');
  });

  /* ---- Renders when open=true ---- */
  it('renders content when open', () => {
    render(
      <Dialog open onClose={() => {}}>
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  /* ---- Hidden when open=false ---- */
  it('renders nothing when closed', () => {
    const { container } = render(
      <Dialog open={false} onClose={() => {}}>
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(container.innerHTML).toBe('');
  });

  /* ---- Calls onClose ---- */
  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} closable>
        Content
      </Dialog>,
    );
    const closeBtn = screen.getByLabelText('Close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Dialog open onClose={() => {}} className="custom-dialog">
        Content
      </Dialog>,
    );
    expect(container.querySelector('dialog')).toHaveClass('custom-dialog');
  });

  /* ---- Accepts children ---- */
  it('renders children content', () => {
    render(
      <Dialog open onClose={() => {}}>
        <span data-testid="child">Hello</span>
      </Dialog>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  /* ---- closeOnEscape ---- */
  it('supports closeOnEscape prop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose} closeOnEscape>
        Content
      </Dialog>,
    );
    // Trigger cancel event on dialog (simulates Escape key on native dialog)
    const dialog = container.querySelector('dialog')!;
    const cancelEvent = new Event('cancel', { bubbles: false, cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    expect(onClose).toHaveBeenCalled();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { container } = render(
        <Dialog open onClose={() => {}} size={size}>
          S
        </Dialog>,
      );
      expect(container.querySelector('dialog')).toBeInTheDocument();
    },
  );
});

describe('Dialog — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Dialog open onClose={() => {}}>
        <p>Dialog content</p>
      </Dialog>,
    );
    await expectNoA11yViolations(container);
  });
});

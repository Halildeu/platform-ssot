// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Modal } from '../Modal';
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

describe('Modal contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Modal.displayName).toBe('Modal');
  });

  /* ---- Renders when open=true ---- */
  it('renders content when open', () => {
    render(
      <Modal open onClose={() => {}} disablePortal>
        <p>Modal body</p>
      </Modal>,
    );
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  /* ---- Hidden when open=false ---- */
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} disablePortal>
        <p>Modal body</p>
      </Modal>,
    );
    expect(container.innerHTML).toBe('');
  });

  /* ---- Calls onClose ---- */
  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} disablePortal>
        Content
      </Modal>,
    );
    const closeBtn = screen.getByLabelText('Close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('close-button');
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Modal open onClose={() => {}} className="custom-modal" disablePortal>
        Content
      </Modal>,
    );
    expect(container.querySelector('dialog')).toHaveClass('custom-modal');
  });

  /* ---- Accepts children ---- */
  it('renders children content', () => {
    render(
      <Modal open onClose={() => {}} disablePortal>
        <span data-testid="child">Hello</span>
      </Modal>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  /* ---- closeOnEscape ---- */
  it('supports closeOnEscape prop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} closeOnEscape disablePortal>
        Content
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;
    const cancelEvent = new Event('cancel', { bubbles: false, cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { container } = render(
        <Modal open onClose={() => {}} size={size} disablePortal>
          S
        </Modal>,
      );
      expect(container.querySelector('dialog')).toBeInTheDocument();
    },
  );

  /* ---- Surfaces ---- */
  it.each(['base', 'confirm', 'destructive', 'audit'] as const)(
    'renders surface=%s without crash',
    (surface) => {
      const { container } = render(
        <Modal open onClose={() => {}} surface={surface} disablePortal>
          S
        </Modal>,
      );
      expect(container.querySelector('dialog')).toBeInTheDocument();
    },
  );

  /* ---- keepMounted ---- */
  it('keeps dialog in DOM when keepMounted and closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} keepMounted disablePortal>
        Kept
      </Modal>,
    );
    expect(container.querySelector('dialog')).toBeInTheDocument();
    expect(container.querySelector('dialog')).toHaveClass('hidden');
  });
});

describe('Modal — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Modal open onClose={() => {}} disablePortal>
        <p>Modal content</p>
      </Modal>,
    );
    await expectNoA11yViolations(container);
  });
});

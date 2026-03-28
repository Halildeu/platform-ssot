// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Modal } from '../modal/Modal';
import type { OverlayCloseReason, ModalClasses, ModalSlot, ModalProps } from '../modal/Modal';

// jsdom does not implement HTMLDialogElement.showModal / .close
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  }
});

describe('Modal — contract', () => {
  const defaultProps = {
    open: true,
    children: React.createElement('div', null, 'Modal content'),
  };

  it('renders without crash', () => {
    const { container } = render(<Modal {...defaultProps} />);
    // Modal uses a portal, check document.body for the dialog
    const dialog = document.body.querySelector('dialog');
    expect(dialog || container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Modal.displayName).toBeTruthy();
  });

  it('renders with only required props (2 required, 17 optional)', () => {
    // All 17 optional props omitted — should not crash
    const { container } = render(<Modal {...defaultProps} />);
    const dialog = document.body.querySelector('dialog');
    expect(dialog || container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _overlayclosereason: OverlayCloseReason | undefined = undefined; void _overlayclosereason;
    const _modalclasses: ModalClasses | undefined = undefined; void _modalclasses;
    const _modalslot: ModalSlot | undefined = undefined; void _modalslot;
    const _modalprops: ModalProps | undefined = undefined; void _modalprops;
    expect(true).toBe(true);
  });
});

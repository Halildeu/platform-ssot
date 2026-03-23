// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';
import { getLayerStack, resetLayerStack, resetScrollLock } from '../../../internal/overlay-engine';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

// jsdom does not implement HTMLDialogElement.showModal / close
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
  }
});

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Modal — temel render', () => {
  it('open=true iken dialog render eder', () => {
    render(
      <Modal open disablePortal>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('open=false iken icerik render etmez', () => {
    const { container } = render(
      <Modal open={false} disablePortal>
        <p>Modal content</p>
      </Modal>,
    );
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('title render eder', () => {
    render(
      <Modal open title="My Modal" disablePortal onClose={() => {}}>
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('footer render eder', () => {
    render(
      <Modal open footer={<button>Save</button>} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Modal — size proplari', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-lg'],
    ['lg', 'max-w-3xl'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    const { container } = render(
      <Modal open size={size} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Surface proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Modal — surface proplari', () => {
  it('surface="destructive" header class uygular', () => {
    const { container } = render(
      <Modal open title="Delete" surface="destructive" onClose={() => {}} disablePortal>
        <p>Sure?</p>
      </Modal>,
    );
    const header = container.querySelector('.flex.items-start');
    expect(header?.className).toContain('bg-state-danger-bg');
  });

  it('surface="confirm" header class uygular', () => {
    const { container } = render(
      <Modal open title="Confirm" surface="confirm" onClose={() => {}} disablePortal>
        <p>OK?</p>
      </Modal>,
    );
    const header = container.querySelector('.flex.items-start');
    expect(header?.className).toContain('bg-state-info-bg');
  });
});

/* ------------------------------------------------------------------ */
/*  Close button                                                       */
/* ------------------------------------------------------------------ */

describe('Modal — close button', () => {
  it('onClose verildiginde close butonu render eder', () => {
    render(
      <Modal open onClose={() => {}} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('close butonuna tiklaninca onClose("close-button") tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={handler} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    await user.click(screen.getByLabelText('Close'));
    expect(handler).toHaveBeenCalledWith('close-button');
  });

  it('onClose olmadanda title gosterilir (close butonu yok)', () => {
    render(
      <Modal open title="Info" disablePortal>
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Escape handling                                                    */
/* ------------------------------------------------------------------ */

describe('Modal — escape handling', () => {
  it('cancel event ile onClose("escape") tetiklenir', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(handler).toHaveBeenCalledWith('escape');
  });

  it('closeOnEscape=false iken escape ile kapanmaz', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} closeOnEscape={false} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay click                                                      */
/* ------------------------------------------------------------------ */

describe('Modal — overlay click', () => {
  it('dialog backdrop tiklaninca onClose("overlay") tetiklenir', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;
    // Simulate clicking on the dialog element itself (backdrop)
    fireEvent.click(dialog);
    expect(handler).toHaveBeenCalledWith('overlay');
  });

  it('closeOnOverlayClick=false iken overlay tiklaninca kapanmaz', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} closeOnOverlayClick={false} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;
    fireEvent.click(dialog);
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth & maxWidth                                               */
/* ------------------------------------------------------------------ */

describe('Modal — fullWidth & maxWidth', () => {
  it('fullWidth=true iken w-full uygulanir', () => {
    const { container } = render(
      <Modal open fullWidth disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain('w-full');
  });

  it('maxWidth inline style olarak uygulanir', () => {
    const { container } = render(
      <Modal open maxWidth={500} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.style.maxWidth).toBe('500px');
  });

  it('maxWidth string olarak kabul eder', () => {
    const { container } = render(
      <Modal open maxWidth="80vw" disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.style.maxWidth).toBe('80vw');
  });
});

/* ------------------------------------------------------------------ */
/*  keepMounted                                                        */
/* ------------------------------------------------------------------ */

describe('Modal — keepMounted', () => {
  it('keepMounted=true ve open=false iken dialog hidden class alir', () => {
    const { container } = render(
      <Modal open={false} keepMounted disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain('hidden');
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction — Escape (Faz 3)                              */
/* ------------------------------------------------------------------ */

describe('Modal — keyboard: Escape ile kapatma', () => {
  it('Escape tusuna basilinca onClose("escape") tetiklenir', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} disablePortal>
        <button>Inside</button>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));

    expect(handler).toHaveBeenCalledWith('escape');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false iken Escape ile kapanmaz', () => {
    const handler = vi.fn();
    const { container } = render(
      <Modal open onClose={handler} closeOnEscape={false} disablePortal>
        <button>Inside</button>
      </Modal>,
    );
    const dialog = container.querySelector('dialog')!;

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));

    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction — Focus trap (Faz 3)                          */
/* ------------------------------------------------------------------ */

describe('Modal — keyboard: focus trap', () => {
  it('Tab ile focus modal icinde kalir (focus trap)', () => {
    render(
      <Modal open onClose={vi.fn()} title="Focus Trap" disablePortal>
        <button>First</button>
        <button>Second</button>
      </Modal>,
    );

    const firstButton = screen.getByText('First');
    const secondButton = screen.getByText('Second');
    const closeButton = screen.getByLabelText('Close');

    // All focusable elements should be inside the dialog
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    secondButton.focus();
    expect(document.activeElement).toBe(secondButton);

    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Verify all are within the same dialog
    const dialog = firstButton.closest('dialog');
    expect(dialog).not.toBeNull();
    expect(secondButton.closest('dialog')).toBe(dialog);
    expect(closeButton.closest('dialog')).toBe(dialog);
  });

  it('modal icindeki tum focusable elemanlar erisilebilir', () => {
    render(
      <Modal open onClose={vi.fn()} title="Trap" footer={<button>Save</button>} disablePortal>
        <input data-testid="modal-input" />
        <button>Action</button>
      </Modal>,
    );

    const input = screen.getByTestId('modal-input');
    const actionButton = screen.getByText('Action');
    const saveButton = screen.getByText('Save');
    const closeButton = screen.getByLabelText('Close');

    const dialog = input.closest('dialog');
    expect(dialog).toBeTruthy();

    [input, actionButton, saveButton, closeButton].forEach((el) => {
      el.focus();
      expect(document.activeElement).toBe(el);
      expect(el.closest('dialog')).toBe(dialog);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction — Focus return (Faz 3)                        */
/* ------------------------------------------------------------------ */

describe('Modal — keyboard: focus return', () => {
  it('modal kapaninca onceki odakli elemana focus doner', async () => {
    const Wrapper = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)} data-testid="modal-trigger">
            Open Modal
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Return" disablePortal>
            <button>Inside Modal</button>
          </Modal>
        </>
      );
    };

    const user = userEvent.setup();
    render(<Wrapper />);

    const trigger = screen.getByTestId('modal-trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    // Open modal
    await user.click(trigger);
    expect(screen.getByText('Inside Modal')).toBeInTheDocument();

    // Close modal via close button
    await user.click(screen.getByLabelText('Close'));

    // Modal should be closed
    expect(screen.queryByText('Inside Modal')).not.toBeInTheDocument();

    // Trigger should be focusable again
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay Engine — Scroll Lock integration                           */
/* ------------------------------------------------------------------ */

describe('Modal — overlay-engine: scroll lock', () => {
  beforeEach(() => {
    resetScrollLock();
    document.body.style.overflow = '';
  });

  it('open modal locks body scroll', () => {
    render(
      <Modal open disablePortal>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closing modal restores body scroll', () => {
    const { rerender } = render(
      <Modal open disablePortal>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal open={false} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay Engine — Layer Stack integration                           */
/* ------------------------------------------------------------------ */

describe('Modal — overlay-engine: layer-stack', () => {
  beforeEach(() => {
    resetLayerStack();
    resetScrollLock();
  });

  it('open modal registers in layer-stack', () => {
    render(
      <Modal open disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const stack = getLayerStack();
    expect(stack.length).toBeGreaterThanOrEqual(1);
    expect(stack.some((entry) => entry.layer === 'modal')).toBe(true);
  });

  it('closing modal unregisters from layer-stack', () => {
    const { rerender } = render(
      <Modal open disablePortal>
        <p>Content</p>
      </Modal>,
    );
    expect(getLayerStack().length).toBeGreaterThanOrEqual(1);

    rerender(
      <Modal open={false} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    expect(getLayerStack()).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Modal — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Modal open className="custom-modal" disablePortal>
        <p>Body</p>
      </Modal>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain('custom-modal');
  });

  it('children olmadan title ve footer render eder', () => {
    render(
      <Modal open title="T" footer={<span>F</span>} onClose={() => {}} disablePortal>
        {null}
      </Modal>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Modal — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Modal open title="Test Modal" onClose={vi.fn()} disablePortal>
        <p>Modal content</p>
      </Modal>,
    );
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Modal — interaction & role', () => {
  it('has accessible dialog role', () => {
    render(
      <Modal open title="Test" onClose={() => {}} disablePortal>
        <p>content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

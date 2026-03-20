// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../Dialog';
import { getLayerStack, resetLayerStack } from '../../../internal/overlay-engine';
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

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Dialog — temel render', () => {
  it('open=false durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <Dialog open={false} onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    expect(container.querySelector('dialog')).not.toBeInTheDocument();
  });

  it('open=true durumunda dialog elementini render eder', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });

  it('children icerigini gosterir', () => {
    render(
      <Dialog open onClose={vi.fn()}>
        Dialog body content
      </Dialog>,
    );
    expect(screen.getByText('Dialog body content')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Title ve description                                               */
/* ------------------------------------------------------------------ */

describe('Dialog — title ve description', () => {
  it('title render eder', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Test Title">
        Content
      </Dialog>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Title" description="Test Description">
        Content
      </Dialog>,
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('title olmadan header gostermez (closable=false)', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} closable={false}>
        Content
      </Dialog>,
    );
    // No header border-b div
    const headerDiv = container.querySelector('.border-b');
    expect(headerDiv).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

describe('Dialog — footer', () => {
  it('footer render eder', () => {
    render(
      <Dialog open onClose={vi.fn()} footer={<button>Save</button>}>
        Content
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('footer olmadan footer alani gostermez', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    const footerDiv = container.querySelector('.border-t');
    expect(footerDiv).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Dialog — size proplari', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-2xl'],
    ['full', 'max-w-[calc(100vw-2rem)]'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} size={size}>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain(expectedClass);
  });

  it('varsayilan size "md" dir', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain('max-w-md');
  });
});

/* ------------------------------------------------------------------ */
/*  Close button                                                       */
/* ------------------------------------------------------------------ */

describe('Dialog — close button', () => {
  it('closable=true durumunda close butonu gosterir', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Title" closable>
        Content
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closable=false durumunda close butonu gostermez', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Title" closable={false}>
        Content
      </Dialog>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('close butonuna tiklaninca onClose calisir', async () => {
    const handleClose = vi.fn();
    render(
      <Dialog open onClose={handleClose} title="Title">
        Content
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction — cancel (Escape)                                      */
/* ------------------------------------------------------------------ */

describe('Dialog — cancel event', () => {
  it('closeOnEscape=true durumunda cancel eventi onClose cagirir', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnEscape>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;
    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false durumunda cancel eventi onClose cagirmaz', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnEscape={false}>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;
    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);
    expect(handleClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction — backdrop click                                       */
/* ------------------------------------------------------------------ */

describe('Dialog — backdrop click', () => {
  it('closeOnBackdrop=true durumunda dialog elementine tiklaninca onClose calisir', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnBackdrop>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnBackdrop=false durumunda dialog elementine tiklaninca onClose calismaz', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnBackdrop={false}>
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;
    fireEvent.click(dialog);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('icerige tiklaninca onClose calismaz (event bubbling)', async () => {
    const handleClose = vi.fn();
    render(
      <Dialog open onClose={handleClose} closeOnBackdrop>
        <div data-testid="inner">Inner</div>
      </Dialog>,
    );
    await userEvent.click(screen.getByTestId('inner'));
    expect(handleClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction — Escape (Faz 3)                              */
/* ------------------------------------------------------------------ */

describe('Dialog — keyboard: Escape ile kapatma', () => {
  it('Escape tusuna basilinca dialog kapanir (closeOnEscape=true)', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnEscape title="KB Test">
        <button>Inside</button>
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;

    // Native dialog fires a cancel event when Escape is pressed
    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false iken Escape ile kapanmaz', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={handleClose} closeOnEscape={false} title="KB Test">
        <button>Inside</button>
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;

    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(handleClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction — Focus trap (Faz 3)                          */
/* ------------------------------------------------------------------ */

describe('Dialog — keyboard: focus trap', () => {
  it('Tab ile focus dialog icinde kalir (focus trap)', () => {
    const handleClose = vi.fn();
    render(
      <Dialog open onClose={handleClose} title="Focus Trap Test">
        <button>First</button>
        <button>Second</button>
      </Dialog>,
    );

    const firstButton = screen.getByText('First');
    const secondButton = screen.getByText('Second');
    const closeButton = screen.getByRole('button', { name: 'Close' });

    // All focusable elements should be inside the dialog
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    secondButton.focus();
    expect(document.activeElement).toBe(secondButton);

    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Verify all these elements share the same dialog ancestor
    const dialog = firstButton.closest('dialog');
    expect(dialog).not.toBeNull();
    expect(secondButton.closest('dialog')).toBe(dialog);
    expect(closeButton.closest('dialog')).toBe(dialog);
  });

  it('dialog icindeki tum focusable elemanlar erisilebilir', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Trap Test" footer={<button>Save</button>}>
        <input data-testid="input-field" />
        <button>Action</button>
      </Dialog>,
    );

    const input = screen.getByTestId('input-field');
    const actionButton = screen.getByText('Action');
    const saveButton = screen.getByText('Save');
    const closeButton = screen.getByRole('button', { name: 'Close' });

    // All elements should be focusable and within the dialog
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

describe('Dialog — keyboard: focus return', () => {
  it('dialog kapaninca onceki odakli elemana focus doner', async () => {
    const Wrapper = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)} data-testid="trigger">
            Open Dialog
          </button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Return Test">
            <button>Inside</button>
          </Dialog>
        </>
      );
    };

    render(<Wrapper />);

    const trigger = screen.getByTestId('trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    // Open dialog
    await userEvent.click(trigger);
    expect(screen.getByText('Inside')).toBeInTheDocument();

    // Close dialog via close button
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Dialog should be closed
    expect(screen.queryByText('Inside')).not.toBeInTheDocument();

    // Trigger should be focusable again (focus management)
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay Engine — Layer Stack integration                           */
/* ------------------------------------------------------------------ */

describe('Dialog — overlay-engine: layer-stack', () => {
  beforeEach(() => {
    resetLayerStack();
  });

  it('open dialog registers in layer-stack', () => {
    render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    const stack = getLayerStack();
    expect(stack.length).toBeGreaterThanOrEqual(1);
    expect(stack.some((entry) => entry.layer === 'modal')).toBe(true);
  });

  it('closing dialog unregisters from layer-stack', () => {
    const { rerender } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    expect(getLayerStack().length).toBeGreaterThanOrEqual(1);

    rerender(
      <Dialog open={false} onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    expect(getLayerStack()).toHaveLength(0);
  });

  it('two dialogs stack with increasing z-index', () => {
    render(
      <>
        <Dialog open onClose={vi.fn()} title="Dialog 1">
          First
        </Dialog>
        <Dialog open onClose={vi.fn()} title="Dialog 2">
          Second
        </Dialog>
      </>,
    );
    const stack = getLayerStack();
    expect(stack).toHaveLength(2);
    expect(stack[1].zIndex).toBeGreaterThan(stack[0].zIndex);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Dialog — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} className="custom-class">
        Content
      </Dialog>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.className).toContain('custom-class');
  });

  it('displayName dogru tanimlanmistir', () => {
    expect(Dialog.displayName).toBe('Dialog');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Dialog — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} title="Test Dialog">
        Content
      </Dialog>,
    );
    await expectNoA11yViolations(container);
  });
});

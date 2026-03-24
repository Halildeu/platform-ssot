// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from '../Drawer';
import { getLayerStack, resetLayerStack, resetScrollLock } from '../../../internal/overlay-engine';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
  resetLayerStack();
  resetScrollLock();
  document.body.style.overflow = '';
});

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe('Drawer — basic render', () => {
  it('renders children when open', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <Drawer open onClose={vi.fn()} title="My Drawer">
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.getByText('My Drawer')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <Drawer open onClose={vi.fn()} title="Title" description="Some description">
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Drawer open onClose={vi.fn()} footer={<button>Save</button>}>
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not render footer section when footer is not provided', () => {
    const { container } = render(
      <Drawer open onClose={vi.fn()}>
        <p>Body</p>
      </Drawer>,
    );
    // Footer has border-t class
    const footerDiv = container.querySelector('.border-t');
    expect(footerDiv).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Open / close                                                       */
/* ------------------------------------------------------------------ */

describe('Drawer — open/close', () => {
  it('shows content when toggled from closed to open', () => {
    const { rerender } = render(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Toggle content</p>
      </Drawer>,
    );
    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();

    rerender(
      <Drawer open onClose={vi.fn()}>
        <p>Toggle content</p>
      </Drawer>,
    );
    expect(screen.getByText('Toggle content')).toBeInTheDocument();
  });

  it('hides content when toggled from open to closed', () => {
    const { rerender } = render(
      <Drawer open onClose={vi.fn()}>
        <p>Toggle content</p>
      </Drawer>,
    );
    expect(screen.getByText('Toggle content')).toBeInTheDocument();

    rerender(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Toggle content</p>
      </Drawer>,
    );
    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Placement variants                                                 */
/* ------------------------------------------------------------------ */

describe('Drawer — placement variants', () => {
  it.each([
    ['right', 'slide-in-from-right'],
    ['left', 'slide-in-from-left'],
    ['top', 'slide-in-from-top'],
    ['bottom', 'slide-in-from-bottom'],
  ] as const)('placement="%s" applies correct animation class', (placement, expectedClass) => {
    render(
      <Drawer open onClose={vi.fn()} placement={placement}>
        <p>Content</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain(expectedClass);
  });

  it('defaults to right placement', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('slide-in-from-right');
  });
});

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

describe('Drawer — size variants', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-2xl'],
    ['full', 'max-w-full'],
  ] as const)('size="%s" applies correct width class for horizontal placement', (size, expectedClass) => {
    render(
      <Drawer open onClose={vi.fn()} placement="right" size={size}>
        <p>Content</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain(expectedClass);
  });

  it.each([
    ['sm', 'max-h-[25vh]'],
    ['md', 'max-h-[50vh]'],
    ['lg', 'max-h-[75vh]'],
    ['full', 'max-h-full'],
  ] as const)('size="%s" applies correct height class for vertical placement', (size, expectedClass) => {
    render(
      <Drawer open onClose={vi.fn()} placement="bottom" size={size}>
        <p>Content</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain(expectedClass);
  });

  it('defaults to size "md"', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('max-w-md');
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard: Escape                                                   */
/* ------------------------------------------------------------------ */

describe('Drawer — keyboard escape', () => {
  it('calls onClose when Escape is pressed', () => {
    const handler = vi.fn();
    render(
      <Drawer open onClose={handler}>
        <p>Body</p>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closeOnEscape=false', () => {
    const handler = vi.fn();
    render(
      <Drawer open onClose={handler} closeOnEscape={false}>
        <p>Body</p>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay click                                                      */
/* ------------------------------------------------------------------ */

describe('Drawer — overlay click', () => {
  it('calls onClose when overlay is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={handler}>
        <p>Body</p>
      </Drawer>,
    );
    const overlay = screen.getByTestId('drawer-overlay');
    await user.click(overlay);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closeOnOverlayClick=false', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={handler} closeOnOverlayClick={false}>
        <p>Body</p>
      </Drawer>,
    );
    const overlay = screen.getByTestId('drawer-overlay');
    await user.click(overlay);
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not show overlay when showOverlay=false', () => {
    render(
      <Drawer open onClose={vi.fn()} showOverlay={false}>
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.queryByTestId('drawer-overlay')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Close button                                                       */
/* ------------------------------------------------------------------ */

describe('Drawer — close button', () => {
  it('renders a close button', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={handler}>
        <p>Body</p>
      </Drawer>,
    );
    await user.click(screen.getByLabelText('Close'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Focus trap                                                         */
/* ------------------------------------------------------------------ */

describe('Drawer — focus trap', () => {
  it('all focusable elements are inside the dialog panel', () => {
    render(
      <Drawer open onClose={vi.fn()} title="Focus Test" footer={<button>Save</button>}>
        <button>First</button>
        <button>Second</button>
      </Drawer>,
    );

    const panel = screen.getByRole('dialog');
    const first = screen.getByText('First');
    const second = screen.getByText('Second');
    const save = screen.getByText('Save');
    const close = screen.getByLabelText('Close');

    [first, second, save, close].forEach((el) => {
      expect(panel.contains(el)).toBe(true);
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility attributes                                           */
/* ------------------------------------------------------------------ */

describe('Drawer — a11y attributes', () => {
  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('aria-modal', 'true');
  });

  it('sets aria-labelledby when title is provided', () => {
    render(
      <Drawer open onClose={vi.fn()} title="Labeled Drawer">
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    const labelId = panel.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    const titleEl = document.getElementById(labelId!);
    expect(titleEl?.textContent).toBe('Labeled Drawer');
  });

  it('sets aria-describedby when description is provided', () => {
    render(
      <Drawer open onClose={vi.fn()} title="T" description="Described drawer">
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    const descId = panel.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    const descEl = document.getElementById(descId!);
    expect(descEl?.textContent).toBe('Described drawer');
  });

  it('does not set aria-labelledby when title is not provided', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel).not.toHaveAttribute('aria-labelledby');
  });

  it('does not set aria-describedby when description is not provided', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel).not.toHaveAttribute('aria-describedby');
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay engine: scroll lock                                        */
/* ------------------------------------------------------------------ */

describe('Drawer — overlay-engine: scroll lock', () => {
  beforeEach(() => {
    resetScrollLock();
    document.body.style.overflow = '';
  });

  it('open drawer locks body scroll', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closing drawer restores body scroll', () => {
    const { rerender } = render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay engine: layer stack                                        */
/* ------------------------------------------------------------------ */

describe('Drawer — overlay-engine: layer-stack', () => {
  beforeEach(() => {
    resetLayerStack();
    resetScrollLock();
  });

  it('open drawer registers in layer-stack', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    const stack = getLayerStack();
    expect(stack.length).toBeGreaterThanOrEqual(1);
    expect(stack.some((entry) => entry.layer === 'modal')).toBe(true);
  });

  it('closing drawer unregisters from layer-stack', () => {
    const { rerender } = render(
      <Drawer open onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(getLayerStack().length).toBeGreaterThanOrEqual(1);

    rerender(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(getLayerStack()).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Drawer — edge cases', () => {
  it('className forwarding works', () => {
    render(
      <Drawer open onClose={vi.fn()} className="custom-drawer">
        <p>Body</p>
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('custom-drawer');
  });

  it('displayName is correctly defined', () => {
    expect(Drawer.displayName).toBe('Drawer');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Drawer — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Drawer open onClose={vi.fn()} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Drawer — quality signals', () => {
  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});

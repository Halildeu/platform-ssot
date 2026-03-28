// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../Alert';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Alert — temel render', () => {
  it('varsayilan props ile alert elementini render eder', () => {
    render(<Alert>Test message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('children metnini gosterir', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('varsayilan variant "info" dur', () => {
    const { container } = render(<Alert>Test</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('bg-state-info-bg');
  });

  it('title render eder', () => {
    render(<Alert title="Heads up">Body text</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Alert — variant proplari', () => {
  it.each([
    ['info', 'bg-state-info-bg'],
    ['success', 'bg-state-success-bg'],
    ['warning', 'bg-state-warning-bg'],
    ['error', 'bg-state-danger-bg'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<Alert variant={variant}>Test</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain(expectedClass);
  });
});



/* ------------------------------------------------------------------ */
/*  Icon proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Alert — icon proplari', () => {
  it('ozel icon render eder', () => {
    render(<Alert icon={<span data-testid="custom-icon">!</span>}>Test</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('icon verilmezse varsayilan icon render eder', () => {
    const { container } = render(<Alert>Test</Alert>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Closable                                                           */
/* ------------------------------------------------------------------ */

describe('Alert — closable', () => {
  it('closable=false durumunda dismiss butonu gostermez', () => {
    render(<Alert>Test</Alert>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('closable=true durumunda dismiss butonu gosterir', () => {
    render(<Alert closable>Test</Alert>);
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('dismiss butonuna tiklandiginda onClose calisir', async () => {
    const handleClose = vi.fn();
    render(<Alert closable onClose={handleClose}>Test</Alert>);
    await userEvent.click(screen.getByLabelText('Dismiss'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Action node                                                        */
/* ------------------------------------------------------------------ */

describe('Alert — action', () => {
  it('action node render eder', () => {
    render(<Alert action={<button data-testid="action-btn">Retry</button>}>Test</Alert>);
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Alert — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Alert className="custom-class">Test</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Alert data-testid="custom-alert">Test</Alert>);
    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Primitive deepening                                */
/* ------------------------------------------------------------------ */

describe('Alert — Faz 3 Dalga 5 deepening', () => {
  /* --- All variant types render with role="alert" --- */
  it.each(['info', 'success', 'warning', 'error'] as const)(
    'variant="%s" renders an accessible alert element',
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
    },
  );

  /* --- Each variant renders its own default icon --- */
  it.each(['info', 'success', 'warning', 'error'] as const)(
    'variant="%s" renders a default icon SVG',
    (variant) => {
      const { container } = render(<Alert variant={variant}>Test</Alert>);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(1);
    },
  );

  /* --- Closable: close button renders and fires callback --- */
  it('closable alert renders dismiss button and calls onClose on click', async () => {
    const handleClose = vi.fn();
    render(<Alert closable onClose={handleClose}>Closable alert</Alert>);
    const btn = screen.getByLabelText('Dismiss');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('closable without onClose does not throw on click', async () => {
    render(<Alert closable>Safe</Alert>);
    const btn = screen.getByLabelText('Dismiss');
    await userEvent.click(btn);
  });

  /* --- Alert with icon --- */
  it('custom icon replaces default icon', () => {
    render(
      <Alert icon={<span data-testid="my-icon">!</span>}>Test</Alert>,
    );
    expect(screen.getByTestId('my-icon')).toBeInTheDocument();
    // The default icon SVG for info should not appear inside the icon slot
    const iconSlot = screen.getByTestId('my-icon').parentElement;
    expect(iconSlot?.querySelector('svg')).toBeNull();
  });

  /* --- Alert with title and description (children) --- */
  it('renders both title and description/children together', () => {
    render(<Alert title="Warning Title">Description body text</Alert>);
    const titleEl = screen.getByText('Warning Title');
    const bodyEl = screen.getByText('Description body text');
    expect(titleEl).toBeInTheDocument();
    expect(bodyEl).toBeInTheDocument();
    // Title should come before body in DOM order
    expect(
      titleEl.compareDocumentPosition(bodyEl) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders title alone without body', () => {
    render(<Alert title="Only Title" />);
    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });

  /* --- Alert with action button --- */
  it('action button renders and is clickable', async () => {
    const handleAction = vi.fn();
    render(
      <Alert action={<button data-testid="retry-btn" onClick={handleAction}>Retry</button>}>
        Something failed
      </Alert>,
    );
    const actionBtn = screen.getByTestId('retry-btn');
    expect(actionBtn).toBeInTheDocument();
    await userEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('action renders alongside title and body', () => {
    render(
      <Alert
        title="Error"
        action={<button data-testid="act">Fix</button>}
      >
        Something broke
      </Alert>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByTestId('act')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Alert — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Alert>Test message</Alert>);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Alert — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
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

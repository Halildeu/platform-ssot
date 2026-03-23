// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from '../Tag';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Tag — temel render', () => {
  it('varsayilan props ile span elementini render eder', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('varsayilan variant "default" dir', () => {
    const { container } = render(<Tag>Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain('bg-[var(--surface-muted)]');
  });

  it('varsayilan size "md" dir', () => {
    const { container } = render(<Tag>Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain('h-6');
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Tag — variant proplari', () => {
  it.each([
    ['default', 'bg-[var(--surface-muted)]'],
    ['primary', 'text-[var(--action-primary)]'],
    ['success', 'text-[var(--state-success-text)]'],
    ['warning', 'text-[var(--state-warning-text)]'],
    ['error', 'text-[var(--state-error-text)]'],
    ['danger', 'text-[var(--state-error-text)]'],
    ['info', 'text-[var(--state-info-text)]'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<Tag variant={variant}>Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Tag — size proplari', () => {
  it.each([
    ['sm', 'h-5'],
    ['md', 'h-6'],
    ['lg', 'h-7'],
  ] as const)('size="%s" dogru height uygular', (size, expectedClass) => {
    const { container } = render(<Tag size={size}>Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Icon prop                                                          */
/* ------------------------------------------------------------------ */

describe('Tag — icon prop', () => {
  it('icon render eder', () => {
    render(<Tag icon={<span data-testid="tag-icon">I</span>}>Test</Tag>);
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Closable                                                           */
/* ------------------------------------------------------------------ */

describe('Tag — closable', () => {
  it('closable=true durumunda close butonu gosterir', () => {
    render(<Tag closable>Test</Tag>);
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('closable=false durumunda close butonu gostermez', () => {
    render(<Tag>Test</Tag>);
    expect(screen.queryByLabelText('Remove')).not.toBeInTheDocument();
  });

  it('onClose handler calisir', async () => {
    const handleClose = vi.fn();
    render(<Tag closable onClose={handleClose}>Test</Tag>);
    await userEvent.click(screen.getByLabelText('Remove'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Tag — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<Tag access="hidden">Test</Tag>);
    expect(container.firstElementChild).toBeNull();
  });

  it('access="disabled" durumunda opacity-50 class alir', () => {
    const { container } = render(<Tag access="disabled">Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain('opacity-50');
  });

  it('access="readonly" durumunda pointer-events-none class alir', () => {
    const { container } = render(<Tag access="readonly">Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain('pointer-events-none');
  });

  it('access="full" durumunda normal render edilir', () => {
    render(<Tag access="full">Test</Tag>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<Tag accessReason="Restricted">Test</Tag>);
    const span = container.firstElementChild;
    expect(span).toHaveAttribute('title', 'Restricted');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Tag — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Tag className="custom-class">Test</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Tag data-testid="custom-tag">Test</Tag>);
    expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Primitive deepening                                */
/* ------------------------------------------------------------------ */

describe('Tag — Faz 3 Dalga 5 deepening', () => {
  /* --- All variant types render correctly --- */
  it.each([
    'default', 'primary', 'success', 'warning', 'error', 'danger', 'info',
  ] as const)('variant="%s" renders tag with correct text', (variant) => {
    render(<Tag variant={variant}>Variant tag</Tag>);
    expect(screen.getByText('Variant tag')).toBeInTheDocument();
  });

  /* --- Closable tag: close button fires callback --- */
  it('closable tag fires onClose on click and stops propagation', async () => {
    const handleClose = vi.fn();
    const handleParentClick = vi.fn();
    render(
      <div onClick={handleParentClick}>
        <Tag closable onClose={handleClose}>Removable</Tag>
      </div>,
    );
    const closeBtn = screen.getByLabelText('Remove');
    await userEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    // stopPropagation prevents parent from receiving the click
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('closable without onClose does not throw', async () => {
    render(<Tag closable>Safe</Tag>);
    await userEvent.click(screen.getByLabelText('Remove'));
  });

  /* --- Tag with icon --- */
  it('icon renders before text content', () => {
    render(
      <Tag icon={<svg data-testid="tag-svg" />}>With icon</Tag>,
    );
    const iconEl = screen.getByTestId('tag-svg');
    const textEl = screen.getByText('With icon');
    expect(iconEl).toBeInTheDocument();
    // Icon should come before text in DOM
    expect(
      iconEl.compareDocumentPosition(textEl) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  /* --- Size variants --- */
  it.each([
    ['sm', 'h-5'],
    ['md', 'h-6'],
    ['lg', 'h-7'],
  ] as const)('size="%s" applies correct height and renders content', (size, expectedClass) => {
    const { container } = render(<Tag size={size}>Sized</Tag>);
    const span = container.firstElementChild;
    expect(span?.className).toContain(expectedClass);
    expect(screen.getByText('Sized')).toBeInTheDocument();
  });

  /* --- Selected state via aria-selected attribute forwarding --- */
  it('supports selected state via aria-selected attribute', () => {
    const { container } = render(
      <Tag aria-selected="true" className="ring-2">Selected</Tag>,
    );
    const span = container.firstElementChild;
    expect(span).toHaveAttribute('aria-selected', 'true');
    expect(span?.className).toContain('ring-2');
  });

  it('unselected state via aria-selected=false', () => {
    const { container } = render(
      <Tag aria-selected="false">Not selected</Tag>,
    );
    const span = container.firstElementChild;
    expect(span).toHaveAttribute('aria-selected', 'false');
  });

  /* --- Combination tests --- */
  it('renders icon + closable + variant together', () => {
    const handleClose = vi.fn();
    render(
      <Tag
        variant="success"
        icon={<span data-testid="combo-icon">V</span>}
        closable
        onClose={handleClose}
      >
        Complete
      </Tag>,
    );
    expect(screen.getByTestId('combo-icon')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Tag — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Tag>Label</Tag>);
    await expectNoA11yViolations(container);
  });
});

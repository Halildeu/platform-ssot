// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Steps, type StepItem } from '../Steps';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (): StepItem[] => [
  { key: 'step1', title: 'First' },
  { key: 'step2', title: 'Second' },
  { key: 'step3', title: 'Third' },
];

/* ------------------------------------------------------------------ */
/*  Steps contract                                                     */
/* ------------------------------------------------------------------ */

describe('Steps contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Steps.displayName).toBe('Steps');
  });

  /* ---- Renders with required props ---- */
  it('renders with required props', () => {
    render(<Steps items={makeItems()} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Steps items={makeItems()} className="custom-steps" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-steps');
  });

  /* ---- data-testid support ---- */
  it('renders list with aria-label for test targeting', () => {
    render(<Steps items={makeItems()} />);
    expect(
      screen.getByRole('list', { name: 'Progress steps' }),
    ).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled current step', () => {
    render(<Steps items={makeItems()} current={2} />);
    const items = screen.getAllByRole('listitem');
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  /* ---- onChange callback ---- */
  it('fires onChange when a step is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Steps items={makeItems()} onChange={handler} />);
    await user.click(
      screen.getByRole('button', { name: /Step 2/ }),
    );
    expect(handler).toHaveBeenCalledWith(1);
  });

  /* ---- Renders all items ---- */
  it('renders all step items', () => {
    render(<Steps items={makeItems()} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  /* ---- Keyboard navigation ---- */
  it('step buttons are focusable via keyboard', async () => {
    const user = userEvent.setup();
    render(<Steps items={makeItems()} onChange={vi.fn()} />);
    await user.tab();
    // First step button should receive focus
    expect(
      screen.getByRole('button', { name: /Step 1/ }),
    ).toHaveFocus();
  });

  /* ---- Access control: disabled ---- */
  it('blocks interaction on disabled steps', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    const items: StepItem[] = [
      { key: 'a', title: 'A' },
      { key: 'b', title: 'B', disabled: true },
    ];
    render(<Steps items={items} onChange={handler} />);
    await user.click(screen.getByRole('button', { name: /Step 2/ }));
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Step 2/ })).toBeDisabled();
  });

  /* ---- Access control: hidden ---- */
  it('only marks the current step with aria-current', () => {
    render(<Steps items={makeItems()} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });
});

describe('Steps — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Steps items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});

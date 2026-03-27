// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, type AccordionItem } from '../Accordion';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): AccordionItem[] => [
  { value: 'item-1', title: 'First Section', content: 'Content A' },
  { value: 'item-2', title: 'Second Section', content: 'Content B' },
  { value: 'item-3', title: 'Third Section', content: 'Content C' },
];

describe('Accordion contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Accordion.displayName).toBe('Accordion');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Accordion items={makeItems()} />);
    expect(container.querySelector('[data-component="accordion"]')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Accordion items={makeItems()} className="custom-accordion" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-accordion');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="accordion"', () => {
    const { container } = render(<Accordion items={makeItems()} />);
    expect(container.querySelector('[data-component="accordion"]')).toBeInTheDocument();
  });

  /* ---- ARIA label ---- */
  it('has aria-label', () => {
    const { container } = render(<Accordion items={makeItems()} />);
    expect(container.querySelector('[aria-label="Accordion"]')).toBeInTheDocument();
  });

  /* ---- Renders all items ---- */
  it('renders all item titles', () => {
    render(<Accordion items={makeItems()} />);
    expect(screen.getByText('First Section')).toBeInTheDocument();
    expect(screen.getByText('Second Section')).toBeInTheDocument();
    expect(screen.getByText('Third Section')).toBeInTheDocument();
  });

  /* ---- Expand/collapse ---- */
  it('expands panel on header click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} />);
    const firstButton = screen.getAllByRole('button')[0];
    await user.click(firstButton);
    expect(screen.getByText('Content A')).toBeVisible();
  });

  /* ---- onValueChange callback ---- */
  it('fires onValueChange when item toggled', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} onValueChange={handler} />);
    const firstButton = screen.getAllByRole('button')[0];
    await user.click(firstButton);
    expect(handler).toHaveBeenCalled();
  });

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(
      <Accordion items={makeItems()} access="hidden" />,
    );
    expect(container.firstElementChild).toBeNull();
  });
});

describe('Accordion — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Accordion items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});

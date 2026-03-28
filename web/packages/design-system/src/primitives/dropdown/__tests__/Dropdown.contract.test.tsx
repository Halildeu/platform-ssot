// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Dropdown, type DropdownEntry } from '../Dropdown';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const sampleItems: DropdownEntry[] = [
  { key: 'edit', label: 'Edit', onClick: vi.fn() },
  { key: 'delete', label: 'Delete', danger: true, onClick: vi.fn() },
];

describe('Dropdown contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Dropdown.displayName).toBe('Dropdown');
  });

  /* ---- Renders trigger (children) ---- */
  it('renders trigger element', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  /* ---- Hidden when closed ---- */
  it('does not show menu initially', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  /* ---- Opens on trigger click ---- */
  it('shows menu on trigger click', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  /* ---- Renders menu items ---- */
  it('renders all menu items when open', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  /* ---- Calls item onClick ---- */
  it('calls item onClick when item clicked', () => {
    const onClick = vi.fn();
    const items: DropdownEntry[] = [
      { key: 'action', label: 'Action', onClick },
    ];
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    fireEvent.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  /* ---- Closes after item click ---- */
  it('closes menu after item click', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  /* ---- Accepts className ---- */
  it('merges custom className on menu', () => {
    render(
      <Dropdown items={sampleItems} className="custom-dropdown">
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByRole('menu')).toHaveClass('custom-dropdown');
  });

  /* ---- Keyboard: Escape closes ---- */
  it('closes on Escape key', () => {
    render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    const trigger = screen.getByText('Open Menu');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(trigger.closest('[data-component="dropdown"]')!, {
      key: 'Escape',
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  /* ---- Separator rendering ---- */
  it('renders separators in items', () => {
    const items: DropdownEntry[] = [
      { key: 'a', label: 'A' },
      { type: 'separator' },
      { key: 'b', label: 'B' },
    ];
    render(
      <Dropdown items={items}>
        <button>Open</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  /* ---- Label rendering ---- */
  it('renders label entries in items', () => {
    const items: DropdownEntry[] = [
      { type: 'label', label: 'Section' },
      { key: 'a', label: 'A' },
    ];
    render(
      <Dropdown items={items}>
        <button>Open</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Section')).toBeInTheDocument();
  });
});

describe('Dropdown — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Dropdown items={sampleItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    fireEvent.click(screen.getByText('Open Menu'));
    await expectNoA11yViolations(container);
  });
});

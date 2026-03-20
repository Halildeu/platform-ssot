// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, type DropdownEntry } from '../Dropdown';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: DropdownEntry[] = [
  { key: 'edit', label: 'Edit', onClick: vi.fn() },
  { key: 'delete', label: 'Delete', danger: true, onClick: vi.fn() },
];

const renderDropdown = (items: DropdownEntry[] = defaultItems, props = {}) =>
  render(
    <Dropdown items={items} {...props}>
      <button>Open menu</button>
    </Dropdown>,
  );

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Dropdown — temel render', () => {
  it('trigger elementini render eder', () => {
    renderDropdown();
    expect(screen.getByText('Open menu')).toBeInTheDocument();
  });

  it('baslangicta menu kapali olur', () => {
    renderDropdown();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('trigger a aria-haspopup="menu" ekler', () => {
    renderDropdown();
    expect(screen.getByText('Open menu')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('trigger a aria-expanded="false" ekler', () => {
    renderDropdown();
    expect(screen.getByText('Open menu')).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Acma / kapama                                                      */
/* ------------------------------------------------------------------ */

describe('Dropdown — acma / kapama', () => {
  it('trigger tiklandiginda menu acilir', async () => {
    renderDropdown();
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('menu acikken aria-expanded="true" olur', async () => {
    renderDropdown();
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByText('Open menu')).toHaveAttribute('aria-expanded', 'true');
  });

  it('tekrar tiklandiginda menu kapanir', async () => {
    renderDropdown();
    await userEvent.click(screen.getByText('Open menu'));
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Menu items                                                         */
/* ------------------------------------------------------------------ */

describe('Dropdown — menu items', () => {
  it('menu acildiginda tum itemleri render eder', async () => {
    renderDropdown();
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('item role="menuitem" alir', async () => {
    renderDropdown();
    await userEvent.click(screen.getByText('Open menu'));
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
  });

  it('item tiklandiginda onClick calisir ve menu kapanir', async () => {
    const onClick = vi.fn();
    const items: DropdownEntry[] = [{ key: 'action', label: 'Action', onClick }];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    await userEvent.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item disabled attribute alir', async () => {
    const items: DropdownEntry[] = [{ key: 'dis', label: 'Disabled Item', disabled: true }];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByText('Disabled Item').closest('button')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Separator & label                                                  */
/* ------------------------------------------------------------------ */

describe('Dropdown — separator & label', () => {
  it('separator render eder', async () => {
    const items: DropdownEntry[] = [
      { key: 'a', label: 'A' },
      { type: 'separator' },
      { key: 'b', label: 'B' },
    ];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('label entry render eder', async () => {
    const items: DropdownEntry[] = [
      { type: 'label', label: 'Section' },
      { key: 'a', label: 'A' },
    ];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByText('Section')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Dropdown — keyboard navigation', () => {
  it('Escape tusu ile menu kapanir', async () => {
    renderDropdown();
    const trigger = screen.getByText('Open menu');
    await userEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(trigger.closest('div')!, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ArrowDown ile menu acilir', () => {
    renderDropdown();
    const container = screen.getByText('Open menu').closest('div')!;
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Danger items                                                       */
/* ------------------------------------------------------------------ */

describe('Dropdown — danger items', () => {
  it('danger item dogru class alir', async () => {
    const items: DropdownEntry[] = [{ key: 'del', label: 'Delete', danger: true }];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    const btn = screen.getByText('Delete').closest('button');
    expect(btn?.className).toContain('text-[var(--state-error-text)]');
  });
});

/* ------------------------------------------------------------------ */
/*  Item description & icon                                            */
/* ------------------------------------------------------------------ */

describe('Dropdown — description & icon', () => {
  it('description render eder', async () => {
    const items: DropdownEntry[] = [
      { key: 'a', label: 'Action', description: 'Do something' },
    ];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByText('Do something')).toBeInTheDocument();
  });

  it('icon render eder', async () => {
    const items: DropdownEntry[] = [
      { key: 'a', label: 'Action', icon: <span data-testid="item-icon">I</span> },
    ];
    renderDropdown(items);
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.getByTestId('item-icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled state                                                     */
/* ------------------------------------------------------------------ */

describe('Dropdown — disabled state', () => {
  it('does not open when disabled and trigger is clicked', async () => {
    renderDropdown(defaultItems, { disabled: true });
    await userEvent.click(screen.getByText('Open menu'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('applies opacity when disabled', () => {
    const { container } = renderDropdown(defaultItems, { disabled: true });
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain('opacity-50');
  });

  it('sets aria-disabled on trigger when disabled', () => {
    renderDropdown(defaultItems, { disabled: true });
    expect(screen.getByText('Open menu')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not open on ArrowDown key when disabled', () => {
    renderDropdown(defaultItems, { disabled: true });
    const container = screen.getByText('Open menu').closest('div')!;
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Dropdown — edge cases', () => {
  it('className forwarding calisir', async () => {
    renderDropdown(defaultItems, { className: 'custom-class' });
    await userEvent.click(screen.getByText('Open menu'));
    const menu = screen.getByRole('menu');
    expect(menu.className).toContain('custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Dropdown — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderDropdown();
    await expectNoA11yViolations(container);
  });
});

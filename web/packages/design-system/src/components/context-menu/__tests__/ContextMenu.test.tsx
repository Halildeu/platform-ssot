// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu, type ContextMenuEntry } from '../ContextMenu';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleItems: ContextMenuEntry[] = [
  { key: 'edit', label: 'Edit' },
  { key: 'copy', label: 'Copy', shortcut: '⌘C' },
  { type: 'separator', key: 'sep-1' },
  { type: 'label', key: 'label-1', label: 'Danger zone' },
  { key: 'delete', label: 'Delete', danger: true, onClick: vi.fn() },
  { key: 'disabled-item', label: 'Disabled', disabled: true },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ContextMenu — temel render', () => {
  it('trigger elemanini render eder', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });

  it('baslangicta menu gorunmez', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('sag tiklama ile menu acilir', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 100, clientY: 200 });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Menu icerigi                                                       */
/* ------------------------------------------------------------------ */

describe('ContextMenu — menu icerigi', () => {
  const openMenu = () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 100, clientY: 200 });
  };

  it('menuitem rolundeki ogeleri render eder', () => {
    openMenu();
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThanOrEqual(3);
  });

  it('separator render eder', () => {
    openMenu();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('label render eder', () => {
    openMenu();
    expect(screen.getByText('Danger zone')).toBeInTheDocument();
  });

  it('shortcut gosterir', () => {
    openMenu();
    expect(screen.getByText('\u2318C')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('ContextMenu — interaction', () => {
  it('menuitem tiklandiginda onClick calisir ve menu kapanir', async () => {
    const onClick = vi.fn();
    const items: ContextMenuEntry[] = [{ key: 'act', label: 'Action', onClick }];
    render(
      <ContextMenu items={items}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    await userEvent.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('Escape tusu ile menu kapanir', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('dis tiklandiginda menu kapanir', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled state                                                     */
/* ------------------------------------------------------------------ */

describe('ContextMenu — disabled', () => {
  it('disabled=true oldugunda sag tiklama menu acmaz', () => {
    render(
      <ContextMenu items={sampleItems} disabled>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item tiklanamaz', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    const disabledBtn = screen.getByText('Disabled').closest('button');
    expect(disabledBtn).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('ContextMenu — keyboard navigation', () => {
  it('ArrowDown ile focus ilerler', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    // Focus index should change without error
    expect(menu).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ContextMenu — edge cases', () => {
  it('className forwarding calisir', () => {
    render(
      <ContextMenu items={sampleItems} className="custom-ctx-menu">
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    const menu = screen.getByRole('menu');
    expect(menu.className).toContain('custom-ctx-menu');
  });

  it('danger item icin dogru stil uygulanir', () => {
    render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'), { clientX: 0, clientY: 0 });
    const deleteBtn = screen.getByText('Delete').closest('button');
    expect(deleteBtn?.className).toContain('feedback-error');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('ContextMenu — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ContextMenu items={sampleItems}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    await expectNoA11yViolations(container);
  });
});

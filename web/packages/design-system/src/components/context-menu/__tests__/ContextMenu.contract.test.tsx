// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu, type ContextMenuEntry } from '../ContextMenu';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): ContextMenuEntry[] => [
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Paste' },
  { type: 'separator', key: 'sep1' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('ContextMenu contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ContextMenu.displayName).toBe('ContextMenu');
  });

  it('renders trigger children', () => {
    render(
      <ContextMenu items={makeItems()}>
        <button>Right-click me</button>
      </ContextMenu>,
    );
    expect(screen.getByText('Right-click me')).toBeInTheDocument();
  });

  /* ---- Opens on right-click ---- */
  it('opens menu on right-click (contextmenu event)', () => {
    render(
      <ContextMenu items={makeItems()}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Paste')).toBeInTheDocument();
  });

  /* ---- Renders separators ---- */
  it('renders separator entries', () => {
    render(
      <ContextMenu items={makeItems()}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    const separators = screen.getAllByRole('separator');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  });

  /* ---- Renders label entries ---- */
  it('renders label entries', () => {
    const items: ContextMenuEntry[] = [
      { type: 'label', key: 'header', label: 'Actions' },
      { key: 'copy', label: 'Copy' },
    ];
    render(
      <ContextMenu items={items}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  /* ---- Shortcut rendering ---- */
  it('renders keyboard shortcuts', () => {
    render(
      <ContextMenu items={makeItems()}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.getByText('Ctrl+C')).toBeInTheDocument();
  });

  /* ---- onClick callback ---- */
  it('fires onClick when menuitem is clicked', () => {
    const handler = vi.fn();
    const items: ContextMenuEntry[] = [
      { key: 'action', label: 'Do Thing', onClick: handler },
    ];
    render(
      <ContextMenu items={items}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    fireEvent.click(screen.getByText('Do Thing'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  /* ---- Disabled ---- */
  it('does not open when disabled', () => {
    render(
      <ContextMenu items={makeItems()} disabled>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  /* ---- Disabled items ---- */
  it('renders disabled menu items', () => {
    const items: ContextMenuEntry[] = [
      { key: 'a', label: 'Enabled' },
      { key: 'b', label: 'Disabled', disabled: true },
    ];
    render(
      <ContextMenu items={items}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });

  /* ---- className merge ---- */
  it('merges custom className on the menu', () => {
    render(
      <ContextMenu items={makeItems()} className="my-ctx">
        <button>Trigger</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Trigger'));
    expect(screen.getByRole('menu')).toHaveClass('my-ctx');
  });
});

describe('ContextMenu — accessibility', () => {
  it('has no axe-core a11y violations when closed', async () => {
    const { container } = render(
      <ContextMenu items={makeItems()}>
        <button>Trigger</button>
      </ContextMenu>,
    );
    await expectNoA11yViolations(container);
  });
});

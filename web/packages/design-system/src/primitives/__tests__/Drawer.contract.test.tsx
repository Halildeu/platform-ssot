// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Drawer } from '../drawer/Drawer';
import type { DrawerPlacement, DrawerSize, DrawerProps } from '../drawer/Drawer';

describe('Drawer — contract', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    children: React.createElement('div', null, 'Drawer content'),
  };

  // ── Temel render ──
  it('renders without crash', () => {
    render(<Drawer {...defaultProps} />);
    expect(document.body.textContent).toContain('Drawer content');
  });

  it('has displayName', () => {
    expect(Drawer.displayName).toBeTruthy();
  });

  it('does not render content when closed', () => {
    render(<Drawer {...defaultProps} open={false} />);
    expect(document.body.textContent).not.toContain('Drawer content');
  });

  // ── Interaction ──
  it('calls onClose when Escape key pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}>Content</Drawer>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  // ── Edge cases ──
  it('renders with only required props', () => {
    render(<Drawer {...defaultProps} />);
    expect(document.body.querySelector('[data-component="drawer"]') || document.body.children.length > 1).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<Drawer {...defaultProps} title="Test Title" />);
    expect(document.body.textContent).toContain('Test Title');
  });

  // ── A11y ──
  it('has dialog role when open', () => {
    render(<Drawer {...defaultProps} />);
    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
  });

  // ── Types ──
  it('exports expected types', () => {
    const _drawerplacement: DrawerPlacement | undefined = undefined; void _drawerplacement;
    const _drawersize: DrawerSize | undefined = undefined; void _drawersize;
    const _drawerprops: DrawerProps | undefined = undefined; void _drawerprops;
    expect(true).toBe(true);
  });
});

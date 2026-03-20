// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette, type CommandPaletteItem } from '../CommandPalette';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleItems: CommandPaletteItem[] = [
  { id: 'cmd-1', title: 'Go to Dashboard', group: 'Navigation', shortcut: '⌘D' },
  { id: 'cmd-2', title: 'Create Policy', description: 'Start a new policy wizard', group: 'Actions' },
  { id: 'cmd-3', title: 'View Logs', group: 'Navigation', keywords: ['audit', 'history'] },
  { id: 'cmd-4', title: 'Disabled Action', disabled: true, group: 'Actions' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('CommandPalette — temel render', () => {
  it('open=true oldugunda dialog render eder', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('open=false oldugunda hicbir sey render etmez', () => {
    const { container } = render(<CommandPalette open={false} items={sampleItems} />);
    expect(container.innerHTML).toBe('');
  });

  it('varsayilan title ve subtitle gosterir', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('Komut Paleti')).toBeInTheDocument();
  });

  it('ozel title ve subtitle gosterir', () => {
    render(<CommandPalette open items={sampleItems} title="My Commands" subtitle="Find anything" />);
    expect(screen.getByText('My Commands')).toBeInTheDocument();
    expect(screen.getByText('Find anything')).toBeInTheDocument();
  });

  it('tum ogeleri render eder', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Policy')).toBeInTheDocument();
    expect(screen.getByText('View Logs')).toBeInTheDocument();
  });

  it('gruplari render eder', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Arama / filtreleme                                                 */
/* ------------------------------------------------------------------ */

describe('CommandPalette — arama', () => {
  it('query ile filtreleme yapar', () => {
    render(<CommandPalette open items={sampleItems} query="Dashboard" />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create Policy')).not.toBeInTheDocument();
  });

  it('keywords ile arama yapar', () => {
    render(<CommandPalette open items={sampleItems} query="audit" />);
    expect(screen.getByText('View Logs')).toBeInTheDocument();
  });

  it('sonuc yoksa empty state gosterir', () => {
    render(<CommandPalette open items={sampleItems} query="nonexistent" />);
    expect(screen.getByText('Eslesen komut bulunamadi.')).toBeInTheDocument();
  });

  it('ozel emptyStateLabel gosterir', () => {
    render(<CommandPalette open items={sampleItems} query="nonexistent" emptyStateLabel="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('onQueryChange callback calisir', async () => {
    const handleQueryChange = vi.fn();
    render(<CommandPalette open items={sampleItems} onQueryChange={handleQueryChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'test');
    expect(handleQueryChange).toHaveBeenCalledWith('test');
  });
});

/* ------------------------------------------------------------------ */
/*  Secim / interaction                                                */
/* ------------------------------------------------------------------ */

describe('CommandPalette — interaction', () => {
  it('oge tiklandiginda onSelect calisir', async () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    await userEvent.click(screen.getByText('Go to Dashboard'));
    expect(handleSelect).toHaveBeenCalledWith('cmd-1', sampleItems[0]);
  });

  it('disabled oge tiklandiginda onSelect calismaz', async () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    await userEvent.click(screen.getByText('Disabled Action'));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('close butonu tiklandiginda onClose calisir', async () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    await userEvent.click(screen.getByLabelText('Close command palette'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('Escape tusu ile onClose calisir', () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop tiklandiginda onClose calisir', () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    const backdrop = document.querySelector('[role="presentation"]');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('CommandPalette — keyboard navigation', () => {
  it('Enter tusu ile aktif oge secilir', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('cmd-1', sampleItems[0]);
  });

  it('ArrowDown ile aktif index ilerler', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('cmd-2', sampleItems[1]);
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('CommandPalette — access control', () => {
  it('access="hidden" oldugunda hicbir sey render etmez', () => {
    const { container } = render(<CommandPalette open items={sampleItems} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" oldugunda ogeler disabled olur', () => {
    render(<CommandPalette open items={sampleItems} access="disabled" />);
    const buttons = screen.getAllByRole('button').filter(b => b.textContent !== '\u00d7');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('accessReason title olarak atanir', () => {
    render(<CommandPalette open items={sampleItems} onClose={() => {}} accessReason="No permission" />);
    expect(screen.getByLabelText('Close command palette')).toHaveAttribute('title', 'No permission');
  });
});

/* ------------------------------------------------------------------ */
/*  Footer & shortcut                                                  */
/* ------------------------------------------------------------------ */

describe('CommandPalette — footer ve shortcut', () => {
  it('footer render eder', () => {
    render(<CommandPalette open items={sampleItems} footer={<div>My Footer</div>} />);
    expect(screen.getByText('My Footer')).toBeInTheDocument();
  });

  it('shortcut badge gosterir', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('\u2318D')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('CommandPalette — edge cases', () => {
  it('bos items dizisi ile empty state gosterir', () => {
    render(<CommandPalette open items={[]} />);
    expect(screen.getByText('Eslesen komut bulunamadi.')).toBeInTheDocument();
  });

  it('a11y: dialog role ve aria-modal mevcut', () => {
    render(<CommandPalette open items={sampleItems} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y — axe-core                                                    */
/* ------------------------------------------------------------------ */

describe('CommandPalette — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<CommandPalette open items={sampleItems} />);
    await expectNoA11yViolations(container);
  });
});

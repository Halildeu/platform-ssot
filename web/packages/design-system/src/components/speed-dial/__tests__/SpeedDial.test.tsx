// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { SpeedDial } from '../SpeedDial';

afterEach(() => { cleanup(); });

const actions = [
  { icon: <span>E</span>, label: 'Edit', onClick: vi.fn() },
  { icon: <span>D</span>, label: 'Delete', onClick: vi.fn() },
];

describe('SpeedDial — temel render', () => {
  it('FAB buton render eder', () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
  });
  it('tiklaninca aksiyonlari gosterir', () => {
    render(<SpeedDial actions={actions} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
  it('aksiyon tiklaninca callback cagirir', () => {
    render(<SpeedDial actions={actions} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(actions[0].onClick).toHaveBeenCalled();
  });
  it('hidden=true hicbir sey render etmez', () => {
    const { container } = render(<SpeedDial actions={actions} hidden />);
    expect(container.innerHTML).toBe('');
  });
});

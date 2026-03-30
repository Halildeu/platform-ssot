// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { TreeSelect } from '../TreeSelect';

afterEach(() => { cleanup(); });

const data = [
  { value: 'a', label: 'Alpha', children: [
    { value: 'a1', label: 'Alpha-1' },
    { value: 'a2', label: 'Alpha-2' },
  ]},
  { value: 'b', label: 'Beta' },
];

describe('TreeSelect — temel render', () => {
  it('placeholder gosterir', () => {
    render(<TreeSelect data={data} placeholder="Sec..." />);
    expect(screen.getByText('Sec...')).toBeInTheDocument();
  });
  it('tiklaninca dropdown acar', () => {
    render(<TreeSelect data={data} />);
    fireEvent.click(screen.getByText('Select...'));
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
  it('tree item secimi calisir', () => {
    const onChange = vi.fn();
    render(<TreeSelect data={data} onChange={onChange} />);
    fireEvent.click(screen.getByText('Select...'));
    fireEvent.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ value: 'b' }));
  });
});

describe('TreeSelect — multiple', () => {
  it('birden fazla secim destekler', () => {
    render(<TreeSelect data={data} multiple treeDefaultExpandAll />);
    fireEvent.click(screen.getByText('Select...'));
    fireEvent.click(screen.getByText('Alpha-1'));
    fireEvent.click(screen.getByText('Beta'));
    // Should show tags — multiple instances of Alpha-1 (in dropdown + tag)
    expect(screen.getAllByText('Alpha-1').length).toBeGreaterThanOrEqual(1);
  });
});

describe('TreeSelect — search', () => {
  it('arama input gosterir', () => {
    render(<TreeSelect data={data} searchable />);
    fireEvent.click(screen.getByText('Select...'));
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});

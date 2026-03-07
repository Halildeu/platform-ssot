import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CommandPalette from './CommandPalette';

describe('CommandPalette', () => {
  const items = [
    { id: 'search-users', title: 'Search users', description: 'Open the user directory', group: 'Navigate', shortcut: '⌘U' },
    { id: 'open-policy', title: 'Open policy', description: 'Navigate to policy docs', group: 'Knowledge', shortcut: '⌘P' },
    { id: 'apply-release', title: 'Apply release recommendation', description: 'Approve staged rollout', group: 'AI Assist', shortcut: '↵' },
  ];

  test('open durumda itemlari ve gruplari gosterir', () => {
    render(<CommandPalette open items={items} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Navigate')).toBeInTheDocument();
    expect(screen.getByText('Search users')).toBeInTheDocument();
  });

  test('query ile filtreleme yapar', () => {
    render(<CommandPalette open items={items} defaultQuery="policy" />);

    expect(screen.getByText('Open policy')).toBeInTheDocument();
    expect(screen.queryByText('Search users')).not.toBeInTheDocument();
  });

  test('keyboard ile secim yapar', () => {
    const handleSelect = jest.fn();
    render(<CommandPalette open items={items} onSelect={handleSelect} />);

    const input = screen.getByLabelText(/Command search/i);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSelect).toHaveBeenCalledWith('open-policy', expect.objectContaining({ id: 'open-policy' }));
  });

  test('readonly access durumunda secimi bloke eder', () => {
    const handleSelect = jest.fn();
    render(<CommandPalette open items={items} access="readonly" onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Search users/i }));
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

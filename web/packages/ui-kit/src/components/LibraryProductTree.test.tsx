import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LibraryProductTree, { type LibraryProductTreeTrack } from './LibraryProductTree';

const tracks: LibraryProductTreeTrack[] = [
  {
    id: 'new_packages',
    label: 'Yeni Paketler',
    eyebrow: 'Track',
    icon: <span data-testid="icon-new" />,
    badgeLabel: '2',
    accentClassName: 'bg-action-primary',
    groups: [
      {
        id: 'actions',
        label: 'Actions',
        badgeLabel: '2',
        subgroups: [
          {
            id: 'feedback',
            label: 'feedback',
            items: [
              { id: 'button', label: 'Button', badgeLabel: 'Stable', badgeTone: 'success' },
              { id: 'icon-button', label: 'IconButton', badgeLabel: 'Beta', badgeTone: 'warning' },
            ],
          },
          {
            id: 'tabs',
            label: 'Tabs',
            items: [{ id: 'tabs', label: 'Tabs', badgeLabel: 'Beta', badgeTone: 'warning' }],
          },
        ],
      },
    ],
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: <span data-testid="icon-roadmap" />,
    badgeLabel: '1',
    groups: [
      {
        id: 'future',
        label: 'Future',
        badgeLabel: '1',
        subgroups: [{ id: 'planned', label: 'planned', items: [{ id: 'tree', label: 'Tree' }] }],
      },
    ],
  },
];

describe('LibraryProductTree', () => {
  test('ayni track ikinci tikta kapanir', () => {
    render(<LibraryProductTree tracks={tracks} defaultSelection={{ trackId: 'new_packages', groupId: 'actions', subgroupId: 'feedback', itemId: 'button' }} />);

    expect(screen.getByText('Actions')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Yeni Paketler/i }));
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  test('ayni group ikinci tikta kapanir', () => {
    render(<LibraryProductTree tracks={tracks} defaultSelection={{ trackId: 'new_packages', groupId: 'actions', subgroupId: 'feedback', itemId: 'button' }} />);

    expect(screen.getByText('feedback')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Actions/i }));
    expect(screen.queryByText('feedback')).not.toBeInTheDocument();
  });

  test('item secimi callback ile bildirilir', () => {
    const onSelectionChange = jest.fn();
    render(
      <LibraryProductTree
        tracks={tracks}
        defaultSelection={{ trackId: 'new_packages', groupId: 'actions', subgroupId: 'feedback', itemId: 'button' }}
        onSelectionChange={onSelectionChange}
      />, 
    );

    fireEvent.click(screen.getByRole('button', { name: /IconButton/i }));

    expect(onSelectionChange).toHaveBeenLastCalledWith({
      trackId: 'new_packages',
      groupId: 'actions',
      subgroupId: 'feedback',
      itemId: 'icon-button',
    });
  });

  test('ayni group icinde tek subgroup acik kalir', () => {
    render(<LibraryProductTree tracks={tracks} defaultSelection={{ trackId: 'new_packages', groupId: 'actions', subgroupId: 'feedback', itemId: 'button' }} />);

    expect(screen.getByText('Button')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Tabs/i }));

    expect(screen.getByText('Tabs')).toBeInTheDocument();
    expect(screen.queryByText('Button')).not.toBeInTheDocument();
  });

  test('tek itemli ve ayni isimli subgroup tek satir olarak gosterilir', () => {
    render(<LibraryProductTree tracks={tracks} defaultSelection={{ trackId: 'new_packages', groupId: 'actions', subgroupId: 'feedback', itemId: 'button' }} />);

    fireEvent.click(screen.getByRole('button', { name: /Tabs/i }));

    const tabButtons = screen.getAllByRole('button', { name: /Tabs/i });
    expect(tabButtons).toHaveLength(1);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});

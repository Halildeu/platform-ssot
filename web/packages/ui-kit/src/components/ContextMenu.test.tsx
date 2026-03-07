import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ContextMenu from './ContextMenu';

describe('ContextMenu', () => {
  const items = [
    { key: 'inspect', label: 'İncele', description: 'Kaydın detaylarını aç.' },
    { key: 'archive', label: 'Arşive al', shortcut: '⌘A', danger: true },
  ];

  test('button trigger ile menu acilir ve secim callback uretir', () => {
    const handleSelect = jest.fn();
    render(<ContextMenu buttonLabel="Bağlam menüsü" items={items} onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Bağlam menüsü/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: /İncele/i }));
    expect(handleSelect).toHaveBeenCalledWith('inspect', expect.objectContaining({ key: 'inspect' }));
  });

  test('contextmenu modu ile sag tikta acilir', () => {
    render(<ContextMenu triggerMode="contextmenu" trigger="Alan" items={items} title="Bağlam" />);

    fireEvent.contextMenu(screen.getByText('Alan'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Bağlam')).toBeInTheDocument();
  });

  test('readonly access durumunda menu acilmaz', () => {
    render(<ContextMenu buttonLabel="Readonly menü" access="readonly" items={items} />);

    fireEvent.click(screen.getByRole('button', { name: /Readonly menü/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

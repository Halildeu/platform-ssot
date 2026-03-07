import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AIActionAuditTimeline from './AIActionAuditTimeline';

describe('AIActionAuditTimeline', () => {
  const items = [
    {
      id: 'draft',
      actor: 'ai' as const,
      title: 'Draft recommendation',
      timestamp: '07 Mar 2026 10:00',
      summary: 'System generated a recommendation draft.',
      status: 'drafted' as const,
    },
    {
      id: 'approval',
      actor: 'human' as const,
      title: 'Human approval',
      timestamp: '07 Mar 2026 10:05',
      status: 'approved' as const,
    },
  ];

  test('timeline kayitlarini gosterir', () => {
    render(<AIActionAuditTimeline items={items} />);
    expect(screen.getByText('Draft recommendation')).toBeInTheDocument();
    expect(screen.getByText('Human approval')).toBeInTheDocument();
  });

  test('item secimini bildirir', () => {
    const onSelectItem = jest.fn();
    render(<AIActionAuditTimeline items={items} onSelectItem={onSelectItem} />);

    fireEvent.click(screen.getByRole('button', { name: /Draft recommendation/i }));
    expect(onSelectItem).toHaveBeenCalledWith('draft', expect.objectContaining({ id: 'draft' }));
  });

  test('readonly access durumunda secimi bloklar', () => {
    const onSelectItem = jest.fn();
    render(<AIActionAuditTimeline items={items} onSelectItem={onSelectItem} access="readonly" />);

    fireEvent.click(screen.getByRole('button', { name: /Draft recommendation/i }));
    expect(onSelectItem).not.toHaveBeenCalled();
  });

  test('empty timeline durumunda empty state gosterir', () => {
    render(<AIActionAuditTimeline items={[]} emptyStateLabel="Kayit yok" />);
    expect(screen.getByText('Kayit yok')).toBeInTheDocument();
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { List } from './List';

describe('List', () => {
  test('items, meta ve badge bilgisini birlikte gosterir', () => {
    render(
      <List
        title="Task queue"
        items={[
          {
            key: 'review',
            title: 'Review policy',
            description: 'Security sign-off bekleniyor.',
            meta: 'P1',
            badges: ['Pending', <Badge key="count" tone="info">3</Badge>],
          },
        ]}
      />,
    );

    expect(screen.getByText('Task queue')).toBeInTheDocument();
    expect(screen.getByText('Review policy')).toBeInTheDocument();
    expect(screen.getByText('Security sign-off bekleniyor.')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('item secimi callback ile bildirilir', () => {
    const onItemSelect = jest.fn();

    render(
      <List
        selectedKey="rules"
        onItemSelect={onItemSelect}
        items={[
          { key: 'rules', title: 'Rule contract' },
          { key: 'release', title: 'Release note' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Release note' }));
    expect(onItemSelect).toHaveBeenCalledWith('release');
    expect(screen.getByRole('button', { name: 'Rule contract' })).toHaveAttribute('aria-current', 'true');
  });

  test('loading ve empty durumlarini gosterir', () => {
    const { rerender } = render(<List loading items={[]} />);
    expect(screen.getByTestId('list-loading-state')).toHaveAttribute('data-loading', 'true');

    rerender(<List items={[]} emptyStateLabel="Kayıt yok." />);
    expect(screen.getByText('Kayıt yok.')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<List access="hidden" items={[{ key: 'a', title: 'Hidden' }]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TreeTable } from './TreeTable';

const nodes = [
  {
    key: 'platform',
    label: 'Platform',
    data: { owner: 'UI', status: 'Stable' },
    children: [
      {
        key: 'ui-library',
        label: 'UI Library',
        data: { owner: 'Platform UI', status: 'Beta' },
      },
    ],
  },
];

describe('TreeTable', () => {
  it('expanded node alt satirlari gosterir', () => {
    render(
      <TreeTable
        nodes={nodes}
        defaultExpandedKeys={['platform']}
        columns={[
          { key: 'owner', label: 'Owner', accessor: 'owner' },
          { key: 'status', label: 'Durum', accessor: 'status' },
        ]}
      />,
    );

    expect(screen.getByText('UI Library')).toBeInTheDocument();
  });

  it('row secimini bildirir', () => {
    const onNodeSelect = jest.fn();
    render(
      <TreeTable
        nodes={nodes}
        columns={[{ key: 'owner', label: 'Owner', accessor: 'owner' }]}
        onNodeSelect={onNodeSelect}
      />,
    );

    fireEvent.click(screen.getByText('Platform'));
    expect(onNodeSelect).toHaveBeenCalledWith('platform');
  });

  it('loading ve empty state davranisini destekler', () => {
    const { rerender } = render(
      <TreeTable
        nodes={[]}
        columns={[{ key: 'owner', label: 'Owner', accessor: 'owner' }]}
        loading
      />,
    );
    expect(screen.getAllByRole('row')).toHaveLength(4);
    rerender(<TreeTable nodes={[]} columns={[]} emptyStateLabel="Kayit yok." />);
    expect(screen.getByText('Kayit yok.')).toBeInTheDocument();
  });

  it('hidden access durumunda render etmez', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={[]} access="hidden" />);
    expect(container).toBeEmptyDOMElement();
  });
});

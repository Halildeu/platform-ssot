import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tree } from './Tree';

const nodes = [
  {
    key: 'governance',
    label: 'Governance',
    description: 'Approval ve policy akislari',
    badges: ['Stable'],
    children: [
      {
        key: 'policies',
        label: 'Policies',
        description: 'Versioned policy listesi',
      },
    ],
  },
];

describe('Tree', () => {
  it('expand/collapse davranisini ikinci tikta kapatir', () => {
    render(<Tree nodes={nodes} defaultExpandedKeys={['governance']} />);

    expect(screen.getByText('Policies')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Dal kapanir'));
    expect(screen.queryByText('Policies')).not.toBeInTheDocument();
  });

  it('node secimini bildirir', () => {
    const onNodeSelect = jest.fn();
    render(<Tree nodes={nodes} onNodeSelect={onNodeSelect} defaultExpandedKeys={['governance']} />);

    fireEvent.click(screen.getByText('Policies'));
    expect(onNodeSelect).toHaveBeenCalledWith('policies');
  });

  it('loading durumunda skeleton gosterir', () => {
    render(<Tree nodes={[]} loading />);
    expect(screen.getByTestId('tree-loading-state')).toBeInTheDocument();
  });

  it('hidden access durumunda render etmez', () => {
    const { container } = render(<Tree nodes={nodes} access="hidden" />);
    expect(container).toBeEmptyDOMElement();
  });
});

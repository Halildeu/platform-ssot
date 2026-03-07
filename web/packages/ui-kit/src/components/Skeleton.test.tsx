import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  test('text varyantında istenen satır kadar placeholder üretir', () => {
    render(<Skeleton lines={3} data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.querySelectorAll('span')).toHaveLength(3);
    expect(skeleton).toHaveAttribute('data-lines', '3');
  });

  test('table-row varyantı deterministic sütun placeholder seti üretir', () => {
    render(<Skeleton variant="table-row" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.querySelectorAll('span')).toHaveLength(4);
    expect(skeleton).not.toHaveAttribute('data-lines');
  });

  test('animated=false olduğunda motion metadata korunur', () => {
    render(<Skeleton animated={false} data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-animated', 'false');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  test('text varyantında istenen satır kadar placeholder üretir', () => {
    render(<Skeleton lines={3} data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.querySelectorAll('span')).toHaveLength(3);
  });
});

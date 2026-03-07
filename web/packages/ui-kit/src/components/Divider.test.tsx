import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from './Divider';

describe('Divider', () => {
  test('label ile horizontal separator render eder', () => {
    render(<Divider label="veya" />);

    expect(screen.getByText('veya')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
  });

  test('vertical decorative divider semantik separator üretmez', () => {
    render(<Divider orientation="vertical" decorative data-testid="divider" />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByTestId('divider')).toHaveAttribute('data-decorative', 'true');
    expect(screen.getByTestId('divider')).toHaveAttribute('data-orientation', 'vertical');
  });
});

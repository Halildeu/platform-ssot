import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from './Divider';

describe('Divider', () => {
  test('label ile horizontal separator render eder', () => {
    render(<Divider label="veya" />);

    expect(screen.getByText('veya')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

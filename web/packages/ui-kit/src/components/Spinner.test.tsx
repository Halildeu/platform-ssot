import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  test('status role ve label ile render edilir', () => {
    render(<Spinner label="Kayıtlar yükleniyor" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Kayıtlar yükleniyor')).toBeInTheDocument();
  });

  test('mode, tone ve size metadata taşır', () => {
    render(<Spinner mode="overlay" tone="inverse" size="lg" data-testid="spinner" />);

    expect(screen.getByTestId('spinner')).toHaveAttribute('data-mode', 'overlay');
    expect(screen.getByTestId('spinner')).toHaveAttribute('data-tone', 'inverse');
    expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'lg');
  });
});

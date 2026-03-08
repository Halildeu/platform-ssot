import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EmptyErrorLoading from './EmptyErrorLoading';

describe('EmptyErrorLoading', () => {
  test('loading modunda spinner gosterir', () => {
    render(<EmptyErrorLoading mode="loading" loadingLabel="Fetch ediliyor" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Fetch ediliyor')).toBeInTheDocument();
  });

  test('error modunda retry callback cagrilir', () => {
    const onRetry = jest.fn();
    render(<EmptyErrorLoading mode="error" onRetry={onRetry} retryLabel="Yeniden dene" />);

    fireEvent.click(screen.getByRole('button', { name: /Yeniden dene/i }));
    expect(onRetry).toHaveBeenCalled();
  });
});

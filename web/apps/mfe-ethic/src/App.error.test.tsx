import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App error state', () => {
  test('varsayilan render alert veya hata metni icermez', () => {
    render(<App />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/hata/i)).not.toBeInTheDocument();
  });
});

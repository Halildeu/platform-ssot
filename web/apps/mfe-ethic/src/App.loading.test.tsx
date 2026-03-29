import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App loading state', () => {
  test('sahte loading durumuna dusmez', () => {
    render(<App />);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});

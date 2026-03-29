import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App counter placeholder replacement', () => {
  test('tek bir ana baslik render eder', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });
});

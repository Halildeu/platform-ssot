import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('baslik ve aciklama metnini render eder', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'Ethic' })).toBeInTheDocument();
    expect(screen.getByText('Ethic mikro uygulaması aktif.')).toBeInTheDocument();
  });
});

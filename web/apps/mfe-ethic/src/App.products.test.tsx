import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App product messaging', () => {
  test('mikro uygulama durum mesajini gosterir', () => {
    render(<App />);
    expect(screen.getByText(/mikro uygulaması aktif/i)).toBeInTheDocument();
  });
});

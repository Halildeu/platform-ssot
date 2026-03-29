import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App structure', () => {
  test('kok kapsayici padding stili ile gelir', () => {
    const { container } = render(<App />);
    expect(container.firstElementChild).toHaveStyle({ padding: '1em' });
  });
});

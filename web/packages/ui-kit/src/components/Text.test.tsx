import React from 'react';
import { render, screen } from '@testing-library/react';
import Text from './Text';

describe('Text', () => {
  test('semantic preset ve as kombinasyonunu dogru render eder', () => {
    render(
      <Text as="h2" preset="heading">
        Başlık
      </Text>,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Başlık' });
    expect(heading).toHaveAttribute('data-preset', 'heading');
    expect(heading).toHaveClass('text-2xl');
    expect(heading).toHaveClass('leading-tight');
  });

  test('truncate, clamp ve mono davranisini style ve class ile uygular', () => {
    render(
      <Text preset="body" mono clampLines={2} className="max-w-[220px]">
        Uzun içerik örneği
      </Text>,
    );

    const text = screen.getByText('Uzun içerik örneği');
    expect(text).toHaveAttribute('data-clamp-lines', '2');
    expect(text).toHaveStyle({ WebkitLineClamp: '2' });
    expect(text).toHaveClass('font-mono');
  });

  test('align, pretty wrap ve tabular nums davranislarini semantic class ile uygular', () => {
    render(
      <Text preset="body" align="center" wrap="pretty" tabularNums>
        12.450,00
      </Text>,
    );

    const text = screen.getByText('12.450,00');
    expect(text).toHaveClass('text-center');
    expect(text).toHaveClass('tabular-nums');
    expect(text).toHaveClass('[text-wrap:pretty]');
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(
      <Text access="hidden">Gizli içerik</Text>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Steps from './Steps';

const items = [
  { value: 'draft', title: 'Taslak' },
  { value: 'review', title: 'İnceleme' },
  { value: 'publish', title: 'Yayın' },
];

describe('Steps', () => {
  test('current step aria-current ile işaretlenir', () => {
    render(<Steps items={items} defaultValue="review" />);

    expect(screen.getByText('İnceleme').closest('[aria-current="step"]')).toBeInTheDocument();
  });

  test('interactive modda tıklama ile step değişir', () => {
    render(<Steps items={items} defaultValue="draft" interactive />);

    fireEvent.click(screen.getByRole('button', { name: /İnceleme/i }));

    expect(screen.getByText('İnceleme').closest('[aria-current="step"]')).toBeInTheDocument();
  });

  test('orientation metadata taşır', () => {
    const { container } = render(<Steps items={items} orientation="vertical" />);

    expect(container.querySelector('ol')).toHaveAttribute('data-orientation', 'vertical');
  });

  test('vertical interactive varyantta aktif step değişir', () => {
    render(<Steps items={items} defaultValue="review" orientation="vertical" interactive />);

    fireEvent.click(screen.getByRole('button', { name: /Yayın/i }));

    expect(screen.getByText('Yayın').closest('[aria-current="step"]')).toBeInTheDocument();
  });
});

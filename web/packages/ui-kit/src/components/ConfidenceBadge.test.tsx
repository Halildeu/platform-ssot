import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfidenceBadge from './ConfidenceBadge';

describe('ConfidenceBadge', () => {
  test('level, score ve source count bilgisini gosterir', () => {
    render(<ConfidenceBadge level="high" score={87} sourceCount={4} />);

    expect(screen.getByText('High confidence · 87% · 4 sources')).toBeInTheDocument();
  });

  test('compact modda yalniz etiket ve skor gosterir', () => {
    render(<ConfidenceBadge level="medium" score={64} sourceCount={3} compact />);

    expect(screen.getByText('Medium confidence · 64%')).toBeInTheDocument();
    expect(screen.queryByText(/sources/i)).not.toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<ConfidenceBadge access="hidden" />);
    expect(container).toBeEmptyDOMElement();
  });
});

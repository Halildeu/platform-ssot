import React from 'react';
import { render, screen } from '@testing-library/react';
import { SummaryStrip } from './SummaryStrip';

describe('SummaryStrip', () => {
  test('summary kartlarini render eder', () => {
    render(
      <SummaryStrip
        title="Ozet"
        items={[
          { key: 'a', label: 'Acilik', value: '12' },
          { key: 'b', label: 'Risk', value: 'Low', note: 'Kontrol altinda' },
        ]}
      />,
    );

    expect(screen.getByText('Acilik')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Kontrol altinda')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<SummaryStrip items={[]} access="hidden" />);
    expect(container.firstChild).toBeNull();
  });
});

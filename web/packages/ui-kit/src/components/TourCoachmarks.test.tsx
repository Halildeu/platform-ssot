import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TourCoachmarks from './TourCoachmarks';

describe('TourCoachmarks', () => {
  const steps = [
    { id: 'discover', title: 'Keşfet', description: 'Ana gezinim ve bilgi kokusu bloklarını tanı.' },
    { id: 'review', title: 'Gözden geçir', description: 'Karar noktalarını ve kanıt alanlarını incele.' },
  ];

  test('open durumda step icerigini gosterir ve sonraki adıma ilerler', () => {
    render(<TourCoachmarks open steps={steps} />);

    expect(screen.getByText('Keşfet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Sonraki adım/i }));
    expect(screen.getByText('Gözden geçir')).toBeInTheDocument();
  });

  test('tamamlama callbacki calisir', () => {
    const handleFinish = jest.fn();
    render(<TourCoachmarks open steps={steps} currentStep={1} onFinish={handleFinish} />);

    fireEvent.click(screen.getByRole('button', { name: /Tamamla|Tur tamamlandı/i }));
    expect(handleFinish).toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    render(<TourCoachmarks open steps={steps} access="hidden" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

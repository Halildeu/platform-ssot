import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Slider from './Slider';

describe('Slider', () => {
  test('label, aciklama ve deger gostergesini birlikte gosterir', () => {
    render(
      <Slider
        label="Yoğunluk"
        description="Panel sıkılığı ve boşluk kararını belirler."
        hint="Daha yüksek değer daha geniş alan kullanır."
        defaultValue={60}
        min={0}
        max={100}
      />,
    );

    expect(screen.getByRole('slider', { name: /Yoğunluk/i })).toHaveValue('60');
    expect(screen.getByText('Panel sıkılığı ve boşluk kararını belirler.')).toBeInTheDocument();
    expect(screen.getByText('Daha yüksek değer daha geniş alan kullanır.')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  test('onValueChange yeni numeric degeri uretir', () => {
    const handleValueChange = jest.fn();

    render(<Slider label="Opacity" defaultValue={20} onValueChange={handleValueChange} />);

    const slider = screen.getByRole('slider', { name: /Opacity/i });
    fireEvent.change(slider, { target: { value: '24' } });

    expect(handleValueChange).toHaveBeenLastCalledWith(24, expect.any(Object));
    expect(slider).toHaveValue('24');
  });

  test('readonly access durumunda degisim bloklanir', () => {
    const handleValueChange = jest.fn();

    render(<Slider label="Readonly range" value={40} access="readonly" onValueChange={handleValueChange} />);

    const slider = screen.getByRole('slider', { name: /Readonly range/i });
    expect(slider).toHaveAttribute('aria-readonly', 'true');

    fireEvent.change(slider, { target: { value: '48' } });

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(slider).toHaveValue('40');
  });

  test('hidden access durumunda render etmez', () => {
    render(<Slider label="Gizli slider" access="hidden" />);

    expect(screen.queryByRole('slider', { name: /Gizli slider/i })).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  test('label, aciklama ve hint metnini birlikte gosterir', () => {
    render(
      <DatePicker
        label="Teslim tarihi"
        description="Akışın tamamlanacağı günü seç."
        hint="Takvimden veya keyboard ile girilebilir."
        defaultValue="2026-03-14"
      />,
    );

    expect(screen.getByLabelText(/Teslim tarihi/i)).toHaveValue('2026-03-14');
    expect(screen.getByText('Akışın tamamlanacağı günü seç.')).toBeInTheDocument();
    expect(screen.getByText('Takvimden veya keyboard ile girilebilir.')).toBeInTheDocument();
  });

  test('onValueChange yeni tarih degerini uretir', () => {
    const handleValueChange = jest.fn();

    render(<DatePicker label="Yayın tarihi" onValueChange={handleValueChange} />);

    const input = screen.getByLabelText(/Yayın tarihi/i);
    fireEvent.change(input, { target: { value: '2026-03-21' } });

    expect(handleValueChange).toHaveBeenLastCalledWith('2026-03-21', expect.any(Object));
    expect(input).toHaveValue('2026-03-21');
  });

  test('readonly access durumunda degisim bloklanir', () => {
    const handleValueChange = jest.fn();

    render(
      <DatePicker
        label="Readonly date"
        value="2026-03-09"
        access="readonly"
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByLabelText(/Readonly date/i);
    expect(input).toHaveAttribute('aria-readonly', 'true');

    fireEvent.change(input, { target: { value: '2026-03-11' } });

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('2026-03-09');
  });

  test('hidden access durumunda render etmez', () => {
    render(<DatePicker label="Gizli date" access="hidden" />);

    expect(screen.queryByLabelText(/Gizli date/i)).not.toBeInTheDocument();
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TimePicker from './TimePicker';

describe('TimePicker', () => {
  test('label, aciklama ve hint metnini birlikte gosterir', () => {
    render(
      <TimePicker
        label="Toplanti saati"
        description="Rollout onayi icin saat sec."
        hint="15 dakikalik adimlarla ilerle."
        defaultValue="14:30"
      />,
    );

    expect(screen.getByLabelText(/Toplanti saati/i)).toHaveValue('14:30');
    expect(screen.getByText('Rollout onayi icin saat sec.')).toBeInTheDocument();
    expect(screen.getByText('15 dakikalik adimlarla ilerle.')).toBeInTheDocument();
  });

  test('onValueChange yeni saat degerini uretir', () => {
    const handleValueChange = jest.fn();

    render(<TimePicker label="Kesim saati" onValueChange={handleValueChange} />);

    const input = screen.getByLabelText(/Kesim saati/i);
    fireEvent.change(input, { target: { value: '18:45' } });

    expect(handleValueChange).toHaveBeenLastCalledWith('18:45', expect.any(Object));
    expect(input).toHaveValue('18:45');
  });

  test('readonly access durumunda degisim bloklanir', () => {
    const handleValueChange = jest.fn();

    render(
      <TimePicker
        label="Readonly saat"
        value="09:15"
        access="readonly"
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByLabelText(/Readonly saat/i);
    expect(input).toHaveAttribute('aria-readonly', 'true');

    fireEvent.change(input, { target: { value: '10:00' } });

    expect(handleValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('09:15');
  });

  test('hidden access durumunda render etmez', () => {
    render(<TimePicker label="Gizli saat" access="hidden" />);

    expect(screen.queryByLabelText(/Gizli saat/i)).not.toBeInTheDocument();
  });
});

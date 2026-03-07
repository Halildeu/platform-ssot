import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';

describe('TextInput', () => {
  test('label, aciklama, yardim metni ve count bilgisini birlikte gosterir', () => {
    render(
      <TextInput
        label="Ad"
        description="Kullaniciya gorunen tam ad"
        hint="Maksimum 20 karakter"
        defaultValue="Ada"
        maxLength={20}
        showCount
      />,
    );

    expect(screen.getByLabelText('Ad')).toHaveValue('Ada');
    expect(screen.getByText('Kullaniciya gorunen tam ad')).toBeInTheDocument();
    expect(screen.getByText('Maksimum 20 karakter')).toBeInTheDocument();
    expect(screen.getAllByText('3 / 20')).toHaveLength(2);
  });

  test('onValueChange uncontrolled kullanimda yeni degeri verir', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    render(<TextInput label="Kod" onValueChange={handleValueChange} />);

    const input = screen.getByLabelText('Kod');
    await user.type(input, 'TR-42');

    expect(input).toHaveValue('TR-42');
    expect(handleValueChange).toHaveBeenLastCalledWith('TR-42', expect.any(Object));
  });

  test('readonly access durumunda yazma bloklanir ve aria-readonly set edilir', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    render(
      <TextInput
        label="Durum"
        defaultValue="Salt okunur"
        access="readonly"
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByLabelText('Durum');
    expect(input).toHaveAttribute('aria-readonly', 'true');

    await user.type(input, ' yeni');

    expect(input).toHaveValue('Salt okunur');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    render(<TextInput label="Gizli alan" access="hidden" />);
    expect(screen.queryByLabelText('Gizli alan')).not.toBeInTheDocument();
  });
});

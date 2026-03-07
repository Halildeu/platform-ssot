import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from './TextArea';

describe('TextArea', () => {
  test('label, error ve count bilgisini gosterir', () => {
    render(
      <TextArea
        label="Açıklama"
        defaultValue="Kısa not"
        error="Bu alan zorunlu"
        maxLength={100}
        showCount
      />,
    );

    expect(screen.getByLabelText('Açıklama')).toHaveValue('Kısa not');
    expect(screen.getByText('Bu alan zorunlu')).toBeInTheDocument();
    expect(screen.getAllByText('8 / 100')).toHaveLength(2);
  });

  test('resize auto modunda yukseklik iceriğe gore guncellenir', async () => {
    const user = userEvent.setup();

    render(<TextArea label="Not" resize="auto" rows={2} />);

    const textarea = screen.getByLabelText('Not') as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 168,
    });

    await user.type(textarea, 'Satir bir\nSatir iki\nSatir uc');

    await waitFor(() => {
      expect(textarea.style.height).toBe('168px');
    });
  });

  test('disabled access durumunda degisim callbackini cagirmaz', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    render(
      <TextArea
        label="Durum"
        defaultValue="Kilitli"
        access="disabled"
        onValueChange={handleValueChange}
      />,
    );

    const textarea = screen.getByLabelText('Durum');
    expect(textarea).toBeDisabled();

    await user.type(textarea, ' yeni');

    expect(textarea).toHaveValue('Kilitli');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    render(<TextArea label="Gizli not" access="hidden" />);
    expect(screen.queryByLabelText('Gizli not')).not.toBeInTheDocument();
  });
});

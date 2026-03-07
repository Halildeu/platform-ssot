import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Radio from './Radio';

describe('Radio', () => {
  test('label, aciklama ve yardim metnini birlikte gosterir', () => {
    render(
      <Radio
        name="density"
        value="comfortable"
        label="Comfortable"
        description="Daha ferah satır aralığı."
        hint="Varsayılan yoğunluk."
        defaultChecked
      />,
    );

    expect(screen.getByRole('radio', { name: /Comfortable/i })).toBeChecked();
    expect(screen.getByText('Daha ferah satır aralığı.')).toBeInTheDocument();
    expect(screen.getByText('Varsayılan yoğunluk.')).toBeInTheDocument();
  });

  test('onCheckedChange secilen radio icin true degeri uretir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(
      <div>
        <Radio name="density" value="comfortable" label="Comfortable" defaultChecked />
        <Radio name="density" value="compact" label="Compact" onCheckedChange={handleCheckedChange} />
      </div>,
    );

    const radio = screen.getByRole('radio', { name: /Compact/i });
    await user.click(radio);

    expect(radio).toBeChecked();
    expect(handleCheckedChange).toHaveBeenLastCalledWith(true, expect.any(Object));
  });

  test('readonly access durumunda secim degismez', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(
      <div>
        <Radio name="theme" value="light" label="Açık" defaultChecked />
        <Radio
          name="theme"
          value="dark"
          label="Koyu"
          access="readonly"
          onCheckedChange={handleCheckedChange}
        />
      </div>,
    );

    const readonlyRadio = screen.getByRole('radio', { name: /Koyu/i });
    expect(readonlyRadio).toHaveAttribute('aria-readonly', 'true');

    await user.click(readonlyRadio);

    expect(readonlyRadio).not.toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    render(<Radio label="Gizli seçenek" access="hidden" />);

    expect(screen.queryByRole('radio', { name: /Gizli seçenek/i })).not.toBeInTheDocument();
  });
});

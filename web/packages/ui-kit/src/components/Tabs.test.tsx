import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';

const demoItems = [
  { value: 'overview', label: 'Genel Bakis', content: <div>Genel panel</div> },
  { value: 'activity', label: 'Aktivite', content: <div>Aktivite paneli</div> },
  { value: 'settings', label: 'Ayarlar', content: <div>Ayarlar paneli</div>, disabled: true },
];

describe('Tabs', () => {
  test('varsayilan olarak ilk aktif sekmeyi secer ve tiklama ile panel degistirir', async () => {
    const user = userEvent.setup();
    render(<Tabs items={demoItems} />);

    expect(screen.getByRole('tab', { name: 'Genel Bakis' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Genel panel');

    await user.click(screen.getByRole('tab', { name: 'Aktivite' }));

    expect(screen.getByRole('tab', { name: 'Aktivite' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Aktivite paneli');
  });

  test('manual activation modunda ok tuslari focusu tasir, Enter secimi tamamlar', async () => {
    const user = userEvent.setup();
    render(<Tabs items={demoItems} activationMode="manual" />);

    const overview = screen.getByRole('tab', { name: 'Genel Bakis' });
    overview.focus();
    await user.keyboard('{ArrowRight}');

    const activity = screen.getByRole('tab', { name: 'Aktivite' });
    expect(activity).toHaveFocus();
    expect(overview).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Aktivite paneli');
  });

  test('disabled sekme secilemez ve active paneli degistirmez', async () => {
    const user = userEvent.setup();
    render(<Tabs items={demoItems} value="activity" onValueChange={jest.fn()} />);

    const disabledTab = screen.getByRole('tab', { name: 'Ayarlar' });
    expect(disabledTab).toBeDisabled();

    await user.click(disabledTab);
    expect(screen.getByRole('tab', { name: 'Aktivite' })).toHaveAttribute('aria-selected', 'true');
  });
});

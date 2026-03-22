import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tabs } from '../Tabs';

const items = [
  { key: 'tab1', label: 'First', content: <div>First content</div> },
  { key: 'tab2', label: 'Second', content: <div>Second content</div> },
  { key: 'tab3', label: 'Third', content: <div>Third content</div>, disabled: true },
];

describe('Tabs (Browser)', () => {
  it('renders tab buttons', async () => {
    const screen = render(<Tabs items={items} />);
    await expect.element(screen.getByRole('tab', { name: 'First' })).toBeVisible();
    await expect.element(screen.getByRole('tab', { name: 'Second' })).toBeVisible();
  });

  it('shows first tab content by default', async () => {
    const screen = render(<Tabs items={items} />);
    await expect.element(screen.getByText('First content')).toBeVisible();
  });

  it('switches tab on click', async () => {
    const screen = render(<Tabs items={items} />);
    await screen.getByRole('tab', { name: 'Second' }).click();
    await expect.element(screen.getByText('Second content')).toBeVisible();
  });

  it('disabled tab cannot be clicked', async () => {
    const screen = render(<Tabs items={items} />);
    const disabledTab = screen.getByRole('tab', { name: 'Third' });
    await expect.element(disabledTab).toBeDisabled();
  });
});

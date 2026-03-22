import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ReportFilterPanel } from '../ReportFilterPanel';

describe('ReportFilterPanel (Browser)', () => {
  it('renders submit and reset buttons', async () => {
    const screen = render(
      <ReportFilterPanel onSubmit={() => {}} onReset={() => {}}>
        <input placeholder="Date from" />
        <input placeholder="Date to" />
      </ReportFilterPanel>,
    );
    await expect.element(screen.getByText('Filtrele')).toBeVisible();
    await expect.element(screen.getByText('Sifirla')).toBeVisible();
  });

  it('renders children inputs', async () => {
    const screen = render(
      <ReportFilterPanel>
        <input placeholder="Search" />
      </ReportFilterPanel>,
    );
    await expect.element(screen.getByPlaceholder('Search')).toBeVisible();
  });
});

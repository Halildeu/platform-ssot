import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ReportFilterPanel } from '../ReportFilterPanel';

describe('ReportFilterPanel (Browser)', () => {
  it('renders submit and reset buttons', async () => {
    const screen = await render(
      <ReportFilterPanel onSubmit={() => {}} onReset={() => {}}>
        <input placeholder="Date from" />
      </ReportFilterPanel>,
    );
    await expect.element(screen.getByText('Filtrele')).toBeVisible();
    await expect.element(screen.getByText('Sifirla')).toBeVisible();
  });

  it('renders children inputs', async () => {
    const screen = await render(
      <ReportFilterPanel>
        <input placeholder="Search" />
      </ReportFilterPanel>,
    );
    await expect.element(screen.getByPlaceholder('Search')).toBeVisible();
  });

  it('calls onSubmit when submit button is clicked', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <ReportFilterPanel onSubmit={onSubmit}>
        <input placeholder="Filter" />
      </ReportFilterPanel>,
    );
    await screen.getByText('Filtrele').click();
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    const screen = await render(
      <ReportFilterPanel onReset={onReset}>
        <input placeholder="Filter" />
      </ReportFilterPanel>,
    );
    await screen.getByText('Sifirla').click();
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('renders custom button labels', async () => {
    const screen = await render(
      <ReportFilterPanel submitLabel="Apply" resetLabel="Clear" onReset={() => {}}>
        <input placeholder="Filter" />
      </ReportFilterPanel>,
    );
    await expect.element(screen.getByText('Apply')).toBeVisible();
    await expect.element(screen.getByText('Clear')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    await render(
      <ReportFilterPanel access="hidden">
        <input placeholder="Filter" />
      </ReportFilterPanel>,
    );
    expect(document.querySelector('form')).toBeNull();
  });

  it('renders form element', async () => {
    await render(
      <ReportFilterPanel><input placeholder="X" /></ReportFilterPanel>,
    );
    const form = document.querySelector('form');
    expect(form).not.toBeNull();
  });
});

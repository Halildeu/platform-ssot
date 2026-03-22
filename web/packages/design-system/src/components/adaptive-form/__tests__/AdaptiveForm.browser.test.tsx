import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AdaptiveForm } from '../AdaptiveForm';

const basicFields = [
  { key: 'name', type: 'text' as const, label: 'Name' },
  { key: 'age', type: 'number' as const, label: 'Age' },
];

describe('AdaptiveForm (Browser)', () => {
  it('renders form with fields and submit button', async () => {
    const screen = render(<AdaptiveForm fields={basicFields} />);
    await expect.element(screen.getByLabelText('Name')).toBeVisible();
    await expect.element(screen.getByText('Gonder')).toBeVisible();
  });

  it('renders all specified field types', async () => {
    const screen = render(
      <AdaptiveForm
        fields={[
          { key: 'name', type: 'text', label: 'Full Name' },
          { key: 'count', type: 'number', label: 'Count' },
          { key: 'notes', type: 'textarea', label: 'Notes' },
        ]}
      />,
    );
    await expect.element(screen.getByLabelText('Full Name')).toBeVisible();
    await expect.element(screen.getByLabelText('Count')).toBeVisible();
    await expect.element(screen.getByLabelText('Notes')).toBeVisible();
  });

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn();
    const screen = render(<AdaptiveForm fields={basicFields} onSubmit={onSubmit} />);
    await screen.getByText('Gonder').click();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('renders reset button when showReset is true', async () => {
    const screen = render(<AdaptiveForm fields={basicFields} showReset />);
    await expect.element(screen.getByText('Sifirla')).toBeVisible();
  });

  it('renders required field indicator', async () => {
    const screen = render(
      <AdaptiveForm fields={[{ key: 'email', type: 'text', label: 'Email', required: true }]} />,
    );
    await expect.element(screen.getByText('*')).toBeVisible();
  });

  it('disables form when access is disabled', async () => {
    const screen = render(<AdaptiveForm fields={basicFields} access="disabled" />);
    const el = screen.container.querySelector('[data-access-state="disabled"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<AdaptiveForm fields={basicFields} access="hidden" />);
    expect(screen.container.textContent).toBe('');
  });

  it('renders select field with options', async () => {
    const screen = render(
      <AdaptiveForm
        fields={[{
          key: 'color',
          type: 'select',
          label: 'Color',
          options: [{ label: 'Red', value: 'red' }, { label: 'Blue', value: 'blue' }],
        }]}
      />,
    );
    await expect.element(screen.getByLabelText('Color')).toBeVisible();
  });
});

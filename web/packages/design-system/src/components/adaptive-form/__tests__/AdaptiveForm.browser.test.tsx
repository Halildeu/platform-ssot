import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AdaptiveForm } from '../AdaptiveForm';

describe('AdaptiveForm (Browser)', () => {
  it('renders form with fields and submit button', async () => {
    const screen = render(
      <AdaptiveForm
        fields={[
          { key: 'name', type: 'text', label: 'Name' },
          { key: 'age', type: 'number', label: 'Age' },
        ]}
      />,
    );
    await expect.element(screen.getByLabelText('Name')).toBeVisible();
    await expect.element(screen.getByText('Gonder')).toBeVisible();
  });

  it('renders loading skeleton', async () => {
    const screen = render(
      <AdaptiveForm fields={[]} loading />,
    );
    await expect.element(screen.getByRole('generic', { busy: true })).toBeInTheDocument();
  });
});

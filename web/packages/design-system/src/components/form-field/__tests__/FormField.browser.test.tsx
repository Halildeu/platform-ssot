import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FormField } from '../FormField';

describe('FormField (Browser)', () => {
  it('renders label and children', async () => {
    const screen = render(
      <FormField label="Username">
        <input type="text" />
      </FormField>,
    );
    await expect.element(screen.getByText('Username')).toBeVisible();
  });

  it('shows error message', async () => {
    const screen = render(
      <FormField label="Email" error="Invalid email">
        <input type="text" />
      </FormField>,
    );
    await expect.element(screen.getByText('Invalid email')).toBeVisible();
  });
});

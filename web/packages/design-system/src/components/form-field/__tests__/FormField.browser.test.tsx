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

  it('shows required indicator', async () => {
    const screen = render(
      <FormField label="Name" required>
        <input type="text" />
      </FormField>,
    );
    await expect.element(screen.getByText('*')).toBeVisible();
  });

  it('shows optional indicator', async () => {
    const screen = render(
      <FormField label="Nickname" optional>
        <input type="text" />
      </FormField>,
    );
    await expect.element(screen.getByText('(optional)')).toBeVisible();
  });

  it('renders help text', async () => {
    const screen = render(
      <FormField label="Password" help="At least 8 characters">
        <input type="password" />
      </FormField>,
    );
    await expect.element(screen.getByText('At least 8 characters')).toBeVisible();
  });

  it('applies disabled styling', async () => {
    const screen = render(
      <FormField label="Disabled field" disabled>
        <input type="text" />
      </FormField>,
    );
    // The wrapper should have opacity for disabled state
    const wrapper = screen.container.firstElementChild;
    expect(wrapper?.className).toContain('opacity');
  });

  it('renders in horizontal layout', async () => {
    const screen = render(
      <FormField label="Field" horizontal>
        <input type="text" />
      </FormField>,
    );
    const wrapper = screen.container.firstElementChild;
    expect(wrapper?.className).toContain('flex');
  });

  it('connects label to input via htmlFor', async () => {
    const screen = render(
      <FormField label="Custom" htmlFor="my-input">
        <input type="text" id="my-input" />
      </FormField>,
    );
    const label = screen.container.querySelector('label');
    expect(label?.getAttribute('for')).toBe('my-input');
  });
});

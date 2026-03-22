import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Input } from '../Input';

describe('Input (Browser)', () => {
  it('renders with placeholder', async () => {
    const screen = render(<Input placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    await expect.element(input).toBeVisible();
  });

  it('types text in uncontrolled mode', async () => {
    const screen = render(<Input placeholder="Type here" />);
    const input = screen.getByRole('textbox');
    await input.fill('hello world');
    await expect.element(input).toHaveValue('hello world');
  });

  it('renders label and error message', async () => {
    const screen = render(
      <Input label="Email" error="Invalid email" />,
    );
    await expect.element(screen.getByText('Email')).toBeVisible();
    await expect.element(screen.getByText('Invalid email')).toBeVisible();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByRole('textbox');
    await expect.element(input).toBeDisabled();
  });
});

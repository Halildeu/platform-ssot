import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Radio, RadioGroup } from '../Radio';

describe('Radio (Browser)', () => {
  it('renders with label', async () => {
    const screen = render(<Radio label="Option A" value="a" />);
    await expect.element(screen.getByText('Option A')).toBeVisible();
  });

  it('selects radio in a group', async () => {
    const screen = render(
      <RadioGroup name="test" defaultValue="a">
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
      </RadioGroup>,
    );
    const radios = screen.container.querySelectorAll('input[type="radio"]');
    expect(radios).toHaveLength(2);
    await expect.element(screen.getByText('Option A')).toBeVisible();
    await expect.element(screen.getByText('Option B')).toBeVisible();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Radio label="Disabled" value="x" disabled />);
    const radio = screen.getByRole('radio');
    await expect.element(radio).toBeDisabled();
  });
});

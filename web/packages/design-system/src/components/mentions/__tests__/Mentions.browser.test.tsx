import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Mentions } from '../Mentions';

const options = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
  { key: 'charlie', label: 'Charlie' },
];

describe('Mentions (Browser)', () => {
  it('renders textarea with placeholder', async () => {
    await render(<Mentions options={options} placeholder="Type something..." />);
    await expect.element(page.getByPlaceholder('Type something...')).toBeVisible();
  });

  it('renders combobox wrapper', async () => {
    const screen = await render(<Mentions options={options} />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
  });

  it('shows suggestions when typing trigger character', async () => {
    const screen = await render(<Mentions options={options} />);
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    await textarea.focus();
    await userEvent.type(textarea, '@');
    await expect.element(screen.getByText('Alice')).toBeVisible();
    await expect.element(screen.getByText('Bob')).toBeVisible();
  });

  it('fires onSelect when a suggestion is clicked', async () => {
    const onSelect = vi.fn();
    const screen = await render(<Mentions options={options} onSelect={onSelect} />);
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    await textarea.focus();
    await userEvent.type(textarea, '@');
    await screen.getByText('Alice').click();
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'alice' }));
  });

  it('filters suggestions based on typed text', async () => {
    const screen = await render(<Mentions options={options} />);
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    await textarea.focus();
    await userEvent.type(textarea, '@bo');
    await expect.element(screen.getByText('Bob')).toBeVisible();
  });

  it('renders label when provided', async () => {
    const screen = await render(<Mentions options={options} label="Comment" />);
    await expect.element(screen.getByText('Comment')).toBeVisible();
  });

  it('renders default placeholder', async () => {
    await render(<Mentions options={options} />);
    const textarea = document.querySelector('textarea');
    expect(textarea?.getAttribute('placeholder')).toBe('Bir sey yazin...');
  });

  it('fires onValueChange when typing', async () => {
    const onValueChange = vi.fn();
    await render(<Mentions options={options} onValueChange={onValueChange} />);
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    await textarea.focus();
    await userEvent.type(textarea, 'Hello');
    expect(onValueChange).toHaveBeenCalled();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../Accordion';

const items = [
  { value: 'item-1', title: 'Section One', content: 'Content of section one' },
  { value: 'item-2', title: 'Section Two', content: 'Content of section two' },
  { value: 'item-3', title: 'Section Three', content: 'Content of section three' },
];

describe('Accordion (Browser)', () => {
  it('renders all section titles', async () => {
    const screen = render(<Accordion items={items} />);
    await expect.element(screen.getByText('Section One')).toBeVisible();
    await expect.element(screen.getByText('Section Two')).toBeVisible();
    await expect.element(screen.getByText('Section Three')).toBeVisible();
  });

  it('expands and collapses an item on click', async () => {
    const screen = render(<Accordion items={items} selectionMode="single" />);
    await screen.getByText('Section One').click();
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
  });
});

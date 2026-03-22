import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Pagination } from '../Pagination';

describe('Pagination (Browser)', () => {
  it('renders page buttons', async () => {
    const screen = render(<Pagination total={100} current={1} pageSize={10} />);
    await expect.element(screen.getByText('1')).toBeVisible();
    await expect.element(screen.getByText('2')).toBeVisible();
  });

  it('navigates to next page', async () => {
    let page = 1;
    const screen = render(
      <Pagination total={50} current={page} pageSize={10} onChange={(p) => { page = p; }} />,
    );
    await screen.getByLabelText('Next page').click();
    expect(page).toBe(2);
  });

  it('navigates to previous page', async () => {
    let page = 3;
    const screen = render(
      <Pagination total={50} current={page} pageSize={10} onChange={(p) => { page = p; }} />,
    );
    await screen.getByLabelText('Previous page').click();
    expect(page).toBe(2);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Pagination } from '../Pagination';

describe('Pagination (Browser)', () => {
  it('renders page buttons for given total', async () => {
    const screen = render(<Pagination total={50} current={1} pageSize={10} />);
    await expect.element(screen.getByText('1')).toBeVisible();
    await expect.element(screen.getByText('5')).toBeVisible();
  });

  it('navigates to next page on click', async () => {
    const onChange = vi.fn();
    const screen = render(
      <Pagination total={50} current={1} pageSize={10} onChange={onChange} />,
    );
    await screen.getByLabelText('Next page').click();
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('navigates to previous page on click', async () => {
    const onChange = vi.fn();
    const screen = render(
      <Pagination total={50} current={3} pageSize={10} onChange={onChange} />,
    );
    await screen.getByLabelText('Previous page').click();
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on first page', async () => {
    const screen = render(<Pagination total={50} current={1} pageSize={10} />);
    await expect.element(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables Next button on last page', async () => {
    const screen = render(<Pagination total={50} current={5} pageSize={10} />);
    await expect.element(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('marks current page with aria-current', async () => {
    const screen = render(<Pagination total={50} current={3} pageSize={10} />);
    const activeBtn = screen.getByText('3');
    await expect.element(activeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('fires onChange when clicking a specific page number', async () => {
    const onChange = vi.fn();
    const screen = render(
      <Pagination total={50} current={1} pageSize={10} onChange={onChange} />,
    );
    await screen.getByText('4').click();
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('renders navigation landmark with aria-label', async () => {
    const screen = render(<Pagination total={50} current={1} pageSize={10} />);
    const nav = screen.getByRole('navigation');
    await expect.element(nav).toHaveAttribute('aria-label', 'Pagination');
  });

  it('shows total count when showTotal is true', async () => {
    const screen = render(<Pagination total={100} current={1} pageSize={10} showTotal />);
    await expect.element(screen.getByText('100 items')).toBeVisible();
  });
});

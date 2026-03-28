import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { JsonViewer } from '../JsonViewer';

describe('JsonViewer (Browser)', () => {
  it('renders JSON tree with root label', async () => {
    const screen = await render(<JsonViewer value={{ name: 'Alice', age: 30 }} />);
    await expect.element(screen.getByText('payload')).toBeVisible();
  });

  it('renders primitive string values', async () => {
    const screen = await render(<JsonViewer value={{ greeting: 'hello' }} defaultExpandedDepth={2} />);
    await expect.element(screen.getByText('"hello"')).toBeVisible();
  });

  it('renders number values', async () => {
    const screen = await render(<JsonViewer value={{ count: 42 }} defaultExpandedDepth={2} />);
    await expect.element(screen.getByText('42')).toBeVisible();
  });

  it('renders custom root label', async () => {
    const screen = await render(<JsonViewer value={{ a: 1 }} rootLabel="data" />);
    await expect.element(screen.getByText('data')).toBeVisible();
  });

  it('expands nodes when clicked', async () => {
    const screen = await render(
      <JsonViewer value={{ nested: { deep: 'value' } }} defaultExpandedDepth={0} />,
    );
    // Initially collapsed - click to expand
    const expandBtns = document.querySelectorAll('button');
    if (expandBtns.length > 0) {
      (expandBtns[0] as HTMLElement).click();
    }
    // After expanding we should see nested content
    await expect.element(screen.getByText('nested')).toBeVisible();
  });

  it('renders array values', async () => {
    const screen = await render(<JsonViewer value={[1, 2, 3]} defaultExpandedDepth={2} />);
    expect(screen.container.textContent).toContain('1');
    expect(screen.container.textContent).toContain('2');
    expect(screen.container.textContent).toContain('3');
  });

  it('renders title and description', async () => {
    const screen = await render(
      <JsonViewer value={{ a: 1 }} title="Response" description="API response data" />,
    );
    expect(screen.container.textContent).toContain('Response');
    expect(screen.container.textContent).toContain('API response data');
  });

  it('shows type badges when showTypes is enabled', async () => {
    const screen = await render(
      <JsonViewer value={{ name: 'test' }} showTypes defaultExpandedDepth={2} />,
    );
    await expect.element(screen.getByText('string')).toBeVisible();
  });

  it('renders null values', async () => {
    const screen = await render(<JsonViewer value={{ empty: null }} defaultExpandedDepth={2} />);
    expect(screen.container.textContent).toContain('null');
  });
});

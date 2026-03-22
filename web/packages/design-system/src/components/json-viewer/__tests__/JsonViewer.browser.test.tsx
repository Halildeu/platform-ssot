import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { JsonViewer } from '../JsonViewer';

describe('JsonViewer (Browser)', () => {
  it('renders JSON tree with root label', async () => {
    const screen = render(<JsonViewer value={{ name: 'Alice', age: 30 }} />);
    await expect.element(screen.getByText('payload')).toBeVisible();
  });

  it('renders primitive values', async () => {
    const screen = render(<JsonViewer value={{ greeting: 'hello' }} defaultExpandedDepth={2} />);
    await expect.element(screen.getByText('"hello"')).toBeVisible();
  });
});

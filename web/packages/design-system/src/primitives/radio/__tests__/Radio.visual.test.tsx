import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Radio, RadioGroup } from '../Radio';

describe('Radio Visual Regression', () => {
  it('unchecked radio matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Radio label="Unchecked" value="a" name="visual" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('radio group matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <RadioGroup name="visual-group" defaultValue="b">
          <Radio label="Option A" value="a" />
          <Radio label="Option B" value="b" />
          <Radio label="Option C" value="c" />
        </RadioGroup>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});

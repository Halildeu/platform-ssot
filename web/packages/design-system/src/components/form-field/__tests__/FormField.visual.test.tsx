import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FormField } from '../FormField';

describe('FormField Visual Regression', () => {
  it('field with label and help matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <FormField label="Email" help="Enter your work email" required>
          <input type="text" placeholder="email@company.com" />
        </FormField>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});

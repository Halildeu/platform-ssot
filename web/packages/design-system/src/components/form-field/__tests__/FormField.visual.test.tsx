/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { FormField } from '../FormField';

describe('FormField Visual Regression', () => {
  it('field with label and help matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 320 }}>
        <FormField label="Email" help="Enter your work email" required>
          <input type="text" placeholder="email@company.com" />
        </FormField>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AdaptiveForm } from '../AdaptiveForm';

describe('AdaptiveForm Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <AdaptiveForm
          fields={[
            { key: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
            { key: 'email', type: 'text', label: 'Email', required: true },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

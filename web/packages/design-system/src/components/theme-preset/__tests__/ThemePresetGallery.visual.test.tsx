/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ThemePresetGallery } from '../ThemePresetGallery';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ThemePresetGallery Visual Regression', () => {
  it('gallery with presets matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 700 }}>
        <ThemePresetGallery
          presets={[
            { presetId: 'light', label: 'Light', themeMode: 'light', appearance: 'clean' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

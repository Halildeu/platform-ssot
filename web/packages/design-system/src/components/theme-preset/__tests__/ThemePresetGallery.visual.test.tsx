import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ThemePresetGallery } from '../ThemePresetGallery';

describe('ThemePresetGallery Visual Regression', () => {
  it('gallery with presets matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 700 }}>
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

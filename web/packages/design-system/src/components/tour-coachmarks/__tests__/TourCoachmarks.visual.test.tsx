/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TourCoachmarks } from '../TourCoachmarks';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Getting started guide.' },
  { id: 'feature', title: 'Feature', description: 'Key feature overview.' },
];

describe('TourCoachmarks Visual Regression', () => {
  it('open tour matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <TourCoachmarks steps={steps} defaultOpen />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

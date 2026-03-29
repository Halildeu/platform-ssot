 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TourCoachmarks } from '../TourCoachmarks';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Getting started guide.' },
  { id: 'feature', title: 'Feature', description: 'Key feature overview.' },
];

describe('TourCoachmarks Visual Regression', () => {
  it('open tour matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <TourCoachmarks steps={steps} defaultOpen />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Carousel } from '../Carousel';
import { LIGHT_BG_HEX, SLIDE_BG_1, SLIDE_BG_2 } from '../../../__tests__/visual-constants';

const slides = [
  { key: 's1', content: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: SLIDE_BG_1 }}>Slide 1</div> },
  { key: 's2', content: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: SLIDE_BG_2 }}>Slide 2</div> },
];

describe('Carousel Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Carousel items={slides} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

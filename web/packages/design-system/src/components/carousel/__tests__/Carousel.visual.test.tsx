import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Carousel } from '../Carousel';

const slides = [
  { key: 's1', content: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e5e7eb' }}>Slide 1</div> },
  { key: 's2', content: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#dbeafe' }}>Slide 2</div> },
];

describe('Carousel Visual Regression', () => {
  it('default state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Carousel items={slides} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

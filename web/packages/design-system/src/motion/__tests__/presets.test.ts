// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  presets,
  fadeIn,
  fadeInSlow,
  zoomIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleUp,
} from '../presets';
import type { AnimationPreset } from '../presets';

describe('animation presets', () => {
  const allPresets: [string, AnimationPreset][] = [
    ['fadeIn', fadeIn],
    ['fadeInSlow', fadeInSlow],
    ['zoomIn', zoomIn],
    ['slideUp', slideUp],
    ['slideDown', slideDown],
    ['slideLeft', slideLeft],
    ['slideRight', slideRight],
    ['scaleUp', scaleUp],
  ];

  it.each(allPresets)('%s has enter, exit, and duration', (name, preset) => {
    expect(preset.enter).toBeTypeOf('string');
    expect(preset.exit).toBeTypeOf('string');
    expect(preset.duration).toBeTypeOf('number');
    expect(preset.duration).toBeGreaterThan(0);
  });

  it.each(allPresets)('%s enter contains animate-in', (name, preset) => {
    expect(preset.enter).toContain('animate-in');
  });

  it.each(allPresets)('%s exit contains animate-out', (name, preset) => {
    expect(preset.exit).toContain('animate-out');
  });

  it('presets map contains all named presets', () => {
    expect(Object.keys(presets)).toEqual([
      'fadeIn', 'fadeInSlow', 'zoomIn', 'slideUp', 'slideDown',
      'slideLeft', 'slideRight', 'scaleUp',
    ]);
  });

  it('fadeIn has shorter duration than fadeInSlow', () => {
    expect(fadeIn.duration).toBeLessThan(fadeInSlow.duration);
  });
});

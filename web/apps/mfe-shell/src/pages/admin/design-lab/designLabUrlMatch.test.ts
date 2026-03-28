import { describe, expect, it } from 'vitest';
import {
  isDesignLabUrlTokenFlexibleMatch,
  isDesignLabUrlTokenMatch,
  normalizeDesignLabUrlToken,
} from './designLabUrlMatch';

describe('designLabUrlMatch', () => {
  it('normalizes tokenleri birbiriyle esitlestirir', () => {
    expect(isDesignLabUrlTokenMatch('Navigation Rail', 'navigation rail')).toBe(true);
    expect(isDesignLabUrlTokenMatch('Menu Bar / Navigation Rail', 'menu bar navigation rail')).toBe(true);
    expect(isDesignLabUrlTokenMatch('LinkInline', 'link inline')).toBe(false);
  });

  it('esnek token karsilasma ile bosluk ve baglantilari tolere eder', () => {
    expect(isDesignLabUrlTokenFlexibleMatch('NavigationRail', 'Navigation Rail')).toBe(true);
    expect(isDesignLabUrlTokenFlexibleMatch('MenuBar', 'Menu Bar')).toBe(true);
    expect(
      isDesignLabUrlTokenFlexibleMatch(
        'Menu Bar / Navigation Rail',
        decodeURIComponent('Menu+Bar+%2F+Navigation+Rail'),
      ),
    ).toBe(true);
    expect(isDesignLabUrlTokenFlexibleMatch('Link Inline', 'LinkInline')).toBe(true);
    expect(isDesignLabUrlTokenFlexibleMatch('Command Header', 'CommandHeader')).toBe(true);
  });

  it('uyumsuz tokenleri reddeder', () => {
    expect(isDesignLabUrlTokenFlexibleMatch('NavigationRail', 'MenuBar')).toBe(false);
    expect(normalizeDesignLabUrlToken('Menu Bar / Navigation Rail')).toBe('menu bar navigation rail');
  });
});

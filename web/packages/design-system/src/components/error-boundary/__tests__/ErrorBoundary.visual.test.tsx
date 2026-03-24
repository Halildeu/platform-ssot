/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ErrorBoundary } from '../ErrorBoundary';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const BadChild = () => {
  throw new Error('Visual test error');
};

describe('ErrorBoundary Visual Regression', () => {
  it('error fallback matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <ErrorBoundary>
          <BadChild />
        </ErrorBoundary>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

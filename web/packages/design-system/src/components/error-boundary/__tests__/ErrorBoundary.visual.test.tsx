import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ErrorBoundary } from '../ErrorBoundary';

const BadChild = () => {
  throw new Error('Visual test error');
};

describe('ErrorBoundary Visual Regression', () => {
  it('error fallback matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <ErrorBoundary>
          <BadChild />
        </ErrorBoundary>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});

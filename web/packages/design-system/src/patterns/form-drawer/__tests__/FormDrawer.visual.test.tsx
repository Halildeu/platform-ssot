import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FormDrawer } from '../FormDrawer';

describe('FormDrawer Visual Regression', () => {
  it('open drawer matches screenshot', async () => {
    const screen = render(
      <div style={{ width: 600, height: 400, position: 'relative' }}>
        <FormDrawer open onClose={() => {}} title="New Record" subtitle="Fill the form">
          <div>Form fields here</div>
        </FormDrawer>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});

// @vitest-environment jsdom
import { describe, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import { GridToolbar } from '../GridToolbar';

describe('GridToolbar — a11y', () => {
  it('has no a11y violations with minimal props', async () => {
    const { container } = render(
      <GridToolbar gridApi={null} theme="quartz" density="comfortable" />,
    );
    await expectNoA11yViolations(container);
  });

  it('has no a11y violations with density toggle', async () => {
    const { container } = render(
      <GridToolbar
        gridApi={null}
        theme="quartz"
        density="comfortable"
        onDensityChange={() => {}}
        onThemeChange={() => {}}
      />,
    );
    await expectNoA11yViolations(container);
  });
});

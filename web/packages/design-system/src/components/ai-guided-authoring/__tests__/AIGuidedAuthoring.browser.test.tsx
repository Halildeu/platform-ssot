import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';

describe('AIGuidedAuthoring (Browser)', () => {
  it('renders without crashing', async () => {
    const screen = render(<AIGuidedAuthoring />);
    await expect.element(screen.getByText('AI guided authoring')).toBeVisible();
  });

  it('renders with recommendations', async () => {
    const screen = render(
      <AIGuidedAuthoring
        recommendations={[
          { id: 'r1', title: 'Rec 1', summary: 'Summary 1' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Rec 1')).toBeVisible();
  });
});

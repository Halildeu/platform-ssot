import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('FormBuilder a11y', () => {
  it('FormSection has accessible expand/collapse', async () => {
    const { FormSection } = await import('../FormSection');
    const { container } = render(
      <FormSection section={{ id: 's1', title: 'Details', fields: [] }}>
        <div>content</div>
      </FormSection>
    );
    const header = container.querySelector('[role="button"]');
    expect(header).toBeTruthy();
    expect(header?.getAttribute('aria-expanded')).toBeTruthy();
  });
});

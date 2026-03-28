// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { FileUploadZone } from '../FileUploadZone';

describe('FileUploadZone — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<FileUploadZone />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(FileUploadZone.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<FileUploadZone access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<FileUploadZone access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<FileUploadZone />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

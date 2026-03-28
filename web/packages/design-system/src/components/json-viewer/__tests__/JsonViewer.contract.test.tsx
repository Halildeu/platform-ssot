// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { JsonViewer } from '../JsonViewer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('JsonViewer contract', () => {
  it('has displayName', () => {
    expect(JsonViewer.displayName).toBe('JsonViewer');
  });

  it('renders with a simple value', () => {
    const { container } = render(<JsonViewer value={{ name: 'test' }} />);
    expect(container.querySelector('[data-component="json-viewer"]')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<JsonViewer value={{ a: 1 }} title="JSON Data" description="Payload details" />);
    expect(screen.getByText('JSON Data')).toBeInTheDocument();
    expect(screen.getByText('Payload details')).toBeInTheDocument();
  });

  it('renders root label', () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="data" />);
    expect(screen.getByText('data')).toBeInTheDocument();
  });

  it('renders string values with quotes', () => {
    render(<JsonViewer value="hello" />);
    expect(screen.getByText('"hello"')).toBeInTheDocument();
  });

  it('renders null values', () => {
    render(<JsonViewer value={null} />);
    expect(screen.getAllByText('null').length).toBeGreaterThanOrEqual(1);
  });

  it('renders empty state when value is undefined', () => {
    const { container } = render(<JsonViewer value={undefined} />);
    expect(container.querySelector('[data-component="json-viewer"]')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<JsonViewer value={42} access="readonly" />);
    expect(container.querySelector('[data-access-state="readonly"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<JsonViewer value={42} access="hidden" />);
    expect(container.querySelector('[data-component="json-viewer"]')).not.toBeInTheDocument();
  });
});

describe('JsonViewer — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<JsonViewer value={{ key: 'value' }} title="Test JSON" />);
    await expectNoA11yViolations(container);
  });
});

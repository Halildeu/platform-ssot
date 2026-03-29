// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import JsonPreview from './JsonPreview';

// Minimal mock for @testing-library/react's peer dep on react-dom
vi.mock('@mfe/design-system', () => ({}));

afterEach(() => { cleanup(); });

describe('JsonPreview', () => {
  it('renders a JSON object as pretty-printed string', () => {
    const data = { name: 'test', count: 42 };
    render(<JsonPreview data={data} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe(JSON.stringify(data, null, 2));
  });

  it('renders an array as pretty-printed string', () => {
    const data = [1, 2, 3];
    render(<JsonPreview data={data} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe(JSON.stringify(data, null, 2));
  });

  it('renders null as the string "null"', () => {
    render(<JsonPreview data={null} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('null');
  });

  it('renders undefined as the string "undefined"', () => {
    render(<JsonPreview data={undefined} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('undefined');
  });

  it('renders a string value with quotes', () => {
    render(<JsonPreview data="hello" />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('"hello"');
  });

  it('renders a number', () => {
    render(<JsonPreview data={99} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('99');
  });

  it('renders a boolean', () => {
    render(<JsonPreview data={true} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('true');
  });

  it('renders an empty object', () => {
    render(<JsonPreview data={{}} />);
    const pre = screen.getByRole('region');
    expect(pre.textContent).toBe('{}');
  });

  it('has aria-live="polite" attribute', () => {
    render(<JsonPreview data={{}} />);
    const pre = screen.getByRole('region');
    expect(pre.getAttribute('aria-live')).toBe('polite');
  });

  it('applies json-preview class', () => {
    render(<JsonPreview data="test" />);
    const pre = screen.getByRole('region');
    expect(pre.className).toContain('json-preview');
  });
});

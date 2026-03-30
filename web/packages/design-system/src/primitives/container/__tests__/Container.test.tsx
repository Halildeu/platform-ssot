// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Container } from '../Container';

afterEach(() => { cleanup(); });

describe('Container — temel render', () => {
  it('container render eder', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('varsayilan maxWidth "xl" dir', () => {
    const { container } = render(<Container>A</Container>);
    expect(container.querySelector('.max-w-screen-xl')).toBeInTheDocument();
  });
  it('centered mx-auto uygular', () => {
    const { container } = render(<Container>A</Container>);
    expect(container.querySelector('.mx-auto')).toBeInTheDocument();
  });
  it('padding responsive class uygular', () => {
    const { container } = render(<Container>A</Container>);
    expect(container.firstElementChild?.className).toContain('px-4');
  });
  it('fluid modda max-width olmaz', () => {
    const { container } = render(<Container fluid>A</Container>);
    expect(container.querySelector('.max-w-screen-xl')).toBeNull();
  });
  it('padding=false padding kaldırır', () => {
    const { container } = render(<Container padding={false}>A</Container>);
    expect(container.firstElementChild?.className).not.toContain('px-4');
  });
});

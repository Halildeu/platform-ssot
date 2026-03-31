// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Flex } from '../Flex';

afterEach(() => { cleanup(); });

describe('Flex — temel render', () => {
  it('flex container render eder', () => {
    render(<Flex>Content</Flex>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('varsayilan display flex dir', () => {
    const { container } = render(<Flex>A</Flex>);
    expect(container.firstElementChild?.className).toContain('flex');
  });
  it('inline-flex destekler', () => {
    const { container } = render(<Flex inline>A</Flex>);
    expect(container.firstElementChild?.className).toContain('inline-flex');
  });
  it('direction column uygular', () => {
    const { container } = render(<Flex direction="column">A</Flex>);
    expect(container.firstElementChild?.className).toContain('flex-col');
  });
  it('gap uygular', () => {
    const { container } = render(<Flex gap={4}>A</Flex>);
    expect(container.firstElementChild?.className).toContain('gap-4');
  });
  it('wrap destekler', () => {
    const { container } = render(<Flex wrap>A</Flex>);
    expect(container.firstElementChild?.className).toContain('flex-wrap');
  });
  it('align ve justify birlikte calisir', () => {
    const { container } = render(<Flex align="center" justify="between">A</Flex>);
    const cls = container.firstElementChild?.className ?? '';
    expect(cls).toContain('items-center');
    expect(cls).toContain('justify-between');
  });
});

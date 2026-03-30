// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Image } from '../Image';

afterEach(() => { cleanup(); });

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', class {
  observe() {} unobserve() {} disconnect() {}
  constructor(cb: IntersectionObserverCallback) { cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
});

describe('Image — temel render', () => {
  it('img element render eder', () => {
    render(<Image src="/test.jpg" alt="Test" />);
    expect(screen.getByAlt('Test')).toBeInTheDocument();
  });
  it('data-component attribute ekler', () => {
    const { container } = render(<Image src="/test.jpg" alt="Test" />);
    expect(container.querySelector('[data-component="image"]')).toBeInTheDocument();
  });
});

describe('Image — fallback', () => {
  it('hata durumunda fallback kullanir', () => {
    render(<Image src="/broken.jpg" fallback="/fallback.jpg" alt="Fallback" />);
    const img = screen.getByAlt('Fallback');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/fallback.jpg');
  });
});

describe('Image — preview', () => {
  it('preview=true ile tiklanabilir', () => {
    const { container } = render(<Image src="/test.jpg" preview alt="Preview" />);
    expect(container.querySelector('.cursor-pointer')).toBeInTheDocument();
  });
});

describe('Image.Group', () => {
  it('grup container render eder', () => {
    const { container } = render(
      <Image.Group>
        <Image src="/1.jpg" alt="1" />
        <Image src="/2.jpg" alt="2" />
      </Image.Group>
    );
    expect(container.querySelector('[data-component="image-group"]')).toBeInTheDocument();
  });
});

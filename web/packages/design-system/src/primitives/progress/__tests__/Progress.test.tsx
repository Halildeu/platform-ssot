// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Progress } from '../Progress';

afterEach(() => { cleanup(); });

describe('Progress — temel render', () => {
  it('progressbar role render eder', () => {
    render(<Progress percent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  it('aria-valuenow dogru set eder', () => {
    render(<Progress percent={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });
  it('yuzde metni gosterir', () => {
    render(<Progress percent={42} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
  it('showInfo=false yuzde gizler', () => {
    render(<Progress percent={42} showInfo={false} />);
    expect(screen.queryByText('42%')).not.toBeInTheDocument();
  });
  it('100% de otomatik success olur', () => {
    const { container } = render(<Progress percent={100} />);
    expect(container.querySelector('svg')).toBeInTheDocument(); // check icon
  });
});

describe('Progress — circle', () => {
  it('circle tipinde SVG render eder', () => {
    const { container } = render(<Progress type="circle" percent={60} />);
    expect(container.querySelector('svg circle')).toBeInTheDocument();
  });
});

describe('Progress — steps', () => {
  it('dogru segment sayisi olusturur', () => {
    const { container } = render(<Progress percent={60} steps={5} />);
    const segments = container.querySelectorAll('.flex-1.rounded-full');
    expect(segments.length).toBe(5);
  });
});

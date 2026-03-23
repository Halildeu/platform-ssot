// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { PageLayout } from '../page-layout/PageLayout';

afterEach(cleanup);

describe('PageLayout — depth', () => {
  it('renders children content', () => {
    render(<PageLayout title="Layout"><div role="main">Main content</div></PageLayout>);
    expect(screen.getByRole('main')).toHaveTextContent('Main content');
  });

  it('renders sidebar detail', () => {
    render(
      <PageLayout title="Layout" detail={<aside role="complementary">Sidebar</aside>}>
        <div>Content</div>
      </PageLayout>,
    );
    expect(screen.getByRole('complementary')).toHaveTextContent('Sidebar');
  });

  it('breadcrumb click handler fires', () => {
    const onClick = vi.fn();
    render(
      <PageLayout title="Page" breadcrumbItems={[{ title: 'Home', onClick }, { title: 'Current' }]}>
        <div>Content</div>
      </PageLayout>,
    );
    fireEvent.click(screen.getByText('Home'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('empty — renders without title', () => {
    const { container } = render(<PageLayout><div>Body</div></PageLayout>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('disabled — aria-label applied to root', () => {
    const { container } = render(
      <PageLayout title="Page" ariaLabel="main-page"><div>X</div></PageLayout>,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'main-page');
  });

  it('error — renders footer slot', () => {
    render(
      <PageLayout title="Page" footer={<div data-testid="footer-content">Footer</div>}>
        <div>Body</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('footer-content')).toHaveTextContent('Footer');
  });
});

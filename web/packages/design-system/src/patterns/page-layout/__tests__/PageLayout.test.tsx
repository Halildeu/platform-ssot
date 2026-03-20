// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import {
  PageLayout,
  createPageLayoutPreset,
  createPageLayoutBreadcrumbItems,
} from '../PageLayout';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('PageLayout — temel render', () => {
  it('children render eder', () => {
    render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('title gosterir', () => {
    render(<PageLayout title="My Page" />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('description gosterir', () => {
    render(<PageLayout title="My Page" description="Page desc" />);
    expect(screen.getByText('Page desc')).toBeInTheDocument();
  });

  it('title yoksa header render etmez', () => {
    const { container } = render(
      <PageLayout>
        <p>Content</p>
      </PageLayout>,
    );
    expect(container.querySelector('header')).toBeNull();
  });

  it('title varsa header render eder', () => {
    const { container } = render(<PageLayout title="Page" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Breadcrumb                                                         */
/* ------------------------------------------------------------------ */

describe('PageLayout — breadcrumb', () => {
  it('breadcrumbItems verildiginde nav render eder', () => {
    render(
      <PageLayout
        title="Page"
        breadcrumbItems={[
          { title: 'Home', path: '/' },
          { title: 'Current' },
        ]}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('breadcrumbAriaLabel nav aria-label olarak atanir', () => {
    render(
      <PageLayout
        title="Page"
        breadcrumbItems={[{ title: 'Home' }]}
        breadcrumbAriaLabel="Site navigation"
      />,
    );
    expect(screen.getByLabelText('Site navigation')).toBeInTheDocument();
  });

  it('varsayilan breadcrumb aria-label "Breadcrumb" dir', () => {
    render(
      <PageLayout
        title="Page"
        breadcrumbItems={[{ title: 'Home' }]}
      />,
    );
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('son breadcrumb item aria-current="page" alir', () => {
    render(
      <PageLayout
        title="Page"
        breadcrumbItems={[
          { title: 'Home', path: '/' },
          { title: 'Current' },
        ]}
      />,
    );
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
  });

  it('breadcrumb onClick handler calisir', async () => {
    const onClick = vi.fn();
    render(
      <PageLayout
        title="Page"
        breadcrumbItems={[
          { title: 'Home', onClick },
          { title: 'Current' },
        ]}
      />,
    );
    await userEvent.click(screen.getByText('Home'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Slots                                                              */
/* ------------------------------------------------------------------ */

describe('PageLayout — slots', () => {
  it('actions render eder', () => {
    render(
      <PageLayout title="Page" actions={<button>Action</button>} />,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('headerExtra render eder', () => {
    render(
      <PageLayout
        title="Page"
        headerExtra={<div>Extra content</div>}
      />,
    );
    expect(screen.getByText('Extra content')).toBeInTheDocument();
  });

  it('secondaryNav render eder', () => {
    render(
      <PageLayout title="Page" secondaryNav={<nav>Nav</nav>} />,
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
  });

  it('filterBar render eder', () => {
    render(
      <PageLayout title="Page" filterBar={<div>Filters</div>} />,
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('contentHeader render eder', () => {
    render(
      <PageLayout title="Page" contentHeader={<div>Content Header</div>} />,
    );
    expect(screen.getByText('Content Header')).toBeInTheDocument();
  });

  it('contentToolbar render eder', () => {
    render(
      <PageLayout title="Page" contentToolbar={<div>Toolbar</div>} />,
    );
    expect(screen.getByText('Toolbar')).toBeInTheDocument();
  });

  it('footer render eder', () => {
    const { container } = render(
      <PageLayout title="Page" footer={<div>Footer</div>} />,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('detail panel render eder', () => {
    render(
      <PageLayout title="Page" detail={<div>Detail panel</div>}>
        <p>Main</p>
      </PageLayout>,
    );
    expect(screen.getByText('Detail panel')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Page width                                                         */
/* ------------------------------------------------------------------ */

describe('PageLayout — pageWidth', () => {
  it('varsayilan pageWidth "default" dir (max-w-5xl)', () => {
    const { container } = render(<PageLayout title="Page" />);
    expect(container.querySelector('.max-w-5xl')).toBeInTheDocument();
  });

  it('pageWidth="wide" durumunda max-w-7xl uygular', () => {
    const { container } = render(<PageLayout title="Page" pageWidth="wide" />);
    expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Sticky header                                                      */
/* ------------------------------------------------------------------ */

describe('PageLayout — stickyHeader', () => {
  it('stickyHeader=true durumunda sticky class uygular', () => {
    const { container } = render(<PageLayout title="Page" stickyHeader />);
    const header = container.querySelector('header');
    expect(header?.className).toContain('sticky');
  });

  it('varsayilan stickyHeader=false (sticky class yok)', () => {
    const { container } = render(<PageLayout title="Page" />);
    const header = container.querySelector('header');
    expect(header?.className).not.toContain('sticky');
  });
});

/* ------------------------------------------------------------------ */
/*  ariaLabel                                                          */
/* ------------------------------------------------------------------ */

describe('PageLayout — a11y', () => {
  it('ariaLabel root div aria-label olarak atanir', () => {
    render(<PageLayout title="Page" ariaLabel="Main page" />);
    expect(screen.getByLabelText('Main page')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  createPageLayoutPreset                                             */
/* ------------------------------------------------------------------ */

describe('createPageLayoutPreset', () => {
  it('content-only preset dogru degerler dondurur', () => {
    const result = createPageLayoutPreset({ preset: 'content-only' });
    expect(result.pageWidth).toBe('default');
    expect(result.stickyHeader).toBe(false);
    expect(result.responsiveDetailCollapse).toBe(false);
  });

  it('detail-sidebar preset dogru degerler dondurur', () => {
    const result = createPageLayoutPreset({ preset: 'detail-sidebar' });
    expect(result.pageWidth).toBe('full');
    expect(result.stickyHeader).toBe(false);
    expect(result.responsiveDetailCollapse).toBe(true);
    expect(result.responsiveDetailBreakpoint).toBe('md');
  });

  it('ops-workspace preset dogru degerler dondurur', () => {
    const result = createPageLayoutPreset({ preset: 'ops-workspace' });
    expect(result.pageWidth).toBe('full');
    expect(result.stickyHeader).toBe(true);
    expect(result.responsiveDetailCollapse).toBe(true);
    expect(result.responsiveDetailBreakpoint).toBe('lg');
    expect(result.currentBreadcrumbMode).toBe('link');
  });

  it('custom pageWidth override calisir', () => {
    const result = createPageLayoutPreset({
      preset: 'content-only',
      pageWidth: 'wide',
    });
    expect(result.pageWidth).toBe('wide');
  });
});

/* ------------------------------------------------------------------ */
/*  createPageLayoutBreadcrumbItems                                    */
/* ------------------------------------------------------------------ */

describe('createPageLayoutBreadcrumbItems', () => {
  it('string inputlari dogru sekilde donusturur', () => {
    const result = createPageLayoutBreadcrumbItems(['Home', 'Products', 'Detail']);
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('Home');
    expect(result[2].current).toBe(true);
    expect(result[0].current).toBe(false);
  });

  it('object inputlari dogru sekilde donusturur', () => {
    const result = createPageLayoutBreadcrumbItems([
      { label: 'Home', href: '/' },
      { title: 'Products', path: '/products' },
    ]);
    expect(result[0].title).toBe('Home');
    expect(result[0].path).toBe('/');
    expect(result[1].title).toBe('Products');
    expect(result[1].path).toBe('/products');
  });

  it('explicit current olan item korunur', () => {
    const result = createPageLayoutBreadcrumbItems([
      { title: 'Home', current: true },
      { title: 'Other' },
    ]);
    expect(result[0].current).toBe(true);
    expect(result[1].current).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('PageLayout — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <PageLayout title="Page" className="custom-pl" />,
    );
    expect(container.firstElementChild?.className).toContain('custom-pl');
  });

  it('style prop forwarding calisir', () => {
    const { container } = render(
      <PageLayout title="Page" style={{ maxWidth: 800 }} />,
    );
    expect(container.firstElementChild).toHaveStyle({ maxWidth: '800px' });
  });
});

describe('PageLayout — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PageLayout title="My Page" />);
    await expectNoA11yViolations(container);
  });
});

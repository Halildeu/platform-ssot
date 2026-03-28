import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DesignLabPaginationGhostMobileShowcase } from './DesignLabPaginationGhostMobileShowcase';
import { DesignLabPaginationReadonlyShowcase } from './DesignLabPaginationReadonlyShowcase';
import { DesignLabPaginationSimplePillShowcase } from './DesignLabPaginationSimplePillShowcase';
import { DesignLabPaginationServerDefaultShowcase } from './DesignLabPaginationServerDefaultShowcase';
import { DesignLabPaginationServerDenseShowcase } from './DesignLabPaginationServerDenseShowcase';
import { DesignLabPaginationServerNoInfoShowcase } from './DesignLabPaginationServerNoInfoShowcase';
import { DesignLabPaginationUnknownTotalStreamShowcase } from './DesignLabPaginationUnknownTotalStreamShowcase';
import { DesignLabPaginationClientDefaultShowcase } from './DesignLabPaginationClientDefaultShowcase';
import { DesignLabPaginationEllipsisTightShowcase } from './DesignLabPaginationEllipsisTightShowcase';
import { DesignLabPaginationDisabledShowcase } from './DesignLabPaginationDisabledShowcase';
import type { DesignLabPaginationLocaleText } from './paginationShared';

const createLocaleText = (): DesignLabPaginationLocaleText => ({
  navigationLabel: 'Sayfalama',
  previousButtonLabel: 'Geri-Ozel',
  nextButtonLabel: 'Ileri-Ozel',
  previousPageAriaLabel: 'Onceki sayfaya git',
  nextPageAriaLabel: 'Sonraki sayfaya git',
  pageAriaLabel: (page) => `Sayfa ${page}`,
  pageIndicatorLabel: (currentPage, pageCount) => `Durum ${currentPage} / ${pageCount}`,
  simpleIndicatorLabel: (currentPage, pageCount) => `Basit ${currentPage} / ${pageCount}`,
  totalItemsLabel: (count) => `${count} kayit`,
  modeLabel: (mode) => (mode === 'server' ? 'Sunucu modu' : 'Istemci modu'),
  rowsPerPageLabel: 'Satir sayisi',
  rangeLabel: (start, end, total) => `Aralik ${start}-${end} / ${total}`,
  firstButtonLabel: 'Ilk-Ozel',
  lastButtonLabel: 'Son-Ozel',
});

afterEach(() => {
  cleanup();
});

describe('pagination showcases', () => {
  it('server default varyanti locale text ile table footer metinlerini gosterir', () => {
    render(<DesignLabPaginationServerDefaultShowcase localeText={createLocaleText()} />);

    expect(screen.getByText('Satir sayisi')).toBeInTheDocument();
    expect(screen.getByText('Aralik 101-120 / 248')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Geri-Ozel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ileri-Ozel' })).toBeInTheDocument();
  });

  it('dense rail varyanti locale text ile first last ve page indicator kullanir', () => {
    render(<DesignLabPaginationServerDenseShowcase localeText={createLocaleText()} />);

    expect(screen.getByRole('button', { name: 'Ilk-Ozel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Geri-Ozel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ileri-Ozel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Son-Ozel' })).toBeInTheDocument();
    expect(screen.getByText('Durum 4 / 12')).toBeInTheDocument();
  });

  it('no-info varyanti dahili page info satirini render etmez', () => {
    render(<DesignLabPaginationServerNoInfoShowcase localeText={createLocaleText()} />);

    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    expect(screen.queryByText('Durum 3 / 8')).not.toBeInTheDocument();
  });

  it('readonly varyanti pagination butonlarini render eder', () => {
    render(<DesignLabPaginationReadonlyShowcase localeText={createLocaleText()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('simple pill varyanti pagination kontrollerini render eder', () => {
    render(<DesignLabPaginationSimplePillShowcase localeText={createLocaleText()} />);

    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('unknown total varyanti daha fazlasi etiketini gosterir ve ghost mobile varyanti render olur', () => {
    render(
      <>
        <DesignLabPaginationUnknownTotalStreamShowcase localeText={createLocaleText()} />
        <DesignLabPaginationGhostMobileShowcase localeText={createLocaleText()} />
      </>,
    );

    expect(screen.getByText('121-160 / daha fazlasi')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Pagination').length).toBeGreaterThan(0);
  });

  it('client default varyanti pagination kontrollerini render eder', () => {
    render(<DesignLabPaginationClientDefaultShowcase localeText={createLocaleText()} />);

    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('ellipsis tight varyanti pagination ve ellipsis render eder', () => {
    render(<DesignLabPaginationEllipsisTightShowcase localeText={createLocaleText()} />);

    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('disabled varyanti iki pagination instance render eder', () => {
    render(<DesignLabPaginationDisabledShowcase localeText={createLocaleText()} />);

    const paginationNavs = screen.getAllByLabelText('Pagination');
    expect(paginationNavs.length).toBe(2);
  });
});

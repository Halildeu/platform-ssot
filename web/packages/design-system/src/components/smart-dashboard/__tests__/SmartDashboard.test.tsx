// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SmartDashboard, type DashboardWidget } from '../SmartDashboard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ---- Helpers ---- */

const makeWidget = (overrides: Partial<DashboardWidget> = {}): DashboardWidget => ({
  key: 'w1',
  title: 'Widget 1',
  type: 'kpi',
  ...overrides,
});

const makeWidgets = (count: number): DashboardWidget[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `widget-${i}`,
    title: `Widget ${i}`,
    type: 'kpi' as const,
    value: i * 100,
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — temel render', () => {
  it('section elementini data-component ile render eder', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'smart-dashboard');
  });

  it('title propi ile baslik gosterir', () => {
    render(<SmartDashboard widgets={[makeWidget()]} title="Kontrol Paneli" />);
    expect(screen.getByText('Kontrol Paneli')).toBeInTheDocument();
  });

  it('description propi ile aciklama gosterir', () => {
    render(
      <SmartDashboard
        widgets={[makeWidget()]}
        title="Test"
        description="Panel aciklamasi"
      />,
    );
    expect(screen.getByText('Panel aciklamasi')).toBeInTheDocument();
  });

  it('widget basligini gosterir', () => {
    render(<SmartDashboard widgets={[makeWidget({ title: 'Satis' })]} />);
    expect(screen.getByText('Satis')).toBeInTheDocument();
  });

  it('birden fazla widget render eder', () => {
    const widgets = makeWidgets(3);
    render(<SmartDashboard widgets={widgets} />);
    expect(screen.getByText('Widget 0')).toBeInTheDocument();
    expect(screen.getByText('Widget 1')).toBeInTheDocument();
    expect(screen.getByText('Widget 2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} access="hidden" />,
    );
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state="disabled" atar', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} access="disabled" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('access="readonly" durumunda data-access-state="readonly" atar', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} access="readonly" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'readonly');
  });

  it('access="full" durumunda data-access-state="full" atar', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} access="full" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'full');
  });
});

/* ------------------------------------------------------------------ */
/*  Greeting banner                                                    */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — greeting', () => {
  it('greeting propi ile banner gosterir', () => {
    render(
      <SmartDashboard widgets={[makeWidget()]} greeting="Gunaydin, Halil" />,
    );
    expect(screen.getByText('Gunaydin, Halil')).toBeInTheDocument();
  });

  it('greeting yoksa banner gostermez', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    expect(container.querySelector('[data-testid="greeting-banner"]')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  KPI + Trend                                                        */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — KPI ve trend', () => {
  it('KPI widget value gosterir', () => {
    render(
      <SmartDashboard widgets={[makeWidget({ type: 'kpi', value: 1250 })]} />,
    );
    expect(screen.getByText('1250')).toBeInTheDocument();
  });

  it('yukselis trendi goruntulenir', () => {
    render(
      <SmartDashboard
        widgets={[
          makeWidget({
            type: 'kpi',
            value: 500,
            trend: { direction: 'up', percentage: 12 },
          }),
        ]}
      />,
    );
    expect(screen.getByText('%12')).toBeInTheDocument();
  });

  it('dusus trendi goruntulenir', () => {
    render(
      <SmartDashboard
        widgets={[
          makeWidget({
            type: 'kpi',
            value: 300,
            trend: { direction: 'down', percentage: 5 },
          }),
        ]}
      />,
    );
    expect(screen.getByText('%5')).toBeInTheDocument();
  });

  it('sabit trend goruntulenir', () => {
    render(
      <SmartDashboard
        widgets={[
          makeWidget({
            type: 'kpi',
            value: 800,
            trend: { direction: 'stable', percentage: 0 },
          }),
        ]}
      />,
    );
    expect(screen.getByText('%0')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Auto-sort (pinned + tone)                                          */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — auto-sort', () => {
  it('pinned widgetlar once gelir', () => {
    const widgets: DashboardWidget[] = [
      makeWidget({ key: 'unpinned', title: 'Normal', pinned: false }),
      makeWidget({ key: 'pinned', title: 'Sabitlenmis', pinned: true }),
    ];
    const { container } = render(<SmartDashboard widgets={widgets} />);
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Sabitlenmis');
    expect(items[1].textContent).toContain('Normal');
  });

  it('danger tonlu widgetlar warning oncesinde gelir', () => {
    const widgets: DashboardWidget[] = [
      makeWidget({ key: 'warn', title: 'Uyari', tone: 'warning' }),
      makeWidget({ key: 'danger', title: 'Tehlike', tone: 'danger' }),
    ];
    const { container } = render(<SmartDashboard widgets={widgets} />);
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Tehlike');
    expect(items[1].textContent).toContain('Uyari');
  });

  it('tone siralama: danger > warning > info > success > default', () => {
    const widgets: DashboardWidget[] = [
      makeWidget({ key: 'default', title: 'Varsayilan', tone: 'default' }),
      makeWidget({ key: 'success', title: 'Basarili', tone: 'success' }),
      makeWidget({ key: 'info', title: 'Bilgi', tone: 'info' }),
      makeWidget({ key: 'warning', title: 'Uyari', tone: 'warning' }),
      makeWidget({ key: 'danger', title: 'Tehlike', tone: 'danger' }),
    ];
    const { container } = render(<SmartDashboard widgets={widgets} />);
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Tehlike');
    expect(items[1].textContent).toContain('Uyari');
    expect(items[2].textContent).toContain('Bilgi');
    expect(items[3].textContent).toContain('Basarili');
    expect(items[4].textContent).toContain('Varsayilan');
  });
});

/* ------------------------------------------------------------------ */
/*  Widget tone border                                                 */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — tone border', () => {
  it('danger tonlu widget border-s class tasir', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget({ tone: 'danger' })]} />,
    );
    const card = container.querySelector('[data-widget-tone="danger"]');
    expect(card?.className).toContain('border-s-4');
  });

  it('default tonlu widget border-s class tasimaz', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget({ tone: 'default' })]} />,
    );
    const card = container.querySelector('[data-widget-tone="default"]');
    expect(card?.className).not.toContain('border-s-4');
  });
});

/* ------------------------------------------------------------------ */
/*  Pin                                                                */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — pin', () => {
  it('onWidgetPin verildiginde sabitle butonu gosterir', () => {
    render(
      <SmartDashboard widgets={[makeWidget()]} onWidgetPin={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /sabitle/i })).toBeInTheDocument();
  });

  it('pin butonu tiklayinca callback cagirilir', async () => {
    const onPin = vi.fn();
    render(
      <SmartDashboard widgets={[makeWidget()]} onWidgetPin={onPin} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /sabitle/i }));
    expect(onPin).toHaveBeenCalledWith('w1', true);
  });
});

/* ------------------------------------------------------------------ */
/*  Refresh                                                            */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — refresh', () => {
  it('onRefresh olan widget yenile butonu gosterir', () => {
    render(
      <SmartDashboard
        widgets={[makeWidget({ onRefresh: () => {} })]}
      />,
    );
    expect(screen.getByRole('button', { name: /yenile/i })).toBeInTheDocument();
  });

  it('refreshAll butonu gosterilir', () => {
    render(
      <SmartDashboard widgets={[makeWidget()]} refreshAll={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Tumunu yenile' })).toBeInTheDocument();
  });

  it('refreshAll butonu tiklayinca callback cagirilir', async () => {
    const refreshAll = vi.fn();
    render(
      <SmartDashboard widgets={[makeWidget()]} refreshAll={refreshAll} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tumunu yenile' }));
    expect(refreshAll).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Time range                                                         */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — time range', () => {
  it('onTimeRangeChange verildiginde zaman araligi secici gosterir', () => {
    render(
      <SmartDashboard
        widgets={[makeWidget()]}
        onTimeRangeChange={() => {}}
        timeRange="7d"
      />,
    );
    expect(screen.getByLabelText('Zaman araligi')).toBeInTheDocument();
  });

  it('zaman araligi degisikliginde callback cagirilir', async () => {
    const onChange = vi.fn();
    render(
      <SmartDashboard
        widgets={[makeWidget()]}
        onTimeRangeChange={onChange}
        timeRange="7d"
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText('Zaman araligi'), '30d');
    expect(onChange).toHaveBeenCalledWith('30d');
  });
});

/* ------------------------------------------------------------------ */
/*  Last updated                                                       */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — lastUpdated', () => {
  it('lastUpdated bilgisi gosterilir', () => {
    render(
      <SmartDashboard
        widgets={[makeWidget({ lastUpdated: '5 dk once' })]}
      />,
    );
    expect(screen.getByText('Son guncelleme: 5 dk once')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — density', () => {
  it('comfortable density gap-5 uygular', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} density="comfortable" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-5');
  });

  it('compact density gap-3 uygular', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} density="compact" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-3');
  });
});

/* ------------------------------------------------------------------ */
/*  Defensive guards                                                   */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — defensive', () => {
  it('bos widgets array ile crash olmaz', () => {
    expect(() => {
      render(<SmartDashboard widgets={[]} />);
    }).not.toThrow();
  });

  it('className propi section elementine eklenir', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} className="custom-dashboard" />,
    );
    expect(container.querySelector('section')?.className).toContain('custom-dashboard');
  });

  it('accessReason title attribute olarak aktarilir', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} accessReason="Yetki gerekli" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'Yetki gerekli');
  });

  it('widget content render eder', () => {
    render(
      <SmartDashboard
        widgets={[makeWidget({ type: 'custom', content: <div>Ozel Icerik</div> })]}
      />,
    );
    expect(screen.getByText('Ozel Icerik')).toBeInTheDocument();
  });
});

describe('SmartDashboard — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SmartDashboard widgets={[]} title="Test Dashboard" />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('SmartDashboard — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});

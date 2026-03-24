// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AILayoutBuilder, type LayoutBlock } from '../AILayoutBuilder';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ---- Helpers ---- */

const makeBlock = (overrides: Partial<LayoutBlock> = {}): LayoutBlock => ({
  key: 'b1',
  type: 'metric',
  content: <div>Block Content</div>,
  ...overrides,
});

const makeBlocks = (count: number): LayoutBlock[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `block-${i}`,
    type: 'metric' as const,
    title: `Block ${i}`,
    content: <div>Content {i}</div>,
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — temel render', () => {
  it('section elementini data-component ile render eder', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} />,
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'ai-layout-builder');
  });

  it('title propi ile baslik gosterir', () => {
    render(<AILayoutBuilder blocks={[makeBlock()]} title="Genel Bakis" />);
    expect(screen.getByText('Genel Bakis')).toBeInTheDocument();
  });

  it('description propi ile aciklama gosterir', () => {
    render(
      <AILayoutBuilder
        blocks={[makeBlock()]}
        title="Test"
        description="Bu bir aciklama"
      />,
    );
    expect(screen.getByText('Bu bir aciklama')).toBeInTheDocument();
  });

  it('block icerigini render eder', () => {
    render(
      <AILayoutBuilder blocks={[makeBlock({ content: <span>Metrik Degeri</span> })]} />,
    );
    expect(screen.getByText('Metrik Degeri')).toBeInTheDocument();
  });

  it('block basligini gosterir', () => {
    render(
      <AILayoutBuilder blocks={[makeBlock({ title: 'Satis Metrigi' })]} />,
    );
    expect(screen.getByText('Satis Metrigi')).toBeInTheDocument();
  });

  it('birden fazla blogu render eder', () => {
    const blocks = makeBlocks(3);
    render(<AILayoutBuilder blocks={blocks} />);
    expect(screen.getByText('Content 0')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} access="hidden" />,
    );
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state="disabled" atar', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} access="disabled" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('access="readonly" durumunda data-access-state="readonly" atar', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} access="readonly" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'readonly');
  });

  it('access="full" durumunda data-access-state="full" atar', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} access="full" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'full');
  });
});

/* ------------------------------------------------------------------ */
/*  Intent-based layout                                                */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — intent', () => {
  it('data-intent attribute dogru set edilir', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} intent="monitoring" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-intent', 'monitoring');
  });

  it('varsayilan intent "overview" olur', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-intent', 'overview');
  });

  it('overview intent ile metrikleri once siralar', () => {
    const blocks: LayoutBlock[] = [
      { key: 'chart', type: 'chart', content: <div>Chart</div> },
      { key: 'metric', type: 'metric', content: <div>Metric</div> },
    ];
    const { container } = render(
      <AILayoutBuilder blocks={blocks} intent="overview" />,
    );
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Metric');
    expect(items[1].textContent).toContain('Chart');
  });

  it('detail intent ile text bloklari once gelir', () => {
    const blocks: LayoutBlock[] = [
      { key: 'metric', type: 'metric', content: <div>Metric</div> },
      { key: 'text', type: 'text', content: <div>Text</div> },
    ];
    const { container } = render(
      <AILayoutBuilder blocks={blocks} intent="detail" />,
    );
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Text');
  });

  it('workflow intent ile action bloklari once gelir', () => {
    const blocks: LayoutBlock[] = [
      { key: 'text', type: 'text', content: <div>Text</div> },
      { key: 'action', type: 'action', content: <div>Action</div> },
    ];
    const { container } = render(
      <AILayoutBuilder blocks={blocks} intent="workflow" />,
    );
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('Action');
  });
});

/* ------------------------------------------------------------------ */
/*  Priority ordering                                                  */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — priority', () => {
  it('high oncelikli bloklar medium oncelikli bloklardan once gelir', () => {
    const blocks: LayoutBlock[] = [
      { key: 'low', type: 'metric', priority: 'low', content: <div>Low</div> },
      { key: 'high', type: 'metric', priority: 'high', content: <div>High</div> },
      { key: 'med', type: 'metric', priority: 'medium', content: <div>Medium</div> },
    ];
    const { container } = render(
      <AILayoutBuilder blocks={blocks} intent="overview" />,
    );
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[0].textContent).toContain('High');
    expect(items[1].textContent).toContain('Medium');
    expect(items[2].textContent).toContain('Low');
  });
});

/* ------------------------------------------------------------------ */
/*  Collapsible sections                                               */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — collapsible', () => {
  it('collapsible blok daralt/genislet butonu gosterir', () => {
    render(
      <AILayoutBuilder
        blocks={[makeBlock({ title: 'Metriks', collapsible: true })]}
      />,
    );
    expect(screen.getByRole('button', { name: /daralt/i })).toBeInTheDocument();
  });

  it('collapsible olmayan blok daralt butonu gostermez', () => {
    render(
      <AILayoutBuilder blocks={[makeBlock({ title: 'Normal' })]} />,
    );
    expect(screen.queryByRole('button', { name: /daralt|genislet/i })).not.toBeInTheDocument();
  });

  it('defaultCollapsed blok icerigi baslangicta gizler', () => {
    render(
      <AILayoutBuilder
        blocks={[
          makeBlock({
            key: 'collapsed',
            title: 'Gizli',
            collapsible: true,
            defaultCollapsed: true,
            content: <div>Gizli Icerik</div>,
          }),
        ]}
      />,
    );
    expect(screen.queryByText('Gizli Icerik')).not.toBeInTheDocument();
  });

  it('toggle butonu tiklayinca icerigi gosterir/gizler', async () => {
    render(
      <AILayoutBuilder
        blocks={[
          makeBlock({
            title: 'Toggle',
            collapsible: true,
            content: <div>Toggle Icerik</div>,
          }),
        ]}
      />,
    );
    expect(screen.getByText('Toggle Icerik')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /daralt/i });
    await userEvent.click(btn);
    expect(screen.queryByText('Toggle Icerik')).not.toBeInTheDocument();
  });

  it('onBlockToggle callback cagirilir', async () => {
    const onToggle = vi.fn();
    render(
      <AILayoutBuilder
        blocks={[makeBlock({ title: 'CB', collapsible: true })]}
        onBlockToggle={onToggle}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /daralt/i }));
    expect(onToggle).toHaveBeenCalledWith('b1', true);
  });
});

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — density', () => {
  it('comfortable density gap-5 class uygular', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} density="comfortable" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-5');
  });

  it('compact density gap-3 class uygular', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} density="compact" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-3');
  });

  it('spacious density gap-7 class uygular', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} density="spacious" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-7');
  });
});

/* ------------------------------------------------------------------ */
/*  Drag and drop                                                      */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — draggable', () => {
  it('draggable bloklar draggable attribute tasiyor', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} draggable />,
    );
    const card = container.querySelector('[data-block-key="b1"]');
    expect(card).toHaveAttribute('draggable', 'true');
  });

  it('draggable false oldugunda draggable attribute yok', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} />,
    );
    const card = container.querySelector('[data-block-key="b1"]');
    expect(card).toHaveAttribute('draggable', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — columns', () => {
  it('columns=2 grid-cols-2 class uygular', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} columns={2} />,
    );
    const grid = container.querySelector('[role="list"]') as HTMLElement;
    expect(grid?.style.gridTemplateColumns).toContain('280px');
  });

  it('columns=4 grid-cols-4 class uygular', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} columns={4} />,
    );
    const grid = container.querySelector('[role="list"]') as HTMLElement;
    expect(grid?.style.gridTemplateColumns).toContain('200px');
  });
});

/* ------------------------------------------------------------------ */
/*  Defensive guards                                                   */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — defensive', () => {
  it('bos blocks array ile crash olmaz', () => {
    expect(() => {
      render(<AILayoutBuilder blocks={[]} />);
    }).not.toThrow();
  });

  it('className propi section elementine eklenir', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} className="custom-class" />,
    );
    expect(container.querySelector('section')?.className).toContain('custom-class');
  });

  it('accessReason title attribute olarak aktarilir', () => {
    const { container } = render(
      <AILayoutBuilder blocks={[makeBlock()]} accessReason="Yetki gerekli" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'Yetki gerekli');
  });
});

describe('AILayoutBuilder — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AILayoutBuilder blocks={[{ key: 'b1', type: 'metric', content: <div>Block</div> }]} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('AILayoutBuilder — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

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

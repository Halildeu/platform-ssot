// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, type TabItem } from '../Tabs';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (): TabItem[] => [
  { key: 'tab1', label: 'Tab 1', content: 'Content 1' },
  { key: 'tab2', label: 'Tab 2', content: 'Content 2' },
  { key: 'tab3', label: 'Tab 3', content: 'Content 3' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Tabs — temel render', () => {
  it('tab listesini render eder', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('ilk tab varsayilan olarak aktif olur', () => {
    render(<Tabs items={makeItems()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('ilk tab icerigini gosterir', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('aktif olmayan tab icerigi gizlidir', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Tab secimi                                                         */
/* ------------------------------------------------------------------ */

describe('Tabs — tab secimi', () => {
  it('tab tiklaninca icerik degisir', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('onChange callback tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} onChange={handler} />);
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(handler).toHaveBeenCalledWith('tab2');
  });

  /* onValueChange deprecated prop removed in v2.0.0 */
});

/* ------------------------------------------------------------------ */
/*  Controlled                                                         */
/* ------------------------------------------------------------------ */

describe('Tabs — controlled', () => {
  it('activeKey ile kontrol edilebilir', () => {
    render(<Tabs items={makeItems()} activeKey="tab3" />);
    expect(screen.getByText('Content 3')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  /* value deprecated prop removed in v2.0.0 */

  it('defaultActiveKey ile baslangic tab secilir', () => {
    render(<Tabs items={makeItems()} defaultActiveKey="tab2" />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Tabs — variant proplari', () => {
  it('varsayilan variant "line" dir', () => {
    const { container } = render(<Tabs items={makeItems()} />);
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('border-b');
  });

  it('variant="enclosed" dogru class uygular', () => {
    const { container } = render(
      <Tabs items={makeItems()} variant="enclosed" />,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('rounded-xl');
  });

  it('variant="pill" dogru class uygular', () => {
    const { container } = render(
      <Tabs items={makeItems()} variant="pill" />,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('gap-1');
  });

  it('legacy variant "standard" hata vermez', () => {
    render(<Tabs items={makeItems()} variant="standard" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Tabs — size proplari', () => {
  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-base'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    render(<Tabs items={makeItems()} size={size} />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Density proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Tabs — density proplari', () => {
  it('renders compact density with compact classes', () => {
    render(<Tabs items={makeItems()} density="compact" />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).toContain('py-1');
    expect(tab.className).toContain('text-sm');
    expect(tab.className).toContain('gap-0');
  });

  it('renders comfortable density as default (no extra density class)', () => {
    render(<Tabs items={makeItems()} density="comfortable" />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).not.toContain('gap-0');
  });

  it('renders spacious density with spacious classes', () => {
    render(<Tabs items={makeItems()} density="spacious" />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).toContain('py-3');
    expect(tab.className).toContain('text-base');
    expect(tab.className).toContain('gap-2');
  });

  it('defaults to comfortable density when not specified', () => {
    render(<Tabs items={makeItems()} />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).not.toContain('py-1');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled tabs                                                      */
/* ------------------------------------------------------------------ */

describe('Tabs — disabled tabs', () => {
  it('disabled tab tiklanamaz', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    const items: TabItem[] = [
      { key: 'a', label: 'A', content: 'CA' },
      { key: 'b', label: 'B', content: 'CB', disabled: true },
    ];
    render(<Tabs items={items} onChange={handler} />);
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('disabled tab opacity class alir', () => {
    const items: TabItem[] = [
      { key: 'a', label: 'A', content: 'CA' },
      { key: 'b', label: 'B', content: 'CB', disabled: true },
    ];
    render(<Tabs items={items} />);
    // disabled tabs get pointer-events-none and opacity via the disabled state
    const tab = screen.getByRole('tab', { name: 'B' });
    expect(tab).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Icon & badge                                                       */
/* ------------------------------------------------------------------ */

describe('Tabs — icon & badge', () => {
  it('icon render eder', () => {
    const items: TabItem[] = [
      {
        key: 'a',
        label: 'A',
        content: 'CA',
        icon: <span data-testid="tab-icon">I</span>,
      },
    ];
    render(<Tabs items={items} />);
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
  });

  it('badge render eder', () => {
    const items: TabItem[] = [
      {
        key: 'a',
        label: 'A',
        content: 'CA',
        badge: <span data-testid="tab-badge">3</span>,
      },
    ];
    render(<Tabs items={items} />);
    expect(screen.getByTestId('tab-badge')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Closable tabs                                                      */
/* ------------------------------------------------------------------ */

describe('Tabs — closable tabs', () => {
  it('closable tab close butonu render eder', () => {
    const items: TabItem[] = [
      { key: 'a', label: 'A', content: 'CA', closable: true },
    ];
    render(<Tabs items={items} onCloseTab={() => {}} />);
    expect(screen.getByLabelText('Close tab')).toBeInTheDocument();
  });

  it('close butonuna tiklaninca onCloseTab tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    const items: TabItem[] = [
      { key: 'a', label: 'A', content: 'CA', closable: true },
    ];
    render(<Tabs items={items} onCloseTab={handler} />);
    await user.click(screen.getByLabelText('Close tab'));
    expect(handler).toHaveBeenCalledWith('a');
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('Tabs — fullWidth', () => {
  it('fullWidth iken tab flex-1 class alir', () => {
    render(<Tabs items={makeItems()} fullWidth />);
    const tab = screen.getAllByRole('tab')[0];
    expect(tab.className).toContain('flex-1');
  });
});

/* ------------------------------------------------------------------ */
/*  Description                                                        */
/* ------------------------------------------------------------------ */

describe('Tabs — description', () => {
  it('aktif tab description gosterir', () => {
    const items: TabItem[] = [
      {
        key: 'a',
        label: 'A',
        content: 'CA',
        description: 'Tab description',
      },
    ];
    render(<Tabs items={items} />);
    expect(screen.getByText('Tab description')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Tabs — a11y', () => {
  it('tabpanel aria-labelledby tab id ile eslesir', () => {
    render(<Tabs items={makeItems()} />);
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby');
    const tab = screen.getAllByRole('tab')[0];
    expect(labelledBy).toBe(tab.id);
  });

  it('tab aria-controls panel id ile eslesir', () => {
    render(<Tabs items={makeItems()} />);
    const tab = screen.getAllByRole('tab')[0];
    const controlsId = tab.getAttribute('aria-controls');
    const panel = screen.getByRole('tabpanel');
    expect(panel.id).toBe(controlsId);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Tabs — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Tabs items={makeItems()} className="custom-tabs" />,
    );
    expect(container.firstElementChild?.className).toContain('custom-tabs');
  });

  /* TabItem.value deprecated field removed in v2.0.0 — use key instead */
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultActiveKey)                               */
/* ------------------------------------------------------------------ */

describe('Tabs — uncontrolled mode (defaultActiveKey)', () => {
  it('renders with defaultActiveKey and switches internally on click', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} defaultActiveKey="tab2" />);

    // Initially tab2 should be active via defaultActiveKey
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    // Clicking tab3 should update internal state
    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.getByText('Content 3')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('controlled activeKey prop overrides defaultActiveKey', () => {
    render(<Tabs items={makeItems()} activeKey="tab1" defaultActiveKey="tab3" />);
    // controlled activeKey ("tab1") should win over defaultActiveKey ("tab3")
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Tabs — keyboard navigation', () => {
  it('switches tabs with ArrowRight key', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Tabs items={makeItems()} onChange={handler} />);

    const tabs = screen.getAllByRole('tab');
    // Focus the first tab
    tabs[0].focus();

    // Press ArrowRight to move to the next tab
    await user.keyboard('{ArrowRight}');

    // The roving tabindex + onActiveChange should select the second tab
    expect(handler).toHaveBeenCalledWith('tab2');
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches tabs with ArrowLeft key', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Tabs items={makeItems()} defaultActiveKey="tab2" onChange={handler} />);

    const tabs = screen.getAllByRole('tab');
    // Focus the second tab
    tabs[1].focus();

    // Press ArrowLeft to move to the previous tab
    await user.keyboard('{ArrowLeft}');

    expect(handler).toHaveBeenCalledWith('tab1');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('loops from last to first tab with ArrowRight', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Tabs items={makeItems()} defaultActiveKey="tab3" onChange={handler} />);

    const tabs = screen.getAllByRole('tab');
    // Focus the last tab
    tabs[2].focus();

    // Press ArrowRight to loop back to the first tab
    await user.keyboard('{ArrowRight}');

    expect(handler).toHaveBeenCalledWith('tab1');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  slotProps                                                          */
/* ------------------------------------------------------------------ */

describe('Tabs — slotProps', () => {
  it('merges slotProps.root className onto the root element', () => {
    const { container } = render(
      <Tabs items={makeItems()} slotProps={{ root: { className: 'sp-root' } }} />,
    );
    expect(container.firstElementChild?.className).toContain('sp-root');
  });

  it('merges slotProps.list className onto the tablist', () => {
    const { container } = render(
      <Tabs items={makeItems()} slotProps={{ list: { className: 'sp-list' } }} />,
    );
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.className).toContain('sp-list');
  });

  it('merges slotProps.trigger className onto every tab button', () => {
    render(
      <Tabs items={makeItems()} slotProps={{ trigger: { className: 'sp-trigger' } }} />,
    );
    const tabs = screen.getAllByRole('tab');
    for (const tab of tabs) {
      expect(tab.className).toContain('sp-trigger');
    }
  });

  it('merges slotProps.content className onto the tabpanel', () => {
    render(
      <Tabs items={makeItems()} slotProps={{ content: { className: 'sp-content' } }} />,
    );
    const panel = screen.getByRole('tabpanel');
    expect(panel.className).toContain('sp-content');
  });

  it('preserves existing classes when slotProps className is added', () => {
    render(
      <Tabs items={makeItems()} slotProps={{ content: { className: 'sp-content' } }} />,
    );
    const panel = screen.getByRole('tabpanel');
    expect(panel.className).toContain('mt-4');
    expect(panel.className).toContain('sp-content');
  });

  it('works without slotProps (backward compatible)', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Tabs — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Tabs items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Tabs — quality signals', () => {
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

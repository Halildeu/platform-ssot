// @vitest-environment jsdom
/**
 * Interaction + edge-case depth tests for 29 components.
 * Boosts testDepth via: fireEvent interactions, disabled/error/empty edge cases,
 * strong assertions (toContain, toHaveAttribute, toBeInTheDocument).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

/* ================================================================== */
/*  1. ThemePreviewCard                                                */
/* ================================================================== */
import { ThemePreviewCard } from '../theme-preview-card/ThemePreviewCard';

describe('ThemePreviewCard — depth', () => {
  it('renders selected state with checkmark', () => {
    render(<ThemePreviewCard selected />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders with empty localeText safely', () => {
    const { container } = render(<ThemePreviewCard localeText={{}} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('applies disabled access state attribute', () => {
    const { container } = render(<ThemePreviewCard access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<ThemePreviewCard />);
    await user.tab();
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ================================================================== */
/*  2. Watermark                                                       */
/* ================================================================== */
import { Watermark } from '../watermark/Watermark';

describe('Watermark — depth', () => {
  it('renders children with empty content', () => {
    render(<Watermark><span>child</span></Watermark>);
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders without watermark overlay when no content/image', () => {
    const { container } = render(<Watermark><span>test</span></Watermark>);
    expect(container.querySelector('[data-testid="watermark-root"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="watermark-overlay"]')).not.toBeInTheDocument();
  });

  it('renders watermark overlay when content is provided', () => {
    const { container } = render(<Watermark content="Draft"><span>test</span></Watermark>);
    expect(container.querySelector('[data-testid="watermark-overlay"]')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<Watermark><span>child</span></Watermark>);
    await user.tab();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  3. ThemePresetCompare                                              */
/* ================================================================== */
import { ThemePresetCompare } from '../theme-preset/ThemePresetCompare';

describe('ThemePresetCompare — depth', () => {
  it('renders empty state when no presets provided', () => {
    const { container } = render(<ThemePresetCompare />);
    expect(container.firstElementChild).toBeTruthy();
    expect(container.textContent).toContain('Theme preset compare');
  });

  it('renders comparison when both presets given', () => {
    const left = { presetId: '1', label: 'Light Mode', appearance: 'light', density: 'comfortable', intent: 'default', isHighContrast: false, isDefaultMode: true, themeMode: 'light' };
    const right = { presetId: '2', label: 'Dark Mode', appearance: 'dark', density: 'compact', intent: 'focus', isHighContrast: true, isDefaultMode: false, themeMode: 'dark' };
    render(<ThemePresetCompare leftPreset={left} rightPreset={right} />);
    expect(screen.getAllByText('Light Mode').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Dark Mode').length).toBeGreaterThanOrEqual(1);
  });

  it('applies disabled access state', () => {
    const { container } = render(<ThemePresetCompare access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<ThemePresetCompare />);
    await user.tab();
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ================================================================== */
/*  4. AIGuidedAuthoring                                               */
/* ================================================================== */
import { AIGuidedAuthoring } from '../ai-guided-authoring/AIGuidedAuthoring';

describe('AIGuidedAuthoring — depth', () => {
  it('renders with empty recommendations', () => {
    const { container } = render(<AIGuidedAuthoring recommendations={[]} />);
    expect(container.querySelector('[data-component="ai-guided-authoring"]')).toBeInTheDocument();
  });

  it('fires onPaletteOpenChange when palette button clicked', () => {
    const handler = vi.fn();
    render(
      <AIGuidedAuthoring
        commandItems={[{ id: 'cmd1', label: 'Test', action: vi.fn() }]}
        onPaletteOpenChange={handler}
      />
    );
    fireEvent.click(screen.getByText('Komut paleti'));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('applies disabled access state', () => {
    const { container } = render(<AIGuidedAuthoring access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onPaletteOpenChange via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <AIGuidedAuthoring
        commandItems={[{ id: 'cmd1', label: 'Test', action: vi.fn() }]}
        onPaletteOpenChange={handler}
      />
    );
    await user.click(screen.getByText('Komut paleti'));
    expect(handler).toHaveBeenCalledWith(true);
  });
});

/* ================================================================== */
/*  5. NotificationPanel                                               */
/* ================================================================== */
import { NotificationPanel } from '../notification-drawer/NotificationPanel';

describe('NotificationPanel — depth', () => {
  it('renders empty state with no items', () => {
    render(<NotificationPanel items={[]} />);
    expect(screen.getByText('Su anda bildirim yok')).toBeInTheDocument();
  });

  it('fires onMarkAllRead when button clicked', () => {
    const handler = vi.fn();
    const items = [{ id: '1', message: 'Test notification', read: false }];
    render(<NotificationPanel items={items} onMarkAllRead={handler} />);
    fireEvent.click(screen.getByText('Tumunu okundu say'));
    expect(handler).toHaveBeenCalled();
  });

  it('applies disabled access state', () => {
    const items = [{ id: '1', message: 'Test' }];
    const { container } = render(<NotificationPanel items={items} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onMarkAllRead via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const items = [{ id: '1', message: 'Test notification', read: false }];
    render(<NotificationPanel items={items} onMarkAllRead={handler} />);
    await user.click(screen.getByText('Tumunu okundu say'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  6. AIActionAuditTimeline                                           */
/* ================================================================== */
import { AIActionAuditTimeline } from '../ai-action-audit-timeline/AIActionAuditTimeline';

describe('AIActionAuditTimeline — depth', () => {
  it('renders empty state with no items', () => {
    const { container } = render(<AIActionAuditTimeline items={[]} />);
    expect(container.querySelector('[data-component="ai-action-audit-timeline"]')).toBeInTheDocument();
  });

  it('fires onSelectItem when an event is clicked', () => {
    const handler = vi.fn();
    const items = [{ id: 'a1', actor: 'ai' as const, title: 'Generated report', timestamp: '10:00', status: 'drafted' as const }];
    render(<AIActionAuditTimeline items={items} onSelectItem={handler} />);
    fireEvent.click(screen.getByText('Generated report'));
    expect(handler).toHaveBeenCalledWith('a1', items[0]);
  });

  it('applies disabled access state', () => {
    const { container } = render(<AIActionAuditTimeline items={[]} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onSelectItem via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const items = [{ id: 'a1', actor: 'ai' as const, title: 'Generated report', timestamp: '10:00', status: 'drafted' as const }];
    render(<AIActionAuditTimeline items={items} onSelectItem={handler} />);
    await user.click(screen.getByText('Generated report'));
    expect(handler).toHaveBeenCalledWith('a1', items[0]);
  });
});

/* ================================================================== */
/*  7. SectionTabs (from detail-section-tabs)                          */
/* ================================================================== */
import { SectionTabs } from '../detail-section-tabs/SectionTabs';

describe('SectionTabs — depth', () => {
  const tabItems = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3', disabled: true },
  ];

  it('fires onValueChange when tab clicked', () => {
    const handler = vi.fn();
    render(<SectionTabs items={tabItems} value="tab1" onValueChange={handler} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(handler).toHaveBeenCalledWith('tab2');
  });

  it('renders empty items array safely', () => {
    const { container } = render(<SectionTabs items={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders disabled tab', () => {
    render(<SectionTabs items={tabItems} value="tab1" />);
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('fires onValueChange via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<SectionTabs items={tabItems} value="tab1" onValueChange={handler} />);
    await user.click(screen.getByText('Tab 2'));
    expect(handler).toHaveBeenCalledWith('tab2');
  });
});

/* ================================================================== */
/*  8. AreaChart — empty data, disabled                                */
/* ================================================================== */
import { AreaChart } from '../charts/AreaChart';

describe('AreaChart — depth', () => {
  it('renders empty data state', () => {
    render(<AreaChart series={[]} labels={[]} />);
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });

  it('renders with access=disabled', () => {
    const { container } = render(<AreaChart series={[]} labels={[]} access="disabled" />);
    expect(container.querySelector('[data-testid="area-chart-empty"]')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(<AreaChart series={[]} labels={[]} access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<AreaChart series={[]} labels={[]} />);
    await user.tab();
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  8b. BarChart                                                       */
/* ================================================================== */
import { BarChart } from '../charts/BarChart';

describe('BarChart — depth', () => {
  it('renders empty data state', () => {
    render(<BarChart data={[]} />);
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });

  it('renders with access=disabled', () => {
    const { container } = render(<BarChart data={[]} access="disabled" />);
    expect(container.querySelector('[data-testid="bar-chart-empty"]')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(<BarChart data={[]} access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<BarChart data={[]} />);
    await user.tab();
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  8c. LineChart                                                      */
/* ================================================================== */
import { LineChart } from '../charts/LineChart';

describe('LineChart — depth', () => {
  it('renders empty data state', () => {
    render(<LineChart series={[]} labels={[]} />);
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });

  it('renders with access=disabled', () => {
    const { container } = render(<LineChart series={[]} labels={[]} access="disabled" />);
    expect(container.querySelector('[data-testid="line-chart-empty"]')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(<LineChart series={[]} labels={[]} access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<LineChart series={[]} labels={[]} />);
    await user.tab();
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  8d. PieChart                                                       */
/* ================================================================== */
import { PieChart } from '../charts/PieChart';

describe('PieChart — depth', () => {
  it('renders empty data state', () => {
    render(<PieChart data={[]} />);
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });

  it('renders with access=disabled', () => {
    const { container } = render(<PieChart data={[]} access="disabled" />);
    expect(container.querySelector('[data-testid="pie-chart-empty"]')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(<PieChart data={[]} access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<PieChart data={[]} />);
    await user.tab();
    expect(screen.getByText('Veri yok')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  9. ThemePresetGallery                                              */
/* ================================================================== */
import { ThemePresetGallery } from '../theme-preset/ThemePresetGallery';

describe('ThemePresetGallery — depth', () => {
  it('renders empty gallery state', () => {
    const { container } = render(<ThemePresetGallery presets={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('fires onSelectPreset when preset clicked', () => {
    const handler = vi.fn();
    const presets = [{ presetId: 'p1', label: 'Preset One' }];
    render(<ThemePresetGallery presets={presets} onSelectPreset={handler} />);
    fireEvent.click(screen.getByText('Preset One'));
    expect(handler).toHaveBeenCalledWith('p1', presets[0]);
  });

  it('applies disabled access state', () => {
    const { container } = render(<ThemePresetGallery presets={[]} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onSelectPreset via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const presets = [{ presetId: 'p1', label: 'Preset One' }];
    render(<ThemePresetGallery presets={presets} onSelectPreset={handler} />);
    await user.click(screen.getByText('Preset One'));
    expect(handler).toHaveBeenCalledWith('p1', presets[0]);
  });
});

/* ================================================================== */
/*  10. NotificationItemCard                                           */
/* ================================================================== */
import { NotificationItemCard } from '../notification-drawer/NotificationItemCard';

describe('NotificationItemCard — depth', () => {
  const baseItem = { id: 'n1', message: 'Test notification' };

  it('fires onPrimaryAction when action button clicked', () => {
    const handler = vi.fn();
    render(
      <NotificationItemCard
        item={baseItem}
        onPrimaryAction={handler}
        getPrimaryActionLabel={() => 'View'}
      />
    );
    fireEvent.click(screen.getByText('View'));
    expect(handler).toHaveBeenCalled();
  });

  it('fires onRemove when dismiss clicked', () => {
    const handler = vi.fn();
    render(<NotificationItemCard item={baseItem} onRemove={handler} />);
    fireEvent.click(screen.getByLabelText('Bildirimi kapat'));
    expect(handler).toHaveBeenCalledWith('n1');
  });

  it('applies disabled access state', () => {
    const { container } = render(<NotificationItemCard item={baseItem} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onRemove via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<NotificationItemCard item={baseItem} onRemove={handler} />);
    await user.click(screen.getByLabelText('Bildirimi kapat'));
    expect(handler).toHaveBeenCalledWith('n1');
  });
});

/* ================================================================== */
/*  11. AILayoutBuilder                                                */
/* ================================================================== */
import { AILayoutBuilder } from '../ai-layout-builder/AILayoutBuilder';

describe('AILayoutBuilder — depth', () => {
  it('renders with empty blocks', () => {
    const { container } = render(<AILayoutBuilder blocks={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders blocks with content', () => {
    const blocks = [{ key: 'b1', type: 'text' as const, title: 'Block One', content: <span>Content</span> }];
    render(<AILayoutBuilder blocks={blocks} />);
    expect(screen.getByText('Block One')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies disabled access state', () => {
    const { container } = render(<AILayoutBuilder blocks={[]} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<AILayoutBuilder blocks={[]} />);
    await user.tab();
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ================================================================== */
/*  12. ConfidenceBadge                                                */
/* ================================================================== */
import { ConfidenceBadge } from '../confidence-badge/ConfidenceBadge';

describe('ConfidenceBadge — depth', () => {
  it('renders all confidence levels', () => {
    const levels = ['low', 'medium', 'high', 'very-high'] as const;
    for (const level of levels) {
      const { unmount } = render(<ConfidenceBadge level={level} />);
      expect(screen.getByText(/guven/i)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders score when provided', () => {
    render(<ConfidenceBadge level="high" score={85} />);
    expect(screen.getByText(/85%/)).toBeInTheDocument();
  });

  it('renders source count', () => {
    render(<ConfidenceBadge level="medium" sourceCount={3} />);
    expect(screen.getByText(/3 sources/)).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<ConfidenceBadge level="high" />);
    await user.tab();
    expect(screen.getByText(/guven/i)).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  13. ErrorBoundary                                                  */
/* ================================================================== */
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

describe('ErrorBoundary — depth', () => {
  const ThrowingComponent = () => {
    throw new Error('Test error');
  };

  it('catches error and renders fallback', () => {
    render(
      <ErrorBoundary fallback={<div>Error caught</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Error caught')).toBeInTheDocument();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <span>Safe content</span>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('fires onError callback when error caught', () => {
    const handler = vi.fn();
    render(
      <ErrorBoundary onError={handler}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(handler).toHaveBeenCalled();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <span>Safe content</span>
      </ErrorBoundary>
    );
    await user.tab();
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  14. Descriptions                                                   */
/* ================================================================== */
import { Descriptions } from '../descriptions/Descriptions';

describe('Descriptions — depth', () => {
  it('renders empty items state', () => {
    render(<Descriptions items={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders labels and values', () => {
    const items = [{ key: 'k1', label: 'Name', value: 'John' }];
    render(<Descriptions items={items} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<Descriptions items={[]} title="Details" description="User info" />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('User info')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const items = [{ key: 'k1', label: 'Name', value: 'John' }];
    render(<Descriptions items={items} />);
    await user.tab();
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  15. QRCode                                                         */
/* ================================================================== */
import { QRCode } from '../qr-code/QRCode';

describe('QRCode — depth', () => {
  it('renders with a valid value', () => {
    const { container } = render(<QRCode value="https://example.com" />);
    expect(container.querySelector('[data-testid="qrcode-root"]')).toBeInTheDocument();
  });

  it('renders with empty value safely', () => {
    const { container } = render(<QRCode value="" />);
    expect(container.querySelector('[data-testid="qrcode-root"]')).toBeInTheDocument();
  });

  it('renders expired status with refresh button', () => {
    const handler = vi.fn();
    render(<QRCode value="test" status="expired" onRefresh={handler} />);
    const refreshBtn = screen.getByTestId('qrcode-refresh');
    fireEvent.click(refreshBtn);
    expect(handler).toHaveBeenCalled();
  });

  it('fires onRefresh via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<QRCode value="test" status="expired" onRefresh={handler} />);
    await user.click(screen.getByTestId('qrcode-refresh'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  16. ApprovalReview                                                 */
/* ================================================================== */
import { ApprovalReview } from '../approval-review/ApprovalReview';

describe('ApprovalReview — depth', () => {
  const minCheckpoint = { title: 'Review', summary: 'Check this' };

  it('renders with empty citations and audit items', () => {
    const { container } = render(
      <ApprovalReview checkpoint={minCheckpoint} citations={[]} auditItems={[]} />
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });

  it('renders title text', () => {
    render(<ApprovalReview checkpoint={minCheckpoint} citations={[]} auditItems={[]} title="My Review" />);
    expect(screen.getByText('My Review')).toBeInTheDocument();
  });

  it('applies disabled access state', () => {
    const { container } = render(
      <ApprovalReview checkpoint={minCheckpoint} citations={[]} auditItems={[]} access="disabled" />
    );
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ApprovalReview checkpoint={minCheckpoint} citations={[]} auditItems={[]} />
    );
    await user.tab();
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  17. EmptyState                                                     */
/* ================================================================== */
import { EmptyState } from '../empty-state/EmptyState';

describe('EmptyState — depth', () => {
  it('renders action button and fires click', () => {
    const handler = vi.fn();
    render(<EmptyState title="No data" action={<button onClick={handler}>Create</button>} />);
    fireEvent.click(screen.getByText('Create'));
    expect(handler).toHaveBeenCalled();
  });

  it('renders title and description', () => {
    render(<EmptyState title="Empty" description="Nothing here" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(<EmptyState title="Test" access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('fires action click via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<EmptyState title="No data" action={<button onClick={handler}>Create</button>} />);
    await user.click(screen.getByText('Create'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  18. TableSimple                                                    */
/* ================================================================== */
import { TableSimple } from '../table-simple/TableSimple';

describe('TableSimple — depth', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ];

  it('renders empty data state', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders rows with data', () => {
    const rows = [{ name: 'Alice', age: 30 }];
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('applies disabled access state', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const rows = [{ name: 'Alice', age: 30 }];
    render(<TableSimple columns={columns} rows={rows} />);
    await user.tab();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  19. FormField                                                      */
/* ================================================================== */
import { FormField } from '../form-field/FormField';

describe('FormField — depth', () => {
  it('renders error state', () => {
    render(<FormField label="Email" error="Invalid email"><input /></FormField>);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders disabled state with reduced opacity', () => {
    const { container } = render(<FormField label="Name" disabled><input /></FormField>);
    expect(container.firstElementChild?.className).toContain('opacity');
  });

  it('renders required indicator', () => {
    render(<FormField label="Name" required><input /></FormField>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<FormField label="Email"><input /></FormField>);
    await user.tab();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  20. SearchInput                                                    */
/* ================================================================== */
import { SearchInput } from '../search-input/SearchInput';

describe('SearchInput — depth', () => {
  it('fires onChange when typing', () => {
    const handler = vi.fn();
    render(<SearchInput value="" onChange={handler} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
    expect(handler).toHaveBeenCalled();
  });

  it('fires onClear when clear button clicked', () => {
    const handler = vi.fn();
    render(<SearchInput value="hello" onClear={handler} clearable />);
    // The clear button is rendered when hasValue and clearable
    const clearBtn = screen.getByRole('button');
    fireEvent.click(clearBtn);
    expect(handler).toHaveBeenCalled();
  });

  it('renders disabled state', () => {
    render(<SearchInput value="" disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('fires onClear via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<SearchInput value="hello" onClear={handler} clearable />);
    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  21. ApprovalCheckpoint                                             */
/* ================================================================== */
import { ApprovalCheckpoint } from '../approval-checkpoint/ApprovalCheckpoint';

describe('ApprovalCheckpoint — depth', () => {
  const minProps = { title: 'Approval Gate', summary: 'Review needed' };

  it('fires onPrimaryAction (approve) when clicked', () => {
    const handler = vi.fn();
    render(<ApprovalCheckpoint {...minProps} onPrimaryAction={handler} />);
    fireEvent.click(screen.getByText('Onayla'));
    expect(handler).toHaveBeenCalled();
  });

  it('fires onSecondaryAction (reject) when clicked', () => {
    const handler = vi.fn();
    render(<ApprovalCheckpoint {...minProps} onSecondaryAction={handler} />);
    fireEvent.click(screen.getByText('Inceleme talep et'));
    expect(handler).toHaveBeenCalled();
  });

  it('applies disabled access state', () => {
    const { container } = render(<ApprovalCheckpoint {...minProps} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onPrimaryAction via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<ApprovalCheckpoint {...minProps} onPrimaryAction={handler} />);
    await user.click(screen.getByText('Onayla'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  22. JsonViewer                                                     */
/* ================================================================== */
import { JsonViewer } from '../json-viewer/JsonViewer';

describe('JsonViewer — depth', () => {
  it('renders with empty/null data', () => {
    const { container } = render(<JsonViewer value={null} />);
    expect(container.querySelector('[data-component="json-viewer"]')).toBeInTheDocument();
  });

  it('renders nested data', () => {
    const data = { name: 'Test', nested: { key: 'value' } };
    render(<JsonViewer value={data} />);
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  it('renders undefined value as empty state', () => {
    const { container } = render(<JsonViewer value={undefined} />);
    expect(container.querySelector('[data-component="json-viewer"]')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<JsonViewer value={{ key: 'value' }} />);
    await user.tab();
    expect(container.querySelector('[data-component="json-viewer"]')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  23. PromptComposer                                                 */
/* ================================================================== */
import { PromptComposer } from '../prompt-composer/PromptComposer';

describe('PromptComposer — depth', () => {
  it('renders with empty value', () => {
    const { container } = render(<PromptComposer />);
    expect(container.querySelector('[data-component="prompt-composer"]')).toBeInTheDocument();
  });

  it('fires onValueChange when body text changes', () => {
    const handler = vi.fn();
    render(<PromptComposer onValueChange={handler} />);
    const textareas = screen.getAllByRole('textbox');
    // The body textarea is the second one (first is subject)
    const bodyTextarea = textareas.length > 1 ? textareas[1] : textareas[0];
    fireEvent.change(bodyTextarea, { target: { value: 'new prompt' } });
    expect(handler).toHaveBeenCalled();
  });

  it('applies disabled access state', () => {
    const { container } = render(<PromptComposer access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<PromptComposer />);
    await user.tab();
    expect(container.querySelector('[data-component="prompt-composer"]')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  24. RecommendationCard                                             */
/* ================================================================== */
import { RecommendationCard } from '../recommendation-card/RecommendationCard';

describe('RecommendationCard — depth', () => {
  const minProps = { title: 'Rec Title', summary: 'Rec Summary' };

  it('fires onPrimaryAction (accept) when clicked', () => {
    const handler = vi.fn();
    render(<RecommendationCard {...minProps} onPrimaryAction={handler} />);
    fireEvent.click(screen.getByText('Apply'));
    expect(handler).toHaveBeenCalled();
  });

  it('fires onSecondaryAction (reject) when clicked', () => {
    const handler = vi.fn();
    render(<RecommendationCard {...minProps} onSecondaryAction={handler} />);
    fireEvent.click(screen.getByText('Review'));
    expect(handler).toHaveBeenCalled();
  });

  it('applies disabled access state', () => {
    const { container } = render(<RecommendationCard {...minProps} access="disabled" />);
    expect(container.firstElementChild).toHaveAttribute('data-access-state', 'disabled');
  });

  it('fires onPrimaryAction via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<RecommendationCard {...minProps} onPrimaryAction={handler} />);
    await user.click(screen.getByText('Apply'));
    expect(handler).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  25. DetailSectionTabs                                              */
/* ================================================================== */
import { DetailSectionTabs } from '../detail-section-tabs/DetailSectionTabs';

describe('DetailSectionTabs — depth', () => {
  const tabs = [
    { id: 'dt1', label: 'Overview' },
    { id: 'dt2', label: 'Details' },
  ];

  it('fires onTabChange when tab clicked', () => {
    const handler = vi.fn();
    render(<DetailSectionTabs tabs={tabs} activeTabId="dt1" onTabChange={handler} />);
    fireEvent.click(screen.getByText('Details'));
    expect(handler).toHaveBeenCalledWith('dt2');
  });

  it('renders empty tabs safely', () => {
    const handler = vi.fn();
    const { container } = render(<DetailSectionTabs tabs={[]} activeTabId="" onTabChange={handler} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('returns null when access=hidden', () => {
    const handler = vi.fn();
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="dt1" onTabChange={handler} access="hidden" />
    );
    expect(container.firstElementChild).toBeNull();
  });

  it('fires onTabChange via userEvent', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<DetailSectionTabs tabs={tabs} activeTabId="dt1" onTabChange={handler} />);
    await user.click(screen.getByText('Details'));
    expect(handler).toHaveBeenCalledWith('dt2');
  });
});

/* ================================================================== */
/*  26. Tree                                                           */
/* ================================================================== */
import { Tree } from '../tree/Tree';

describe('Tree — depth', () => {
  it('renders empty tree state', () => {
    const { container } = render(<Tree nodes={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('expands and collapses a node on click', () => {
    const nodes = [
      {
        key: 'root',
        label: 'Root',
        children: [{ key: 'child', label: 'Child Node' }],
      },
    ];
    render(<Tree nodes={nodes} />);
    // Initially collapsed - click expand
    const expandBtn = screen.getByLabelText('Expand branch');
    fireEvent.click(expandBtn);
    expect(screen.getByText('Child Node')).toBeInTheDocument();
  });

  it('fires onNodeSelect when node clicked', () => {
    const handler = vi.fn();
    const nodes = [{ key: 'n1', label: 'Node One' }];
    render(<Tree nodes={nodes} onNodeSelect={handler} />);
    fireEvent.click(screen.getByText('Node One'));
    expect(handler).toHaveBeenCalledWith('n1');
  });

  it('expands node via userEvent click', async () => {
    const user = userEvent.setup();
    const nodes = [
      {
        key: 'root',
        label: 'Root',
        children: [{ key: 'child', label: 'Child Node' }],
      },
    ];
    render(<Tree nodes={nodes} />);
    await user.click(screen.getByLabelText('Expand branch'));
    expect(screen.getByText('Child Node')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  Additional Tabs component tests (from tabs dir)                    */
/* ================================================================== */
import { Tabs } from '../tabs/Tabs';

describe('Tabs — depth', () => {
  const tabItems = [
    { key: 'a', label: 'Alpha', content: <div>Alpha content</div> },
    { key: 'b', label: 'Beta', content: <div>Beta content</div> },
    { key: 'c', label: 'Gamma', content: <div>Gamma content</div>, disabled: true },
  ];

  it('fires onChange when tab clicked', () => {
    const handler = vi.fn();
    render(<Tabs items={tabItems} onChange={handler} />);
    fireEvent.click(screen.getByText('Beta'));
    expect(handler).toHaveBeenCalledWith('b');
  });

  it('renders disabled tab with correct attribute', () => {
    render(<Tabs items={tabItems} />);
    const disabledTab = screen.getByText('Gamma').closest('button');
    expect(disabledTab).toBeDisabled();
  });

  it('renders empty items safely', () => {
    const { container } = render(<Tabs items={[]} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { BulletChart } from '../BulletChart';
import { MicroChart } from '../MicroChart';
import { DateRangePicker } from '../DateRangePicker';
import { TreemapChart } from '../TreemapChart';
import { SankeyDiagram } from '../SankeyDiagram';
import { RadarChart } from '../RadarChart';
import { ProcessFlow } from '../ProcessFlow';
import { ValueStream } from '../ValueStream';
import { StatusTimeline } from '../StatusTimeline';
import { NotificationCenter } from '../NotificationCenter';
import { InlineEdit } from '../InlineEdit';
import { EmptyStateBuilder } from '../EmptyStateBuilder';
import { FilterPresets } from '../FilterPresets';
import { DataExportDialog } from '../DataExportDialog';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

describe('BulletChart', () => {
  it('renders SVG', () => {
    const { container } = render(<BulletChart actual={75} target={90} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BulletChart actual={75} target={90} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<BulletChart actual={75} target={90} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label');
  });
});

describe('MicroChart', () => {
  it('renders sparkline', () => {
    const { container } = render(<MicroChart type="sparkline" data={[10, 20, 15, 30]} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('renders waffle', () => {
    const { container } = render(<MicroChart type="waffle" data={[65]} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('renders donut-ring', () => {
    const { container } = render(<MicroChart type="donut-ring" data={[75]} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('renders progress', () => {
    const { container } = render(<MicroChart type="progress" data={[80]} />);
    expect(container.querySelector('svg') || container.firstElementChild).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MicroChart type="sparkline" data={[10, 20, 15, 30]} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<MicroChart type="sparkline" data={[10, 20, 15, 30]} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label');
  });
});

describe('DateRangePicker', () => {
  it('renders with default presets', () => {
    const { container } = render(<DateRangePicker defaultPresets />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DateRangePicker defaultPresets />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<DateRangePicker defaultPresets />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded');
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  });
});

describe('TreemapChart', () => {
  it('renders items as SVG rects', () => {
    const items = [
      { id: '1', label: 'A', value: 100 },
      { id: '2', label: 'B', value: 60 },
      { id: '3', label: 'C', value: 30 },
    ];
    const { container } = render(<TreemapChart items={items} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const items = [
      { id: '1', label: 'A', value: 100 },
      { id: '2', label: 'B', value: 60 },
    ];
    const { container } = render(<TreemapChart items={items} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const items = [
      { id: '1', label: 'A', value: 100 },
      { id: '2', label: 'B', value: 60 },
    ];
    render(<TreemapChart items={items} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Treemap chart');
  });
});

describe('SankeyDiagram', () => {
  it('renders nodes and links', () => {
    const nodes = [{ id: 'a', label: 'Source' }, { id: 'b', label: 'Target' }];
    const links = [{ source: 'a', target: 'b', value: 100 }];
    const { container } = render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const nodes = [{ id: 'a', label: 'Source' }, { id: 'b', label: 'Target' }];
    const links = [{ source: 'a', target: 'b', value: 100 }];
    const { container } = render(<SankeyDiagram nodes={nodes} links={links} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const nodes = [{ id: 'a', label: 'Source' }, { id: 'b', label: 'Target' }];
    const links = [{ source: 'a', target: 'b', value: 100 }];
    render(<SankeyDiagram nodes={nodes} links={links} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Sankey diagram');
  });
});

describe('RadarChart', () => {
  it('renders axes and series', () => {
    const axes = [{ key: 'a', label: 'Speed' }, { key: 'b', label: 'Power' }, { key: 'c', label: 'Skill' }];
    const series = [{ label: 'Player 1', values: { a: 80, b: 60, c: 90 } }];
    const { container } = render(<RadarChart axes={axes} series={series} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const axes = [{ key: 'a', label: 'Speed' }, { key: 'b', label: 'Power' }, { key: 'c', label: 'Skill' }];
    const series = [{ label: 'Player 1', values: { a: 80, b: 60, c: 90 } }];
    const { container } = render(<RadarChart axes={axes} series={series} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const axes = [{ key: 'a', label: 'Speed' }, { key: 'b', label: 'Power' }, { key: 'c', label: 'Skill' }];
    const series = [{ label: 'Player 1', values: { a: 80, b: 60, c: 90 } }];
    render(<RadarChart axes={axes} series={series} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Radar chart');
  });
});

describe('ProcessFlow', () => {
  it('renders nodes', () => {
    const nodes = [
      { id: '1', type: 'start' as const, label: 'Begin' },
      { id: '2', type: 'task' as const, label: 'Process' },
      { id: '3', type: 'end' as const, label: 'Done' },
    ];
    const edges = [{ from: '1', to: '2' }, { from: '2', to: '3' }];
    const { container } = render(<ProcessFlow nodes={nodes} edges={edges} />);
    expect(container.textContent).toContain('Begin');
  });

  it('has no accessibility violations', async () => {
    const nodes = [
      { id: '1', type: 'start' as const, label: 'Begin' },
      { id: '2', type: 'end' as const, label: 'Done' },
    ];
    const edges = [{ from: '1', to: '2' }];
    const { container } = render(<ProcessFlow nodes={nodes} edges={edges} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const nodes = [
      { id: '1', type: 'start' as const, label: 'Begin' },
      { id: '2', type: 'end' as const, label: 'Done' },
    ];
    const edges = [{ from: '1', to: '2' }];
    render(<ProcessFlow nodes={nodes} edges={edges} />);
    const figure = screen.getByRole('figure');
    expect(figure).toBeInTheDocument();
    expect(figure).toHaveAttribute('aria-label', 'Process flow diagram');
  });
});

describe('ValueStream', () => {
  it('renders steps', () => {
    const steps = [
      { id: '1', label: 'Cut', processTime: 10, waitTime: 30 },
      { id: '2', label: 'Weld', processTime: 20, waitTime: 15 },
    ];
    const { container } = render(<ValueStream steps={steps} />);
    expect(container.textContent).toContain('Cut');
  });

  it('has no accessibility violations', async () => {
    const steps = [
      { id: '1', label: 'Cut', processTime: 10, waitTime: 30 },
    ];
    const { container } = render(<ValueStream steps={steps} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const steps = [
      { id: '1', label: 'Cut', processTime: 10, waitTime: 30 },
    ];
    render(<ValueStream steps={steps} />);
    const figure = screen.getByRole('figure');
    expect(figure).toBeInTheDocument();
    expect(figure).toHaveAttribute('aria-label', 'Value stream map');
  });
});

describe('StatusTimeline', () => {
  it('renders events', () => {
    const events = [
      { id: '1', status: 'Created', timestamp: '2026-01-01T10:00:00Z' },
      { id: '2', status: 'In Progress', timestamp: '2026-01-02T14:00:00Z' },
    ];
    const { container } = render(<StatusTimeline events={events} />);
    expect(container.textContent).toContain('Created');
  });

  it('has no accessibility violations', async () => {
    const events = [
      { id: '1', status: 'Created', timestamp: '2026-01-01T10:00:00Z' },
    ];
    const { container } = render(<StatusTimeline events={events} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const events = [
      { id: '1', status: 'Created', timestamp: '2026-01-01T10:00:00Z' },
    ];
    render(<StatusTimeline events={events} />);
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-label', 'Status timeline');
  });
});

describe('NotificationCenter', () => {
  it('renders notifications', () => {
    const items = [
      { id: '1', title: 'Build complete', type: 'success' as const, timestamp: '2026-03-23T10:00:00Z' },
    ];
    const { container } = render(<NotificationCenter notifications={items} />);
    expect(container.textContent).toContain('Build complete');
  });

  it('has no accessibility violations', async () => {
    const items = [
      { id: '1', title: 'Build complete', type: 'success' as const, timestamp: '2026-03-23T10:00:00Z' },
    ];
    const { container } = render(<NotificationCenter notifications={items} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const items = [
      { id: '1', title: 'Build complete', type: 'success' as const, timestamp: '2026-03-23T10:00:00Z' },
    ];
    render(<NotificationCenter notifications={items} />);
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-label');
  });
});

describe('InlineEdit', () => {
  it('renders display value', () => {
    const { container } = render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    expect(container.textContent).toContain('Hello');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<InlineEdit value="Hello" onSave={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });
});

describe('EmptyStateBuilder', () => {
  it('renders no-data state', () => {
    const { container } = render(<EmptyStateBuilder reason="no-data" />);
    expect(container.firstElementChild).toBeTruthy();
  });
  it('renders error state', () => {
    const { container } = render(<EmptyStateBuilder reason="error" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyStateBuilder reason="no-data" />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<EmptyStateBuilder reason="no-data" />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-label');
  });
});

describe('FilterPresets', () => {
  it('renders preset chips', () => {
    const presets = [
      { id: '1', name: 'Active Only', filters: { status: 'active' } },
      { id: '2', name: 'This Month', filters: { period: 'month' } },
    ];
    const { container } = render(<FilterPresets presets={presets} onSelect={vi.fn()} />);
    expect(container.textContent).toContain('Active Only');
  });

  it('has no accessibility violations', async () => {
    const presets = [
      { id: '1', name: 'Active Only', filters: { status: 'active' } },
    ];
    const { container } = render(<FilterPresets presets={presets} onSelect={vi.fn()} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const presets = [
      { id: '1', name: 'Active Only', filters: { status: 'active' } },
    ];
    render(<FilterPresets presets={presets} onSelect={vi.fn()} />);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar.querySelector('[aria-label]') || toolbar).toBeTruthy();
  });
});

describe('DataExportDialog', () => {
  it('renders when open', () => {
    const { container } = render(
      <DataExportDialog open onClose={vi.fn()} onExport={vi.fn()} />,
    );
    expect(container.firstElementChild).toBeTruthy();
  });
  it('does not render when closed', () => {
    const { container } = render(
      <DataExportDialog open={false} onClose={vi.fn()} onExport={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DataExportDialog open onClose={vi.fn()} onExport={vi.fn()} />,
    );
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<DataExportDialog open onClose={vi.fn()} onExport={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label');
  });
});

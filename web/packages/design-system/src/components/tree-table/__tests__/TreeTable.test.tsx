// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeTable, type TreeTableNode, type TreeTableColumn } from '../TreeTable';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

type RowData = { amount: string };

const columns: TreeTableColumn<RowData>[] = [
  { key: 'amount', label: 'Amount' },
];

const nodes: TreeTableNode<RowData>[] = [
  {
    key: 'root',
    label: 'Root Node',
    data: { amount: '100' },
    children: [
      { key: 'child1', label: 'Child One', data: { amount: '50' } },
      { key: 'child2', label: 'Child Two', data: { amount: '50' } },
    ],
  },
  { key: 'leaf', label: 'Leaf Node', data: { amount: '200' } },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('TreeTable — temel render', () => {
  it('section ve table elementlerini render eder', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('kolon basliklarini gosterir', () => {
    render(<TreeTable nodes={nodes} columns={columns} />);
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('varsayilan tree kolon basligi "Structure" dir', () => {
    render(<TreeTable nodes={nodes} columns={columns} />);
    expect(screen.getByText('Structure')).toBeInTheDocument();
  });

  it('treeColumnLabel ile ozellestirilir', () => {
    render(<TreeTable nodes={nodes} columns={columns} treeColumnLabel="Hierarchy" />);
    expect(screen.getByText('Hierarchy')).toBeInTheDocument();
  });

  it('node etiketlerini gosterir', () => {
    render(<TreeTable nodes={nodes} columns={columns} />);
    expect(screen.getByText('Root Node')).toBeInTheDocument();
    expect(screen.getByText('Leaf Node')).toBeInTheDocument();
  });

  it('title ve description gosterilir', () => {
    render(<TreeTable nodes={nodes} columns={columns} title="My Tree" description="Details" />);
    expect(screen.getByText('My Tree')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Expand / Collapse                                                  */
/* ------------------------------------------------------------------ */

describe('TreeTable — expand/collapse', () => {
  it('varsayilan olarak children gizlidir', () => {
    render(<TreeTable nodes={nodes} columns={columns} />);
    expect(screen.queryByText('Child One')).not.toBeInTheDocument();
  });

  it('expand butonuna tiklandiginda children gorunur olur', async () => {
    render(<TreeTable nodes={nodes} columns={columns} />);
    const expandBtn = screen.getByLabelText('Expand branch');
    await userEvent.click(expandBtn);
    expect(screen.getByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  it('collapse butonuna tiklandiginda children gizlenir', async () => {
    render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['root']} />);
    expect(screen.getByText('Child One')).toBeInTheDocument();
    const collapseBtn = screen.getByLabelText('Collapse branch');
    await userEvent.click(collapseBtn);
    expect(screen.queryByText('Child One')).not.toBeInTheDocument();
  });

  it('defaultExpandedKeys ile baslangicta acik olur', () => {
    render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['root']} />);
    expect(screen.getByText('Child One')).toBeInTheDocument();
  });

  it('onExpandedKeysChange cagrilir', async () => {
    const handler = vi.fn();
    render(<TreeTable nodes={nodes} columns={columns} onExpandedKeysChange={handler} />);
    const expandBtn = screen.getByLabelText('Expand branch');
    await userEvent.click(expandBtn);
    expect(handler).toHaveBeenCalledWith(['root']);
  });
});

/* ------------------------------------------------------------------ */
/*  Node selection                                                     */
/* ------------------------------------------------------------------ */

describe('TreeTable — node selection', () => {
  it('onNodeSelect verildiginde node tiklanabilir', async () => {
    const handler = vi.fn();
    render(<TreeTable nodes={nodes} columns={columns} onNodeSelect={handler} />);
    await userEvent.click(screen.getByText('Leaf Node'));
    expect(handler).toHaveBeenCalledWith('leaf');
  });

  it('selectedKey ile secili satir vurgulanir', () => {
    const { container } = render(
      <TreeTable nodes={nodes} columns={columns} selectedKey="leaf" onNodeSelect={vi.fn()} />,
    );
    const selectedBtn = container.querySelector('[aria-current="true"]');
    expect(selectedBtn).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Column data resolution                                             */
/* ------------------------------------------------------------------ */

describe('TreeTable — column data', () => {
  it('data accessor ile hucre degerini cozumler', () => {
    render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['root']} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getAllByText('50')).toHaveLength(2);
  });

  it('render fonksiyonu ile ozel hucre render edilir', () => {
    const customCols: TreeTableColumn<RowData>[] = [
      { key: 'amount', label: 'Amount', render: (node) => <span data-testid="custom">{String(node.data?.amount)}</span> },
    ];
    render(<TreeTable nodes={[nodes[1]]} columns={customCols} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading & empty state                                              */
/* ------------------------------------------------------------------ */

describe('TreeTable — loading & empty', () => {
  it('loading durumunda skeleton satirlari render edilir', () => {
    const { container } = render(<TreeTable nodes={[]} columns={columns} loading />);
    expect(container.querySelectorAll('tr').length).toBeGreaterThan(1);
  });

  it('bos nodes ile empty state gosterilir', () => {
    const { container } = render(<TreeTable nodes={[]} columns={columns} />);
    expect(container.querySelector('[data-component="tree-table"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('TreeTable — access control', () => {
  it('access="hidden" durumunda hicbir sey render edilmez', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} access="disabled" />);
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} accessReason="No access" />);
    expect(container.querySelector('section')).toHaveAttribute('title', 'No access');
  });

  it('disabled node tiklandiginda onNodeSelect calismaz', async () => {
    const handler = vi.fn();
    const disabledNodes: TreeTableNode<RowData>[] = [
      { key: 'x', label: 'Disabled Node', disabled: true, data: { amount: '0' } },
    ];
    render(<TreeTable nodes={disabledNodes} columns={columns} onNodeSelect={handler} />);
    await userEvent.click(screen.getByText('Disabled Node'));
    expect(handler).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('TreeTable — edge cases', () => {
  it('fullWidth=false durumunda w-full class uygulanmaz', () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} fullWidth={false} />);
    expect(container.querySelector('section')?.className ?? '').not.toContain('w-full');
  });

  it('node badges render edilir', () => {
    const badgedNodes: TreeTableNode<RowData>[] = [
      { key: 'b', label: 'Badged', badges: ['Active'], data: { amount: '0' } },
    ];
    render(<TreeTable nodes={badgedNodes} columns={columns} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

describe('TreeTable — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TreeTable nodes={nodes} columns={columns} />);
    await expectNoA11yViolations(container);
  });
});

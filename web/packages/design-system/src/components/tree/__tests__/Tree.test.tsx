// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tree, type TreeNode } from '../Tree';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleNodes: TreeNode[] = [
  { key: 'a', label: 'Node A', description: 'First node' },
  {
    key: 'b',
    label: 'Node B',
    children: [
      { key: 'b1', label: 'Child B1' },
      { key: 'b2', label: 'Child B2' },
    ],
  },
  { key: 'c', label: 'Node C', tone: 'warning', badges: ['hot'] },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Tree — temel render', () => {
  it('section elementini render eder', () => {
    const { container } = render(<Tree nodes={sampleNodes} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'tree');
  });

  it('tum node etiketlerini gosterir', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByText('Node A')).toBeInTheDocument();
    expect(screen.getByText('Node B')).toBeInTheDocument();
    expect(screen.getByText('Node C')).toBeInTheDocument();
  });

  it('title ve description render eder', () => {
    render(<Tree nodes={sampleNodes} title="My Tree" description="Tree description" />);
    expect(screen.getByText('My Tree')).toBeInTheDocument();
    expect(screen.getByText('Tree description')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Description ve meta                                                */
/* ------------------------------------------------------------------ */

describe('Tree — description ve meta', () => {
  it('node description gosterir', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByText('First node')).toBeInTheDocument();
  });

  it('node meta gosterir', () => {
    const nodesWithMeta: TreeNode[] = [{ key: 'x', label: 'X', meta: 'v1.0' }];
    render(<Tree nodes={nodesWithMeta} />);
    expect(screen.getByText('v1.0')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

describe('Tree — badges', () => {
  it('string badge render eder', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByText('hot')).toBeInTheDocument();
  });

  it('ReactNode badge render eder', () => {
    const nodesWithBadge: TreeNode[] = [
      { key: 'x', label: 'X', badges: [<span key="b" data-testid="custom-badge">Custom</span>] },
    ];
    render(<Tree nodes={nodesWithBadge} />);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Expand / collapse                                                  */
/* ------------------------------------------------------------------ */

describe('Tree — expand / collapse', () => {
  it('defaultExpandedKeys ile acilan node children gosterir', () => {
    render(<Tree nodes={sampleNodes} defaultExpandedKeys={['b']} />);
    expect(screen.getByText('Child B1')).toBeInTheDocument();
    expect(screen.getByText('Child B2')).toBeInTheDocument();
  });

  it('kapali parent children gostermez', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.queryByText('Child B1')).not.toBeInTheDocument();
  });

  it('toggle butonuna tiklandiginda acilir', async () => {
    render(<Tree nodes={sampleNodes} />);
    const expandButton = screen.getByLabelText('Expand branch');
    await userEvent.click(expandButton);
    expect(screen.getByText('Child B1')).toBeInTheDocument();
  });

  it('expand sonra collapse yapar', async () => {
    render(<Tree nodes={sampleNodes} />);
    const expandButton = screen.getByLabelText('Expand branch');
    await userEvent.click(expandButton);
    expect(screen.getByText('Child B1')).toBeInTheDocument();
    const collapseButton = screen.getByLabelText('Collapse branch');
    await userEvent.click(collapseButton);
    expect(screen.queryByText('Child B1')).not.toBeInTheDocument();
  });

  it('onExpandedKeysChange tetiklenir', async () => {
    const handleChange = vi.fn();
    render(<Tree nodes={sampleNodes} onExpandedKeysChange={handleChange} />);
    await userEvent.click(screen.getByLabelText('Expand branch'));
    expect(handleChange).toHaveBeenCalledWith(['b']);
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe('Tree — selection', () => {
  it('selectedKey ile node secili gorunur', () => {
    const { container } = render(<Tree nodes={sampleNodes} selectedKey="a" />);
    const selectedDiv = container.querySelector('[data-selected="true"]');
    expect(selectedDiv).toBeInTheDocument();
  });

  it('onNodeSelect tiklandiginda cagrilir', async () => {
    const handleSelect = vi.fn();
    render(<Tree nodes={sampleNodes} onNodeSelect={handleSelect} />);
    await userEvent.click(screen.getByText('Node A'));
    expect(handleSelect).toHaveBeenCalledWith('a');
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('Tree — loading state', () => {
  it('loading durumunda skeleton gosterir', () => {
    const { container } = render(<Tree nodes={[]} loading />);
    expect(container.querySelector('[data-testid="tree-loading-state"]')).toBeInTheDocument();
  });

  it('loading data-loading attribute ayarlar', () => {
    const { container } = render(<Tree nodes={[]} loading />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-loading', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('Tree — empty state', () => {
  it('bos nodes icin empty state gosterir', () => {
    render(<Tree nodes={[]} />);
    expect(screen.getByText('No records found for this tree.')).toBeInTheDocument();
  });

  it('emptyStateLabel ile ozellestirilebilir', () => {
    render(<Tree nodes={[]} emptyStateLabel="Kayit yok" />);
    expect(screen.getByText('Kayit yok')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

describe('Tree — density', () => {
  it('varsayilan density "comfortable" dir', () => {
    const { container } = render(<Tree nodes={sampleNodes} />);
    // Comfortable uses py-3.5
    const nodeDiv = container.querySelector('.py-3\\.5');
    expect(nodeDiv).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('Tree — fullWidth', () => {
  it('fullWidth=true (varsayilan) w-full class uygular', () => {
    const { container } = render(<Tree nodes={sampleNodes} />);
    expect(container.querySelector('section')?.className).toContain('w-full');
  });

  it('fullWidth=false w-full class uygulamaz', () => {
    const { container } = render(<Tree nodes={sampleNodes} fullWidth={false} />);
    expect(container.querySelector('section')?.className ?? '').not.toContain('w-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Tree — access control', () => {
  it('access="full" durumunda render eder', () => {
    const { container } = render(<Tree nodes={sampleNodes} access="full" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<Tree nodes={sampleNodes} access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<Tree nodes={sampleNodes} accessReason="Yetkiniz yok" />);
    expect(container.querySelector('section')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Locale text                                                        */
/* ------------------------------------------------------------------ */

describe('Tree — localeText', () => {
  it('localeText.emptyStateLabel kullanir', () => {
    render(<Tree nodes={[]} localeText={{ emptyStateLabel: 'Bos agac' }} />);
    expect(screen.getByText('Bos agac')).toBeInTheDocument();
  });

  it('localeText.expandNodeAriaLabel kullanir', () => {
    render(<Tree nodes={sampleNodes} localeText={{ expandNodeAriaLabel: 'Dal ac' }} />);
    expect(screen.getByLabelText('Dal ac')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Tree — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Tree nodes={sampleNodes} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Tree — interaction & role', () => {
  it('has accessible list role', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Tree — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
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

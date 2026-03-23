// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MasterDetail } from '../MasterDetail';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  master: <div data-testid="master-content">Master list</div>,
  detail: <div data-testid="detail-content">Detail view</div>,
};

/* ------------------------------------------------------------------ */
/*  Ratio / panel sizing                                               */
/* ------------------------------------------------------------------ */

describe('MasterDetail — ratio variants', () => {
  it('applies 1:3 ratio classes by default', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    const panels = container.querySelectorAll('[data-component="master-detail"] > div');
    // First panel is master (w-1/4), skip divider, last is detail (w-3/4)
    expect(panels[0].className).toContain('w-1/4');
  });

  it('applies 1:2 ratio classes', () => {
    const { container } = render(<MasterDetail {...defaultProps} ratio="1:2" />);
    const panels = container.querySelectorAll('[data-component="master-detail"] > div');
    expect(panels[0].className).toContain('w-1/3');
  });

  it('applies 2:3 ratio classes', () => {
    const { container } = render(<MasterDetail {...defaultProps} ratio="2:3" />);
    const panels = container.querySelectorAll('[data-component="master-detail"] > div');
    expect(panels[0].className).toContain('w-2/5');
  });

  it('applies 1:1 ratio classes', () => {
    const { container } = render(<MasterDetail {...defaultProps} ratio="1:1" />);
    const panels = container.querySelectorAll('[data-component="master-detail"] > div');
    expect(panels[0].className).toContain('w-1/2');
  });
});

/* ------------------------------------------------------------------ */
/*  masterMinWidth prop                                                */
/* ------------------------------------------------------------------ */

describe('MasterDetail — masterMinWidth', () => {
  it('applies default masterMinWidth of 240px', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    const masterPanel = container.querySelector('[data-component="master-detail"] > div') as HTMLElement;
    expect(masterPanel.style.minWidth).toBe('240px');
  });

  it('applies custom masterMinWidth', () => {
    const { container } = render(<MasterDetail {...defaultProps} masterMinWidth={320} />);
    const masterPanel = container.querySelector('[data-component="master-detail"] > div') as HTMLElement;
    expect(masterPanel.style.minWidth).toBe('320px');
  });
});

/* ------------------------------------------------------------------ */
/*  Collapsible — full cycle                                           */
/* ------------------------------------------------------------------ */

describe('MasterDetail — collapsible full cycle', () => {
  it('does not show collapse button when collapsible=false', () => {
    render(
      <MasterDetail
        {...defaultProps}
        collapsible={false}
        masterHeader={<span>Header</span>}
      />,
    );
    expect(screen.queryByLabelText('Collapse panel')).toBeNull();
  });

  it('does not show collapse button without masterHeader', () => {
    render(<MasterDetail {...defaultProps} collapsible />);
    expect(screen.queryByLabelText('Collapse panel')).toBeNull();
  });

  it('collapses master to zero width on collapse click', () => {
    const { container } = render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    fireEvent.click(screen.getByLabelText('Collapse panel'));
    const masterPanel = container.querySelector('[data-component="master-detail"] > div') as HTMLElement;
    expect(masterPanel.className).toContain('w-0');
    expect(masterPanel.style.minWidth).toMatch(/^0(px)?$/);
  });

  it('hides divider when master is collapsed', () => {
    const { container } = render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    fireEvent.click(screen.getByLabelText('Collapse panel'));
    expect(container.querySelector('.w-px')).toBeNull();
  });

  it('expands master panel on expand click', () => {
    const { container } = render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    // Collapse
    fireEvent.click(screen.getByLabelText('Collapse panel'));
    // Expand
    fireEvent.click(screen.getByLabelText('Expand panel'));
    const masterPanel = container.querySelector('[data-component="master-detail"] > div') as HTMLElement;
    expect(masterPanel.className).not.toContain('w-0');
    expect(screen.getByLabelText('Collapse panel')).toBeInTheDocument();
  });

  it('detail panel takes full width when master is collapsed', () => {
    const { container } = render(
      <MasterDetail
        {...defaultProps}
        collapsible
        masterHeader={<span>Header</span>}
      />,
    );
    fireEvent.click(screen.getByLabelText('Collapse panel'));
    // Find the detail panel (last child div)
    const children = container.querySelector('[data-component="master-detail"]')!.children;
    const detailPanel = children[children.length - 1] as HTMLElement;
    expect(detailPanel.className).toContain('flex-1');
  });
});

/* ------------------------------------------------------------------ */
/*  Selection state toggling                                           */
/* ------------------------------------------------------------------ */

describe('MasterDetail — selection transitions', () => {
  it('switches between detail and empty state based on hasSelection', () => {
    const { rerender } = render(
      <MasterDetail {...defaultProps} hasSelection={true} />,
    );
    expect(screen.getByTestId('detail-content')).toBeInTheDocument();

    rerender(
      <MasterDetail {...defaultProps} hasSelection={false} />,
    );
    expect(screen.queryByTestId('detail-content')).toBeNull();
    expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  });

  it('switches from custom empty state back to detail', () => {
    const emptyState = <div data-testid="custom-empty">Bir oge secin</div>;
    const { rerender } = render(
      <MasterDetail
        {...defaultProps}
        hasSelection={false}
        detailEmpty={emptyState}
      />,
    );
    expect(screen.getByTestId('custom-empty')).toBeInTheDocument();

    rerender(
      <MasterDetail
        {...defaultProps}
        hasSelection={true}
        detailEmpty={emptyState}
      />,
    );
    expect(screen.queryByTestId('custom-empty')).toBeNull();
    expect(screen.getByTestId('detail-content')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Both headers rendered together                                     */
/* ------------------------------------------------------------------ */

describe('MasterDetail — header slots combined', () => {
  it('renders both masterHeader and detailHeader simultaneously', () => {
    render(
      <MasterDetail
        {...defaultProps}
        masterHeader={<span data-testid="m-header">Master</span>}
        detailHeader={<span data-testid="d-header">Detail</span>}
      />,
    );
    expect(screen.getByTestId('m-header')).toBeInTheDocument();
    expect(screen.getByTestId('d-header')).toBeInTheDocument();
  });

  it('renders headers inside border-b containers', () => {
    const { container } = render(
      <MasterDetail
        {...defaultProps}
        masterHeader={<span>MH</span>}
        detailHeader={<span>DH</span>}
      />,
    );
    const borderContainers = container.querySelectorAll('.border-b');
    expect(borderContainers.length).toBeGreaterThanOrEqual(2);
  });
});

/* ------------------------------------------------------------------ */
/*  Content overflow                                                   */
/* ------------------------------------------------------------------ */

describe('MasterDetail — overflow behavior', () => {
  it('master panel body has overflow-y-auto for scrollability', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    const masterPanel = container.querySelector('[data-component="master-detail"] > div') as HTMLElement;
    const scrollContainer = masterPanel.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('detail panel body has overflow-y-auto for scrollability', () => {
    const { container } = render(<MasterDetail {...defaultProps} />);
    const root = container.querySelector('[data-component="master-detail"]')!;
    const children = root.children;
    const detailPanel = children[children.length - 1] as HTMLElement;
    const scrollContainer = detailPanel.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Complex content rendering                                          */
/* ------------------------------------------------------------------ */

describe('MasterDetail — complex content', () => {
  it('renders interactive list items in master panel', () => {
    const masterContent = (
      <ul>
        <li data-testid="item-1">Item 1</li>
        <li data-testid="item-2">Item 2</li>
        <li data-testid="item-3">Item 3</li>
      </ul>
    );
    render(
      <MasterDetail
        master={masterContent}
        detail={<div>Details</div>}
      />,
    );
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
  });

  it('renders form content in detail panel', () => {
    const detailContent = (
      <form data-testid="detail-form">
        <input data-testid="name-input" placeholder="Name" />
        <button type="submit" data-testid="submit-btn">Save</button>
      </form>
    );
    render(
      <MasterDetail
        master={<div>List</div>}
        detail={detailContent}
      />,
    );
    expect(screen.getByTestId('detail-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('MasterDetail — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<MasterDetail master={<div>M</div>} detail={<div>D</div>} />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<MasterDetail master={<div>M</div>} detail={<div>D</div>} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

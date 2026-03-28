// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailDrawer } from '../DetailDrawer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Drawer Title',
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — temel render', () => {
  it('open=true iken dialog render eder', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('open=false iken hicbir sey render etmez', () => {
    render(<DetailDrawer {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('title gosterir', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
  });

  it('subtitle gosterir', () => {
    render(<DetailDrawer {...defaultProps} subtitle="Sub text" />);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });

  it('aria-label string title ile atanir', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Drawer Title');
  });

  it('aria-modal="true" atanir', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — size proplari', () => {
  it.each([
    ['md', 'max-w-md'],
    ['lg', 'max-w-2xl'],
    ['xl', 'max-w-4xl'],
    ['full', 'max-w-full'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    render(<DetailDrawer {...defaultProps} size={size} />);
    expect(screen.getByRole('dialog').className).toContain(expectedClass);
  });

  it('varsayilan size "lg" dir', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog').className).toContain('max-w-2xl');
  });
});

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — sections', () => {
  it('sections render eder', () => {
    const sections = [
      { key: 's1', title: 'Section 1', content: <p>Content 1</p> },
      { key: 's2', title: 'Section 2', content: <p>Content 2</p> },
    ];
    render(<DetailDrawer {...defaultProps} sections={sections} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('children render eder (sections yoksa)', () => {
    render(
      <DetailDrawer {...defaultProps}>
        <p>Child content</p>
      </DetailDrawer>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Header slots                                                       */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — header slots', () => {
  it('actions render eder', () => {
    render(
      <DetailDrawer {...defaultProps} actions={<button>Edit</button>} />,
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('tags render eder', () => {
    render(
      <DetailDrawer {...defaultProps} tags={<span>Active</span>} />,
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('footer render eder', () => {
    render(
      <DetailDrawer {...defaultProps} footer={<button>Save</button>} />,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — interaction', () => {
  it('close butonuna tiklandiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    render(<DetailDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop tiklandiginda onClose cagrilir (closeOnBackdrop=true)', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailDrawer {...defaultProps} onClose={onClose} closeOnBackdrop={true} />,
    );
    const backdrop = container.querySelector('[aria-hidden]');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnBackdrop=false durumunda backdrop tiklama onClose cagirmaz', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailDrawer {...defaultProps} onClose={onClose} closeOnBackdrop={false} />,
    );
    const backdrop = container.querySelector('[aria-hidden]');
    fireEvent.click(backdrop!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Escape tusuna basildiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    render(<DetailDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<DetailDrawer {...defaultProps} className="custom-dd" />);
    expect(screen.getByRole('dialog').className).toContain('custom-dd');
  });

  /* width and height legacy props removed in v2.0.0 */
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: loading state                             */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — Faz 6 contract: loading state', () => {
  it('open=true ve children olmadan hala dialog render eder', () => {
    render(<DetailDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('sections bos array oldugunda body alani bos kalir', () => {
    render(<DetailDrawer {...defaultProps} sections={[]} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Title should still be visible
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
  });

  it('children olarak loading spinner render edilebilir', () => {
    render(
      <DetailDrawer {...defaultProps}>
        <div data-testid="loading-spinner" role="status">Yukleniyor...</div>
      </DetailDrawer>,
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Yukleniyor...')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: empty content handling                     */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — Faz 6 contract: empty content', () => {
  it('children null oldugunda crash olmaz', () => {
    expect(() => {
      render(<DetailDrawer {...defaultProps}>{null}</DetailDrawer>);
    }).not.toThrow();
  });

  it('sections undefined ve children undefined oldugunda crash olmaz', () => {
    expect(() => {
      render(<DetailDrawer {...defaultProps} sections={undefined} />);
    }).not.toThrow();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('title ve subtitle olmadan da render edilebilir (ReactNode title)', () => {
    render(
      <DetailDrawer open={true} onClose={vi.fn()} title={<span data-testid="custom-title">Ozel Baslik</span>} />,
    );
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: close button & ESC key                     */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — Faz 6 contract: close interactions', () => {
  it('close butonuna birden fazla tiklandiginda her seferinde onClose cagrilir', () => {
    const onClose = vi.fn();
    render(<DetailDrawer {...defaultProps} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close drawer');
    fireEvent.click(closeBtn);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('close butonu aria-label="Close drawer" tasir', () => {
    render(<DetailDrawer {...defaultProps} />);
    const closeBtn = screen.getByLabelText('Close drawer');
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.tagName).toBe('BUTTON');
  });

  it('open=false iken Escape tiklama onClose cagirmaz', () => {
    const onClose = vi.fn();
    render(<DetailDrawer {...defaultProps} open={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: custom footer                             */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — Faz 6 contract: custom footer', () => {
  it('birden fazla butonlu footer render eder', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        footer={
          <>
            <button>Iptal</button>
            <button>Kaydet</button>
          </>
        }
      />,
    );
    expect(screen.getByText('Iptal')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('footer olmadigi durumda footer alani render edilmez', () => {
    const { container } = render(<DetailDrawer {...defaultProps} />);
    // Footer border-t wrapper should not exist
    const footerEl = container.querySelector('.border-t.px-6.py-3');
    expect(footerEl).toBeNull();
  });

  it('footer ReactNode olarak herhangi bir icerik kabul eder', () => {
    render(
      <DetailDrawer
        {...defaultProps}
        footer={<div data-testid="custom-footer">Ozel footer icerigi</div>}
      />,
    );
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 — Keyboard & Accessibility                                  */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — Faz 3: keyboard & a11y', () => {
  it('Escape tusu drawer i kapatir', () => {
    const onClose = vi.fn();
    render(<DetailDrawer open onClose={onClose} title="KB Test" />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Tab tusu ile fokus drawer icerisinde kalir (focus trap)', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <DetailDrawer open onClose={onClose} title="Trap Test">
        <button>First</button>
        <button>Second</button>
      </DetailDrawer>,
    );

    // Dialog should receive focus on open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();

    // Tab into the close button then inner buttons — focus must stay inside dialog
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('scroll lock: body overflow hidden when drawer is open', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <DetailDrawer open onClose={onClose} title="Scroll Lock" />,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    // After unmount the cleanup should restore overflow
    expect(document.body.style.overflow).toBe('');
  });

  it('close button renders and works', () => {
    const onClose = vi.fn();
    render(<DetailDrawer open onClose={onClose} title="Close Btn" />);
    const closeBtn = screen.getByLabelText('Close drawer');
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.tagName).toBe('BUTTON');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('aria-modal="true" ve role="dialog" atanir', () => {
    render(<DetailDrawer open onClose={vi.fn()} title="A11y Test" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('role', 'dialog');
  });
});

/* ------------------------------------------------------------------ */
/*  Focus restore                                                      */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — focus restore', () => {
  it('restores focus to trigger element when closed', async () => {
    const onClose = vi.fn();
    const Wrapper = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button data-testid="trigger" onClick={() => setOpen(true)}>
            Open
          </button>
          <DetailDrawer
            open={open}
            onClose={() => { setOpen(false); onClose(); }}
            title="Focus Test"
          >
            <button>Inside</button>
          </DetailDrawer>
        </>
      );
    };

    const user = userEvent.setup();
    render(<Wrapper />);

    const trigger = screen.getByTestId('trigger');
    await user.click(trigger);

    // Drawer should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close via Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Wait for rAF focus restore
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(document.activeElement).toBe(trigger);
  });
});

/* ------------------------------------------------------------------ */
/*  A11y — axe-core                                                    */
/* ------------------------------------------------------------------ */

describe('DetailDrawer — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <DetailDrawer open onClose={vi.fn()} title="Drawer Title">
        <p>Content</p>
      </DetailDrawer>,
    );
    await expectNoA11yViolations(container);
  });
});

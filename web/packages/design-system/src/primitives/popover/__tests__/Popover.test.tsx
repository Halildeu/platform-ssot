// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Popover — temel render', () => {
  it('trigger elementini render eder', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        disablePortal
      />,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('baslangicta popover kapali olur', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        disablePortal
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('defaultOpen=true iken acik baslar', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        defaultOpen
        disablePortal
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Click interaction                                                  */
/* ------------------------------------------------------------------ */

describe('Popover — click interaction', () => {
  it('trigger tiklaninca acilir', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        triggerMode="click"
        disablePortal
      />,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('tekrar tiklaninca kapanir', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        triggerMode="click"
        disablePortal
      />,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByText('Open'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled open                                                    */
/* ------------------------------------------------------------------ */

describe('Popover — controlled', () => {
  it('open prop ile kontrol edilebilir', () => {
    const { rerender } = render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        open={false}
        disablePortal
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        open
        disablePortal
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('onOpenChange callback tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        onOpenChange={handler}
        disablePortal
      />,
    );
    await user.click(screen.getByText('Open'));
    expect(handler).toHaveBeenCalledWith(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Title                                                              */
/* ------------------------------------------------------------------ */

describe('Popover — title', () => {
  it('title prop verildiginde baslik render eder', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        title="Popover Title"
        open
        disablePortal
      />,
    );
    expect(screen.getByText('Popover Title')).toBeInTheDocument();
  });

  it('title olmadanda ariaLabel ile erisilebilir', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        ariaLabel="Info panel"
        open
        disablePortal
      />,
    );
    expect(screen.getByLabelText('Info panel')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Arrow                                                              */
/* ------------------------------------------------------------------ */

describe('Popover — arrow', () => {
  it('showArrow=true iken arrow render eder', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        showArrow
        open
        disablePortal
      />,
    );
    expect(screen.getByTestId('popover-arrow')).toBeInTheDocument();
  });

  it('showArrow=false iken arrow render etmez', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        showArrow={false}
        open
        disablePortal
      />,
    );
    expect(screen.queryByTestId('popover-arrow')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Popover — access control', () => {
  it('access="hidden" iken render etmez', () => {
    const { container } = render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        access="hidden"
        disablePortal
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" iken trigger disabled olur', () => {
    render(
      <Popover
        trigger="Open"
        content="Content"
        access="disabled"
        disablePortal
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('accessReason title olarak atanir', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        accessReason="Yetki gerekli"
        disablePortal
      />,
    );
    expect(screen.getByText('Open')).toHaveAttribute('title', 'Yetki gerekli');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Popover — a11y', () => {
  it('trigger aria-haspopup="dialog" icinde ayarlanir', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        disablePortal
      />,
    );
    expect(screen.getByText('Open')).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });

  it('trigger aria-expanded dogru guncellenir', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        triggerMode="click"
        disablePortal
      />,
    );
    const trigger = screen.getByText('Open');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Popover — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        className="custom-popover"
        disablePortal
      />,
    );
    expect(container.firstElementChild?.className).toContain('custom-popover');
  });

  it('string trigger fallback button olusturur', () => {
    render(
      <Popover
        trigger="Click here"
        content="Content"
        disablePortal
      />,
    );
    expect(screen.getByRole('button', { name: 'Click here' })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 — Keyboard & Accessibility                                  */
/* ------------------------------------------------------------------ */

describe('Popover — Faz 3: keyboard & a11y', () => {
  it('trigger tiklaninca acilir', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Panel content"
        triggerMode="click"
        disablePortal
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('Escape tusu popover i kapatir', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        triggerMode="click"
        disablePortal
      />,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dis alana tiklandiginda popover kapanir (outside click)', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover
          trigger={<button>Open</button>}
          content="Content"
          triggerMode="click"
          disablePortal
        />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('varsayilan olarak asagi yonde konumlanir (side="bottom")', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        open
        disablePortal
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
  });

  it('showArrow=true oldugunda arrow render eder', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        showArrow
        open
        disablePortal
      />,
    );
    expect(screen.getByTestId('popover-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('popover-arrow')).toHaveAttribute('aria-hidden', 'true');
  });

  it('showArrow=false oldugunda arrow render etmez', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        showArrow={false}
        open
        disablePortal
      />,
    );
    expect(screen.queryByTestId('popover-arrow')).not.toBeInTheDocument();
  });

  it('role="dialog" ve aria-modal="false" atanir (non-modal)', () => {
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        open
        disablePortal
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay Engine — useOutsideClick + useEscapeKey integration        */
/* ------------------------------------------------------------------ */

describe('Popover — overlay-engine integration', () => {
  it('outside click via overlay-engine closes popover', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover
          trigger={<button>Open</button>}
          content="Content"
          triggerMode="click"
          disablePortal
        />
        <button>External</button>
      </div>,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('External'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Escape key via overlay-engine closes popover', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content="Content"
        triggerMode="click"
        disablePortal
      />,
    );
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Popover — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        open
        disablePortal
      />,
    );
    await expectNoA11yViolations(container);
  });
});

// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Popover } from '../Popover';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Popover contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Popover.displayName).toBe('Popover');
  });

  /* ---- Renders when open=true ---- */
  it('renders content when open', () => {
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content={<p>Popover body</p>}
        open
        onOpenChange={() => {}}
        disablePortal
      />,
    );
    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });

  /* ---- Hidden when open=false ---- */
  it('does not render content when closed', () => {
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content={<p>Popover body</p>}
        open={false}
        onOpenChange={() => {}}
        disablePortal
      />,
    );
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  /* ---- Calls onOpenChange ---- */
  it('calls onOpenChange when trigger clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content={<p>Body</p>}
        onOpenChange={onOpenChange}
        disablePortal
      />,
    );
    fireEvent.click(screen.getByText('Trigger'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  /* ---- Accepts className ---- */
  it('merges custom className on root wrapper', () => {
    const { container } = render(
      <Popover
        trigger={<button>Trigger</button>}
        content="Body"
        className="custom-popover"
        disablePortal
      />,
    );
    expect(container.firstElementChild).toHaveClass('custom-popover');
  });

  /* ---- Renders trigger ---- */
  it('always renders trigger element', () => {
    render(
      <Popover
        trigger={<button>My Trigger</button>}
        content="Body"
        open={false}
        disablePortal
      />,
    );
    expect(screen.getByText('My Trigger')).toBeInTheDocument();
  });

  /* ---- Access control: full ---- */
  it('access=full renders normally', () => {
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content="Body"
        access="full"
        disablePortal
      />,
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden does not render', () => {
    const { container } = render(
      <Popover
        trigger={<button>Trigger</button>}
        content="Body"
        access="hidden"
        disablePortal
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  /* ---- Popover panel role ---- */
  it('renders panel with role=dialog when open', () => {
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content="Body"
        open
        onOpenChange={() => {}}
        disablePortal
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  /* ---- Title ---- */
  it('renders title when provided', () => {
    render(
      <Popover
        trigger={<button>Trigger</button>}
        content="Body"
        title="Pop Title"
        open
        onOpenChange={() => {}}
        disablePortal
      />,
    );
    expect(screen.getByText('Pop Title')).toBeInTheDocument();
  });
});

describe('Popover — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Popover
        trigger={<button>Trigger</button>}
        content={<p>Popover body</p>}
        open
        onOpenChange={() => {}}
        disablePortal
      />,
    );
    await expectNoA11yViolations(container);
  });
});

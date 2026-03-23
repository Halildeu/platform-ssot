// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Avatar — temel render', () => {
  it('varsayilan props ile span elementini render eder', () => {
    const { container } = render(<Avatar />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('src olmadan varsayilan kullanici ikonu gosterir', () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('varsayilan size "md" dir', () => {
    const { container } = render(<Avatar />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('h-10');
    expect(span?.className).toContain('w-10');
  });

  it('varsayilan shape "circle" dir', () => {
    const { container } = render(<Avatar />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('rounded-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Image rendering                                                    */
/* ------------------------------------------------------------------ */

describe('Avatar — image rendering', () => {
  it('src verildiginde img elementi render eder', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User" />);
    const img = screen.getByAltText('User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('alt verilmezse bos alt kullanir', () => {
    render(<Avatar src="https://example.com/photo.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', '');
  });

  it('img hatasi durumunda fallback gosterir', () => {
    render(<Avatar src="https://example.com/broken.jpg" initials="AB" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Initials                                                           */
/* ------------------------------------------------------------------ */

describe('Avatar — initials', () => {
  it('initials verildiginde harfleri gosterir', () => {
    render(<Avatar initials="HK" />);
    expect(screen.getByText('HK')).toBeInTheDocument();
  });

  it('3+ karakter verildiginde sadece ilk 2 gosterir', () => {
    render(<Avatar initials="ABC" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Custom icon                                                        */
/* ------------------------------------------------------------------ */

describe('Avatar — custom icon', () => {
  it('icon prop verildiginde onu render eder', () => {
    render(<Avatar icon={<span data-testid="custom-icon">X</span>} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Avatar — size proplari', () => {
  it.each([
    ['xs', 'h-6'],
    ['sm', 'h-8'],
    ['md', 'h-10'],
    ['lg', 'h-12'],
    ['xl', 'h-14'],
    ['2xl', 'h-16'],
  ] as const)('size="%s" dogru height class uygular', (size, expectedClass) => {
    const { container } = render(<Avatar size={size} />);
    const span = container.querySelector('span');
    expect(span?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Shape proplari                                                     */
/* ------------------------------------------------------------------ */

describe('Avatar — shape proplari', () => {
  it('shape="circle" rounded-full class uygular', () => {
    const { container } = render(<Avatar shape="circle" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('rounded-full');
  });

  it('shape="square" rounded-lg class uygular', () => {
    const { container } = render(<Avatar shape="square" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('rounded-lg');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Avatar — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Avatar className="custom-class" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Avatar data-testid="custom-avatar" />);
    expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
  });

  it('fallback onceligi: src > initials > icon > default', () => {
    // When src is provided, image should render (not initials)
    render(<Avatar src="https://example.com/photo.jpg" initials="AB" icon={<span>X</span>} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(screen.queryByText('AB')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Primitive deepening                                */
/* ------------------------------------------------------------------ */

describe('Avatar — Faz 3 Dalga 5 deepening', () => {
  /* --- Renders image when src provided --- */
  it('renders img element with correct src and alt', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="John Doe" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('img covers full avatar area', () => {
    const { container } = render(<Avatar src="https://example.com/a.jpg" />);
    const img = container.querySelector('img');
    expect(img?.className).toContain('object-cover');
    expect(img?.className).toContain('h-full');
    expect(img?.className).toContain('w-full');
  });

  /* --- Shows initials fallback when no image --- */
  it('shows initials when no src is provided', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows initials after image load error', () => {
    render(<Avatar src="https://example.com/broken.jpg" initials="XY" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('XY')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('initials are uppercased', () => {
    render(<Avatar initials="ab" />);
    expect(screen.getByText('ab').className).toContain('uppercase');
  });

  /* --- Size variants --- */
  it.each([
    ['xs', 'h-6', 'w-6'],
    ['sm', 'h-8', 'w-8'],
    ['md', 'h-10', 'w-10'],
    ['lg', 'h-12', 'w-12'],
    ['xl', 'h-14', 'w-14'],
    ['2xl', 'h-16', 'w-16'],
  ] as const)('size="%s" applies %s and %s classes', (size, hClass, wClass) => {
    const { container } = render(<Avatar size={size} />);
    const span = container.querySelector('span');
    expect(span?.className).toContain(hClass);
    expect(span?.className).toContain(wClass);
  });

  /* --- Group rendering (multiple avatars) --- */
  it('renders multiple avatars in a group container', () => {
    const { container } = render(
      <div data-testid="avatar-group" className="flex -space-x-2">
        <Avatar initials="A" data-testid="av-1" />
        <Avatar initials="B" data-testid="av-2" />
        <Avatar initials="C" data-testid="av-3" />
      </div>,
    );
    expect(screen.getByTestId('avatar-group')).toBeInTheDocument();
    expect(screen.getByTestId('av-1')).toBeInTheDocument();
    expect(screen.getByTestId('av-2')).toBeInTheDocument();
    expect(screen.getByTestId('av-3')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    // All three avatars rendered inside group
    const avatars = container.querySelectorAll('[data-testid^="av-"]');
    expect(avatars).toHaveLength(3);
  });

  /* --- Status indicator via className/child composition --- */
  it('supports status indicator via additional className', () => {
    render(
      <span className="relative inline-block">
        <Avatar data-testid="status-avatar" />
        <span
          data-testid="status-dot"
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"
        />
      </span>,
    );
    expect(screen.getByTestId('status-avatar')).toBeInTheDocument();
    const dot = screen.getByTestId('status-dot');
    expect(dot).toBeInTheDocument();
    expect(dot.className).toContain('bg-green-500');
  });

  /* --- Fallback chain: src > initials > icon > default SVG --- */
  it('when src fails, falls back to initials over icon', () => {
    render(
      <Avatar
        src="https://example.com/broken.jpg"
        initials="FK"
        icon={<span data-testid="fallback-icon">I</span>}
      />,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('FK')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback-icon')).not.toBeInTheDocument();
  });

  it('when no src and no initials, falls back to icon', () => {
    render(<Avatar icon={<span data-testid="fb-icon">U</span>} />);
    expect(screen.getByTestId('fb-icon')).toBeInTheDocument();
  });

  it('when no src, no initials, no icon, renders default user SVG', () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Avatar — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Avatar src="https://example.com/photo.jpg" alt="User avatar" />);
    await expectNoA11yViolations(container);
  });
});

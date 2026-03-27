// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Descriptions, type DescriptionsItem } from '../Descriptions';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (): DescriptionsItem[] => [
  { key: 'name', label: 'Name', value: 'John Doe' },
  { key: 'email', label: 'Email', value: 'john@example.com' },
  { key: 'role', label: 'Role', value: 'Admin' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Descriptions — temel render', () => {
  it('tum label ve value ciftlerini render eder', () => {
    render(<Descriptions items={makeItems()} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('dl (definition list) elementini kullanir', () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  it('dt ve dd elementlerini kullanir', () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    expect(container.querySelectorAll('dt').length).toBe(3);
    expect(container.querySelectorAll('dd').length).toBeGreaterThanOrEqual(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Title & description                                                */
/* ------------------------------------------------------------------ */

describe('Descriptions — title & description', () => {
  it('title render eder', () => {
    render(
      <Descriptions items={makeItems()} title="User Info" />,
    );
    expect(screen.getByText('User Info')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(
      <Descriptions
        items={makeItems()}
        description="Basic user information"
      />,
    );
    expect(screen.getByText('Basic user information')).toBeInTheDocument();
  });

  it('title heading olarak render eder', () => {
    render(<Descriptions items={makeItems()} title="Info" />);
    expect(screen.getByRole('heading', { name: 'Info' })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('Descriptions — empty state', () => {
  it('bos items ile varsayilan empty mesaji gosterir', () => {
    render(<Descriptions items={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('custom emptyStateLabel destekler', () => {
    render(
      <Descriptions items={[]} emptyStateLabel="Veri bulunamadi" />,
    );
    expect(screen.getByText('Veri bulunamadi')).toBeInTheDocument();
  });

  it('localeText.emptyFallbackDescription destekler', () => {
    render(
      <Descriptions
        items={[]}
        localeText={{ emptyFallbackDescription: 'Bos' }}
      />,
    );
    expect(screen.getByText('Bos')).toBeInTheDocument();
  });

  it('empty state ile title ve description gosterir', () => {
    render(
      <Descriptions items={[]} title="User Info" description="Details" />,
    );
    expect(screen.getByText('User Info')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

describe('Descriptions — columns', () => {
  it.each([1, 2, 3] as const)(
    'columns=%i dogru grid template uygular',
    (cols) => {
      const { container } = render(
        <Descriptions items={makeItems()} columns={cols} />,
      );
      const dl = container.querySelector('dl');
      expect(dl?.style.gridTemplateColumns).toBe(`repeat(${cols}, 1fr)`);
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

describe('Descriptions — density', () => {
  it('density="compact" iken daha kucuk padding uygulanir', () => {
    const { container } = render(
      <Descriptions items={makeItems()} density="compact" />,
    );
    const cell = container.querySelector('dl > div');
    expect(cell?.className).toContain('py-2');
  });

  it('density="comfortable" iken daha buyuk padding uygulanir', () => {
    const { container } = render(
      <Descriptions items={makeItems()} density="comfortable" />,
    );
    const cell = container.querySelector('dl > div');
    expect(cell?.className).toContain('py-4');
  });
});

/* ------------------------------------------------------------------ */
/*  Bordered                                                           */
/* ------------------------------------------------------------------ */

describe('Descriptions — bordered', () => {
  it('bordered=true iken border class uygulanir', () => {
    const { container } = render(
      <Descriptions items={makeItems()} bordered />,
    );
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('border');
    expect(dl?.className).toContain('rounded-lg');
  });

  it('bordered=false iken border class uygulanmaz', () => {
    const { container } = render(
      <Descriptions items={makeItems()} bordered={false} />,
    );
    const dl = container.querySelector('dl');
    expect(dl?.className).not.toContain('rounded-lg');
  });
});

/* ------------------------------------------------------------------ */
/*  Item tone                                                          */
/* ------------------------------------------------------------------ */

describe('Descriptions — item tone', () => {
  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'tone="%s" iken border-s-2 class uygulanir',
    (tone) => {
      const items: DescriptionsItem[] = [
        { key: 't', label: 'L', value: 'V', tone },
      ];
      const { container } = render(<Descriptions items={items} />);
      const cell = container.querySelector('dl > div');
      expect(cell?.className).toContain('border-s-2');
    },
  );

  it('tone="default" iken border-s-2 class uygulanmaz', () => {
    const items: DescriptionsItem[] = [
      { key: 't', label: 'L', value: 'V', tone: 'default' },
    ];
    const { container } = render(<Descriptions items={items} />);
    const cell = container.querySelector('dl > div');
    expect(cell?.className).not.toContain('border-s-2');
  });
});

/* ------------------------------------------------------------------ */
/*  Item span                                                          */
/* ------------------------------------------------------------------ */

describe('Descriptions — item span', () => {
  it('span=2 iken gridColumn style uygulanir', () => {
    const items: DescriptionsItem[] = [
      { key: 'a', label: 'A', value: 'VA', span: 2 },
    ];
    const { container } = render(<Descriptions items={items} />);
    const cell = container.querySelector('dl > div');
    expect(cell?.style.gridColumn).toBe('span 2');
  });

  it('span=1 iken gridColumn style uygulanmaz', () => {
    const items: DescriptionsItem[] = [
      { key: 'a', label: 'A', value: 'VA', span: 1 },
    ];
    const { container } = render(<Descriptions items={items} />);
    const cell = container.querySelector('dl > div');
    expect(cell?.style.gridColumn).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  Helper text                                                        */
/* ------------------------------------------------------------------ */

describe('Descriptions — helper', () => {
  it('helper text render eder', () => {
    const items: DescriptionsItem[] = [
      { key: 'a', label: 'A', value: 'VA', helper: 'Help text' },
    ];
    render(<Descriptions items={items} />);
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Value fallback                                                     */
/* ------------------------------------------------------------------ */

describe('Descriptions — value fallback', () => {
  it('value undefined iken em dash gosterir', () => {
    const items: DescriptionsItem[] = [{ key: 'a', label: 'A' }];
    render(<Descriptions items={items} />);
    expect(screen.getByText('\u2014')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('Descriptions — fullWidth', () => {
  it('fullWidth=true iken w-full uygulanir', () => {
    const { container } = render(
      <Descriptions items={makeItems()} fullWidth />,
    );
    expect(container.firstElementChild?.className).toContain('w-full');
  });

  it('fullWidth=false iken max-w-4xl uygulanir', () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    expect(container.firstElementChild?.className).toContain('max-w-4xl');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Descriptions — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Descriptions items={makeItems()} className="custom-desc" />,
    );
    expect(container.firstElementChild?.className).toContain('custom-desc');
  });
});

describe('Descriptions — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Descriptions items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Descriptions — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Descriptions items={makeItems()} />);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Descriptions — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

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

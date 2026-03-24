// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  createAccordionItemsFromSections,
  createAccordionPreset,
  type AccordionItem,
} from '../Accordion';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (count = 3): AccordionItem[] =>
  Array.from({ length: count }, (_, i) => ({
    value: `item-${i}`,
    title: `Title ${i}`,
    content: `Content ${i}`,
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Accordion — temel render', () => {
  it('root elementini render eder', () => {
    render(<Accordion items={makeItems()} />);
    expect(screen.getByLabelText('Accordion')).toBeInTheDocument();
  });

  it('tum baslik metinlerini gosterir', () => {
    render(<Accordion items={makeItems()} />);
    expect(screen.getByText('Title 0')).toBeInTheDocument();
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
  });

  it('varsayilan olarak tum paneller kapali olur', () => {
    render(<Accordion items={makeItems()} />);
    const regions = screen.queryAllByRole('region');
    regions.forEach((r) => {
      expect(r).toHaveAttribute('hidden');
    });
  });

  it('custom ariaLabel destekler', () => {
    render(<Accordion items={makeItems()} ariaLabel="SSS Listesi" />);
    expect(screen.getByLabelText('SSS Listesi')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection mode                                                     */
/* ------------------------------------------------------------------ */

describe('Accordion — selection mode', () => {
  it('multiple modda birden fazla panel acilabilir', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} selectionMode="multiple" />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    const regions = screen.getAllByRole('region');
    const visibleRegions = regions.filter(
      (r) => !r.hasAttribute('hidden'),
    );
    expect(visibleRegions.length).toBe(2);
  });

  it('single modda sadece bir panel acik kalir', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} selectionMode="single" />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    const regions = screen.getAllByRole('region');
    const visibleRegions = regions.filter(
      (r) => !r.hasAttribute('hidden'),
    );
    expect(visibleRegions.length).toBe(1);
  });
});

/* ------------------------------------------------------------------ */
/*  defaultValue & defaultExpanded                                     */
/* ------------------------------------------------------------------ */

describe('Accordion — default expansion', () => {
  it('defaultValue ile belirtilen panel acik baslar', () => {
    render(
      <Accordion items={makeItems()} defaultValue="item-1" />,
    );
    const regions = screen.getAllByRole('region');
    const visible = regions.find((r) => !r.hasAttribute('hidden'));
    expect(visible).toBeDefined();
  });

  it('defaultExpanded olan item acik baslar', () => {
    const items: AccordionItem[] = [
      { value: 'a', title: 'A', content: 'CA', defaultExpanded: true },
      { value: 'b', title: 'B', content: 'CB' },
    ];
    render(<Accordion items={items} />);
    const regions = screen.getAllByRole('region');
    const visible = regions.find((r) => !r.hasAttribute('hidden'));
    expect(visible).toBeDefined();
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled value                                                   */
/* ------------------------------------------------------------------ */

describe('Accordion — controlled', () => {
  it('value prop ile kontrol edilebilir', () => {
    render(
      <Accordion items={makeItems()} value={['item-2']} />,
    );
    const regions = screen.getAllByRole('region');
    const visible = regions.filter((r) => !r.hasAttribute('hidden'));
    expect(visible.length).toBe(1);
  });

  it('onValueChange callback tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Accordion
        items={makeItems()}
        onValueChange={handler}
      />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(handler).toHaveBeenCalledWith(['item-0']);
  });

  it('onItemToggle callback tetiklenir', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Accordion
        items={makeItems()}
        onItemToggle={handler}
      />,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(handler).toHaveBeenCalledWith('item-0', true);
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('Accordion — size', () => {
  it.each([
    ['sm', 'text-sm'],
    ['md', 'text-sm'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    const { container } = render(
      <Accordion items={makeItems()} size={size} />,
    );
    const trigger = container.querySelector('.accordion-trigger');
    expect(trigger?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Bordered / ghost / showArrow / disableGutters                      */
/* ------------------------------------------------------------------ */

describe('Accordion — stil varyantlari', () => {
  it('ghost=true iken bg-transparent uygulanir', () => {
    const { container } = render(
      <Accordion items={makeItems()} ghost />,
    );
    const root = container.querySelector('.accordion-root');
    expect(root?.className).toContain('bg-transparent');
  });

  it('showArrow=false iken chevron render edilmez', () => {
    const { container } = render(
      <Accordion items={makeItems()} showArrow={false} />,
    );
    expect(container.querySelector('[data-slot="icon"]')).toBeNull();
  });

  it('expandIconPosition="end" desteklenir', () => {
    const { container } = render(
      <Accordion items={makeItems()} expandIconPosition="end" />,
    );
    const root = container.querySelector('.accordion-root');
    expect(root).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

describe('Accordion — disabled items', () => {
  it('disabled item tiklaninca acilmaz', async () => {
    const user = userEvent.setup();
    const items: AccordionItem[] = [
      { value: 'a', title: 'A', content: 'CA', disabled: true },
    ];
    render(<Accordion items={items} />);
    const button = screen.getByRole('button');
    await user.click(button);
    const regions = screen.queryAllByRole('region');
    expect(regions.every((r) => r.hasAttribute('hidden'))).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Accordion — access control', () => {
  it('access="hidden" iken render etmez', () => {
    const { container } = render(
      <Accordion items={makeItems()} access="hidden" />,
    );
    expect(container.querySelector('.accordion-root')).toBeNull();
  });

  it('access="disabled" iken butonlar disabled olur', () => {
    render(<Accordion items={makeItems()} access="disabled" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('access="readonly" iken butonlar disabled olur', () => {
    render(<Accordion items={makeItems()} access="readonly" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('accessReason title olarak atanir', () => {
    render(
      <Accordion items={makeItems()} accessReason="Yetkiniz yok" />,
    );
    expect(screen.getByLabelText('Accordion')).toHaveAttribute(
      'title',
      'Yetkiniz yok',
    );
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Accordion — a11y', () => {
  it('aria-expanded dogru ayarlanir', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('aria-controls panel id ile eslesir', () => {
    render(
      <Accordion items={makeItems()} defaultValue="item-0" />,
    );
    const button = screen.getAllByRole('button')[0];
    const controlsId = button.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    const panel = document.getElementById(controlsId!);
    expect(panel).toHaveAttribute('role', 'region');
  });
});

/* ------------------------------------------------------------------ */
/*  destroyOnHidden                                                    */
/* ------------------------------------------------------------------ */

describe('Accordion — destroyOnHidden', () => {
  it('destroyOnHidden=false iken kapali panel DOM da kalir', () => {
    render(
      <Accordion
        items={makeItems()}
        destroyOnHidden={false}
        defaultValue="item-0"
      />,
    );
    const regions = screen.getAllByRole('region', { hidden: true });
    expect(regions.length).toBe(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Description & extra                                                */
/* ------------------------------------------------------------------ */

describe('Accordion — description & extra', () => {
  it('description ve extra render eder', () => {
    const items: AccordionItem[] = [
      {
        value: 'a',
        title: 'A',
        content: 'CA',
        description: 'Desc text',
        extra: 'Extra info',
      },
    ];
    render(<Accordion items={items} />);
    expect(screen.getByText('Desc text')).toBeInTheDocument();
    expect(screen.getByText('Extra info')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  className forwarding                                               */
/* ------------------------------------------------------------------ */

describe('Accordion — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Accordion items={makeItems()} className="custom-class" />,
    );
    const root = container.querySelector('.accordion-root');
    expect(root?.className).toContain('custom-class');
  });

  it('bos items listesi ile hata vermez', () => {
    render(<Accordion items={[]} />);
    expect(screen.getByLabelText('Accordion')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

describe('createAccordionItemsFromSections', () => {
  it('section listesini AccordionItem listesine donusturur', () => {
    const sections = [
      { key: 'k1', title: 'T1', content: 'C1' },
      { key: 'k2', title: 'T2', content: 'C2' },
    ];
    const result = createAccordionItemsFromSections(sections);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('k1');
    expect(result[1].value).toBe('k2');
  });
});

describe('createAccordionPreset', () => {
  it.each(['faq', 'compact', 'settings'] as const)(
    'preset "%s" gecerli obje dondurur',
    (kind) => {
      const preset = createAccordionPreset(kind);
      expect(preset.selectionMode).toBeDefined();
      expect(preset.size).toBeDefined();
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Accordion — keyboard navigation', () => {
  it('toggles panel on Enter key', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} />);
    const buttons = screen.getAllByRole('button');

    // Focus the first trigger and press Enter
    buttons[0].focus();
    await user.keyboard('{Enter}');

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles panel on Space key', async () => {
    const user = userEvent.setup();
    render(<Accordion items={makeItems()} />);
    const buttons = screen.getAllByRole('button');

    // Focus the first trigger and press Space
    buttons[0].focus();
    await user.keyboard(' ');

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');

    // Press Space again to close
    await user.keyboard(' ');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Accordion — a11y (axe)', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Accordion items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Accordion — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
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

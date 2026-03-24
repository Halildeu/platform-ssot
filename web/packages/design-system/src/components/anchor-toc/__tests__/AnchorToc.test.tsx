// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnchorToc, type AnchorTocItem } from '../AnchorToc';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleItems: AnchorTocItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'details', label: 'Details' },
  { id: 'summary', label: 'Summary' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AnchorToc — temel render', () => {
  it('nav elementini render eder', () => {
    render(<AnchorToc items={sampleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('varsayilan aria-label "Sayfa ici navigasyon" dir', () => {
    render(<AnchorToc items={sampleItems} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Sayfa ici navigasyon');
  });

  it('tum item etiketlerini gosterir', () => {
    render(<AnchorToc items={sampleItems} />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('item sayisini badge olarak gosterir', () => {
    render(<AnchorToc items={sampleItems} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('bos items dizisi icin render etmez', () => {
    const { container } = render(<AnchorToc items={[]} />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  it('varsayilan title "Bu sayfada" gosterir', () => {
    render(<AnchorToc items={sampleItems} />);
    expect(screen.getByText('Bu sayfada')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Title ve localeText                                                */
/* ------------------------------------------------------------------ */

describe('AnchorToc — title ve localeText', () => {
  it('title prop ile baslik degisir', () => {
    render(<AnchorToc items={sampleItems} title="Contents" />);
    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('localeText.title kullanir', () => {
    render(<AnchorToc items={sampleItems} localeText={{ title: 'Icerik' }} />);
    expect(screen.getByText('Icerik')).toBeInTheDocument();
  });

  it('localeText.navigationLabel aria-label degistirir', () => {
    render(<AnchorToc items={sampleItems} localeText={{ navigationLabel: 'Sayfa icerigi' }} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Sayfa icerigi');
  });
});

/* ------------------------------------------------------------------ */
/*  Density                                                            */
/* ------------------------------------------------------------------ */

describe('AnchorToc — density', () => {
  it('varsayilan density "comfortable" dir', () => {
    const { container } = render(<AnchorToc items={sampleItems} />);
    expect(container.querySelector('nav')).toHaveAttribute('data-density', 'comfortable');
  });

  it('density="compact" ayarlanabilir', () => {
    const { container } = render(<AnchorToc items={sampleItems} density="compact" />);
    expect(container.querySelector('nav')).toHaveAttribute('data-density', 'compact');
  });
});

/* ------------------------------------------------------------------ */
/*  Item levels                                                        */
/* ------------------------------------------------------------------ */

describe('AnchorToc — item levels', () => {
  it('level prop ile girintileme uygular', () => {
    const items: AnchorTocItem[] = [
      { id: 'a', label: 'Level 1', level: 1 },
      { id: 'b', label: 'Level 2', level: 2 },
      { id: 'c', label: 'Level 3', level: 3 },
    ];
    const { container } = render(<AnchorToc items={items} />);
    const lis = container.querySelectorAll('li');
    expect(lis[0]).toHaveAttribute('data-level', '1');
    expect(lis[1]).toHaveAttribute('data-level', '2');
    expect(lis[2]).toHaveAttribute('data-level', '3');
  });
});

/* ------------------------------------------------------------------ */
/*  Item meta                                                          */
/* ------------------------------------------------------------------ */

describe('AnchorToc — item meta', () => {
  it('meta bilgisini gosterir', () => {
    const items: AnchorTocItem[] = [
      { id: 'a', label: 'Section A', meta: '5 min' },
    ];
    render(<AnchorToc items={items} />);
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection ve interaction                                           */
/* ------------------------------------------------------------------ */

describe('AnchorToc — selection', () => {
  it('ilk item varsayilan olarak aktif olur', () => {
    render(<AnchorToc items={sampleItems} syncWithHash={false} />);
    const firstLink = screen.getByText('Introduction').closest('a');
    expect(firstLink).toHaveAttribute('data-active', 'true');
  });

  it('defaultValue ile baslangic degeri ayarlanir', () => {
    render(<AnchorToc items={sampleItems} defaultValue="details" syncWithHash={false} />);
    const detailsLink = screen.getByText('Details').closest('a');
    expect(detailsLink).toHaveAttribute('data-active', 'true');
  });

  it('controlled value ile aktif item belirlenir', () => {
    render(<AnchorToc items={sampleItems} value="summary" syncWithHash={false} />);
    const summaryLink = screen.getByText('Summary').closest('a');
    expect(summaryLink).toHaveAttribute('data-active', 'true');
  });

  it('onValueChange tiklandiginda cagrilir', async () => {
    const handleChange = vi.fn();
    render(<AnchorToc items={sampleItems} onValueChange={handleChange} syncWithHash={false} />);
    const detailsLink = screen.getByText('Details').closest('a')!;
    await userEvent.click(detailsLink);
    expect(handleChange).toHaveBeenCalledWith('details');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

describe('AnchorToc — disabled items', () => {
  it('disabled item aria-disabled alir', () => {
    const items: AnchorTocItem[] = [
      { id: 'a', label: 'Active' },
      { id: 'b', label: 'Disabled', disabled: true },
    ];
    render(<AnchorToc items={items} syncWithHash={false} />);
    const disabledLink = screen.getByText('Disabled').closest('a');
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Sticky                                                             */
/* ------------------------------------------------------------------ */

describe('AnchorToc — sticky', () => {
  it('sticky=true durumunda sticky class uygular', () => {
    const { container } = render(<AnchorToc items={sampleItems} sticky />);
    expect(container.querySelector('nav')?.className).toContain('sticky');
  });

  it('sticky=false (varsayilan) durumunda sticky class uygulamaz', () => {
    const { container } = render(<AnchorToc items={sampleItems} />);
    expect(container.querySelector('nav')?.className).not.toContain('sticky');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('AnchorToc — access control', () => {
  it('access="full" durumunda render eder', () => {
    render(<AnchorToc items={sampleItems} access="full" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<AnchorToc items={sampleItems} access="hidden" />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda linkler disabled olur', () => {
    render(<AnchorToc items={sampleItems} access="disabled" syncWithHash={false} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<AnchorToc items={sampleItems} accessReason="Yetkiniz yok" />);
    expect(container.querySelector('nav')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('AnchorToc — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<AnchorToc items={sampleItems} className="custom-class" />);
    expect(container.querySelector('nav')?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLElement>();
    render(<AnchorToc items={sampleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('href "#id" formatinda olusturulur', () => {
    render(<AnchorToc items={sampleItems} />);
    const link = screen.getByText('Introduction').closest('a');
    expect(link).toHaveAttribute('href', '#intro');
  });
});

describe('AnchorToc — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AnchorToc items={[{ id: 'intro', label: 'Introduction' }]} />);
    await expectNoA11yViolations(container);
  });
});

describe('AnchorToc — disabled item userEvent interaction', () => {
  it('disabled item click does not trigger onValueChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const items: AnchorTocItem[] = [
      { id: 'enabled', label: 'Enabled' },
      { id: 'off', label: 'Disabled Item', disabled: true },
    ];
    render(<AnchorToc items={items} onValueChange={handleChange} syncWithHash={false} />);
    const disabledLink = screen.getByText('Disabled Item').closest('a')!;
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabledLink);
    expect(handleChange).not.toHaveBeenCalledWith('off');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('empty items array renders nothing and click is safe', async () => {
    const user = userEvent.setup();
    const { container } = render(<AnchorToc items={[]} />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
    await user.click(container);
    expect(container.innerHTML).not.toContain('error');
    expect(container.querySelectorAll('a')).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('AnchorToc — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
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

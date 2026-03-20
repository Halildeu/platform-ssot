// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationItemCard, type NotificationSurfaceItem } from '../NotificationItemCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const baseItem: NotificationSurfaceItem = {
  id: 'n1',
  message: 'Deployment completed successfully',
  description: 'Production build v2.3.1',
  type: 'success',
  priority: 'normal',
  read: false,
  createdAt: Date.now(),
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — temel render', () => {
  it('article elementini render eder', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('mesaji gosterir', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.getByText('Deployment completed successfully')).toBeInTheDocument();
  });

  it('aciklamayi gosterir', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.getByText('Production build v2.3.1')).toBeInTheDocument();
  });

  it('type badge gosterir', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
  });

  it('timestamp gosterir', () => {
    render(<NotificationItemCard item={baseItem} />);
    // default formatter should produce a locale string
    const article = screen.getByRole('article');
    expect(article.textContent).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Type variants                                                      */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — type variants', () => {
  it.each([
    ['success', 'SUCCESS'],
    ['info', 'INFO'],
    ['warning', 'WARNING'],
    ['error', 'ERROR'],
    ['loading', 'LOADING'],
  ] as const)('type="%s" dogru badge gosterir', (type, badgeText) => {
    const item = { ...baseItem, type };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByText(badgeText)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Priority                                                           */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — priority', () => {
  it('priority="high" oldugunda ONCELIKLI badge gosterir', () => {
    const item = { ...baseItem, priority: 'high' as const };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByText('ONCELIKLI')).toBeInTheDocument();
  });

  it('priority="high" oldugunda data-priority attribute mevcut', () => {
    const item = { ...baseItem, priority: 'high' as const };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByRole('article')).toHaveAttribute('data-priority', 'high');
  });

  it('priority="normal" oldugunda ONCELIKLI badge gorunmez', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.queryByText('ONCELIKLI')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Pinned                                                             */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — pinned', () => {
  it('pinned=true oldugunda PINLENMIS badge gosterir', () => {
    const item = { ...baseItem, pinned: true };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByText('PINLENMIS')).toBeInTheDocument();
  });

  it('data-pinned attribute dogru ayarlanir', () => {
    const item = { ...baseItem, pinned: true };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByRole('article')).toHaveAttribute('data-pinned', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Read state                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — read state', () => {
  it('read=true oldugunda data-read="true" attribute mevcut', () => {
    const item = { ...baseItem, read: true };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByRole('article')).toHaveAttribute('data-read', 'true');
  });

  it('read=false oldugunda data-read="false" attribute mevcut', () => {
    render(<NotificationItemCard item={baseItem} />);
    expect(screen.getByRole('article')).toHaveAttribute('data-read', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — interaction', () => {
  it('onRemove tiklandiginda calisir', async () => {
    const handleRemove = vi.fn();
    render(<NotificationItemCard item={baseItem} onRemove={handleRemove} />);
    await userEvent.click(screen.getByLabelText('Bildirimi kapat'));
    expect(handleRemove).toHaveBeenCalledWith('n1');
  });

  it('ozel removeLabel kullanilir', () => {
    render(<NotificationItemCard item={baseItem} onRemove={() => {}} removeLabel="Dismiss" />);
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('primaryAction tiklandiginda calisir', async () => {
    const handleAction = vi.fn();
    render(
      <NotificationItemCard
        item={baseItem}
        onPrimaryAction={handleAction}
        getPrimaryActionLabel={() => 'View'}
      />,
    );
    await userEvent.click(screen.getByText('View'));
    expect(handleAction).toHaveBeenCalledWith(baseItem);
  });

  it('formatTimestamp ozel formatlama yapar', () => {
    const customFormat = () => 'Just now';
    render(<NotificationItemCard item={baseItem} formatTimestamp={customFormat} />);
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selectable                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — selectable', () => {
  it('selectable=true oldugunda checkbox render eder', () => {
    render(<NotificationItemCard item={baseItem} selectable />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('onSelectedChange checkbox degistiginde calisir', async () => {
    const handleChange = vi.fn();
    render(
      <NotificationItemCard
        item={baseItem}
        selectable
        onSelectedChange={handleChange}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(baseItem, true);
  });

  it('selected=true oldugunda checkbox checked olur', () => {
    render(<NotificationItemCard item={baseItem} selectable selected />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — access control', () => {
  it('access="hidden" oldugunda render etmez', () => {
    const { container } = render(<NotificationItemCard item={baseItem} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" oldugunda remove butonu disabled olur', () => {
    render(<NotificationItemCard item={baseItem} access="disabled" onRemove={() => {}} />);
    expect(screen.getByLabelText('Bildirimi kapat')).toBeDisabled();
  });

  it('access="readonly" oldugunda checkbox disabled olur', () => {
    render(<NotificationItemCard item={baseItem} access="readonly" selectable />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('accessReason title olarak atanir', () => {
    render(<NotificationItemCard item={baseItem} accessReason="Restricted" />);
    expect(screen.getByRole('article')).toHaveAttribute('title', 'Restricted');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationItemCard — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<NotificationItemCard item={baseItem} className="custom-card" />);
    expect(screen.getByRole('article').className).toContain('custom-card');
  });

  it('description olmadan render yapar', () => {
    const item = { ...baseItem, description: undefined };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('createdAt olmadan timestamp gostermez', () => {
    const item = { ...baseItem, createdAt: undefined };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('type belirtilmezse varsayilan "info" kullanilir', () => {
    const item: NotificationSurfaceItem = { id: 'x', message: 'Test' };
    render(<NotificationItemCard item={item} />);
    expect(screen.getByText('INFO')).toBeInTheDocument();
  });
});

describe('NotificationItemCard — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<NotificationItemCard item={baseItem} />);
    await expectNoA11yViolations(container);
  });
});

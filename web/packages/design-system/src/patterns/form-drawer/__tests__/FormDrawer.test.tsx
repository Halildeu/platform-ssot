// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDrawer } from '../FormDrawer';
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
  title: 'Form Title',
  children: <input placeholder="Name" />,
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('FormDrawer — temel render', () => {
  it('open=true iken dialog render eder', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('open=false iken hicbir sey render etmez', () => {
    render(<FormDrawer {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('title gosterir', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByText('Form Title')).toBeInTheDocument();
  });

  it('subtitle gosterir', () => {
    render(<FormDrawer {...defaultProps} subtitle="Fill in the form" />);
    expect(screen.getByText('Fill in the form')).toBeInTheDocument();
  });

  it('children render eder', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  it('aria-modal="true" atanir', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-label string title ile atanir', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Form Title');
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('FormDrawer — size proplari', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-xl'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    render(<FormDrawer {...defaultProps} size={size} />);
    expect(screen.getByRole('dialog').className).toContain(expectedClass);
  });

  it('varsayilan size "md" dir', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog').className).toContain('max-w-md');
  });
});

/* ------------------------------------------------------------------ */
/*  Placement                                                          */
/* ------------------------------------------------------------------ */

describe('FormDrawer — placement', () => {
  it('varsayilan placement "right" dir (ml-auto)', () => {
    render(<FormDrawer {...defaultProps} />);
    expect(screen.getByRole('dialog').className).toContain('ml-auto');
  });

  it('placement="left" durumunda mr-auto class uygular', () => {
    render(<FormDrawer {...defaultProps} placement="left" />);
    expect(screen.getByRole('dialog').className).toContain('mr-auto');
  });
});

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

describe('FormDrawer — footer', () => {
  it('footer render eder', () => {
    render(
      <FormDrawer {...defaultProps} footer={<button>Submit</button>} />,
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('footer yoksa footer alani render etmez', () => {
    const { container } = render(<FormDrawer {...defaultProps} />);
    // Footer has border-t class
    expect(container.querySelector('.border-t')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('FormDrawer — loading state', () => {
  it('loading durumunda spinner render eder', () => {
    const { container } = render(<FormDrawer {...defaultProps} loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('loading olmadigi durumda spinner render etmez', () => {
    const { container } = render(<FormDrawer {...defaultProps} loading={false} />);
    expect(container.querySelector('.animate-spin')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('FormDrawer — interaction', () => {
  it('close butonuna tiklandiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    render(<FormDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop tiklandiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    const { container } = render(
      <FormDrawer {...defaultProps} onClose={onClose} />,
    );
    const backdrop = container.querySelector('[aria-hidden]');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnBackdrop=false durumunda backdrop tiklama onClose cagirmaz', () => {
    const onClose = vi.fn();
    const { container } = render(
      <FormDrawer {...defaultProps} onClose={onClose} closeOnBackdrop={false} />,
    );
    const backdrop = container.querySelector('[aria-hidden]');
    fireEvent.click(backdrop!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Escape tusuna basildiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    render(<FormDrawer {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false durumunda Escape onClose cagirmaz', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer {...defaultProps} onClose={onClose} closeOnEscape={false} />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('FormDrawer — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<FormDrawer {...defaultProps} className="custom-fd" />);
    expect(screen.getByRole('dialog').className).toContain('custom-fd');
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: loading state                             */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: loading state', () => {
  it('loading=true durumunda spinner overlay render eder', () => {
    const { container } = render(<FormDrawer {...defaultProps} loading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('loading=false durumunda spinner render etmez', () => {
    const { container } = render(<FormDrawer {...defaultProps} loading={false} />);
    expect(container.querySelector('.animate-spin')).toBeNull();
  });

  it('loading durumunda children hala render edilir (overlay mantigi)', () => {
    render(<FormDrawer {...defaultProps} loading />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  it('loading varsayilan olarak false gelir', () => {
    const { container } = render(<FormDrawer {...defaultProps} />);
    expect(container.querySelector('.animate-spin')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: empty form                                */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: empty form', () => {
  it('children null oldugunda crash olmaz', () => {
    expect(() => {
      render(
        <FormDrawer open={true} onClose={vi.fn()} title="Empty">
          {null}
        </FormDrawer>,
      );
    }).not.toThrow();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('children undefined oldugunda crash olmaz', () => {
    expect(() => {
      render(
        <FormDrawer open={true} onClose={vi.fn()} title="Empty">
          {undefined}
        </FormDrawer>,
      );
    }).not.toThrow();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('children bos fragment oldugunda dialog hala render edilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Empty">
        <></>
      </FormDrawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: submit/cancel callbacks                    */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: submit/cancel callbacks', () => {
  it('footer icerisindeki submit butonuna tiklandiginda onSubmit cagrilir', () => {
    const onSubmit = vi.fn();
    render(
      <FormDrawer
        {...defaultProps}
        footer={
          <>
            <button onClick={defaultProps.onClose}>Iptal</button>
            <button onClick={onSubmit}>Kaydet</button>
          </>
        }
      />,
    );
    fireEvent.click(screen.getByText('Kaydet'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('footer icerisindeki iptal butonuna tiklandiginda onClose cagrilir', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer
        {...defaultProps}
        onClose={onClose}
        footer={
          <>
            <button onClick={onClose}>Iptal</button>
            <button>Kaydet</button>
          </>
        }
      />,
    );
    fireEvent.click(screen.getByText('Iptal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close butonu (X) onClose cagrilir — footer mevcutken de calisir', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer
        {...defaultProps}
        onClose={onClose}
        footer={<button>Kaydet</button>}
      />,
    );
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape tusu onClose cagrilir — footer mevcutken de calisir', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer
        {...defaultProps}
        onClose={onClose}
        footer={<button>Kaydet</button>}
      />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: readonly/disabled mode                     */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: readonly/disabled mode', () => {
  it('disabled input drawer icerisinde disabled olarak render edilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Readonly Form">
        <input placeholder="Disabled field" disabled />
      </FormDrawer>,
    );
    expect(screen.getByPlaceholderText('Disabled field')).toBeDisabled();
  });

  it('readonly input drawer icerisinde readonly olarak render edilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Readonly Form">
        <input placeholder="Readonly field" readOnly />
      </FormDrawer>,
    );
    expect(screen.getByPlaceholderText('Readonly field')).toHaveAttribute('readonly');
  });

  it('disabled select drawer icerisinde disabled olarak render edilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Disabled Select">
        <select data-testid="disabled-select" disabled>
          <option>Option 1</option>
        </select>
      </FormDrawer>,
    );
    expect(screen.getByTestId('disabled-select')).toBeDisabled();
  });

  it('disabled buton footer icerisinde disabled olarak render edilir', () => {
    render(
      <FormDrawer
        open={true}
        onClose={vi.fn()}
        title="Disabled Footer"
        footer={<button disabled>Kaydet</button>}
      />,
    );
    expect(screen.getByText('Kaydet')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: custom footer                             */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: custom footer', () => {
  it('birden fazla butonlu footer render eder', () => {
    render(
      <FormDrawer
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
    const { container } = render(<FormDrawer {...defaultProps} />);
    // Footer has border-t class on wrapper
    const footerAreas = container.querySelectorAll('.border-t');
    expect(footerAreas.length).toBe(0);
  });

  it('footer ReactNode olarak herhangi bir icerik kabul eder', () => {
    render(
      <FormDrawer
        {...defaultProps}
        footer={<div data-testid="custom-footer">Ozel footer icerigi</div>}
      />,
    );
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('footer icerisinde link render edilebilir', () => {
    render(
      <FormDrawer
        {...defaultProps}
        footer={<a href="#help">Yardim</a>}
      />,
    );
    expect(screen.getByText('Yardim')).toBeInTheDocument();
    expect(screen.getByText('Yardim').tagName).toBe('A');
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: form validation / error state              */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 6 contract: form validation', () => {
  it('hata mesaji children icerisinde render edilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Validation">
        <input placeholder="Email" aria-invalid="true" />
        <span role="alert">Gecersiz email adresi</span>
      </FormDrawer>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Gecersiz email adresi')).toBeInTheDocument();
  });

  it('aria-invalid input drawer icerisinde dogru yansitilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Validation">
        <input placeholder="Email" aria-invalid="true" />
      </FormDrawer>,
    );
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('birden fazla hata mesaji ayni anda render edilebilir', () => {
    render(
      <FormDrawer open={true} onClose={vi.fn()} title="Validation">
        <div>
          <input placeholder="Ad" aria-invalid="true" />
          <span role="alert">Ad zorunludur</span>
        </div>
        <div>
          <input placeholder="Email" aria-invalid="true" />
          <span role="alert">Email zorunludur</span>
        </div>
      </FormDrawer>,
    );
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(screen.getByText('Ad zorunludur')).toBeInTheDocument();
    expect(screen.getByText('Email zorunludur')).toBeInTheDocument();
  });

  it('hata durumunda form hala submit edilebilir (footer aktif)', () => {
    const onSubmit = vi.fn();
    render(
      <FormDrawer
        open={true}
        onClose={vi.fn()}
        title="Validation"
        footer={<button onClick={onSubmit}>Kaydet</button>}
      >
        <input placeholder="Email" aria-invalid="true" />
        <span role="alert">Gecersiz email</span>
      </FormDrawer>,
    );
    fireEvent.click(screen.getByText('Kaydet'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 — Keyboard & Accessibility                                  */
/* ------------------------------------------------------------------ */

describe('FormDrawer — Faz 3: keyboard & a11y', () => {
  it('Escape tusu drawer i kapatir', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer open onClose={onClose} title="KB Test">
        <input placeholder="Field" />
      </FormDrawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Tab tusu ile fokus drawer icerisinde kalir (focus trap)', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <FormDrawer open onClose={onClose} title="Trap Test">
        <button>First</button>
        <button>Second</button>
      </FormDrawer>,
    );

    // Dialog should receive focus on open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();

    // Tab through focusable elements — focus must stay inside dialog
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
      <FormDrawer open onClose={onClose} title="Scroll Lock">
        <p>Content</p>
      </FormDrawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('close button renders and works', () => {
    const onClose = vi.fn();
    render(
      <FormDrawer open onClose={onClose} title="Close Btn">
        <p>Content</p>
      </FormDrawer>,
    );
    const closeBtn = screen.getByLabelText('Close drawer');
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.tagName).toBe('BUTTON');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('aria-modal="true" ve role="dialog" atanir', () => {
    render(
      <FormDrawer open onClose={vi.fn()} title="A11y Test">
        <p>Content</p>
      </FormDrawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('role', 'dialog');
  });
});

/* ------------------------------------------------------------------ */
/*  IP-09 — Submit flow interaction tests (userEvent)                  */
/* ------------------------------------------------------------------ */

describe('FormDrawer — interaction: submit flow', () => {
  it('form alanlari doldurulup submit butonuna tiklandiginda onSubmit dogru data ile cagirilir', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const formData: Record<string, string> = {};
    const onSubmit = vi.fn(() => {
      formData.name = (document.querySelector('[placeholder="Ad"]') as HTMLInputElement)?.value;
      formData.email = (document.querySelector('[placeholder="Email"]') as HTMLInputElement)?.value;
    });

    render(
      <FormDrawer
        open
        onClose={onClose}
        title="Yeni Kullanici"
        footer={
          <>
            <button onClick={onClose}>Iptal</button>
            <button onClick={onSubmit}>Kaydet</button>
          </>
        }
      >
        <div>
          <label htmlFor="name-field">Ad</label>
          <input id="name-field" placeholder="Ad" />
        </div>
        <div>
          <label htmlFor="email-field">Email</label>
          <input id="email-field" placeholder="Email" />
        </div>
      </FormDrawer>,
    );

    // Dialog acik olmali
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Alanlari doldur
    const nameInput = screen.getByPlaceholderText('Ad');
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(nameInput, 'Ahmet Yilmaz');
    await user.type(emailInput, 'ahmet@example.com');

    // Degerler dogru ayarlanmis olmali
    expect((nameInput as HTMLInputElement).value).toBe('Ahmet Yilmaz');
    expect((emailInput as HTMLInputElement).value).toBe('ahmet@example.com');

    // Submit butonuna tikla
    await user.click(screen.getByText('Kaydet'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(formData.name).toBe('Ahmet Yilmaz');
    expect(formData.email).toBe('ahmet@example.com');
  });

  it('iptal butonuna tiklandiginda onClose cagirilir ve form submit edilmez', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <FormDrawer
        open
        onClose={onClose}
        title="Iptal Test"
        footer={
          <>
            <button onClick={onClose}>Iptal</button>
            <button onClick={onSubmit}>Kaydet</button>
          </>
        }
      >
        <input placeholder="Alan" />
      </FormDrawer>,
    );

    await user.type(screen.getByPlaceholderText('Alan'), 'veri');
    await user.click(screen.getByText('Iptal'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('X butonuna tiklandiginda drawer kapatilir', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <FormDrawer
        open
        onClose={onClose}
        title="X Close Test"
        footer={<button>Kaydet</button>}
      >
        <input placeholder="Alan" />
      </FormDrawer>,
    );

    await user.type(screen.getByPlaceholderText('Alan'), 'test');
    await user.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape tusu ile drawer kapatilir (submit flow sirasinda)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <FormDrawer
        open
        onClose={onClose}
        title="Escape Test"
        footer={<button onClick={onSubmit}>Kaydet</button>}
      >
        <input placeholder="Alan" />
      </FormDrawer>,
    );

    await user.type(screen.getByPlaceholderText('Alan'), 'test');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('birden fazla alan doldurulup sirayla submit edilebilir', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <FormDrawer
        open
        onClose={vi.fn()}
        title="Multi Field"
        footer={<button onClick={onSubmit}>Gonder</button>}
      >
        <input placeholder="Baslik" />
        <input placeholder="Aciklama" />
        <input placeholder="Kategori" />
      </FormDrawer>,
    );

    await user.type(screen.getByPlaceholderText('Baslik'), 'Test Baslik');
    await user.type(screen.getByPlaceholderText('Aciklama'), 'Test Aciklama');
    await user.type(screen.getByPlaceholderText('Kategori'), 'Genel');

    expect((screen.getByPlaceholderText('Baslik') as HTMLInputElement).value).toBe('Test Baslik');
    expect((screen.getByPlaceholderText('Aciklama') as HTMLInputElement).value).toBe('Test Aciklama');
    expect((screen.getByPlaceholderText('Kategori') as HTMLInputElement).value).toBe('Genel');

    await user.click(screen.getByText('Gonder'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Focus restore                                                      */
/* ------------------------------------------------------------------ */

describe('FormDrawer — focus restore', () => {
  it('restores focus to trigger element when closed', async () => {
    const onClose = vi.fn();
    const Wrapper = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button data-testid="trigger" onClick={() => setOpen(true)}>
            Open
          </button>
          <FormDrawer
            open={open}
            onClose={() => { setOpen(false); onClose(); }}
            title="Focus Test"
          >
            <input placeholder="Field" />
          </FormDrawer>
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

describe('FormDrawer — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <FormDrawer open onClose={vi.fn()} title="Form Title">
        <input placeholder="Name" />
      </FormDrawer>,
    );
    await expectNoA11yViolations(container);
  });
});

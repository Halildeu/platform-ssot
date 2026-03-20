// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdaptiveForm, type FormField } from '../AdaptiveForm';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ---- Helpers ---- */

const textField = (overrides: Partial<FormField> = {}): FormField => ({
  key: 'name',
  type: 'text',
  label: 'Ad',
  ...overrides,
});

const selectField = (overrides: Partial<FormField> = {}): FormField => ({
  key: 'category',
  type: 'select',
  label: 'Kategori',
  options: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
  ],
  ...overrides,
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — temel render', () => {
  it('form elementini data-component ile render eder', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} />,
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-component', 'adaptive-form');
  });

  it('field label gosterir', () => {
    render(<AdaptiveForm fields={[textField()]} />);
    expect(screen.getByText('Ad')).toBeInTheDocument();
  });

  it('required field yildiz isareti gosterir', () => {
    render(<AdaptiveForm fields={[textField({ required: true })]} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('field description gosterir', () => {
    render(
      <AdaptiveForm fields={[textField({ description: 'Adinizi giriniz' })]} />,
    );
    expect(screen.getByText('Adinizi giriniz')).toBeInTheDocument();
  });

  it('submit butonu varsayilan "Gonder" etiketi gosterir', () => {
    render(<AdaptiveForm fields={[textField()]} />);
    expect(screen.getByText('Gonder')).toBeInTheDocument();
  });

  it('ozel submitLabel gosterir', () => {
    render(<AdaptiveForm fields={[textField()]} submitLabel="Kaydet" />);
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} access="hidden" />,
    );
    expect(container.querySelector('form')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state="disabled" atar', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} access="disabled" />,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('access="readonly" durumunda input disabled olur', () => {
    render(<AdaptiveForm fields={[textField()]} access="readonly" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('access="full" durumunda data-access-state="full" atar', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} access="full" />,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-access-state', 'full');
  });
});

/* ------------------------------------------------------------------ */
/*  Conditional fields (dependsOn)                                     */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — dependsOn', () => {
  it('dependency karsilanmadiginda field gizlenir', () => {
    const fields: FormField[] = [
      selectField({ key: 'type', label: 'Tip' }),
      textField({ key: 'detail', label: 'Detay', dependsOn: { field: 'type', value: 'a' } }),
    ];
    const { container } = render(<AdaptiveForm fields={fields} />);
    expect(container.querySelector('[data-field-key="detail"]')).not.toBeInTheDocument();
  });

  it('dependency karsilandiginda field gosterilir', () => {
    const fields: FormField[] = [
      selectField({ key: 'type', label: 'Tip' }),
      textField({ key: 'detail', label: 'Detay', dependsOn: { field: 'type', value: 'a' } }),
    ];
    const { container } = render(
      <AdaptiveForm fields={fields} values={{ type: 'a' }} />,
    );
    expect(container.querySelector('[data-field-key="detail"]')).toBeInTheDocument();
  });

  it('boolean dependency true kontrolu calisir', () => {
    const fields: FormField[] = [
      { key: 'agreed', type: 'checkbox', label: 'Kabul' },
      textField({ key: 'extra', label: 'Ek', dependsOn: { field: 'agreed', value: true } }),
    ];
    const { container } = render(
      <AdaptiveForm fields={fields} values={{ agreed: true }} />,
    );
    expect(container.querySelector('[data-field-key="extra"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — validation', () => {
  it('zorunlu alan bos gonderildiginde hata mesaji gosterir', async () => {
    render(
      <AdaptiveForm
        fields={[textField({ required: true })]}
        onSubmit={() => {}}
      />,
    );
    await userEvent.click(screen.getByText('Gonder'));
    expect(screen.getByRole('alert')).toHaveTextContent('Ad zorunludur');
  });

  it('pattern validation hatasi gosterir', async () => {
    const fields: FormField[] = [
      textField({
        key: 'email',
        label: 'E-posta',
        validation: { pattern: '^[^@]+@[^@]+$', message: 'Gecersiz e-posta' },
      }),
    ];
    render(
      <AdaptiveForm fields={fields} values={{ email: 'invalid' }} onSubmit={() => {}} />,
    );
    await userEvent.click(screen.getByText('Gonder'));
    expect(screen.getByRole('alert')).toHaveTextContent('Gecersiz e-posta');
  });

  it('gecerli deger ile hata mesaji gostermez', async () => {
    const onSubmit = vi.fn();
    render(
      <AdaptiveForm
        fields={[textField({ required: true })]}
        values={{ name: 'Halil' }}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.click(screen.getByText('Gonder'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Halil' });
  });

  it('min uzunluk validasyonu calisir', async () => {
    const fields: FormField[] = [
      textField({
        validation: { min: 3, message: 'En az 3 karakter' },
      }),
    ];
    render(
      <AdaptiveForm fields={fields} values={{ name: 'AB' }} onSubmit={() => {}} />,
    );
    await userEvent.click(screen.getByText('Gonder'));
    expect(screen.getByRole('alert')).toHaveTextContent('En az 3 karakter');
  });
});

/* ------------------------------------------------------------------ */
/*  Reset                                                              */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — reset', () => {
  it('showReset=true oldugunda sifirla butonu gosterir', () => {
    render(<AdaptiveForm fields={[textField()]} showReset />);
    expect(screen.getByText('Sifirla')).toBeInTheDocument();
  });

  it('showReset=false oldugunda sifirla butonu gostermez', () => {
    render(<AdaptiveForm fields={[textField()]} />);
    expect(screen.queryByText('Sifirla')).not.toBeInTheDocument();
  });

  it('ozel resetLabel gosterir', () => {
    render(<AdaptiveForm fields={[textField()]} showReset resetLabel="Temizle" />);
    expect(screen.getByText('Temizle')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — loading', () => {
  it('loading durumunda skeleton gosterir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} loading />,
    );
    expect(container.querySelector('form')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — layout', () => {
  it('varsayilan layout vertical dir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} />,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-layout', 'vertical');
  });

  it('inline layout dogrulanir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} layout="inline" />,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-layout', 'inline');
  });

  it('horizontal layout dogrulanir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} layout="horizontal" />,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-layout', 'horizontal');
  });
});

/* ------------------------------------------------------------------ */
/*  Field types                                                        */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — field types', () => {
  it('select field seciniz placeholder gosterir', () => {
    render(<AdaptiveForm fields={[selectField()]} />);
    expect(screen.getByText('Seciniz')).toBeInTheDocument();
  });

  it('select field ozel placeholder gosterir', () => {
    render(
      <AdaptiveForm fields={[selectField({ placeholder: 'Bir kategori sec' })]} />,
    );
    expect(screen.getByText('Bir kategori sec')).toBeInTheDocument();
  });

  it('textarea field render eder', () => {
    render(
      <AdaptiveForm
        fields={[{ key: 'note', type: 'textarea', label: 'Not' }]}
      />,
    );
    expect(screen.getByText('Not')).toBeInTheDocument();
  });

  it('checkbox field render eder', () => {
    render(
      <AdaptiveForm
        fields={[{ key: 'agree', type: 'checkbox', label: 'Kabul ediyorum' }]}
      />,
    );
    expect(screen.getByText('Kabul ediyorum')).toBeInTheDocument();
  });

  it('radio field secenekleri gosterir', () => {
    render(
      <AdaptiveForm
        fields={[
          {
            key: 'color',
            type: 'radio',
            label: 'Renk',
            options: [
              { label: 'Kirmizi', value: 'red' },
              { label: 'Mavi', value: 'blue' },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('Kirmizi')).toBeInTheDocument();
    expect(screen.getByText('Mavi')).toBeInTheDocument();
  });

  it('number field render eder', () => {
    render(
      <AdaptiveForm
        fields={[{ key: 'count', type: 'number', label: 'Miktar' }]}
      />,
    );
    expect(screen.getByText('Miktar')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Defensive guards                                                   */
/* ------------------------------------------------------------------ */

describe('AdaptiveForm — defensive', () => {
  it('bos fields array ile crash olmaz', () => {
    expect(() => {
      render(<AdaptiveForm fields={[]} />);
    }).not.toThrow();
  });

  it('className propi form elementine eklenir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} className="my-form" />,
    );
    expect(container.querySelector('form')?.className).toContain('my-form');
  });

  it('accessReason title attribute olarak aktarilir', () => {
    const { container } = render(
      <AdaptiveForm fields={[textField()]} accessReason="Yetki gerekli" />,
    );
    expect(container.querySelector('form')).toHaveAttribute('title', 'Yetki gerekli');
  });

  it('defaultValue degerler dogru sekilde set edilir', () => {
    render(
      <AdaptiveForm fields={[textField({ defaultValue: 'varsayilan' })]} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('varsayilan');
  });
});

describe('AdaptiveForm — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AdaptiveForm fields={[{ key: 'name', type: 'text', label: 'Name' }]} />);
    await expectNoA11yViolations(container);
  });
});

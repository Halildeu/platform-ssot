// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptComposer } from '../PromptComposer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('PromptComposer — temel render', () => {
  it('varsayilan title render eder', () => {
    render(<PromptComposer />);
    expect(screen.getByText('Prompt olusturucu')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<PromptComposer />);
    expect(container.querySelector('[data-component="prompt-composer"]')).toBeInTheDocument();
  });

  it('section elementini render eder', () => {
    const { container } = render(<PromptComposer />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('Prompt title ve Prompt body labellarini gosterir', () => {
    render(<PromptComposer />);
    expect(screen.getByText('Prompt title')).toBeInTheDocument();
    expect(screen.getByText('Prompt body')).toBeInTheDocument();
  });

  it('Scope ve Tone sectionlarini gosterir', () => {
    render(<PromptComposer />);
    expect(screen.getByText('Scope')).toBeInTheDocument();
    expect(screen.getByText('Tone')).toBeInTheDocument();
  });

  it('Current contract badge gosterir', () => {
    render(<PromptComposer />);
    expect(screen.getByText('Current contract')).toBeInTheDocument();
    expect(screen.getByText('scope: general')).toBeInTheDocument();
    expect(screen.getByText('tone: neutral')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Scope & tone buttons                                               */
/* ------------------------------------------------------------------ */

describe('PromptComposer — scope & tone', () => {
  it('scope butonlarini render eder', () => {
    render(<PromptComposer />);
    expect(screen.getByText('general')).toBeInTheDocument();
    expect(screen.getByText('approval')).toBeInTheDocument();
    expect(screen.getByText('policy')).toBeInTheDocument();
    expect(screen.getByText('release')).toBeInTheDocument();
  });

  it('tone butonlarini render eder', () => {
    render(<PromptComposer />);
    expect(screen.getByText('neutral')).toBeInTheDocument();
    expect(screen.getByText('strict')).toBeInTheDocument();
    expect(screen.getByText('exploratory')).toBeInTheDocument();
  });

  it('scope degistirince onScopeChange cagirilir', async () => {
    const handler = vi.fn();
    render(<PromptComposer onScopeChange={handler} />);
    await userEvent.click(screen.getByText('approval'));
    expect(handler).toHaveBeenCalledWith('approval');
  });

  it('tone degistirince onToneChange cagirilir', async () => {
    const handler = vi.fn();
    render(<PromptComposer onToneChange={handler} />);
    await userEvent.click(screen.getByText('strict'));
    expect(handler).toHaveBeenCalledWith('strict');
  });
});

/* ------------------------------------------------------------------ */
/*  Guardrails & citations                                             */
/* ------------------------------------------------------------------ */

describe('PromptComposer — guardrails & citations', () => {
  it('guardrails render eder', () => {
    render(<PromptComposer guardrails={['No PII', 'Max 500 tokens']} />);
    expect(screen.getByText('Guardrails')).toBeInTheDocument();
    expect(screen.getByText('No PII')).toBeInTheDocument();
    expect(screen.getByText('Max 500 tokens')).toBeInTheDocument();
  });

  it('guardrails bos iken section render etmez', () => {
    render(<PromptComposer guardrails={[]} />);
    expect(screen.queryByText('Guardrails')).not.toBeInTheDocument();
  });

  it('citations render eder', () => {
    render(<PromptComposer citations={['RFC-42', 'DOC-7']} />);
    expect(screen.getByText('Source anchors')).toBeInTheDocument();
    expect(screen.getByText('RFC-42')).toBeInTheDocument();
    expect(screen.getByText('DOC-7')).toBeInTheDocument();
  });

  it('citations bos iken section render etmez', () => {
    render(<PromptComposer citations={[]} />);
    expect(screen.queryByText('Source anchors')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled vs uncontrolled                                         */
/* ------------------------------------------------------------------ */

describe('PromptComposer — controlled mode', () => {
  it('ozel title ve description render eder', () => {
    render(
      <PromptComposer title="Custom title" description="Custom desc" />,
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom desc')).toBeInTheDocument();
  });

  it('footerNote render eder', () => {
    render(<PromptComposer footerNote="Draft saved" />);
    expect(screen.getByText('Draft saved')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('PromptComposer — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<PromptComposer access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" durumunda scope butonlari disabled olur', () => {
    render(<PromptComposer access="disabled" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('access="readonly" durumunda scope degisikligi engellenir', async () => {
    const handler = vi.fn();
    render(<PromptComposer access="readonly" onScopeChange={handler} />);
    await userEvent.click(screen.getByText('approval'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('accessReason title olarak section a atanir', () => {
    const { container } = render(
      <PromptComposer accessReason="Viewer role" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'Viewer role');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(<PromptComposer access="full" />);
    expect(container.querySelector('[data-access-state="full"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('PromptComposer — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<PromptComposer className="extra-class" />);
    expect(container.querySelector('section')?.className).toContain('extra-class');
  });

  it('chars badge varsayilan 0 gosterir', () => {
    render(<PromptComposer />);
    expect(screen.getByText('chars: 0')).toBeInTheDocument();
  });
});

describe('PromptComposer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PromptComposer />);
    await expectNoA11yViolations(container);
  });
});

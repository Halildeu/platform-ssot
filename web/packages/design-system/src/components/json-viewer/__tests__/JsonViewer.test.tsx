// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JsonViewer } from '../JsonViewer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('JsonViewer — temel render', () => {
  it('section elementini render eder', () => {
    const { container } = render(<JsonViewer value={{ key: 'value' }} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'json-viewer');
  });

  it('undefined value durumunda empty state gosterir', () => {
    render(<JsonViewer value={undefined} />);
    expect(screen.getByText('No JSON payload available.')).toBeInTheDocument();
  });

  it('title ve description render eder', () => {
    render(<JsonViewer value={{ a: 1 }} title="My JSON" description="Some data" />);
    expect(screen.getByText('My JSON')).toBeInTheDocument();
    expect(screen.getByText('Some data')).toBeInTheDocument();
  });

  it('rootLabel varsayilan olarak "payload" kullanir', () => {
    render(<JsonViewer value={{ a: 1 }} />);
    expect(screen.getByText('payload')).toBeInTheDocument();
  });

  it('rootLabel ozellestirilir', () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="data" />);
    expect(screen.getByText('data')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Primitive degerler                                                 */
/* ------------------------------------------------------------------ */

describe('JsonViewer — primitive degerler', () => {
  it('string degeri tirnak icinde gosterir', () => {
    render(<JsonViewer value="hello" rootLabel="val" />);
    expect(screen.getByText('"hello"')).toBeInTheDocument();
  });

  it('number degeri gosterir', () => {
    render(<JsonViewer value={42} rootLabel="val" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('boolean degeri gosterir', () => {
    render(<JsonViewer value={true} rootLabel="val" />);
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('null degeri gosterir', () => {
    render(<JsonViewer value={null} rootLabel="val" />);
    // "null" appears as both value text and type badge
    const nullTexts = screen.getAllByText('null');
    expect(nullTexts.length).toBeGreaterThanOrEqual(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Type badges                                                        */
/* ------------------------------------------------------------------ */

describe('JsonViewer — type badges', () => {
  it('showTypes=true (varsayilan) badge gosterir', () => {
    render(<JsonViewer value="hello" rootLabel="val" />);
    expect(screen.getByText('string')).toBeInTheDocument();
  });

  it('showTypes=false badge gizler', () => {
    render(<JsonViewer value="hello" rootLabel="val" showTypes={false} />);
    expect(screen.queryByText('string')).not.toBeInTheDocument();
  });

  it('null icin "null" badge gosterir', () => {
    render(<JsonViewer value={null} rootLabel="val" />);
    // "null" appears as both value and type badge
    const nullTexts = screen.getAllByText('null');
    expect(nullTexts.length).toBeGreaterThanOrEqual(2);
  });

  it('array icin "array" badge gosterir', () => {
    render(<JsonViewer value={[1, 2]} rootLabel="val" />);
    expect(screen.getByText('array')).toBeInTheDocument();
  });

  it('object icin "object" badge gosterir', () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="val" />);
    expect(screen.getByText('object')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Expand / collapse                                                  */
/* ------------------------------------------------------------------ */

describe('JsonViewer — expand / collapse', () => {
  it('defaultExpandedDepth=0 ise ilk seviye kapali olur', () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="root" defaultExpandedDepth={0} />);
    // Collapsed: child key "a" should not be visible
    expect(screen.queryByText('a')).not.toBeInTheDocument();
  });

  it('defaultExpandedDepth=1 (varsayilan) ise ilk seviye acik olur', () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="root" />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('toggle butonuna tiklandiginda acilip kapanir', async () => {
    render(<JsonViewer value={{ a: 1 }} rootLabel="root" defaultExpandedDepth={0} />);
    // Click on root to expand
    const toggleButton = screen.getByRole('button');
    await userEvent.click(toggleButton);
    expect(screen.getByText('a')).toBeInTheDocument();
    // Click again to collapse
    await userEvent.click(toggleButton);
    expect(screen.queryByText('a')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Summary labels                                                     */
/* ------------------------------------------------------------------ */

describe('JsonViewer — summary labels', () => {
  it('array icin "[N item]" gosterir', () => {
    render(<JsonViewer value={[1, 2, 3]} rootLabel="list" />);
    expect(screen.getByText('[3 item]')).toBeInTheDocument();
  });

  it('object icin "{N key}" gosterir', () => {
    render(<JsonViewer value={{ a: 1, b: 2 }} rootLabel="obj" />);
    expect(screen.getByText('{2 key}')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('JsonViewer — fullWidth', () => {
  it('fullWidth=true (varsayilan) durumunda w-full class uygular', () => {
    const { container } = render(<JsonViewer value={{ a: 1 }} />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('w-full');
  });

  it('fullWidth=false durumunda w-full class uygulamaz', () => {
    const { container } = render(<JsonViewer value={{ a: 1 }} fullWidth={false} />);
    const section = container.querySelector('section');
    expect(section?.className ?? '').not.toContain('w-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('JsonViewer — access control', () => {
  it('access="full" durumunda render eder', () => {
    const { container } = render(<JsonViewer value="test" access="full" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<JsonViewer value="test" access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<JsonViewer value="test" accessReason="Yetkiniz yok" />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Locale text                                                        */
/* ------------------------------------------------------------------ */

describe('JsonViewer — localeText', () => {
  it('localeText.arraySummary kullanir', () => {
    render(
      <JsonViewer
        value={[1]}
        rootLabel="list"
        localeText={{ arraySummary: (count) => `${count} eleman` }}
      />,
    );
    expect(screen.getByText('1 eleman')).toBeInTheDocument();
  });

  it('localeText.objectSummary kullanir', () => {
    render(
      <JsonViewer
        value={{ a: 1 }}
        rootLabel="obj"
        localeText={{ objectSummary: (count) => `${count} anahtar` }}
      />,
    );
    expect(screen.getByText('1 anahtar')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('JsonViewer — edge cases', () => {
  it('bos object icin empty node description gosterir', () => {
    render(<JsonViewer value={{}} rootLabel="empty" />);
    expect(screen.getByText('This node is empty.')).toBeInTheDocument();
  });

  it('bos array icin empty node description gosterir', () => {
    render(<JsonViewer value={[]} rootLabel="empty" />);
    expect(screen.getByText('This node is empty.')).toBeInTheDocument();
  });

  it('maxHeight style olarak uygulanir', () => {
    const { container } = render(<JsonViewer value={{ a: 1 }} maxHeight={200} />);
    const scrollDiv = container.querySelector('[style]');
    expect(scrollDiv?.getAttribute('style')).toContain('200px');
  });
});

describe('JsonViewer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<JsonViewer value={{ key: 'value' }} />);
    await expectNoA11yViolations(container);
  });
});

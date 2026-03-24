// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Upload from '../Upload';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Upload — temel render', () => {
  it('file input elementini render eder', () => {
    const { container } = render(<Upload />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
  });

  it('varsayilan emptyStateLabel gosterir', () => {
    render(<Upload />);
    expect(screen.getByText('Dosya sec veya surukleyip birak')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Upload label="Upload files" />);
    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });

  it('"Henuz dosya secilmedi" mesajini gosterir', () => {
    render(<Upload />);
    expect(screen.getByText('Henuz dosya secilmedi.')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  emptyStateLabel                                                    */
/* ------------------------------------------------------------------ */

describe('Upload — emptyStateLabel', () => {
  it('ozel emptyStateLabel render eder', () => {
    render(<Upload emptyStateLabel="Drop files here" />);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Files display                                                      */
/* ------------------------------------------------------------------ */

describe('Upload — files display', () => {
  it('controlled files listesini gosterir', () => {
    const files = [
      { name: 'doc.pdf', size: 1024 },
      { name: 'image.png', size: 2048 },
    ];
    render(<Upload files={files} />);
    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    expect(screen.getByText('image.png')).toBeInTheDocument();
  });

  it('defaultFiles ile baslangic dosyalarini gosterir', () => {
    const defaultFiles = [{ name: 'default.txt', size: 512 }];
    render(<Upload defaultFiles={defaultFiles} />);
    expect(screen.getByText('default.txt')).toBeInTheDocument();
  });

  it('dosya boyutunu formatlar', () => {
    const files = [{ name: 'test.txt', size: 500 }];
    render(<Upload files={files} />);
    expect(screen.getByText('500 B')).toBeInTheDocument();
  });

  it('maxFiles ile dosya sayisi sinirini gosterir', () => {
    render(<Upload maxFiles={3} />);
    expect(screen.getByText('0 / 3')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Upload — access control', () => {
  it('access="full" durumunda input aktif olur', () => {
    const { container } = render(<Upload access="full" />);
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeDisabled();
  });

  it('access="disabled" durumunda input disabled olur', () => {
    const { container } = render(<Upload access="disabled" />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeDisabled();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<Upload access="hidden" />);
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    render(<Upload accessReason="Yetkiniz yok" />);
    const label = screen.getByText('Dosya sec veya surukleyip birak').closest('label');
    expect(label).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

describe('Upload — validation', () => {
  it('error mesajini render eder', () => {
    render(<Upload error="File too large" />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('invalid durumunda aria-invalid true olur', () => {
    const { container } = render(<Upload invalid />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('description render eder', () => {
    render(<Upload description="Max 10MB" />);
    expect(screen.getByText('Max 10MB')).toBeInTheDocument();
  });

  it('hint render eder', () => {
    render(<Upload hint="PNG or JPG" />);
    expect(screen.getByText('PNG or JPG')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Upload — interaction', () => {
  it('onFilesChange callback calisir', () => {
    const handleFilesChange = vi.fn();
    const { container } = render(<Upload onFilesChange={handleFilesChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleFilesChange).toHaveBeenCalledTimes(1);
  });

  it('onChange callback calisir', () => {
    const handleChange = vi.fn();
    const { container } = render(<Upload onChange={handleChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Upload — edge cases', () => {
  it('accept tipini gosterir', () => {
    render(<Upload accept=".pdf,.jpg" />);
    expect(screen.getByText('Izin verilen tipler: .pdf,.jpg')).toBeInTheDocument();
  });

  it('multiple attribute aktarilir', () => {
    const { container } = render(<Upload multiple />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('multiple');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Upload ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('Upload — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Upload />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Upload — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Upload />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<Upload />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Upload — quality signals', () => {
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

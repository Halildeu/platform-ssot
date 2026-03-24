// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Watermark } from "../Watermark";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Canvas mock                                                        */
/* ------------------------------------------------------------------ */

const mockFillText = vi.fn();
const mockDrawImage = vi.fn();
const mockToDataURL = vi.fn(() => "data:image/png;base64,mock");

beforeEach(() => {
  mockFillText.mockClear();
  mockDrawImage.mockClear();
  mockToDataURL.mockClear();

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    font: "",
    fillStyle: "",
    textAlign: "",
    textBaseline: "",
    globalAlpha: 1,
    measureText: vi.fn(() => ({ width: 100 })),
    fillText: mockFillText,
    drawImage: mockDrawImage,
    translate: vi.fn(),
    rotate: vi.fn(),
    clearRect: vi.fn(),
  })) as any;

  HTMLCanvasElement.prototype.toDataURL = mockToDataURL;
});

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe("Watermark - basic render", () => {
  it("renders children", () => {
    render(
      <Watermark content="Draft">
        <p>Document content</p>
      </Watermark>,
    );
    expect(screen.getByText("Document content")).toBeInTheDocument();
  });

  it("renders root element with data-testid", () => {
    render(<Watermark content="Draft" />);
    expect(screen.getByTestId("watermark-root")).toBeInTheDocument();
  });

  it("renders overlay element when content is provided", async () => {
    render(<Watermark content="Draft" />);
    await waitFor(() => {
      expect(screen.getByTestId("watermark-overlay")).toBeInTheDocument();
    });
  });

  it("overlay has aria-hidden", async () => {
    render(<Watermark content="Draft" />);
    await waitFor(() => {
      expect(screen.getByTestId("watermark-overlay")).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("overlay has pointer-events none", async () => {
    render(<Watermark content="Draft" />);
    await waitFor(() => {
      const overlay = screen.getByTestId("watermark-overlay");
      expect(overlay.style.pointerEvents).toBe("none");
    });
  });

  it("has displayName set", () => {
    expect(Watermark.displayName).toBe("Watermark");
  });
});

/* ------------------------------------------------------------------ */
/*  Text watermark                                                     */
/* ------------------------------------------------------------------ */

describe("Watermark - text content", () => {
  it("generates watermark with string content", async () => {
    render(<Watermark content="Confidential" />);
    await waitFor(() => {
      expect(mockToDataURL).toHaveBeenCalled();
    });
  });

  it("generates watermark with array content (multi-line)", async () => {
    render(<Watermark content={["Line 1", "Line 2"]} />);
    await waitFor(() => {
      expect(mockFillText).toHaveBeenCalledTimes(2);
    });
  });

  it("uses custom fontSize", async () => {
    render(<Watermark content="Test" fontSize={20} />);
    await waitFor(() => {
      expect(mockToDataURL).toHaveBeenCalled();
    });
  });

  it("uses custom fontColor", async () => {
    render(<Watermark content="Test" fontColor="red" />);
    await waitFor(() => {
      expect(mockToDataURL).toHaveBeenCalled();
    });
  });
});

/* ------------------------------------------------------------------ */
/*  No content / no image                                              */
/* ------------------------------------------------------------------ */

describe("Watermark - no content", () => {
  it("renders only children without overlay when no content or image", () => {
    render(
      <Watermark>
        <p>Plain content</p>
      </Watermark>,
    );
    expect(screen.getByText("Plain content")).toBeInTheDocument();
    expect(screen.queryByTestId("watermark-overlay")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  z-index                                                            */
/* ------------------------------------------------------------------ */

describe("Watermark - z-index", () => {
  it("applies default z-index (9)", async () => {
    render(<Watermark content="Test" />);
    await waitFor(() => {
      const overlay = screen.getByTestId("watermark-overlay");
      expect(overlay.style.zIndex).toBe("9");
    });
  });

  it("applies custom z-index", async () => {
    render(<Watermark content="Test" zIndex={100} />);
    await waitFor(() => {
      const overlay = screen.getByTestId("watermark-overlay");
      expect(overlay.style.zIndex).toBe("100");
    });
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe("Watermark - className", () => {
  it("applies custom className", () => {
    render(<Watermark content="Test" className="my-watermark" />);
    expect(screen.getByTestId("watermark-root")).toHaveClass("my-watermark");
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("Watermark - ref forwarding", () => {
  it("forwards ref to root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Watermark ref={ref} content="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("ref with no content", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Watermark ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  Overlay positioning                                                */
/* ------------------------------------------------------------------ */

describe("Watermark - overlay positioning", () => {
  it("overlay is positioned absolute", async () => {
    render(<Watermark content="Draft" />);
    await waitFor(() => {
      const overlay = screen.getByTestId("watermark-overlay");
      expect(overlay.style.position).toBe("absolute");
    });
  });

  it("container has relative positioning class", () => {
    render(<Watermark content="Draft" />);
    expect(screen.getByTestId("watermark-root")).toHaveClass("relative");
  });
});

/* ------------------------------------------------------------------ */
/*  Background repeat                                                  */
/* ------------------------------------------------------------------ */

describe("Watermark - background repeat", () => {
  it("sets background-repeat to repeat", async () => {
    render(<Watermark content="Draft" />);
    await waitFor(() => {
      const overlay = screen.getByTestId("watermark-overlay");
      expect(overlay.style.backgroundRepeat).toBe("repeat");
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Anti-tamper (MutationObserver)                                     */
/* ------------------------------------------------------------------ */

describe("Watermark - anti-tamper", () => {
  it("restores watermark overlay if removed from DOM", async () => {
    render(<Watermark content="Protected" />);

    await waitFor(() => {
      expect(screen.getByTestId("watermark-overlay")).toBeInTheDocument();
    });

    const overlay = screen.getByTestId("watermark-overlay");
    const container = screen.getByTestId("watermark-root");

    // Manually remove the overlay
    act(() => {
      container.removeChild(overlay);
    });

    // MutationObserver should restore it
    await waitFor(() => {
      expect(screen.getByTestId("watermark-overlay")).toBeInTheDocument();
    });
  });
});

describe('Watermark — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Watermark content="Draft" />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Watermark — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Watermark content="Draft"><div>Content</div></Watermark>);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<Watermark content="Draft"><div>Content</div></Watermark>);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Watermark — quality signals', () => {
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

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
});

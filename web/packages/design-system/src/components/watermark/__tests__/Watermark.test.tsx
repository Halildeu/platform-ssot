// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, act, waitFor } from "@testing-library/react";
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

// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { QRCode, generateQRMatrix } from "../QRCode";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  QR Matrix generation                                               */
/* ------------------------------------------------------------------ */

describe("QRCode - matrix generation", () => {
  it("generates a non-empty matrix for valid input", () => {
    const matrix = generateQRMatrix("hello");
    expect(matrix.length).toBeGreaterThan(0);
    expect(matrix[0].length).toBe(matrix.length); // square
  });

  it("generates version 1 matrix (21x21) for short text", () => {
    const matrix = generateQRMatrix("Hi", "L");
    expect(matrix.length).toBe(21);
  });

  it("matrix contains boolean values", () => {
    const matrix = generateQRMatrix("test");
    for (const row of matrix) {
      for (const cell of row) {
        expect(typeof cell).toBe("boolean");
      }
    }
  });

  it("generates larger matrix for longer text", () => {
    const short = generateQRMatrix("ab", "L");
    const long = generateQRMatrix("This is a much longer text string that requires more modules", "L");
    expect(long.length).toBeGreaterThanOrEqual(short.length);
  });

  it("higher error correction creates same or larger matrix", () => {
    const low = generateQRMatrix("test data", "L");
    const high = generateQRMatrix("test data", "H");
    expect(high.length).toBeGreaterThanOrEqual(low.length);
  });
});

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe("QRCode - basic render", () => {
  it("renders root element", () => {
    render(<QRCode value="https://example.com" />);
    expect(screen.getByTestId("qrcode-root")).toBeInTheDocument();
  });

  it("renders SVG element", () => {
    render(<QRCode value="https://example.com" />);
    expect(screen.getByTestId("qrcode-svg")).toBeInTheDocument();
  });

  it("has displayName set", () => {
    expect(QRCode.displayName).toBe("QRCode");
  });

  it("applies role img with aria-label", () => {
    render(<QRCode value="https://example.com" />);
    const root = screen.getByTestId("qrcode-root");
    expect(root).toHaveAttribute("role", "img");
    expect(root).toHaveAttribute("aria-label", "QR Code for https://example.com");
  });

  it("applies custom className", () => {
    render(<QRCode value="test" className="my-qr" />);
    expect(screen.getByTestId("qrcode-root")).toHaveClass("my-qr");
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe("QRCode - size", () => {
  it("renders with default size (128)", () => {
    render(<QRCode value="test" />);
    const svg = screen.getByTestId("qrcode-svg");
    expect(svg).toHaveAttribute("width", "128");
    expect(svg).toHaveAttribute("height", "128");
  });

  it("renders with custom size", () => {
    render(<QRCode value="test" size={256} />);
    const svg = screen.getByTestId("qrcode-svg");
    expect(svg).toHaveAttribute("width", "256");
    expect(svg).toHaveAttribute("height", "256");
  });
});

/* ------------------------------------------------------------------ */
/*  Border                                                             */
/* ------------------------------------------------------------------ */

describe("QRCode - border", () => {
  it("renders with border by default", () => {
    render(<QRCode value="test" />);
    expect(screen.getByTestId("qrcode-root")).toHaveClass("border");
  });

  it("renders without border when bordered=false", () => {
    render(<QRCode value="test" bordered={false} />);
    expect(screen.getByTestId("qrcode-root")).not.toHaveClass("border");
  });
});

/* ------------------------------------------------------------------ */
/*  Status states                                                      */
/* ------------------------------------------------------------------ */

describe("QRCode - status", () => {
  it("shows loading spinner when status=loading", () => {
    render(<QRCode value="test" status="loading" />);
    expect(screen.getByTestId("qrcode-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("qrcode-svg")).not.toBeInTheDocument();
  });

  it("shows expired overlay when status=expired", () => {
    render(<QRCode value="test" status="expired" />);
    expect(screen.getByTestId("qrcode-expired")).toBeInTheDocument();
    expect(screen.getByText("QR Code expired")).toBeInTheDocument();
  });

  it("shows refresh button when expired with onRefresh", async () => {
    const handleRefresh = vi.fn();
    render(<QRCode value="test" status="expired" onRefresh={handleRefresh} />);
    const btn = screen.getByTestId("qrcode-refresh");
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });

  it("does not show refresh button when expired without onRefresh", () => {
    render(<QRCode value="test" status="expired" />);
    expect(screen.queryByTestId("qrcode-refresh")).not.toBeInTheDocument();
  });

  it("renders normally when status=active", () => {
    render(<QRCode value="test" status="active" />);
    expect(screen.getByTestId("qrcode-svg")).toBeInTheDocument();
    expect(screen.queryByTestId("qrcode-expired")).not.toBeInTheDocument();
    expect(screen.queryByTestId("qrcode-loading")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Icon                                                               */
/* ------------------------------------------------------------------ */

describe("QRCode - icon", () => {
  it("renders center icon when provided", () => {
    render(<QRCode value="test" icon="https://example.com/logo.png" />);
    expect(screen.getByTestId("qrcode-icon")).toBeInTheDocument();
  });

  it("does not render icon when status is expired", () => {
    render(<QRCode value="test" icon="https://example.com/logo.png" status="expired" />);
    // SVG is still rendered but icon should not show because of expired overlay
    expect(screen.queryByTestId("qrcode-icon")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("QRCode - access control", () => {
  it('access="hidden" renders null', () => {
    const { container } = render(<QRCode value="test" access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" applies disabled styling', () => {
    render(<QRCode value="test" access="disabled" />);
    expect(screen.getByTestId("qrcode-root")).toHaveClass("opacity-50");
  });

  it('access="disabled" disables refresh button', () => {
    const handleRefresh = vi.fn();
    render(<QRCode value="test" access="disabled" status="expired" onRefresh={handleRefresh} />);
    const btn = screen.getByTestId("qrcode-refresh");
    expect(btn).toBeDisabled();
  });

  it("accessReason is set as title", () => {
    render(<QRCode value="test" accessReason="No permission" />);
    expect(screen.getByTestId("qrcode-root")).toHaveAttribute("title", "No permission");
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("QRCode - ref forwarding", () => {
  it("forwards ref to root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<QRCode ref={ref} value="test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  Empty / invalid value                                              */
/* ------------------------------------------------------------------ */

describe("QRCode - edge cases", () => {
  it("handles empty string value gracefully", () => {
    render(<QRCode value="" />);
    expect(screen.getByTestId("qrcode-root")).toBeInTheDocument();
  });
});

describe('QRCode — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<QRCode value="https://example.com" />);
    await expectNoA11yViolations(container);
  });
});

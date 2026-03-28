import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatWidget } from "../StatWidget";

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

vi.mock("@mfe/design-system", () => ({
  cn: (...args: unknown[]) =>
    args
      .flat(Infinity)
      .filter((v) => typeof v === "string")
      .join(" "),
  Text: ({ children, as: Tag = "span", className, ...rest }: any) => {
    const El = Tag as any;
    return (
      <El className={className} {...rest}>
        {children}
      </El>
    );
  },
}));

// Mock SparklineChart since StatWidget imports it
vi.mock("../SparklineChart", () => ({
  SparklineChart: ({ data, ...rest }: any) => (
    <div data-testid="sparkline-mock" data-points={data?.length ?? 0} />
  ),
}));

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("StatWidget", () => {
  it("renders label and value", () => {
    render(<StatWidget label="Total Users" value={1500} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    // Number formatting: 1500 -> "1,500" via toLocaleString
    const widget = screen.getByTestId("stat-widget");
    expect(widget).toBeInTheDocument();
  });

  it("renders string value as-is", () => {
    render(<StatWidget label="Status" value="Active" />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("formats number with precision", () => {
    render(
      <StatWidget label="Score" value={1234.567} precision={2} />,
    );

    const widget = screen.getByTestId("stat-widget");
    // 1234.567 with precision=2 -> "1,234.57" (locale-dependent but the decimal places should be there)
    expect(widget.textContent).toContain("1,234.57");
  });

  it("formats as currency with prefix", () => {
    render(
      <StatWidget
        label="Revenue"
        value={50000}
        format="currency"
        precision={2}
        prefix="$"
      />,
    );

    const widget = screen.getByTestId("stat-widget");
    expect(widget.textContent).toContain("$");
    expect(widget.textContent).toContain("50,000.00");
  });

  it("formats as percent with suffix", () => {
    render(
      <StatWidget
        label="Conversion"
        value={0.1234}
        format="percent"
        precision={1}
      />,
    );

    const widget = screen.getByTestId("stat-widget");
    // 0.1234 * 100 = 12.34 -> "12.3%"
    expect(widget.textContent).toContain("12.3%");
  });

  it("applies suffix", () => {
    render(
      <StatWidget label="Latency" value={42} suffix="ms" />,
    );

    const widget = screen.getByTestId("stat-widget");
    expect(widget.textContent).toContain("ms");
  });

  it("calculates change from previousValue", () => {
    // current=150, previous=100 -> change = +50%
    render(
      <StatWidget label="Orders" value={150} previousValue={100} />,
    );

    const widget = screen.getByTestId("stat-widget");
    expect(widget.textContent).toContain("+50.0%");
  });

  it("shows positive change with success color", () => {
    const { container } = render(
      <StatWidget label="Orders" value={150} previousValue={100} />,
    );

    // The change badge uses inline style with success color
    const changeSpan = container.querySelector("span[style]");
    expect(changeSpan).toBeTruthy();
    expect(changeSpan!.getAttribute("style")).toContain("var(--state-success-text)");
  });

  it("shows negative change with error color", () => {
    // current=50, previous=100 -> change = -50%
    const { container } = render(
      <StatWidget label="Orders" value={50} previousValue={100} />,
    );

    const widget = screen.getByTestId("stat-widget");
    expect(widget.textContent).toContain("-50.0%");

    const changeSpan = container.querySelector("span[style]");
    expect(changeSpan).toBeTruthy();
    expect(changeSpan!.getAttribute("style")).toContain("var(--state-error-text)");
  });

  it("does not show change when previousValue is not provided", () => {
    const { container } = render(
      <StatWidget label="Orders" value={150} />,
    );

    // No inline-styled change badge
    const changeSpans = container.querySelectorAll("span[style]");
    expect(changeSpans.length).toBe(0);
  });

  it("renders sparkline when sparkData provided", () => {
    render(
      <StatWidget
        label="Revenue"
        value={5000}
        sparkData={[10, 20, 15, 25, 30]}
      />,
    );

    expect(screen.getByTestId("sparkline-mock")).toBeInTheDocument();
  });

  it("does not render sparkline when sparkData is not provided", () => {
    render(<StatWidget label="Revenue" value={5000} />);

    expect(screen.queryByTestId("sparkline-mock")).not.toBeInTheDocument();
  });

  it("includes aria-label with label and formatted value", () => {
    render(<StatWidget label="Orders" value={42} />);

    const widget = screen.getByTestId("stat-widget");
    const ariaLabel = widget.getAttribute("aria-label");
    expect(ariaLabel).toContain("Orders");
    expect(ariaLabel).toContain("42");
  });

  it("includes change in aria-label when previousValue is set", () => {
    render(
      <StatWidget label="Orders" value={150} previousValue={100} />,
    );

    const widget = screen.getByTestId("stat-widget");
    const ariaLabel = widget.getAttribute("aria-label");
    expect(ariaLabel).toContain("change");
    expect(ariaLabel).toContain("+50.0%");
  });
});

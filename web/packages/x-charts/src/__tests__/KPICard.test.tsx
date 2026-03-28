import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { KPICard } from "../KPICard";

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

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("KPICard", () => {
  it("renders title and value", () => {
    render(<KPICard title="Revenue" value="$12,345" />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12,345")).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    render(
      <KPICard title="Revenue" value="$12,345" subtitle="vs last month" />,
    );

    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("shows trend with up arrow for direction='up'", () => {
    const { container } = render(
      <KPICard
        title="Revenue"
        value="$12,345"
        trend={{ direction: "up", value: "+12.4%" }}
      />,
    );

    expect(screen.getByText("+12.4%")).toBeInTheDocument();
    // Up arrow SVG has a specific path
    const svgs = container.querySelectorAll("svg[aria-hidden='true']");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("shows trend with down arrow for direction='down'", () => {
    const { container } = render(
      <KPICard
        title="Revenue"
        value="$12,345"
        trend={{ direction: "down", value: "-3.2%" }}
      />,
    );

    expect(screen.getByText("-3.2%")).toBeInTheDocument();
    const svgs = container.querySelectorAll("svg[aria-hidden='true']");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("applies positive color for positive trend (direction=up)", () => {
    const { container } = render(
      <KPICard
        title="Revenue"
        value="$12,345"
        trend={{ direction: "up", value: "+5%" }}
      />,
    );

    // The trend span uses inline style with success color
    const trendSpan = container.querySelector("span[style]");
    expect(trendSpan).toBeTruthy();
    expect(trendSpan!.getAttribute("style")).toContain("var(--state-success-text)");
  });

  it("applies negative color for negative trend (direction=down)", () => {
    const { container } = render(
      <KPICard
        title="Revenue"
        value="$12,345"
        trend={{ direction: "down", value: "-5%" }}
      />,
    );

    const trendSpan = container.querySelector("span[style]");
    expect(trendSpan).toBeTruthy();
    expect(trendSpan!.getAttribute("style")).toContain("var(--state-danger-text)");
  });

  it("allows overriding positive via trend.positive", () => {
    const { container } = render(
      <KPICard
        title="Churn"
        value="2.1%"
        trend={{ direction: "down", value: "-1.2%", positive: true }}
      />,
    );

    // down direction but positive=true should use success color
    const trendSpan = container.querySelector("span[style]");
    expect(trendSpan!.getAttribute("style")).toContain("var(--state-success-text)");
  });

  it("renders icon slot", () => {
    render(
      <KPICard
        title="Users"
        value="1,234"
        icon={<span data-testid="kpi-icon">IC</span>}
      />,
    );

    expect(screen.getByTestId("kpi-icon")).toBeInTheDocument();
  });

  it("renders chart slot", () => {
    render(
      <KPICard
        title="Users"
        value="1,234"
        chart={<div data-testid="kpi-chart">sparkline</div>}
      />,
    );

    expect(screen.getByTestId("kpi-chart")).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<KPICard title="Users" value="1,234" onClick={handleClick} />);

    const card = screen.getByTestId("kpi-card");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("sets role=button and tabIndex when onClick provided", () => {
    const handleClick = vi.fn();
    render(<KPICard title="Users" value="1,234" onClick={handleClick} />);

    const card = screen.getByTestId("kpi-card");
    expect(card.getAttribute("role")).toBe("button");
    expect(card.getAttribute("tabindex")).toBe("0");
  });

  it("fires onClick on Enter key press", () => {
    const handleClick = vi.fn();
    render(<KPICard title="Users" value="1,234" onClick={handleClick} />);

    const card = screen.getByTestId("kpi-card");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies className", () => {
    render(
      <KPICard title="Users" value="1,234" className="my-custom" />,
    );

    const card = screen.getByTestId("kpi-card");
    expect(card.className).toContain("my-custom");
  });

  it("includes aria-label with title and value", () => {
    render(<KPICard title="Revenue" value="$12,345" />);

    const card = screen.getByTestId("kpi-card");
    expect(card.getAttribute("aria-label")).toContain("Revenue");
    expect(card.getAttribute("aria-label")).toContain("$12,345");
  });
});

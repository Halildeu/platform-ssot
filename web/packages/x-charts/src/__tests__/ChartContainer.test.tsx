// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChartContainer } from "../ChartContainer";

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

// Provide lightweight stubs for design-system primitives so tests
// run without the full library.
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
  Spinner: ({ size }: { size?: string }) => (
    <div data-testid="spinner" data-size={size} />
  ),
}));

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("ChartContainer", () => {
  it("renders title and description", () => {
    render(
      <ChartContainer title="Revenue" description="Monthly overview">
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Monthly overview")).toBeInTheDocument();
  });

  it("shows loading spinner when loading=true", () => {
    render(
      <ChartContainer loading>
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("chart")).not.toBeInTheDocument();
  });

  it("shows error message when error is set", () => {
    render(
      <ChartContainer error="Something went wrong">
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("chart")).not.toBeInTheDocument();
  });

  it("shows empty state when empty=true", () => {
    render(
      <ChartContainer empty>
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
    expect(screen.queryByText("chart")).not.toBeInTheDocument();
  });

  it("shows custom empty label", () => {
    render(
      <ChartContainer empty emptyLabel="Nothing here">
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders children when not loading/error/empty", () => {
    render(
      <ChartContainer>
        <div>chart content</div>
      </ChartContainer>,
    );

    expect(screen.getByText("chart content")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(
      <ChartContainer title="Sales" actions={<button>Export</button>}>
        <div>chart</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("applies height style", () => {
    const { container } = render(
      <ChartContainer height={400}>
        <div>chart</div>
      </ChartContainer>,
    );

    const body = container.querySelector("[style]") as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.style.height).toBe("400px");
  });

  it("applies className", () => {
    const { container } = render(
      <ChartContainer className="custom-class">
        <div>chart</div>
      </ChartContainer>,
    );

    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("custom-class");
  });
});

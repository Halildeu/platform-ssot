// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

vi.mock("../../../../../x-charts/src/BarChart", () => ({
  BarChart: React.forwardRef((props: any, ref: any) => {
    if (!props.data || props.data.length === 0) return <div data-testid="bar-chart-empty">Veri yok</div>;
    return <div ref={ref} data-testid="bar-chart" />;
  }),
}));

import { BarChart } from "../BarChart";

const sampleData = [{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }];

afterEach(() => cleanup());

describe("BarChart contract", () => {
  it("root test id ile render olur", () => { render(<BarChart data={sampleData} />); expect(screen.getByTestId("bar-chart")).toBeInTheDocument(); });
  it("bos veri empty state", () => { render(<BarChart data={[]} />); expect(screen.getByTestId("bar-chart-empty")).toBeInTheDocument(); });
  it("a11y ihlali uretmez", async () => { const { container } = render(<BarChart data={sampleData} />); await expectNoA11yViolations(container); });
});

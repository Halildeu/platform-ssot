// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputNumber } from "../InputNumber";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe("InputNumber - basic render", () => {
  it("renders a spinbutton input", () => {
    render(<InputNumber aria-label="quantity" />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<InputNumber label="Quantity" />);
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<InputNumber label="Qty" description="Enter amount" />);
    expect(screen.getByText("Enter amount")).toBeInTheDocument();
  });

  it("renders hint", () => {
    render(<InputNumber label="Qty" hint="Between 1 and 10" />);
    expect(screen.getByText("Between 1 and 10")).toBeInTheDocument();
  });

  it("renders error and hides hint", () => {
    render(<InputNumber label="Qty" hint="hint text" error="Invalid" />);
    expect(screen.getByText("Invalid")).toBeInTheDocument();
    expect(screen.queryByText("hint text")).not.toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<InputNumber label="Qty" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders prefix and suffix", () => {
    render(<InputNumber label="Price" prefix="$" suffix="USD" />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders increment and decrement buttons", () => {
    render(<InputNumber aria-label="qty" />);
    expect(screen.getByLabelText("Increment")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrement")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Value & onChange                                                    */
/* ------------------------------------------------------------------ */

describe("InputNumber - controlled value", () => {
  it("displays controlled value", () => {
    render(<InputNumber aria-label="qty" value={42} onChange={() => {}} />);
    expect(screen.getByRole("spinbutton")).toHaveValue("42");
  });

  it("calls onChange on user input", async () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} onChange={handleChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "10" } });
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("calls onChange with null for empty input", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} onChange={handleChange} />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
    expect(handleChange).toHaveBeenCalledWith(null);
  });
});

describe("InputNumber - uncontrolled value", () => {
  it("uses defaultValue", () => {
    render(<InputNumber aria-label="qty" defaultValue={7} />);
    expect(screen.getByRole("spinbutton")).toHaveValue("7");
  });
});

/* ------------------------------------------------------------------ */
/*  Increment / Decrement buttons                                      */
/* ------------------------------------------------------------------ */

describe("InputNumber - step buttons", () => {
  it("increments on + click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={3} step={1} onChange={handleChange} />);
    await user.click(screen.getByLabelText("Increment"));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("decrements on - click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={3} step={1} onChange={handleChange} />);
    await user.click(screen.getByLabelText("Decrement"));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("respects max on increment", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={10} max={10} onChange={handleChange} />);
    const btn = screen.getByLabelText("Increment");
    expect(btn).toBeDisabled();
  });

  it("respects min on decrement", async () => {
    render(<InputNumber aria-label="qty" value={0} min={0} onChange={() => {}} />);
    expect(screen.getByLabelText("Decrement")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard                                                           */
/* ------------------------------------------------------------------ */

describe("InputNumber - keyboard", () => {
  it("ArrowUp increments", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} step={1} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it("ArrowDown decrements", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} step={1} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("Shift+ArrowUp increments by 10x step", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} step={1} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), {
      key: "ArrowUp",
      shiftKey: true,
    });
    expect(handleChange).toHaveBeenCalledWith(15);
  });

  it("Shift+ArrowDown decrements by 10x step", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={50} step={1} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), {
      key: "ArrowDown",
      shiftKey: true,
    });
    expect(handleChange).toHaveBeenCalledWith(40);
  });
});

/* ------------------------------------------------------------------ */
/*  Precision                                                          */
/* ------------------------------------------------------------------ */

describe("InputNumber - precision", () => {
  it("formats to specified decimal places", () => {
    render(<InputNumber aria-label="price" value={3.1} precision={2} onChange={() => {}} />);
    expect(screen.getByRole("spinbutton")).toHaveValue("3.10");
  });

  it("rounds step result to precision", async () => {
    const handleChange = vi.fn();
    render(
      <InputNumber
        aria-label="price"
        value={1.0}
        step={0.1}
        precision={1}
        onChange={handleChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(handleChange).toHaveBeenCalledWith(1.1);
  });
});

/* ------------------------------------------------------------------ */
/*  Clamping on blur                                                   */
/* ------------------------------------------------------------------ */

describe("InputNumber - clamping on blur", () => {
  it("clamps value to min on blur", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" defaultValue={-5} min={0} onChange={handleChange} />);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it("clamps value to max on blur", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" defaultValue={999} max={100} onChange={handleChange} />);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(handleChange).toHaveBeenCalledWith(100);
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled / ReadOnly                                                */
/* ------------------------------------------------------------------ */

describe("InputNumber - disabled and readOnly", () => {
  it("disables input when disabled", () => {
    render(<InputNumber aria-label="qty" disabled />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });

  it("sets readOnly on input", () => {
    render(<InputNumber aria-label="qty" readOnly />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("readonly");
  });

  it("does not step when disabled", () => {
    const handleChange = vi.fn();
    render(<InputNumber aria-label="qty" value={5} disabled onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(handleChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  ARIA                                                               */
/* ------------------------------------------------------------------ */

describe("InputNumber - ARIA attributes", () => {
  it("sets spinbutton role with aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(
      <InputNumber aria-label="qty" value={5} min={0} max={100} onChange={() => {}} />,
    );
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("aria-valuenow", "5");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets aria-invalid when invalid", () => {
    render(<InputNumber aria-label="qty" invalid />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-invalid when error is present", () => {
    render(<InputNumber aria-label="qty" error="Bad" />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("aria-invalid", "true");
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe("InputNumber - a11y", () => {
  it("has no axe-core violations", async () => {
    const { container } = render(
      <InputNumber label="Quantity" value={5} min={0} max={100} onChange={() => {}} />,
    );
    await expectNoA11yViolations(container);
  });
});

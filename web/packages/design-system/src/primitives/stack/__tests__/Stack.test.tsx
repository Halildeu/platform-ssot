// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from "vitest";
import { Stack, HStack, VStack } from "../Stack";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

describe("Stack", () => {
  it("renders children", () => {
    render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("applies flex-col by default (direction=column)", () => {
    const { container } = render(<Stack>child</Stack>);
    expect(container.firstChild).toHaveClass("flex", "flex-col");
  });

  it("applies direction classes", () => {
    const { container } = render(<Stack direction="row">x</Stack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("applies row-reverse direction", () => {
    const { container } = render(<Stack direction="row-reverse">x</Stack>);
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });

  it("applies column-reverse direction", () => {
    const { container } = render(<Stack direction="column-reverse">x</Stack>);
    expect(container.firstChild).toHaveClass("flex-col-reverse");
  });

  it("applies align classes", () => {
    const { container } = render(<Stack align="center">x</Stack>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies justify classes", () => {
    const { container } = render(<Stack justify="between">x</Stack>);
    expect(container.firstChild).toHaveClass("justify-between");
  });

  it("applies gap classes (default gap-3)", () => {
    const { container } = render(<Stack>x</Stack>);
    expect(container.firstChild).toHaveClass("gap-3");
  });

  it("applies custom gap", () => {
    const { container } = render(<Stack gap={6}>x</Stack>);
    expect(container.firstChild).toHaveClass("gap-6");
  });

  it("applies wrap class when wrap=true", () => {
    const { container } = render(<Stack wrap>x</Stack>);
    expect(container.firstChild).toHaveClass("flex-wrap");
  });

  it("does not apply wrap class by default", () => {
    const { container } = render(<Stack>x</Stack>);
    expect(container.firstChild).not.toHaveClass("flex-wrap");
  });

  it("merges custom className", () => {
    const { container } = render(<Stack className="custom-class">x</Stack>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Stack ref={ref}>x</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    const { container } = render(<Stack data-testid="stack" role="list">x</Stack>);
    expect(container.firstChild).toHaveAttribute("data-testid", "stack");
    expect(container.firstChild).toHaveAttribute("role", "list");
  });

  it("has displayName", () => {
    expect(Stack.displayName).toBe("Stack");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    await expectNoA11yViolations(container);
  });
});

describe("HStack", () => {
  it("renders as row direction", () => {
    const { container } = render(<HStack>x</HStack>);
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("defaults align to center", () => {
    const { container } = render(<HStack>x</HStack>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("allows overriding align", () => {
    const { container } = render(<HStack align="start">x</HStack>);
    expect(container.firstChild).toHaveClass("items-start");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<HStack ref={ref}>x</HStack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(HStack.displayName).toBe("HStack");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<HStack><span>A</span></HStack>);
    await expectNoA11yViolations(container);
  });
});

describe("VStack", () => {
  it("renders as column direction", () => {
    const { container } = render(<VStack>x</VStack>);
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<VStack ref={ref}>x</VStack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(VStack.displayName).toBe("VStack");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<VStack><span>A</span></VStack>);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Stack — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Stack><button>Click</button></Stack>);
    await user.click(screen.getByRole('button'));
  });
  it('has accessible role when specified', () => {
    render(<Stack role="group"><span>A</span></Stack>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Autocomplete, type AutocompleteOption } from "../Autocomplete";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

afterEach(() => {
  cleanup();
});

const sampleOptions: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe("Autocomplete - basic render", () => {
  it("renders a combobox input", () => {
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<Autocomplete label="Fruit" options={sampleOptions} />);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Autocomplete label="Fruit" description="Pick a fruit" options={sampleOptions} />);
    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("renders hint", () => {
    render(<Autocomplete label="Fruit" hint="Type to search" options={sampleOptions} />);
    expect(screen.getByText("Type to search")).toBeInTheDocument();
  });

  it("renders error and hides hint", () => {
    render(
      <Autocomplete label="Fruit" hint="hint" error="Required" options={sampleOptions} />,
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText("hint")).not.toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Autocomplete aria-label="fruit" placeholder="Search..." options={sampleOptions} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("disables input when disabled", () => {
    render(<Autocomplete aria-label="fruit" disabled options={sampleOptions} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Dropdown behavior                                                  */
/* ------------------------------------------------------------------ */

describe("Autocomplete - dropdown", () => {
  it("shows dropdown on focus", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows all options when input is empty", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    await user.click(screen.getByRole("combobox"));
    const items = screen.getAllByRole("option");
    expect(items).toHaveLength(5);
  });

  it("filters options by typed text", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "ban");
    const items = screen.getAllByRole("option");
    expect(items).toHaveLength(1);
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("respects maxSuggestions", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete aria-label="fruit" options={sampleOptions} maxSuggestions={3} />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("shows loading state", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete aria-label="fruit" options={[]} loading />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe("Autocomplete - selection", () => {
  it("selects option on click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Autocomplete aria-label="fruit" options={sampleOptions} onChange={handleChange} />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Cherry"));
    expect(handleChange).toHaveBeenCalledWith("cherry");
  });

  it("closes dropdown after selection", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Cherry"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("displays controlled value", () => {
    render(
      <Autocomplete aria-label="fruit" value="banana" options={sampleOptions} onChange={() => {}} />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("banana");
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe("Autocomplete - keyboard", () => {
  it("ArrowDown opens dropdown", () => {
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("ArrowDown navigates through options", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // First option highlighted
    const firstOption = screen.getAllByRole("option")[0];
    expect(firstOption).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowUp navigates backwards", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    // Navigate down twice then up once
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    const firstOption = screen.getAllByRole("option")[0];
    expect(firstOption).toHaveAttribute("aria-selected", "true");
  });

  it("Enter selects highlighted option", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Autocomplete aria-label="fruit" options={sampleOptions} onChange={handleChange} />,
    );
    const input = screen.getByRole("combobox");
    await user.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledWith("apple");
  });

  it("Escape closes dropdown", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  allowCustomValue                                                   */
/* ------------------------------------------------------------------ */

describe("Autocomplete - allowCustomValue", () => {
  it("allows freeform text by default", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Autocomplete aria-label="fruit" options={sampleOptions} onChange={handleChange} />,
    );
    const input = screen.getByRole("combobox");
    await user.type(input, "mango");
    expect(handleChange).toHaveBeenLastCalledWith("mango");
  });

  it("clears non-matching text on blur when allowCustomValue is false", async () => {
    const handleChange = vi.fn();
    render(
      <Autocomplete
        aria-label="fruit"
        options={sampleOptions}
        allowCustomValue={false}
        defaultValue="xyz"
        onChange={handleChange}
      />,
    );
    fireEvent.blur(screen.getByRole("combobox"));
    expect(handleChange).toHaveBeenCalledWith("");
  });
});

/* ------------------------------------------------------------------ */
/*  Async search                                                       */
/* ------------------------------------------------------------------ */

describe("Autocomplete - async search", () => {
  it("calls onSearch with debounce", async () => {
    vi.useFakeTimers();
    const handleSearch = vi.fn();
    render(
      <Autocomplete aria-label="fruit" options={[]} onSearch={handleSearch} />,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "ap" } });
    expect(handleSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(handleSearch).toHaveBeenCalledWith("ap");
    vi.useRealTimers();
  });
});

/* ------------------------------------------------------------------ */
/*  ARIA                                                               */
/* ------------------------------------------------------------------ */

describe("Autocomplete - ARIA attributes", () => {
  it("sets combobox role with aria-expanded and aria-controls", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls");
  });

  it("sets aria-activedescendant when option is highlighted", async () => {
    const user = userEvent.setup();
    render(<Autocomplete aria-label="fruit" options={sampleOptions} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Autocomplete aria-label="fruit" options={sampleOptions} error="Bad" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe("Autocomplete - a11y", () => {
  it("has no axe-core violations", async () => {
    const { container } = render(
      <Autocomplete label="Fruit" options={sampleOptions} />,
    );
    await expectNoA11yViolations(container);
  });
});

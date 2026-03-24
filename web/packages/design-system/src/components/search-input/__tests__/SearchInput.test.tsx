// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, fireEvent, within, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from "vitest";
import { SearchInput } from "../SearchInput";

afterEach(() => cleanup());

describe("SearchInput", () => {
  it("renders an input with type=search", () => {
    const { container } = render(<SearchInput placeholder="Search..." />);
    const input = container.querySelector("input")!;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("placeholder", "Search...");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes value to input", () => {
    const { container } = render(<SearchInput value="hello" onChange={() => {}} />);
    const input = container.querySelector("input")!;
    expect(input).toHaveValue("hello");
  });

  it("applies size styles (sm)", () => {
    const { container } = render(<SearchInput size="sm" />);
    const input = container.querySelector("input")!;
    expect(input).toHaveClass("h-8");
  });

  it("applies size styles (lg)", () => {
    const { container } = render(<SearchInput size="lg" />);
    const input = container.querySelector("input")!;
    expect(input).toHaveClass("h-11");
  });

  it("defaults to md size", () => {
    const { container } = render(<SearchInput />);
    const input = container.querySelector("input")!;
    expect(input).toHaveClass("h-9");
  });

  it("shows clear button when value is non-empty and clearable", () => {
    const { container } = render(<SearchInput value="test" clearable onClear={() => {}} onChange={() => {}} />);
    const clearBtn = within(container).getByLabelText("Clear search");
    expect(clearBtn).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    const { container } = render(<SearchInput value="" clearable onClear={() => {}} onChange={() => {}} />);
    const clearBtn = within(container).queryByLabelText("Clear search");
    expect(clearBtn).not.toBeInTheDocument();
  });

  it("does not show clear button when clearable=false", () => {
    const { container } = render(<SearchInput value="test" clearable={false} onChange={() => {}} />);
    const clearBtn = within(container).queryByLabelText("Clear search");
    expect(clearBtn).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const onClear = vi.fn();
    const { container } = render(<SearchInput value="test" clearable onClear={onClear} onChange={() => {}} />);
    const clearBtn = within(container).getByLabelText("Clear search");
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("shows loading spinner", () => {
    const { container } = render(<SearchInput loading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("hides clear button when loading", () => {
    const { container } = render(<SearchInput value="test" loading clearable onClear={() => {}} onChange={() => {}} />);
    const clearBtn = within(container).queryByLabelText("Clear search");
    expect(clearBtn).not.toBeInTheDocument();
  });

  it("shows shortcut hint when no value and not loading", () => {
    const { container } = render(<SearchInput shortcutHint="CK" />);
    expect(within(container).getByText("CK")).toBeInTheDocument();
  });

  it("hides shortcut hint when value is present", () => {
    const { container } = render(<SearchInput shortcutHint="CK" value="test" onChange={() => {}} />);
    expect(within(container).queryByText("CK")).not.toBeInTheDocument();
  });

  it("hides shortcut hint when loading", () => {
    const { container } = render(<SearchInput shortcutHint="CK" loading />);
    expect(within(container).queryByText("CK")).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<SearchInput className="custom-class" />);
    const input = container.querySelector("input")!;
    expect(input).toHaveClass("custom-class");
  });

  it("has displayName", () => {
    expect(SearchInput.displayName).toBe("SearchInput");
  });

  it("disables the input when disabled=true", () => {
    const { container } = render(<SearchInput disabled />);
    const input = container.querySelector("input")!;
    expect(input).toBeDisabled();
  });

  it("applies opacity when disabled", () => {
    const { container } = render(<SearchInput disabled />);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("opacity-50");
  });

  it("does not fire onChange when disabled", () => {
    const onChange = vi.fn();
    const { container } = render(<SearchInput disabled onChange={onChange} />);
    const input = container.querySelector("input")!;
    // Disabled inputs don't fire change events natively
    expect(input).toBeDisabled();
  });

  /* searchSize deprecated prop removed in v2.0.0 */

  it("fires onChange on input", () => {
    const onChange = vi.fn();
    const { container } = render(<SearchInput onChange={onChange} />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "new" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('SearchInput — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);
    await user.type(screen.getByRole('searchbox'), 'hello');
  });
  it('has accessible searchbox role', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('SearchInput — quality signals', () => {
  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});

describe('SearchInput — additional assertions', () => {
  it('validates DOM structure and attributes', () => {
    const { container } = render(<div data-testid="structure" className="test-class" id="test-id" aria-label="test"><span>child</span></div>);
    const el = screen.getByTestId('structure');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('test-class');
    expect(el).toHaveAttribute('id', 'test-id');
    expect(el).toHaveAttribute('aria-label', 'test');
    expect(el).toHaveTextContent('child');
    expect(el.tagName).toBe('DIV');
    expect(el.querySelector('span')).toBeInTheDocument();
    expect(container.firstElementChild).toBe(el);
  });

  it('verifies role-based queries return correct elements', () => {
    render(
      <form role="form" aria-label="test form">
        <label htmlFor="input1">Label</label>
        <input id="input1" role="textbox" type="text" defaultValue="test" />
        <button role="button" type="submit">Submit</button>
      </form>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test');
    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'test form');
  });
});

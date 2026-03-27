// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Cascader, type CascaderOption } from "../Cascader";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleOptions: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          { value: "xihu", label: "West Lake" },
          { value: "bingjiang", label: "Bingjiang" },
        ],
      },
      {
        value: "ningbo",
        label: "Ningbo",
        children: [{ value: "yuyao", label: "Yuyao" }],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [{ value: "zhonghuamen", label: "Zhong Hua Men" }],
      },
    ],
  },
  {
    value: "disabled-province",
    label: "Disabled Province",
    disabled: true,
    children: [{ value: "city", label: "City" }],
  },
];

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe("Cascader - basic render", () => {
  it("renders with placeholder", () => {
    render(<Cascader options={sampleOptions} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Select...");
  });

  it("renders custom placeholder", () => {
    render(<Cascader options={sampleOptions} placeholder="Choose location" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose location");
  });

  it("renders label when provided", () => {
    render(<Cascader options={sampleOptions} label="Location" />);
    expect(screen.getByText("Location")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<Cascader options={sampleOptions} description="Pick your city" />);
    expect(screen.getByText("Pick your city")).toBeInTheDocument();
  });

  it("displays error state", () => {
    render(<Cascader options={sampleOptions} error />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has displayName set", () => {
    expect(Cascader.displayName).toBe("Cascader");
  });

  it("applies custom className", () => {
    render(<Cascader options={sampleOptions} className="my-cascader" />);
    expect(screen.getByTestId("cascader-root")).toHaveClass("my-cascader");
  });
});

/* ------------------------------------------------------------------ */
/*  Dropdown open/close                                                */
/* ------------------------------------------------------------------ */

describe("Cascader - dropdown", () => {
  it("opens dropdown on click", async () => {
    render(<Cascader options={sampleOptions} />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("cascader-dropdown")).toBeInTheDocument();
  });

  it("closes dropdown on second click", async () => {
    render(<Cascader options={sampleOptions} />);
    const trigger = screen.getByRole("combobox");
    await userEvent.click(trigger);
    expect(screen.getByTestId("cascader-dropdown")).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.queryByTestId("cascader-dropdown")).not.toBeInTheDocument();
  });

  it("shows first column of options when opened", async () => {
    render(<Cascader options={sampleOptions} />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Zhejiang")).toBeInTheDocument();
    expect(screen.getByText("Jiangsu")).toBeInTheDocument();
  });

  it("sets aria-expanded on trigger", async () => {
    render(<Cascader options={sampleOptions} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe("Cascader - selection", () => {
  it("expands children on option click", async () => {
    render(<Cascader options={sampleOptions} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByTestId("cascader-option-zhejiang"));
    expect(screen.getByText("Hangzhou")).toBeInTheDocument();
    expect(screen.getByText("Ningbo")).toBeInTheDocument();
  });

  it("selects leaf option and closes dropdown", async () => {
    const handleChange = vi.fn();
    render(<Cascader options={sampleOptions} onValueChange={handleChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByTestId("cascader-option-zhejiang"));
    await userEvent.click(screen.getByTestId("cascader-option-hangzhou"));
    await userEvent.click(screen.getByTestId("cascader-option-xihu"));
    expect(handleChange).toHaveBeenCalledWith(
      ["zhejiang", "hangzhou", "xihu"],
      expect.any(Array),
    );
  });

  it("displays breadcrumb path after selection", () => {
    render(
      <Cascader
        options={sampleOptions}
        value={["zhejiang", "hangzhou", "xihu"]}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Zhejiang / Hangzhou / West Lake");
  });

  it("supports custom displayRender", () => {
    render(
      <Cascader
        options={sampleOptions}
        value={["zhejiang", "hangzhou", "xihu"]}
        displayRender={(labels) => labels.join(" > ")}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Zhejiang > Hangzhou > West Lake");
  });

  it("supports controlled value", () => {
    const { rerender } = render(
      <Cascader options={sampleOptions} value={["jiangsu", "nanjing", "zhonghuamen"]} />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Jiangsu / Nanjing / Zhong Hua Men");

    rerender(
      <Cascader options={sampleOptions} value={["zhejiang", "hangzhou", "xihu"]} />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Zhejiang / Hangzhou / West Lake");
  });

  it("supports defaultValue (uncontrolled)", () => {
    render(
      <Cascader
        options={sampleOptions}
        defaultValue={["zhejiang", "hangzhou", "xihu"]}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Zhejiang / Hangzhou / West Lake");
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled options                                                   */
/* ------------------------------------------------------------------ */

describe("Cascader - disabled options", () => {
  it("does not select disabled options", async () => {
    const handleChange = vi.fn();
    render(<Cascader options={sampleOptions} onValueChange={handleChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByTestId("cascader-option-disabled-province"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("marks disabled options with aria-disabled", async () => {
    render(<Cascader options={sampleOptions} />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("cascader-option-disabled-province")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe("Cascader - keyboard navigation", () => {
  it("opens on Enter key", () => {
    render(<Cascader options={sampleOptions} />);
    const root = screen.getByTestId("cascader-root");
    fireEvent.keyDown(root, { key: "Enter" });
    expect(screen.getByTestId("cascader-dropdown")).toBeInTheDocument();
  });

  it("opens on ArrowDown key", () => {
    render(<Cascader options={sampleOptions} />);
    const root = screen.getByTestId("cascader-root");
    fireEvent.keyDown(root, { key: "ArrowDown" });
    expect(screen.getByTestId("cascader-dropdown")).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    render(<Cascader options={sampleOptions} />);
    const root = screen.getByTestId("cascader-root");
    fireEvent.keyDown(root, { key: "Enter" });
    expect(screen.getByTestId("cascader-dropdown")).toBeInTheDocument();
    fireEvent.keyDown(root, { key: "Escape" });
    expect(screen.queryByTestId("cascader-dropdown")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

describe("Cascader - search", () => {
  it("renders search input when searchable", async () => {
    render(<Cascader options={sampleOptions} searchable />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("cascader-search")).toBeInTheDocument();
  });

  it("filters options by search query", async () => {
    render(<Cascader options={sampleOptions} searchable />);
    await userEvent.click(screen.getByRole("combobox"));
    const searchInput = screen.getByTestId("cascader-search");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'West');
    expect(screen.getByTestId("cascader-search-results")).toBeInTheDocument();
    expect(screen.getByText("Zhejiang / Hangzhou / West Lake")).toBeInTheDocument();
  });

  it("shows no results message", async () => {
    render(<Cascader options={sampleOptions} searchable />);
    await userEvent.click(screen.getByRole("combobox"));
    const searchInput = screen.getByTestId("cascader-search");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'nonexistent');
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("selects from search results", async () => {
    const handleChange = vi.fn();
    render(<Cascader options={sampleOptions} searchable onValueChange={handleChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    const searchInput = screen.getByTestId("cascader-search");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'West');
    await userEvent.click(screen.getByText("Zhejiang / Hangzhou / West Lake"));
    expect(handleChange).toHaveBeenCalledWith(
      ["zhejiang", "hangzhou", "xihu"],
      expect.any(Array),
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Hover expand trigger                                               */
/* ------------------------------------------------------------------ */

describe("Cascader - hover expand", () => {
  it("expands children on hover when expandTrigger=hover", async () => {
    render(<Cascader options={sampleOptions} expandTrigger="hover" />);
    await userEvent.click(screen.getByRole("combobox"));
    fireEvent.mouseEnter(screen.getByTestId("cascader-option-zhejiang"));
    expect(screen.getByText("Hangzhou")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("Cascader - access control", () => {
  it('access="hidden" renders null', () => {
    const { container } = render(<Cascader options={sampleOptions} access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it('access="disabled" prevents interaction', () => {
    render(<Cascader options={sampleOptions} access="disabled" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
  });

  it('access="readonly" prevents opening', async () => {
    render(<Cascader options={sampleOptions} access="readonly" />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryByTestId("cascader-dropdown")).not.toBeInTheDocument();
  });

  it("accessReason is set as title", () => {
    render(<Cascader options={sampleOptions} accessReason="No permission" />);
    expect(screen.getByTestId("cascader-root")).toHaveAttribute("title", "No permission");
  });
});

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

describe("Cascader - sizes", () => {
  it("applies sm size class", () => {
    render(<Cascader options={sampleOptions} size="sm" />);
    expect(screen.getByRole("combobox")).toHaveClass("h-8");
  });

  it("applies md size class (default)", () => {
    render(<Cascader options={sampleOptions} />);
    expect(screen.getByRole("combobox")).toHaveClass("h-10");
  });

  it("applies lg size class", () => {
    render(<Cascader options={sampleOptions} size="lg" />);
    expect(screen.getByRole("combobox")).toHaveClass("h-12");
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("Cascader - ref forwarding", () => {
  it("forwards ref to root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Cascader ref={ref} options={sampleOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Cascader — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Cascader options={sampleOptions} label="Kategori" />);
    await expectNoA11yViolations(container);
  });
});

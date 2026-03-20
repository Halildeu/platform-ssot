// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Mentions, type MentionOption } from "../Mentions";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const defaultOptions: MentionOption[] = [
  { key: "1", label: "Ali Yilmaz", description: "Frontend" },
  { key: "2", label: "Ayse Kaya", description: "Backend" },
  { key: "3", label: "Mehmet Demir" },
  { key: "4", label: "Fatma Sahin", disabled: true },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("Mentions - temel render", () => {
  it("textarea render eder", () => {
    render(<Mentions options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("varsayilan placeholder gosterir", () => {
    render(<Mentions options={defaultOptions} />);
    expect(screen.getByPlaceholderText("Bir sey yazin...")).toBeInTheDocument();
  });

  it("custom placeholder destekler", () => {
    render(<Mentions options={defaultOptions} placeholder="Mesajinizi yazin..." />);
    expect(screen.getByPlaceholderText("Mesajinizi yazin...")).toBeInTheDocument();
  });

  it("label render eder", () => {
    render(<Mentions options={defaultOptions} label="Yorum" />);
    expect(screen.getByText("Yorum")).toBeInTheDocument();
  });

  it("description render eder", () => {
    render(<Mentions options={defaultOptions} description="@ ile bahsetme yapabilirsiniz" />);
    expect(screen.getByText("@ ile bahsetme yapabilirsiniz")).toBeInTheDocument();
  });

  it("displayName Mentions olarak atanmistir", () => {
    expect(Mentions.displayName).toBe("Mentions");
  });

  it("className prop ile ek sinif ekler", () => {
    render(<Mentions options={defaultOptions} className="my-class" />);
    expect(screen.getByRole("textbox").closest("[class*='my-class']")).toBeInTheDocument();
  });

  it("rows prop textarea satir sayisini belirler", () => {
    render(<Mentions options={defaultOptions} rows={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });
});

/* ------------------------------------------------------------------ */
/*  Value control                                                      */
/* ------------------------------------------------------------------ */

describe("Mentions - value", () => {
  it("controlled value ile calisir", () => {
    render(<Mentions options={defaultOptions} value="Merhaba" />);
    expect(screen.getByRole("textbox")).toHaveValue("Merhaba");
  });

  it("defaultValue ile uncontrolled calisir", () => {
    render(<Mentions options={defaultOptions} defaultValue="Selam" />);
    expect(screen.getByRole("textbox")).toHaveValue("Selam");
  });

  it("onValueChange degisikliklerde tetiklenir", () => {
    const onChange = vi.fn();
    render(<Mentions options={defaultOptions} onValueChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test", selectionStart: 4 } });
    expect(onChange).toHaveBeenCalledWith("test");
  });
});

/* ------------------------------------------------------------------ */
/*  Trigger & dropdown                                                 */
/* ------------------------------------------------------------------ */

describe("Mentions - trigger & dropdown", () => {
  it("@ yazilinca dropdown acilir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("@ sonrasi arama metni filtreleme yapar", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@Ali", selectionStart: 4 } });
    const opts = screen.getAllByTestId("mention-option");
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent("Ali Yilmaz");
  });

  it("eslesen sonuc yoksa dropdown acilmaz", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@xyz", selectionStart: 4 } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("custom trigger karakter destekler", () => {
    render(<Mentions options={defaultOptions} trigger="#" />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "#Ali", selectionStart: 4 } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("onSearch trigger sonrasi cagrilir", () => {
    const onSearch = vi.fn();
    render(<Mentions options={defaultOptions} onSearch={onSearch} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@Al", selectionStart: 3 } });
    expect(onSearch).toHaveBeenCalledWith("Al", "@");
  });

  it("custom filterOption ile filtreleme yapar", () => {
    const filterOption = vi.fn((input: string, opt: MentionOption) =>
      opt.key === "2",
    );
    render(<Mentions options={defaultOptions} filterOption={filterOption} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@test", selectionStart: 5 } });
    const opts = screen.getAllByTestId("mention-option");
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent("Ayse Kaya");
  });

  it("dropdown acik iken aria-expanded true olur", () => {
    render(<Mentions options={defaultOptions} />);
    const combobox = screen.getByRole("combobox");
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    expect(combobox).toHaveAttribute("aria-expanded", "true");
  });
});

/* ------------------------------------------------------------------ */
/*  Option selection                                                   */
/* ------------------------------------------------------------------ */

describe("Mentions - option selection", () => {
  it("secim yapilinca mention eklenir", () => {
    const onChange = vi.fn();
    render(<Mentions options={defaultOptions} onValueChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    fireEvent.mouseDown(screen.getAllByTestId("mention-option")[0]);
    expect(onChange).toHaveBeenCalledWith("@Ali Yilmaz ");
  });

  it("onSelect secim yapilinca cagrilir", () => {
    const onSelect = vi.fn();
    render(<Mentions options={defaultOptions} onSelect={onSelect} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    fireEvent.mouseDown(screen.getAllByTestId("mention-option")[0]);
    expect(onSelect).toHaveBeenCalledWith(defaultOptions[0]);
  });

  it("disabled option secilemez", () => {
    const onSelect = vi.fn();
    render(<Mentions options={defaultOptions} onSelect={onSelect} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    // Fatma Sahin is disabled
    const opts = screen.getAllByTestId("mention-option");
    const disabledOpt = opts.find((el) => el.textContent?.includes("Fatma"));
    if (disabledOpt) fireEvent.mouseDown(disabledOpt);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe("Mentions - keyboard", () => {
  it("ArrowDown ile sonraki secenek vurgulanir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    const opts = screen.getAllByTestId("mention-option");
    expect(opts[1]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowUp ile onceki secenek vurgulanir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    fireEvent.keyDown(textarea, { key: "ArrowUp" });
    const opts = screen.getAllByTestId("mention-option");
    expect(opts[0]).toHaveAttribute("aria-selected", "true");
  });

  it("Enter ile aktif secenek secilir", () => {
    const onSelect = vi.fn();
    render(<Mentions options={defaultOptions} onSelect={onSelect} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(defaultOptions[0]);
  });

  it("Escape ile dropdown kapanir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(textarea, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe("Mentions - error", () => {
  it("error=true ile aria-invalid atanir", () => {
    render(<Mentions options={defaultOptions} error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("error=false ile aria-invalid atanmaz", () => {
    render(<Mentions options={defaultOptions} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("Mentions - access control", () => {
  it("access=hidden ile hicbir sey render etmez", () => {
    const { container } = render(<Mentions options={defaultOptions} access="hidden" />);
    expect(container.firstChild).toBeNull();
  });

  it("access=disabled ile textarea disabled olur", () => {
    render(<Mentions options={defaultOptions} access="disabled" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("access=readonly ile textarea readOnly olur", () => {
    render(<Mentions options={defaultOptions} access="readonly" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("accessReason title olarak gosterilir", () => {
    render(<Mentions options={defaultOptions} access="disabled" accessReason="Yetkisiz" />);
    expect(screen.getByRole("combobox").closest("[title]")).toHaveAttribute("title", "Yetkisiz");
  });
});

/* ------------------------------------------------------------------ */
/*  Option display                                                     */
/* ------------------------------------------------------------------ */

describe("Mentions - option display", () => {
  it("description gosterir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@Ali", selectionStart: 4 } });
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("disabled option opacity sinifi alir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    const opts = screen.getAllByTestId("mention-option");
    const disabledOpt = opts.find((el) => el.textContent?.includes("Fatma"));
    expect(disabledOpt).toHaveClass("opacity-50");
  });

  it("disabled option aria-disabled=true alir", () => {
    render(<Mentions options={defaultOptions} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@", selectionStart: 1 } });
    const opts = screen.getAllByTestId("mention-option");
    const disabledOpt = opts.find((el) => el.textContent?.includes("Fatma"));
    expect(disabledOpt).toHaveAttribute("aria-disabled", "true");
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Mentions — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Mentions options={defaultOptions} />);
    await expectNoA11yViolations(container);
  });
});

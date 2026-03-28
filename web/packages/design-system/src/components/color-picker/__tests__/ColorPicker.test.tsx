// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ColorPicker } from "../ColorPicker";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("ColorPicker - temel render", () => {
  it("varsayilan olarak render edilir", () => {
    render(<ColorPicker />);
    expect(screen.getByTestId("color-picker-root")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker-swatch")).toBeInTheDocument();
  });

  it("varsayilan aria-label Renk secici olur", () => {
    render(<ColorPicker />);
    expect(screen.getByTestId("color-picker-root")).toHaveAttribute(
      "aria-label",
      "Renk secici",
    );
  });

  it("custom aria-label destekler", () => {
    render(<ColorPicker aria-label="Arka plan rengi" />);
    expect(screen.getByTestId("color-picker-root")).toHaveAttribute(
      "aria-label",
      "Arka plan rengi",
    );
  });

  it("displayName ColorPicker olarak atanmistir", () => {
    expect(ColorPicker.displayName).toBe("ColorPicker");
  });

  it("role=group atanir", () => {
    render(<ColorPicker />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Label & description                                                */
/* ------------------------------------------------------------------ */

describe("ColorPicker - label & description", () => {
  it("label gosterir", () => {
    render(<ColorPicker label="Tema rengi" />);
    expect(screen.getByTestId("color-picker-label")).toHaveTextContent("Tema rengi");
  });

  it("description gosterir", () => {
    render(<ColorPicker description="Ana renk secin" />);
    expect(screen.getByTestId("color-picker-description")).toHaveTextContent(
      "Ana renk secin",
    );
  });

  it("label ve description birlikte gosterilir", () => {
    render(<ColorPicker label="Renk" description="Aciklama" />);
    expect(screen.getByTestId("color-picker-label")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker-description")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Swatch trigger                                                     */
/* ------------------------------------------------------------------ */

describe("ColorPicker - swatch", () => {
  it("swatch varsayilan rengi gosterir", () => {
    render(<ColorPicker />);
    const swatch = screen.getByTestId("color-picker-swatch");
    expect(swatch.style.backgroundColor).toBe("rgb(59, 130, 246)"); // #3b82f6
  });

  it("controlled value ile swatch rengi degisir", () => {
    render(<ColorPicker value="#ff0000" />);
    const swatch = screen.getByTestId("color-picker-swatch");
    expect(swatch.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("defaultValue ile swatch rengi ayarlanir", () => {
    render(<ColorPicker defaultValue="#00ff00" />);
    const swatch = screen.getByTestId("color-picker-swatch");
    expect(swatch.style.backgroundColor).toBe("rgb(0, 255, 0)");
  });

  it("swatch click ile popover acilir", async () => {
    render(<ColorPicker />);
    expect(screen.queryByTestId("color-picker-popover")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-popover")).toBeInTheDocument();
  });

  it("swatch tekrar click ile popover kapanir", async () => {
    render(<ColorPicker />);
    const swatch = screen.getByTestId("color-picker-swatch");
    await userEvent.click(swatch);
    expect(screen.getByTestId("color-picker-popover")).toBeInTheDocument();
    await userEvent.click(swatch);
    expect(screen.queryByTestId("color-picker-popover")).not.toBeInTheDocument();
  });

  it("Enter tusu ile popover acilir", () => {
    render(<ColorPicker />);
    fireEvent.keyDown(screen.getByTestId("color-picker-swatch"), { key: "Enter" });
    expect(screen.getByTestId("color-picker-popover")).toBeInTheDocument();
  });

  it("Space tusu ile popover acilir", () => {
    render(<ColorPicker />);
    fireEvent.keyDown(screen.getByTestId("color-picker-swatch"), { key: " " });
    expect(screen.getByTestId("color-picker-popover")).toBeInTheDocument();
  });

  it("aria-expanded popover durumunu yansitir", async () => {
    render(<ColorPicker />);
    const swatch = screen.getByTestId("color-picker-swatch");
    expect(swatch).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(swatch);
    expect(swatch).toHaveAttribute("aria-expanded", "true");
  });

  it("aria-haspopup=dialog atanir", () => {
    render(<ColorPicker />);
    expect(screen.getByTestId("color-picker-swatch")).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Popover content                                                    */
/* ------------------------------------------------------------------ */

describe("ColorPicker - popover", () => {
  it("popover role=dialog olur", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("gradient picker goruntulenir", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-gradient")).toBeInTheDocument();
  });

  it("hue slider goruntulenir", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-hue")).toBeInTheDocument();
  });

  it("indicator dot goruntulenir", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-indicator")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Text input                                                         */
/* ------------------------------------------------------------------ */

describe("ColorPicker - text input", () => {
  it("showInput=true ise text input goruntulenir", async () => {
    render(<ColorPicker showInput={true} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-input")).toBeInTheDocument();
  });

  it("showInput=false ise text input goruntulenmez", async () => {
    render(<ColorPicker showInput={false} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.queryByTestId("color-picker-input")).not.toBeInTheDocument();
  });

  it("hex format ile input hex deger gosterir", async () => {
    render(<ColorPicker value="#ff0000" format="hex" />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-input")).toHaveValue("#ff0000");
  });

  it("rgb format ile input rgb deger gosterir", async () => {
    render(<ColorPicker value="#ff0000" format="rgb" />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-input")).toHaveValue(
      "rgb(255, 0, 0)",
    );
  });

  it("hsl format ile input hsl deger gosterir", async () => {
    render(<ColorPicker value="#ff0000" format="hsl" />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-input")).toHaveValue(
      "hsl(0, 100%, 50%)",
    );
  });

  it("gecerli hex girilince onValueChange tetiklenir", async () => {
    const handleChange = vi.fn();
    render(<ColorPicker onValueChange={handleChange} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    const input = screen.getByTestId("color-picker-input");
    // Use fireEvent.change for full value set (userEvent.type sends per-char,
    // which triggers intermediate hex parsing in the component)
    fireEvent.change(input, { target: { value: '#00ff00' } });
    expect(handleChange).toHaveBeenCalledWith("#00ff00");
  });

  it("gecersiz hex girilince onValueChange tetiklenmez", async () => {
    const handleChange = vi.fn();
    render(<ColorPicker onValueChange={handleChange} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    const input = screen.getByTestId("color-picker-input");
    await userEvent.clear(input);
    await userEvent.type(input, 'invalid');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("preview swatch popover icinde goruntulenir", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-preview")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */

describe("ColorPicker - presets", () => {
  const presets = [
    { label: "Ana Renkler", colors: ["#ff0000", "#00ff00", "#0000ff"] },
    { label: "Tonlar", colors: ["#333333", "#666666"] },
  ];

  it("preset palettes goruntulenir", async () => {
    render(<ColorPicker presets={presets} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-presets")).toBeInTheDocument();
  });

  it("preset label goruntulenir", async () => {
    render(<ColorPicker presets={presets} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(
      screen.getByTestId("color-picker-preset-label-Ana Renkler"),
    ).toHaveTextContent("Ana Renkler");
  });

  it("preset renkler button olarak goruntulenir", async () => {
    render(<ColorPicker presets={presets} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-preset-#ff0000")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker-preset-#00ff00")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker-preset-#0000ff")).toBeInTheDocument();
  });

  it("preset renge tiklaninca onValueChange tetiklenir", async () => {
    const handleChange = vi.fn();
    render(<ColorPicker presets={presets} onValueChange={handleChange} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    await userEvent.click(screen.getByTestId("color-picker-preset-#ff0000"));
    expect(handleChange).toHaveBeenCalledWith("#ff0000");
  });

  it("showPresets=false ise presetler goruntulenmez", async () => {
    render(<ColorPicker presets={presets} showPresets={false} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.queryByTestId("color-picker-presets")).not.toBeInTheDocument();
  });

  it("presets prop olmadan preset bolumu goruntulenmez", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.queryByTestId("color-picker-presets")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Hue slider                                                         */
/* ------------------------------------------------------------------ */

describe("ColorPicker - hue slider", () => {
  it("hue degisince onValueChange tetiklenir", async () => {
    const handleChange = vi.fn();
    render(<ColorPicker value="#ff0000" onValueChange={handleChange} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    const hueSlider = screen.getByTestId("color-picker-hue");
    fireEvent.change(hueSlider, { target: { value: "120" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("hue slider aria-label Ton olur", async () => {
    render(<ColorPicker />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.getByTestId("color-picker-hue")).toHaveAttribute(
      "aria-label",
      "Ton",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("ColorPicker - access control", () => {
  it('access="disabled" durumunda popover acilmaz', async () => {
    render(<ColorPicker access="disabled" />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.queryByTestId("color-picker-popover")).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda aria-disabled=true atanir', () => {
    render(<ColorPicker access="disabled" />);
    expect(screen.getByTestId("color-picker-swatch")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(<ColorPicker access="disabled" />);
    expect(screen.getByTestId("color-picker-swatch")).toHaveClass("opacity-50");
  });

  it('access="readonly" durumunda popover acilmaz', async () => {
    render(<ColorPicker access="readonly" />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    expect(screen.queryByTestId("color-picker-popover")).not.toBeInTheDocument();
  });

  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<ColorPicker access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it("accessReason title olarak atanir", () => {
    render(<ColorPicker accessReason="Yetkiniz yok" />);
    expect(screen.getByTestId("color-picker-root")).toHaveAttribute(
      "title",
      "Yetkiniz yok",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("ColorPicker - ref forwarding", () => {
  it("ref forwarding calisir", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ColorPicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe("ColorPicker - className", () => {
  it("custom className eklenir", () => {
    render(<ColorPicker className="my-custom-class" />);
    expect(screen.getByTestId("color-picker-root")).toHaveClass("my-custom-class");
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled                                                       */
/* ------------------------------------------------------------------ */

describe("ColorPicker - uncontrolled", () => {
  it("uncontrolled modda preset secimi swatch rengini gunceller", async () => {
    const presets = [{ label: "Test", colors: ["#ff0000"] }];
    render(<ColorPicker presets={presets} />);
    await userEvent.click(screen.getByTestId("color-picker-swatch"));
    await userEvent.click(screen.getByTestId("color-picker-preset-#ff0000"));
    const swatch = screen.getByTestId("color-picker-swatch");
    expect(swatch.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });
});

describe('ColorPicker — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ColorPicker />);
    await expectNoA11yViolations(container);
  });
});

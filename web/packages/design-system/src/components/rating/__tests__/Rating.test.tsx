// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Rating } from "../Rating";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("Rating - temel render", () => {
  it("varsayilan 5 yildiz render eder", () => {
    render(<Rating />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
  });

  it("radiogroup rolu vardir", () => {
    render(<Rating />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("varsayilan aria-label Degerlendirme olur", () => {
    render(<Rating />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Degerlendirme");
  });

  it("custom aria-label destekler", () => {
    render(<Rating aria-label="Film puani" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Film puani");
  });

  it("custom max ile farkli sayida yildiz render eder", () => {
    render(<Rating max={10} />);
    expect(screen.getAllByRole("radio")).toHaveLength(10);
  });

  it("displayName Rating olarak atanmistir", () => {
    expect(Rating.displayName).toBe("Rating");
  });
});

/* ------------------------------------------------------------------ */
/*  Value display                                                      */
/* ------------------------------------------------------------------ */

describe("Rating - value display", () => {
  it("showValue ile deger gosterir", () => {
    render(<Rating value={3} showValue />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("valueFormatter ile formatli deger gosterir", () => {
    render(<Rating value={4} showValue valueFormatter={(v) => `${v}/5`} />);
    expect(screen.getByText("4/5")).toBeInTheDocument();
  });

  it("labels ile aciklama gosterir", () => {
    render(<Rating value={3} labels={{ 3: "Iyi" }} />);
    expect(screen.getByTestId("rating-label")).toHaveTextContent("Iyi");
  });

  it("controlled value ile dogru yildizlar isaretlenir", () => {
    render(<Rating value={3} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[3]).toHaveAttribute("aria-checked", "false");
  });

  it("defaultValue ile uncontrolled calisir", () => {
    render(<Rating defaultValue={2} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
    expect(radios[2]).toHaveAttribute("aria-checked", "false");
  });
});

/* ------------------------------------------------------------------ */
/*  Half star                                                          */
/* ------------------------------------------------------------------ */

describe("Rating - half star", () => {
  it("allowHalf ile 0.5 deger destekler", () => {
    render(<Rating value={2.5} allowHalf />);
    const radios = screen.getAllByRole("radio");
    // Star 2 (index 1) should be full, star 3 (index 2) should be half
    // The aria-checked should reflect the half-star value
    expect(radios[1]).toHaveAttribute("aria-checked", "false"); // value 2 !== 2.5
    expect(radios[2]).toHaveAttribute("aria-checked", "true");  // half of star 3 = 2.5
  });

  it("allowHalf keyboard step 0.5 olur", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={2} allowHalf onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenCalledWith(2.5);
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe("Rating - keyboard navigation", () => {
  it("ArrowRight degeri arttirir", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={2} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("ArrowLeft degeri azaltir", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("ArrowUp degeri arttirir", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={1} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowUp" });
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("ArrowDown degeri azaltir", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={4} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("Home degeri 0 yapar", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "Home" });
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it("End degeri max yapar", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={1} max={5} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "End" });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("max degerin ustune cikmaz", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={5} max={5} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("0 in altina inmez", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={0} onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it("interactive oldugunda tabIndex=0 olur", () => {
    render(<Rating />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("tabindex", "0");
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("Rating - access control", () => {
  it('access="readonly" durumunda degeri gosterir ama degistirmez', () => {
    const handleChange = vi.fn();
    render(<Rating value={3} access="readonly" onValueChange={handleChange} showValue />);
    expect(screen.getByText("3")).toBeInTheDocument();
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-readonly", "true");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('access="disabled" durumunda opacity azalir ve interaction olmaz', () => {
    const handleChange = vi.fn();
    render(<Rating value={2} access="disabled" onValueChange={handleChange} />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<Rating access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it("accessReason title olarak atanir", () => {
    render(<Rating accessReason="Yetkiniz yok" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("title", "Yetkiniz yok");
  });
});

/* ------------------------------------------------------------------ */
/*  Clear on re-click                                                  */
/* ------------------------------------------------------------------ */

describe("Rating - clear", () => {
  it("ayni degere tiklaninca 0 olur (allowClear=true)", async () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} allowClear onValueChange={handleChange} />);
    const stars = screen.getAllByRole("radio");
    await userEvent.click(stars[2]); // click star 3 which is current value
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it("allowClear=false ise ayni degere tiklaninca degismez", async () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} allowClear={false} onValueChange={handleChange} />);
    const stars = screen.getAllByRole("radio");
    await userEvent.click(stars[2]);
    // Should set to the hoverValue (3) which equals current, so it commits 3
    expect(handleChange).toHaveBeenCalledWith(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Hover                                                              */
/* ------------------------------------------------------------------ */

describe("Rating - hover", () => {
  it("mouse leave onHoverChange(null) tetikler", () => {
    const handleHover = vi.fn();
    render(<Rating onHoverChange={handleHover} />);
    const group = screen.getByRole("radiogroup");
    fireEvent.mouseLeave(group);
    expect(handleHover).toHaveBeenCalledWith(null);
  });
});

/* ------------------------------------------------------------------ */
/*  Custom icons                                                       */
/* ------------------------------------------------------------------ */

describe("Rating - custom icons", () => {
  it("custom icon kullanir", () => {
    render(<Rating value={2} icon={<span data-testid="custom-icon">H</span>} />);
    const icons = screen.getAllByTestId("custom-icon");
    expect(icons).toHaveLength(2); // 2 filled stars
  });

  it("custom emptyIcon kullanir", () => {
    render(
      <Rating value={0} emptyIcon={<span data-testid="empty-icon">E</span>} />,
    );
    const icons = screen.getAllByTestId("empty-icon");
    expect(icons).toHaveLength(5); // all empty
  });
});

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */

describe("Rating - colors", () => {
  it("colors prop ile ozel renkler SVG e uygulanir", () => {
    const { container } = render(
      <Rating value={2} colors={["red", "green", "blue", "yellow", "purple"]} />,
    );
    const svgs = container.querySelectorAll("svg");
    // First filled star should have red fill
    expect(svgs[0]).toHaveAttribute("fill", "red");
    expect(svgs[1]).toHaveAttribute("fill", "green");
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("Rating - ref forwarding", () => {
  it("ref forwarding calisir", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Rating ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe("Rating - className", () => {
  it("custom className eklenir", () => {
    render(<Rating className="my-custom-class" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("my-custom-class");
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Rating — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Rating />);
    await expectNoA11yViolations(container);
  });
});

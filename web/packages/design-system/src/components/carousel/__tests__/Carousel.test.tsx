// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Carousel } from "../Carousel";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const makeItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    key: `slide-${i}`,
    content: <div>Slide {i + 1}</div>,
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("Carousel - temel render", () => {
  it("region rolu ile render eder", () => {
    render(<Carousel items={makeItems(3)} />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("carousel roledescription atar", () => {
    render(<Carousel items={makeItems(3)} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("varsayilan aria-label Slayt gosterisi olur", () => {
    render(<Carousel items={makeItems(3)} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Slayt gosterisi");
  });

  it("custom aria-label destekler", () => {
    render(<Carousel items={makeItems(3)} aria-label="Urun gorselleri" />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Urun gorselleri");
  });

  it("tum slaytlari render eder", () => {
    render(<Carousel items={makeItems(4)} />);
    const slides = screen.getAllByRole("group");
    expect(slides).toHaveLength(4);
  });

  it("slide roledescription atar", () => {
    render(<Carousel items={makeItems(2)} />);
    const slides = screen.getAllByRole("group");
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
  });

  it("displayName Carousel olarak atanmistir", () => {
    expect(Carousel.displayName).toBe("Carousel");
  });

  it("className prop ile ek sinif ekler", () => {
    render(<Carousel items={makeItems(2)} className="my-class" />);
    expect(screen.getByRole("region")).toHaveClass("my-class");
  });
});

/* ------------------------------------------------------------------ */
/*  Arrows                                                             */
/* ------------------------------------------------------------------ */

describe("Carousel - arrows", () => {
  it("showArrows=true ile ok butonlari gosterir", () => {
    render(<Carousel items={makeItems(3)} showArrows />);
    expect(screen.getByLabelText("Onceki slayt")).toBeInTheDocument();
    expect(screen.getByLabelText("Sonraki slayt")).toBeInTheDocument();
  });

  it("showArrows=false ile ok butonlari gizler", () => {
    render(<Carousel items={makeItems(3)} showArrows={false} />);
    expect(screen.queryByLabelText("Onceki slayt")).not.toBeInTheDocument();
  });

  it("sonraki ok tiklaninca sonraki slayta gecer", async () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} onSlideChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Sonraki slayt"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("onceki ok tiklaninca onceki slayta gecer", async () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} onSlideChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Sonraki slayt"));
    await userEvent.click(screen.getByLabelText("Onceki slayt"));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("loop=true ile son slayttan ilk slayta doner", async () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(2)} loop onSlideChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Sonraki slayt")); // -> 1
    await userEvent.click(screen.getByLabelText("Sonraki slayt")); // -> 0 (loop)
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("loop=false ile son slayttan ileri gidemez", async () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(2)} loop={false} onSlideChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Sonraki slayt")); // -> 1
    await userEvent.click(screen.getByLabelText("Sonraki slayt")); // -> 1 (no loop)
    expect(onChange).toHaveBeenLastCalledWith(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Dots                                                               */
/* ------------------------------------------------------------------ */

describe("Carousel - dots", () => {
  it("showDots=true ile dot gostergeleri gosterir", () => {
    render(<Carousel items={makeItems(3)} showDots />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("showDots=false ile dot gostergeleri gizler", () => {
    render(<Carousel items={makeItems(3)} showDots={false} />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("dot tiklaninca ilgili slayta gecer", async () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(4)} onSlideChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Slayt 3"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("aktif dot aria-selected=true olur", () => {
    render(<Carousel items={makeItems(3)} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe("Carousel - keyboard", () => {
  it("ArrowRight ile sonraki slayta gecer", () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} onSlideChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("ArrowLeft ile onceki slayta gecer", () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} onSlideChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("vertical modda ArrowDown ile sonraki slayta gecer", () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} orientation="vertical" onSlideChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("vertical modda ArrowUp ile onceki slayta gecer", () => {
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} orientation="vertical" onSlideChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Auto-play                                                          */
/* ------------------------------------------------------------------ */

describe("Carousel - auto-play", () => {
  it("autoPlay ile otomatik ilerler", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} autoPlay autoPlayInterval={1000} onSlideChange={onChange} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenCalledWith(1);
    vi.useRealTimers();
  });

  it("hover durumunda auto-play durur", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<Carousel items={makeItems(3)} autoPlay autoPlayInterval={1000} onSlideChange={onChange} />);
    fireEvent.mouseEnter(screen.getByRole("region"));
    act(() => { vi.advanceTimersByTime(2000); });
    expect(onChange).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("Carousel - access control", () => {
  it("access=hidden ile hicbir sey render etmez", () => {
    const { container } = render(<Carousel items={makeItems(3)} access="hidden" />);
    expect(container.firstChild).toBeNull();
  });

  it("access=disabled ile aria-disabled true olur", () => {
    render(<Carousel items={makeItems(3)} access="disabled" />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-disabled", "true");
  });

  it("access=disabled ile ok butonlari gosterilmez", () => {
    render(<Carousel items={makeItems(3)} access="disabled" />);
    expect(screen.queryByLabelText("Onceki slayt")).not.toBeInTheDocument();
  });

  it("access=readonly ile ok butonlari gosterilmez", () => {
    render(<Carousel items={makeItems(3)} access="readonly" />);
    expect(screen.queryByLabelText("Onceki slayt")).not.toBeInTheDocument();
  });

  it("accessReason title olarak gosterilir", () => {
    render(<Carousel items={makeItems(3)} access="disabled" accessReason="Yetkisiz" />);
    expect(screen.getByRole("region")).toHaveAttribute("title", "Yetkisiz");
  });
});

/* ------------------------------------------------------------------ */
/*  slidesPerView & size                                               */
/* ------------------------------------------------------------------ */

describe("Carousel - config", () => {
  it("slidesPerView=2 ile dots sayisi dogru olur", () => {
    render(<Carousel items={makeItems(4)} slidesPerView={2} />);
    // 4 items, 2 per view => maxIndex=2, so 3 dots
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("size sm sinifini uygulanir", () => {
    render(<Carousel items={makeItems(2)} size="sm" />);
    expect(screen.getByRole("region")).toHaveClass("h-48");
  });

  it("size lg sinifini uygulanir", () => {
    render(<Carousel items={makeItems(2)} size="lg" />);
    expect(screen.getByRole("region")).toHaveClass("h-96");
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Carousel — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Carousel items={makeItems(3)} />);
    await expectNoA11yViolations(container);
  });
});

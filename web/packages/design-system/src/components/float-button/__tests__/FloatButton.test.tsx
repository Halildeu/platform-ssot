// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { FloatButton } from "../FloatButton";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("FloatButton - temel render", () => {
  it("varsayilan olarak render edilir", () => {
    render(<FloatButton />);
    expect(screen.getByTestId("float-button-root")).toBeInTheDocument();
    expect(screen.getByTestId("float-button-trigger")).toBeInTheDocument();
  });

  it("varsayilan aria-label Eylem butonu olur", () => {
    render(<FloatButton />);
    expect(screen.getByTestId("float-button-trigger")).toHaveAttribute(
      "aria-label",
      "Eylem butonu",
    );
  });

  it("custom aria-label destekler", () => {
    render(<FloatButton aria-label="Yeni ekle" />);
    expect(screen.getByTestId("float-button-trigger")).toHaveAttribute(
      "aria-label",
      "Yeni ekle",
    );
  });

  it("displayName FloatButton olarak atanmistir", () => {
    expect(FloatButton.displayName).toBe("FloatButton");
  });

  it("custom icon render eder", () => {
    render(
      <FloatButton icon={<span data-testid="custom-icon">+</span>} />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("icon yoksa varsayilan SVG icon render eder", () => {
    const { container } = render(<FloatButton />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("label gosterir", () => {
    render(<FloatButton label="Ekle" />);
    expect(screen.getByText("Ekle")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Position & style                                                   */
/* ------------------------------------------------------------------ */

describe("FloatButton - position", () => {
  it("varsayilan position bottom-right olur", () => {
    render(<FloatButton />);
    const root = screen.getByTestId("float-button-root");
    expect(root.style.position).toBe("fixed");
    expect(root.style.right).toBe("24px");
    expect(root.style.bottom).toBe("24px");
  });

  it("bottom-left position destekler", () => {
    render(<FloatButton position="bottom-left" />);
    const root = screen.getByTestId("float-button-root");
    expect(root.style.left).toBe("24px");
    expect(root.style.bottom).toBe("24px");
  });

  it("top-right position destekler", () => {
    render(<FloatButton position="top-right" />);
    const root = screen.getByTestId("float-button-root");
    expect(root.style.right).toBe("24px");
    expect(root.style.top).toBe("24px");
  });

  it("top-left position destekler", () => {
    render(<FloatButton position="top-left" />);
    const root = screen.getByTestId("float-button-root");
    expect(root.style.left).toBe("24px");
    expect(root.style.top).toBe("24px");
  });

  it("custom offset destekler", () => {
    render(<FloatButton offset={[32, 48]} />);
    const root = screen.getByTestId("float-button-root");
    expect(root.style.right).toBe("32px");
    expect(root.style.bottom).toBe("48px");
  });
});

/* ------------------------------------------------------------------ */
/*  Shape                                                              */
/* ------------------------------------------------------------------ */

describe("FloatButton - shape", () => {
  it("circle shape ile rounded-full sinifi olur", () => {
    render(<FloatButton shape="circle" />);
    expect(screen.getByTestId("float-button-trigger")).toHaveClass("rounded-full");
  });

  it("square shape ile rounded-lg sinifi olur", () => {
    render(<FloatButton shape="square" />);
    expect(screen.getByTestId("float-button-trigger")).toHaveClass("rounded-lg");
  });
});

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */

describe("FloatButton - badge", () => {
  it("badge={true} dot gosterir", () => {
    render(<FloatButton badge={true} />);
    expect(screen.getByTestId("float-button-badge-dot")).toBeInTheDocument();
  });

  it("badge={5} sayi gosterir", () => {
    render(<FloatButton badge={5} />);
    expect(screen.getByTestId("float-button-badge-count")).toHaveTextContent("5");
  });

  it("badge > 99 ise 99+ gosterir", () => {
    render(<FloatButton badge={150} />);
    expect(screen.getByTestId("float-button-badge-count")).toHaveTextContent("99+");
  });

  it("badge={false} ise badge gostermez", () => {
    render(<FloatButton badge={false} />);
    expect(screen.queryByTestId("float-button-badge-dot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("float-button-badge-count")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Click                                                              */
/* ------------------------------------------------------------------ */

describe("FloatButton - click", () => {
  it("onClick tetiklenir", async () => {
    const handleClick = vi.fn();
    render(<FloatButton onClick={handleClick} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Enter tusu ile onClick tetiklenir", () => {
    const handleClick = vi.fn();
    render(<FloatButton onClick={handleClick} />);
    fireEvent.keyDown(screen.getByTestId("float-button-trigger"), { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Space tusu ile onClick tetiklenir", () => {
    const handleClick = vi.fn();
    render(<FloatButton onClick={handleClick} />);
    fireEvent.keyDown(screen.getByTestId("float-button-trigger"), { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Group / speed-dial                                                 */
/* ------------------------------------------------------------------ */

describe("FloatButton - group", () => {
  const groupItems = [
    { key: "edit", icon: <span>E</span>, label: "Duzenle", onClick: vi.fn() },
    { key: "delete", icon: <span>D</span>, label: "Sil", onClick: vi.fn() },
  ];

  it("items prop ile group menu render eder", () => {
    render(<FloatButton items={groupItems} />);
    expect(screen.getByTestId("float-button-group")).toBeInTheDocument();
    expect(screen.getByTestId("float-button-item-edit")).toBeInTheDocument();
    expect(screen.getByTestId("float-button-item-delete")).toBeInTheDocument();
  });

  it("group varsayilan olarak kapali olur", () => {
    render(<FloatButton items={groupItems} />);
    const group = screen.getByTestId("float-button-group");
    expect(group).toHaveClass("opacity-0");
  });

  it("click ile group acilir", async () => {
    render(<FloatButton items={groupItems} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    const group = screen.getByTestId("float-button-group");
    expect(group).toHaveClass("opacity-100");
  });

  it("tekrar click ile group kapanir", async () => {
    render(<FloatButton items={groupItems} />);
    const trigger = screen.getByTestId("float-button-trigger");
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-0");
  });

  it("group item click oldugunda item onClick tetiklenir ve menu kapanir", async () => {
    const itemClick = vi.fn();
    const items = [{ key: "test", label: "Test", onClick: itemClick }];
    render(<FloatButton items={items} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    await userEvent.click(screen.getByTestId("float-button-item-test"));
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-0");
  });

  it("aria-expanded group durumunu yansitir", async () => {
    render(<FloatButton items={groupItems} />);
    const trigger = screen.getByTestId("float-button-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("aria-haspopup=menu group varken atanir", () => {
    render(<FloatButton items={groupItems} />);
    expect(screen.getByTestId("float-button-trigger")).toHaveAttribute(
      "aria-haspopup",
      "menu",
    );
  });

  it("group olmadan aria-haspopup atanmaz", () => {
    render(<FloatButton />);
    expect(screen.getByTestId("float-button-trigger")).not.toHaveAttribute("aria-haspopup");
  });

  it("group menu role=menu olur", () => {
    render(<FloatButton items={groupItems} />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("group item role=menuitem olur", () => {
    render(<FloatButton items={groupItems} />);
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("Escape ile group kapanir", async () => {
    render(<FloatButton items={groupItems} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-100");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-0");
  });

  it("controlled open prop destekler", () => {
    render(<FloatButton items={groupItems} open={true} />);
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-100");
  });

  it("onOpenChange tetiklenir", async () => {
    const handleOpenChange = vi.fn();
    render(
      <FloatButton items={groupItems} onOpenChange={handleOpenChange} />,
    );
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it("trigger=hover ile mouseEnter grubu acar", () => {
    render(<FloatButton items={groupItems} trigger="hover" />);
    fireEvent.mouseEnter(screen.getByTestId("float-button-root"));
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-100");
  });

  it("trigger=hover ile mouseLeave grubu kapatir", () => {
    render(<FloatButton items={groupItems} trigger="hover" />);
    const root = screen.getByTestId("float-button-root");
    fireEvent.mouseEnter(root);
    fireEvent.mouseLeave(root);
    expect(screen.getByTestId("float-button-group")).toHaveClass("opacity-0");
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("FloatButton - access control", () => {
  it('access="disabled" durumunda onClick tetiklenmez', async () => {
    const handleClick = vi.fn();
    render(<FloatButton access="disabled" onClick={handleClick} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('access="disabled" durumunda aria-disabled=true atanir', () => {
    render(<FloatButton access="disabled" />);
    expect(screen.getByTestId("float-button-trigger")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it('access="disabled" durumunda opacity azalir', () => {
    render(<FloatButton access="disabled" />);
    expect(screen.getByTestId("float-button-trigger")).toHaveClass("opacity-50");
  });

  it('access="readonly" durumunda onClick tetiklenmez', async () => {
    const handleClick = vi.fn();
    render(<FloatButton access="readonly" onClick={handleClick} />);
    await userEvent.click(screen.getByTestId("float-button-trigger"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('access="hidden" durumunda null doner', () => {
    const { container } = render(<FloatButton access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it("accessReason title olarak atanir", () => {
    render(<FloatButton accessReason="Yetkiniz yok" />);
    expect(screen.getByTestId("float-button-root")).toHaveAttribute(
      "title",
      "Yetkiniz yok",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe("FloatButton - ref forwarding", () => {
  it("ref forwarding calisir", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<FloatButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe("FloatButton - className", () => {
  it("custom className eklenir", () => {
    render(<FloatButton className="my-custom-class" />);
    expect(screen.getByTestId("float-button-root")).toHaveClass("my-custom-class");
  });
});

describe('FloatButton — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<FloatButton aria-label="Add" />);
    await expectNoA11yViolations(container);
  });
});

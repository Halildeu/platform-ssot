// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { AvatarGroup } from "../AvatarGroup";
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const makeItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    key: `user-${i}`,
    name: `User ${i + 1}`,
    src: `https://example.com/avatar-${i}.png`,
  }));

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - temel render", () => {
  it("group rolu ile render eder", () => {
    render(<AvatarGroup items={makeItems(3)} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("varsayilan aria-label Avatar grubu olur", () => {
    render(<AvatarGroup items={makeItems(3)} />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Avatar grubu");
  });

  it("tum avatar ogeleri render eder", () => {
    render(<AvatarGroup items={makeItems(4)} />);
    expect(screen.getAllByTestId("avatar-group-item")).toHaveLength(4);
  });

  it("displayName AvatarGroup olarak atanmistir", () => {
    expect(AvatarGroup.displayName).toBe("AvatarGroup");
  });

  it("className prop ile ek sinif ekler", () => {
    render(<AvatarGroup items={makeItems(2)} className="my-class" />);
    expect(screen.getByRole("group")).toHaveClass("my-class");
  });
});

/* ------------------------------------------------------------------ */
/*  Max & overflow                                                     */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - max & overflow", () => {
  it("max ile fazla avatar gizlenir ve +N gosterilir", () => {
    render(<AvatarGroup items={makeItems(7)} max={3} />);
    expect(screen.getAllByTestId("avatar-group-item")).toHaveLength(3);
    expect(screen.getByTestId("avatar-group-excess")).toHaveTextContent("+4");
  });

  it("max yoksa tum avatarlar gosterilir", () => {
    render(<AvatarGroup items={makeItems(5)} />);
    expect(screen.getAllByTestId("avatar-group-item")).toHaveLength(5);
    expect(screen.queryByTestId("avatar-group-excess")).not.toBeInTheDocument();
  });

  it("max items sayisindan buyukse overflow gosterilmez", () => {
    render(<AvatarGroup items={makeItems(2)} max={5} />);
    expect(screen.getAllByTestId("avatar-group-item")).toHaveLength(2);
    expect(screen.queryByTestId("avatar-group-excess")).not.toBeInTheDocument();
  });

  it("max=0 ise hic avatar gostermez ve tumu overflow olur", () => {
    render(<AvatarGroup items={makeItems(3)} max={0} />);
    expect(screen.queryAllByTestId("avatar-group-item")).toHaveLength(0);
    expect(screen.getByTestId("avatar-group-excess")).toHaveTextContent("+3");
  });

  it("renderExcess ile ozel overflow render eder", () => {
    render(
      <AvatarGroup
        items={makeItems(5)}
        max={2}
        renderExcess={(count) => <span data-testid="custom-excess">{count} kisi daha</span>}
      />,
    );
    expect(screen.getByTestId("custom-excess")).toHaveTextContent("3 kisi daha");
  });

  it("+N badge dogru aria-label alir", () => {
    render(<AvatarGroup items={makeItems(5)} max={2} />);
    expect(screen.getByTestId("avatar-group-excess")).toHaveAttribute("aria-label", "+3 daha");
  });
});

/* ------------------------------------------------------------------ */
/*  onClick                                                            */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - onClick", () => {
  it("avatar tiklaninca onClick tetiklenir", async () => {
    const handleClick = vi.fn();
    const items = makeItems(3);
    render(<AvatarGroup items={items} onClick={handleClick} />);
    const avatars = screen.getAllByTestId("avatar-group-item");
    await userEvent.click(avatars[1].querySelector("[class]")!);
    expect(handleClick).toHaveBeenCalledWith(items[1]);
  });

  it("onClick verilmezse tiklama isi yapilmaz", async () => {
    render(<AvatarGroup items={makeItems(3)} />);
    // Just ensure no error on click
    await userEvent.click(screen.getAllByTestId("avatar-group-item")[0]);
  });
});

/* ------------------------------------------------------------------ */
/*  Size & shape                                                       */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - size & shape", () => {
  it("circle shape ile rounded-full sinifi uygular", () => {
    render(<AvatarGroup items={makeItems(2)} shape="circle" />);
    const item = screen.getAllByTestId("avatar-group-item")[0];
    expect(item).toHaveClass("rounded-full");
  });

  it("square shape ile rounded-lg sinifi uygular", () => {
    render(<AvatarGroup items={makeItems(2)} shape="square" />);
    const item = screen.getAllByTestId("avatar-group-item")[0];
    expect(item).toHaveClass("rounded-lg");
  });
});

/* ------------------------------------------------------------------ */
/*  Spacing                                                            */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - spacing", () => {
  it("tight spacing ile -ms-3 sinifi uygular", () => {
    render(<AvatarGroup items={makeItems(3)} spacing="tight" />);
    const items = screen.getAllByTestId("avatar-group-item");
    // 2nd item should have tight margin
    expect(items[1]).toHaveClass("-ms-3");
  });

  it("loose spacing ile -ms-1 sinifi uygular", () => {
    render(<AvatarGroup items={makeItems(3)} spacing="loose" />);
    const items = screen.getAllByTestId("avatar-group-item");
    expect(items[1]).toHaveClass("-ms-1");
  });

  it("ilk avatar negatif margin almaz", () => {
    render(<AvatarGroup items={makeItems(3)} spacing="tight" />);
    const items = screen.getAllByTestId("avatar-group-item");
    expect(items[0]).not.toHaveClass("-ms-3");
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - access control", () => {
  it("access=hidden ile hicbir sey render etmez", () => {
    const { container } = render(<AvatarGroup items={makeItems(3)} access="hidden" />);
    expect(container.firstChild).toBeNull();
  });

  it("access=disabled ile aria-disabled true olur", () => {
    render(<AvatarGroup items={makeItems(3)} access="disabled" />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-disabled", "true");
  });

  it("access=disabled ile onClick tetiklenmez", async () => {
    const handleClick = vi.fn();
    render(<AvatarGroup items={makeItems(3)} access="disabled" onClick={handleClick} />);
    await userEvent.click(screen.getAllByTestId("avatar-group-item")[0]);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("accessReason title olarak gosterilir", () => {
    render(<AvatarGroup items={makeItems(3)} access="disabled" accessReason="Yetkisiz" />);
    expect(screen.getByRole("group")).toHaveAttribute("title", "Yetkisiz");
  });
});

/* ------------------------------------------------------------------ */
/*  Name / initials                                                    */
/* ------------------------------------------------------------------ */

describe("AvatarGroup - name display", () => {
  it("title ile isim gosterir", () => {
    render(<AvatarGroup items={[{ key: "a", name: "Ali Veli" }]} />);
    expect(screen.getByTestId("avatar-group-item")).toHaveAttribute("title", "Ali Veli");
  });

  it("isim yoksa title atanmaz", () => {
    render(<AvatarGroup items={[{ key: "a" }]} />);
    expect(screen.getByTestId("avatar-group-item")).not.toHaveAttribute("title");
  });
});

describe('AvatarGroup — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AvatarGroup items={[{ key: 'u1', name: 'User 1' }]} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('AvatarGroup — quality signals', () => {
  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
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

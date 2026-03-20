// @vitest-environment jsdom
import React from "react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { Icon, createIcon } from "../Icon";
import type { IconProps } from "../Icon";

// Import a representative sample from each category
import { IconCheck } from "../action/IconCheck";
import { IconClose } from "../action/IconClose";
import { IconPlus } from "../action/IconPlus";
import { IconSearch } from "../action/IconSearch";
import { IconChevronDown } from "../navigation/IconChevronDown";
import { IconArrowLeft } from "../navigation/IconArrowLeft";
import { IconMenu } from "../navigation/IconMenu";
import { IconInfo } from "../status/IconInfo";
import { IconWarning } from "../status/IconWarning";
import { IconError } from "../status/IconError";
import { IconSuccess } from "../status/IconSuccess";
import { IconLoading } from "../status/IconLoading";
import { IconBell } from "../communication/IconBell";
import { IconMail } from "../communication/IconMail";
import { IconCalendar } from "../data/IconCalendar";
import { IconFile } from "../data/IconFile";
import { IconUser } from "../user/IconUser";
import { IconSettings } from "../user/IconSettings";
import { IconEye } from "../ui/IconEye";
import { IconStar } from "../ui/IconStar";
import { IconHeart } from "../ui/IconHeart";

/* ------------------------------------------------------------------ */
/*  Base Icon Component                                                */
/* ------------------------------------------------------------------ */

describe("Icon — base component", () => {
  it("renders an svg element", () => {
    const { container } = render(
      <Icon><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName).toBe("svg");
  });

  it("applies default size (24)", () => {
    const { container } = render(
      <Icon><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("accepts custom size", () => {
    const { container } = render(
      <Icon size={16}><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("16");
  });

  it("is decorative (aria-hidden) when no label", () => {
    const { container } = render(
      <Icon><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });

  it("is accessible (aria-label + role=img) with label", () => {
    const { container } = render(
      <Icon label="Check mark"><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-label")).toBe("Check mark");
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-hidden")).toBeNull();
  });

  it("applies className", () => {
    const { container } = render(
      <Icon className="text-red-500"><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.className.baseVal).toContain("text-red-500");
  });

  it("passes through extra SVG attributes", () => {
    const { container } = render(
      <Icon data-testid="icon-test" opacity={0.5}><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-testid")).toBe("icon-test");
    expect(svg.getAttribute("opacity")).toBe("0.5");
  });

  it("defaults strokeWidth to 2", () => {
    const { container } = render(
      <Icon><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("stroke-width")).toBe("2");
  });

  it("accepts custom strokeWidth", () => {
    const { container } = render(
      <Icon strokeWidth={1.5}><path d="M0 0" /></Icon>,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("stroke-width")).toBe("1.5");
  });
});

/* ------------------------------------------------------------------ */
/*  createIcon factory                                                 */
/* ------------------------------------------------------------------ */

describe("createIcon — factory", () => {
  it("creates a component with correct displayName", () => {
    const TestIcon = createIcon("TestIcon", <path d="M0 0" />);
    expect(TestIcon.displayName).toBe("TestIcon");
  });

  it("renders svg with default props", () => {
    const TestIcon = createIcon("TestIcon", <path d="M12 2v20" />);
    const { container } = render(<TestIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("width")).toBe("24");
  });

  it("accepts size prop", () => {
    const TestIcon = createIcon("TestIcon", <path d="M0 0" />);
    const { container } = render(<TestIcon size={32} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });
});

/* ------------------------------------------------------------------ */
/*  Individual icon smoke tests                                       */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.FC<IconProps>> = {
  IconCheck, IconClose, IconPlus, IconSearch,
  IconChevronDown, IconArrowLeft, IconMenu,
  IconInfo, IconWarning, IconError, IconSuccess, IconLoading,
  IconBell, IconMail,
  IconCalendar, IconFile,
  IconUser, IconSettings,
  IconEye, IconStar, IconHeart,
};

describe("Individual icons — render smoke", () => {
  Object.entries(iconMap).forEach(([name, Comp]) => {
    it(`${name} renders an svg with path children`, () => {
      const { container } = render(<Comp />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      const hasShapes =
        svg!.querySelector("path") ||
        svg!.querySelector("circle") ||
        svg!.querySelector("line") ||
        svg!.querySelector("rect") ||
        svg!.querySelector("polyline") ||
        svg!.querySelector("polygon");
      expect(hasShapes).toBeTruthy();
    });
  });

  it("all icons accept size, className, and label", () => {
    const { container } = render(
      <IconCheck size={20} className="text-green-500" label="Checked" />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.className.baseVal).toContain("text-green-500");
    expect(svg.getAttribute("aria-label")).toBe("Checked");
    expect(svg.getAttribute("role")).toBe("img");
  });
});

/* ------------------------------------------------------------------ */
/*  Barrel re-exports                                                  */
/* ------------------------------------------------------------------ */

describe("Icons barrel — index.ts", () => {
  it("re-exports Icon base component", async () => {
    const barrel = await import("../index");
    expect(barrel.Icon).toBeDefined();
  });

  it("re-exports action icons", async () => {
    const barrel = await import("../index");
    expect(barrel.IconCheck).toBeDefined();
    expect(barrel.IconClose).toBeDefined();
    expect(barrel.IconPlus).toBeDefined();
    expect(barrel.IconSearch).toBeDefined();
  });

  it("re-exports navigation icons", async () => {
    const barrel = await import("../index");
    expect(barrel.IconChevronDown).toBeDefined();
    expect(barrel.IconArrowLeft).toBeDefined();
  });

  it("re-exports status icons", async () => {
    const barrel = await import("../index");
    expect(barrel.IconInfo).toBeDefined();
    expect(barrel.IconWarning).toBeDefined();
    expect(barrel.IconError).toBeDefined();
  });
});

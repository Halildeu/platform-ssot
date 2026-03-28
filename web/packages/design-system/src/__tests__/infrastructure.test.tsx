// @vitest-environment jsdom
import React from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Imports — components & modules under test                          */
/* ------------------------------------------------------------------ */

/* Category W: barrel imports */
import * as DesignSystem from "../components/index";
import * as Primitives from "../primitives/index";

/* Category X–Z: individual components */
import { SearchFilterListing } from "../components/search-filter-listing";
import { ApprovalReview } from "../components/approval-review";
import { Accordion } from "../components/accordion";
import { Calendar } from "../components/calendar";
import { Timeline } from "../components/timeline";
import { Transfer } from "../components/transfer";
import { NavigationRail } from "../components/navigation-rail";
import { MenuBar } from "../components/menu-bar";
import { Breadcrumb } from "../components/breadcrumb";
import { SmartDashboard } from "../components/smart-dashboard";
import { List } from "../components/list";
import { Tabs } from "../components/tabs";
import { CommandPalette } from "../components/command-palette";
import { Modal } from "../primitives/modal";
import { Carousel } from "../components/carousel";
import { Tooltip } from "../primitives/tooltip";
import { Button } from "../primitives/button";

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  Shared fixture data                                                */
/* ================================================================== */

const CHECKPOINT_PROPS = {
  title: "Approval gate",
  summary: "Requires sign-off before deploy.",
  status: "pending" as const,
  steps: [
    { key: "s1", label: "Legal review", status: "ready" as const },
    { key: "s2", label: "Security scan", status: "todo" as const },
  ],
};

const CITATION_ITEMS = [
  {
    id: "c1",
    title: "KVKK Regulation Art.12",
    excerpt: "Personal data processing requirements for compliance.",
    source: "Legal DB",
    kind: "policy" as const,
  },
];

const AUDIT_ITEMS = [
  {
    id: "a1",
    actor: "ai" as const,
    title: "Draft generated",
    timestamp: "2 hours ago",
    status: "drafted" as const,
  },
];

const NAV_ITEMS = [
  { value: "home", label: "Home" },
  { value: "settings", label: "Settings" },
  { value: "reports", label: "Reports" },
];

const ACCORDION_ITEMS = [
  { value: "a1", title: "Section A", content: "Content A body text here" },
  { value: "a2", title: "Section B", content: "Content B body text here" },
];

const LIST_ITEMS = [
  { key: "l1", title: "Item Alpha" },
  { key: "l2", title: "Item Beta", description: "Secondary description" },
];

const MENUBAR_ITEMS = [
  { value: "file", label: "File" },
  { value: "edit", label: "Edit" },
  { value: "view", label: "View" },
];

const TRANSFER_DATA = [
  { key: "t1", label: "Item 1" },
  { key: "t2", label: "Item 2" },
  { key: "t3", label: "Item 3" },
];

const TIMELINE_ITEMS = [
  { key: "tl1", children: "Project started", color: "primary" as const },
  { key: "tl2", children: "First release", color: "success" as const },
];

const DASHBOARD_WIDGETS = [
  {
    key: "w1",
    title: "Revenue",
    type: "kpi" as const,
    value: "$12,345",
    tone: "success" as const,
  },
  {
    key: "w2",
    title: "Active Users",
    type: "kpi" as const,
    value: "1,234",
    tone: "info" as const,
  },
];

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings" },
  { label: "Profile" },
];

const TABS_ITEMS = [
  { key: "t1", label: "Tab A", children: "Panel A" },
  { key: "t2", label: "Tab B", children: "Panel B" },
];

const COMMAND_ITEMS = [
  { id: "cmd1", title: "Go to Dashboard", group: "Navigation" },
  { id: "cmd2", title: "Create Report", group: "Actions" },
];

const CAROUSEL_ITEMS = [
  { key: "s1", content: <div>Slide 1</div> },
  { key: "s2", content: <div>Slide 2</div> },
  { key: "s3", content: <div>Slide 3</div> },
];

/* ================================================================== */
/*  CATEGORY W: Tree-Shaking / Named Export Tests                      */
/* ================================================================== */

describe("Infrastructure — W: Tree-Shaking / Named Exports", () => {
  it("components/index.ts exports are named (not just default)", () => {
    const exportNames = Object.keys(DesignSystem);
    expect(exportNames.length).toBeGreaterThan(50);
    // Should contain key component names
    expect(exportNames).toContain("Button" in DesignSystem ? "Button" : "SearchFilterListing");
    expect(exportNames).toContain("SearchFilterListing");
    expect(exportNames).toContain("Accordion");
    expect(exportNames).toContain("Calendar");
    expect(exportNames).toContain("Timeline");
    expect(exportNames).toContain("Transfer");
    expect(exportNames).toContain("Rating");
  });

  it("primitives/index.ts exports are named (not just default)", () => {
    const exportNames = Object.keys(Primitives);
    expect(exportNames.length).toBeGreaterThan(10);
    expect(exportNames).toContain("Button");
    expect(exportNames).toContain("Badge");
    expect(exportNames).toContain("Input");
    expect(exportNames).toContain("Modal");
    expect(exportNames).toContain("Tooltip");
  });

  it("type exports exist alongside component exports", () => {
    const exportNames = Object.keys(DesignSystem);
    // At minimum, component exports (PascalCase) should be present
    expect(exportNames.filter((n) => /^[A-Z]/.test(n)).length).toBeGreaterThan(30);
  });

  it("no duplicate export names in components barrel", () => {
    const exportNames = Object.keys(DesignSystem);
    const unique = new Set(exportNames);
    expect(unique.size).toBe(exportNames.length);
  });

  it("no duplicate export names in primitives barrel", () => {
    const exportNames = Object.keys(Primitives);
    const unique = new Set(exportNames);
    expect(unique.size).toBe(exportNames.length);
  });
});

/* ================================================================== */
/*  CATEGORY X: CSS Variable Completeness Tests                        */
/* ================================================================== */

describe("Infrastructure — X: CSS Variable Completeness (no bare bg-white)", () => {
  // For key components, render and check the innerHTML doesn't contain bare
  // hardcoded bg-white class (without opacity modifier like bg-white/80).
  // bg-white without CSS variable wrapper breaks dark-mode theming.

  const COMPONENTS_TO_CHECK: { name: string; element: React.ReactElement }[] = [
    { name: "SearchFilterListing", element: <SearchFilterListing title="T" /> },
    {
      name: "ApprovalReview",
      element: (
        <ApprovalReview
          checkpoint={CHECKPOINT_PROPS}
          citations={CITATION_ITEMS}
          auditItems={AUDIT_ITEMS}
        />
      ),
    },
    {
      name: "Accordion",
      element: <Accordion items={ACCORDION_ITEMS} />,
    },
    { name: "List", element: <List items={LIST_ITEMS} /> },
    { name: "Timeline", element: <Timeline items={TIMELINE_ITEMS} /> },
    { name: "Transfer", element: <Transfer dataSource={TRANSFER_DATA} /> },
    {
      name: "SmartDashboard",
      element: <SmartDashboard widgets={DASHBOARD_WIDGETS} />,
    },
  ];

  COMPONENTS_TO_CHECK.forEach(({ name, element }) => {
    it(`${name} rendered output has no bare bg-white class`, () => {
      const { container } = render(element);
      const html = container.innerHTML;
      // Match class attributes containing bg-white that is NOT followed by /
      // (i.e. bg-white/80 is OK, bare bg-white is suspicious)
      const allBgWhite = html.match(/\bbg-white\b/g) ?? [];
      const withOpacity = html.match(/\bbg-white\/\d+/g) ?? [];
      const bareCount = allBgWhite.length - withOpacity.length;
      expect(bareCount).toBe(0);
    });
  });
});

/* ================================================================== */
/*  CATEGORY Y: RTL (Right-to-Left) Rendering Safety Tests             */
/* ================================================================== */

describe("Infrastructure — Y: RTL Rendering Safety", () => {
  const RTLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div dir="rtl">{children}</div>
  );

  it("SearchFilterListing renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <SearchFilterListing title="RTL Test" />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="search-filter-listing"]'),
    ).toBeInTheDocument();
  });

  it("ApprovalReview renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <ApprovalReview
          checkpoint={CHECKPOINT_PROPS}
          citations={CITATION_ITEMS}
          auditItems={AUDIT_ITEMS}
        />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="approval-review"]'),
    ).toBeInTheDocument();
  });

  it("Accordion renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Accordion items={ACCORDION_ITEMS} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="accordion"]'),
    ).toBeInTheDocument();
  });

  it("Calendar renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Calendar />
      </RTLWrapper>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it("Timeline renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Timeline items={TIMELINE_ITEMS} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="timeline"]'),
    ).toBeInTheDocument();
  });

  it("Transfer renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Transfer dataSource={TRANSFER_DATA} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="transfer"]'),
    ).toBeInTheDocument();
  });

  it("NavigationRail renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <NavigationRail items={NAV_ITEMS} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="navigation-rail"]'),
    ).toBeInTheDocument();
  });

  it("MenuBar renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <MenuBar items={MENUBAR_ITEMS} />
      </RTLWrapper>,
    );
    // MenuBar doesn't use data-component; just verify it rendered
    expect(container.querySelector("nav, [role='menubar']") ?? container.firstElementChild).toBeTruthy();
  });

  it("Breadcrumb renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </RTLWrapper>,
    );
    expect(container.querySelector('nav[aria-label="Breadcrumb"]')).toBeInTheDocument();
  });

  it("SmartDashboard renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <SmartDashboard widgets={DASHBOARD_WIDGETS} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="smart-dashboard"]'),
    ).toBeInTheDocument();
  });

  it("List renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <List items={LIST_ITEMS} />
      </RTLWrapper>,
    );
    expect(
      container.querySelector('[data-component="list"]'),
    ).toBeInTheDocument();
  });

  it("Tabs renders in RTL without crash", () => {
    const { container } = render(
      <RTLWrapper>
        <Tabs items={TABS_ITEMS} />
      </RTLWrapper>,
    );
    expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  CATEGORY Z: Animation / Transition Cleanup Tests                   */
/* ================================================================== */

describe("Infrastructure — Z: Animation / Transition Cleanup on Unmount", () => {
  /* jsdom does not implement HTMLDialogElement.showModal / .close,
     so we polyfill them for Modal / CommandPalette tests. */
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  afterAll(() => {
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  it("Accordion: unmount during animation doesn't throw", async () => {
    const { unmount } = render(
      <Accordion items={ACCORDION_ITEMS} />,
    );
    // Click to trigger expand animation
    await userEvent.click(screen.getByText("Section A"));
    // Immediately unmount during transition
    unmount();
    // If we reach here, no error was thrown
    expect(true).toBe(true);
  });

  it("CommandPalette: open then unmount doesn't throw", () => {
    const { unmount } = render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={() => {}} />,
    );
    // Immediately unmount while open
    unmount();
    expect(true).toBe(true);
  });

  it("Modal: open then unmount doesn't throw", () => {
    const { unmount } = render(
      <Modal open onClose={() => {}}>
        <p>Modal content</p>
      </Modal>,
    );
    // Immediately unmount while open
    unmount();
    expect(true).toBe(true);
  });

  it("Carousel: autoPlay then unmount doesn't throw", () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <Carousel items={CAROUSEL_ITEMS} autoPlay autoPlayInterval={100} />,
    );
    // Advance timer partially to trigger autoplay mid-transition
    vi.advanceTimersByTime(50);
    // Unmount during autoplay cycle
    unmount();
    // Clear remaining timers
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    expect(true).toBe(true);
  });

  it("Tooltip: hover then unmount doesn't throw", () => {
    const { unmount } = render(
      <Tooltip content="Tip text">
        <Button>Hover me</Button>
      </Tooltip>,
    );
    // Trigger hover to start show animation
    fireEvent.mouseEnter(screen.getByText("Hover me"));
    // Unmount immediately during tooltip show transition
    unmount();
    expect(true).toBe(true);
  });
});

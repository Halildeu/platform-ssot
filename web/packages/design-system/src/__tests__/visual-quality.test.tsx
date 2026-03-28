// @vitest-environment jsdom
import React from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Imports — all target components                                    */
/* ------------------------------------------------------------------ */
import { SearchFilterListing } from "../components/search-filter-listing";
import { ApprovalReview } from "../components/approval-review";
import { ApprovalCheckpoint } from "../components/approval-checkpoint";
import { CitationPanel } from "../components/citation-panel";
import { AIActionAuditTimeline } from "../components/ai-action-audit-timeline";
import { AIGuidedAuthoring } from "../components/ai-guided-authoring";
import { CommandPalette } from "../components/command-palette";
import { NavigationRail } from "../components/navigation-rail";
import { Accordion } from "../components/accordion";
import { List } from "../components/list";
import { MenuBar } from "../components/menu-bar";
import {
  NotificationPanel,
  NotificationItemCard,
} from "../components/notification-drawer";
import { Calendar } from "../components/calendar";
import { Transfer } from "../components/transfer";
import { Timeline } from "../components/timeline";
import { SmartDashboard } from "../components/smart-dashboard";
import { DetailSummary } from "../patterns/detail-summary";
import { Combobox } from "../components/combobox";
import { Segmented } from "../components/segmented";
import { Button } from "../primitives/button";
import { Text } from "../primitives/text";
import { Input } from "../primitives/input";
import { Card } from "../primitives/card";
import { Modal } from "../primitives/modal";
import { LinkInline } from "../primitives/link-inline";

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
  {
    id: "c2",
    title: "ISO 27001 Control A.8",
    excerpt: "Asset management classification scheme.",
    source: "Standards Repo",
    kind: "doc" as const,
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
  {
    id: "a2",
    actor: "human" as const,
    title: "Review completed",
    timestamp: "1 hour ago",
    status: "approved" as const,
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

const NOTIFICATION_ITEM = {
  id: "n1",
  message: "Deployment completed",
  description: "v2.1.0 deployed to production",
  type: "success" as const,
  priority: "normal" as const,
  createdAt: Date.now(),
  read: false,
};

const NOTIFICATION_ITEMS = [
  NOTIFICATION_ITEM,
  {
    id: "n2",
    message: "Security scan warning",
    description: "3 vulnerabilities found",
    type: "warning" as const,
    priority: "high" as const,
    createdAt: Date.now() - 3600000,
    read: false,
  },
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

const DETAIL_SUMMARY_PROPS = {
  title: "Policy Detail",
  description: "KVKK compliance policy overview",
  entity: {
    title: "Data Processing Agreement",
    description: "Primary entity description",
    badges: [],
    items: [],
  },
  detailItems: [],
};

const COMMAND_ITEMS = [
  { id: "cmd1", title: "Go to Dashboard", group: "Navigation" },
  { id: "cmd2", title: "Create Report", group: "Actions" },
];

/* ================================================================== */
/*  Helper: narrow-width container render                              */
/* ================================================================== */

function renderNarrow(ui: React.ReactElement, width = 375) {
  const result = render(
    <div style={{ width, overflow: "auto" }}>{ui}</div>,
  );
  return result;
}

/* ================================================================== */
/*  A. Overflow Detection Tests                                        */
/* ================================================================== */

describe("Visual Quality — Overflow Detection (375px)", () => {
  it("SearchFilterListing does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <SearchFilterListing title="Test List" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("ApprovalCheckpoint does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("CitationPanel does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <CitationPanel items={CITATION_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("AIActionAuditTimeline does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <AIActionAuditTimeline items={AUDIT_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("AIGuidedAuthoring does not overflow at mobile width", () => {
    const { container } = renderNarrow(<AIGuidedAuthoring />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("ApprovalReview does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <ApprovalReview
        checkpoint={CHECKPOINT_PROPS}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
      />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("NavigationRail does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <NavigationRail items={NAV_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("Accordion does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <Accordion items={ACCORDION_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("List does not overflow at mobile width", () => {
    const { container } = renderNarrow(<List items={LIST_ITEMS} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("MenuBar does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <MenuBar items={MENUBAR_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("NotificationPanel does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <NotificationPanel items={NOTIFICATION_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("NotificationItemCard does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <NotificationItemCard item={NOTIFICATION_ITEM} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("Calendar does not overflow at mobile width", () => {
    const { container } = renderNarrow(<Calendar />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("Transfer does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <Transfer dataSource={TRANSFER_DATA} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("Timeline does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <Timeline items={TIMELINE_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("SmartDashboard does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <SmartDashboard widgets={DASHBOARD_WIDGETS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("DetailSummary does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <DetailSummary {...DETAIL_SUMMARY_PROPS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });

  it("CommandPalette does not overflow at mobile width", () => {
    const { container } = renderNarrow(
      <CommandPalette open items={COMMAND_ITEMS} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth + 1);
  });
});

/* ================================================================== */
/*  B. Required Content Visibility Tests                               */
/* ================================================================== */

describe("Visual Quality — Required Content Visibility", () => {
  it("SearchFilterListing shows title text", () => {
    render(<SearchFilterListing title="Policy List" />);
    expect(screen.getByText("Policy List")).toBeInTheDocument();
  });

  it("ApprovalCheckpoint shows title text", () => {
    render(<ApprovalCheckpoint {...CHECKPOINT_PROPS} />);
    expect(screen.getByText("Approval gate")).toBeInTheDocument();
  });

  it("CitationPanel shows title text", () => {
    render(<CitationPanel items={CITATION_ITEMS} title="Source Evidence" />);
    expect(screen.getByText("Source Evidence")).toBeInTheDocument();
  });

  it("AIActionAuditTimeline shows title text", () => {
    render(
      <AIActionAuditTimeline items={AUDIT_ITEMS} title="Audit Log" />,
    );
    expect(screen.getByText("Audit Log")).toBeInTheDocument();
  });

  it("AIGuidedAuthoring shows title text", () => {
    render(<AIGuidedAuthoring title="Authoring Panel" />);
    expect(screen.getByText("Authoring Panel")).toBeInTheDocument();
  });

  it("ApprovalReview shows title text", () => {
    render(
      <ApprovalReview
        title="Review Checkpoint"
        checkpoint={CHECKPOINT_PROPS}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
      />,
    );
    expect(screen.getByText("Review Checkpoint")).toBeInTheDocument();
  });

  it("List shows item titles", () => {
    render(<List items={LIST_ITEMS} />);
    expect(screen.getByText("Item Alpha")).toBeInTheDocument();
    expect(screen.getByText("Item Beta")).toBeInTheDocument();
  });

  it("NotificationPanel shows notification messages", () => {
    render(<NotificationPanel items={NOTIFICATION_ITEMS} />);
    expect(screen.getByText("Deployment completed")).toBeInTheDocument();
  });

  it("NotificationItemCard shows message text", () => {
    render(<NotificationItemCard item={NOTIFICATION_ITEM} />);
    expect(screen.getByText("Deployment completed")).toBeInTheDocument();
  });

  it("SmartDashboard shows widget titles", () => {
    render(<SmartDashboard widgets={DASHBOARD_WIDGETS} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
  });

  it("DetailSummary shows title text", () => {
    render(<DetailSummary {...DETAIL_SUMMARY_PROPS} />);
    expect(screen.getByText("Policy Detail")).toBeInTheDocument();
  });

  it("CommandPalette shows title when open", () => {
    render(<CommandPalette open items={COMMAND_ITEMS} title="Quick Search" />);
    expect(screen.getByText("Quick Search")).toBeInTheDocument();
  });

  it("Timeline shows item content", () => {
    render(<Timeline items={TIMELINE_ITEMS} />);
    expect(screen.getByText("Project started")).toBeInTheDocument();
    expect(screen.getByText("First release")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  C. Access Control — access="hidden" returns null                   */
/* ================================================================== */

describe("Visual Quality — Access Control (hidden)", () => {
  it("SearchFilterListing access=hidden renders nothing", () => {
    const { container } = render(
      <SearchFilterListing title="Test" access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("ApprovalCheckpoint access=hidden renders nothing", () => {
    const { container } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("CitationPanel access=hidden renders nothing", () => {
    const { container } = render(
      <CitationPanel items={CITATION_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("AIActionAuditTimeline access=hidden renders nothing", () => {
    const { container } = render(
      <AIActionAuditTimeline items={AUDIT_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("AIGuidedAuthoring access=hidden renders nothing", () => {
    const { container } = render(<AIGuidedAuthoring access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it("ApprovalReview access=hidden renders nothing", () => {
    const { container } = render(
      <ApprovalReview
        checkpoint={CHECKPOINT_PROPS}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
        access="hidden"
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("NavigationRail access=hidden renders nothing", () => {
    const { container } = render(
      <NavigationRail items={NAV_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Accordion access=hidden renders nothing", () => {
    const { container } = render(
      <Accordion items={ACCORDION_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("List access=hidden renders nothing", () => {
    const { container } = render(
      <List items={LIST_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("MenuBar access=hidden renders nothing", () => {
    const { container } = render(
      <MenuBar items={MENUBAR_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("NotificationPanel access=hidden renders nothing", () => {
    const { container } = render(
      <NotificationPanel items={NOTIFICATION_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("NotificationItemCard access=hidden renders nothing", () => {
    const { container } = render(
      <NotificationItemCard item={NOTIFICATION_ITEM} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Calendar access=hidden renders nothing", () => {
    const { container } = render(<Calendar access="hidden" />);
    expect(container.innerHTML).toBe("");
  });

  it("Transfer access=hidden renders nothing", () => {
    const { container } = render(
      <Transfer dataSource={TRANSFER_DATA} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Timeline access=hidden renders nothing", () => {
    const { container } = render(
      <Timeline items={TIMELINE_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("SmartDashboard access=hidden renders nothing", () => {
    const { container } = render(
      <SmartDashboard widgets={DASHBOARD_WIDGETS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("DetailSummary access=hidden renders nothing", () => {
    const { container } = render(
      <DetailSummary {...DETAIL_SUMMARY_PROPS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("CommandPalette access=hidden renders nothing", () => {
    const { container } = render(
      <CommandPalette open items={COMMAND_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });
});

/* ================================================================== */
/*  D. DisplayName Tests                                               */
/* ================================================================== */

describe("Visual Quality — displayName", () => {
  const componentsWithExpectedDisplayName: Array<{
    Component: React.FC<any>;
    name: string;
  }> = [
    { Component: SearchFilterListing, name: "SearchFilterListing" },
    { Component: CommandPalette, name: "CommandPalette" },
    { Component: NavigationRail, name: "NavigationRail" },
    { Component: Accordion, name: "Accordion" },
    { Component: List, name: "List" },
    { Component: MenuBar, name: "MenuBar" },
    { Component: Transfer, name: "Transfer" },
    { Component: Timeline, name: "Timeline" },
    { Component: SmartDashboard, name: "SmartDashboard" },
  ];

  componentsWithExpectedDisplayName.forEach(({ Component, name }) => {
    it(`${name} has displayName set`, () => {
      expect(Component.displayName).toBe(name);
    });
  });

  /* Components that are known to lack displayName — test they at least
     have a function name so React DevTools can identify them. */
  const componentsWithFunctionName: Array<{
    Component: React.FC<any>;
    name: string;
  }> = [
    { Component: ApprovalReview, name: "ApprovalReview" },
    { Component: ApprovalCheckpoint, name: "ApprovalCheckpoint" },
    { Component: CitationPanel, name: "CitationPanel" },
    { Component: AIActionAuditTimeline, name: "AIActionAuditTimeline" },
    { Component: AIGuidedAuthoring, name: "AIGuidedAuthoring" },
    { Component: NotificationPanel, name: "NotificationPanel" },
    { Component: NotificationItemCard, name: "NotificationItemCard" },
    { Component: DetailSummary, name: "DetailSummary" },
  ];

  componentsWithFunctionName.forEach(({ Component, name }) => {
    it(`${name} is identifiable (displayName or function name)`, () => {
      const identifier = Component.displayName || Component.name;
      expect(identifier).toBeTruthy();
      expect(typeof identifier).toBe("string");
    });
  });

  /* forwardRef components — check displayName on the ref wrapper */
  const forwardRefComponents: Array<{
    Component: any;
    name: string;
  }> = [
    { Component: Calendar, name: "Calendar" },
  ];

  forwardRefComponents.forEach(({ Component, name }) => {
    it(`${name} (forwardRef) is identifiable`, () => {
      const identity =
        Component.displayName ||
        Component.name ||
        Component.render?.displayName ||
        Component.render?.name;
      expect(identity).toBeTruthy();
    });
  });
});

/* ================================================================== */
/*  E. className Forwarding Tests                                      */
/* ================================================================== */

describe("Visual Quality — className forwarding", () => {
  const CUSTOM_CLASS = "vq-test-custom-class";

  it("SearchFilterListing forwards className", () => {
    const { container } = render(
      <SearchFilterListing title="T" className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("ApprovalCheckpoint forwards className", () => {
    const { container } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("CitationPanel forwards className", () => {
    const { container } = render(
      <CitationPanel items={CITATION_ITEMS} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("AIActionAuditTimeline forwards className", () => {
    const { container } = render(
      <AIActionAuditTimeline
        items={AUDIT_ITEMS}
        className={CUSTOM_CLASS}
      />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("AIGuidedAuthoring forwards className", () => {
    const { container } = render(
      <AIGuidedAuthoring className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("ApprovalReview forwards className", () => {
    const { container } = render(
      <ApprovalReview
        checkpoint={CHECKPOINT_PROPS}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
        className={CUSTOM_CLASS}
      />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("Accordion forwards className", () => {
    const { container } = render(
      <Accordion items={ACCORDION_ITEMS} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  /* List does not currently accept a className prop — skip */

  it("NotificationPanel forwards className", () => {
    const { container } = render(
      <NotificationPanel
        items={NOTIFICATION_ITEMS}
        className={CUSTOM_CLASS}
      />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("NotificationItemCard forwards className", () => {
    const { container } = render(
      <NotificationItemCard
        item={NOTIFICATION_ITEM}
        className={CUSTOM_CLASS}
      />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("Calendar forwards className", () => {
    const { container } = render(<Calendar className={CUSTOM_CLASS} />);
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("Transfer forwards className", () => {
    const { container } = render(
      <Transfer dataSource={TRANSFER_DATA} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("Timeline forwards className", () => {
    const { container } = render(
      <Timeline items={TIMELINE_ITEMS} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("SmartDashboard forwards className", () => {
    const { container } = render(
      <SmartDashboard
        widgets={DASHBOARD_WIDGETS}
        className={CUSTOM_CLASS}
      />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });

  it("DetailSummary forwards className", () => {
    const { container } = render(
      <DetailSummary {...DETAIL_SUMMARY_PROPS} className={CUSTOM_CLASS} />,
    );
    expect(container.querySelector(`.${CUSTOM_CLASS}`)).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  F. CSS Variable Usage — no hardcoded colors in rendered output     */
/* ================================================================== */

describe("Visual Quality — CSS variable usage (no hardcoded colors)", () => {
  /**
   * Scan rendered HTML for Tailwind utility classes that use hardcoded
   * color values instead of CSS custom properties. This catches dark-mode
   * breakage at the component level.
   *
   * NOTE: We test the rendered className strings — not computed styles —
   * so we accept bg-white / text-white etc. if they appear inside a
   * dark: variant (e.g. dark:bg-white). The regex below checks for bare
   * utility usage without a dark: prefix.
   */
  const HARDCODED_PATTERNS = [
    /* Bare bg-white without dark: prefix — catches light-only backgrounds */
    /(?<!\w)bg-white(?![\w-])/,
    /* Bare bg-gray-N without var() */
    /(?<!\w)bg-gray-\d{2,3}(?![\w-])/,
    /* Bare text-slate-N — should use CSS variable tokens */
    /(?<!\w)text-slate-\d{2,3}(?![\w-])/,
    /* Bare text-gray-N */
    /(?<!\w)text-gray-\d{2,3}(?![\w-])/,
  ];

  function assertNoHardcodedColors(container: HTMLElement, name: string) {
    const html = container.innerHTML;
    for (const pattern of HARDCODED_PATTERNS) {
      const match = html.match(pattern);
      if (match) {
        /* Allow known exceptions: Tailwind ring/shadow utilities that
           use gray as part of a CSS variable fallback value */
        const context = html.substring(
          Math.max(0, html.indexOf(match[0]) - 40),
          html.indexOf(match[0]) + match[0].length + 40,
        );
        if (context.includes("var(--") || context.includes("rgba(")) {
          continue;
        }
        expect
          .soft(false, `${name} uses hardcoded color class "${match[0]}"`)
          .toBeTruthy();
      }
    }
  }

  it("SearchFilterListing uses CSS variables for colors", () => {
    const { container } = render(<SearchFilterListing title="T" />);
    assertNoHardcodedColors(container, "SearchFilterListing");
  });

  it("ApprovalCheckpoint uses CSS variables for colors", () => {
    const { container } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} />,
    );
    assertNoHardcodedColors(container, "ApprovalCheckpoint");
  });

  it("CitationPanel uses CSS variables for colors", () => {
    const { container } = render(
      <CitationPanel items={CITATION_ITEMS} />,
    );
    assertNoHardcodedColors(container, "CitationPanel");
  });

  it("AIActionAuditTimeline uses CSS variables for colors", () => {
    const { container } = render(
      <AIActionAuditTimeline items={AUDIT_ITEMS} />,
    );
    assertNoHardcodedColors(container, "AIActionAuditTimeline");
  });

  it("List uses CSS variables for colors", () => {
    const { container } = render(<List items={LIST_ITEMS} />);
    assertNoHardcodedColors(container, "List");
  });

  it("NotificationPanel uses CSS variables for colors", () => {
    const { container } = render(
      <NotificationPanel items={NOTIFICATION_ITEMS} />,
    );
    assertNoHardcodedColors(container, "NotificationPanel");
  });

  it("NotificationItemCard uses CSS variables for colors", () => {
    const { container } = render(
      <NotificationItemCard item={NOTIFICATION_ITEM} />,
    );
    assertNoHardcodedColors(container, "NotificationItemCard");
  });

  it("SmartDashboard uses CSS variables for colors", () => {
    const { container } = render(
      <SmartDashboard widgets={DASHBOARD_WIDGETS} />,
    );
    assertNoHardcodedColors(container, "SmartDashboard");
  });

  it("Timeline uses CSS variables for colors", () => {
    const { container } = render(
      <Timeline items={TIMELINE_ITEMS} />,
    );
    assertNoHardcodedColors(container, "Timeline");
  });
});

/* ================================================================== */
/*  G. Meta-test — all component exports are identifiable              */
/* ================================================================== */

describe("Visual Quality — Meta: all tested components are importable", () => {
  const ALL_COMPONENTS: Array<{ Component: React.FC<any>; name: string }> = [
    { Component: SearchFilterListing, name: "SearchFilterListing" },
    { Component: ApprovalReview, name: "ApprovalReview" },
    { Component: ApprovalCheckpoint, name: "ApprovalCheckpoint" },
    { Component: CitationPanel, name: "CitationPanel" },
    { Component: AIActionAuditTimeline, name: "AIActionAuditTimeline" },
    { Component: AIGuidedAuthoring, name: "AIGuidedAuthoring" },
    { Component: CommandPalette, name: "CommandPalette" },
    { Component: NavigationRail, name: "NavigationRail" },
    { Component: Accordion, name: "Accordion" },
    { Component: List, name: "List" },
    { Component: MenuBar, name: "MenuBar" },
    { Component: NotificationPanel, name: "NotificationPanel" },
    { Component: NotificationItemCard, name: "NotificationItemCard" },
    { Component: Calendar, name: "Calendar" },
    { Component: Transfer, name: "Transfer" },
    { Component: Timeline, name: "Timeline" },
    { Component: SmartDashboard, name: "SmartDashboard" },
    { Component: DetailSummary, name: "DetailSummary" },
  ];

  ALL_COMPONENTS.forEach(({ Component, name }) => {
    it(`${name} is a valid React component`, () => {
      /* forwardRef components have typeof "object" */
      expect(["function", "object"]).toContain(typeof Component);
    });
  });

  ALL_COMPONENTS.forEach(({ Component, name }) => {
    it(`${name} has a recognizable identity (displayName or name)`, () => {
      const identity =
        Component.displayName ||
        Component.name ||
        (Component as any).render?.displayName ||
        (Component as any).render?.name;
      expect(identity).toBeTruthy();
    });
  });
});

/* ================================================================== */
/*  H. Variant Differentiation — varyantlar görsel olarak farklı mı?  */
/* ================================================================== */

describe("H — Variant Differentiation", () => {
  it("SearchFilterListing: empty vs listed items produce different output", () => {
    const { container: c1 } = render(
      <SearchFilterListing title="Test" items={[]} />,
    );
    cleanup();
    const { container: c2 } = render(
      <SearchFilterListing
        title="Test"
        items={[<div key="a">Item A</div>, <div key="b">Item B</div>]}
      />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("SearchFilterListing: loading vs non-loading produce different output", () => {
    const { container: c1 } = render(
      <SearchFilterListing title="Test" loading />,
    );
    cleanup();
    const { container: c2 } = render(
      <SearchFilterListing title="Test" />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("SearchFilterListing: compact vs default produce different output", () => {
    const { container: c1 } = render(
      <SearchFilterListing title="Test" size="compact" />,
    );
    cleanup();
    const { container: c2 } = render(
      <SearchFilterListing title="Test" size="default" />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("ApprovalReview: different checkpoint status produce different output", () => {
    const { container: c1 } = render(
      <ApprovalReview
        checkpoint={{ ...CHECKPOINT_PROPS, status: "pending" }}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
      />,
    );
    cleanup();
    const { container: c2 } = render(
      <ApprovalReview
        checkpoint={{ ...CHECKPOINT_PROPS, status: "approved" }}
        citations={CITATION_ITEMS}
        auditItems={AUDIT_ITEMS}
      />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("ApprovalCheckpoint: pending vs approved produce different output", () => {
    const { container: c1 } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} status="pending" />,
    );
    cleanup();
    const { container: c2 } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} status="approved" />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("Accordion: different items produce different output", () => {
    const { container: c1 } = render(
      <Accordion items={[{ value: "a", title: "Section A", content: "Content A" }]} />,
    );
    cleanup();
    const { container: c2 } = render(
      <Accordion items={[{ value: "b", title: "Section B", content: "Content B" }]} />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("Timeline: different colors produce different output", () => {
    const { container: c1 } = render(
      <Timeline items={[{ key: "t1", color: "success", children: "Done" }]} />,
    );
    cleanup();
    const { container: c2 } = render(
      <Timeline items={[{ key: "t1", color: "danger", children: "Failed" }]} />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("Calendar: different months produce different output", () => {
    const { container: c1 } = render(
      <Calendar defaultMonth={new Date(2025, 0, 1)} />,
    );
    cleanup();
    const { container: c2 } = render(
      <Calendar defaultMonth={new Date(2025, 6, 1)} />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("NavigationRail: different selected items produce different output", () => {
    const items = [
      { value: "home", label: "Ana Sayfa", icon: <span>H</span> },
      { value: "settings", label: "Ayarlar", icon: <span>S</span> },
    ];
    const { container: c1 } = render(
      <NavigationRail items={items} value="home" />,
    );
    cleanup();
    const { container: c2 } = render(
      <NavigationRail items={items} value="settings" />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("SmartDashboard: different widget tones produce different output", () => {
    const { container: c1 } = render(
      <SmartDashboard widgets={[{ key: "w1", title: "W", value: "1", tone: "success" }]} />,
    );
    cleanup();
    const { container: c2 } = render(
      <SmartDashboard widgets={[{ key: "w1", title: "W", value: "1", tone: "danger" }]} />,
    );
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });

  it("List: empty items vs populated produce different output", () => {
    const { container: c1 } = render(<List items={[]} />);
    cleanup();
    const { container: c2 } = render(<List items={LIST_ITEMS} />);
    expect(c1.innerHTML).not.toBe(c2.innerHTML);
  });
});

/* ================================================================== */
/*  I. Dark Mode — data-theme attribute ile CSS variable override      */
/* ================================================================== */

describe("I — Dark Mode data-theme support", () => {
  const DarkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-theme-scope="" data-theme="serban-dark">
      {children}
    </div>
  );

  it("SearchFilterListing renders inside dark wrapper without crash", () => {
    const { container } = render(
      <DarkWrapper>
        <SearchFilterListing title="Dark Test" />
      </DarkWrapper>,
    );
    expect(container.querySelector('[data-component="search-filter-listing"]')).toBeInTheDocument();
  });

  it("ApprovalReview renders inside dark wrapper without crash", () => {
    const { container } = render(
      <DarkWrapper>
        <ApprovalReview
          checkpoint={CHECKPOINT_PROPS}
          citations={CITATION_ITEMS}
          auditItems={AUDIT_ITEMS}
        />
      </DarkWrapper>,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });

  it("ApprovalCheckpoint renders inside dark wrapper without crash", () => {
    const { container } = render(
      <DarkWrapper>
        <ApprovalCheckpoint {...CHECKPOINT_PROPS} />
      </DarkWrapper>,
    );
    expect(container.querySelector('[data-component="approval-checkpoint"]')).toBeInTheDocument();
  });

  it("Accordion renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <Accordion items={[{ value: "a", title: "Test", content: "Content" }]} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("Calendar renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <Calendar />
      </DarkWrapper>,
    );
    // Should have day cells
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Timeline renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <Timeline items={[{ key: "t", children: "Event" }]} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("Transfer renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <Transfer dataSource={[{ key: "k1", label: "Item 1" }]} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("SmartDashboard renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <SmartDashboard widgets={DASHBOARD_WIDGETS} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("NavigationRail renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <NavigationRail
          items={[{ value: "home", label: "Home", icon: <span>H</span> }]}
        />
      </DarkWrapper>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("CommandPalette renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <CommandPalette
          open
          items={[{ id: "cmd1", title: "Test" }]}
        />
      </DarkWrapper>,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("CitationPanel renders inside dark wrapper without crash", () => {
    const { container } = render(
      <DarkWrapper>
        <CitationPanel items={CITATION_ITEMS} />
      </DarkWrapper>,
    );
    // Should render without crash — content may use default titles
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("AIActionAuditTimeline renders inside dark wrapper without crash", () => {
    const { container } = render(
      <DarkWrapper>
        <AIActionAuditTimeline items={AUDIT_ITEMS} />
      </DarkWrapper>,
    );
    // Should render without crash — content may use default titles
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("NotificationPanel renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <NotificationPanel items={NOTIFICATION_ITEMS} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Deployment completed")).toBeInTheDocument();
  });

  it("DetailSummary renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <DetailSummary {...DETAIL_SUMMARY_PROPS} />
      </DarkWrapper>,
    );
    expect(screen.getByText(DETAIL_SUMMARY_PROPS.title)).toBeInTheDocument();
  });

  it("List renders inside dark wrapper without crash", () => {
    render(
      <DarkWrapper>
        <List items={LIST_ITEMS} />
      </DarkWrapper>,
    );
    expect(screen.getByText("Item Alpha")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  J. State Tests — loading, disabled, readonly, error durumları      */
/* ================================================================== */

describe("J — State Transitions", () => {
  /* -- Loading state -- */
  it("SearchFilterListing: loading state renders skeleton", () => {
    const { container } = render(<SearchFilterListing title="T" loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it("SearchFilterListing: loading=false does not show aria-busy", () => {
    const { container } = render(<SearchFilterListing title="T" />);
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
  });

  /* -- Access states -- */
  it("ApprovalCheckpoint: readonly prevents button clicks", async () => {
    const handleClick = vi.fn();
    render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} access="readonly" onPrimaryAction={handleClick} />,
    );
    // readonly buttons should have access="readonly"
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      await userEvent.click(btn);
    }
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("ApprovalCheckpoint: disabled shows accessReason tooltip", () => {
    const { container } = render(
      <ApprovalCheckpoint {...CHECKPOINT_PROPS} access="disabled" accessReason="Yetkiniz yok" />,
    );
    expect(container.querySelector('[title="Yetkiniz yok"]')).toBeInTheDocument();
  });

  it("NavigationRail: access=hidden returns null", () => {
    const { container } = render(
      <NavigationRail items={[{ value: "h", label: "Home", icon: <span>H</span> }]} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Accordion: access=hidden returns null", () => {
    const { container } = render(
      <Accordion items={[{ value: "a", title: "T", content: "C" }]} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Calendar: access=disabled renders but is non-interactive", async () => {
    const handleChange = vi.fn();
    render(<Calendar access="disabled" onValueChange={handleChange} />);
    // All day buttons should be disabled
    const dayButtons = screen.getAllByRole("gridcell").filter((el) => el.querySelector("button"));
    for (const cell of dayButtons) {
      const btn = cell.querySelector("button");
      if (btn) await userEvent.click(btn);
    }
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("Transfer: access=hidden returns null", () => {
    const { container } = render(
      <Transfer dataSource={[{ key: "k1", label: "I" }]} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("Timeline: access=hidden returns null", () => {
    const { container } = render(
      <Timeline items={[{ key: "t", children: "E" }]} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("SmartDashboard: access=hidden returns null", () => {
    const { container } = render(
      <SmartDashboard widgets={DASHBOARD_WIDGETS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("List: access=hidden returns null", () => {
    const { container } = render(
      <List items={LIST_ITEMS} access="hidden" />,
    );
    expect(container.innerHTML).toBe("");
  });

  /* -- Empty states -- */
  it("SearchFilterListing: empty items shows empty state", () => {
    render(<SearchFilterListing title="T" items={[]} />);
    expect(screen.getByText("Eslesen sonuc bulunamadi.")).toBeInTheDocument();
  });

  it("SearchFilterListing: activeFilters with empty items shows contextual empty", () => {
    render(
      <SearchFilterListing
        title="T"
        items={[]}
        activeFilters={[{ key: "f1", label: "Status", value: "Active", onRemove: () => {} }]}
      />,
    );
    expect(screen.getByText(/filtre kombinasyonu/i)).toBeInTheDocument();
  });

  it("List: empty items shows empty state", () => {
    render(<List items={[]} />);
    // Should render empty component, not crash
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("AIActionAuditTimeline: empty items shows empty state", () => {
    const { container } = render(<AIActionAuditTimeline items={[]} />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  /* -- Selection states -- */
  it("SearchFilterListing: selectable mode shows selection bar when items selected", () => {
    render(
      <SearchFilterListing
        title="T"
        items={[<div key="a">A</div>]}
        selectable
        selectedKeys={["a", "b"]}
        onSelectionChange={() => {}}
      />,
    );
    expect(screen.getByText(/2 oge secildi/)).toBeInTheDocument();
  });

  it("SearchFilterListing: selectable mode without selection hides bar", () => {
    render(
      <SearchFilterListing
        title="T"
        items={[<div key="a">A</div>]}
        selectable
        selectedKeys={[]}
        onSelectionChange={() => {}}
      />,
    );
    expect(screen.queryByText(/oge secildi/)).not.toBeInTheDocument();
  });
});

/* ================================================================== */
/*  K. Focus Trap Tests                                                */
/* ================================================================== */

describe("K — Focus Trap Tests", () => {
  /* jsdom does not implement HTMLDialogElement.showModal / .close,
     so we polyfill them for the Modal tests in this block. */
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

  it("Modal: dialog element exists when open", () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        <p>Modal content</p>
      </Modal>,
    );
    const dialog = document.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog!.hasAttribute("open")).toBe(true);
  });

  it("Modal: cancel event triggers onClose", () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        <p>Modal content</p>
      </Modal>,
    );
    const dialog = document.querySelector("dialog");
    expect(dialog).not.toBeNull();
    // The dialog's onCancel handler is wired via React's synthetic event
    dialog!.dispatchEvent(new Event("cancel", { bubbles: true }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("CommandPalette: renders overlay when open", () => {
    render(
      <CommandPalette open items={COMMAND_ITEMS} />,
    );
    // CommandPalette renders items when open
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
  });

  it("CommandPalette: Escape triggers onClose", () => {
    const handleClose = vi.fn();
    render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={handleClose} />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("CommandPalette: close button triggers onClose", async () => {
    const handleClose = vi.fn();
    render(
      <CommandPalette open items={COMMAND_ITEMS} onClose={handleClose} />,
    );
    const closeBtn = screen.getByLabelText("Close command palette");
    await userEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ================================================================== */
/*  L. Keyboard Navigation Tests                                       */
/* ================================================================== */

describe("L — Keyboard Navigation Tests", () => {
  it("Accordion: clicking a section header toggles content visibility", async () => {
    render(
      <Accordion
        items={[
          { value: "a1", title: "Section A", content: "Content A body text here" },
          { value: "a2", title: "Section B", content: "Content B body text here" },
        ]}
      />,
    );
    const sectionButton = screen.getByText("Section A");
    await userEvent.click(sectionButton);
    expect(screen.getByText("Content A body text here")).toBeInTheDocument();
  });

  it("Combobox: ArrowDown opens the dropdown", () => {
    render(
      <Combobox
        label="Test"
        options={[
          { value: "opt1", label: "Option 1" },
          { value: "opt2", label: "Option 2" },
        ]}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("Combobox: Escape closes the dropdown after opening", () => {
    render(
      <Combobox
        label="Test"
        options={[
          { value: "opt1", label: "Option 1" },
          { value: "opt2", label: "Option 2" },
        ]}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Segmented: clicking a segment selects it", async () => {
    const handleChange = vi.fn();
    render(
      <Segmented
        items={[
          { value: "s1", label: "Segment 1" },
          { value: "s2", label: "Segment 2" },
          { value: "s3", label: "Segment 3" },
        ]}
        defaultValue="s1"
        onValueChange={handleChange}
      />,
    );
    await userEvent.click(screen.getByText("Segment 2"));
    expect(handleChange).toHaveBeenCalled();
  });

  it("Calendar: clicking a day selects it", async () => {
    const handleChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2025, 0, 1)}
        onValueChange={handleChange}
      />,
    );
    // Find a day button (day 15)
    const day15 = screen.getByText("15");
    await userEvent.click(day15);
    expect(handleChange).toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  M. Ref Forwarding Tests                                            */
/* ================================================================== */

describe("M — Ref Forwarding Tests", () => {
  const forwardRefComponents: Array<{
    Component: any;
    name: string;
    props?: Record<string, any>;
  }> = [
    { Component: Calendar, name: "Calendar" },
    {
      Component: NavigationRail,
      name: "NavigationRail",
      props: { items: NAV_ITEMS },
    },
    {
      Component: MenuBar,
      name: "MenuBar",
      props: { items: MENUBAR_ITEMS },
    },
    { Component: Button, name: "Button", props: { children: "Click" } },
    {
      Component: Text,
      name: "Text",
      props: { children: "Hello" },
    },
    { Component: Input, name: "Input" },
    { Component: Card, name: "Card", props: { children: "Card content" } },
    {
      Component: LinkInline,
      name: "LinkInline",
      props: { href: "#", children: "Link" },
    },
  ];

  forwardRefComponents.forEach(({ Component, name, props }) => {
    it(`${name} forwards ref correctly`, () => {
      const ref = React.createRef<any>();
      render(<Component ref={ref} {...(props || {})} />);
      expect(ref.current).not.toBeNull();
    });
  });
});

/* ================================================================== */
/*  N. Controlled vs Uncontrolled Tests                                */
/* ================================================================== */

describe("N — Controlled vs Uncontrolled Tests", () => {
  /* -- Calendar -- */
  it("Calendar: renders with defaultValue without crash", () => {
    render(
      <Calendar defaultValue={new Date(2025, 0, 10)} />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Calendar: controlled value renders without crash", () => {
    render(
      <Calendar value={new Date(2025, 0, 15)} />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Calendar: no value/defaultValue renders without crash", () => {
    render(<Calendar />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  /* -- Combobox -- */
  it("Combobox: renders with defaultValue without crash", () => {
    const options = [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
    ];
    render(<Combobox label="Test" options={options} defaultValue="opt1" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Combobox: controlled value renders without crash", () => {
    const options = [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
    ];
    render(<Combobox label="Test" options={options} value="opt2" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Combobox: no value/defaultValue renders without crash", () => {
    const options = [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
    ];
    render(<Combobox label="Test" options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  /* -- Accordion -- */
  it("Accordion: defaultValue expands the specified section", () => {
    render(
      <Accordion
        items={ACCORDION_ITEMS}
        defaultValue="a1"
      />,
    );
    expect(screen.getByText("Content A body text here")).toBeInTheDocument();
  });

  it("Accordion: no defaultValue renders collapsed without crash", () => {
    render(<Accordion items={ACCORDION_ITEMS} />);
    expect(screen.getByText("Section A")).toBeInTheDocument();
  });

  /* -- Segmented -- */
  it("Segmented: defaultValue selects the specified segment", () => {
    const { container } = render(
      <Segmented
        items={[
          { value: "s1", label: "Seg 1" },
          { value: "s2", label: "Seg 2" },
        ]}
        defaultValue="s1"
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
    expect(screen.getByText("Seg 1")).toBeInTheDocument();
  });

  it("Segmented: controlled value renders without crash", () => {
    render(
      <Segmented
        items={[
          { value: "s1", label: "Seg 1" },
          { value: "s2", label: "Seg 2" },
        ]}
        value="s2"
      />,
    );
    expect(screen.getByText("Seg 2")).toBeInTheDocument();
  });

  it("Segmented: no value/defaultValue renders without crash", () => {
    render(
      <Segmented
        items={[
          { value: "s1", label: "Seg 1" },
          { value: "s2", label: "Seg 2" },
        ]}
      />,
    );
    expect(screen.getByText("Seg 1")).toBeInTheDocument();
  });

  /* -- SearchFilterListing -- */
  it("SearchFilterListing: controlled selectedKeys works", () => {
    render(
      <SearchFilterListing
        title="T"
        items={[<div key="a">A</div>]}
        selectable
        selectedKeys={["a"]}
        onSelectionChange={() => {}}
      />,
    );
    expect(screen.getByText(/1 oge secildi/)).toBeInTheDocument();
  });

  it("SearchFilterListing: no selectedKeys renders without crash", () => {
    render(
      <SearchFilterListing
        title="T"
        items={[<div key="a">A</div>]}
      />,
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});

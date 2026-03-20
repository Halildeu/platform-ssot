// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Imports — all target components                                    */
/* ------------------------------------------------------------------ */
import { SearchFilterListing } from "../components/search-filter-listing";
import { ApprovalReview } from "../components/approval-review";
import { ApprovalCheckpoint } from "../components/approval-checkpoint";
import { CitationPanel } from "../components/citation-panel";
import { AIActionAuditTimeline } from "../components/ai-action-audit-timeline";
import { CommandPalette } from "../components/command-palette";
import { NavigationRail } from "../components/navigation-rail";
import { Accordion } from "../components/accordion";
import { List } from "../components/list";
import { Calendar } from "../components/calendar";
import { Transfer } from "../components/transfer";
import { Timeline } from "../components/timeline";
import { SmartDashboard } from "../components/smart-dashboard";
import { Breadcrumb } from "../components/breadcrumb";
import { Tabs } from "../components/tabs";
import { FormField } from "../components/form-field";
import { DatePicker } from "../components/date-picker";
import { Upload } from "../components/upload";
import { ColorPicker } from "../components/color-picker";
import { TreeTable } from "../components/tree-table";

import { Button } from "../primitives/button";
import { Badge } from "../primitives/badge";
import { Tag } from "../primitives/tag";
import { Input } from "../primitives/input";
import { Modal } from "../primitives/modal";
import { Drawer } from "../primitives/drawer";

beforeEach(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
  }
});

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  Shared long-content fixtures                                       */
/* ================================================================== */

const LONG_TEXT = "A".repeat(500);
const LONG_TITLE = "Cok Uzun Baslik ".repeat(20);

/* ================================================================== */
/*  S. Long Content Resilience Tests                                   */
/* ================================================================== */

describe("Edge Cases — S. Long Content Resilience", () => {
  it("SearchFilterListing handles long title", () => {
    const { container } = render(<SearchFilterListing title={LONG_TITLE} />);
    expect(container.querySelector('[data-component="search-filter-listing"]')).toBeInTheDocument();
  });

  it("SearchFilterListing handles long description", () => {
    const { container } = render(
      <SearchFilterListing title="T" description={LONG_TEXT} />,
    );
    expect(container.querySelector('[data-component="search-filter-listing"]')).toBeInTheDocument();
  });

  it("SearchFilterListing handles long emptyStateLabel", () => {
    const { container } = render(
      <SearchFilterListing title="T" emptyStateLabel={LONG_TEXT} />,
    );
    expect(container.querySelector('[data-component="search-filter-listing"]')).toBeInTheDocument();
  });

  it("ApprovalCheckpoint handles long title", () => {
    render(
      <ApprovalCheckpoint
        title={LONG_TITLE}
        summary="Short summary"
        status="pending"
        steps={[]}
      />,
    );
    expect(screen.getByText(/Cok Uzun Baslik/)).toBeInTheDocument();
  });

  it("ApprovalCheckpoint handles long summary", () => {
    render(
      <ApprovalCheckpoint
        title="T"
        summary={LONG_TEXT}
        status="pending"
        steps={[]}
      />,
    );
    expect(screen.getByText(/AAAA/)).toBeInTheDocument();
  });

  it("CitationPanel handles long item title and excerpt", () => {
    const { container } = render(
      <CitationPanel
        items={[
          {
            id: "c1",
            title: LONG_TITLE,
            excerpt: LONG_TEXT,
            source: "DB",
            kind: "policy" as const,
          },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("AIActionAuditTimeline handles long item title and summary", () => {
    const { container } = render(
      <AIActionAuditTimeline
        items={[
          {
            id: "a1",
            actor: "ai" as const,
            title: LONG_TITLE,
            timestamp: "now",
            status: "drafted" as const,
            summary: LONG_TEXT,
          },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Accordion handles long item title and content", () => {
    render(
      <Accordion
        items={[
          { value: "a1", title: LONG_TITLE, content: LONG_TEXT },
        ]}
      />,
    );
    expect(screen.getByText(/Cok Uzun Baslik/)).toBeInTheDocument();
  });

  it("Timeline handles long children text", () => {
    const { container } = render(
      <Timeline
        items={[
          { key: "tl1", children: LONG_TEXT, color: "primary" as const },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Calendar handles long event labels", () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2025, 0)}
        events={[{ date: new Date(2025, 0, 15), label: LONG_TITLE }]}
      />,
    );
    expect(container.querySelector('[role="grid"]')).toBeInTheDocument();
  });

  it("Transfer handles long item labels", () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "t1", label: LONG_TITLE },
          { key: "t2", label: LONG_TEXT },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("List handles long item titles", () => {
    const { container } = render(
      <List
        items={[
          { key: "l1", title: LONG_TITLE },
          { key: "l2", title: LONG_TEXT },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("SmartDashboard handles long widget titles", () => {
    const { container } = render(
      <SmartDashboard
        widgets={[
          {
            key: "w1",
            title: LONG_TITLE,
            type: "kpi" as const,
            value: "$1",
            tone: "info" as const,
          },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("NavigationRail handles long item labels", () => {
    const { container } = render(
      <NavigationRail
        items={[
          { value: "home", label: LONG_TITLE },
          { value: "settings", label: LONG_TEXT },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Badge handles long children text", () => {
    render(<Badge>{LONG_TEXT}</Badge>);
    expect(screen.getByText(/AAAA/)).toBeInTheDocument();
  });

  it("Tag handles long children text", () => {
    render(<Tag>{LONG_TEXT}</Tag>);
    expect(screen.getByText(/AAAA/)).toBeInTheDocument();
  });

  it("Breadcrumb handles long item labels", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: LONG_TITLE },
          { label: LONG_TEXT },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

/* ================================================================== */
/*  T. Rapid Click / Double Action Prevention Tests                    */
/* ================================================================== */

describe("Edge Cases — T. Rapid Click / Double Action Prevention", () => {
  it("Button: rapid double click fires onClick twice (no built-in debounce)", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("Accordion: rapid toggle doesn't crash", async () => {
    render(
      <Accordion
        items={[{ value: "a", title: "Section", content: "Content" }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Section/i });
    for (let i = 0; i < 10; i++) await userEvent.click(trigger);
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("Tabs: rapid switching doesn't crash", async () => {
    const handler = vi.fn();
    render(
      <Tabs
        items={[
          { key: "t1", label: "Tab 1" },
          { key: "t2", label: "Tab 2" },
          { key: "t3", label: "Tab 3" },
        ]}
        onChange={handler}
      />,
    );
    const tab1 = screen.getByText("Tab 1");
    const tab2 = screen.getByText("Tab 2");
    const tab3 = screen.getByText("Tab 3");
    for (let i = 0; i < 5; i++) {
      await userEvent.click(tab1);
      await userEvent.click(tab2);
      await userEvent.click(tab3);
    }
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
  });

  it("Calendar: rapid next month clicks don't crash", async () => {
    render(<Calendar defaultMonth={new Date(2025, 0)} />);
    const nextBtn = screen.getByTestId("calendar-next");
    for (let i = 0; i < 10; i++) await userEvent.click(nextBtn);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("CommandPalette: rapid open/close doesn't crash", () => {
    const onClose = vi.fn();
    const items = [
      { id: "cmd1", title: "Go to Dashboard", group: "Navigation" },
    ];
    const { rerender } = render(
      <CommandPalette open={true} items={items} onClose={onClose} />,
    );
    for (let i = 0; i < 5; i++) {
      rerender(
        <CommandPalette open={false} items={items} onClose={onClose} />,
      );
      rerender(
        <CommandPalette open={true} items={items} onClose={onClose} />,
      );
    }
    expect(onClose).toBeDefined();
  });

  it("Transfer: rapid move button clicks don't crash", async () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "t1", label: "Item 1" },
          { key: "t2", label: "Item 2" },
        ]}
      />,
    );
    const moveRight = screen.getByTestId("transfer-move-right");
    const moveLeft = screen.getByTestId("transfer-move-left");
    for (let i = 0; i < 5; i++) {
      await userEvent.click(moveRight);
      await userEvent.click(moveLeft);
    }
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

/* ================================================================== */
/*  U. Race Condition Tests                                            */
/* ================================================================== */

describe("Edge Cases — U. Race Condition Tests", () => {
  it("SearchFilterListing: changing items while loading doesn't crash", () => {
    const { rerender } = render(<SearchFilterListing title="T" loading />);
    rerender(
      <SearchFilterListing
        title="T"
        items={[<div key="a">A</div>]}
      />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("Calendar: changing month while selecting doesn't crash", () => {
    const { rerender } = render(
      <Calendar defaultMonth={new Date(2025, 0)} />,
    );
    rerender(
      <Calendar
        defaultMonth={new Date(2025, 6)}
        value={new Date(2025, 0, 15)}
      />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Accordion: changing items while expanded doesn't crash", () => {
    const { rerender } = render(
      <Accordion
        items={[{ value: "a1", title: "First", content: "Content A" }]}
        defaultValue={["a1"]}
      />,
    );
    rerender(
      <Accordion
        items={[
          { value: "b1", title: "Replaced", content: "Content B" },
          { value: "b2", title: "New Item", content: "Content C" },
        ]}
      />,
    );
    expect(screen.getByText("Replaced")).toBeInTheDocument();
  });

  it("Transfer: changing dataSource during selection doesn't crash", () => {
    const { rerender } = render(
      <Transfer
        dataSource={[
          { key: "t1", label: "Item 1" },
          { key: "t2", label: "Item 2" },
        ]}
      />,
    );
    rerender(
      <Transfer
        dataSource={[
          { key: "t3", label: "Item 3" },
          { key: "t4", label: "Item 4" },
        ]}
        targetKeys={["t3"]}
      />,
    );
    expect(screen.getByText("Item 4")).toBeInTheDocument();
  });

  it("CommandPalette: changing items while open doesn't crash", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <CommandPalette
        open={true}
        items={[{ id: "cmd1", title: "First Command", group: "Nav" }]}
        onClose={onClose}
      />,
    );
    rerender(
      <CommandPalette
        open={true}
        items={[
          { id: "cmd2", title: "Replaced Command", group: "Actions" },
          { id: "cmd3", title: "New Command", group: "Actions" },
        ]}
        onClose={onClose}
      />,
    );
    expect(screen.getByText("Replaced Command")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  V. SSR Safety / typeof window Tests                                */
/* ================================================================== */

describe("Edge Cases — V. SSR Safety (JSDOM baseline)", () => {
  it("SearchFilterListing renders without crashing in JSDOM", () => {
    const { container } = render(<SearchFilterListing title="SSR Test" />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("ApprovalReview renders without crashing in JSDOM", () => {
    const { container } = render(
      <ApprovalReview
        title="Review"
        checkpoint={{
          title: "Gate",
          summary: "Summary",
          status: "pending" as const,
          steps: [],
        }}
        citations={[
          {
            id: "c1",
            title: "Citation",
            excerpt: "Excerpt",
            source: "DB",
            kind: "policy" as const,
          },
        ]}
        auditItems={[
          {
            id: "a1",
            actor: "ai" as const,
            title: "Action",
            timestamp: "now",
            status: "drafted" as const,
          },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Accordion renders without crashing in JSDOM", () => {
    const { container } = render(
      <Accordion
        items={[{ value: "a1", title: "Section A", content: "Body A" }]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Calendar renders without crashing in JSDOM", () => {
    const { container } = render(
      <Calendar defaultMonth={new Date(2025, 0)} />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Timeline renders without crashing in JSDOM", () => {
    const { container } = render(
      <Timeline
        items={[
          { key: "tl1", children: "Event 1", color: "primary" as const },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("Transfer renders without crashing in JSDOM", () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "t1", label: "Item 1" },
          { key: "t2", label: "Item 2" },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("SmartDashboard renders without crashing in JSDOM", () => {
    const { container } = render(
      <SmartDashboard
        widgets={[
          {
            key: "w1",
            title: "Revenue",
            type: "kpi" as const,
            value: "$1",
            tone: "info" as const,
          },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("NavigationRail renders without crashing in JSDOM", () => {
    const { container } = render(
      <NavigationRail
        items={[
          { value: "home", label: "Home" },
          { value: "settings", label: "Settings" },
        ]}
      />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

/* ================================================================== */
/*  W. FormField Edge Cases                                            */
/* ================================================================== */

describe("Edge Cases — W. FormField", () => {
  it("handles very long label text", () => {
    const { container } = render(
      <FormField label={LONG_TITLE}>
        <Input />
      </FormField>,
    );
    expect(container.innerHTML).toContain("Cok Uzun Baslik");
  });

  it("handles very long error message", () => {
    render(
      <FormField label="Name" error={LONG_TEXT}>
        <Input />
      </FormField>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert").textContent).toContain("AAAA");
  });

  it("handles empty children gracefully", () => {
    const { container } = render(
      <FormField label="Empty">{null as unknown as React.ReactNode}</FormField>,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("handles rapid validation changes without crash", () => {
    const { rerender } = render(
      <FormField label="Field" error="Error 1">
        <Input />
      </FormField>,
    );
    for (let i = 0; i < 10; i++) {
      rerender(
        <FormField label="Field" error={i % 2 === 0 ? `Error ${i}` : undefined}>
          <Input />
        </FormField>,
      );
    }
    expect(screen.getByText("Field")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  X. DatePicker Edge Cases                                           */
/* ================================================================== */

describe("Edge Cases — X. DatePicker", () => {
  it("handles invalid date string", () => {
    const { container } = render(
      <DatePicker value="not-a-date" label="Date" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("handles rapid open/close (rerender) without crash", () => {
    const { rerender } = render(<DatePicker label="Date" />);
    for (let i = 0; i < 10; i++) {
      rerender(<DatePicker label="Date" value={i % 2 === 0 ? "2025-01-15" : ""} />);
    }
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("handles leap year edge date (Feb 29)", () => {
    const { container } = render(
      <DatePicker value="2024-02-29" label="Leap" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("handles month boundary dates", () => {
    const { container } = render(
      <DatePicker value="2025-01-31" label="End of Jan" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

/* ================================================================== */
/*  Y. Upload Edge Cases                                               */
/* ================================================================== */

describe("Edge Cases — Y. Upload", () => {
  it("handles empty file list", () => {
    const { container } = render(
      <Upload files={[]} label="Files" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
    expect(container.textContent).toContain("0");
  });

  it("handles maximum file count display", () => {
    const files = Array.from({ length: 5 }, (_, i) => ({
      name: `file-${i}.txt`,
      size: 1024 * (i + 1),
    }));
    const { container } = render(
      <Upload files={files} maxFiles={5} label="Max files" />,
    );
    expect(container.textContent).toContain("5 / 5");
  });

  it("renders disabled state with existing files", () => {
    const files = [
      { name: "report.pdf", size: 2048 },
      { name: "data.csv", size: 512 },
    ];
    const { container } = render(
      <Upload files={files} disabled label="Disabled upload" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
    expect(container.textContent).toContain("report.pdf");
  });
});

/* ================================================================== */
/*  Z. ColorPicker Edge Cases                                          */
/* ================================================================== */

describe("Edge Cases — Z. ColorPicker", () => {
  it("handles invalid color string", () => {
    const { container } = render(
      <ColorPicker value="not-a-color" label="Color" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("handles empty string value", () => {
    const { container } = render(
      <ColorPicker value="" label="Empty color" />,
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

/* ================================================================== */
/*  AA. TreeTable Edge Cases                                           */
/* ================================================================== */

describe("Edge Cases — AA. TreeTable", () => {
  const columns = [{ key: "status", label: "Status" }];

  it("handles empty data", () => {
    const { container } = render(
      <TreeTable nodes={[]} columns={columns} />,
    );
    expect(container.querySelector('[data-component="tree-table"]')).toBeInTheDocument();
  });

  it("handles deeply nested data (5+ levels)", () => {
    const deepNode = {
      key: "l5",
      label: "Level 5",
      data: { status: "deep" },
    };
    const nodes = [
      {
        key: "l1",
        label: "Level 1",
        data: { status: "ok" },
        children: [
          {
            key: "l2",
            label: "Level 2",
            data: { status: "ok" },
            children: [
              {
                key: "l3",
                label: "Level 3",
                data: { status: "ok" },
                children: [
                  {
                    key: "l4",
                    label: "Level 4",
                    data: { status: "ok" },
                    children: [deepNode],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const { container } = render(
      <TreeTable
        nodes={nodes}
        columns={columns}
        defaultExpandedKeys={["l1", "l2", "l3", "l4"]}
      />,
    );
    expect(container.textContent).toContain("Level 5");
  });

  it("handles rapid expand/collapse without crash", async () => {
    const nodes = [
      {
        key: "root",
        label: "Root",
        data: { status: "ok" },
        children: [
          { key: "child1", label: "Child 1", data: { status: "ok" } },
          { key: "child2", label: "Child 2", data: { status: "ok" } },
        ],
      },
    ];
    render(<TreeTable nodes={nodes} columns={columns} />);
    const expandBtn = screen.getByRole("button", { name: /expand/i });
    for (let i = 0; i < 10; i++) {
      await userEvent.click(expandBtn);
    }
    expect(screen.getByText("Root")).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  AB. Modal Edge Cases                                               */
/* ================================================================== */

describe("Edge Cases — AB. Modal", () => {
  it("handles rapid open/close without crash", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open={true} onClose={onClose} title="Test" disablePortal>
        <p>Content</p>
      </Modal>,
    );
    for (let i = 0; i < 10; i++) {
      rerender(
        <Modal open={false} onClose={onClose} title="Test" disablePortal>
          <p>Content</p>
        </Modal>,
      );
      rerender(
        <Modal open={true} onClose={onClose} title="Test" disablePortal>
          <p>Content</p>
        </Modal>,
      );
    }
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("handles multiple stacked modals", () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const { container } = render(
      <>
        <Modal open={true} onClose={onClose1} title="Modal 1" disablePortal>
          <p>First modal</p>
        </Modal>
        <Modal open={true} onClose={onClose2} title="Modal 2" disablePortal>
          <p>Second modal</p>
        </Modal>
      </>,
    );
    expect(screen.getByText("First modal")).toBeInTheDocument();
    expect(screen.getByText("Second modal")).toBeInTheDocument();
    expect(container.querySelectorAll("dialog").length).toBe(2);
  });
});

/* ================================================================== */
/*  AC. Drawer Edge Cases                                              */
/* ================================================================== */

describe("Edge Cases — AC. Drawer", () => {
  it("handles rapid open/close without crash", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer open={true} onClose={onClose} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>,
    );
    for (let i = 0; i < 10; i++) {
      rerender(
        <Drawer open={false} onClose={onClose} title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>,
      );
      rerender(
        <Drawer open={true} onClose={onClose} title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>,
      );
    }
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("handles very long content without crash", () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} title="Long Drawer">
        <p>{LONG_TEXT}</p>
        <p>{LONG_TEXT}</p>
        <p>{LONG_TEXT}</p>
      </Drawer>,
    );
    expect(screen.getByText("Long Drawer")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

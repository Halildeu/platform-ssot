// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { GroupedCardGallery } from "../GroupedCardGallery";
import { GalleryCard } from "../GalleryCard";
import { GalleryGroup } from "../GalleryGroup";
import { GallerySearchBar } from "../GallerySearchBar";
import type { GalleryItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Test Data                                                          */
/* ------------------------------------------------------------------ */

const ITEMS: GalleryItem[] = [
  { id: "1", title: "Users Report", description: "User listing", group: "HR", tags: ["grid"] },
  { id: "2", title: "HR Dashboard", description: "HR metrics", group: "HR", tags: ["dashboard"] },
  { id: "3", title: "Demographic", description: "Demographics", group: "HR", tags: ["mixed"] },
  { id: "4", title: "Audit Activity", description: "Audit log", group: "Audit", tags: ["grid"] },
  { id: "5", title: "Log Dashboard", description: "Log metrics", group: "Audit", tags: ["dashboard"] },
  { id: "6", title: "Budget Report", description: "Budget data", group: "Finance", tags: ["grid"] },
  { id: "7", title: "Revenue", description: "Revenue overview", group: "Finance", tags: ["dashboard"] },
];

/* ------------------------------------------------------------------ */
/*  GroupedCardGallery — Main                                          */
/* ------------------------------------------------------------------ */

describe("GroupedCardGallery", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crash", () => {
    const { container } = render(<GroupedCardGallery items={ITEMS} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it("has data-component attribute", () => {
    const { container } = render(<GroupedCardGallery items={ITEMS} />);
    expect(
      container.querySelector('[data-component="grouped-card-gallery"]'),
    ).toBeTruthy();
  });

  it("renders all groups", () => {
    render(<GroupedCardGallery items={ITEMS} />);
    expect(screen.getByText("HR")).toBeTruthy();
    expect(screen.getByText("Audit")).toBeTruthy();
    expect(screen.getByText("Finance")).toBeTruthy();
  });

  it("renders group item counts", () => {
    render(<GroupedCardGallery items={ITEMS} />);
    // HR has 3 items, Audit 2, Finance 2
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders cards for expanded groups", () => {
    render(
      <GroupedCardGallery
        items={ITEMS}
        defaultExpandedGroups={["HR"]}
      />,
    );
    expect(screen.getByText("Users Report")).toBeTruthy();
    expect(screen.getByText("HR Dashboard")).toBeTruthy();
  });

  it("calls onItemClick when card clicked", () => {
    const onClick = vi.fn();
    render(
      <GroupedCardGallery
        items={ITEMS}
        defaultExpandedGroups={["HR"]}
        onItemClick={onClick}
      />,
    );
    fireEvent.click(screen.getByText("Users Report"));
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", title: "Users Report" }),
    );
  });

  it("filters items on search", async () => {
    render(
      <GroupedCardGallery
        items={ITEMS}
        defaultExpandedGroups={["HR", "Audit", "Finance"]}
      />,
    );
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Budget" } });

    // After debounce (300ms)
    await waitFor(
      () => {
        expect(screen.getByText("Budget Report")).toBeTruthy();
      },
      { timeout: 500 },
    );
  });

  it("shows empty state when search has no results", async () => {
    render(<GroupedCardGallery items={ITEMS} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "zzzznonexistent" } });

    await waitFor(
      () => {
        expect(screen.getByText("No results found.")).toBeTruthy();
      },
      { timeout: 500 },
    );
  });

  it("shows custom empty state", async () => {
    render(
      <GroupedCardGallery
        items={ITEMS}
        emptyState={<div>Custom empty</div>}
      />,
    );
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "zzzznonexistent" } });

    await waitFor(
      () => {
        expect(screen.getByText("Custom empty")).toBeTruthy();
      },
      { timeout: 500 },
    );
  });

  it("uses custom summaryFormatter", () => {
    render(
      <GroupedCardGallery
        items={ITEMS}
        summaryFormatter={(all) => `${all.length} total reports`}
      />,
    );
    expect(screen.getByText("7 total reports")).toBeTruthy();
  });

  it("respects groupOrder array", () => {
    const { container } = render(
      <GroupedCardGallery
        items={ITEMS}
        groupOrder={["Finance", "Audit", "HR"]}
      />,
    );
    const groups = container.querySelectorAll('[data-component="gallery-group"]');
    expect(groups[0]?.getAttribute("data-group")).toBe("Finance");
    expect(groups[1]?.getAttribute("data-group")).toBe("Audit");
    expect(groups[2]?.getAttribute("data-group")).toBe("HR");
  });

  it("persists expand state in localStorage", () => {
    const { unmount } = render(
      <GroupedCardGallery
        items={ITEMS}
        defaultExpandedGroups={["HR"]}
        storageKey="test-gallery"
      />,
    );
    // Toggle Finance
    fireEvent.click(screen.getByText("Finance"));
    unmount();

    const stored = JSON.parse(localStorage.getItem("test-gallery") ?? "[]");
    expect(stored).toContain("HR");
    expect(stored).toContain("Finance");
  });

  it("renders custom card via renderCard", () => {
    render(
      <GroupedCardGallery
        items={ITEMS}
        defaultExpandedGroups={["HR"]}
        renderCard={(item) => <div data-testid="custom">{item.title}-custom</div>}
      />,
    );
    expect(screen.getByText("Users Report-custom")).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  GalleryCard — Isolated                                             */
/* ------------------------------------------------------------------ */

describe("GalleryCard", () => {
  it("renders title and description", () => {
    render(
      <GalleryCard
        item={{ id: "1", title: "Test Card", description: "Desc", group: "G" }}
      />,
    );
    expect(screen.getByText("Test Card")).toBeTruthy();
    expect(screen.getByText("Desc")).toBeTruthy();
  });

  it("renders badge", () => {
    render(
      <GalleryCard
        item={{
          id: "1",
          title: "Card",
          group: "G",
          badge: { label: "Grid", tone: "primary" },
        }}
      />,
    );
    expect(screen.getByText("Grid")).toBeTruthy();
  });

  it("renders tags", () => {
    render(
      <GalleryCard
        item={{ id: "1", title: "Card", group: "G", tags: ["hr", "report"] }}
      />,
    );
    expect(screen.getByText("hr")).toBeTruthy();
    expect(screen.getByText("report")).toBeTruthy();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(
      <GalleryCard
        item={{ id: "1", title: "Card", group: "G" }}
        onClick={onClick}
      />,
    );
    fireEvent.click(screen.getByText("Card"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

/* ------------------------------------------------------------------ */
/*  GalleryGroup — Isolated                                            */
/* ------------------------------------------------------------------ */

describe("GalleryGroup", () => {
  it("renders group name and count", () => {
    render(
      <GalleryGroup name="HR" count={3} expanded onToggle={() => {}}>
        <div>content</div>
      </GalleryGroup>,
    );
    expect(screen.getByText("HR")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("calls onToggle when header clicked", () => {
    const onToggle = vi.fn();
    render(
      <GalleryGroup name="HR" count={3} expanded onToggle={onToggle}>
        <div>content</div>
      </GalleryGroup>,
    );
    fireEvent.click(screen.getByText("HR"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("has aria-expanded attribute", () => {
    const { rerender } = render(
      <GalleryGroup name="HR" count={3} expanded onToggle={() => {}}>
        <div>content</div>
      </GalleryGroup>,
    );
    expect(screen.getByRole("button", { name: /HR/ }).getAttribute("aria-expanded")).toBe("true");

    rerender(
      <GalleryGroup name="HR" count={3} expanded={false} onToggle={() => {}}>
        <div>content</div>
      </GalleryGroup>,
    );
    expect(screen.getByRole("button", { name: /HR/ }).getAttribute("aria-expanded")).toBe("false");
  });
});

/* ------------------------------------------------------------------ */
/*  GallerySearchBar — Isolated                                        */
/* ------------------------------------------------------------------ */

describe("GallerySearchBar", () => {
  it("renders input with placeholder", () => {
    render(
      <GallerySearchBar value="" onChange={() => {}} placeholder="Search..." />,
    );
    expect(screen.getByPlaceholderText("Search...")).toBeTruthy();
  });

  it("fires onChange on input", () => {
    const onChange = vi.fn();
    render(
      <GallerySearchBar value="" onChange={onChange} />,
    );
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "test" },
    });
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("shows clear button when value is non-empty", () => {
    render(
      <GallerySearchBar value="test" onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Clear search")).toBeTruthy();
  });

  it("hides clear button when value is empty", () => {
    render(
      <GallerySearchBar value="" onChange={() => {}} />,
    );
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });

  it("fires onChange with empty string on clear", () => {
    const onChange = vi.fn();
    render(
      <GallerySearchBar value="test" onChange={onChange} />,
    );
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("renders summary text", () => {
    render(
      <GallerySearchBar
        value=""
        onChange={() => {}}
        summary="7 items"
      />,
    );
    expect(screen.getByText("7 items")).toBeTruthy();
  });
});

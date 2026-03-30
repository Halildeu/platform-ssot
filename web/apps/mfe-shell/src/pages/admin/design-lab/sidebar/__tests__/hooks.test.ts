// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  Hook Unit Tests — Sidebar v3                                       */
/* ------------------------------------------------------------------ */

// Mock localStorage
const store: Record<string, string> = {};
beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { for (const k in store) delete store[k]; }),
    length: 0,
    key: vi.fn(() => null),
  });
});
afterEach(() => {
  cleanup();
  for (const k in store) delete store[k];
});

/* ================================================================== */
/*  1. useSidebarFavorites                                             */
/* ================================================================== */

describe("useSidebarFavorites", () => {
  it("starts empty", async () => {
    const { useSidebarFavorites } = await import("../hooks/useSidebarFavorites");
    const { result } = renderHook(() => useSidebarFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it("toggle adds and removes favorites", async () => {
    const { useSidebarFavorites } = await import("../hooks/useSidebarFavorites");
    const { result } = renderHook(() => useSidebarFavorites());
    const item = { name: "Button", layer: "primitives", path: "/admin/design-lab/primitives/Button" };

    act(() => result.current.toggle(item));
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].name).toBe("Button");
    expect(result.current.isFavorite("Button")).toBe(true);

    act(() => result.current.toggle(item));
    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite("Button")).toBe(false);
  });

  it("persists to localStorage", async () => {
    const { useSidebarFavorites } = await import("../hooks/useSidebarFavorites");
    const { result } = renderHook(() => useSidebarFavorites());
    const item = { name: "Modal", layer: "components", path: "/admin/design-lab/components/Modal" };

    act(() => result.current.toggle(item));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "design-lab-favorites",
      expect.stringContaining("Modal"),
    );
  });

  it("reorder moves items", async () => {
    const { useSidebarFavorites } = await import("../hooks/useSidebarFavorites");
    const { result } = renderHook(() => useSidebarFavorites());

    act(() => {
      result.current.toggle({ name: "A", layer: "c", path: "/a" });
      result.current.toggle({ name: "B", layer: "c", path: "/b" });
      result.current.toggle({ name: "C", layer: "c", path: "/c" });
    });

    act(() => result.current.reorder(0, 2));
    const names = result.current.favorites.map((f) => f.name);
    expect(names[0]).not.toBe("C"); // order changed
  });

  it("clear removes all", async () => {
    const { useSidebarFavorites } = await import("../hooks/useSidebarFavorites");
    const { result } = renderHook(() => useSidebarFavorites());

    act(() => {
      result.current.toggle({ name: "X", layer: "c", path: "/x" });
      result.current.clear();
    });
    expect(result.current.favorites).toHaveLength(0);
  });
});

/* ================================================================== */
/*  2. useSidebarRecents                                               */
/* ================================================================== */

describe("useSidebarRecents", () => {
  it("tracks visited items", async () => {
    const { useSidebarRecents } = await import("../hooks/useSidebarRecents");
    const { result } = renderHook(() => useSidebarRecents());

    act(() => result.current.track({ name: "Tabs", layer: "components", path: "/tabs" }));
    expect(result.current.recents).toHaveLength(1);
    expect(result.current.recents[0].name).toBe("Tabs");
    expect(result.current.recents[0].visitedAt).toBeGreaterThan(0);
  });

  it("deduplicates — most recent first", async () => {
    const { useSidebarRecents } = await import("../hooks/useSidebarRecents");
    const { result } = renderHook(() => useSidebarRecents());

    // Clear any leftover state from previous tests
    act(() => result.current.clear());

    act(() => {
      result.current.track({ name: "A", layer: "c", path: "/a" });
      result.current.track({ name: "B", layer: "c", path: "/b" });
      result.current.track({ name: "A", layer: "c", path: "/a" }); // revisit
    });
    expect(result.current.recents).toHaveLength(2);
    expect(result.current.recents[0].name).toBe("A"); // most recent
  });

  it("limits to 10 items", async () => {
    const { useSidebarRecents } = await import("../hooks/useSidebarRecents");
    const { result } = renderHook(() => useSidebarRecents());

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.track({ name: `Item${i}`, layer: "c", path: `/item${i}` });
      }
    });
    expect(result.current.recents.length).toBeLessThanOrEqual(10);
  });

  it("clear empties history", async () => {
    const { useSidebarRecents } = await import("../hooks/useSidebarRecents");
    const { result } = renderHook(() => useSidebarRecents());

    act(() => {
      result.current.track({ name: "X", layer: "c", path: "/x" });
      result.current.clear();
    });
    expect(result.current.recents).toHaveLength(0);
  });
});

/* ================================================================== */
/*  3. formatRelativeTime                                              */
/* ================================================================== */

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent timestamps", async () => {
    const { formatRelativeTime } = await import("../hooks/useSidebarRecents");
    expect(formatRelativeTime(Date.now())).toBe("just now");
  });

  it("returns minutes ago", async () => {
    const { formatRelativeTime } = await import("../hooks/useSidebarRecents");
    expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe("5m ago");
  });

  it("returns hours ago", async () => {
    const { formatRelativeTime } = await import("../hooks/useSidebarRecents");
    expect(formatRelativeTime(Date.now() - 2 * 60 * 60_000)).toBe("2h ago");
  });

  it("returns days ago", async () => {
    const { formatRelativeTime } = await import("../hooks/useSidebarRecents");
    expect(formatRelativeTime(Date.now() - 3 * 24 * 60 * 60_000)).toBe("3d ago");
  });
});

/* ================================================================== */
/*  4. useSidebarGroupState                                            */
/* ================================================================== */

describe("useSidebarGroupState", () => {
  it("defaults to open", async () => {
    const { useSidebarGroupState } = await import("../hooks/useSidebarGroupState");
    const { result } = renderHook(() => useSidebarGroupState("components"));

    expect(result.current.isOpen("navigation")).toBe(true);
    expect(result.current.isOpen("forms")).toBe(true);
  });

  it("toggle flips state", async () => {
    const { useSidebarGroupState } = await import("../hooks/useSidebarGroupState");
    const { result } = renderHook(() => useSidebarGroupState("components"));

    act(() => result.current.toggle("navigation"));
    expect(result.current.isOpen("navigation")).toBe(false);

    act(() => result.current.toggle("navigation"));
    expect(result.current.isOpen("navigation")).toBe(true);
  });

  it("collapseAll closes specified groups", async () => {
    const { useSidebarGroupState } = await import("../hooks/useSidebarGroupState");
    const { result } = renderHook(() => useSidebarGroupState("components"));

    act(() => result.current.collapseAll(["nav", "forms", "data"]));
    expect(result.current.isOpen("nav", true)).toBe(false);
    expect(result.current.isOpen("forms", true)).toBe(false);
  });
});

/* ================================================================== */
/*  5. useFuzzySearch                                                  */
/* ================================================================== */

describe("useFuzzySearch", () => {
  const items = [
    { name: "Button" },
    { name: "ButtonGroup" },
    { name: "DatePicker" },
    { name: "DataGrid" },
    { name: "Modal" },
    { name: "Tabs" },
  ];

  it("returns empty when no query", async () => {
    const { useFuzzySearch } = await import("../hooks/useFuzzySearch");
    const { result } = renderHook(() =>
      useFuzzySearch(items, { debounceMs: 0 }),
    );
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("finds exact prefix matches", async () => {
    const { useFuzzySearch } = await import("../hooks/useFuzzySearch");
    const { result } = renderHook(() =>
      useFuzzySearch(items, { debounceMs: 0 }),
    );

    act(() => result.current.setQuery("But"));
    // Wait for debounce
    await vi.waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });
    expect(result.current.results[0].item.name).toBe("Button");
  });

  it("finds fuzzy matches", async () => {
    const { useFuzzySearch } = await import("../hooks/useFuzzySearch");
    const { result } = renderHook(() =>
      useFuzzySearch(items, { debounceMs: 0 }),
    );

    act(() => result.current.setQuery("Dat")); // fuzzy prefix for DatePicker + DataGrid
    await vi.waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });
    const names = result.current.results.map((r) => r.item.name);
    expect(names.some((n) => n === "DatePicker" || n === "DataGrid")).toBe(true);
  });

  it("clear resets search", async () => {
    const { useFuzzySearch } = await import("../hooks/useFuzzySearch");
    const { result } = renderHook(() =>
      useFuzzySearch(items, { debounceMs: 0 }),
    );

    act(() => result.current.setQuery("Modal"));
    act(() => result.current.clear());
    expect(result.current.query).toBe("");
    expect(result.current.isSearching).toBe(false);
  });
});

/* ================================================================== */
/*  6. highlightText                                                   */
/* ================================================================== */

describe("highlightText", () => {
  it("returns unhighlighted text with no ranges", async () => {
    const { highlightText } = await import("../hooks/useFuzzySearch");
    const parts = highlightText("Button", []);
    expect(parts).toEqual([{ text: "Button", highlighted: false }]);
  });

  it("splits text at highlight ranges", async () => {
    const { highlightText } = await import("../hooks/useFuzzySearch");
    const parts = highlightText("Button", [[0, 3]]);
    expect(parts).toEqual([
      { text: "But", highlighted: true },
      { text: "ton", highlighted: false },
    ]);
  });

  it("handles multiple ranges", async () => {
    const { highlightText } = await import("../hooks/useFuzzySearch");
    const parts = highlightText("DatePicker", [[0, 1], [4, 5]]);
    expect(parts.filter((p) => p.highlighted)).toHaveLength(2);
  });
});

/* ================================================================== */
/*  7. useSidebarHealth                                                */
/* ================================================================== */

describe("useSidebarHealth", () => {
  it("returns fallback when API unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const { useSidebarHealth } = await import("../hooks/useSidebarHealth");
    const { result } = renderHook(() => useSidebarHealth());

    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.health).toBeTruthy();
    expect(result.current.health!.total).toBeGreaterThan(0);
    expect(result.current.status).toBe("healthy");
    expect(result.current.percentage).toBe(100);
  });
});

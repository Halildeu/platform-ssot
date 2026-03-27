// @vitest-environment jsdom
import { describe, test, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePortal } from "../usePortal";

describe("usePortal", () => {
  afterEach(() => {
    // Clean up any portal containers left behind by failed tests
    document.querySelectorAll("[data-portal]").forEach((el) => el.remove());
  });

  test("renders children in a portal container on document.body", () => {
    const { result } = renderHook(() => usePortal());

    // A portal container should be appended to document.body
    const portalDiv = document.querySelector("[data-portal]");
    expect(portalDiv).not.toBeNull();
    expect(portalDiv?.parentElement).toBe(document.body);
    expect(result.current.portalElement.current).toBe(portalDiv);
  });

  test("renders children inline when enabled=false", () => {
    const { result } = renderHook(() => usePortal({ enabled: false }));

    // No portal container should be created
    const portalDiv = document.querySelector("[data-portal]");
    expect(portalDiv).toBeNull();
    expect(result.current.portalElement.current).toBeNull();
  });

  test("uses custom container when provided", () => {
    const customContainer = document.createElement("div");
    customContainer.id = "custom-root";
    document.body.appendChild(customContainer);

    const { result } = renderHook(() =>
      usePortal({ container: customContainer }),
    );

    const portalDiv = customContainer.querySelector("[data-portal]");
    expect(portalDiv).not.toBeNull();
    expect(portalDiv?.parentElement).toBe(customContainer);
    expect(result.current.portalElement.current).toBe(portalDiv);

    // Clean up
    customContainer.remove();
  });

  test("sets data-portal attribute", () => {
    renderHook(() => usePortal());

    const portalDiv = document.querySelector("[data-portal]");
    expect(portalDiv).not.toBeNull();
    expect(portalDiv?.getAttribute("data-portal")).toBe("true");
  });

  test("sets custom id", () => {
    renderHook(() => usePortal({ id: "my-portal" }));

    const portalDiv = document.getElementById("my-portal");
    expect(portalDiv).not.toBeNull();
    expect(portalDiv?.getAttribute("data-portal")).toBe("true");
  });

  test("cleans up container on unmount", () => {
    const { unmount } = renderHook(() => usePortal());

    // Portal container should exist
    expect(document.querySelector("[data-portal]")).not.toBeNull();

    // Unmount the hook
    unmount();

    // Portal container should be removed
    expect(document.querySelector("[data-portal]")).toBeNull();
  });

  test("multiple portals don't interfere", () => {
    const { unmount: unmount1 } = renderHook(() =>
      usePortal({ id: "portal-1" }),
    );
    const { unmount: unmount2 } = renderHook(() =>
      usePortal({ id: "portal-2" }),
    );

    // Both portals should exist
    const portals = document.querySelectorAll("[data-portal]");
    expect(portals).toHaveLength(2);
    expect(document.getElementById("portal-1")).not.toBeNull();
    expect(document.getElementById("portal-2")).not.toBeNull();

    // Unmounting one should not affect the other
    unmount1();
    expect(document.querySelectorAll("[data-portal]")).toHaveLength(1);
    expect(document.getElementById("portal-1")).toBeNull();
    expect(document.getElementById("portal-2")).not.toBeNull();

    unmount2();
    expect(document.querySelectorAll("[data-portal]")).toHaveLength(0);
  });

  test("Portal component is returned and stable across renders", () => {
    const { result, rerender } = renderHook(() => usePortal());

    const Portal1 = result.current.Portal;
    rerender();
    const Portal2 = result.current.Portal;

    // Portal function reference should be stable (memoized with useCallback)
    expect(Portal1).toBe(Portal2);
  });
});

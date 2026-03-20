// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFocusRestore } from "../useFocusRestore";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("useFocusRestore", () => {
  it("saves the focused element when opened", () => {
    const button = document.createElement("button");
    button.textContent = "Trigger";
    document.body.appendChild(button);
    button.focus();
    expect(document.activeElement).toBe(button);

    renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: true },
    });

    // The trigger element was saved internally — we verify on close
    expect(document.activeElement).toBe(button);
  });

  it("restores focus to previously focused element on close", async () => {
    const button = document.createElement("button");
    button.textContent = "Trigger";
    document.body.appendChild(button);
    button.focus();

    const { rerender } = renderHook(
      ({ isOpen }) => useFocusRestore(isOpen),
      { initialProps: { isOpen: true } },
    );

    // Move focus away (simulating overlay stealing focus)
    const otherButton = document.createElement("button");
    otherButton.textContent = "Inside overlay";
    document.body.appendChild(otherButton);
    otherButton.focus();
    expect(document.activeElement).toBe(otherButton);

    // Close the overlay
    rerender({ isOpen: false });

    // Wait for requestAnimationFrame
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(document.activeElement).toBe(button);
  });

  it("does nothing when opened without a focused element", () => {
    // body is focused by default
    const { rerender } = renderHook(
      ({ isOpen }) => useFocusRestore(isOpen),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });
    // Should not throw
  });

  it("does not restore focus if never opened", async () => {
    const button = document.createElement("button");
    button.textContent = "Trigger";
    document.body.appendChild(button);
    button.focus();

    renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: false },
    });

    // Button should still be focused (no restoration logic triggered)
    expect(document.activeElement).toBe(button);
  });

  it("handles multiple open/close cycles", async () => {
    const button1 = document.createElement("button");
    button1.textContent = "Button 1";
    document.body.appendChild(button1);

    const button2 = document.createElement("button");
    button2.textContent = "Button 2";
    document.body.appendChild(button2);

    const { rerender } = renderHook(
      ({ isOpen }) => useFocusRestore(isOpen),
      { initialProps: { isOpen: false } },
    );

    // First cycle: focus button1, open, close
    button1.focus();
    rerender({ isOpen: true });
    rerender({ isOpen: false });

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    expect(document.activeElement).toBe(button1);

    // Second cycle: focus button2, open, close
    button2.focus();
    rerender({ isOpen: true });
    rerender({ isOpen: false });

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    expect(document.activeElement).toBe(button2);
  });
});

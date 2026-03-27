/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import React from "react";
import { act } from "react-dom/test-utils";

/**
 * Hydration Smoke Tests
 *
 * Simulates SSR → hydration by:
 * 1. Rendering components to string (server-side)
 * 2. Setting innerHTML on a container (simulating server HTML delivery)
 * 3. Hydrating with React (client-side)
 * 4. Checking that no hydration mismatch warnings appear
 *
 * Only tests presentational/SSR-safe components.
 * Overlay/portal components are excluded — they require browser-only APIs.
 */

const containers: HTMLDivElement[] = [];

afterEach(() => {
  containers.forEach((c) => {
    if (c.parentNode) c.parentNode.removeChild(c);
  });
  containers.length = 0;
});

function withHydrationCheck(fn: () => Promise<void> | void) {
  return async () => {
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const msg = args.map((a) => String(a)).join(" ");
      if (
        msg.includes("hydrat") ||
        msg.includes("Hydrat") ||
        msg.includes("mismatch") ||
        msg.includes("did not match")
      ) {
        errors.push(msg);
      }
      // Suppress to keep test output clean
    };

    try {
      await fn();
    } finally {
      console.error = originalError;
    }

    expect(errors).toEqual([]);
  };
}

async function testHydration(
  Component: React.ComponentType<any>,
  props: Record<string, unknown>,
) {
  const element = React.createElement(Component, props);

  // Server render
  const html = renderToString(element);

  // Set as innerHTML (simulating server HTML delivery)
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  containers.push(container);

  // Hydrate
  await act(async () => {
    hydrateRoot(container, element);
  });

  // Give React time to flush any async warnings
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
  });
}

describe("Hydration Smoke Tests", () => {
  it(
    "Button hydrates without warnings",
    withHydrationCheck(async () => {
      const { Button } = await import("../primitives/button");
      await testHydration(Button, { children: "Click me" });
    }),
  );

  it(
    "Input hydrates without warnings",
    withHydrationCheck(async () => {
      const { Input } = await import("../primitives/input");
      await testHydration(Input, { placeholder: "Type here..." });
    }),
  );

  it(
    "Badge hydrates without warnings",
    withHydrationCheck(async () => {
      const { Badge } = await import("../primitives/badge");
      await testHydration(Badge, { children: "New" });
    }),
  );

  it(
    "Card hydrates without warnings",
    withHydrationCheck(async () => {
      const { Card } = await import("../primitives/card");
      await testHydration(Card, {
        children: React.createElement("span", null, "Card content"),
      });
    }),
  );

  it(
    "Text hydrates without warnings",
    withHydrationCheck(async () => {
      const { Text } = await import("../primitives/text");
      await testHydration(Text, { children: "Hello world" });
    }),
  );

  it(
    "Tag hydrates without warnings",
    withHydrationCheck(async () => {
      const { Tag } = await import("../primitives/tag");
      await testHydration(Tag, { children: "Status" });
    }),
  );

  it(
    "Spinner hydrates without warnings",
    withHydrationCheck(async () => {
      const { Spinner } = await import("../primitives/spinner");
      await testHydration(Spinner, {});
    }),
  );

  it(
    "Breadcrumb hydrates without warnings",
    withHydrationCheck(async () => {
      const { Breadcrumb } = await import("../components/breadcrumb");
      await testHydration(Breadcrumb, {
        items: [
          { label: "Home", href: "/" },
          { label: "Page", href: "/page" },
        ],
      });
    }),
  );

  it(
    "EmptyState hydrates without warnings",
    withHydrationCheck(async () => {
      const { EmptyState } = await import("../components/empty-state");
      await testHydration(EmptyState, {
        title: "No data",
        description: "Nothing to show",
      });
    }),
  );

  /* ---------------------------------------------------------------- */
  /*  Primitives                                                       */
  /* ---------------------------------------------------------------- */

  it(
    "Select hydrates without warnings",
    withHydrationCheck(async () => {
      const { Select } = await import("../primitives/select");
      await testHydration(Select, {
        options: [
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ],
        placeholder: "Pick one",
      });
    }),
  );

  it(
    "Checkbox hydrates without warnings",
    withHydrationCheck(async () => {
      const { Checkbox } = await import("../primitives/checkbox");
      await testHydration(Checkbox, { label: "Accept terms" });
    }),
  );

  it(
    "Radio hydrates without warnings",
    withHydrationCheck(async () => {
      const { Radio } = await import("../primitives/radio");
      await testHydration(Radio, { value: "opt1", label: "Option 1" });
    }),
  );

  it(
    "Switch hydrates without warnings",
    withHydrationCheck(async () => {
      const { Switch } = await import("../primitives/switch");
      await testHydration(Switch, { label: "Dark mode" });
    }),
  );

  /* ---------------------------------------------------------------- */
  /*  Components                                                       */
  /* ---------------------------------------------------------------- */

  it(
    "Tabs hydrates without warnings",
    withHydrationCheck(async () => {
      const { Tabs } = await import("../components/tabs");
      await testHydration(Tabs, {
        items: [
          { key: "t1", label: "Tab 1", children: React.createElement("div", null, "Content 1") },
          { key: "t2", label: "Tab 2", children: React.createElement("div", null, "Content 2") },
        ],
        defaultActiveKey: "t1",
      });
    }),
  );

  it(
    "Accordion hydrates without warnings",
    withHydrationCheck(async () => {
      const { Accordion } = await import("../components/accordion");
      await testHydration(Accordion, {
        items: [
          { value: "a1", title: "Section 1", children: React.createElement("p", null, "Body 1") },
          { value: "a2", title: "Section 2", children: React.createElement("p", null, "Body 2") },
        ],
      });
    }),
  );

  it(
    "Slider hydrates without warnings",
    withHydrationCheck(async () => {
      const { Slider } = await import("../components/slider");
      await testHydration(Slider, { defaultValue: 50, min: 0, max: 100 });
    }),
  );

  it(
    "DatePicker hydrates without warnings",
    withHydrationCheck(async () => {
      const { DatePicker } = await import("../components/date-picker");
      await testHydration(DatePicker, { placeholder: "Select date" });
    }),
  );

  it(
    "Pagination hydrates without warnings",
    withHydrationCheck(async () => {
      const { Pagination } = await import("../components/pagination");
      await testHydration(Pagination, { total: 100, defaultCurrent: 1, pageSize: 10 });
    }),
  );

  it(
    "Steps hydrates without warnings",
    withHydrationCheck(async () => {
      const { Steps } = await import("../components/steps");
      await testHydration(Steps, {
        items: [
          { title: "Step 1" },
          { title: "Step 2" },
          { title: "Step 3" },
        ],
        current: 1,
      });
    }),
  );

  it(
    "Alert hydrates without warnings",
    withHydrationCheck(async () => {
      const { Alert } = await import("../primitives/alert");
      await testHydration(Alert, {
        children: "Something happened",
      });
    }),
  );

  it(
    "Modal (closed) hydrates without warnings",
    withHydrationCheck(async () => {
      const { Modal } = await import("../primitives/modal");
      await testHydration(Modal, {
        open: false,
        children: React.createElement("p", null, "Modal body"),
        title: "Test Modal",
      });
    }),
  );

  it(
    "Drawer (closed) hydrates without warnings",
    withHydrationCheck(async () => {
      const { Drawer } = await import("../primitives/drawer");
      await testHydration(Drawer, {
        open: false,
        onClose: () => {},
        children: React.createElement("p", null, "Drawer body"),
      });
    }),
  );

  it(
    "FormField hydrates without warnings",
    withHydrationCheck(async () => {
      const { FormField } = await import("../components/form-field");
      await testHydration(FormField, {
        label: "Email",
        children: React.createElement("input", { type: "email" }),
      });
    }),
  );

  it(
    "SearchInput hydrates without warnings",
    withHydrationCheck(async () => {
      const { SearchInput } = await import("../components/search-input");
      await testHydration(SearchInput, { placeholder: "Search..." });
    }),
  );

  it(
    "Rating hydrates without warnings",
    withHydrationCheck(async () => {
      const { Rating } = await import("../components/rating");
      await testHydration(Rating, { defaultValue: 3 });
    }),
  );

  // Overlay components (Dialog, Modal open, Popover, Tooltip, Drawers open) are
  // intentionally excluded — they rely on portals and browser-only APIs
  // which do not round-trip through SSR → hydration cleanly.
});

/* ================================================================== */
/*  Interactive Hydration Tests                                        */
/*                                                                     */
/*  These go beyond mismatch detection: they verify that event         */
/*  handlers survive hydration and components are truly interactive.    */
/* ================================================================== */

async function testInteractiveHydration(
  Component: React.ComponentType<any>,
  props: Record<string, unknown>,
): Promise<HTMLDivElement> {
  const element = React.createElement(Component, props);

  // Server render
  const html = renderToString(element);

  // Set as innerHTML (simulating server HTML delivery)
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  containers.push(container);

  // Hydrate
  await act(async () => {
    hydrateRoot(container, element);
  });

  // Give React time to flush any async warnings
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
  });

  return container;
}

describe("Interactive Hydration Tests", () => {
  /* ---------------------------------------------------------------- */
  /*  Primitives                                                       */
  /* ---------------------------------------------------------------- */

  it(
    "Button with onClick is interactive after hydration",
    withHydrationCheck(async () => {
      let clicked = false;
      const { Button } = await import("../primitives/button");
      const container = await testInteractiveHydration(Button, {
        children: "Click me",
        onClick: () => { clicked = true; },
      });

      const btn = container.querySelector("button");
      expect(btn).not.toBeNull();
      await act(async () => { btn!.click(); });
      expect(clicked).toBe(true);
    }),
  );

  it(
    "Input with onChange is interactive after hydration",
    withHydrationCheck(async () => {
      let value = "";
      const { Input } = await import("../primitives/input");
      const container = await testInteractiveHydration(Input, {
        placeholder: "Type here...",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => { value = e.target.value; },
      });

      const input = container.querySelector("input");
      expect(input).not.toBeNull();
      await act(async () => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, "value",
        )!.set!;
        nativeInputValueSetter.call(input!, "hello");
        input!.dispatchEvent(new Event("input", { bubbles: true }));
      });
      expect(value).toBe("hello");
    }),
  );

  it(
    "Select with onChange is interactive after hydration",
    withHydrationCheck(async () => {
      let called = false;
      const { Select } = await import("../primitives/select");
      const container = await testInteractiveHydration(Select, {
        options: [
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ],
        placeholder: "Pick one",
        onChange: () => { called = true; },
      });

      const select = container.querySelector("select");
      expect(select).not.toBeNull();
      await act(async () => {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype, "value",
        )!.set!;
        nativeSetter.call(select!, "b");
        select!.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(called).toBe(true);
    }),
  );

  it(
    "Checkbox with onChange is interactive after hydration",
    withHydrationCheck(async () => {
      let called = false;
      const { Checkbox } = await import("../primitives/checkbox");
      const container = await testInteractiveHydration(Checkbox, {
        label: "Accept terms",
        onChange: () => { called = true; },
      });

      const input = container.querySelector('input[type="checkbox"]');
      expect(input).not.toBeNull();
      await act(async () => { input!.click(); });
      expect(called).toBe(true);
    }),
  );

  it(
    "Switch with onChange is interactive after hydration",
    withHydrationCheck(async () => {
      let called = false;
      const { Switch } = await import("../primitives/switch");
      const container = await testInteractiveHydration(Switch, {
        label: "Dark mode",
        onChange: () => { called = true; },
      });

      // Switch may use a button, input, or clickable element
      const toggle = container.querySelector('button, input, [role="switch"]');
      expect(toggle).not.toBeNull();
      await act(async () => { toggle!.click(); });
      expect(called).toBe(true);
    }),
  );

  /* ---------------------------------------------------------------- */
  /*  Components                                                       */
  /* ---------------------------------------------------------------- */

  it(
    "Tabs with state is interactive after hydration",
    withHydrationCheck(async () => {
      const { Tabs } = await import("../components/tabs");
      const container = await testInteractiveHydration(Tabs, {
        items: [
          { key: "t1", label: "Tab 1", content: React.createElement("div", null, "Content 1") },
          { key: "t2", label: "Tab 2", content: React.createElement("div", null, "Content 2") },
        ],
        defaultActiveKey: "t1",
      });

      // Verify first tab content is visible
      expect(container.textContent).toContain("Content 1");

      // Click second tab
      const tabButtons = container.querySelectorAll('[role="tab"]');
      const tab2 = Array.from(tabButtons).find((el) => el.textContent?.includes("Tab 2"));
      expect(tab2).toBeDefined();
      await act(async () => { tab2!.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      expect(container.textContent).toContain("Content 2");
    }),
  );

  it(
    "Accordion with state is interactive after hydration",
    withHydrationCheck(async () => {
      const { Accordion } = await import("../components/accordion");
      const container = await testInteractiveHydration(Accordion, {
        items: [
          { value: "a1", title: "Section 1", content: React.createElement("p", null, "Body 1") },
          { value: "a2", title: "Section 2", content: React.createElement("p", null, "Body 2") },
        ],
      });

      // Click the first accordion header to expand it
      const triggers = container.querySelectorAll('button, [role="button"], [data-component*="trigger"], summary');
      const firstTrigger = Array.from(triggers).find((el) => el.textContent?.includes("Section 1"));
      expect(firstTrigger).toBeDefined();
      await act(async () => { firstTrigger!.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      expect(container.textContent).toContain("Body 1");
    }),
  );

  it(
    "Pagination with state is interactive after hydration",
    withHydrationCheck(async () => {
      let page = 1;
      const { Pagination } = await import("../components/pagination");
      const container = await testInteractiveHydration(Pagination, {
        total: 100,
        defaultCurrent: 1,
        pageSize: 10,
        onChange: (p: number) => { page = p; },
      });

      // Find a page button (e.g., page 2)
      const buttons = container.querySelectorAll("button, a, [role='button']");
      const page2Btn = Array.from(buttons).find((el) => el.textContent?.trim() === "2");
      expect(page2Btn).toBeDefined();
      await act(async () => { page2Btn!.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      expect(page).toBe(2);
    }),
  );

  it(
    "Badge (presentational) retains content after hydration",
    withHydrationCheck(async () => {
      const { Badge } = await import("../primitives/badge");
      const container = await testInteractiveHydration(Badge, {
        children: "New",
      });

      expect(container.textContent).toContain("New");
      // Badge is presentational — verify DOM structure survived hydration
      expect(container.innerHTML.length).toBeGreaterThan(0);
    }),
  );

  it(
    "Alert with onClose is interactive after hydration",
    withHydrationCheck(async () => {
      let closed = false;
      const { Alert } = await import("../primitives/alert");
      const container = await testInteractiveHydration(Alert, {
        children: "Something happened",
        closable: true,
        onClose: () => { closed = true; },
      });

      // Find the dismiss/close button
      const closeBtn = container.querySelector('button[aria-label*="close" i], button[aria-label*="dismiss" i], button');
      expect(closeBtn).not.toBeNull();
      await act(async () => { closeBtn!.click(); });
      expect(closed).toBe(true);
    }),
  );

  it(
    "ErrorBoundary hydrates without warnings and wraps children",
    withHydrationCheck(async () => {
      const { ErrorBoundary } = await import("../components/error-boundary/ErrorBoundary");
      const container = await testInteractiveHydration(ErrorBoundary, {
        children: React.createElement("p", null, "Safe content"),
      });

      // Verify children rendered through the boundary
      expect(container.textContent).toContain("Safe content");
      // Verify the wrapper div has the data-component attribute
      const wrapper = container.querySelector('[data-component="error-boundary"]');
      expect(wrapper).not.toBeNull();
    }),
  );
});

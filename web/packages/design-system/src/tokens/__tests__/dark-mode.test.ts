// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Dark mode tokens", () => {
  const darkCSS = fs.readFileSync(
    path.join(__dirname, "../build/dark-mode.css"),
    "utf-8",
  );

  it('has [data-mode="dark"] selector', () => {
    expect(darkCSS).toContain('[data-mode="dark"]');
  });

  it("defines all semantic surface tokens in dark mode", () => {
    expect(darkCSS).toContain("--surface-default");
    expect(darkCSS).toContain("--surface-canvas");
    expect(darkCSS).toContain("--surface-muted");
    expect(darkCSS).toContain("--surface-raised");
  });

  it("defines all text tokens in dark mode", () => {
    expect(darkCSS).toContain("--text-primary");
    expect(darkCSS).toContain("--text-secondary");
    expect(darkCSS).toContain("--text-disabled");
  });

  it("defines all border tokens in dark mode", () => {
    expect(darkCSS).toContain("--border-default");
    expect(darkCSS).toContain("--border-subtle");
    expect(darkCSS).toContain("--border-strong");
  });

  it("has system preference media query", () => {
    expect(darkCSS).toContain("prefers-color-scheme: dark");
  });

  it("sets color-scheme: dark", () => {
    expect(darkCSS).toContain("color-scheme: dark");
  });
});

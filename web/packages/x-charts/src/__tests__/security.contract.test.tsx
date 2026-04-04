/**
 * Contract Test: Chart Security — XSS Sanitization
 *
 * Validates that all text sanitization functions properly
 * prevent XSS attacks through chart labels, tooltips, and data.
 *
 * @see chart-viz-engine-selection (security constraint)
 */
import { describe, it, expect } from "vitest";
import {
  sanitizeChartText,
  sanitizeChartData,
  validateStreamUrl,
} from "../security/sanitizeChartText";

describe("sanitizeChartText", () => {
  it("escapes HTML angle brackets", () => {
    expect(sanitizeChartText("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;",
    );
  });

  it("escapes ampersands", () => {
    expect(sanitizeChartText("A & B")).toBe("A &amp; B");
  });

  it("escapes double quotes", () => {
    expect(sanitizeChartText('value="bad"')).toBe("value=&quot;bad&quot;");
  });

  it("escapes single quotes", () => {
    expect(sanitizeChartText("it's")).toBe("it&#x27;s");
  });

  it("escapes forward slashes", () => {
    expect(sanitizeChartText("</div>")).toBe("&lt;&#x2F;div&gt;");
  });

  it("returns undefined for null/undefined input", () => {
    expect(sanitizeChartText(null)).toBeUndefined();
    expect(sanitizeChartText(undefined)).toBeUndefined();
  });

  it("preserves safe text", () => {
    expect(sanitizeChartText("Revenue 2026")).toBe("Revenue 2026");
  });

  it("handles empty string", () => {
    // sanitizeChartText only returns undefined for null/undefined
    expect(sanitizeChartText("")).toBe("");
  });

  it("handles numeric strings", () => {
    expect(sanitizeChartText("12345")).toBe("12345");
  });

  // Common XSS payloads
  const XSS_PAYLOADS = [
    '<img src=x onerror=alert(1)>',
    '"><script>alert(document.cookie)</script>',
    "javascript:alert('XSS')",
    '<svg onload=alert(1)>',
    '{{constructor.constructor("return this")()}}',
    '<iframe src="javascript:alert(1)">',
    "'-alert(1)-'",
  ];

  it.each(XSS_PAYLOADS)("sanitizes XSS payload: %s", (payload) => {
    const result = sanitizeChartText(payload)!;
    // HTML tags must be escaped — angle brackets are the XSS vector
    expect(result).not.toContain("<script");
    expect(result).not.toContain("<img ");
    expect(result).not.toContain("<svg ");
    expect(result).not.toContain("<iframe");
    // Verify angle brackets are properly escaped
    if (payload.includes("<")) {
      expect(result).toContain("&lt;");
    }
  });
});

describe("sanitizeChartData", () => {
  it("sanitizes all string values in data array", () => {
    const data = [
      { label: "<b>Bold</b>", value: 10 },
      { label: "Normal", value: 20 },
    ];
    const result = sanitizeChartData(data);

    expect(result[0].label).toBe("&lt;b&gt;Bold&lt;&#x2F;b&gt;");
    expect(result[0].value).toBe(10); // numbers untouched
    expect(result[1].label).toBe("Normal");
  });

  it("handles empty array", () => {
    expect(sanitizeChartData([])).toEqual([]);
  });

  it("preserves non-string values", () => {
    const data = [
      { label: "A", value: 42, active: true, meta: null },
    ];
    const result = sanitizeChartData(data);
    expect(result[0].value).toBe(42);
    expect(result[0].active).toBe(true);
    expect(result[0].meta).toBeNull();
  });
});

describe("validateStreamUrl", () => {
  const whitelist = [
    "https://api.example.com",
    "wss://stream.example.com",
    "*.trusted.io",
  ];

  it("allows whitelisted URLs", () => {
    expect(validateStreamUrl("https://api.example.com/data", whitelist)).toBe(true);
    expect(validateStreamUrl("wss://stream.example.com/feed", whitelist)).toBe(true);
  });

  it("allows wildcard domain matches", () => {
    expect(validateStreamUrl("https://charts.trusted.io/v1", whitelist)).toBe(true);
    expect(validateStreamUrl("https://sub.trusted.io/api", whitelist)).toBe(true);
  });

  it("rejects non-whitelisted URLs", () => {
    expect(validateStreamUrl("https://evil.com/data", whitelist)).toBe(false);
    expect(validateStreamUrl("https://api.example.org/data", whitelist)).toBe(false);
  });

  it("rejects empty/invalid URLs", () => {
    expect(validateStreamUrl("", whitelist)).toBe(false);
    expect(validateStreamUrl("not-a-url", whitelist)).toBe(false);
  });

  it("rejects with empty whitelist", () => {
    expect(validateStreamUrl("https://api.example.com", [])).toBe(false);
  });
});

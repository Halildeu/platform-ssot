import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WatermarkProps {
  content?: string | string[];
  image?: string;
  rotate?: number;
  gap?: [number, number];
  offset?: [number, number];
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  zIndex?: number;
  children?: React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ROTATE = -22;
const DEFAULT_GAP: [number, number] = [100, 100];
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_OPACITY = 0.15;
const DEFAULT_Z_INDEX = 9;

/* ------------------------------------------------------------------ */
/*  Canvas watermark generator                                         */
/* ------------------------------------------------------------------ */

function generateWatermarkDataUrl(props: {
  content?: string | string[];
  image?: string;
  rotate: number;
  gap: [number, number];
  offset?: [number, number];
  fontSize: number;
  fontColor: string;
  opacity: number;
}): Promise<string> {
  const {
    content,
    image,
    rotate,
    gap,
    offset,
    fontSize,
    fontColor,
    opacity,
  } = props;

  return new Promise((resolve) => {
    if (image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const cellWidth = img.width + gap[0];
        const cellHeight = img.height + gap[1];
        canvas.width = cellWidth;
        canvas.height = cellHeight;

        ctx.globalAlpha = opacity;
        ctx.translate(cellWidth / 2, cellHeight / 2);
        ctx.rotate((rotate * Math.PI) / 180);

        const ox = offset?.[0] ?? 0;
        const oy = offset?.[1] ?? 0;
        ctx.drawImage(img, -img.width / 2 + ox, -img.height / 2 + oy);

        resolve(canvas.toDataURL());
      };
      img.onerror = () => resolve("");
      img.src = image;
      return;
    }

    // Text watermark
    const lines = Array.isArray(content) ? content : [content ?? ""];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    ctx.font = `${fontSize}px sans-serif`;
    const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
    const lineHeight = fontSize * 1.5;
    const textHeight = lines.length * lineHeight;

    const cellWidth = maxWidth + gap[0];
    const cellHeight = textHeight + gap[1];
    canvas.width = cellWidth;
    canvas.height = cellHeight;

    ctx.globalAlpha = opacity;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(cellWidth / 2, cellHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);

    const ox = offset?.[0] ?? 0;
    const oy = offset?.[1] ?? 0;
    const startY = -(textHeight / 2) + lineHeight / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, ox, startY + i * lineHeight + oy);
    });

    resolve(canvas.toDataURL());
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(function Watermark(
  {
    content,
    image,
    rotate = DEFAULT_ROTATE,
    gap = DEFAULT_GAP,
    offset,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = "var(--text-disabled, rgba(0,0,0,0.15))",
    opacity = DEFAULT_OPACITY,
    zIndex = DEFAULT_Z_INDEX,
    children,
    className,
  },
  forwardedRef,
) {
  const [bgUrl, setBgUrl] = React.useState<string>("");
  const watermarkRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Merge forwarded ref
  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef],
  );

  // Generate watermark
  React.useEffect(() => {
    generateWatermarkDataUrl({
      content,
      image,
      rotate,
      gap,
      offset,
      fontSize,
      fontColor,
      opacity,
    }).then(setBgUrl);
  }, [content, image, rotate, gap, offset, fontSize, fontColor, opacity]);

  // Anti-tamper: MutationObserver to restore watermark if removed or modified
  React.useEffect(() => {
    const container = containerRef.current;
    const watermarkEl = watermarkRef.current;
    if (!container || !watermarkEl) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Check if watermark was removed
        if (mutation.type === "childList") {
          const removed = Array.from(mutation.removedNodes);
          if (removed.includes(watermarkEl)) {
            container.appendChild(watermarkEl);
          }
        }
        // Check if watermark style was changed
        if (
          mutation.type === "attributes" &&
          mutation.target === watermarkEl
        ) {
          watermarkEl.setAttribute(
            "style",
            buildWatermarkStyle(bgUrl, zIndex),
          );
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, [bgUrl, zIndex]);

  if (!content && !image) {
    return (
      <div ref={mergedRef} className={className} data-testid="watermark-root">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={mergedRef}
      className={cn("relative", className)}
      data-testid="watermark-root"
    >
      {children}
      <div
        ref={watermarkRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundRepeat: "repeat",
          zIndex,
        }}
        data-testid="watermark-overlay"
        aria-hidden="true"
      />
    </div>
  );
});

function buildWatermarkStyle(bgUrl: string, zIndex: number): string {
  return `position: absolute; inset: 0px; pointer-events: none; background-image: url(${bgUrl}); background-repeat: repeat; z-index: ${zIndex};`;
}

Watermark.displayName = "Watermark";

export default Watermark;

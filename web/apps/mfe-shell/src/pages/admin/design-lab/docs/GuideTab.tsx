import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Microscope,
  Lightbulb,
  Ban,
  Accessibility,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Text } from "@mfe/design-system";
import { getGuideForComponent } from "./guideRegistry";
import type { GuideSection } from "./guideRegistry";

/* ------------------------------------------------------------------ */
/*  GuideTab — Narrative documentation with mini-TOC                    */
/*                                                                     */
/*  Structured sections: Overview, When to Use, Anatomy,               */
/*  Best Practices, Anti-Patterns, Accessibility                       */
/*                                                                     */
/*  Features:                                                          */
/*  - Floating mini-TOC on the left (desktop)                          */
/*  - Active section tracking via IntersectionObserver                 */
/*  - Markdown-style content rendering (bold, code, lists)             */
/*  - Related component links                                          */
/*                                                                     */
/*  Surpasses: AntD "When to Use" + Storybook Docs + Shadcn           */
/* ------------------------------------------------------------------ */

const SECTION_ICONS: Record<string, React.ReactNode> = {
  overview: <BookOpen className="h-3.5 w-3.5" />,
  "when-to-use": <CheckCircle2 className="h-3.5 w-3.5" />,
  anatomy: <Microscope className="h-3.5 w-3.5" />,
  "best-practices": <Lightbulb className="h-3.5 w-3.5" />,
  "anti-patterns": <Ban className="h-3.5 w-3.5" />,
  accessibility: <Accessibility className="h-3.5 w-3.5" />,
};

/* ---- Lightweight markdown renderer ---- */

function renderMarkdownContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="flex flex-col ml-4 gap-1">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") {
      flushList();
      continue;
    }

    // Heading (bold standalone line)
    if (/^\*\*[^*]+\*\*$/.test(trimmed) && !trimmed.startsWith("**❌") && !trimmed.startsWith("**✅") && !trimmed.startsWith("**Use")) {
      flushList();
      const text = trimmed.replace(/^\*\*/, "").replace(/\*\*$/, "");
      elements.push(
        <Text key={`h-${i}`} as="div" className="mt-4 mb-1.5 text-sm font-semibold text-text-primary">
          {text}
        </Text>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Code block
    if (trimmed.startsWith("```")) {
      flushList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          className="my-2 overflow-x-auto rounded-xl bg-surface-inverse p-4 text-xs leading-relaxed text-border-subtle font-mono"
        >
          {codeLines.join("\n")}
        </pre>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      const numText = trimmed.replace(/^\d+\.\s+/, "");
      elements.push(
        <div key={`ol-${i}`} className="flex gap-2 text-sm text-text-secondary leading-relaxed ml-1">
          <span className="font-semibold text-text-tertiary shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(numText)}</span>
        </div>,
      );
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <div key={`p-${i}`} className="text-sm leading-relaxed text-text-secondary">
        {renderInline(trimmed)}
      </div>,
    );
  }

  flushList();
  return <div className="flex flex-col gap-2">{elements}</div>;
}

/** Inline markdown: **bold**, `code`, → arrows */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|→)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-text-primary">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded-xs bg-surface-muted px-1.5 py-0.5 text-[11px] font-mono text-state-danger-text"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token === "→") {
      parts.push(
        <span key={match.index} className="text-text-tertiary mx-0.5">
          →
        </span>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

/* ---- Mini TOC ---- */

function MiniToc({
  sections,
  activeSection,
  onSectionClick,
}: {
  sections: GuideSection[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}) {
  return (
    <nav className="flex flex-col sticky top-4 gap-0.5">
      <Text as="div" className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
        On this page
      </Text>
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onSectionClick(section.id)}
          className={[
            "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition",
            activeSection === section.id
              ? "bg-action-primary/10 text-action-primary font-medium"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-muted",
          ].join(" ")}
        >
          {SECTION_ICONS[section.id] ?? <ChevronRight className="h-3 w-3" />}
          {section.title}
        </button>
      ))}
    </nav>
  );
}

/* ---- Main GuideTab ---- */

type GuideTabProps = {
  componentName: string;
};

export const GuideTab: React.FC<GuideTabProps> = ({ componentName }) => {
  const guide = useMemo(() => getGuideForComponent(componentName), [componentName]);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Set initial active section
  useEffect(() => {
    if (guide && guide.sections.length > 0 && !activeSection) {
      setActiveSection(guide.sections[0].id);
    }
  }, [guide, activeSection]);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    if (!guide) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
    );

    const refs = sectionRefs.current;
    Object.values(refs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [guide]);

  const handleSectionClick = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  }, []);

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle py-16">
        <BookOpen className="h-8 w-8 text-text-tertiary" />
        <Text as="div" className="mt-3 text-sm font-medium text-text-secondary">
          Guide coming soon
        </Text>
        <Text variant="secondary" className="mt-1 text-xs">
          A detailed usage guide for {componentName} will be added in the next update.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Mini TOC — sidebar */}
      <div className="hidden w-48 shrink-0 lg:block">
        <MiniToc
          sections={guide.sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col min-w-0 flex-1 gap-6">
        {/* Summary card */}
        <div className="rounded-2xl border border-border-subtle bg-linear-to-r from-action-primary/5 to-transparent p-5">
          <Text as="div" className="text-sm leading-relaxed text-text-primary">
            {guide.summary}
          </Text>
        </div>

        {/* Sections */}
        {guide.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            className="scroll-mt-4"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-muted">
                {SECTION_ICONS[section.id] ?? (
                  <span className="text-xs">{section.icon}</span>
                )}
              </div>
              <Text as="h3" className="text-base font-semibold text-text-primary">
                {section.title}
              </Text>
            </div>
            <div className="pl-[38px]">
              {renderMarkdownContent(section.content)}
            </div>
          </div>
        ))}

        {/* Related components */}
        {guide.relatedComponents && guide.relatedComponents.length > 0 && (
          <div className="rounded-2xl border border-border-subtle p-5">
            <Text as="div" className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Related Components
            </Text>
            <div className="flex flex-wrap gap-2">
              {guide.relatedComponents.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary hover:bg-surface-canvas cursor-pointer"
                >
                  {name}
                  <ArrowUpRight className="h-3 w-3 text-text-tertiary" />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideTab;

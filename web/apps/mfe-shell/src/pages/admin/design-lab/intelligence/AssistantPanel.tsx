import React, { useState, useCallback } from "react";
import { Text } from "@mfe/design-system";
import {
  MessageCircle,
  Send,
  Lightbulb,
  GitCompare,
  Award,
  ExternalLink,
  Info,
} from "lucide-react";
import { useDesignLabAssistant } from "./useDesignLabAssistant";
import type { AssistantResponse, AssistantSource } from "./useDesignLabAssistant";

/* ------------------------------------------------------------------ */
/*  Confidence badge                                                    */
/* ------------------------------------------------------------------ */

const CONFIDENCE_STYLES: Record<
  AssistantResponse["confidence"],
  { bg: string; text: string }
> = {
  high: { bg: "bg-state-success-bg", text: "text-state-success-text" },
  medium: { bg: "bg-state-warning-bg", text: "text-state-warning-text" },
  low: { bg: "bg-surface-muted", text: "text-text-secondary" },
};

function ConfidenceBadge({
  confidence,
}: {
  confidence: AssistantResponse["confidence"];
}) {
  const style = CONFIDENCE_STYLES[confidence];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
    >
      <Info className="h-2.5 w-2.5" />
      {confidence}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Source link                                                          */
/* ------------------------------------------------------------------ */

function SourceLink({ source }: { source: AssistantSource }) {
  return (
    <a
      href={source.url}
      className="inline-flex items-center gap-1 rounded-lg bg-surface-canvas px-2 py-1 text-[10px] font-medium text-action-primary transition hover:bg-surface-muted"
    >
      <ExternalLink className="h-2.5 w-2.5" />
      {source.name}
      <span className="text-text-secondary">({source.type})</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Message bubble                                                      */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  response?: AssistantResponse;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-action-primary text-text-inverse"
            : "bg-surface-canvas text-text-primary"
        }`}
      >
        <Text
          className={`whitespace-pre-wrap text-sm ${isUser ? "text-text-inverse" : "text-text-primary"}`}
        >
          {message.content}
        </Text>

        {/* Response metadata */}
        {message.response && (
          <div className="flex flex-col mt-2 gap-2">
            {/* Confidence */}
            <ConfidenceBadge confidence={message.response.confidence} />

            {/* Sources */}
            {message.response.sources.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {message.response.sources.map((source) => (
                  <SourceLink key={source.url} source={source} />
                ))}
              </div>
            )}

            {/* Suggestions */}
            {message.response.suggestions &&
              message.response.suggestions.length > 0 && (
                <div className="border-t border-border-subtle pt-2">
                  <Text
                    variant="secondary"
                    className="mb-1 text-[10px] font-semibold uppercase"
                  >
                    Oneriler
                  </Text>
                  {message.response.suggestions.map((s, i) => (
                    <Text
                      key={i}
                      variant="secondary"
                      className="text-[11px] leading-4"
                    >
                      - {s}
                    </Text>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                          */
/* ------------------------------------------------------------------ */

export default function AssistantPanel() {
  const assistant = useDesignLabAssistant();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const question = input.trim();
      if (!question) return;

      // Add user message
      const userMsg: ChatMessage = {
        id: nextId,
        role: "user",
        content: question,
      };

      // Get assistant response
      const response = assistant.query({ question });

      const assistantMsg: ChatMessage = {
        id: nextId + 1,
        role: "assistant",
        content: response.answer,
        response,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setNextId((n) => n + 2);
      setInput("");
    },
    [input, nextId, assistant],
  );

  const handleQuickAction = useCallback(
    (action: "suggest" | "compare" | "quality") => {
      let response: AssistantResponse;
      let userContent: string;

      switch (action) {
        case "suggest":
          userContent = "Form ekrani icin component oner";
          response = assistant.suggestComponents("form input select");
          break;
        case "compare":
          userContent = "Select ile Combobox karsilastir";
          response = assistant.compareComponents("Select", "Combobox");
          break;
        case "quality":
          userContent = "Kalite skoru yuksek component'leri bul (min 60)";
          response = assistant.findByQuality(60);
          break;
      }

      const userMsg: ChatMessage = {
        id: nextId,
        role: "user",
        content: userContent,
      };
      const assistantMsg: ChatMessage = {
        id: nextId + 1,
        role: "assistant",
        content: response.answer,
        response,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setNextId((n) => n + 2);
    },
    [nextId, assistant],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-action-primary" />
        <Text className="text-sm font-semibold text-text-primary">
          Design Lab Asistan
        </Text>
        <Text variant="secondary" className="text-[10px]">
          Katalog verisiyle cevaplanir
        </Text>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handleQuickAction("suggest")}
          className="flex items-center gap-1 rounded-lg bg-surface-canvas px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
        >
          <Lightbulb className="h-3 w-3" />
          Component oner
        </button>
        <button
          type="button"
          onClick={() => handleQuickAction("compare")}
          className="flex items-center gap-1 rounded-lg bg-surface-canvas px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
        >
          <GitCompare className="h-3 w-3" />
          Karsilastir
        </button>
        <button
          type="button"
          onClick={() => handleQuickAction("quality")}
          className="flex items-center gap-1 rounded-lg bg-surface-canvas px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
        >
          <Award className="h-3 w-3" />
          Kalite ara
        </button>
      </div>

      {/* Chat area */}
      <div className="flex flex-col min-h-[200px] max-h-[400px] gap-3 overflow-y-auto rounded-xl border border-border-subtle bg-surface-default p-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Text variant="secondary" className="text-sm">
              Soru sorun veya hizli islemlerden birini secin
            </Text>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bir soru sorun... (ornegin: 'Button variant'lari neler?')"
          className="flex-1 rounded-xl border border-border-subtle bg-surface-default px-4 py-2.5 text-sm text-text-primary outline-hidden placeholder:text-text-secondary/60 focus:border-action-primary"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action-primary text-text-inverse transition hover:bg-action-primary/90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

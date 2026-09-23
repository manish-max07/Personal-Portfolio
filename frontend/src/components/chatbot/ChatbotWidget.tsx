"use client";

import React, { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import axios from "axios";

/* ── Types ──────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  loading?: boolean;
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Hi! Ask me anything about Manish's skills, projects, or experience.",
};

function parseInline(text: string): ReactNode {
  if (!text) return null;
  const parts: ReactNode[] = [];
  // Tokenizer: bold (**...**), inline code (`...`), italic (*...*), underline bold (__...__), link ([text](url))
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*|__([^_]+)__|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const full = match[0];
    const bold1 = match[2];
    const code = match[3];
    const italic = match[4];
    const bold2 = match[5];
    const linkText = match[6];
    const linkUrl = match[7];

    if (bold1 || bold2) {
      parts.push(
        <strong key={match.index} className="font-bold text-text-primary">
          {bold1 || bold2}
        </strong>
      );
    } else if (code) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 text-accent-cyan font-mono text-xs">
          {code}
        </code>
      );
    } else if (italic) {
      parts.push(
        <em key={match.index} className="italic text-text-primary/90">
          {italic}
        </em>
      );
    } else if (linkText && linkUrl) {
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan underline hover:text-accent-cyan/80 transition-colors"
        >
          {linkText}
        </a>
      );
    } else {
      parts.push(full);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function FormattedMessage({ text }: { text: string }) {
  if (!text) return null;

  // Pre-normalize text so inline numbered items or dashed items start on new lines
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/---\s*/g, "\n---\n")
    .replace(/###\s*/g, "\n### ")
    .replace(/\s+(\*\*\d+\.\s+)/g, "\n\n$1")
    .replace(/([.!?])\s+(\d+\.\s+)/g, "$1\n\n$2")
    .replace(/([.!?])\s+-\s+([A-Z])/g, "$1\n- $2")
    .replace(/\s+-\s+(\*\*[^*]+\*\*)/g, "\n- $1")
    .replace(/(\*\*(Email|LinkedIn|GitHub|Phone|Contact)\*\*)/gi, "\n$1");

  const lines = normalized.split("\n");
  const elements: ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      elements.push(<div key={`sp-${i}`} className="h-1.5" />);
      continue;
    }

    if (/^[-*_]{3,}$/.test(line)) {
      elements.push(<hr key={`hr-${i}`} className="my-2 border-white/10" />);
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="font-semibold text-accent-cyan text-sm mt-2 mb-1">
          {parseInline(line.replace(/^###\s+/, ""))}
        </h4>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-bold text-accent-cyan text-sm mt-2.5 mb-1">
          {parseInline(line.replace(/^##\s+/, ""))}
        </h3>
      );
      continue;
    }

    // Numbered item with bold, like "**1. Shield For She**"
    const boldNumMatch = line.match(/^\*\*(\d+\.\s+[^*]+)\*\*(.*)/);
    if (boldNumMatch) {
      elements.push(
        <div key={`bnum-${i}`} className="my-1.5">
          <span className="font-bold text-accent-cyan">{boldNumMatch[1]}</span>
          <span className="text-text-secondary">{parseInline(boldNumMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Bullet points (- or * or •)
    if (/^[-*•]\s+/.test(line)) {
      const bulletContent = line.replace(/^[-*•]\s+/, "");
      elements.push(
        <div key={`bl-${i}`} className="flex items-start gap-2 my-1 pl-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" />
          <span className="flex-1 leading-relaxed text-text-secondary">{parseInline(bulletContent)}</span>
        </div>
      );
      continue;
    }

    // Numbered items (1. item)
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-1 pl-0.5">
          <span className="font-semibold text-accent-cyan text-xs mt-0.5 flex-shrink-0">
            {numMatch[1]}.
          </span>
          <span className="flex-1 leading-relaxed text-text-secondary">{parseInline(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={`p-${i}`} className="my-0.5 leading-relaxed text-text-secondary">
        {parseInline(rawLine)}
      </p>
    );
  }

  return <div className="space-y-0.5 text-sm">{elements}</div>;
}



export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    const loadingMsg: Message = {
      id: `bot-loading-${Date.now()}`,
      role: "bot",
      text: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setSending(true);

    try {
      const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8001";
      const response = await axios.post<{ answer: string; confidence: number }>(
        `${chatbotUrl}/chatbot/ask`,
        { message: text }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, text: response.data.answer, loading: false }
            : m
        )
      );
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      const errorMsg = axiosErr.response?.status === 429 
        ? "You are spamming, try after some time." 
        : "Sorry, I couldn't process that — please try again.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? {
                ...m,
                text: errorMsg,
                loading: false,
              }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass glow-border flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(34,200,255,0.2)] hover:shadow-[0_0_40px_rgba(34,200,255,0.35)] transition-shadow duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-accent-cyan" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-accent-cyan" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full border border-accent-cyan/30 animate-ping opacity-30" style={{ animationDuration: "3s" }} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(500px,calc(100vh-8rem))] glass-strong rounded-2xl glow-border flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text-primary">
                  Ask about Manish
                </h4>
                <p className="text-[10px] text-status-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green inline-block" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-md glass flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-accent-cyan" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-cyan/15 text-text-primary border border-accent-cyan/20 rounded-br-sm"
                        : "glass border border-white/5 text-text-secondary rounded-bl-sm"
                    }`}
                  >
                    {msg.loading ? (
                      <div className="flex items-center gap-1 py-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                    ) : msg.role === "bot" ? (
                      <FormattedMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-md bg-accent-cyan/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-accent-cyan" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={sending}
                  maxLength={200}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-dark-navy/60 border border-white/10 text-sm text-text-primary placeholder-text-secondary/50 outline-none focus:border-accent-cyan/50 focus:shadow-[0_0_12px_rgba(34,200,255,0.1)] transition-all duration-300 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-xl glass glow-border flex items-center justify-center text-accent-cyan hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Send message"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import api from "@/lib/api";

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
      const response = await api.post<{ answer: string; confidence: number }>(
        "/chatbot/ask",
        { message: text }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, text: response.data.answer, loading: false }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? {
                ...m,
                text: "Sorry, I couldn't process that — please try again.",
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
                      </div>
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

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { apiFetch } from '@/lib/api-client';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
};

interface ChatSessionResponse {
  sessionId: string;
  messages: ChatMessage[];
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || sessionId) return;
    void startSession();
  }, [open, sessionId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const startSession = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<ChatSessionResponse>('/chat/start', { method: 'POST' });
      setSessionId(result.sessionId);
      setMessages(result.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || !sessionId) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    try {
      const { messages: updated } = await apiFetch<ChatSessionResponse>('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ sessionId, message: userMessage.content }),
      });
      setMessages(updated);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white">
              <div>
                <p className="font-semibold">HypeEmUp Concierge</p>
                <p className="text-xs text-white/60">Ask about orders, shipping, or products</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 p-1 text-white/70"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div ref={viewportRef} className="flex-1 space-y-2 overflow-y-auto bg-black/40 p-4 text-sm text-white/80">
              {loading ? <p>Connecting to assistant...</p> : null}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 ${
                    message.role === 'user'
                      ? 'ml-auto bg-brand-orange/80 text-black'
                      : message.role === 'agent'
                        ? 'bg-emerald-500/20 text-emerald-100'
                        : 'bg-white/10'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="border-t border-white/10 bg-black/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about your order..."
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand-orange p-2 text-black transition hover:bg-white"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-black shadow-lg"
      >
        <MessageCircle className="h-4 w-4" />
        {open ? 'Close chat' : 'Need help?'}
      </button>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, Flag, X, Loader2 } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string };
type TooltipData = { word: string; x: number; y: number } | null;

export default function Salon() {
  const [theme, setTheme] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startSession = async () => {
    if (!theme.trim()) return;
    setIsStarted(true);
    setIsLoading(true);

    // Initial fetch to start conversation based on theme
    try {
      const res = await fetch("/api/salon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, messages: [] }),
      });
      const data = await res.json();
      setMessages([{ id: Date.now().toString(), role: "assistant", content: data.content }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/salon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { id: Date.now().toString(), role: "assistant", content: data.content }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      word: word.replace(/[.,?!;:()'"]/g, ""),
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Click outside to close tooltip
  useEffect(() => {
    const closeTooltip = () => setTooltip(null);
    window.addEventListener("click", closeTooltip);
    return () => window.removeEventListener("click", closeTooltip);
  }, []);

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-lg mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-blue-400">Le Salon</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Enter a scenario to practice. Your AI tutor will guide you through a custom conversation.</p>

        <div className="w-full bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
          <label className="block text-left text-sm font-medium mb-2">What do you want to practice?</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Ordering a croissant in Paris"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-electric-blue mb-4"
            onKeyDown={(e) => e.key === 'Enter' && startSession()}
          />
          <button
            onClick={startSession}
            disabled={!theme.trim()}
            className="w-full py-3 bg-electric-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Tutor
          </h2>
          <p className="text-xs text-gray-500 capitalize line-clamp-1">{theme}</p>
        </div>
        <button onClick={() => {setIsStarted(false); setMessages([])}} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-electric-blue text-white rounded-tr-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"}`}>
                {msg.role === "assistant" && (
                  <button onClick={() => speakText(msg.content)} className="mb-2 text-gray-400 hover:text-electric-blue transition-colors">
                    <Volume2 size={16} />
                  </button>
                )}
                <div className="leading-relaxed">
                  {msg.role === "assistant" ? (
                    msg.content.split(" ").map((word, i) => (
                      <span
                        key={i}
                        onClick={(e) => handleWordClick(e, word)}
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded px-0.5 transition-colors"
                      >
                        {word}{" "}
                      </span>
                    ))
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className="fixed -translate-x-1/2 -translate-y-full z-50 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 border border-gray-100 dark:border-gray-700 min-w-[150px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold mb-1 text-lg">{tooltip.word}</div>
            <div className="text-sm text-gray-500 mb-3 italic">Loading definition...</div>
            <button className="w-full py-1.5 bg-soft-sky-blue text-electric-blue dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <Flag size={14} /> Flag Word
            </button>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-r border-b border-gray-100 dark:border-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 relative">
          <button
            className="p-3 text-gray-400 hover:text-electric-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
            title="Use microphone (Web Speech API)"
            onClick={() => {
              // Basic placeholder for Web Speech API logic
              if ('webkitSpeechRecognition' in window) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const recognition = new (window as any).webkitSpeechRecognition();
                recognition.lang = 'fr-FR';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recognition.onresult = (event: any) => {
                  setInput(event.results[0][0].transcript);
                };
                recognition.start();
              } else {
                alert("Speech recognition is not supported in this browser.");
              }
            }}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your reply in French..."
            className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-electric-blue text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

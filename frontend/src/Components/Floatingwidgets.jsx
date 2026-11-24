import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RotateCcw, PhoneCall } from 'lucide-react';
import { sendChatMessage } from '../api';
import './Floatingwidgets.css';

const WHATSAPP_NUMBER = '919043133663';
const DEFAULT_WA_TEXT = 'Hi Cognisphere MC, I would like to book my seat and know about HSE courses.';

const quickPrompts = [
  'Next NEBOSH IGC batch?',
  'Courses & Online mode?',
  'NEBOSH Exam dates 2026?',
  'Job placement support?',
];

const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text: "Hi! I'm **Cognisphere AI** 👋\nAsk me anything about **NEBOSH IGC/HSW, IOSH, OSHA, Live Batches, Exam Dates, or Job Placements** — even in casual words!",
    showWhatsapp: false,
  },
];

// Clean Mini-Markdown Formatter (**bold** + line breaks)
function FormatBotText({ text }) {
  return (
    <div className="space-y-1.5 leading-relaxed">
      {String(text).split('\n').map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className={line.trim() === '' ? 'h-1' : ''}>
            {parts.map((part, idx) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={idx} className="font-bold text-[#211859]">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={idx}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WA_TEXT)}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [chatOpen]);

  const handleSend = async (customText) => {
    const userText = (typeof customText === 'string' ? customText : input).trim();
    if (!userText || thinking) return;

    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    const updatedHistory = [...messages, userMsg];
    const userTurnCount = updatedHistory.filter((m) => m.sender === 'user').length;

    setMessages(updatedHistory);
    setInput('');
    setThinking(true);

    try {
      const res = await sendChatMessage({
        message: userText,
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        turn_count: userTurnCount,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data?.reply || 'Please reach out to our team on WhatsApp (+91 90431 33663).',
          showWhatsapp: Boolean(res.data?.show_whatsapp),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Our admissions team can assist you right away on WhatsApp **+91 90431 33663**!',
          showWhatsapp: true,
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">

      {/* ================= REAL-WORLD AI CHATBOT WINDOW ================= */}
      {chatOpen && (
        <div className="ai-chat-window w-[calc(100vw-32px)] sm:w-[395px] h-[510px] max-h-[78vh] rounded-3xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="ai-chat-header px-4 py-3.5 text-white flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#211859] rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Cognisphere AI</h3>
                <p className="text-[10.5px] text-purple-200">HSE Course &amp; Career Advisor • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg hover:bg-white/15 text-purple-100 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close Chat"
                className="p-1.5 rounded-lg hover:bg-white/15 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f8f7fc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-[#211859] to-[#a62675] text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-[#e6e0f3] rounded-bl-sm'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    <FormatBotText text={msg.text} />
                  )}
                </div>

                {/* Smart Office WhatsApp Handoff Card inside Chat */}
                {msg.sender === 'bot' && msg.showWhatsapp && (
                  <div className="mt-2 max-w-[86%] bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-2 shadow-sm">
                    <p className="text-[11px] font-bold text-emerald-800">
                      Need exact fees, discounts, or 1-to-1 counselling?
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        'Hi Cognisphere Office, I chatted with Cognisphere AI and would like course & admission details.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25d366] hover:bg-[#1ebe5d] text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Office (+91 90431 33663)</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Starter Prompt Chips (Only on 1st screen) */}
            {messages.length === 1 && !thinking && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#f3effa] border border-[#dcd3ef] hover:border-[#a62675] text-[11px] font-semibold text-[#211859] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Thinking Dots Indicator */}
            {thinking && (
              <div className="flex items-start">
                <div className="bg-white border border-[#e6e0f3] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-[#ece7f6] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about NEBOSH, batches, jobs..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm text-[#211859] focus:outline-none focus:border-[#a62675]"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              aria-label="Send Message"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#211859] to-[#a62675] text-white flex items-center justify-center shadow-md hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-45 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* ================= FLOATING STACK (WHATSAPP + AI CHATBOT ICON) ================= */}
      {!chatOpen && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative flex items-center"
        >
          <span className="float-label-pill hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-xl bg-white text-[#211859] text-xs font-bold shadow-lg border border-[#e3dbf3] whitespace-nowrap">
            Book your Seat on WhatsApp
          </span>

          <div className="float-wa-btn relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center">
            <span className="float-wa-pulse" aria-hidden="true" />
            <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10" aria-hidden="true">
              <path d="M16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.1 29l6.78-1.78a12.75 12.75 0 0 0 6.13 1.56h.01c7.06 0 12.79-5.73 12.79-12.8 0-3.42-1.33-6.64-3.75-9.05A12.72 12.72 0 0 0 16.01 3.2zm7.46 18.17c-.31.88-1.82 1.68-2.52 1.78-.65.1-1.47.14-2.37-.15-.55-.18-1.26-.41-2.16-.8-3.8-1.64-6.28-5.48-6.47-5.73-.19-.26-1.55-2.06-1.55-3.93 0-1.87.98-2.79 1.33-3.17.35-.38.76-.48 1.01-.48.25 0 .51 0 .73.01.24.01.55-.09.86.66.31.76 1.07 2.62 1.17 2.81.09.19.16.41.03.67-.13.26-.19.42-.38.64-.19.22-.4.5-.57.67-.19.19-.39.4-.17.78.22.38.98 1.62 2.11 2.62 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.25.95-1.11 1.2-1.49.26-.38.51-.32.86-.19.35.13 2.24 1.06 2.62 1.25.38.19.64.28.73.44.1.16.1.91-.21 1.79z" />
            </svg>
          </div>
        </a>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((prev) => !prev)}
        aria-label="Cognisphere AI Assistant"
        className="group relative flex items-center cursor-pointer"
      >
        <span className="float-label-pill hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-xl bg-[#211859] text-white text-xs font-semibold shadow-lg whitespace-nowrap">
          {chatOpen ? 'Close AI Chat' : 'Ask Cognisphere AI'}
        </span>

        <div className="float-bot-btn relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white">
          {chatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 sm:w-7 sm:h-7" />}
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
        </div>
      </button>

    </div>
  );
}
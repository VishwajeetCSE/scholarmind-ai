import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function ThinkingIndicator() {
  return (
    <div className="flex justify-start mb-5 px-1">
      <div className="flex gap-3 max-w-[85%]">
        {/* Tutor Avatar with pulsing glow */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/30 flex-shrink-0 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-xs">
            🎓
          </div>
        </div>

        {/* Shimmering Thought Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-indigo-500/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Gemma is reasoning
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
      <div className="max-w-3xl mx-auto w-full">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;

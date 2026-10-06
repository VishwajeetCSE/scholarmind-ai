import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import chatBg from '../assets/chat-bg.png';

function ThinkingIndicator() {
  return (
    <div className="flex justify-start mb-5">
      <div className="flex gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-sm flex-shrink-0 animate-pulse">
          🎓
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white/70 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-800">
            Gemma AI is reasoning
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
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
    <div
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-[url('/src/assets/chat-bg.png')] bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${chatBg})` }}
    >
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

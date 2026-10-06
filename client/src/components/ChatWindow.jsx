import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                        flex items-center justify-center text-sm text-white flex-shrink-0">
          🎓
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-500 mr-1">Thinking</span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full loading-dot"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full loading-dot"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full loading-dot"></span>
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
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;

function Header({ onNewChat, hasMessages, activeTab }) {
  return (
    <header className="sticky top-0 z-30 flex-shrink-0">
      {/* 1. Soft Pink/Magenta Notice Banner Sticky at Top */}
      <div className="bg-pink-500 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center tracking-wide shadow-sm flex items-center justify-center gap-2">
        <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          Live
        </span>
        <span>⚡ Gemma 3 Study Arena • Hacktoberfest Edition</span>
      </div>

      {/* 2. Clean White Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            ScholarMind
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              Virtual Arena
            </span>
          </h1>
        </div>

        {/* Right side primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewChat}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-xs md:text-sm rounded-full px-5 md:px-6 py-2 md:py-2.5 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Start Battle / Chat</span>
          </button>

          <a
            href="https://github.com/VishwajeetCSE/scholarmind-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;

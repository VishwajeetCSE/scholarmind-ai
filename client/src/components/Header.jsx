function Header({ onNewChat, hasMessages }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Study Buddy
          </h1>
        </div>
        {hasMessages && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 
                       bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

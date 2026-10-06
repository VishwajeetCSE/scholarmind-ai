function Header({ onToggleSidebar, onNewChat, hasMessages, currentTopic }) {
  return (
    <header className="sticky top-0 z-20 bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.08] px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors md:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl md:hidden">🎓</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs md:text-sm text-white tracking-tight truncate">
                  AI Study Buddy
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemma Engine Active
                </span>
              </div>
              {currentTopic && (
                <p className="text-[11px] text-slate-400 truncate max-w-xs md:max-w-md hidden sm:block">
                  Topic: <span className="text-indigo-300 font-medium">{currentTopic}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 
                         bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] 
                         rounded-xl transition-all duration-200 cursor-pointer hover:border-indigo-400/40"
            >
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </button>
          )}

          <a
            href="https://github.com/VishwajeetCSE/scholarmind-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            title="View on GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;

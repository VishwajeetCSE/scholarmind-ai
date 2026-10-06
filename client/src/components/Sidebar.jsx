import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'chat', label: 'Study Assistant', icon: '💬', badge: 'Active' },
  { id: 'explain', label: 'Concept Explainer', icon: '💡' },
  { id: 'exam', label: 'Exam Prep Hub', icon: '📝' },
  { id: 'quiz', label: 'Quiz Arena', icon: '🧠' },
  { id: 'example', label: 'Code & Examples', icon: '💻' },
];

function Sidebar({ isOpen, setIsOpen, onNewChat, recentTopics, onSelectTopic, currentTopic, onStudyMode }) {
  const [activeNav, setActiveNav] = useState('chat');

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id !== 'chat') {
      onStudyMode(id);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-slate-950/80 backdrop-blur-2xl 
                   border-r border-white/[0.08] transition-all duration-300 ease-in-out
                   ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-lg">
                🎓
              </div>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 truncate">
                  ScholarMind
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 truncate">Gemma Study Buddy</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer hidden md:flex"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              setActiveNav('chat');
            }}
            className={`w-full group relative flex items-center justify-center gap-2 p-[1px] rounded-xl overflow-hidden
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300
                       hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] cursor-pointer`}
          >
            <div className="w-full h-full bg-slate-900/90 group-hover:bg-slate-900/70 rounded-[11px] px-3 py-2.5 flex items-center justify-center gap-2 transition-colors">
              <svg className="w-4 h-4 text-indigo-400 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {isOpen && <span className="text-xs font-semibold text-white tracking-wide">New Session</span>}
            </div>
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer
                           ${isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                title={item.label}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {isOpen && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {isOpen && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Recent Session Topics */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-2 mt-2 border-t border-white/[0.04]">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Recent Topics
            </p>
            {recentTopics && recentTopics.length > 0 ? (
              <div className="space-y-1">
                {recentTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectTopic(topic)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-colors cursor-pointer
                               ${currentTopic === topic
                        ? 'bg-white/[0.08] text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                      }`}
                  >
                    💬 {topic}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-600 px-3 italic">
                Ask a question to begin...
              </p>
            )}
          </div>
        )}

        <div className="flex-1 md:hidden" />

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t border-white/[0.06] bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                🎓
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>

            {isOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">Student Scholar</p>
                <p className="text-[10px] text-indigo-400 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Hacktoberfest 2026
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

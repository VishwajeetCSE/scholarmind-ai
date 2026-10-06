function Sidebar({ activeTab, setActiveTab, onNewChat, simulationUser }) {
  const NAV_ITEMS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'Chat Arena',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-20 md:w-24 bg-white border-r border-gray-200 flex flex-col items-center py-6 select-none z-30 flex-shrink-0">
      {/* Brand Icon / Logo */}
      <button
        onClick={() => {
          setActiveTab('overview');
          onNewChat();
        }}
        className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold shadow-md hover:scale-105 transition-transform mb-8 cursor-pointer"
        title="ScholarMind Study Buddy"
      >
        🎓
      </button>

      {/* Stacked Vertical Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-6 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex flex-col items-center justify-center w-full py-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-slate-950 font-semibold'
                  : 'text-gray-400 hover:text-slate-700'
              }`}
            >
              {/* Active Bright Accent Dot Indicator */}
              {isActive && (
                <span className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
              )}

              {/* Minimal Linear Icon */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'group-hover:bg-gray-100 text-gray-500'
                }`}
              >
                {item.icon}
              </div>

              {/* Short Label Underneath */}
              <span className="text-[11px] mt-1 text-center tracking-tight leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile at Bottom Corner */}
      <div
        className="flex flex-col items-center gap-1 pt-4 border-t border-gray-100 w-full"
        title={`${simulationUser?.username || 'test_warrior'} (${simulationUser?.role || 'Beta Tester'})`}
      >
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
          TW
        </div>
        <span className="text-[10px] text-slate-800 font-semibold truncate max-w-[70px]">
          {simulationUser?.username || 'test_warrior'}
        </span>
        <span className="text-[9px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
          {simulationUser?.role || 'Beta Tester'}
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;

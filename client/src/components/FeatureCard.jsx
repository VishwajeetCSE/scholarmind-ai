function FeatureCard({ emoji, title, description, badge }) {
  return (
    <div className="group relative p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.07] 
                    hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300
                    hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(99,102,241,0.12)] cursor-default">
      {/* Top row: Emoji & optional badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 
                        border border-white/[0.08] flex items-center justify-center text-xl group-hover:scale-110 
                        transition-transform duration-300 shadow-inner">
          {emoji}
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {badge}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-sm text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;

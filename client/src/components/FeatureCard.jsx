function FeatureCard({ emoji, title, description }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 
                    hover:shadow-md transition-all duration-200">
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default FeatureCard;

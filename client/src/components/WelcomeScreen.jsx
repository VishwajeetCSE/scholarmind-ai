import FeatureCard from './FeatureCard';

const EXAMPLE_PROMPTS = [
  {
    text: "Explain inheritance in Java like I'm a beginner.",
    tag: "Java / OOP",
    icon: "☕",
  },
  {
    text: "What is supervised learning?",
    tag: "Machine Learning",
    icon: "🤖",
  },
  {
    text: "Explain Master-Detail relationship in Salesforce.",
    tag: "Salesforce",
    icon: "☁️",
  },
  {
    text: "Explain Agile methodology in simple language.",
    tag: "Software Engineering",
    icon: "⚡",
  },
  {
    text: "Give me 3 MCQs about machine learning.",
    tag: "Quiz Practice",
    icon: "🎯",
  },
];

const FEATURES = [
  {
    emoji: '💡',
    title: 'Explain Simply',
    description: 'Complex technical concepts broken down into beginner-friendly analogies.',
    badge: 'Beginner Friendly',
  },
  {
    emoji: '📝',
    title: 'Exam-Ready Answers',
    description: 'Structured answers complete with definitions, points, examples, and trade-offs.',
    badge: 'Exam Mode',
  },
  {
    emoji: '🧠',
    title: 'Interactive Quizzes',
    description: 'Test your understanding with topic-based MCQs before exams.',
    badge: 'Self-Test',
  },
  {
    emoji: '💻',
    title: 'Code & Diagrams',
    description: 'Practical code snippets and visual markdown tables for hands-on learning.',
    badge: 'Developer',
  },
];

function WelcomeScreen({ onSendMessage }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Powered by Gemma & Google Gemini AI
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Ask anything.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Learn simply.
          </span>{' '}
          Study smarter.
        </h2>

        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          Your personal 24/7 AI tutor for understanding difficult computer science concepts, preparing structured exam answers, and practicing quizzes.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      {/* Example Prompt Starters */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span> Recommended Study Prompts
          </p>
          <span className="text-[11px] text-slate-500">Click to start instant session</span>
        </div>

        <div className="flex flex-col gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => onSendMessage(prompt.text)}
              className="group text-left px-4 py-3 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/[0.06]
                         hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-200
                         hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)] cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg flex-shrink-0">{prompt.icon}</span>
                <span className="text-xs md:text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                  {prompt.text}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.04] hidden sm:inline">
                  {prompt.tag}
                </span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-200 text-sm">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

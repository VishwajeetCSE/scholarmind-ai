import FeatureCard from './FeatureCard';

const EXAMPLE_PROMPTS = [
  'Explain inheritance in Java like I\'m a beginner.',
  'What is supervised learning?',
  'Explain Master-Detail relationship in Salesforce.',
  'Explain Agile methodology in simple language.',
  'Give me 3 MCQs about machine learning.',
];

const FEATURES = [
  {
    emoji: '💡',
    title: 'Simple Explanations',
    description: 'Complex topics broken down into easy-to-understand language.',
  },
  {
    emoji: '📝',
    title: 'Exam Answers',
    description: 'Get structured, exam-ready answers with key points and examples.',
  },
  {
    emoji: '🧠',
    title: 'Quiz Mode',
    description: 'Test yourself with MCQs generated from any topic.',
  },
  {
    emoji: '💻',
    title: 'Code Examples',
    description: 'Practical programming examples for hands-on learning.',
  },
];

function WelcomeScreen({ onSendMessage }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎓</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome to AI Study Buddy
        </h2>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Ask anything. Learn simply. Study smarter.
        </p>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Your personal AI learning companion for understanding difficult concepts,
          preparing for exams, and practicing what you learn.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      {/* Example Prompts */}
      <div className="max-w-xl mx-auto">
        <p className="text-sm text-slate-400 text-center mb-3">Try asking:</p>
        <div className="flex flex-col gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              className="text-left px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm
                         text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 
                         transition-all duration-200 cursor-pointer"
            >
              <span className="text-indigo-500 mr-2">→</span>
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

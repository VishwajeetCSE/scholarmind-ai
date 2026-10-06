import { useState } from 'react';

const FAQ_QUESTIONS = [
  {
    id: 1,
    category: 'Object-Oriented Programming',
    question: "Explain inheritance in Java like I'm a beginner.",
    preview: 'Understand parent-child classes, code reuse, and the extends keyword with real-world car/vehicle analogies.',
  },
  {
    id: 2,
    category: 'Machine Learning & AI',
    question: 'What is supervised learning?',
    preview: 'Learn how models train on labeled data (input-output pairs) like a student studying with an answer key.',
  },
  {
    id: 3,
    category: 'Cloud & Salesforce',
    question: 'Explain Master-Detail relationship in Salesforce.',
    preview: 'Tightly coupled parent-child object relationship with cascade delete and roll-up summary fields.',
  },
  {
    id: 4,
    category: 'Software Engineering',
    question: 'Explain Agile methodology in simple language.',
    preview: 'Iterative software development approach delivering working software in short 2-week sprints with constant feedback.',
  },
  {
    id: 5,
    category: 'Self-Testing & Exam Prep',
    question: 'Give me 3 MCQs about machine learning.',
    preview: 'Generate interactive multiple-choice questions with 4 options to test your conceptual clarity.',
  },
];

const STAT_CARDS = [
  {
    title: 'Gemma 3.x AI Engine',
    desc: 'Google open weights model trained for precision technical explanations',
    tag: 'Trained Model',
    icon: '⚡',
  },
  {
    title: 'Exam-Ready Structure',
    desc: 'Structured answers with definitions, key points, code, and trade-offs',
    tag: 'Exam Mode',
    icon: '📝',
  },
  {
    title: 'Multimodal Vision',
    desc: 'Upload diagrams, textbook pages, and notes for instant clarification',
    tag: 'Vision AI',
    icon: '📷',
  },
];

function WelcomeScreen({ onSendMessage }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:py-12 bg-gray-50/70">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            PromptWars: Virtual Study Edition
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Level up your study game with <span className="text-blue-600">Gemma AI</span>.
          </h2>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
            The intelligent study arena built for CSE students. Ask tricky questions, get simplified analogies, generate structured exam notes, and battle test with instant quizzes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSendMessage("Explain polymorphism in Java like I'm a beginner.")}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
            >
              Start Instant Battle →
            </button>
            <span className="text-xs text-slate-400 font-medium">Free • No sign up required</span>
          </div>
        </div>

        {/* Feature Cards Grid (PromptWars Crisp White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {card.tag}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordions Section (Clean Full-Width White Rows separated by thin borders) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Battle Topics & FAQ</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any topic row to view details or launch directly into the AI tutor arena.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">5 Questions Ready</span>
          </div>

          {/* Full-width white accordion container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200 overflow-hidden">
            {FAQ_QUESTIONS.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div key={faq.id} className="transition-colors hover:bg-gray-50/60">
                  {/* Row Header */}
                  <div
                    onClick={() => toggleAccordion(faq.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        {faq.category}
                      </span>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 truncate">
                        {faq.question}
                      </h4>
                    </div>

                    {/* Dark circular chevron dropdown arrow icon centered on the right side */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendMessage(faq.question);
                        }}
                        className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Ask Buddy
                      </button>

                      <div
                        className={`w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 bg-blue-600' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 bg-gray-50/50 text-xs md:text-sm text-slate-600 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="leading-relaxed">{faq.preview}</p>
                      <button
                        onClick={() => onSendMessage(faq.question)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-full px-5 py-2 shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
                      >
                        Launch Question →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

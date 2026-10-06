import { useState, useRef } from 'react';

const STUDY_MODES = [
  {
    key: 'explain',
    label: 'Explain Simply',
    icon: '💡',
    glow: 'hover:border-amber-500/40 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  },
  {
    key: 'exam',
    label: 'Exam Answer',
    icon: '📝',
    glow: 'hover:border-emerald-500/40 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
  {
    key: 'quiz',
    label: 'Quiz Me',
    icon: '🧠',
    glow: 'hover:border-purple-500/40 hover:text-purple-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]',
  },
  {
    key: 'example',
    label: 'Give Example',
    icon: '💻',
    glow: 'hover:border-cyan-500/40 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
  },
];

function ChatInput({ onSend, onStudyMode, isLoading, hasMessages, currentTopic }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLoading) return;
    if (!text.trim() && !imageFile) return;

    onSend(text, imageFile);
    setText('');
    clearImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStudyMode = (modeKey) => {
    const topicToUse = text.trim() || currentTopic;
    if (topicToUse) {
      onStudyMode(modeKey, topicToUse);
      setText('');
      clearImage();
    }
  };

  const showModes = hasMessages || currentTopic || text.trim().length > 0;

  return (
    <div className="sticky bottom-0 z-20 px-4 pb-4 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
      <div className="max-w-3xl mx-auto w-full">
        {/* Quick Action Helpers (Pill buttons with elevation hover) */}
        {showModes && (
          <div className="flex flex-wrap items-center gap-2 mb-2.5 px-1 animate-fadeIn">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline mr-1">
              Study Modes:
            </span>
            {STUDY_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => handleStudyMode(mode.key)}
                disabled={isLoading || (!currentTopic && !text.trim())}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
                           bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] text-slate-300
                           transition-all duration-200 hover:-translate-y-0.5 cursor-pointer 
                           disabled:opacity-40 disabled:cursor-not-allowed ${mode.glow}`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Attached Image Preview Chip */}
        {imagePreview && (
          <div className="mb-2 relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 shadow-lg">
            <img src={imagePreview} alt="Upload preview" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xs text-slate-300 truncate max-w-xs">{imageFile?.name || 'Image attached'}</span>
            <button
              onClick={clearImage}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Integrated Floating Pill Input Box */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-2xl
                     border border-white/[0.1] focus-within:border-indigo-500/50 
                     focus-within:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300 shadow-2xl"
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Floating Image Upload Action */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06] rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40"
            title="Upload notes, diagrams or assignment questions"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentTopic
                ? `Ask follow-up or try "Quiz Me" on ${currentTopic}...`
                : 'Ask any study question or concept (e.g. "Explain recursion")...'
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-xs md:text-sm text-white placeholder-slate-500
                       focus:outline-none max-h-36 overflow-y-auto leading-relaxed"
            style={{ height: '40px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
            }}
          />

          {/* Floating Neon Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !imageFile)}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 
                       text-white transition-all duration-200 cursor-pointer
                       hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95
                       disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0"
            title="Send query"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        {/* Subtle Keyboard & Hackathon Footer Hint */}
        <div className="flex items-center justify-between px-2 mt-1.5 text-[11px] text-slate-500">
          <span>Shift + Enter for new line • Enter to send</span>
          <span className="hidden sm:inline">Hacktoberfest Bhopal • Gemma Track</span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;

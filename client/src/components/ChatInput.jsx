import { useState, useRef } from 'react';

const STUDY_MODES = [
  { key: 'explain', label: 'Explain Simply', icon: '💡' },
  { key: 'exam', label: 'Exam Answer', icon: '📝' },
  { key: 'quiz', label: 'Quiz Me', icon: '🧠' },
  { key: 'example', label: 'Give Example', icon: '💻' },
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
      textareaRef.current.style.height = '42px';
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
    <div className="sticky bottom-0 z-20 px-4 md:px-6 pb-5 pt-3 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent">
      <div className="max-w-3xl mx-auto w-full">
        {/* Quick Action Helpers (Interactive Pills that elevate slightly on hover) */}
        {showModes && (
          <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
              Modes:
            </span>
            {STUDY_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => handleStudyMode(mode.key)}
                disabled={isLoading || (!currentTopic && !text.trim())}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                           bg-white border border-gray-200 text-slate-700 shadow-sm
                           hover:border-blue-500 hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-md
                           transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Image Attachment Preview */}
        {imagePreview && (
          <div className="mb-2 relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <img src={imagePreview} alt="Upload preview" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs text-slate-700 font-medium truncate max-w-xs">{imageFile?.name || 'Image'}</span>
            <button
              onClick={clearImage}
              className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Integrated Sticky Rounded Pill Container */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-300 
                     shadow-sm hover:shadow-md focus-within:border-blue-600 focus-within:ring-4 
                     focus-within:ring-blue-100 transition-all duration-200"
        >
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Floating Upload Icon Inside Pill */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer disabled:opacity-40"
            title="Upload image / diagram"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentTopic
                ? `Ask follow-up on "${currentTopic}" or select a mode...`
                : 'Ask your study question or paste code here...'
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-xs md:text-sm text-slate-900 placeholder-gray-400 focus:outline-none max-h-32 overflow-y-auto leading-relaxed"
            style={{ height: '36px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />

          {/* Royal Blue Primary Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !imageFile)}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            title="Send query"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-2">
          Press <span className="font-semibold text-slate-600">Enter</span> to send, <span className="font-semibold text-slate-600">Shift + Enter</span> for new line
        </p>
      </div>
    </div>
  );
}

export default ChatInput;

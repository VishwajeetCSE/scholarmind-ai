import { useState, useRef } from 'react';

const STUDY_MODES = [
  { key: 'explain', label: '💡 Explain Simply', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { key: 'exam', label: '📝 Exam Answer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { key: 'quiz', label: '🧠 Quiz Me', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { key: 'example', label: '💻 Give Example', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
];

function ChatInput({ onSend, onStudyMode, isLoading, hasMessages, currentTopic }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!text.trim() && !imageFile) return;

    onSend(text, imageFile);
    setText('');
    clearImage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-md px-4 py-3">
      {/* Study Mode Buttons */}
      {showModes && (
        <div className="flex flex-wrap gap-2 mb-3">
          {STUDY_MODES.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => handleStudyMode(mode.key)}
              disabled={isLoading || (!currentTopic && !text.trim())}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors
                         cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${mode.color}`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img src={imagePreview} alt="Upload preview" className="h-20 rounded-lg border border-slate-200" />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full 
                       text-xs flex items-center justify-center hover:bg-red-600 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 
                     rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          title="Upload an image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your study question..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                     disabled:bg-slate-50 disabled:text-slate-400 placeholder-slate-400
                     max-h-32 overflow-y-auto"
          style={{ minHeight: '42px' }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={isLoading || (!text.trim() && !imageFile)}
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 
                     transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;

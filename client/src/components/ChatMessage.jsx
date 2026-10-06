import { useState } from 'react';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      <div className={`flex gap-3 max-w-[94%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
              YOU
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-sm">
              🎓
            </div>
          )}
        </div>

        {/* Message Container */}
        <div className="min-w-0 flex-1">
          {/* AI Header with Badge and Copy */}
          {!isUser && !message.isError && (
            <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 tracking-tight">PromptWars AI Tutor</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  Gemma 3
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="text-[11px] text-gray-500 hover:text-slate-900 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Crisp White Card for AI / Royal Blue Bubble for User */}
          <div
            className={`p-4 md:p-5 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                : message.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-sm shadow-sm'
                  : 'bg-white border border-gray-200/80 shadow-sm text-slate-800 rounded-tl-sm'
            }`}
          >
            {/* Attached Image Preview */}
            {message.image && (
              <div className="mb-3 overflow-hidden rounded-xl border border-gray-200 max-w-sm">
                <img
                  src={message.image}
                  alt="Uploaded study question"
                  className="w-full object-cover max-h-60"
                />
              </div>
            )}

            {isUser ? (
              <p className="whitespace-pre-wrap font-medium">{message.text}</p>
            ) : (
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
              />
            )}
          </div>

          {/* Timestamp */}
          <p className={`text-[10px] text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Markdown converter for clean light theme.
 */
function formatMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Escape HTML entities
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang ? `<span class="text-[10px] font-mono uppercase text-gray-400 font-bold">${lang}</span>` : '';
    return `
      <div class="my-3 rounded-xl overflow-hidden border border-gray-800 bg-slate-900 shadow-sm">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-950 border-b border-gray-800">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          ${langLabel}
        </div>
        <pre class="m-0 p-3.5 overflow-x-auto text-xs font-mono text-cyan-200"><code>${code.trim()}</code></pre>
      </div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono border border-blue-100">$1</code>');

  // Tables
  html = html.replace(
    /(?:^|\n)((?:\|.*\|[ \t]*\n)+)/g,
    (match, tableBlock) => {
      const rows = tableBlock.trim().split('\n');
      let tableHtml = '<div class="overflow-x-auto my-3 rounded-xl border border-gray-200"><table class="w-full text-xs text-left">';
      rows.forEach((row, idx) => {
        if (/^\|[\s\-:|]+\|$/.test(row.trim())) return;
        const cells = row.split('|').filter((c) => c.trim() !== '');
        const tag = idx === 0 ? 'th' : 'td';
        tableHtml += `<tr class="${idx === 0 ? 'bg-gray-50 text-slate-900 font-bold border-b border-gray-200' : 'border-t border-gray-100 hover:bg-gray-50/50'}">`;
        cells.forEach((cell) => {
          tableHtml += `<${tag} class="px-3.5 py-2.5">${cell.trim()}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table></div>';
      return tableHtml;
    }
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm md:text-base font-bold text-slate-900 mt-4 mb-1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base md:text-lg font-extrabold text-slate-900 mt-4 mb-1.5 pb-1 border-b border-gray-100">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-lg md:text-xl font-black text-slate-900 mt-5 mb-2">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-slate-900 font-bold"><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-slate-700">$1</em>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-3 border-blue-600 pl-3 py-1 my-2 text-slate-600 italic bg-blue-50/50 rounded-r-lg">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="my-0.5">$1</li>');
  html = html.replace(/((?:<li class="my-0.5">.*<\/li>\n?)+)/g, '<ul class="list-disc pl-5 my-2 space-y-1 text-slate-700">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="my-0.5">$1</li>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = html.replace(/\n/g, '<br/>');

  if (!html.startsWith('<')) {
    html = `<p class="mb-2">${html}</p>`;
  }

  return html;
}

export default ChatMessage;

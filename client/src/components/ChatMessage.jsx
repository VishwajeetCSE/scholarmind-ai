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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5 px-1`}>
      <div className={`flex gap-3 max-w-[92%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shadow-md shadow-indigo-500/20">
              👤
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-xs">
                🎓
              </div>
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className="min-w-0 flex-1">
          {/* AI Header with Badge and Copy */}
          {!isUser && !message.isError && (
            <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white tracking-wide">ScholarMind Tutor</span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                  Gemma 3
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-400 font-medium">Copied</span>
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

          {/* Bubble Card */}
          <div
            className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed transition-all
              ${isUser
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 rounded-tr-sm'
                : message.isError
                  ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 backdrop-blur-xl shadow-lg rounded-tl-sm'
                  : 'bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] text-slate-200 shadow-xl rounded-tl-sm'
              }`}
          >
            {/* Attached Image Preview */}
            {message.image && (
              <div className="mb-3 overflow-hidden rounded-xl border border-white/10 max-w-sm">
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
          <p className={`text-[10px] text-slate-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced markdown-to-HTML converter for technical dark mode.
 */
function formatMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Escape HTML entities
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const languageLabel = lang ? `<div class="text-[10px] uppercase font-mono text-cyan-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">${lang}</div>` : '';
    return `
      <div class="relative my-3 rounded-xl overflow-hidden border border-white/[0.1] bg-[#090d16]">
        <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-white/[0.06]">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block"></span>
          </div>
          ${languageLabel}
        </div>
        <pre class="m-0 p-3.5 overflow-x-auto text-xs font-mono text-cyan-200"><code>${code.trim()}</code></pre>
      </div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-indigo-950/80 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-indigo-500/30">$1</code>');

  // Tables
  html = html.replace(
    /(?:^|\n)((?:\|.*\|[ \t]*\n)+)/g,
    (match, tableBlock) => {
      const rows = tableBlock.trim().split('\n');
      let tableHtml = '<div class="overflow-x-auto my-3 rounded-xl border border-white/[0.08]"><table class="w-full text-xs text-left">';
      rows.forEach((row, idx) => {
        if (/^\|[\s\-:|]+\|$/.test(row.trim())) return;
        const cells = row.split('|').filter((c) => c.trim() !== '');
        const tag = idx === 0 ? 'th' : 'td';
        tableHtml += `<tr class="${idx === 0 ? 'bg-slate-800/80 text-white font-semibold' : 'border-t border-white/[0.04] hover:bg-white/[0.02]'}">`;
        cells.forEach((cell) => {
          tableHtml += `<${tag} class="px-3 py-2">${cell.trim()}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table></div>';
      return tableHtml;
    }
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-indigo-300 mt-4 mb-1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-4 mb-2 pb-1 border-b border-white/[0.06]">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-extrabold text-white mt-5 mb-2">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-white font-semibold"><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-indigo-400 pl-3 py-1 my-2 text-slate-300 italic bg-indigo-500/[0.05] rounded-r-lg">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="my-0.5">$1</li>');
  html = html.replace(/((?:<li class="my-0.5">.*<\/li>\n?)+)/g, '<ul class="list-disc pl-5 my-2 space-y-1 text-slate-300">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="my-0.5">$1</li>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-indigo-400 hover:text-indigo-300 underline">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = html.replace(/\n/g, '<br/>');

  if (!html.startsWith('<')) {
    html = `<p class="mb-2">${html}</p>`;
  }

  return html;
}

export default ChatMessage;

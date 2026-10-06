function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
            ${isUser
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
            }`}
        >
          {isUser ? '👤' : '🎓'}
        </div>

        {/* Message bubble */}
        <div>
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : message.isError
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                  : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-sm'
              }`}
          >
            {/* Show image if attached */}
            {message.image && (
              <img
                src={message.image}
                alt="Uploaded"
                className="max-w-xs rounded-lg mb-2"
              />
            )}

            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
              />
            )}
          </div>
          <p className={`text-xs text-slate-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple markdown-to-HTML converter.
 * Handles: headings, bold, italic, code blocks, inline code, lists, tables, links, blockquotes, line breaks.
 */
function formatMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Escape HTML entities (but keep our own tags)
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Tables
  html = html.replace(
    /(?:^|\n)((?:\|.*\|[ \t]*\n)+)/g,
    (match, tableBlock) => {
      const rows = tableBlock.trim().split('\n');
      let tableHtml = '<table>';
      rows.forEach((row, idx) => {
        // Skip separator row (|---|---|)
        if (/^\|[\s\-:|]+\|$/.test(row.trim())) return;
        const cells = row.split('|').filter((c) => c.trim() !== '');
        const tag = idx === 0 ? 'th' : 'td';
        tableHtml += '<tr>';
        cells.forEach((cell) => {
          tableHtml += `<${tag}>${cell.trim()}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>';
      return tableHtml;
    }
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Line breaks (double newline = paragraph, single = <br>)
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');

  // Wrap in paragraph if not already
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

export default ChatMessage;

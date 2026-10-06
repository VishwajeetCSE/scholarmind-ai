import { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const API_URL = '/api/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [recentTopics, setRecentTopics] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Build history array in Gemini format from messages
  const buildHistory = (msgs) => {
    return msgs.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
  };

  const sendMessage = useCallback(
    async (text, imageFile = null) => {
      if (!text.trim() && !imageFile) return;

      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: text.trim(),
        timestamp: new Date(),
        image: imageFile ? URL.createObjectURL(imageFile) : null,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const topicText = text.trim() || 'Image question';
      setCurrentTopic(topicText);

      // Track recent topics (up to 8, unique)
      setRecentTopics((prev) => {
        const filtered = prev.filter((t) => t.toLowerCase() !== topicText.toLowerCase());
        return [topicText, ...filtered].slice(0, 8);
      });

      try {
        let data;

        if (imageFile) {
          // Multimodal request
          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('message', text.trim() || 'Explain this image.');
          formData.append('history', JSON.stringify(buildHistory([...messages])));

          const res = await fetch(`${API_URL}/image`, {
            method: 'POST',
            body: formData,
          });
          data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to get AI response');
        } else {
          // Text-only request
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text.trim(),
              history: buildHistory([...messages]),
            }),
          });
          data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to get AI response');
        }

        const aiMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errorMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          text: `⚠️ ${err.message || 'Something went wrong while contacting the AI. Please try again.'}`,
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const sendStudyMode = useCallback(
    (mode, customTopic) => {
      const topic = customTopic || currentTopic;
      if (!topic) return;

      const prompts = {
        explain: `Explain "${topic}" in the simplest possible language, as if I'm a complete beginner. Use relatable analogies and clear examples.`,
        exam: `Give me a structured, exam-ready answer for "${topic}". Include: Definition, Core Concepts, Key Points, Real-World Example, Advantages/Disadvantages (if applicable), and Applications. Format it neatly with headings and markdown.`,
        quiz: `Generate 3 high-quality multiple-choice questions (MCQs) about "${topic}". Each question must have 4 options (A, B, C, D). Do NOT reveal the answers or explanations yet — ask me to answer first!`,
        example: `Give me a practical, real-world, or programming code example of "${topic}". Make it clear, modern, and well-explained with comments.`,
      };

      if (prompts[mode]) {
        sendMessage(prompts[mode]);
      }
    },
    [currentTopic, sendMessage]
  );

  const startNewChat = () => {
    setMessages([]);
    setCurrentTopic('');
  };

  const handleSelectRecentTopic = (topic) => {
    sendMessage(topic);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-[#080c14] text-slate-100 overflow-hidden relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onNewChat={startNewChat}
        recentTopics={recentTopics}
        onSelectTopic={handleSelectRecentTopic}
        currentTopic={currentTopic}
        onStudyMode={sendStudyMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={startNewChat}
          hasMessages={hasMessages}
          currentTopic={currentTopic}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          {!hasMessages ? (
            <WelcomeScreen onSendMessage={sendMessage} />
          ) : (
            <ChatWindow messages={messages} isLoading={isLoading} />
          )}

          <ChatInput
            onSend={sendMessage}
            onStudyMode={sendStudyMode}
            isLoading={isLoading}
            hasMessages={hasMessages}
            currentTopic={currentTopic}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

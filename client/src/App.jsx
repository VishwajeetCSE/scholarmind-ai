import { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

import chatBg from './assets/chat-bg.png';

const API_URL = '/api/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [recentTopics, setRecentTopics] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chat' | 'history'

  const buildHistory = (msgs) => {
    return msgs.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
  };

  const sendMessage = useCallback(
    async (text, attachedFile = null) => {
      if (!text?.trim() && !attachedFile) return;

      let filePayload = null;
      let displayFile = null;

      if (attachedFile) {
        if (attachedFile.data) {
          filePayload = {
            data: attachedFile.data,
            mimeType: attachedFile.mimeType,
            name: attachedFile.name,
          };
          displayFile = {
            name: attachedFile.name,
            mimeType: attachedFile.mimeType,
            isImage: attachedFile.isImage,
            previewUrl: attachedFile.previewUrl,
          };
        } else if (attachedFile instanceof File) {
          const isImage = attachedFile.type.startsWith('image/');
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(attachedFile);
          });
          filePayload = {
            data: base64Data,
            mimeType: attachedFile.type,
            name: attachedFile.name,
          };
          displayFile = {
            name: attachedFile.name,
            mimeType: attachedFile.type,
            isImage,
            previewUrl: isImage ? URL.createObjectURL(attachedFile) : null,
          };
        }
      }

      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: text?.trim() || '',
        timestamp: new Date(),
        file: displayFile,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setActiveTab('chat'); // Switch to Chat Arena immediately

      const topicText = text?.trim() || (displayFile ? `Analysis of ${displayFile.name}` : 'Document study');
      setCurrentTopic(topicText);

      setRecentTopics((prev) => {
        const filtered = prev.filter((t) => t.toLowerCase() !== topicText.toLowerCase());
        return [topicText, ...filtered].slice(0, 10);
      });

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text?.trim() || '',
            history: buildHistory([...messages]),
            file: filePayload,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

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
        quiz: `Generate 3 high-quality multiple-choice questions (MCQs) about "${topic}". Each question must have 4 options (A, B, C, D). Do NOT reveal the answers yet — wait for me to answer!`,
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
    setActiveTab('chat');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      {/* 1. PromptWars Persistent Clean White Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewChat={startNewChat}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Soft Pink Notice Banner & Clean White Header */}
        <Header
          onNewChat={startNewChat}
          hasMessages={hasMessages}
          activeTab={activeTab}
        />

        {/* Tab Content Display */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {activeTab === 'overview' && (
            <WelcomeScreen onSendMessage={sendMessage} />
          )}

          {activeTab === 'chat' && (
            <>
              {!hasMessages ? (
                <div
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('/src/assets/chat-bg.png')] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${chatBg})` }}
                >
                  <div className="bg-white/80 backdrop-blur-md border border-white/70 rounded-3xl p-8 shadow-xl max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                      🎓
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">ScholarMind Chat Arena</h3>
                    <p className="text-sm text-slate-600 max-w-sm mb-6">
                      Ask any question, paste an assignment, or click below to launch a sample battle.
                    </p>
                    <button
                      onClick={() => sendMessage("Explain inheritance in Java like I'm a beginner.")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs md:text-sm rounded-full px-6 py-2.5 shadow-md transition-all cursor-pointer"
                    >
                      Try: "Explain inheritance in Java" →
                    </button>
                  </div>
                </div>
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
            </>
          )}

          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/70">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Battle & Study History</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your queries and practice topics during this session.
                  </p>
                </div>

                {recentTopics.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
                    {recentTopics.map((topic, i) => (
                      <div
                        key={i}
                        onClick={() => sendMessage(topic)}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base text-blue-600">💬</span>
                          <span className="text-sm font-semibold text-slate-800">{topic}</span>
                        </div>
                        <button className="text-xs text-blue-600 font-semibold hover:underline">
                          Re-open →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                    <p className="text-sm text-slate-500">No battle history yet.</p>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full px-5 py-2 cursor-pointer"
                    >
                      Browse Topics →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

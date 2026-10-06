import { useState, useCallback } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const API_URL = '/api/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');

  // Build history array in Gemini format from messages
  const buildHistory = (msgs) => {
    return msgs.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
  };

  const sendMessage = useCallback(async (text, imageFile = null) => {
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
    setCurrentTopic(text.trim());

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
  }, [messages]);

  const sendStudyMode = useCallback((mode, customTopic) => {
    const topic = customTopic || currentTopic;
    if (!topic) return;

    const prompts = {
      explain: `Explain "${topic}" in the simplest possible language, as if I'm a complete beginner. Use analogies and examples.`,
      exam: `Give me a complete exam-ready answer for "${topic}". Include: Definition, Explanation, Key Points, Example, Advantages/Disadvantages (if applicable), and Applications (if applicable). Format it neatly.`,
      quiz: `Generate 3 multiple-choice questions (MCQs) about "${topic}". Each question should have 4 options (A, B, C, D). Don't reveal the answers yet — wait for me to answer first.`,
      example: `Give me a practical, real-world, or programming example of "${topic}". Make it clear and easy to understand.`,
    };

    if (prompts[mode]) {
      sendMessage(prompts[mode]);
    }
  }, [currentTopic, sendMessage]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentTopic('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Header onNewChat={startNewChat} hasMessages={hasMessages} />

      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
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
  );
}

export default App;

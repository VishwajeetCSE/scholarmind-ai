const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_INSTRUCTION = `You are "AI Study Buddy", a friendly and knowledgeable AI tutor designed to help students learn.

Your personality:
- Patient, encouraging, and supportive
- You explain concepts as if talking to a curious friend
- You celebrate when a student understands something

Your rules:
1. Explain concepts in simple, clear language. Assume the student may be a beginner.
2. Avoid unnecessary jargon. When you must use a technical term, define it immediately.
3. Use relatable real-world analogies and examples whenever possible.
4. For programming questions, include short, well-commented code examples.
5. For exam-preparation questions, provide structured answers with: Definition → Explanation → Key Points → Example → Advantages/Disadvantages (if applicable).
6. When comparing things, use a markdown table.
7. When explaining a process, use numbered steps.
8. If a question is unclear, ask ONE concise clarifying question.
9. Do not make up information. If you're unsure, say so honestly.
10. Keep answers concise but complete — don't pad with filler.
11. Adapt your explanation depth based on the student's follow-up questions.
12. Use Markdown formatting for readability: headings, bold, lists, code blocks, tables.
13. Always stay on the topic of education and learning. Politely redirect off-topic requests.`;

let genAI = null;
let currentKey = null;
let cachedWorkingModel = null;
let dynamicallyDiscoveredModels = null;

function getApiKey() {
  return (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
}

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your environment variables.');
  }
  if (!genAI || currentKey !== apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    currentKey = apiKey;
    dynamicallyDiscoveredModels = null;
    cachedWorkingModel = null;
  }
  return genAI;
}

/**
 * Dynamically queries Google's REST API to discover which models this API key actually supports.
 */
async function discoverAvailableModels(apiKey) {
  if (dynamicallyDiscoveredModels && dynamicallyDiscoveredModels.length > 0) {
    return dynamicallyDiscoveredModels;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    const data = await res.json();

    if (data.models && Array.isArray(data.models)) {
      const valid = data.models
        .filter(
          (m) =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes('generateContent')
        )
        .map((m) => m.name.replace(/^models\//, ''));

      if (valid.length > 0) {
        // Sort: flash models first, then pro, newest first
        valid.sort((a, b) => {
          const aFlash = a.includes('flash') ? 0 : 1;
          const bFlash = b.includes('flash') ? 0 : 1;
          if (aFlash !== bFlash) return aFlash - bFlash;
          return b.localeCompare(a);
        });

        console.log('[AI Study Buddy] Dynamically discovered models for key:', valid);
        dynamicallyDiscoveredModels = valid;
        return valid;
      }
    } else if (data.error) {
      console.warn('[AI Study Buddy] Google API error during model discovery:', data.error.message);
      if (
        data.error.status === 'INVALID_ARGUMENT' ||
        /key/i.test(data.error.message) ||
        data.error.code === 400
      ) {
        throw new Error(`Google API Key error: ${data.error.message}`);
      }
    }
  } catch (err) {
    console.warn('[AI Study Buddy] Note during model discovery:', err.message);
    if (err.message?.includes('Google API Key error')) {
      throw err;
    }
  }

  return [];
}

/**
 * Returns ordered candidate models: dynamically discovered from Google first, then static fallbacks.
 */
async function getCandidateModels(apiKey) {
  const dynamic = await discoverAvailableModels(apiKey);
  if (dynamic.length > 0) {
    return dynamic;
  }

  // Fallback defaults
  return [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
  ];
}

/**
 * Attempt a chat query with automatic model discovery and fallback.
 */
async function chat(history, userMessage) {
  const client = getClient();
  const apiKey = getApiKey();
  const candidateModels = cachedWorkingModel
    ? [cachedWorkingModel]
    : await getCandidateModels(apiKey);

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Study Buddy] Attempting model: ${modelName}`);

      try {
        const model = client.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const chatSession = model.startChat({ history: history || [] });
        const result = await chatSession.sendMessage(userMessage);
        const reply = result.response.text();
        cachedWorkingModel = modelName;
        console.log(`[AI Study Buddy] Success with model: ${modelName}`);
        return reply;
      } catch (innerErr) {
        if (
          innerErr.message?.includes('systemInstruction') ||
          innerErr.message?.includes('INVALID_ARGUMENT')
        ) {
          const model = client.getGenerativeModel({ model: modelName });
          const augmentedHistory = [
            { role: 'user', parts: [{ text: `[System Instructions]:\n${SYSTEM_INSTRUCTION}` }] },
            { role: 'model', parts: [{ text: 'Understood. I will act as your AI Study Buddy tutor.' }] },
            ...(history || []),
          ];
          const chatSession = model.startChat({ history: augmentedHistory });
          const result = await chatSession.sendMessage(userMessage);
          const reply = result.response.text();
          cachedWorkingModel = modelName;
          console.log(`[AI Study Buddy] Success (fallback mode) with model: ${modelName}`);
          return reply;
        }
        throw innerErr;
      }
    } catch (err) {
      console.warn(`[AI Study Buddy] Model '${modelName}' failed:`, err.message);
      lastError = err;

      if (
        /api[ _-]?key/i.test(err.message) ||
        err.message?.includes('API_KEY_INVALID') ||
        err.message?.includes('RESOURCE_EXHAUSTED')
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error('No available AI model found for this API key.');
}

/**
 * Process multimodal requests (images, PDF, TXT) using Google Gen AI SDK inlineData.
 * @param {Array} history
 * @param {string} userMessage
 * @param {Object} fileData { mimeType: string, data: string (base64), name?: string }
 */
async function chatWithFile(history, userMessage, fileData) {
  const client = getClient();
  const apiKey = getApiKey();
  const candidateModels = cachedWorkingModel
    ? [cachedWorkingModel]
    : await getCandidateModels(apiKey);

  let lastError = null;

  // Clean raw base64 string
  const base64Data = (fileData.data || '').replace(/^data:[^;]+;base64,/, '').trim();
  const mimeType = fileData.mimeType || 'application/pdf';

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Study Buddy] Attempting model for file (${mimeType}): ${modelName}`);
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const chatSession = model.startChat({ history: history || [] });
      const filePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const promptText =
        userMessage && userMessage.trim().length > 0
          ? userMessage.trim()
          : 'Please carefully read, analyze, and explain this study document / image in simple, beginner-friendly terms.';

      const result = await chatSession.sendMessage([promptText, filePart]);
      const reply = result.response.text();
      cachedWorkingModel = modelName;
      console.log(`[AI Study Buddy] File processing success with model: ${modelName}`);
      return reply;
    } catch (err) {
      console.warn(`[AI Study Buddy] Model '${modelName}' failed for file:`, err.message);
      lastError = err;

      if (
        /api[ _-]?key/i.test(err.message) ||
        err.message?.includes('API_KEY_INVALID') ||
        err.message?.includes('RESOURCE_EXHAUSTED')
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error('No available AI model found to process this document/image.');
}

module.exports = {
  chat,
  chatWithFile,
  chatWithImage: chatWithFile,
  discoverAvailableModels,
  getApiKey,
};

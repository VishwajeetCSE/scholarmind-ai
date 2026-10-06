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

function getClient() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your environment variables.');
  }
  if (!genAI || currentKey !== apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    currentKey = apiKey;
  }
  return genAI;
}

/**
 * Returns an ordered list of candidate models to try.
 * If user set a custom valid model, try it first, followed by production Google AI models.
 */
function getCandidateModels() {
  const candidates = [];

  // Check user-configured model (GEMINI_MODEL or GEMMA_MODEL)
  const envModel = (process.env.GEMINI_MODEL || process.env.GEMMA_MODEL || '').trim().replace(/^["']|["']$/g, '');
  if (
    envModel &&
    !envModel.includes('your_') &&
    !envModel.toLowerCase().includes('gemma-3') &&
    !envModel.toLowerCase().includes('gemma-4')
  ) {
    candidates.push(envModel);
  }

  // Stable production models ordered by speed & availability
  const defaults = [
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-2.5-flash',
    'gemini-pro',
  ];

  for (const m of defaults) {
    if (!candidates.includes(m)) {
      candidates.push(m);
    }
  }

  return candidates;
}

/**
 * Attempt a chat query with automatic model fallback.
 */
async function chat(history, userMessage) {
  const client = getClient();
  const candidateModels = cachedWorkingModel
    ? [cachedWorkingModel, ...getCandidateModels().filter((m) => m !== cachedWorkingModel)]
    : getCandidateModels();

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Study Buddy] Attempting model: ${modelName}`);

      let model;
      try {
        model = client.getGenerativeModel({
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
        // If systemInstruction isn't supported on older model variants, retry without it
        if (innerErr.message?.includes('systemInstruction') || innerErr.message?.includes('INVALID_ARGUMENT')) {
          model = client.getGenerativeModel({ model: modelName });
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

      // Fast exit if it's an API key or quota error (switching model won't help)
      if (
        /api[ _-]?key/i.test(err.message) ||
        err.message?.includes('API_KEY_INVALID') ||
        err.message?.includes('RESOURCE_EXHAUSTED')
      ) {
        throw err;
      }
      // Continue to next candidate model
    }
  }

  throw lastError || new Error('No available AI model found.');
}

/**
 * Attempt a multimodal query with automatic model fallback.
 */
async function chatWithImage(history, userMessage, imageData) {
  const client = getClient();
  const candidateModels = cachedWorkingModel
    ? [cachedWorkingModel, ...getCandidateModels().filter((m) => m !== cachedWorkingModel)]
    : getCandidateModels();

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Study Buddy] Attempting multimodal model: ${modelName}`);
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const chatSession = model.startChat({ history: history || [] });
      const imagePart = {
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data,
        },
      };

      const result = await chatSession.sendMessage([userMessage || 'Explain this image.', imagePart]);
      const reply = result.response.text();
      cachedWorkingModel = modelName;
      console.log(`[AI Study Buddy] Multimodal success with model: ${modelName}`);
      return reply;
    } catch (err) {
      console.warn(`[AI Study Buddy] Multimodal model '${modelName}' failed:`, err.message);
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

  throw lastError || new Error('No available multimodal AI model found.');
}

module.exports = { chat, chatWithImage };

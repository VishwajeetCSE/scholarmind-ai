const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

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

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

function getModelName() {
  return process.env.GEMMA_MODEL || 'gemma-3-27b-it';
}

/**
 * Send a text chat message with conversation history.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history
 * @param {string} userMessage
 * @returns {Promise<string>} AI response text
 */
async function chat(history, userMessage) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: getModelName(),
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({
    history: history || [],
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}

/**
 * Send a message with an image attachment (multimodal).
 * @param {Array} history
 * @param {string} userMessage
 * @param {Object} imageData  { mimeType: string, data: string (base64) }
 * @returns {Promise<string>}
 */
async function chatWithImage(history, userMessage, imageData) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: getModelName(),
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({
    history: history || [],
  });

  const imagePart = {
    inlineData: {
      mimeType: imageData.mimeType,
      data: imageData.data,
    },
  };

  const result = await chat.sendMessage([userMessage || 'Explain this image.', imagePart]);
  const response = result.response;
  return response.text();
}

module.exports = { chat, chatWithImage };

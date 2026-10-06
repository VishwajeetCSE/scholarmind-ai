const express = require('express');
const multer = require('multer');
const { chat, chatWithImage } = require('../services/gemmaService');

const router = express.Router();

// Multer for image uploads (memory storage, max 5 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  },
});

/**
 * POST /api/chat
 * Body: { message: string, history: Array }
 */
router.post('/', async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    }

    if (message.length > 10000) {
      return res.status(400).json({ error: 'Message is too long. Please keep it under 10,000 characters.' });
    }

    const reply = await chat(history || [], message.trim());
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/chat/image
 * Multipart: image file + message (text field) + history (JSON string field)
 */
router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'An image file is required.' });
    }

    const message = req.body.message || 'Explain this image.';
    let history = [];
    if (req.body.history) {
      try {
        history = JSON.parse(req.body.history);
      } catch {
        // ignore malformed history
      }
    }

    const imageData = {
      mimeType: req.file.mimetype,
      data: req.file.buffer.toString('base64'),
    };

    const reply = await chatWithImage(history, message, imageData);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/chat/debug
 * Diagnostic endpoint to check API key presence and list models returned by Google.
 */
router.get('/debug', async (req, res) => {
  const { getApiKey, discoverAvailableModels } = require('../services/gemmaService');
  const key = getApiKey();

  if (!key) {
    return res.status(503).json({
      status: 'error',
      message: 'GEMINI_API_KEY environment variable is NOT set on Vercel.',
      hint: 'Go to Vercel -> Project Settings -> Environment Variables and add GEMINI_API_KEY.',
    });
  }

  const maskedKey = `${key.slice(0, 6)}...${key.slice(-4)} (length: ${key.length})`;

  try {
    const models = await discoverAvailableModels(key);
    res.json({
      status: 'ok',
      apiKeyDetected: maskedKey,
      availableModelsCount: models.length,
      availableModels: models,
      recommendation: models.length > 0 ? `Ready to use! Active model: ${models[0]}` : 'No models returned by Google for this key.',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      apiKeyDetected: maskedKey,
      googleApiError: err.message,
      hint: 'Please check your API key in Google AI Studio to make sure it is active.',
    });
  }
});

module.exports = router;

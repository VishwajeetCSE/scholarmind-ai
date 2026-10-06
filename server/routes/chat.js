const express = require('express');
const multer = require('multer');
const { chat, chatWithFile } = require('../services/gemmaService');

const router = express.Router();

// Multer for file uploads (memory storage, max 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'application/pdf',
      'text/plain',
      'text/markdown',
      'text/csv',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|txt|md|csv|png|jpg|jpeg|webp)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Supported file types: Images (PNG, JPG, WEBP, GIF) and Documents (PDF, TXT, MD).'));
    }
  },
});

/**
 * POST /api/chat
 * Body: { message: string, history: Array, file?: { data: string, mimeType: string, name?: string } }
 */
router.post('/', async (req, res, next) => {
  try {
    const { message, history, file, image } = req.body;
    const attachedFile = file || image;

    // If an image or document is attached via JSON body
    if (attachedFile && attachedFile.data) {
      const reply = await chatWithFile(history || [], message || '', attachedFile);
      return res.json({ reply });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    }

    if (message.length > 25000) {
      return res.status(400).json({ error: 'Message is too long. Please keep it under 25,000 characters.' });
    }

    const reply = await chat(history || [], message.trim());
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/chat/file and POST /api/chat/image
 * Multipart upload for documents and images
 */
const handleMultipartUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'A file (image or document) is required.' });
    }

    const message = req.body.message || '';
    let history = [];
    if (req.body.history) {
      try {
        history = JSON.parse(req.body.history);
      } catch {
        // ignore malformed history
      }
    }

    const fileData = {
      mimeType: req.file.mimetype || 'application/pdf',
      data: req.file.buffer.toString('base64'),
      name: req.file.originalname,
    };

    const reply = await chatWithFile(history, message, fileData);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
};

router.post('/file', upload.single('file'), handleMultipartUpload);
router.post('/image', upload.single('image'), handleMultipartUpload);

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

/**
 * Global error handler middleware.
 * Catches errors thrown by route handlers and returns a safe JSON response.
 */
function errorHandler(err, req, res, _next) {
  // Log the error server-side (never log API keys)
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  // Determine status code
  let status = err.status || 500;
  let message = 'Something went wrong while contacting the AI. Please try again.';

  if (/api[ _-]?key/i.test(err.message)) {
    status = 503;
    message = 'AI service is not configured. Please add GEMINI_API_KEY to your .env file.';
  } else if (err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('429')) {
    status = 429;
    message = 'Too many requests. Please wait a moment and try again.';
  } else if (err.message?.includes('INVALID_ARGUMENT')) {
    status = 400;
    message = 'The request was invalid. Please try rephrasing your question.';
  } else if (err.message?.includes('not found') || err.message?.includes('404')) {
    status = 404;
    message = 'The AI model is not available. Please check the model name in your configuration.';
  } else if (err.message?.includes('Only JPEG')) {
    status = 400;
    message = err.message;
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
